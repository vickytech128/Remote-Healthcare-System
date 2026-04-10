import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";


const C = {
  bg:       "#070410",
  sidebar:  "rgba(6,3,15,.97)",
  accent:   "#9333ea",
  ring:     "#a855f7",
  glow:     "#c084fc",
  indigo:   "#818cf8",
  green:    "#34d399",
  amber:    "#fbbf24",
  red:      "#f87171",
  pink:     "#f472b6",
  border:   "rgba(168,85,247,.12)",
  card:     "rgba(255,255,255,.03)",
  faint:    "rgba(255,255,255,.05)",
};


const DOCTOR = {
  name:      "Dr. Sarah Mitchell",
  initials:  "SM",
  specialty: "Endocrinology",
  regNo:     "MCI-DL-2009-44821",
  dept:      "Dept. of Endocrinology",
  hospital:  "City General Hospital",
  opd:       "OPD 4, Second Floor",
  exp:       "14 yrs",
  rating:    "4.9",
};


const STATS = [
  { label:"Today's Patients", value:"24",  sub:"+3 walk-ins",         icon:"👥", color:C.glow   },
  { label:"Appointments",     value:"18",  sub:"6 pending review",    icon:"📅", color:C.indigo },
  { label:"Reports Pending",  value:"7",   sub:"2 urgent",            icon:"📋", color:C.amber  },
  { label:"Avg. Wait Time",   value:"14m", sub:"↓ 4m from yesterday", icon:"⏱", color:C.green  },
];


const QUEUE = [
  { token:"T-01", name:"Alex Johnson",    age:37, g:"M", uhid:"CGH-0042", time:"09:00", issue:"HbA1c review + TSH follow-up",      status:"done",    priority:"normal" },
  { token:"T-02", name:"Priya Sharma",    age:29, g:"F", uhid:"CGH-0118", time:"09:20", issue:"Hypothyroid management",             status:"done",    priority:"normal" },
  { token:"T-03", name:"Rajan Mehta",     age:54, g:"M", uhid:"CGH-0231", time:"09:40", issue:"Diabetic foot + glucose spike",      status:"current", priority:"urgent" },
  { token:"T-04", name:"Anjali Verma",    age:42, g:"F", uhid:"CGH-0304", time:"10:00", issue:"Thyroid nodule follow-up",           status:"waiting", priority:"normal" },
  { token:"T-05", name:"Suresh Pillai",   age:61, g:"M", uhid:"CGH-0389", time:"10:20", issue:"Type 2 DM – quarterly check",       status:"waiting", priority:"normal" },
  { token:"T-06", name:"Meena Krishnan",  age:35, g:"F", uhid:"CGH-0412", time:"10:40", issue:"PCOD + insulin resistance screen",  status:"waiting", priority:"high"   },
  { token:"T-07", name:"Vikram Choudhry", age:48, g:"M", uhid:"CGH-0501", time:"11:00", issue:"Adrenal mass – biopsy results",     status:"waiting", priority:"urgent" },
  { token:"T-08", name:"Fatima Naqvi",    age:23, g:"F", uhid:"CGH-0567", time:"11:20", issue:"New patient – irregular periods",   status:"waiting", priority:"normal" },
];


const APPTS = [
  { time:"02:30 PM", name:"Dinesh Rao",     type:"Follow-up",    mode:"in",   date:"Today"    },
  { time:"04:00 PM", name:"Sunita Agarwal", type:"Consultation", mode:"tele", date:"Today"    },
  { time:"09:30 AM", name:"Harish Bose",    type:"Review",       mode:"in",   date:"Tomorrow" },
  { time:"11:00 AM", name:"Lata Iyer",      type:"New Patient",  mode:"in",   date:"Tomorrow" },
  { time:"03:00 PM", name:"Pratik Shah",    type:"Telecall",     mode:"tele", date:"Tomorrow" },
];


const REPORTS = [
  { name:"Alex Johnson",    test:"HbA1c + Lipid Profile",  date:"Mar 01", urgent:false },
  { name:"Vikram Choudhry", test:"Adrenal CT Biopsy",      date:"Mar 12", urgent:true  },
  { name:"Meena Krishnan",  test:"Fasting Insulin + OGTT", date:"Mar 10", urgent:true  },
  { name:"Suresh Pillai",   test:"Kidney Function Test",   date:"Mar 08", urgent:false },
  { name:"Anjali Verma",    test:"Thyroid Ultrasound",     date:"Mar 05", urgent:false },
];


