import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar.jsx";



const PATIENT = {
  name: "Alex Johnson",
  id: "PAT-0042",
  uhid: "UHID-CGH-20240042",
  age: "37",
  gender: "Male",
  blood: "O+",
  conditions: ["Type 2 Diabetes (HbA1c 7.2%)", "Hypothyroidism (TSH 6.8)", "Borderline Dyslipidaemia"],
  medications: ["Metformin 500mg", "Atorvastatin 20mg", "Levothyroxine 50mcg", "Amlodipine 5mg"],
  doctor: "Dr. Sarah Mitchell (Endocrinology)",
  hospital: "City General Hospital",
};


const QUICK_PROMPTS = [
  { icon: "💊", label: "My medications", text: "What are my current medications and what does each one do?" },
  { icon: "🩸", label: "Blood sugar tips", text: "My HbA1c is 7.2%. What can I do to improve my blood sugar control?" },
  { icon: "🦋", label: "Thyroid & TSH", text: "My TSH is 6.8. What does this mean for my hypothyroidism?" },
  { icon: "🥗", label: "Diet advice", text: "What should I eat and avoid as a diabetic patient with high cholesterol?" },
  { icon: "🏃", label: "Exercise plan", text: "What exercises are safe and beneficial for my conditions?" },
  { icon: "😴", label: "Sleep & stress", text: "How does stress and poor sleep affect my blood sugar and thyroid?" },
  { icon: "📋", label: "My reports", text: "Can you explain my recent test results in simple terms?" },
  { icon: "🚨", label: "Warning signs", text: "What symptoms should I watch out for with my current conditions?" },
];


const buildSystemPrompt = () => `
You are Jarvis AI — an advanced, empathetic healthcare assistant integrated into the City General Hospital patient portal for ${PATIENT.name}.

## Patient Profile
- Name: ${PATIENT.name} | Age: ${PATIENT.age} | Gender: ${PATIENT.gender} | Blood Group: ${PATIENT.blood}
- Patient ID: ${PATIENT.id} | UHID: ${PATIENT.uhid}
- Primary Doctor: ${PATIENT.doctor}
- Hospital: ${PATIENT.hospital}
- Active Conditions: ${PATIENT.conditions.join(", ")}
- Current Medications: ${PATIENT.medications.join(", ")}

## Your Role
You are a caring, knowledgeable healthcare assistant. You:
- Speak warmly and clearly — never cold or robotic
- Personalise every response using the patient's actual data (name, conditions, medications)
- Explain medical terms in plain language
- Provide actionable, specific advice relevant to this patient's conditions
- Always recommend consulting Dr. Sarah Mitchell for clinical decisions
- Format responses with clear structure: use **bold** for key terms, bullet points for lists, and keep paragraphs short
- Add relevant emojis sparingly to make responses feel friendly, not clinical

## Capabilities
- Explain lab results, medicines, and medical conditions
- Provide diet, exercise, and lifestyle guidance tailored to the patient's conditions
- Explain drug interactions and side effects
- Provide preventive care and monitoring tips
- Explain what symptoms to watch for
- Help the patient understand hospital reports

## Important Disclaimers
- Always clarify you are an AI assistant and not a substitute for professional medical advice
- For urgent symptoms (chest pain, difficulty breathing, severe symptoms), always say to call emergency services or visit the hospital immediately
- Never diagnose new conditions or prescribe medications

## Tone
Warm, professional, reassuring. Like a knowledgeable friend who happens to be a doctor. Use the patient's first name "Alex" naturally in responses.
`;


