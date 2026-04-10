// controllers/medication.controller.js
import { db } from "../config/firebase.admin.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/medication/bills
// Returns all medicine bills for the patient
// Matches: BILLS array in medication.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const getBills = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("prescriptions")
      .orderBy("createdAt", "desc")
      .get();

    const bills = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Calculate summary stats
    const totalBills   = bills.length;
    const paidBills    = bills.filter(b => b.status === "Paid");
    const pendingBills = bills.filter(b => b.status === "Pending");

    const totalSpent   = paidBills.reduce((s, b) => s + (b.totalAmount || 0), 0);
    const totalPending = pendingBills.reduce((s, b) => s + (b.totalAmount || 0), 0);
    const grandTotal   = bills.reduce((s, b) => s + (b.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      data: bills,
      summary: {
        totalBills,
        paidCount:    paidBills.length,
        pendingCount: pendingBills.length,
        totalSpent,
        totalPending,
        grandTotal,
      },
    });
  } catch (err) {
    console.error("❌ Get bills error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/medication/bills/:id
// Returns a single bill by ID
// Matches: ViewModal → bill details
// ─────────────────────────────────────────────────────────────────────────────
export const getBillById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    const doc = await db
      .collection("users").doc(uid)
      .collection("prescriptions").doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "Bill not found" });
    }

    return res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/medication/bills/add
// Doctor adds a new prescription/bill for patient
// ─────────────────────────────────────────────────────────────────────────────
export const addBill = async (req, res) => {
  try {
    const uid = req.user.uid;
    const {
      billNo, billDate, doctor, department,
      status, paidOn, payMode, items, color,
    } = req.body;

    if (!billNo || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Bill number and items are required" });
    }

    // Calculate total from items
    const subtotal    = items.reduce((s, i) => s + (i.qty * i.unitPrice), 0);
    const tax         = subtotal * 0.05;
    const totalAmount = subtotal + tax;

    const newBill = {
      billNo,
      billDate:    billDate || new Date().toISOString(),
      doctor:      doctor || "",
      department:  department || "",
      status:      status || "Pending",
      paidOn:      paidOn || null,
      payMode:     payMode || null,
      items,
      subtotal,
      tax,
      totalAmount,
      color:       color || "#00c8ff",
      createdAt:   new Date().toISOString(),
      patientId:   uid,
    };

    const ref = await db
      .collection("users").doc(uid)
      .collection("prescriptions")
      .add(newBill);

    return res.status(201).json({
      success: true,
      message: "Bill added successfully",
      id: ref.id,
      data: newBill,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/medication/bills/:id/pay
// Marks a pending bill as paid
// Matches: status "Pending" → "Paid"
// ─────────────────────────────────────────────────────────────────────────────
export const markBillPaid = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const { payMode } = req.body;

    await db
      .collection("users").doc(uid)
      .collection("prescriptions").doc(id)
      .update({
        status:  "Paid",
        paidOn:  new Date().toISOString(),
        payMode: payMode || "UPI",
      });

    return res.status(200).json({ success: true, message: "Bill marked as paid" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/medication/hospital
// Returns hospital info (HOSPITAL constant in medication.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const getHospitalInfo = async (req, res) => {
  try {
    const uid = req.user.uid;

    // Fetch from user's assigned doctor → hospital info
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    let hospital = null;
    if (userData?.assignedDoctorId) {
      const drDoc = await db.collection("users").doc(userData.assignedDoctorId).get();
      if (drDoc.exists) {
        hospital = {
          name:    drDoc.data().hospitalName  || "City General Hospital",
          address: drDoc.data().hospitalAddress || "",
          phone:   drDoc.data().phone          || "",
          email:   drDoc.data().email          || "",
          gstin:   drDoc.data().gstin          || "",
          regNo:   drDoc.data().regNo          || "",
        };
      }
    }

    // Return default hospital if not found
    if (!hospital) {
      hospital = {
        name:    "City General Hospital",
        address: "14, MG Road, New Delhi – 110001",
        phone:   "+91 11-2345-6789",
        email:   "pharmacy@citygeneralhospital.in",
        gstin:   "07AAACG1234F1ZK",
        regNo:   "CGH-DL-2004-0041",
      };
    }

    return res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/medication/ai-explain
// Uses Hugging Face to explain a medicine to the patient
// Matches: fetchAI() in ViewModal of medication.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const explainMedicine = async (req, res) => {
  try {
    const { name, dosage, form, purpose } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Medicine name is required" });
    }

    const axios   = await import("axios");
    const prompt  = `You are a friendly hospital pharmacist. Explain this medicine to a patient in simple language.
Medicine: ${name}, Dosage: ${dosage}, Form: ${form}, Prescribed for: ${purpose}.
Respond ONLY with valid JSON:
{"purpose":"2-3 sentence explanation","dosageGuide":"how and when to take it","tips":["tip1","tip2","tip3"],"warning":"one key safety warning"}`;

    const response = await axios.default.post(
      `https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.2"}`,
      {
        inputs: `[INST] ${prompt} [/INST]`,
        parameters: { max_new_tokens: 400, temperature: 0.4, return_full_text: false },
      },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );

    const text   = response.data?.[0]?.generated_text?.trim() || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    return res.status(200).json({ success: true, data: parsed });
  } catch (err) {
    // Return fallback if AI fails
    return res.status(200).json({
      success: true,
      data: {
        purpose:      `${req.body.name} is prescribed for ${req.body.purpose}.`,
        dosageGuide:  `Take ${req.body.dosage} as directed by your doctor.`,
        tips:         ["Take at the same time each day", "Do not skip doses", "Store in a cool dry place"],
        warning:      "Consult your doctor if you experience any side effects.",
      },
    });
  }
};