const NOTIFS = [
  { id:1,  type:"urgent",   icon:"🚨", title:"Critical Report – Vikram Choudhry",       body:"Adrenal CT Biopsy result uploaded. Immediate review required.",           time:"2 min ago",   date:"Today",    read:false, category:"report"      },
  { id:2,  type:"urgent",   icon:"🔴", title:"Abnormal Lab – Meena Krishnan",             body:"Fasting insulin critically elevated at 48 µU/mL. Patient alerted.",       time:"18 min ago",  date:"Today",    read:false, category:"lab"         },
  { id:3,  type:"appt",     icon:"📅", title:"Appointment Reminder",                      body:"Dinesh Rao – Follow-up at 02:30 PM today. OPD 4.",                        time:"32 min ago",  date:"Today",    read:false, category:"appointment" },
  { id:4,  type:"message",  icon:"💬", title:"Message from Dr. Raj Patel",               body:"Please review the shared ECG strip for patient PAT-0042 when free.",      time:"1 hr ago",    date:"Today",    read:false, category:"message"     },
  { id:5,  type:"system",   icon:"🏥", title:"OPD Queue Update",                          body:"3 walk-in patients added to your queue. Current wait time: 22 min.",      time:"1.5 hr ago",  date:"Today",    read:true,  category:"system"      },
  { id:6,  type:"appt",     icon:"📅", title:"New Appointment – Lata Iyer",              body:"New patient consultation booked for tomorrow 11:00 AM.",                  time:"3 hr ago",    date:"Today",    read:true,  category:"appointment" },
  { id:7,  type:"report",   icon:"📋", title:"Report Ready – Suresh Pillai",             body:"Kidney Function Test results uploaded and awaiting your review.",         time:"5 hr ago",    date:"Today",    read:true,  category:"report"      },
  { id:8,  type:"message",  icon:"💬", title:"Patient Message – Anjali Verma",           body:"Patient asking about thyroid nodule results. Follow-up call requested.",  time:"Yesterday",   date:"Yesterday",read:true,  category:"message"     },
  { id:9,  type:"system",   icon:"⚙️","title":"System Maintenance Notice",              body:"Portal maintenance scheduled for Sunday 02:00–04:00 AM. Plan accordingly.",time:"Yesterday",   date:"Yesterday",read:true,  category:"system"      },
  { id:10, type:"report",   icon:"📋", title:"Report Ready – Anjali Verma",              body:"Thyroid Ultrasound report uploaded by Dr. Meera Kapoor (Radiologist).",   time:"2 days ago",  date:"Mar 12",   read:true,  category:"report"      },
  { id:11, type:"appt",     icon:"📅", title:"Appointment Cancelled – Harish Bose",      body:"Patient cancelled tomorrow's 09:30 AM appointment. Slot is now free.",    time:"2 days ago",  date:"Mar 12",   read:true,  category:"appointment" },
  { id:12, type:"message",  icon:"💬", title:"Ward Note – Nurse Deepa",                  body:"Patient CGH-0501 requesting pain review. Please check when available.",   time:"3 days ago",  date:"Mar 11",   read:true,  category:"message"     },
];


const BrainWave = () => {
  const ref = useRef(null); const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const DPR = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * DPR; c.height = c.offsetHeight * DPR;
    const ctx = c.getContext("2d"); ctx.scale(DPR, DPR);
    const W = c.offsetWidth, H = c.offsetHeight; let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H); ctx.save(); ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const p = x / W;
        const y = H/2 + Math.sin((p*6+t)*Math.PI)*9 + Math.sin((p*3+t*.7)*Math.PI)*5 + Math.sin((p*12+t*1.3)*Math.PI)*3;
        x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      const g = ctx.createLinearGradient(0,0,W,0);
      g.addColorStop(0,"rgba(168,85,247,0)"); g.addColorStop(.3,"rgba(147,51,234,.5)");
      g.addColorStop(.7,"rgba(168,85,247,.85)"); g.addColorStop(1,"#c084fc");
      ctx.strokeStyle=g; ctx.lineWidth=2.2; ctx.lineJoin="round"; ctx.lineCap="round";
      ctx.shadowColor="#a855f7"; ctx.shadowBlur=10; ctx.stroke(); ctx.restore();
      const dx=((t*55)%W+W)%W, dp=dx/W;
      const dy=H/2+Math.sin((dp*6+t)*Math.PI)*9+Math.sin((dp*3+t*.7)*Math.PI)*5+Math.sin((dp*12+t*1.3)*Math.PI)*3;
      ctx.save(); ctx.beginPath(); ctx.arc(dx,dy,4,0,Math.PI*2);
      ctx.fillStyle="#c084fc"; ctx.shadowColor="#c084fc"; ctx.shadowBlur=16; ctx.fill(); ctx.restore();
      t+=0.012; raf.current=requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"54px",display:"block"}}/>;
};


