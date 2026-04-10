import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChats, fetchMessages, sendMessageApi, createChatApi, markChatRead } from "../src/api/messagesApi.js";
import { auth, db, getDoc, doc } from "../src/firebaseConfig.js";


const C = {
  bg:      "#050f1f",
  sidebar: "rgba(5,12,28,.95)",
  accent:  "#0066ff",
  ring:    "#00c8ff",
  glow:    "#00c8ff",
  green:   "#00ff9d",
  amber:   "#fbbf24",
  red:     "#ff6b6b",
  pink:    "#f472b6",
  purple:  "#a78bfa",
  border:  "rgba(255,255,255,.06)",
  card:    "rgba(255,255,255,.03)",
  faint:   "rgba(255,255,255,.05)",
};

const PATIENT = {
  name: "Alex Johnson", initials: "👤", id: "PAT-0042"
};

const NAV = [
  { key: "dashboard", icon: "📊", label: "Dashboard" },
  { key: "vitals",    icon: "❤️", label: "Vitals" },
  { key: "alerts",    icon: "🔔", label: "Alerts" },
  { key: "meds",      icon: "💊", label: "Medications" },
  { key: "reports",   icon: "📋", label: "Reports" },
  { key: "chat",      icon: "💬", label: "AI Chat" },
  { key: "messages",  icon: "✉️", label: "Messages" },
  { key: "settings",  icon: "⚙️", label: "Settings" },
];


const CONVERSATIONS = [
  {
    id: 1, name: "Dr. Priya Sharma", role: "Cardiologist",
    hospital: "Apollo Chennai",
    avatar: "👩‍⚕️", color: C.purple, unread: 1, urgent: false,
    lastMsg: "Your recent ECG looks much better. Keep taking the Metoprolol.",
    lastTime: "10:42 AM",
    messages: [
      { from: "doctor",  text: "Hello Alex. How are you feeling today after starting the new dose of Metoprolol?", time: "9:10 AM", date: "Today" },
      { from: "patient", text: "Good morning Dr. Priya. I'm feeling okay, maybe a little tired in the mornings.", time: "9:15 AM", date: "Today" },
      { from: "doctor",  text: "That mild fatigue is normal for the first week. Is your heart rate staying below 80?", time: "9:28 AM", date: "Today" },
      { from: "patient", text: "Yes, it's mostly been between 68 and 75 bpm according to my tracker.", time: "9:35 AM", date: "Today" },
      { from: "doctor",  text: "Excellent. I reviewed the ECG scan you uploaded yesterday.", time: "10:40 AM", date: "Today" },
      { from: "doctor",  text: "Your recent ECG looks much better. Keep taking the Metoprolol.", time: "10:42 AM", date: "Today" },
    ],
  },
  {
    id: 2, name: "Dr. Rajesh Kumar", role: "General Physician",
    hospital: "City Health Clinic",
    avatar: "👨‍⚕️", color: C.ring, unread: 0, urgent: false,
    lastMsg: "Take paracetamol for the fever and rest for 3 days.",
    lastTime: "Mar 10",
    messages: [
      { from: "patient", text: "Hi Doctor, I've had a mild fever and body ache since yesterday evening.", time: "6:15 PM", date: "Mar 09" },
      { from: "doctor",  text: "What is your temperature currently?", time: "6:20 PM", date: "Mar 09" },
      { from: "patient", text: "It was 100.4°F two hours ago.", time: "6:25 PM", date: "Mar 09" },
      { from: "doctor",  text: "Any cough or cold symptoms?", time: "7:02 PM", date: "Mar 09" },
      { from: "patient", text: "Just a mild scratchy throat.", time: "7:05 PM", date: "Mar 09" },
      { from: "doctor",  text: "It sounds like a mild viral infection. Take paracetamol for the fever and rest for 3 days. Drink plenty of warm fluids.", time: "9:00 AM", date: "Mar 10" },
    ],
  },
  {
    id: 3, name: "Care Coordinator", role: "Support Team",
    hospital: "Remote Healthcare Systems",
    avatar: "🏥", color: C.green, unread: 0, urgent: false,
    lastMsg: "Your upcoming appointment has been confirmed.",
    lastTime: "Mar 05",
    messages: [
      { from: "doctor",  text: "Hello Alex! This is an automated reminder to schedule your monthly follow-up.", time: "2:00 PM", date: "Mar 04" },
      { from: "patient", text: "Can I schedule it for next Monday at 10 AM?", time: "2:45 PM", date: "Mar 04" },
      { from: "doctor",  text: "Let me check Dr. Priya's availability.", time: "2:50 PM", date: "Mar 04" },
      { from: "doctor",  text: "Yes, that slot is available. I've booked it for you.", time: "3:00 PM", date: "Mar 04" },
      { from: "doctor",  text: "Your upcoming appointment has been confirmed.", time: "9:00 AM", date: "Mar 05" },
    ],
  }
];


