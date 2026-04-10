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
  name:"Dr. Sarah Mitchell", initials:"SM", specialty:"Endocrinology",
  regNo:"MCI-DL-2009-44821", dept:"Dept. of Endocrinology",
  hospital:"City General Hospital", opd:"OPD 4, Second Floor",
  exp:"14 yrs", rating:"4.9",
};

const NAV = [
  { key:"dashboard",     icon:"⚕",   label:"Dashboard"     },
  { key:"patients",      icon:"👥",  label:"My Patients"   },
  { key:"appointments",  icon:"📅",  label:"Appointments"  },
  { key:"reports",       icon:"📋",  label:"Reports"       },
  { key:"prescriptions", icon:"💊",  label:"Prescriptions" },
  { key:"analytics",     icon:"📈",  label:"Analytics"     },
  { key:"messages",      icon:"💬",  label:"Messages"      },
  { key:"chat",          icon:"✨",  label:"AI Chat"       },
  { key:"settings",      icon:"⚙️", label:"Settings"      },
];


const CONVERSATIONS = [
  {
    id:1, name:"Rajan Mehta", uhid:"CGH-0231", age:54, g:"M",
    diagnosis:"Type 2 DM + Diabetic Foot",
    avatar:"RM", color:C.red, unread:2, urgent:true,
    lastMsg:"Doctor, my foot wound is oozing more than yesterday. Should I come in today?",
    lastTime:"9:42 AM",
    messages:[
      { from:"patient", text:"Good morning Doctor. I wanted to update you on my foot condition.", time:"9:10 AM", date:"Today" },
      { from:"patient", text:"The dressing was changed yesterday and the nurse said there is more discharge.", time:"9:11 AM", date:"Today" },
      { from:"doctor",  text:"Good morning Rajan. Thank you for the update. How does the wound look — is the skin around it red or warm?", time:"9:28 AM", date:"Today" },
      { from:"patient", text:"Yes the area around it is a bit reddish and there is a bad smell too.", time:"9:35 AM", date:"Today" },
      { from:"doctor",  text:"That sounds like it may be worsening. Please go to OPD immediately. I will leave instructions for the nurse to redress and collect a wound swab.", time:"9:38 AM", date:"Today" },
      { from:"patient", text:"Doctor, my foot wound is oozing more than yesterday. Should I come in today?", time:"9:42 AM", date:"Today" },
    ],
  },
  {
    id:2, name:"Meena Krishnan", uhid:"CGH-0412", age:35, g:"F",
    diagnosis:"PCOD + Insulin Resistance",
    avatar:"MK", color:C.pink, unread:1, urgent:false,
    lastMsg:"Doctor I took the Metformin you prescribed but I am feeling nauseous. Is this normal?",
    lastTime:"Yesterday",
    messages:[
      { from:"patient", text:"Hello Doctor. I started Metformin 3 days ago.", time:"6:15 PM", date:"Yesterday" },
      { from:"patient", text:"Doctor I took the Metformin you prescribed but I am feeling nauseous. Is this normal?", time:"6:16 PM", date:"Yesterday" },
      { from:"doctor",  text:"Hi Meena. Yes, nausea is a very common side effect when starting Metformin. It usually settles in 1–2 weeks.", time:"7:02 PM", date:"Yesterday" },
      { from:"doctor",  text:"Try taking it with food rather than on an empty stomach. If it persists beyond 2 weeks let me know and we can switch to the SR formulation.", time:"7:03 PM", date:"Yesterday" },
    ],
  },
  {
    id:3, name:"Vikram Choudhry", uhid:"CGH-0501", age:48, g:"M",
    diagnosis:"Adrenal Mass — Post Biopsy",
    avatar:"VC", color:C.amber, unread:0, urgent:true,
    lastMsg:"The biopsy site is a bit sore but manageable. Any results yet?",
    lastTime:"Mar 12",
    messages:[
      { from:"doctor",  text:"Vikram, just checking in after the biopsy procedure today. How are you feeling?", time:"4:00 PM", date:"Mar 12" },
      { from:"patient", text:"A bit tired but okay Doctor. There is some discomfort at the site.", time:"4:45 PM", date:"Mar 12" },
      { from:"doctor",  text:"That is expected. Keep the site clean and dry. Take Pantoprazole with the Hydrocortisone as prescribed.", time:"4:52 PM", date:"Mar 12" },
      { from:"patient", text:"Understood. Should I avoid lifting anything?", time:"5:10 PM", date:"Mar 12" },
      { from:"doctor",  text:"Yes please avoid heavy lifting for 48 hours. Report any severe pain, fever or bleeding at the site immediately.", time:"5:14 PM", date:"Mar 12" },
      { from:"patient", text:"The biopsy site is a bit sore but manageable. Any results yet?", time:"6:30 PM", date:"Mar 12" },
    ],
  },
  {
    id:4, name:"Priya Sharma", uhid:"CGH-0118", age:29, g:"F",
    diagnosis:"Hypothyroidism (Hashimoto's)",
    avatar:"PS", color:C.indigo, unread:0, urgent:false,
    lastMsg:"Thank you Doctor! I will take it 30 minutes before breakfast.",
    lastTime:"Mar 10",
    messages:[
      { from:"patient", text:"Hello Doctor. I got my TSH reports. It says 7.2.", time:"10:00 AM", date:"Mar 10" },
      { from:"doctor",  text:"Hi Priya. Yes I have seen the report. Your TSH is still elevated so I am increasing your Levothyroxine dose to 75 mcg.", time:"10:30 AM", date:"Mar 10" },
      { from:"patient", text:"Okay Doctor. Any special instructions for taking it?", time:"10:45 AM", date:"Mar 10" },
      { from:"doctor",  text:"Yes — always take it on an empty stomach, 30 minutes before breakfast. Avoid calcium or iron supplements within 4 hours of taking it.", time:"10:50 AM", date:"Mar 10" },
      { from:"patient", text:"Thank you Doctor! I will take it 30 minutes before breakfast.", time:"11:02 AM", date:"Mar 10" },
    ],
  },
  {
    id:5, name:"Suresh Pillai", uhid:"CGH-0389", age:61, g:"M",
    diagnosis:"Type 2 DM — Quarterly Review",
    avatar:"SP", color:C.green, unread:3, urgent:false,
    lastMsg:"My morning sugar today was 210. I ate rice last night, could that be the reason?",
    lastTime:"8:20 AM",
    messages:[
      { from:"patient", text:"Good morning Doctor. My morning sugar readings this week:", time:"8:00 AM", date:"Today" },
      { from:"patient", text:"Monday: 178, Tuesday: 182, Wednesday: 190, Thursday: 188, Friday: 195, Today: 210", time:"8:01 AM", date:"Today" },
      { from:"patient", text:"My morning sugar today was 210. I ate rice last night, could that be the reason?", time:"8:20 AM", date:"Today" },
    ],
  },
  {
    id:6, name:"Anjali Verma", uhid:"CGH-0304", age:42, g:"F",
    diagnosis:"Thyroid Nodule — Observation",
    avatar:"AV", color:C.glow, unread:0, urgent:false,
    lastMsg:"Will do, Doctor. See you in September for the repeat scan.",
    lastTime:"Mar 05",
    messages:[
      { from:"patient", text:"Doctor I just received the thyroid ultrasound report. It says TIRADS 3. Is that serious?", time:"2:00 PM", date:"Mar 05" },
      { from:"doctor",  text:"Hi Anjali. TIRADS 3 means a mildly suspicious nodule, but it does not mean cancer. It just means we monitor it.", time:"2:30 PM", date:"Mar 05" },
      { from:"doctor",  text:"We will repeat the scan in 6 months — September 2026. If it has not grown, no further action is needed.", time:"2:31 PM", date:"Mar 05" },
      { from:"patient", text:"That is a relief Doctor. So no surgery or biopsy now?", time:"2:45 PM", date:"Mar 05" },
      { from:"doctor",  text:"Correct. Just continue your Levothyroxine and the Vitamin D. No biopsy needed at this stage.", time:"2:50 PM", date:"Mar 05" },
      { from:"patient", text:"Will do, Doctor. See you in September for the repeat scan.", time:"3:00 PM", date:"Mar 05" },
    ],
  },
  {
    id:7, name:"Alex Johnson", uhid:"CGH-0042", age:37, g:"M",
    diagnosis:"Type 2 DM + Dyslipidaemia",
    avatar:"AJ", color:C.ring, unread:1, urgent:false,
    lastMsg:"Should I stop Rosuvastatin if I feel muscle pain? I read it can cause that.",
    lastTime:"Mar 01",
    messages:[
      { from:"patient", text:"Doctor, I started the Rosuvastatin you prescribed last week.", time:"9:00 AM", date:"Mar 01" },
      { from:"doctor",  text:"Good morning Alex. How are you tolerating it so far?", time:"9:15 AM", date:"Mar 01" },
      { from:"patient", text:"Mostly fine but I read online that statins can cause muscle pain. A bit worried.", time:"9:22 AM", date:"Mar 01" },
      { from:"doctor",  text:"Muscle aches can happen with statins but are quite rare at the low dose of 10mg. If you notice significant muscle pain or weakness, do let me know.", time:"9:28 AM", date:"Mar 01" },
      { from:"patient", text:"Should I stop Rosuvastatin if I feel muscle pain? I read it can cause that.", time:"9:35 AM", date:"Mar 01" },
    ],
  },
  {
    id:8, name:"Fatima Naqvi", uhid:"CGH-0567", age:23, g:"F",
    diagnosis:"New Patient — PCOD Workup",
    avatar:"FN", color:C.amber, unread:0, urgent:false,
    lastMsg:"Thank you for seeing me today Doctor. I will follow up in 3 months.",
    lastTime:"Mar 14",
    messages:[
      { from:"patient", text:"Hello Doctor, this is Fatima. Thank you so much for the detailed consultation today.", time:"4:30 PM", date:"Mar 14" },
      { from:"doctor",  text:"Hello Fatima! You are welcome. Please start the Metformin SR with dinner to avoid nausea.", time:"5:00 PM", date:"Mar 14" },
      { from:"doctor",  text:"Also please ensure you get the repeat hormone panel done in 3 months before your next appointment.", time:"5:01 PM", date:"Mar 14" },
      { from:"patient", text:"Sure Doctor. One question — can I continue my gym workouts?", time:"5:20 PM", date:"Mar 14" },
      { from:"doctor",  text:"Absolutely! Regular exercise is very beneficial for PCOD. Aim for at least 30 minutes of moderate exercise 5 days a week.", time:"5:25 PM", date:"Mar 14" },
      { from:"patient", text:"Thank you for seeing me today Doctor. I will follow up in 3 months.", time:"5:40 PM", date:"Mar 14" },
    ],
  },
];