const ParticleBg = () => {
  const ref = useRef(null); const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx=c.getContext("2d"), W=c.width, H=c.height;
    const pts=Array.from({length:30},()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.3+.4,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
    }));
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H;
        const a=.12+.2*Math.abs(Math.sin(Date.now()*.0008+p.x));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,85,247,${a})`; ctx.shadowColor="#a855f7"; ctx.shadowBlur=5; ctx.fill();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
};



const StatCard = ({s,idx}) => (
  <div style={{background:C.card,border:`1px solid ${s.color}1e`,borderRadius:18,padding:"1.1rem 1.2rem",animation:`fadeUp .4s ${idx*.07}s both`,position:"relative",overflow:"hidden",transition:"border-color .2s,box-shadow .2s",cursor:"default"}}
    onMouseOver={e=>{e.currentTarget.style.borderColor=`${s.color}40`;e.currentTarget.style.boxShadow=`0 0 22px ${s.color}14`;}}
    onMouseOut={e=>{e.currentTarget.style.borderColor=`${s.color}1e`;e.currentTarget.style.boxShadow="";}}>
    <div style={{position:"absolute",top:-20,right:-20,width:88,height:88,borderRadius:"50%",background:s.color,filter:"blur(36px)",opacity:.13,pointerEvents:"none"}}/>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:".6rem"}}>
      <div style={{width:42,height:42,borderRadius:13,background:`${s.color}14`,border:`1px solid ${s.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem"}}>{s.icon}</div>
      <span style={{fontSize:".58rem",padding:"2px 8px",borderRadius:50,background:`${s.color}12`,color:s.color,border:`1px solid ${s.color}22`,fontFamily:"'Syne',sans-serif",fontWeight:700}}>▲</span>
    </div>
    <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.75rem",fontWeight:800,color:"#fff",lineHeight:1,marginBottom:3}}>{s.value}</div>
    <div style={{fontSize:".68rem",color:"rgba(255,255,255,.42)",marginBottom:3}}>{s.label}</div>
    <div style={{fontSize:".62rem",color:s.color,fontWeight:600}}>{s.sub}</div>
  </div>
);


const PM = {urgent:{color:C.red,bg:"rgba(248,113,113,.1)",lbl:"URGENT"},high:{color:C.amber,bg:"rgba(251,191,36,.09)",lbl:"HIGH"},normal:{color:"rgba(255,255,255,.2)",bg:"rgba(255,255,255,.04)",lbl:"NORMAL"}};
const SM = {done:{color:"rgba(255,255,255,.2)",lbl:"Done",dot:"#2e2455"},current:{color:C.ring,lbl:"In Consult",dot:C.ring},waiting:{color:"rgba(255,255,255,.5)",lbl:"Waiting",dot:C.amber}};

const QueueRow = ({p,idx}) => {
  const pm=PM[p.priority]||PM.normal, sm=SM[p.status]||SM.waiting;
  const cur=p.status==="current", done=p.status==="done";
  return (
    <div style={{display:"grid",gridTemplateColumns:"50px 1.6fr 58px 1.4fr 86px 98px",gap:10,alignItems:"center",padding:"10px 14px",borderRadius:12,background:cur?`${C.ring}08`:done?"rgba(255,255,255,.012)":"rgba(255,255,255,.025)",border:cur?`1px solid ${C.ring}28`:"1px solid rgba(255,255,255,.05)",opacity:done?.5:1,animation:`fadeUp .3s ${idx*.04}s both`,transition:"background .2s"}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,color:cur?C.ring:"rgba(255,255,255,.28)",textAlign:"center"}}>{p.token}</div>
      <div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".8rem",fontWeight:700,color:done?"rgba(255,255,255,.35)":"#fff"}}>{p.name}</div>
        <div style={{fontSize:".58rem",color:"rgba(255,255,255,.24)",marginTop:1}}>{p.uhid} · {p.age}y {p.g}</div>
      </div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".66rem",fontWeight:600,color:"rgba(255,255,255,.38)"}}>{p.time}</div>
      <div style={{fontSize:".67rem",color:"rgba(255,255,255,.42)",lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.issue}</div>
      <span style={{padding:"3px 9px",borderRadius:50,background:pm.bg,color:pm.color,border:`1px solid ${pm.color}28`,fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,textAlign:"center",whiteSpace:"nowrap"}}>{pm.lbl}</span>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:sm.dot,boxShadow:cur?`0 0 8px ${sm.dot}`:"",flexShrink:0,animation:cur?"blink 1.2s step-start infinite":""}}/>
        <span style={{fontSize:".64rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:sm.color}}>{sm.lbl}</span>
      </div>
    </div>
  );
};


