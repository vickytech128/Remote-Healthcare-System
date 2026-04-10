import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const C = {
  bg:      "#070410",
  sidebar: "rgba(6,3,15,.97)",
  accent:  "#9333ea",
  ring:    "#a855f7",
  glow:    "#c084fc",
  indigo:  "#818cf8",
  green:   "#34d399",
  amber:   "#fbbf24",
  red:     "#f87171",
  pink:    "#f472b6",
  border:  "rgba(168,85,247,.12)",
  card:    "rgba(255,255,255,.03)",
  faint:   "rgba(255,255,255,.05)",
};


const DOCTOR = {
  name: "Dr. Sarah Mitchell",
  initials: "SM",
  specialty: "Endocrinology",
  hospital: "City General Hospital",
};


const QUICK_PROMPTS = [
  { icon: "🔬", label: "Analyze Labs", text: "How should I interpret a fasting insulin of 48 µU/mL in a PCOD patient?" },
  { icon: "💊", label: "Drug Interactions", text: "Are there any major interactions between Metformin and the newer SGLT2 inhibitors?" },
  { icon: "📋", label: "Clinical Guidelines", text: "What are the latest ADA guidelines for HbA1c targets in elderly diabetic patients?" },
  { icon: "🦋", label: "Thyroid Protocol", text: "Provide a titration schedule for Levothyroxine in a patient with subclinical hypothyroidism." },
  { icon: "🩺", label: "Differential Diagnosis", text: "What are the secondary causes of hypertension I should screen for in a 25-year-old?" },
  { icon: "🥗", label: "Patient Diet", text: "What specific dietary restrictions should I recommend for a patient with diabetic nephropathy?" },
  { icon: "📉", label: "Treatment Insights", text: "Compare the efficacy of GLP-1 agonists vs DPP-4 inhibitors for weight loss." },
  { icon: "🧪", label: "Marker Review", text: "Explain the clinical significance of elevated TPO antibodies with normal TSH." },
];


const buildSystemPrompt = () => `
You are Jarvis Clinical AI — a highly advanced, medical intelligence assistant designed specifically for Dr. Sarah Mitchell, an Endocrinologist at City General Hospital.

## Your Focus
You provide high-level clinical decision support, medical research synthesis, and administrative assistance tailored for a specialist doctor.

## Principles
- Be precise, technical, and data-driven. Use medical terminology correctly.
- Be concise. A doctor's time is valuable.
- Quote clinical guidelines (ADA, AACE, etc.) where relevant.
- Address the user as "Dr. Mitchell" or "Doctor" naturally.
- Format responses with structured headings, **bold** key insights, and focused bullet points.
- Stay objective and professional.

## Tone
Hyper-intelligent, efficient, and professional.

## Disclaimer
Always include a subtle reminder that your output is for decision support and clinical judgement belongs to the physician.
`;