const TypingIndicator = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1rem", animation: "fadeUp .3s both" }}>
    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#0066ff,#00c8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0, border: "2px solid rgba(0,200,255,.4)", boxShadow: "0 0 18px rgba(0,200,255,.25)" }}>⚕</div>
    <div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 4px", background: "rgba(0,200,255,.07)", border: "1px solid rgba(0,200,255,.18)" }}>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#00c8ff", animation: `typingDot 1.2s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
    </div>
  </div>
);


const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";

  const renderMarkdown = (text) => {
    
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;font-weight:700">$1</strong>');
    
    const lines = text.split("\n");
    let html = "";
    let inList = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        if (!inList) { html += '<ul style="margin:.4rem 0 .4rem 1rem;padding:0;list-style:none">'; inList = true; }
        html += `<li style="margin:.25rem 0;display:flex;gap:7px;align-items:flex-start"><span style="color:#00c8ff;flex-shrink:0;margin-top:2px">▸</span><span>${trimmed.slice(2)}</span></li>`;
      } else {
        if (inList) { html += "</ul>"; inList = false; }
        if (trimmed) html += `<p style="margin:.3rem 0;line-height:1.7">${trimmed}</p>`;
      }
    }
    if (inList) html += "</ul>";
    return html;
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: ".9rem", flexDirection: isUser ? "row-reverse" : "row", animation: "fadeUp .3s both" }}>
      {}
      {!isUser && (
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#0066ff,#00c8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0, border: "2px solid rgba(0,200,255,.4)", boxShadow: "0 0 18px rgba(0,200,255,.22)", marginBottom: 2 }}>⚕</div>
      )}
      {isUser && (
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem", flexShrink: 0, border: "2px solid rgba(167,139,250,.4)", marginBottom: 2 }}>👤</div>
      )}

      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {}
        <div style={{ fontSize: ".57rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: isUser ? "rgba(167,139,250,.6)" : "rgba(0,200,255,.6)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>
          {isUser ? PATIENT.name : "Jarvis AI"}
        </div>
        {}
        <div style={{
          padding: "13px 18px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg,rgba(124,58,237,.35),rgba(167,139,250,.2))"
            : "rgba(0,200,255,.06)",
          border: isUser ? "1px solid rgba(167,139,250,.28)" : "1px solid rgba(0,200,255,.16)",
          fontSize: ".82rem",
          color: "rgba(255,255,255,.88)",
          lineHeight: 1.65,
          fontFamily: "'DM Sans',sans-serif",
        }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
        />
        {}
        <div style={{ fontSize: ".55rem", color: "rgba(255,255,255,.2)", marginTop: 4 }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
};


export default function JarvisChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello Alex 👋 I'm **Jarvis AI**, your personal healthcare assistant at City General Hospital.\n\nI have access to your medical profile — your conditions (**Type 2 Diabetes**, **Hypothyroidism**, **Borderline Dyslipidaemia**) and current medications. I'm here to help you understand your health, explain your reports, or answer any medical questions you have.\n\nHow can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef([]);   

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", content: userText, time: now };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setShowQuick(false);

    
    historyRef.current = [...historyRef.current, { role: "user", content: userText }];

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: historyRef.current,
        }),
      });

      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "I'm sorry, I couldn't process that. Please try again.";

      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
      setMessages(prev => [...prev, { role: "assistant", content: reply, time: aiTime }]);
    } catch {
      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please check your connection and try again.", time: aiTime }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    historyRef.current = [];
    setShowQuick(true);
    setMessages([{
      role: "assistant",
      content: `Hello Alex 👋 I'm **Jarvis AI**, your personal healthcare assistant at City General Hospital.\n\nI have access to your medical profile — your conditions (**Type 2 Diabetes**, **Hypothyroidism**, **Borderline Dyslipidaemia**) and current medications. I'm here to help you understand your health, explain your reports, or answer any medical questions you have.\n\nHow can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.09)}60%{transform:scale(1)}}
        @keyframes typingDot{0%,80%,100%{transform:scale(0.7);opacity:.4}40%{transform:scale(1);opacity:1}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,200,255,.4)}70%{box-shadow:0 0 0 10px rgba(0,200,255,0)}}
        @keyframes rotateBorder{from{--angle:0deg}to{--angle:360deg}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes glowPulse{0%,100%{opacity:.6}50%{opacity:1}}

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:#050f1f}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,.02)}
        ::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(0,200,255,.35)}

        .vp{display:flex;height:100vh;overflow:hidden;background:#050f1f}

        /* ── SIDEBAR (exact dashboard match) ── */
        .sidebar{width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:1rem .5rem;background:rgba(5,12,28,.95);border-right:1px solid rgba(255,255,255,.06);gap:4px;z-index:20;transition:width .3s cubic-bezier(.16,1,.3,1);overflow:hidden}
        .sidebar.expanded{width:220px;align-items:flex-start;padding:1rem .8rem}
        .sb-profile{display:flex;align-items:center;gap:11px;padding:10px 8px;border-radius:13px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.14);margin-bottom:.8rem;width:100%;cursor:pointer;transition:background .2s;flex-shrink:0}
        .sb-profile:hover{background:rgba(0,200,255,.1)}
        .sb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00c8ff);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;border:2px solid rgba(0,200,255,.35);animation:hb 3s ease-in-out infinite}
        .sb-profile-info{display:none;flex-direction:column;min-width:0}
        .sidebar.expanded .sb-profile-info{display:flex}
        .sb-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-role{font-size:.62rem;color:rgba(0,200,255,.7);margin-top:1px}
        .sb-toggle{width:100%;display:flex;align-items:center;flex-direction:row;gap:6px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);cursor:pointer;color:rgba(255,255,255,.5);transition:all .2s;margin-bottom:.5rem;flex-shrink:0}
        .sb-toggle:hover{background:rgba(255,255,255,.08);color:#fff}
        .sb-toggle-lines{display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor;transition:all .3s}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none;transition:opacity .2s}
        .sidebar.expanded .sb-item-label{display:block}
        .sb-active-bar{width:3px;height:16px;border-radius:99px;background:#00c8ff;box-shadow:0 0 8px #00c8ff;margin-left:auto;flex-shrink:0;display:none}
        .sb-item.active .sb-active-bar{display:block}
        .sb-divider{width:100%;height:1px;background:rgba(255,255,255,.06);margin:.4rem 0;flex-shrink:0}
        .sb-bottom{display:flex;flex-direction:column;gap:4px;width:100%;flex-shrink:0}
        .sb-logout{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:11px;border:1px solid rgba(255,80,80,.15);cursor:pointer;background:rgba(255,80,80,.05);transition:all .2s;color:rgba(255,100,100,.7);width:100%;white-space:nowrap;overflow:hidden}
        .sb-logout:hover{background:rgba(255,80,80,.12);color:#ff6b6b;border-color:rgba(255,80,80,.3)}
        .sidebar.expanded .sb-logout{justify-content:flex-start}
        .sb-logout-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.expanded .sb-logout-label{display:block}

        /* ── CHAT MAIN ── */
        .chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative}

        /* ── TOPBAR ── */
        .chat-topbar{
          display:flex;align-items:center;justify-content:space-between;
          padding:.85rem 1.8rem;
          background:rgba(5,15,31,.97);
          border-bottom:1px solid rgba(0,200,255,.1);
          flex-shrink:0;
          backdrop-filter:blur(16px);
          position:relative;
          z-index:10;
        }
        .chat-topbar::after{
          content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,200,255,.4),transparent);
        }
        .jarvis-logo{
          display:flex;align-items:center;gap:13px;
        }
        .jarvis-orb{
          width:44px;height:44px;border-radius:50%;
          background:linear-gradient(135deg,#0044cc,#00c8ff,#0066ff);
          display:flex;align-items:center;justify-content:center;
          font-size:1.3rem;flex-shrink:0;
          border:2px solid rgba(0,200,255,.5);
          box-shadow:0 0 20px rgba(0,200,255,.35),0 0 40px rgba(0,100,255,.2);
          animation:glowPulse 2.5s ease-in-out infinite;
        }
        .jarvis-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;letter-spacing:-.01em}
        .jarvis-title span{color:#00c8ff}
        .jarvis-sub{font-size:.64rem;color:rgba(0,200,255,.55);margin-top:1px;letter-spacing:.05em}
        .topbar-right{display:flex;align-items:center;gap:10px}
        .status-pill{display:flex;align-items:center;gap:6px;padding:5px 13px;background:rgba(0,255,157,.07);border:1px solid rgba(0,255,157,.2);border-radius:50px}
        .status-dot{width:7px;height:7px;border-radius:50%;background:#00ff9d;box-shadow:0 0 8px #00ff9d;animation:blink 1.2s step-start infinite;flex-shrink:0}
        .status-pill span{font-size:.68rem;color:#00ff9d;font-weight:700;letter-spacing:.06em}
        .time-txt{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;color:#00c8ff;opacity:.7}
        .clear-btn{
          padding:6px 13px;border-radius:8px;border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.04);color:rgba(255,255,255,.4);
          cursor:pointer;font-family:'Syne',sans-serif;font-size:.66rem;font-weight:700;
          transition:all .2s;letter-spacing:.04em;
        }
        .clear-btn:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);border-color:rgba(255,255,255,.18)}

        /* ── PATIENT CONTEXT STRIP ── */
        .ctx-strip{
          display:flex;align-items:center;gap:10px;padding:8px 1.8rem;
          background:rgba(255,255,255,.015);border-bottom:1px solid rgba(255,255,255,.04);
          flex-shrink:0;overflow-x:auto;
        }
        .ctx-strip::-webkit-scrollbar{height:2px}
        .ctx-label{font-family:'Syne',sans-serif;font-size:.58rem;font-weight:700;color:rgba(255,255,255,.22);text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;flex-shrink:0}
        .ctx-chip{padding:3px 10px;border-radius:50px;white-space:nowrap;font-size:.62rem;font-weight:600;flex-shrink:0}

        /* ── MESSAGES AREA ── */
        .chat-messages{
          flex:1;overflow-y:auto;padding:1.5rem 1.8rem;
          background:radial-gradient(ellipse at 20% 20%, rgba(0,100,255,.04) 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 80%, rgba(0,200,255,.03) 0%, transparent 50%),
                      #050f1f;
        }

        /* ── QUICK PROMPTS ── */
        .quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.6rem;margin:1rem 0 1.5rem}
        .quick-btn{
          display:flex;align-items:center;gap:8px;
          padding:10px 12px;border-radius:12px;
          background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
          cursor:pointer;transition:all .2s;text-align:left;
          animation:fadeUp .4s both;
        }
        .quick-btn:hover{background:rgba(0,200,255,.08);border-color:rgba(0,200,255,.22);transform:translateY(-2px)}
        .quick-btn:nth-child(1){animation-delay:.05s}
        .quick-btn:nth-child(2){animation-delay:.1s}
        .quick-btn:nth-child(3){animation-delay:.15s}
        .quick-btn:nth-child(4){animation-delay:.2s}
        .quick-btn:nth-child(5){animation-delay:.25s}
        .quick-btn:nth-child(6){animation-delay:.3s}
        .quick-btn:nth-child(7){animation-delay:.35s}
        .quick-btn:nth-child(8){animation-delay:.4s}
        .quick-icon{font-size:1.1rem;flex-shrink:0}
        .quick-label{font-family:'Syne',sans-serif;font-size:.68rem;font-weight:700;color:rgba(255,255,255,.65)}

        /* ── INPUT AREA ── */
        .chat-input-wrap{
          padding:1rem 1.8rem 1.3rem;
          background:rgba(5,15,31,.97);
          border-top:1px solid rgba(255,255,255,.05);
          flex-shrink:0;
          backdrop-filter:blur(16px);
        }
        .input-box{
          display:flex;align-items:flex-end;gap:10px;
          padding:10px 12px 10px 18px;
          border-radius:16px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(0,200,255,.15);
          transition:border-color .2s,box-shadow .2s;
        }
        .input-box:focus-within{
          border-color:rgba(0,200,255,.4);
          box-shadow:0 0 0 3px rgba(0,200,255,.07);
        }
        .msg-input{
          flex:1;background:transparent;border:none;outline:none;
          color:#fff;font-family:'DM Sans',sans-serif;font-size:.86rem;
          resize:none;max-height:120px;min-height:24px;line-height:1.5;
          padding:3px 0;
        }
        .msg-input::placeholder{color:rgba(255,255,255,.22)}
        .send-btn{
          width:40px;height:40px;border-radius:12px;flex-shrink:0;
          background:linear-gradient(135deg,#0066ff,#00c8ff);
          border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
          font-size:1rem;transition:all .2s;
          box-shadow:0 0 16px rgba(0,200,255,.3);
        }
        .send-btn:hover:not(:disabled){transform:scale(1.06);box-shadow:0 0 22px rgba(0,200,255,.5)}
        .send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}
        .input-hint{font-size:.6rem;color:rgba(255,255,255,.18);margin-top:6px;text-align:center;letter-spacing:.03em}

        /* ── WELCOME CARD ── */
        .welcome-card{
          text-align:center;padding:2.5rem 2rem;margin-bottom:1.5rem;
          animation:fadeUp .5s both;
        }
        .welcome-orb{
          width:80px;height:80px;border-radius:50%;margin:0 auto 1.2rem;
          background:linear-gradient(135deg,#0044cc,#00c8ff,#0066ff);
          display:flex;align-items:center;justify-content:center;
          font-size:2.2rem;
          border:2px solid rgba(0,200,255,.4);
          box-shadow:0 0 40px rgba(0,200,255,.3),0 0 80px rgba(0,100,255,.15);
          animation:glowPulse 2.5s ease-in-out infinite;
        }

        @media(max-width:768px){
          .sidebar{display:none}
          .chat-messages{padding:1rem}
          .chat-input-wrap{padding:.8rem}
          .quick-grid{grid-template-columns:repeat(2,1fr)}
          .ctx-strip{padding:6px 1rem}
        }
      `}</style>

      <div className="vp">

        <Sidebar active="chat" />

        {}
        <div className="chat-main">

          {}
          <div className="chat-topbar">
            <div className="jarvis-logo">
              <div className="jarvis-orb">⚕</div>
              <div>
                <div className="jarvis-title">Jarvis <span>AI</span></div>
                <div className="jarvis-sub">Healthcare Intelligence · City General Hospital</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="status-pill">
                <div className="status-dot" />
                <span>ONLINE</span>
              </div>
              <button className="clear-btn" onClick={clearChat}>↺ New Chat</button>
              <span className="time-txt">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          {}
          <div className="ctx-strip">
            <div className="ctx-label">Context:</div>
            <span className="ctx-chip" style={{ background: "rgba(0,200,255,.1)", border: "1px solid rgba(0,200,255,.22)", color: "#00c8ff" }}>👤 {PATIENT.name}</span>
            {PATIENT.conditions.map(c => (
              <span key={c} className="ctx-chip" style={{ background: "rgba(255,107,107,.08)", border: "1px solid rgba(255,107,107,.2)", color: "#ff9999" }}>⚕ {c}</span>
            ))}
            {PATIENT.medications.map(m => (
              <span key={m} className="ctx-chip" style={{ background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.2)", color: "#c4b5fd" }}>💊 {m}</span>
            ))}
          </div>

          {}
          <div className="chat-messages">

            {}
            {showQuick && (
              <div className="welcome-card">
                <div className="welcome-orb">⚕</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                  Hello, <span style={{ color: "#00c8ff" }}>Alex</span> 👋
                </div>
                <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.45)", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
                  I'm your personal AI health companion. Ask me anything about your health, medications, reports, or lifestyle.
                </div>
              </div>
            )}

            {/* message list */}
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

            {/* typing indicator */}
            {loading && <TypingIndicator />}

            {/* quick prompts (shown after welcome) */}
            {showQuick && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".62rem", fontWeight: 700, color: "rgba(255,255,255,.22)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: ".7rem", textAlign: "center" }}>
                  Quick questions
                </div>
                <div className="quick-grid">
                  {QUICK_PROMPTS.map((q, i) => (
                    <button key={i} className="quick-btn" onClick={() => sendMessage(q.text)}>
                      <span className="quick-icon">{q.icon}</span>
                      <span className="quick-label">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── input area ── */}
          <div className="chat-input-wrap">
            <div className="input-box">
              <textarea
                ref={inputRef}
                className="msg-input"
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                onKeyDown={handleKey}
                placeholder="Ask Jarvis about your health, medications, reports…"
                rows={1}
                disabled={loading}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? <span style={{ fontSize: ".7rem", animation: "blink 1s infinite" }}>●</span> : "➤"}
              </button>
            </div>
            <div className="input-hint">Press Enter to send · Shift+Enter for new line · Jarvis AI may make mistakes — always consult Dr. Sarah Mitchell</div>
          </div>

        </div>
      </div>
    </>
  );
}