const typeMeta = (t) => ({
  urgent:      { color:"#f87171", bg:"rgba(248,113,113,.1)",  border:"rgba(248,113,113,.22)", label:"Urgent"      },
  report:      { color:"#fbbf24", bg:"rgba(251,191,36,.09)",  border:"rgba(251,191,36,.22)",  label:"Report"      },
  appt:        { color:"#818cf8", bg:"rgba(129,140,248,.09)", border:"rgba(129,140,248,.22)", label:"Appointment" },
  message:     { color:"#c084fc", bg:"rgba(192,132,252,.09)", border:"rgba(192,132,252,.22)", label:"Message"     },
  system:      { color:"#34d399", bg:"rgba(52,211,153,.08)",  border:"rgba(52,211,153,.2)",   label:"System"      },
})[t] || { color:"#a855f7", bg:"rgba(168,85,247,.08)", border:"rgba(168,85,247,.2)", label:"Info" };

const NotificationsPage = ({ notifs }) => {
  const [filter, setFilter]   = useState("all");
  const [items,  setItems]    = useState(notifs);

  const markRead  = (id) => setItems(prev => prev.map(n => n.id===id ? {...n, read:true} : n));
  const markAll   = ()   => setItems(prev => prev.map(n => ({...n, read:true})));
  const deleteOne = (id) => setItems(prev => prev.filter(n => n.id!==id));

  const unread = items.filter(n=>!n.read).length;

  const CATS = [
    { k:"all",         l:`All (${items.length})`          },
    { k:"unread",      l:`Unread (${unread})`              },
    { k:"urgent",      l:"Urgent"                          },
    { k:"report",      l:"Reports"                         },
    { k:"appt",        l:"Appointments"                    },
    { k:"message",     l:"Messages"                        },
    { k:"system",      l:"System"                          },
  ];

  const filtered = items.filter(n =>
    filter==="all"    ? true :
    filter==="unread" ? !n.read :
    n.type === filter
  );

  
  const grouped = filtered.reduce((acc, n) => {
    acc[n.date] = acc[n.date] || [];
    acc[n.date].push(n);
    return acc;
  }, {});

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:"1rem"}}>

      {}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:10}}>
            🔔 Notifications
            {unread > 0 && (
              <span style={{padding:"2px 9px",borderRadius:50,background:"rgba(248,113,113,.12)",border:"1px solid rgba(248,113,113,.28)",color:"#f87171",fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700}}>
                {unread} unread
              </span>
            )}
          </div>
          <div style={{fontSize:".7rem",color:"rgba(255,255,255,.3)",marginTop:3}}>All alerts, messages and system updates</div>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            style={{padding:"7px 16px",borderRadius:9,background:"rgba(168,85,247,.1)",border:"1px solid rgba(168,85,247,.25)",color:"#a855f7",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:700,transition:"all .2s"}}
            onMouseOver={e=>e.currentTarget.style.background="rgba(168,85,247,.2)"}
            onMouseOut={e=>e.currentTarget.style.background="rgba(168,85,247,.1)"}>
            ✓ Mark All Read
          </button>
        )}
      </div>

      {}
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {CATS.map(({k,l}) => (
          <button key={k}
            onClick={() => setFilter(k)}
            style={{padding:"5px 13px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,letterSpacing:".03em",transition:"all .2s",background:filter===k?"rgba(147,51,234,.14)":"transparent",color:filter===k?"#a855f7":"rgba(255,255,255,.32)",borderWidth:filter===k?1:0,borderStyle:"solid",borderColor:filter===k?"rgba(168,85,247,.28)":"transparent"}}
            onMouseOver={e=>{ if(filter!==k){ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(255,255,255,.65)"; }}}
            onMouseOut={e=>{ if(filter!==k){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.32)"; }}}>
            {l}
          </button>
        ))}
      </div>

      {}
      {Object.keys(grouped).length === 0 ? (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,color:"rgba(255,255,255,.2)"}}>
          <div style={{fontSize:"2.5rem"}}>🎉</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:700}}>All caught up!</div>
          <div style={{fontSize:".7rem"}}>No notifications in this category</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"1.1rem"}}>
          {Object.entries(grouped).map(([date, list]) => (
            <div key={date}>
              {}
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:".5rem",display:"flex",alignItems:"center",gap:8}}>
                {date}
                <span style={{flex:1,height:1,background:"rgba(255,255,255,.04)",display:"block"}}/>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {list.map((n,i) => {
                  const tm = typeMeta(n.type);
                  return (
                    <div key={n.id}
                      style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:13,background:n.read?"rgba(255,255,255,.02)":tm.bg,border:n.read?"1px solid rgba(255,255,255,.05)":`1px solid ${tm.border}`,animation:`fadeUp .3s ${i*.04}s both`,transition:"background .2s",position:"relative",overflow:"hidden"}}>

                      {}
                      {!n.read && <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:tm.color,borderRadius:"3px 0 0 3px"}}/>}

                      {}
                      <div style={{width:38,height:38,borderRadius:11,background:`${tm.color}14`,border:`1px solid ${tm.color}26`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0,marginLeft:n.read?0:4}}>{n.icon}</div>

                      {}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:3}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:".78rem",fontWeight: n.read?700:800,color:n.read?"rgba(255,255,255,.6)":"#fff",lineHeight:1.3}}>{n.title}</div>
                          <span style={{padding:"2px 8px",borderRadius:50,background:`${tm.color}12`,color:tm.color,border:`1px solid ${tm.color}22`,fontSize:".55rem",fontFamily:"'Syne',sans-serif",fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>{tm.label}</span>
                        </div>
                        <div style={{fontSize:".7rem",color:"rgba(255,255,255,.38)",lineHeight:1.6,marginBottom:6}}>{n.body}</div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:".6rem",color:"rgba(255,255,255,.22)"}}>{n.time}</span>
                          {!n.read && (
                            <button onClick={()=>markRead(n.id)}
                              style={{padding:"2px 9px",borderRadius:50,background:"rgba(168,85,247,.1)",border:"1px solid rgba(168,85,247,.22)",color:"#a855f7",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:700,transition:"all .2s"}}
                              onMouseOver={e=>e.currentTarget.style.background="rgba(168,85,247,.22)"}
                              onMouseOut={e=>e.currentTarget.style.background="rgba(168,85,247,.1)"}>
                              Mark read
                            </button>
                          )}
                          <button onClick={()=>deleteOne(n.id)}
                            style={{padding:"2px 9px",borderRadius:50,background:"transparent",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.25)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:700,transition:"all .2s",marginLeft:"auto"}}
                            onMouseOver={e=>{ e.currentTarget.style.background="rgba(248,113,113,.1)"; e.currentTarget.style.color="#f87171"; e.currentTarget.style.borderColor="rgba(248,113,113,.25)"; }}
                            onMouseOut={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.25)"; e.currentTarget.style.borderColor="rgba(255,255,255,.08)"; }}>
                            ✕ Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const NAV = [
  { key: "dashboard",     icon: "⚕",   label: "Dashboard"      },
  { key: "patients",      icon: "👥",  label: "My Patients"    },
  { key: "appointments",  icon: "📅",  label: "Appointments"   },
  { key: "reports",       icon: "📋",  label: "Reports"        },
  { key: "prescriptions", icon: "💊",  label: "Prescriptions"  },
  { key: "analytics",     icon: "📈",  label: "Analytics"      },
  { key: "messages",      icon: "💬",  label: "Messages"       },
  { key: "chat",          icon: "✨",  label: "AI Chat"        },
  { key: "settings",      icon: "⚙️", label: "Settings"       },
  { key: "notifications", icon: "🔔",  label: "Notifications" },
];


