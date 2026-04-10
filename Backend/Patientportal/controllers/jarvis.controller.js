// controllers/jarvis.controller.js
// ─────────────────────────────────────────────────────────────────────────────
// Jarvis AI Health Chatbot — uses Hugging Face Inference API
// Model: HuggingFaceH4/zephyr-7b-beta  (free, no billing required)
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "../config/firebase.admin.js";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const HF_API_URL =
  "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
//  ↑ swap to any other HF model ID you prefer, e.g.
//    "mistralai/Mistral-7B-Instruct-v0.2"
//    "meta-llama/Meta-Llama-3-8B-Instruct"  (needs approval)
const HF_TOKEN   = process.env.HF_TOKEN;  // set in .env  → HF_TOKEN=hf_xxxxx

// ── BUILD SYSTEM PROMPT from patient's Firestore data ────────────────────────
const buildSystemPrompt = (patient) => `
You are Jarvis AI — an advanced, empathetic healthcare assistant integrated into
the ${patient.hospital || "City General Hospital"} patient portal for ${patient.name}.

## Patient Profile
- Name: ${patient.name} | Age: ${patient.age || "N/A"} | Gender: ${patient.gender || "N/A"} | Blood: ${patient.blood || "N/A"}
- Patient ID: ${patient.patientId || "N/A"}
- Primary Doctor: ${patient.doctor || "N/A"}
- Active Conditions: ${(patient.conditions || []).join(", ") || "None listed"}
- Current Medications: ${(patient.medications || []).join(", ") || "None listed"}

## Your Role
You are a caring, knowledgeable healthcare assistant. You:
- Speak warmly — never cold or robotic
- Personalise every response using this patient's data
- Explain medical terms in plain language
- Provide actionable advice relevant to the patient's conditions
- Always recommend consulting the assigned doctor for clinical decisions
- Format responses clearly with bullet points for lists and short paragraphs
- Never diagnose new conditions or prescribe medications
- For emergencies (chest pain, difficulty breathing) say: call emergency services immediately

## Tone
Warm, professional, reassuring. Use the patient's first name naturally in responses.
`.trim();

// ── FORMAT MESSAGES → Zephyr chat template ───────────────────────────────────
// Zephyr / Mistral instruct models use:
//   <|system|>\n{system}<|endoftext|>\n<|user|>\n{msg}<|endoftext|>\n<|assistant|>
const formatPrompt = (systemPrompt, history, userMessage) => {
  let prompt = `<|system|>\n${systemPrompt}<|endoftext|>\n`;

  for (const msg of history) {
    if (msg.role === "user") {
      prompt += `<|user|>\n${msg.content}<|endoftext|>\n<|assistant|>\n`;
    } else if (msg.role === "assistant") {
      prompt += `${msg.content}<|endoftext|>\n`;
    }
  }

  // current user message
  prompt += `<|user|>\n${userMessage}<|endoftext|>\n<|assistant|>\n`;
  return prompt;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/jarvis/chat
// Body: { message: string, history: [{role, content}] }
// ─────────────────────────────────────────────────────────────────────────────
export const jarvisChat = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    // 1. Fetch patient profile from Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: "Patient profile not found" });
    }
    const patient = userDoc.data();

    // 2. Build prompt
    const systemPrompt = buildSystemPrompt(patient);
    const prompt       = formatPrompt(systemPrompt, history, message.trim());

    // 3. Call Hugging Face Inference API
    const hfRes = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens:    512,
          temperature:       0.7,
          top_p:             0.9,
          repetition_penalty: 1.1,
          do_sample:         true,
          return_full_text:  false,   // ← return only the new tokens
        },
        options: {
          wait_for_model: true,        // waits if model is loading (cold start)
        },
      }),
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error("❌ HF API error:", errText);
      return res.status(502).json({
        success: false,
        error: "AI service temporarily unavailable. Please try again.",
      });
    }

    const hfData = await hfRes.json();

    // HF returns [{generated_text: "..."}]
    let reply =
      hfData?.[0]?.generated_text ||
      hfData?.generated_text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    // Strip any stray template tokens that leaked through
    reply = reply
      .replace(/<\|.*?\|>/g, "")
      .replace(/<\|endoftext\|>/g, "")
      .trim();

    // 4. (Optional) Save the conversation turn to Firestore for history
    await db
      .collection("users").doc(uid)
      .collection("jarvis_chat")
      .add({
        userMessage: message.trim(),
        aiReply:     reply,
        createdAt:   new Date().toISOString(),
      });

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("❌ Jarvis chat error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/jarvis/history
// Returns last 30 messages for this patient (optional — for session restore)
// ─────────────────────────────────────────────────────────────────────────────
export const getChatHistory = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("jarvis_chat")
      .orderBy("createdAt", "desc")
      .limit(30)
      .get();

    const history = snap.docs
      .map(d => d.data())
      .reverse()                    // oldest first
      .flatMap(d => [
        { role: "user",      content: d.userMessage },
        { role: "assistant", content: d.aiReply },
      ]);

    return res.status(200).json({ success: true, history });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/jarvis/history
// Clears all chat history for this patient
// ─────────────────────────────────────────────────────────────────────────────
export const clearChatHistory = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("jarvis_chat")
      .get();

    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    return res.status(200).json({ success: true, message: "Chat history cleared" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