const ParticleBg = () => {
  const ref = useRef(null); const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx = c.getContext("2d"), W = c.width, H = c.height;
    const pts = Array.from({length:30}, () => ({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.3+.4,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
    }));
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H;
        const a=.12+.2*Math.abs(Math.sin(Date.now()*.0008+p.x));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,85,247,${a})`; ctx.shadowColor="#a855f7"; ctx.shadowBlur=5; ctx.fill();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf.current);
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
};


const ConvItem = ({ conv, isActive, onClick }) => (
  <div onClick={onClick}
    style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:12,cursor:"pointer",transition:"all .2s",background:isActive?"rgba(147,51,234,.13)":"transparent",border:isActive?"1px solid rgba(168,85,247,.25)":"1px solid transparent",position:"relative"}}
    onMouseOver={e=>{ if(!isActive){ e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,.06)"; }}}
    onMouseOut={e=>{ if(!isActive){ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="transparent"; }}}
  >
    {}
    {conv.urgent && <div style={{position:"absolute",left:5,top:"50%",transform:"translateY(-50%)",width:3,height:24,borderRadius:99,background:C.red,boxShadow:`0 0 6px ${C.red}`}}/>}

    {}
    <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${conv.color}33,${conv.color}66)`,border:`1.5px solid ${conv.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:800,color:conv.color,flexShrink:0,position:"relative"}}>
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
          <span style={{width:18,height:18,borderRadius:"50%",background:C.ring,color:"#fff",fontFamily:"'Syne',sans-serif",fontSize:".55rem",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{conv.unread}</span>
        )}
      </div>
      <div style={{fontSize:".54rem",color:"rgba(255,255,255,.2)",marginTop:2}}>{conv.uhid} · {conv.age}y {conv.g}</div>
    </div>
  </div>
);


const Bubble = ({ msg, conv }) => {
  const isDoc = msg.from === "doctor";
  return (
    <div style={{display:"flex",justifyContent:isDoc?"flex-end":"flex-start",marginBottom:8,animation:"fadeUp .2s both"}}>
      {!isDoc && (
        <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${conv.color}33,${conv.color}66)`,border:`1px solid ${conv.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:800,color:conv.color,flexShrink:0,marginRight:8,alignSelf:"flex-end"}}>
          {conv.avatar}
        </div>
      )}
      <div style={{maxWidth:"68%"}}>
        <div style={{padding:"9px 13px",borderRadius:isDoc?"14px 14px 4px 14px":"14px 14px 14px 4px",background:isDoc?`linear-gradient(135deg,${C.accent},${C.ring})`:"rgba(255,255,255,.07)",border:isDoc?"none":"1px solid rgba(255,255,255,.07)",boxShadow:isDoc?`0 4px 16px ${C.ring}30`:"none"}}>
          <div style={{fontSize:".72rem",color:isDoc?"#fff":"rgba(255,255,255,.8)",lineHeight:1.55,fontFamily:"'DM Sans',sans-serif"}}>{msg.text}</div>
        </div>
        <div style={{fontSize:".55rem",color:"rgba(255,255,255,.2)",marginTop:3,textAlign:isDoc?"right":"left",paddingLeft:isDoc?0:4,paddingRight:isDoc?4:0}}>
          {isDoc?"Dr. Mitchell · ":""}{msg.time}
          {isDoc && <span style={{marginLeft:4,opacity:.6}}>✓✓</span>}
        </div>
      </div>
      {isDoc && (
        <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,#5b21b6,${C.ring})`,border:`1px solid ${C.ring}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:800,color:"#fff",flexShrink:0,marginLeft:8,alignSelf:"flex-end"}}>
          SM
        </div>
      )}
    </div>
  );
};


import DoctorSidebar from "./DoctorSidebar";

export default function DoctorMessages() {
  const navigate = useNavigate(); 
  const [time,       setTime]       = useState(new Date());
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0]);
  const [convs,      setConvs]      = useState(CONVERSATIONS);
  const [input,      setInput]      = useState("");
  const [search,     setSearch]     = useState("");
  const chatRef = useRef(null);

  useEffect(()=>{
    const id=setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(id);
  },[]);

  
  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  },[activeConv]);

  const openConv=(conv)=>{
    
    setConvs(prev=>prev.map(c=>c.id===conv.id?{...c,unread:0}:c));
    setActiveConv({...conv,unread:0});
  };

  const sendMessage=()=>{
    const txt=input.trim();
    if(!txt) return;
    const now=new Date();
    const timeStr=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const newMsg={from:"doctor",text:txt,time:timeStr,date:"Today"};
    const updatedConv={...activeConv,messages:[...activeConv.messages,newMsg],lastMsg:txt,lastTime:timeStr,unread:0};
    setActiveConv(updatedConv);
    setConvs(prev=>prev.map(c=>c.id===activeConv.id?updatedConv:c));
    setInput("");
    setTimeout(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },50);
  };

  const h=time.getHours();
  const greeting=h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";
  const totalUnread=convs.reduce((s,c)=>s+c.unread,0);

  const filteredConvs=convs.filter(c=>
    search.trim()===""?true:
    [c.name,c.uhid,c.diagnosis].some(f=>f.toLowerCase().includes(search.toLowerCase()))
  );

  
  const groupedMsgs=activeConv.messages.reduce((acc,msg)=>{
    acc[msg.date]=acc[msg.date]||[];
    acc[msg.date].push(msg);
    return acc;
  },{});

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn {from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink   {0%,100%{opacity:1}50%{opacity:.25}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:${C.bg}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.22);border-radius:99px}
        .dp{display:flex;height:100vh;overflow:hidden;background:${C.bg};position:relative}
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:rgba(6,3,15,.96);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(14px);position:relative}
        .dtb::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.ring}42,transparent)}
        .msg-layout{flex:1;display:flex;overflow:hidden}
        .conv-list{width:300px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.05);display:flex;flex-direction:column;background:rgba(255,255,255,.01)}
        .chat-area{flex:1;display:flex;flex-direction:column;min-width:0}
        @media(max-width:768px){.sidebar{display:none}.conv-list{width:100%}}
      `}</style>

      <div className="dp">
        <ParticleBg/>
        
        <DoctorSidebar active="messages" />

        <div className="dm">
          <div className="dtb">
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,color:`${C.glow}70`,textTransform:"uppercase",letterSpacing:".09em"}}>{greeting}, Doctor</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",marginTop:1}}>
                {DOCTOR.name}
                <span style={{color:`${C.ring}70`,fontSize:".78rem",fontWeight:600}}> · {DOCTOR.specialty}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",transition:"all .2s"}}
                onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.07)"}
                onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
                🔔
                <div style={{position:"absolute",top:-4,right:-4,width:17,height:17,borderRadius:"50%",background:C.red,fontFamily:"'Syne',sans-serif",fontSize:".5rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.bg}`,animation:"blink 2s step-start infinite"}}>7</div>
              </div>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:700,color:`${C.glow}70`}}>
                {time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
              </span>
            </div>
          </div>

          <div className="msg-layout">
            <div className="conv-list">
              <div style={{padding:"14px 14px 10px",borderBottom:`1px solid rgba(255,255,255,.05)`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".78rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:8}}>
                    💬 Messages
                    {totalUnread>0&&(
                      <span style={{padding:"1px 7px",borderRadius:50,background:`${C.ring}18`,border:`1px solid ${C.ring}30`,color:C.ring,fontSize:".6rem",fontWeight:700}}>{totalUnread}</span>
                    )}
                  </div>
                  <button style={{width:28,height:28,borderRadius:8,background:`${C.ring}14`,border:`1px solid ${C.ring}28`,color:C.ring,cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
                    onMouseOver={e=>e.currentTarget.style.background=`${C.ring}28`}
                    onMouseOut={e=>e.currentTarget.style.background=`${C.ring}14`}>✏</button>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
                  <span style={{fontSize:".75rem",opacity:.35}}>🔍</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients…"
                    style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:".67rem",fontFamily:"'DM Sans',sans-serif",width:"100%"}}/>
                  {search&&<button onClick={()=>setSearch("")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".7rem",padding:0}}>✕</button>}
                </div>
              </div>

              <div style={{flex:1,overflowY:"auto",padding:"6px 8px"}}>
                {filteredConvs.length===0?(
                  <div style={{padding:"2rem",textAlign:"center",color:"rgba(255,255,255,.2)",fontSize:".7rem"}}>No conversations found</div>
                ):(
                  filteredConvs.map(conv=>(
                    <ConvItem key={conv.id} conv={conv} isActive={activeConv?.id===conv.id} onClick={()=>openConv(conv)}/>
                  ))
                )}
              </div>

              <div style={{padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:".58rem",color:"rgba(255,255,255,.22)",fontFamily:"'Syne',sans-serif",fontWeight:600}}>{convs.length} patients</span>
                <span style={{fontSize:".58rem",color:C.ring,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{totalUnread} unread</span>
              </div>
            </div>

            <div className="chat-area">
              {activeConv ? (
                <>
                  <div style={{padding:"10px 18px",borderBottom:"1px solid rgba(255,255,255,.05)",background:"rgba(255,255,255,.015)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:38,height:38,borderRadius:11,background:`linear-gradient(135deg,${activeConv.color}33,${activeConv.color}66)`,border:`1.5px solid ${activeConv.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,color:activeConv.color,position:"relative"}}>
                        {activeConv.avatar}
                        <div style={{position:"absolute",bottom:-2,right:-2,width:10,height:10,borderRadius:"50%",background:C.green,border:`2px solid ${C.bg}`,boxShadow:`0 0 6px ${C.green}`}}/>
                      </div>
                      <div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".82rem",fontWeight:800,color:"#fff"}}>{activeConv.name}</div>
                        <div style={{fontSize:".58rem",color:"rgba(255,255,255,.3)",marginTop:1}}>
                          {activeConv.uhid} · {activeConv.age}y {activeConv.g} · <span style={{color:C.green}}>● Online</span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      {[{icon:"📋",tip:"Records"},{icon:"📅",tip:"Appt"},{icon:"💊",tip:"Rx"},{icon:"📞",tip:"Call"}].map(({icon,tip})=>(
                        <button key={tip} title={tip} style={{width:32,height:32,borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.55)",cursor:"pointer",fontSize:".85rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
                          onMouseOver={e=>{e.currentTarget.style.background=`${C.ring}18`;e.currentTarget.style.borderColor=`${C.ring}30`;e.currentTarget.style.color=C.ring;}}
                          onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.color="rgba(255,255,255,.55)";}}>
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{padding:"7px 18px",borderBottom:"1px solid rgba(255,255,255,.04)",background:"rgba(168,85,247,.04)",display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                    <span style={{fontSize:".6rem",color:`${C.glow}70`}}>🩺</span>
                    <span style={{fontSize:".62rem",color:`${C.glow}80`,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{activeConv.diagnosis}</span>
                    {activeConv.urgent&&<span style={{padding:"1px 7px",borderRadius:50,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.22)",color:C.red,fontSize:".55rem",fontFamily:"'Syne',sans-serif",fontWeight:700,animation:"blink 2s step-start infinite"}}>⚠ Urgent</span>}
                  </div>

                  <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:0}}>
                    {Object.entries(groupedMsgs).map(([date,msgs])=>(
                      <div key={date}>
                        <div style={{display:"flex",alignItems:"center",gap:10,margin:"10px 0 14px"}}>
                          <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>
                          <span style={{fontSize:".57rem",color:"rgba(255,255,255,.22)",fontFamily:"'Syne',sans-serif",fontWeight:700,padding:"2px 10px",borderRadius:50,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)"}}>{date}</span>
                          <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>
                        </div>
                        {msgs.map((msg,i)=><Bubble key={i} msg={msg} conv={activeConv}/>)}
                      </div>
                    ))}
                    <div style={{height:8}}/>
                  </div>

                  <div style={{padding:"8px 18px 6px",display:"flex",gap:6,overflowX:"auto",flexShrink:0}}>
                    {["Please visit OPD today","Noted, I will review","Continue the current medication","Your reports look normal","Please get blood tests done"].map(q=>(
                      <button key={q} onClick={()=>setInput(q)}
                        style={{padding:"4px 11px",borderRadius:50,background:"rgba(168,85,247,.08)",border:"1px solid rgba(168,85,247,.18)",color:C.glow,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,whiteSpace:"nowrap",transition:"all .2s",flexShrink:0}}
                        onMouseOver={e=>{e.currentTarget.style.background="rgba(168,85,247,.18)";}}
                        onMouseOut={e=>{e.currentTarget.style.background="rgba(168,85,247,.08)";}}>
                        {q}
                      </button>
                    ))}
                  </div>

                  <div style={{padding:"10px 18px 14px",flexShrink:0,borderTop:"1px solid rgba(255,255,255,.05)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",transition:"border-color .2s"}}
                      onFocusCapture={e=>e.currentTarget.style.borderColor="rgba(168,85,247,.35)"}
                      onBlurCapture={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}>
                      <input value={input} onChange={e=>setInput(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
                        placeholder={`Reply to ${activeConv.name}…`}
                        style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif"}}/>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        {["📎","😊"].map(ic=>(
                          <button key={ic} style={{width:28,height:28,borderRadius:8,background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".85rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"color .2s"}}
                            onMouseOver={e=>e.currentTarget.style.color="rgba(255,255,255,.7)"}
                            onMouseOut={e=>e.currentTarget.style.color="rgba(255,255,255,.3)"}>
                            {ic}
                          </button>
                        ))}
                        <button onClick={sendMessage}
                          style={{width:34,height:34,borderRadius:10,background:input.trim()?`linear-gradient(135deg,${C.accent},${C.ring})`:"rgba(255,255,255,.06)",border:"none",color:input.trim()?"#fff":"rgba(255,255,255,.25)",cursor:input.trim()?"pointer":"default",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",boxShadow:input.trim()?`0 0 14px ${C.ring}40`:"none"}}>
                          ➤
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,color:"rgba(255,255,255,.2)"}}>
                  <div style={{fontSize:"3rem",filter:`drop-shadow(0 0 18px ${C.ring}50)`}}>💬</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:800}}>Select a conversation</div>
                  <div style={{fontSize:".7rem"}}>Choose a patient from the list to view messages</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