export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [active,  setActive]    = useState("dashboard");
  const [animKey, setAnimKey]   = useState(0);
  const [qFilter, setQFilter]   = useState("all");
  const [time,    setTime]      = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleNav = (key, e) => {
    e?.preventDefault();
    if (key === "logout") { navigate("/doctor-logout"); return; }
    setActive(key);
    setAnimKey(k => k + 1);
  };

  const h = time.getHours();
  const greeting = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";

  const fq = QUEUE.filter(p => {
    if (qFilter === "all") return true;
    if (qFilter === "urgent") return p.priority === "urgent" || p.priority === "high";
    return p.status === qFilter;
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn {from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink   {0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hb      {0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.08)}60%{transform:scale(1)}}
        @keyframes ripple  {from{transform:scale(0);opacity:.55}to{transform:scale(3.5);opacity:0}}
        @keyframes navPop  {0%{transform:scale(.92)}60%{transform:scale(1.04)}100%{transform:scale(1)}}

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:${C.bg}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.22);border-radius:99px}

        .dp{display:flex;height:100vh;overflow:hidden;background:${C.bg};position:relative}

        /* ── MAIN ── */
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}

        /* topbar */
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:rgba(6,3,15,.96);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(14px);position:relative}
        .dtb::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.ring}42,transparent)}

        /* content scroll area */
        .dc{flex:1;overflow-y:auto;padding:1.3rem 1.8rem;display:flex;flex-direction:column;gap:1.1rem}

        /* section heading */
        .sh{font-family:'Syne',sans-serif;font-size:.65rem;font-weight:800;color:rgba(255,255,255,.24);text-transform:uppercase;letter-spacing:.12em;display:flex;align-items:center;gap:8px;margin-bottom:.65rem}
        .sh::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.045)}

        /* queue filter tabs */
        .qt{padding:5px 13px;border-radius:8px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.03em;transition:all .2s;background:transparent;color:rgba(255,255,255,.3)}
        .qt:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.65)}
        .qt.on{background:rgba(147,51,234,.12);border:1px solid rgba(168,85,247,.25);color:${C.ring}}

        /* queue col headers */
        .qh{display:grid;grid-template-columns:50px 1.6fr 58px 1.4fr 86px 98px;gap:10px;padding:4px 14px;margin-bottom:5px}
        .qhc{font-size:.55rem;font-weight:700;color:rgba(255,255,255,.17);text-transform:uppercase;letter-spacing:.09em}

        /* page slide */
        .page{flex:1;display:flex;flex-direction:column;overflow:hidden}
        .slide{animation:slideIn .36s cubic-bezier(.16,1,.3,1) both}

        /* placeholder */
        .placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:rgba(255,255,255,.16)}

        @media(max-width:768px){.sidebar{display:none}.dc{padding:1rem}.qh{display:none}}
      `}</style>

      <div className="dp">
        <ParticleBg />

        {}
        <DoctorSidebar active="dashboard" />

        {}
        <div className="dm">

          {}
          <div className="dtb">
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,color:`${C.glow}70`,textTransform:"uppercase",letterSpacing:".09em"}}>{greeting}, Doctor</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",marginTop:1}}>
                {DOCTOR.name}
                <span style={{color:`${C.ring}70`,fontSize:".78rem",fontWeight:600}}> · {DOCTOR.specialty}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>

              <div
                onClick={e=>handleNav("notifications",e)}
                style={{width:34,height:34,borderRadius:10,background:active==="notifications"?`${C.ring}18`:"rgba(255,255,255,.04)",border:active==="notifications"?`1px solid ${C.ring}35`:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",transition:"all .2s"}}
                onMouseOver={e=>e.currentTarget.style.background=active==="notifications"?`${C.ring}22`:"rgba(255,255,255,.07)"}
                onMouseOut={e=>e.currentTarget.style.background=active==="notifications"?`${C.ring}18`:"rgba(255,255,255,.04)"}>
                🔔
                <div style={{position:"absolute",top:-4,right:-4,width:17,height:17,borderRadius:"50%",background:C.red,fontFamily:"'Syne',sans-serif",fontSize:".5rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.bg}`,animation:"blink 2s step-start infinite"}}>7</div>
              </div>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:700,color:`${C.glow}70`}}>
                {time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
              </span>
            </div>
          </div>

          {}
          <div className="page">
            <div key={animKey} className="slide" style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

              {}
              {active === "dashboard" && (
                <div className="dc">

                  {}
                  <div>
                    <div className="sh">Overview — {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
                      {STATS.map((s,i)=><StatCard key={s.label} s={s} idx={i}/>)}
                    </div>
                  </div>

                  {}
                  <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",gap:".85rem"}}>

                    {}
                    <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:18,padding:"1.1rem 1.3rem",animation:"fadeUp .4s .2s both"}}>
                      {}
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:".9rem"}}>
                        <div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:800,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Weekly Patients</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.7rem",fontWeight:800,color:"#fff",lineHeight:1}}>144</div>
                          <div style={{fontSize:".62rem",color:"rgba(255,255,255,.3)",marginTop:3}}>Mar 08 – Mar 14, 2026</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                          <span style={{padding:"3px 10px",borderRadius:50,background:`${C.ring}12`,border:`1px solid ${C.ring}26`,color:C.ring,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>↑ 12% vs last week</span>
                          <span style={{fontSize:".6rem",color:"rgba(255,255,255,.25)"}}>Avg <span style={{color:"#fff",fontWeight:700}}>20.6</span>/day</span>
                        </div>
                      </div>

                      {}
                      <div style={{display:"flex",gap:8,alignItems:"flex-end",height:72,padding:"0 4px",marginBottom:".75rem"}}>
                        {[
                          {d:"Mon",v:18},{d:"Tue",v:22},{d:"Wed",v:16},
                          {d:"Thu",v:24},{d:"Fri",v:19},{d:"Sat",v:21},{d:"Sun",v:24},
                        ].map(({d,v},i)=>{
                          const isToday = i===6;
                          const pct = v/24;
                          return(
                            <div key={d} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1}}>
                              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".56rem",fontWeight:700,color:isToday?C.ring:"rgba(255,255,255,.3)"}}>{v}</div>
                              <div style={{width:"100%",position:"relative",height:52,display:"flex",alignItems:"flex-end"}}>
                                <div style={{
                                  width:"100%",borderRadius:"5px 5px 3px 3px",
                                  background:isToday?`linear-gradient(180deg,${C.glow},${C.ring})`:`${C.ring}28`,
                                  height:`${pct*100}%`,
                                  boxShadow:isToday?`0 0 12px ${C.ring}55`:"none",
                                  transition:"height .6s cubic-bezier(.16,1,.3,1)",
                                }}/>
                              </div>
                              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".55rem",color:isToday?C.ring:"rgba(255,255,255,.25)",fontWeight:isToday?700:400}}>{d}</div>
                            </div>
                          );
                        })}
                      </div>

                      {}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".5rem",paddingTop:".7rem",borderTop:"1px solid rgba(255,255,255,.05)"}}>
                        {[
                          {label:"New",     value:"38", color:C.green  },
                          {label:"Follow-up",value:"92", color:C.indigo },
                          {label:"Walk-in",  value:"14", color:C.amber  },
                        ].map(({label,value,color})=>(
                          <div key={label} style={{textAlign:"center",padding:"6px 4px",borderRadius:9,background:`${color}08`,border:`1px solid ${color}18`}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:800,color}}>{value}</div>
                            <div style={{fontSize:".55rem",color:"rgba(255,255,255,.28)",marginTop:2,textTransform:"uppercase",letterSpacing:".07em"}}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {}
                    <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:18,padding:"1rem 1.1rem",animation:"fadeUp .4s .27s both"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".63rem",fontWeight:800,color:"rgba(255,255,255,.26)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:".75rem"}}>Next Appointments</div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {APPTS.map((a,i)=>{
                          const col = a.mode==="tele" ? C.indigo : C.ring;
                          return (
                            <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:10,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)",transition:"background .2s",cursor:"default"}}
                              onMouseOver={e=>e.currentTarget.style.background=`${C.accent}10`}
                              onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.02)"}>
                              <div style={{width:3,height:34,borderRadius:99,background:col,flexShrink:0,boxShadow:`0 0 6px ${col}55`}}/>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontFamily:"'Syne',sans-serif",fontSize:".74rem",fontWeight:700,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.name}</div>
                                <div style={{fontSize:".58rem",color:"rgba(255,255,255,.27)",marginTop:1}}>{a.date} · {a.time}</div>
                              </div>
                              <span style={{fontSize:".56rem",padding:"2px 8px",borderRadius:5,background:`${col}14`,color:col,border:`1px solid ${col}25`,fontFamily:"'Syne',sans-serif",fontWeight:700,flexShrink:0}}>
                                {a.mode==="tele"?"📞":"🏥"} {a.type}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {}
                    <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:18,padding:"1rem 1.1rem",animation:"fadeUp .4s .34s both"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".75rem"}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".63rem",fontWeight:800,color:"rgba(255,255,255,.26)",textTransform:"uppercase",letterSpacing:".09em"}}>Reports to Review</div>
                        <span style={{padding:"2px 9px",borderRadius:50,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.24)",color:C.red,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>2 Urgent</span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {REPORTS.map((r,i)=>(
                          <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:9,background:r.urgent?`${C.red}08`:"rgba(255,255,255,.02)",border:r.urgent?`1px solid ${C.red}1e`:"1px solid rgba(255,255,255,.04)"}}>
                            <span style={{fontSize:".75rem",flexShrink:0}}>{r.urgent?"🔴":"🟡"}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:700,color:r.urgent?"#fff":"rgba(255,255,255,.6)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
                              <div style={{fontSize:".58rem",color:"rgba(255,255,255,.27)",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.test} · {r.date}</div>
                            </div>
                            <button style={{flexShrink:0,padding:"3px 9px",borderRadius:6,background:`${C.ring}0e`,border:`1px solid ${C.ring}28`,color:C.ring,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:700,transition:"all .2s"}}
                              onMouseOver={e=>e.currentTarget.style.background=`${C.ring}22`}
                              onMouseOut={e=>e.currentTarget.style.background=`${C.ring}0e`}>View</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {}
                  <div>
                    <div className="sh">Today's OPD Queue — {DOCTOR.opd}</div>
                    <div style={{display:"flex",gap:5,marginBottom:".65rem",alignItems:"center",flexWrap:"wrap"}}>
                      {[
                        {k:"all",    l:`All (${QUEUE.length})`},
                        {k:"waiting",l:`Waiting (${QUEUE.filter(p=>p.status==="waiting").length})`},
                        {k:"urgent", l:`Urgent/High (${QUEUE.filter(p=>p.priority==="urgent"||p.priority==="high").length})`},
                        {k:"done",   l:`Done (${QUEUE.filter(p=>p.status==="done").length})`},
                      ].map(t=>(
                        <button key={t.k} className={`qt${qFilter===t.k?" on":""}`} onClick={()=>setQFilter(t.k)}>{t.l}</button>
                      ))}
                      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7,padding:"4px 12px",borderRadius:50,background:`${C.ring}0a`,border:`1px solid ${C.ring}26`}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:C.ring,animation:"blink 1s step-start infinite"}}/>
                        <span style={{fontFamily:"'Syne',sans-serif",fontSize:".63rem",fontWeight:700,color:C.ring}}>
                          Now: {QUEUE.find(p=>p.status==="current")?.name}
                        </span>
                      </div>
                    </div>
                    <div className="qh">
                      {["Token","Patient","Time","Chief Complaint","Priority","Status"].map(h=>(
                        <span key={h} className="qhc">{h}</span>
                      ))}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {fq.map((p,i)=><QueueRow key={p.token} p={p} idx={i}/>)}
                    </div>
                  </div>

                  {/* footer */}
                  <div style={{padding:"9px 15px",borderRadius:12,background:"rgba(255,255,255,.015)",border:`1px solid ${C.faint}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{width:28,height:28,borderRadius:8,background:`${C.ring}10`,border:`1px solid ${C.ring}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem"}}>🏥</div>
                      <div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:800,color:"rgba(255,255,255,.55)"}}>{DOCTOR.hospital} · {DOCTOR.dept}</div>
                        <div style={{fontSize:".57rem",color:"rgba(255,255,255,.22)",marginTop:1}}>Reg: {DOCTOR.regNo} · {DOCTOR.opd}</div>
                      </div>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:".64rem",fontWeight:700,color:`${C.glow}55`}}>⭐ {DOCTOR.rating} · {DOCTOR.exp} Experience</div>
                  </div>

                </div>
              )}

              {/* ── NOTIFICATIONS PAGE ── */}
              {active === "notifications" && (
                <div className="dc">
                  <NotificationsPage notifs={NOTIFS} />
                </div>
              )}

              {/* ── OTHER PAGES (you add these later) ── */}
              {active !== "dashboard" && active !== "notifications" && (
                <div className="dc">
                  <div className="placeholder">
                    <div style={{fontSize:"3.2rem",filter:`drop-shadow(0 0 18px ${C.ring}50)`}}>
                      {NAV.find(n=>n.key===active)?.icon}
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:".95rem",fontWeight:800,color:"rgba(255,255,255,.28)"}}>
                      {NAV.find(n=>n.key===active)?.label}
                    </div>
                    <div style={{fontSize:".72rem",color:"rgba(255,255,255,.16)"}}>
                      Add your page file here
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