const TypingIndicator = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1rem", animation: "fadeUp .3s both" }}>
    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.ring})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0, border: `2px solid ${C.ring}60`, boxShadow: `0 0 18px ${C.ring}40` }}>⚕</div>
    <div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 4px", background: `${C.ring}10`, border: `1px solid ${C.ring}30` }}>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.ring, animation: `typingDot 1.2s ease-in-out ${i * 0.18}s infinite` }} />
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
        html += `<li style="margin:.25rem 0;display:flex;gap:7px;align-items:flex-start"><span style="color:${C.ring};flex-shrink:0;margin-top:2px">▸</span><span>${trimmed.slice(2)}</span></li>`;
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
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.ring})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0, border: `2px solid ${C.ring}60`, boxShadow: `0 0 18px ${C.ring}35`, marginBottom: 2 }}>⚕</div>
      )}
      {isUser && (
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem", flexShrink: 0, border: "2px solid rgba(255,255,255,.1)", marginBottom: 2, color: "rgba(255,255,255,.7)" }}>👩‍⚕️</div>
      )}

      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {}
        <div style={{ fontSize: ".57rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: isUser ? "rgba(255,255,255,.3)" : `${C.ring}80`, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>
          {isUser ? DOCTOR.name : "Jarvis Clinical AI"}
        </div>
        {}
        <div style={{
          padding: "13px 18px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "rgba(255,255,255,.04)"
            : `${C.ring}08`,
          border: isUser ? "1px solid rgba(255,255,255,.1)" : `1px solid ${C.ring}25`,
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


const NAV = [
  { key:"dashboard",     icon:"⚕",   label:"Dashboard"      },
  { key:"patients",      icon:"👥",  label:"My Patients"    },
  { key:"appointments",  icon:"📅",  label:"Appointments"   },
  { key:"reports",       icon:"📋",  label:"Reports"        },
  { key:"prescriptions", icon:"💊",  label:"Prescriptions"  },
  { key:"analytics",     icon:"📈",  label:"Analytics"      },
  { key:"messages",      icon:"💬",  label:"Messages"       },
  { key:"chat",          icon:"✨",  label:"AI Chat"        },
  { key:"settings",      icon:"⚙️", label:"Settings"       },
];


import DoctorSidebar from "./DoctorSidebar";

export default function DoctorChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Welcome back, Dr. Mitchell. I'm **Jarvis Clinical AI**, your specialist decision support assistant.\n\nI can help you analyze lab results, review clinical guidelines (ADA/AACE), synthesize drug interaction data, or prepare patient-ready diet plans.\n\nHow can I assist you with your clinical workflow today?`,
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
      const reply = data.content?.map(b => b.text || "").join("") || "I'm sorry, I couldn't process that clinical request. Please try again.";

      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
      setMessages(prev => [...prev, { role: "assistant", content: reply, time: aiTime }]);
    } catch {
      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { role: "assistant", content: "Clinical network connection interrupted. Please verify your portal connectivity.", time: aiTime }]);
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
      content: `Welcome back, Dr. Mitchell. I'm **Jarvis Clinical AI**, your specialist decision support assistant.\n\nI can help you analyze lab results, review clinical guidelines (ADA/AACE), synthesize drug interaction data, or prepare patient-ready diet plans.\n\nHow can I assist you with your clinical workflow today?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes typingDot{0%,80%,100%{transform:scale(0.7);opacity:.4}40%{transform:scale(1);opacity:1}}
        @keyframes glowPulse{0%,100%{opacity:.6}50%{opacity:1}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:${C.bg}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.22);border-radius:99px}
        .dc-vp{display:flex;height:100vh;overflow:hidden;background:${C.bg}}
        .chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative}
        .chat-topbar{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:${C.sidebar};border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(16px);position:relative;z-index:10}
        .chat-topbar::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.ring}40,transparent)}
        .jarvis-logo{display:flex;align-items:center;gap:13px}
        .jarvis-orb{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,${C.accent},${C.ring},${C.glow});display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;border:2px solid ${C.ring}60;box-shadow:0 0 20px ${C.ring}40,0 0 40px ${C.accent}20;animation:glowPulse 2.5s ease-in-out infinite}
        .jarvis-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;letter-spacing:-.01em}.jarvis-title span{color:${C.ring}}
        .jarvis-sub{font-size:.64rem;color:${C.ring}70;margin-top:1px;letter-spacing:.05em}
        .topbar-right{display:flex;align-items:center;gap:10px}
        .status-pill{display:flex;align-items:center;gap:6px;padding:5px 13px;background:rgba(147,51,234,.08);border:1px solid rgba(168,85,247,.2);border-radius:50px}
        .status-dot{width:7px;height:7px;border-radius:50%;background:${C.ring};box-shadow:0 0 8px ${C.ring};animation:blink 1.2s step-start infinite;flex-shrink:0}
        .status-pill span{font-size:.68rem;color:${C.ring};font-weight:700;letter-spacing:.06em}
        .time-txt{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;color:${C.ring};opacity:.7}
        .clear-btn{padding:6px 13px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:rgba(255,255,255,.4);cursor:pointer;font-family:'Syne',sans-serif;font-size:.66rem;font-weight:700;transition:all .2s;letter-spacing:.04em}
        .clear-btn:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7)}
        .ctx-strip{display:flex;align-items:center;gap:10px;padding:8px 1.8rem;background:rgba(255,255,255,.01);border-bottom:1px solid ${C.border};flex-shrink:0;overflow-x:auto}
        .ctx-strip::-webkit-scrollbar{height:2px}.ctx-label{font-family:'Syne',sans-serif;font-size:.58rem;font-weight:700;color:rgba(255,255,255,.2);text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;flex-shrink:0}
        .ctx-chip{padding:3px 10px;border-radius:50px;white-space:nowrap;font-size:.62rem;font-weight:600;flex-shrink:0}
        .chat-messages{flex:1;overflow-y:auto;padding:1.5rem 1.8rem;background:radial-gradient(ellipse at 20% 20%, ${C.ring}05 0%, transparent 50%),radial-gradient(ellipse at 80% 80%, ${C.accent}03 0%, transparent 50%),${C.bg}}
        .quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.6rem;margin:1rem 0 1.5rem}
        .quick-btn{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);cursor:pointer;transition:all .2s;text-align:left;animation:fadeUp .4s both}
        .quick-btn:hover{background:${C.ring}10;border-color:${C.ring}30;transform:translateY(-2px)}
        .quick-icon{font-size:1.1rem;flex-shrink:0}.quick-label{font-family:'Syne',sans-serif;font-size:.68rem;font-weight:700;color:rgba(255,255,255,.6)}
        .chat-input-wrap{padding:1rem 1.8rem 1.3rem;background:${C.sidebar};border-top:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(16px)}
        .input-box{display:flex;align-items:flex-end;gap:10px;padding:12px 14px 12px 18px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid ${C.ring}25;transition:all .2s}
        .input-box:focus-within{border-color:${C.ring}60;box-shadow:0 0 20px ${C.ring}15}
        .msg-input{flex:1;background:transparent;border:none;outline:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:.86rem;resize:none;max-height:120px;min-height:24px;line-height:1.5;padding:3px 0}
        .msg-input::placeholder{color:rgba(255,255,255,.2)}
        .send-btn{width:40px;height:40px;border-radius:12px;flex-shrink:0;background:linear-gradient(135deg,${C.accent},${C.ring});border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;transition:all .2s;box-shadow:0 0 16px ${C.ring}30}
        .send-btn:hover:not(:disabled){transform:scale(1.06);box-shadow:0 0 22px ${C.ring}50}.send-btn:disabled{opacity:.4;cursor:not-allowed}
        .input-hint{font-size:.6rem;color:rgba(255,255,255,.15);margin-top:6px;text-align:center}
        .welcome-card{text-align:center;padding:2.5rem 2rem;margin-bottom:1.5rem;animation:fadeUp .5s both}
        .welcome-orb{width:80px;height:80px;border-radius:50%;margin:0 auto 1.2rem;background:linear-gradient(135deg,${C.accent},${C.ring},${C.glow});display:flex;align-items:center;justify-content:center;font-size:2.2rem;border:2px solid ${C.ring}50;box-shadow:0 0 40px ${C.ring}30,0 0 80px ${C.accent}15;animation:glowPulse 2.5s ease-in-out infinite}
        @media(max-width:768px){.sidebar{display:none}.quick-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <div className="dc-vp">
        
        <DoctorSidebar active="chat" />

        <div className="chat-main">
          
          <div className="chat-topbar">
            <div className="jarvis-logo">
              <div className="jarvis-orb">⚕</div>
              <div>
                <div className="jarvis-title">Clinical <span>AI</span></div>
                <div className="jarvis-sub">Advanced Decision Support · {DOCTOR.hospital}</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="status-pill">
                <div className="status-dot" />
                <span>CLINICAL MODE</span>
              </div>
              <button className="clear-btn" onClick={clearChat}>↺ Reset Workflow</button>
              <span className="time-txt">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          <div className="ctx-strip">
            <div className="ctx-label">Clinical Scope:</div>
            <span className="ctx-chip" style={{ background: `${C.ring}15`, border: `1px solid ${C.ring}30`, color: C.ring }}>👩‍⚕️ {DOCTOR.name}</span>
            <span className="ctx-chip" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)" }}>🏢 {DOCTOR.hospital}</span>
            <span className="ctx-chip" style={{ background: `${C.indigo}15`, border: `1px solid ${C.indigo}30`, color: C.indigo }}>🔬 {DOCTOR.specialty}</span>
          </div>

          <div className="chat-messages">
            {showQuick && (
              <div className="welcome-card">
                <div className="welcome-orb">⚕</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                  Clinical Assistant <span style={{ color: C.ring }}>Ready</span>
                </div>
                <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.4)", maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
                  Synthesizing medical intelligence for Dr. Mitchell. Ask about lab interpretations, guidelines, or treatment optimizations.
                </div>
              </div>
            )}

            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loading && <TypingIndicator />}

            {showQuick && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".62rem", fontWeight: 700, color: "rgba(255,255,255,.2)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: ".7rem", textAlign: "center" }}>
                  Clinical Workflow Shortcuts
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

          <div className="chat-input-wrap">
            <div className="input-box">
              <textarea
                ref={inputRef}
                className="msg-input"
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                onKeyDown={handleKey}
                placeholder="Search clinical data, guidelines, or drug insights…"
                rows={1}
                disabled={loading}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? <span style={{ animation: "blink 1s infinite" }}>●</span> : "➤"}
              </button>
            </div>
            <div className="input-hint">Restricted to Clinical Decision Support · AI output requires Physician Validation</div>
          </div>

        </div>
      </div>
    </>
  );
}