const ConvItem = ({ conv, isActive, onClick }) => (
  <div onClick={onClick}
    style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:12,cursor:"pointer",transition:"all .2s",background:isActive?"rgba(0,200,255,.1)":"transparent",border:isActive?"1px solid rgba(0,200,255,.2)":"1px solid transparent",position:"relative"}}
    onMouseOver={e=>{ if(!isActive){ e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,.06)"; }}}
    onMouseOut={e=>{ if(!isActive){ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="transparent"; }}}
  >
    {}
    {conv.urgent && <div style={{position:"absolute",left:5,top:"50%",transform:"translateY(-50%)",width:3,height:24,borderRadius:99,background:C.red,boxShadow:`0 0 6px ${C.red}`}}/>}

    {}
    <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${conv.color}33,${conv.color}66)`,border:`1.5px solid ${conv.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:"1.1rem",fontWeight:800,color:conv.color,flexShrink:0,position:"relative"}}>
      {conv.avatar}
      {}
      <div style={{position:"absolute",bottom:-2,right:-2,width:10,height:10,borderRadius:"50%",background:conv.unread>0?C.green:"rgba(255,255,255,.15)",border:`2px solid ${C.bg}`,boxShadow:conv.unread>0?`0 0 6px ${C.green}`:"none"}}/>
    </div>

    {}
    <div style={{flex:1,minWidth:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:".74rem",fontWeight:700,color:conv.unread>0?"#fff":"rgba(255,255,255,.65)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{conv.name}</span>
        <span style={{fontSize:".57rem",color:"rgba(255,255,255,.28)",flexShrink:0,marginLeft:6}}>{conv.lastTime}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
        <span style={{fontSize:".62rem",color:conv.unread>0?"rgba(255,255,255,.55)":"rgba(255,255,255,.28)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{conv.lastMsg}</span>
        {conv.unread>0&&(
          <span style={{width:18,height:18,borderRadius:"50%",background:C.ring,color:"#111",fontFamily:"'Syne',sans-serif",fontSize:".55rem",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{conv.unread}</span>
        )}
      </div>
      <div style={{fontSize:".54rem",color:"rgba(255,255,255,.2)",marginTop:2}}>{conv.role} · {conv.hospital}</div>
    </div>
  </div>
);


const Bubble = ({ msg, conv, currentPatientId }) => {
  const isPat = msg.senderId === currentPatientId || msg.from === "patient";
  return (
    <div style={{display:"flex",justifyContent:isPat?"flex-end":"flex-start",marginBottom:8,animation:"fadeUp .2s both"}}>
      {!isPat && (
        <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${conv.color}33,${conv.color}66)`,border:`1px solid ${conv.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:".8rem",fontWeight:800,color:conv.color,flexShrink:0,marginRight:8,alignSelf:"flex-end"}}>
          {conv.avatar}
        </div>
      )}
      <div style={{maxWidth:"68%"}}>
        <div style={{padding:"9px 13px",borderRadius:isPat?"14px 14px 4px 14px":"14px 14px 14px 4px",background:isPat?`linear-gradient(135deg,${C.accent},${C.ring})`:"rgba(255,255,255,.05)",border:isPat?"none":"1px solid rgba(255,255,255,.07)",boxShadow:isPat?`0 4px 16px ${C.ring}20`:"none"}}>
          <div style={{fontSize:".74rem",color:isPat?"#fff":"rgba(255,255,255,.85)",lineHeight:1.55,fontFamily:"'DM Sans',sans-serif"}}>{msg.text}</div>
        </div>
        <div style={{fontSize:".55rem",color:"rgba(255,255,255,.2)",marginTop:3,textAlign:isPat?"right":"left",paddingLeft:isPat?0:4,paddingRight:isPat?4:0}}>
          {!isPat?`${conv.name} · `:""}{msg.time}
          {isPat && <span style={{marginLeft:4,opacity:.6,color:C.ring}}>✓✓</span>}
        </div>
      </div>
    </div>
  );
};


export default function PatientMessages() {
  const navigate = useNavigate();
  const [activeConv, setActiveConv] = useState(null);
  const [convs,      setConvs]      = useState(CONVERSATIONS);
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState("");
  const [search,     setSearch]     = useState("");
  const [patient,    setPatient]    = useState(PATIENT);
  const [time,       setTime]       = useState(new Date());
  const [expanded,   setExpanded]   = useState(false);
  const chatRef = useRef(null);

  useEffect(()=>{
    const id=setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(id);
  },[]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if(user) {
         fetchChats().then(res => {
           if(res.success && res.data && res.data.length > 0) setConvs(res.data);
           else setConvs(CONVERSATIONS);
         }).catch(err => { console.error(err); setConvs(CONVERSATIONS); });
         getDoc(doc(db, "users", user.uid)).then(snap => {
           if(snap.exists()) setPatient({ id: user.uid, ...snap.data() });
         });
      }
    });
    return () => unsub();
  }, []);

  const loadMessages = (chat) => {
    fetchMessages(chat.id).then(res => {
       if(res.success && res.data && res.data.length > 0) setMessages(res.data);
       else setMessages(chat.messages || []);
       setTimeout(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },50);
    }).catch(err => { console.error(err); setMessages(chat.messages || []); });
  }

  
  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  },[activeConv]);

  const handleNav = (key) => {
    setActiveConv(activeConv); 
    if (key === "dashboard") navigate("/dashboard");
    else if (key === "vitals") navigate("/vitals");
    else if (key === "alerts") navigate("/alerts");
    else if (key === "meds") navigate("/medication");
    else if (key === "reports") navigate("/reports");
    else if (key === "chat") navigate("/jarvis-chat");
    else if (key === "messages") navigate("/messages");
    else if (key === "settings") navigate("/settings");
  };

  const openConv=(conv)=>{
    setConvs(prev=>prev.map(c=>c.id===conv.id?{...c,unread:0}:c));
    setActiveConv({...conv,unread:0});
    loadMessages(conv);
    markChatRead(conv.id).catch(console.error);
  };

  const handleNewChat = () => {
    createChatApi("DOC-001").then(res => {
      if(res.success) {
        fetchChats().then(r => { if(r.success) setConvs(r.data || []) });
      }
    });
  };

  const sendMessage=()=>{
    const txt=input.trim();
    if(!txt || !activeConv) return;
    sendMessageApi(activeConv.id, txt).then(res => {
      if(res.success) {
        setMessages(prev => [...prev, { senderId: patient?.id, text: txt, createdAt: new Date().toISOString() }]);
        setInput("");
        setTimeout(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },50);
      }
    });
  };

  const todayStr = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const totalUnread=(convs || []).reduce((s,c)=>s+(c.unread||0),0);

  const filteredConvs=(convs || []).map((c, i) => ({
    ...c,
    name: c.name || `Doctor ${c.participants?.find(p => p !== patient?.id)?.substring(0,4) || (i+1)}`,
    role: c.role || "Consulting Physician",
    hospital: c.hospital || "Remote Healthcare Systems",
    avatar: c.avatar || "👨‍⚕️",
    color: c.color || [C.accent, C.ring, C.purple][i%3],
    lastTime: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString([],{month:'short', day:'numeric'}) : "Just now",
    lastMsg: c.lastMessage || c.lastMsg || "No recent messages"
  })).filter(c=>
    search.trim()===""?true:
    [c.name,c.role,c.hospital].some(f=>(f||"").toLowerCase().includes(search.toLowerCase()))
  );

  
  const groupedMsgs = (messages || []).reduce((acc,msg)=>{
    const d = new Date(msg.createdAt || Date.now());
    const dStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[dStr] = acc[dStr]||[];
    acc[dStr].push({...msg, date: dStr, time: d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});
    return acc;
  },{});

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink   {0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hb      {0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:${C.bg}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        
        .dp{display:flex;height:100vh;overflow:hidden;background:${C.bg};position:relative}

        /* SIDEBAR */
        .sidebar{
          width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;
          padding:1rem .5rem;background:${C.sidebar};border-right:1px solid ${C.border};
          gap:4px;z-index:20;transition:width .3s cubic-bezier(.16,1,.3,1);overflow:hidden;
        }
        .sidebar.exp{width:220px;align-items:flex-start;padding:1rem .8rem}

        .sb-profile{display:flex;align-items:center;gap:11px;padding:10px 8px;border-radius:13px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.14);margin-bottom:.8rem;width:100%;cursor:pointer;transition:background .2s;flex-shrink:0}
        .sb-profile:hover{background:rgba(0,200,255,.1)}
        .sb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00c8ff);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;border:2px solid rgba(0,200,255,.35);animation:hb 3s ease-in-out infinite}
        .sb-profile-info{display:none;flex-direction:column;min-width:0}
        .sidebar.exp .sb-profile-info{display:flex}
        .sb-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-role{font-size:.62rem;color:rgba(0,200,255,.7);margin-top:1px}

        .sb-toggle{width:100%;display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);cursor:pointer;color:rgba(255,255,255,.5);transition:all .2s;margin-bottom:.5rem;flex-shrink:0}
        .sb-toggle:hover{background:rgba(255,255,255,.08);color:#fff}
        .sb-toggle-lines{display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor;transition:all .3s}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}

        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.act{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.exp .sb-item-label{display:block}
        .sb-active-bar{width:3px;height:16px;border-radius:99px;background:#00c8ff;box-shadow:0 0 8px #00c8ff;margin-left:auto;flex-shrink:0;display:none}
        .sb-item.act .sb-active-bar{display:block}

        .sb-divider{width:100%;height:1px;background:rgba(255,255,255,.06);margin:.4rem 0;flex-shrink:0}

        .sb-bottom{display:flex;flex-direction:column;gap:4px;width:100%;flex-shrink:0}
        .sb-logout{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:11px;border:1px solid rgba(255,80,80,.15);cursor:pointer;background:rgba(255,80,80,.05);transition:all .2s;color:rgba(255,100,100,.7);width:100%;white-space:nowrap;overflow:hidden}
        .sb-logout:hover{background:rgba(255,80,80,.12);color:#ff6b6b;border-color:rgba(255,80,80,.3)}
        .sidebar.exp .sb-logout{justify-content:flex-start}
        .sb-logout-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.exp .sb-logout-label{display:block}

        /* MAIN */
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.8rem;background:rgba(5,15,31,.95);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(10px);position:relative}

        /* MESSAGES LAYOUT */
        .msg-layout{flex:1;display:flex;overflow:hidden}
        .conv-list{width:320px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.05);display:flex;flex-direction:column;background:rgba(255,255,255,.01)}
        .chat-area{flex:1;display:flex;flex-direction:column;min-width:0}

        @media(max-width:768px){.sidebar{display:none}.conv-list{width:100%}}
      `}</style>

      <div className="dp">

        {}
        <div className={`sidebar${expanded?" exp":""}`}>
          <div className="sb-profile" style={{position:"relative",zIndex:1}}>
            <div className="sb-avatar">{(patient || PATIENT).initials || "👤"}</div>
            <div className="sb-profile-info">
              <span className="sb-name">{(patient || PATIENT).name}</span>
              <span className="sb-role">Patient · ID: {(patient || PATIENT).uhid || (patient || PATIENT).id}</span>
            </div>
          </div>
          
          <button className="sb-toggle" onClick={()=>setExpanded(e=>!e)}>
            {!expanded?<div className="sb-toggle-lines"><span className="sb-toggle-line"/><span className="sb-toggle-line"/><span className="sb-toggle-line"/></div>:<span style={{fontSize:".9rem",fontWeight:700,color:"rgba(255,255,255,.5)"}}>←</span>}
          </button>
          
          <div className="sb-nav" style={{position:"relative",zIndex:1}}>
            {NAV.map(({key,icon,label})=>(
              <button key={key} className={`sb-item${key==="messages"?" act":""}`} 
                onClick={() => handleNav(key)}
                style={{ cursor: "pointer" }}>
                <span className="sb-item-icon">{icon}</span>
                <span className="sb-item-label">{label}</span>
                <span className="sb-active-bar"/>
              </button>
            ))}
          </div>
          <div className="sb-divider"/>
          <div className="sb-bottom" style={{position:"relative",zIndex:1}}>
            <button className="sb-logout" onClick={() => navigate("/logout")}><span className="sb-item-icon">🚪</span><span className="sb-logout-label">Log Out</span></button>
          </div>
        </div>

        {}
        <div className="dm">

          {}
          <div className="dtb">
            <div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#fff"}}>Messages</h1>
              <p style={{fontSize:".75rem",color:"rgba(255,255,255,.35)",marginTop:1}}>Communicate with your care providers</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700,color:C.ring}}>{timeStr}</span>
                <span style={{fontSize:".65rem",color:"rgba(255,255,255,.3)"}}>{todayStr}</span>
              </div>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:"1rem",position:"relative",transition:"all .2s"}}
                 onMouseOver={e=>{e.currentTarget.style.background="rgba(0,200,255,.1)"; e.currentTarget.style.borderColor="rgba(0,200,255,.3)"}}
                 onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}}>
                🔔
                <span style={{position:"absolute",top:7,right:7,width:6,height:6,borderRadius:"50%",background:C.red,animation:"blink .9s step-start infinite",boxShadow:`0 0 5px ${C.red}`}}/>
              </div>
            </div>
          </div>

          {}
          <div className="msg-layout">

            {}
            <div className="conv-list">

              {}
              <div style={{padding:"14px 14px 10px",borderBottom:`1px solid rgba(255,255,255,.05)`}}>
                {}
                <div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 12px",borderRadius:10,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",transition:"border-color .2s",marginBottom:10}}
                  onFocusCapture={e=>e.currentTarget.style.borderColor="rgba(0,200,255,.3)"}
                  onBlurCapture={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.06)"}>
                  <span style={{fontSize:".8rem",opacity:.4}}>🔍</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search messages…"
                    style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",width:"100%"}}/>
                  {search&&<button onClick={()=>setSearch("")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".75rem",padding:0}}>✕</button>}
                </div>
                {}
                <div style={{display:"flex",gap:8}}>
                  <div style={{padding:"4px 12px",borderRadius:50,background:"rgba(0,200,255,.1)",border:"1px solid rgba(0,200,255,.2)",color:C.ring,fontSize:".68rem",fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer"}}>All</div>
                  <div style={{padding:"4px 12px",borderRadius:50,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.4)",fontSize:".68rem",fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer"}}>Unread</div>
                </div>
              </div>

              {}
              <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
                {filteredConvs.length===0?(
                  <div style={{padding:"2rem",textAlign:"center",color:"rgba(255,255,255,.3)",fontSize:".8rem"}}>No conversations found</div>
                ):(
                  filteredConvs.map(conv=>(
                    <ConvItem key={conv.id} conv={conv} isActive={activeConv?.id===conv.id} onClick={()=>openConv(conv)}/>
                  ))
                )}
              </div>

              {}
              <div style={{padding:"14px",borderTop:"1px solid rgba(255,255,255,.05)"}}>
                 <button onClick={handleNewChat} style={{width:"100%",padding:"12px",borderRadius:12,background:`linear-gradient(135deg,${C.accent},${C.ring})`,border:"none",color:"#fff",fontFamily:"'Syne',sans-serif",fontSize:".8rem",fontWeight:700,cursor:"pointer",boxShadow:`0 4px 12px ${C.ring}30`}}>
                    New Message
                 </button>
              </div>
            </div>

            {}
            <div className="chat-area">
              {activeConv ? (
                <>
                  {}
                  <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.05)",background:"rgba(255,255,255,.01)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${activeConv.color}33,${activeConv.color}66)`,border:`1.5px solid ${activeConv.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",position:"relative"}}>
                        {activeConv.avatar}
                        <div style={{position:"absolute",bottom:-2,right:-2,width:12,height:12,borderRadius:"50%",background:C.green,border:`2px solid ${C.bg}`,boxShadow:`0 0 6px ${C.green}`}}/>
                      </div>
                      <div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".95rem",fontWeight:800,color:"#fff"}}>{activeConv.name}</div>
                        <div style={{fontSize:".7rem",color:"rgba(255,255,255,.4)",marginTop:2}}>
                          {activeConv.role} · {activeConv.hospital} <span style={{color:C.green,marginLeft:6}}>● Online</span>
                        </div>
                      </div>
                    </div>
                    {}
                    <div style={{display:"flex",gap:8}}>
                      {[{icon:"📞",tip:"Call"},{icon:"📹",tip:"Video"}].map(({icon,tip})=>(
                        <button key={tip} title={tip} style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
                          onMouseOver={e=>{e.currentTarget.style.background=`rgba(0,200,255,.1)`;e.currentTarget.style.borderColor=`rgba(0,200,255,.2)`;e.currentTarget.style.color=C.ring;}}
                          onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.color="rgba(255,255,255,.6)";}}>
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {}
                  <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:0}}>
                    {Object.entries(groupedMsgs).map(([date,msgs])=>(
                      <div key={date}>
                        {}
                        <div style={{display:"flex",alignItems:"center",gap:10,margin:"10px 0 16px"}}>
                          <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>
                          <span style={{fontSize:".65rem",color:"rgba(255,255,255,.3)",fontFamily:"'Syne',sans-serif",fontWeight:700,padding:"4px 12px",borderRadius:50,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",textTransform:"uppercase",letterSpacing:".05em"}}>{date}</span>
                          <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>
                        </div>
                        {msgs.map((msg,i)=><Bubble key={i} msg={msg} conv={activeConv} currentPatientId={patient?.id}/>)}
                      </div>
                    ))}
                    <div style={{height:10}}/>
                  </div>

                  {}
                  <div style={{padding:"8px 20px 8px",display:"flex",gap:8,overflowX:"auto",flexShrink:0}}>
                    {["Thank you, Doctor!","I am feeling much better","Can I reschedule my appointment?","When should I take my test?","Okay, understood."].map(q=>(
                      <button key={q} onClick={()=>setInput(q)}
                        style={{padding:"6px 14px",borderRadius:50,background:"rgba(0,200,255,.06)",border:"1px solid rgba(0,200,255,.15)",color:C.ring,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:700,whiteSpace:"nowrap",transition:"all .2s",flexShrink:0}}
                        onMouseOver={e=>{e.currentTarget.style.background="rgba(0,200,255,.15)";}}
                        onMouseOut={e=>{e.currentTarget.style.background="rgba(0,200,255,.06)";}}>
                        {q}
                      </button>
                    ))}
                  </div>

                  {}
                  <div style={{padding:"10px 20px 20px",flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:16,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",transition:"border-color .2s",boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}
                      onFocusCapture={e=>e.currentTarget.style.borderColor="rgba(0,200,255,.3)"}
                      onBlurCapture={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}>
                      <button style={{width:32,height:32,borderRadius:10,background:"rgba(0,200,255,.08)",border:"1px solid rgba(0,200,255,.15)",color:C.ring,cursor:"pointer",fontSize:".9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      <input value={input} onChange={e=>setInput(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
                        placeholder={`Type a message…`}
                        style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:".85rem",fontFamily:"'DM Sans',sans-serif"}}/>
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        {["📎","😊"].map(ic=>(
                          <button key={ic} style={{width:32,height:32,borderRadius:8,background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"color .2s"}}
                            onMouseOver={e=>e.currentTarget.style.color="rgba(255,255,255,.7)"}
                            onMouseOut={e=>e.currentTarget.style.color="rgba(255,255,255,.3)"}>
                            {ic}
                          </button>
                        ))}
                        <button onClick={sendMessage}
                          style={{width:40,height:40,borderRadius:12,background:input.trim()?`linear-gradient(135deg,${C.accent},${C.ring})`:"rgba(255,255,255,.06)",border:"none",color:input.trim()?"#fff":"rgba(255,255,255,.25)",cursor:input.trim()?"pointer":"default",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",boxShadow:input.trim()?`0 0 16px ${C.ring}40`:"none",marginLeft:4}}>
                          ➤
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,color:"rgba(255,255,255,.2)"}}>
                  <div style={{fontSize:"4rem",filter:`drop-shadow(0 0 24px ${C.ring}40)`}}>💬</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"rgba(255,255,255,.5)"}}>Select a conversation</div>
                  <div style={{fontSize:".85rem"}}>Choose a provider from the list to view your messages</div>
                </div>
              )}
            </div>

          </div>{}
        </div>{}
      </div>{}
    </>
  );
}
