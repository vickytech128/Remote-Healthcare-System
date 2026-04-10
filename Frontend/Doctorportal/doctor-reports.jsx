import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";


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
  name:     "Dr. Sarah Mitchell",
  initials: "SM",
  specialty:"Endocrinology",
  regNo:    "MCI-DL-2009-44821",
  dept:     "Dept. of Endocrinology",
  hospital: "City General Hospital",
  opd:      "OPD 4, Second Floor",
  exp:      "14 yrs",
  rating:   "4.9",
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


const ALL_REPORTS = [
  {
    id:"RPT-001", name:"Vikram Choudhry", uhid:"CGH-0501", age:48, g:"M",
    test:"Adrenal CT Biopsy", category:"Radiology", date:"Mar 12, 2026",
    receivedDate:"Mar 12, 2026", status:"pending", priority:"urgent",
    doctor:"Dr. Meera Kapoor", dept:"Radiology",
    summary:"Adrenal mass biopsy — pathology report awaiting specialist sign-off.",
    tags:["CT","Biopsy","Adrenal"],
    values:[
      { label:"Mass Size",        value:"3.2 cm",  flag:"high"   },
      { label:"Hounsfield Units", value:"38 HU",   flag:"normal" },
      { label:"Enhancement",      value:"Present", flag:"high"   },
    ],
  },
  {
    id:"RPT-002", name:"Meena Krishnan", uhid:"CGH-0412", age:35, g:"F",
    test:"Fasting Insulin + OGTT", category:"Lab", date:"Mar 10, 2026",
    receivedDate:"Mar 10, 2026", status:"pending", priority:"urgent",
    doctor:"CGH Lab", dept:"Biochemistry",
    summary:"Critically elevated fasting insulin levels — OGTT curve abnormal.",
    tags:["Insulin","OGTT","Glucose"],
    values:[
      { label:"Fasting Insulin", value:"48 µU/mL",  flag:"critical" },
      { label:"Fasting Glucose", value:"112 mg/dL", flag:"high"     },
      { label:"2-hr Glucose",    value:"186 mg/dL", flag:"high"     },
    ],
  },
  {
    id:"RPT-003", name:"Rajan Mehta", uhid:"CGH-0231", age:54, g:"M",
    test:"Wound Culture + HbA1c", category:"Lab", date:"Mar 14, 2026",
    receivedDate:"Mar 14, 2026", status:"pending", priority:"urgent",
    doctor:"CGH Lab", dept:"Microbiology",
    summary:"Wound culture positive for Pseudomonas aeruginosa. Sensitive to Piperacillin-Tazobactam.",
    tags:["Culture","Diabetic Foot","HbA1c"],
    values:[
      { label:"Organism",    value:"Pseudomonas", flag:"critical" },
      { label:"HbA1c",       value:"10.2%",       flag:"critical" },
      { label:"Sensitivity", value:"PipTaz S",    flag:"normal"   },
    ],
  },
  {
    id:"RPT-004", name:"Fatima Naqvi", uhid:"CGH-0567", age:23, g:"F",
    test:"Pelvic USG + Hormone Panel", category:"Radiology", date:"Mar 13, 2026",
    receivedDate:"Mar 13, 2026", status:"pending", priority:"high",
    doctor:"Dr. Meera Kapoor", dept:"Radiology",
    summary:"Multiple follicular cysts on bilateral ovaries. LH/FSH ratio elevated — PCOD likely.",
    tags:["USG","Pelvic","PCOD","Hormones"],
    values:[
      { label:"LH/FSH Ratio", value:"2.8",          flag:"high" },
      { label:"Testosterone",  value:"0.9 ng/mL",   flag:"high" },
      { label:"AFC",           value:"14 follicles", flag:"high" },
    ],
  },
  {
    id:"RPT-005", name:"Suresh Pillai", uhid:"CGH-0389", age:61, g:"M",
    test:"Kidney Function Test", category:"Lab", date:"Mar 08, 2026",
    receivedDate:"Mar 09, 2026", status:"pending", priority:"normal",
    doctor:"CGH Lab", dept:"Biochemistry",
    summary:"Mild azotemia detected. Creatinine marginally elevated — monitor and review.",
    tags:["KFT","Creatinine","Urea"],
    values:[
      { label:"Serum Creatinine", value:"1.6 mg/dL", flag:"high"   },
      { label:"Blood Urea",       value:"54 mg/dL",  flag:"high"   },
      { label:"eGFR",             value:"58 mL/min", flag:"normal" },
    ],
  },
  {
    id:"RPT-006", name:"Anjali Verma", uhid:"CGH-0304", age:42, g:"F",
    test:"Thyroid Ultrasound", category:"Radiology", date:"Mar 05, 2026",
    receivedDate:"Mar 06, 2026", status:"reviewed", priority:"normal",
    doctor:"Dr. Meera Kapoor", dept:"Radiology",
    summary:"Hypoechoic nodule right lobe — TIRADS 3. Follow-up USG in 6 months recommended.",
    tags:["USG","Thyroid","Nodule"],
    values:[
      { label:"Nodule Size", value:"9 mm",       flag:"normal" },
      { label:"TIRADS",      value:"Category 3", flag:"normal" },
      { label:"Vascularity", value:"Absent",     flag:"normal" },
    ],
  },
  {
    id:"RPT-007", name:"Alex Johnson", uhid:"CGH-0042", age:37, g:"M",
    test:"HbA1c + Lipid Profile", category:"Lab", date:"Mar 01, 2026",
    receivedDate:"Mar 02, 2026", status:"reviewed", priority:"normal",
    doctor:"CGH Lab", dept:"Biochemistry",
    summary:"HbA1c improved from 8.2% to 7.6%. LDL still borderline — lifestyle counselling advised.",
    tags:["HbA1c","Lipids","Diabetes"],
    values:[
      { label:"HbA1c",         value:"7.6%",      flag:"high"   },
      { label:"LDL",           value:"138 mg/dL", flag:"high"   },
      { label:"Triglycerides", value:"162 mg/dL", flag:"normal" },
    ],
  },
  {
    id:"RPT-008", name:"Priya Sharma", uhid:"CGH-0118", age:29, g:"F",
    test:"TSH + Free T4", category:"Lab", date:"Feb 28, 2026",
    receivedDate:"Mar 01, 2026", status:"reviewed", priority:"normal",
    doctor:"CGH Lab", dept:"Endocrinology Lab",
    summary:"TSH elevated at 7.2 mIU/L. Free T4 low-normal. Dose titration recommended.",
    tags:["TSH","T4","Hypothyroid"],
    values:[
      { label:"TSH",      value:"7.2 mIU/L",  flag:"high"   },
      { label:"Free T4",  value:"0.82 ng/dL", flag:"normal" },
      { label:"Anti-TPO", value:"210 IU/mL",  flag:"high"   },
    ],
  },
];

const PRIO = {
  urgent: { color:C.red,    bg:"rgba(248,113,113,.1)",  border:"rgba(248,113,113,.22)",  label:"URGENT" },
  high:   { color:C.amber,  bg:"rgba(251,191,36,.09)",  border:"rgba(251,191,36,.22)",   label:"HIGH"   },
  normal: { color:C.indigo, bg:"rgba(129,140,248,.08)", border:"rgba(129,140,248,.18)",  label:"NORMAL" },
};
const RSTAT = {
  pending:  { color:C.amber, bg:"rgba(251,191,36,.1)",  label:"Pending Review" },
  reviewed: { color:C.green, bg:"rgba(52,211,153,.08)", label:"Reviewed"       },
};
const FLAG = {
  critical:{ color:C.red   },
  high:    { color:C.amber },
  normal:  { color:C.green },
};


const ParticleBg = () => {
  const ref = useRef(null);
  const raf = useRef(null);
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
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
};


const ReportModal = ({ report, onClose, onMarkReviewed }) => {
  if (!report) return null;
  const pm = PRIO[report.priority] || PRIO.normal;
  const sm = RSTAT[report.status]  || RSTAT.pending;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(7,4,16,.88)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:540,background:"rgba(11,7,24,.99)",border:`1px solid rgba(168,85,247,.25)`,borderRadius:22,boxShadow:`0 0 60px rgba(147,51,234,.2),0 24px 48px rgba(0,0,0,.7)`,overflow:"hidden",animation:"fadeUp .28s both"}}>

        {}
        <div style={{padding:"1.2rem 1.4rem",borderBottom:"1px solid rgba(255,255,255,.05)",background:"rgba(147,51,234,.06)",display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:13,background:`${pm.color}14`,border:`1px solid ${pm.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem"}}>
              {report.category==="Radiology"?"🩻":"🧪"}
            </div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".88rem",fontWeight:800,color:"#fff"}}>{report.name}</div>
              <div style={{fontSize:".6rem",color:"rgba(255,255,255,.32)",marginTop:2}}>{report.uhid} · {report.age}y {report.g} · {report.id}</div>
            </div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:".85rem",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>

        {}
        <div style={{padding:"1.2rem 1.4rem",display:"flex",flexDirection:"column",gap:"1rem",maxHeight:"70vh",overflowY:"auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".92rem",fontWeight:800,color:"#fff"}}>{report.test}</div>
            <span style={{padding:"2px 9px",borderRadius:50,background:pm.bg,border:`1px solid ${pm.border}`,color:pm.color,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{pm.label}</span>
            <span style={{padding:"2px 9px",borderRadius:50,background:sm.bg,color:sm.color,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{sm.label}</span>
          </div>

          <div style={{padding:"10px 13px",borderRadius:11,background:"rgba(168,85,247,.05)",border:"1px solid rgba(168,85,247,.12)"}}>
            <div style={{fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:`${C.glow}70`,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Summary</div>
            <div style={{fontSize:".72rem",color:"rgba(255,255,255,.65)",lineHeight:1.6}}>{report.summary}</div>
          </div>

          <div>
            <div style={{fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".5rem"}}>Key Values</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {report.values.map((v,i) => {
                const fl = FLAG[v.flag] || FLAG.normal;
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:9,background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.04)"}}>
                    <div style={{fontSize:".7rem",color:"rgba(255,255,255,.5)"}}>{v.label}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:".7rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:fl.color}}>{v.value}</span>
                      <span style={{width:7,height:7,borderRadius:"50%",background:fl.color,boxShadow:`0 0 6px ${fl.color}`,display:"inline-block"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {label:"Category",    value:report.category    },
              {label:"Department",  value:report.dept        },
              {label:"Reported By", value:report.doctor      },
              {label:"Received",    value:report.receivedDate},
            ].map(({label,value}) => (
              <div key={label} style={{padding:"8px 11px",borderRadius:9,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontSize:".56rem",color:"rgba(255,255,255,.25)",fontFamily:"'Syne',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>{label}</div>
                <div style={{fontSize:".7rem",color:"rgba(255,255,255,.7)",fontWeight:600}}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {report.tags.map(tag => (
              <span key={tag} style={{padding:"3px 10px",borderRadius:6,background:"rgba(168,85,247,.08)",border:"1px solid rgba(168,85,247,.18)",color:C.glow,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>#{tag}</span>
            ))}
          </div>

          <div style={{display:"flex",gap:8,paddingTop:4}}>
            {report.status==="pending" && (
              <button onClick={()=>{ onMarkReviewed(report.id); onClose(); }}
                style={{flex:1,padding:"10px",borderRadius:11,background:`linear-gradient(135deg,${C.accent},${C.ring})`,border:"none",color:"#fff",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,boxShadow:`0 0 20px ${C.ring}30`}}>
                ✓ Mark as Reviewed
              </button>
            )}
            <button onClick={onClose}
              style={{flex:1,padding:"10px",borderRadius:11,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",color:"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:700}}>
              📄 Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const ReportRow = ({ r, idx, onView }) => {
  const pm     = PRIO[r.priority] || PRIO.normal;
  const sm     = RSTAT[r.status]  || RSTAT.pending;
  const isDone = r.status === "reviewed";
  return (
    <div
      style={{display:"grid",gridTemplateColumns:"40px 1.7fr 1.3fr 90px 100px 110px 100px",gap:10,alignItems:"center",padding:"11px 14px",borderRadius:12,background:r.priority==="urgent"?"rgba(248,113,113,.04)":isDone?"rgba(255,255,255,.012)":"rgba(255,255,255,.025)",border:r.priority==="urgent"?"1px solid rgba(248,113,113,.18)":"1px solid rgba(255,255,255,.05)",animation:`fadeUp .3s ${idx*.045}s both`,transition:"background .2s",opacity:isDone?.65:1}}
      onMouseOver={e=>{ if(!isDone) e.currentTarget.style.background="rgba(168,85,247,.05)"; }}
      onMouseOut={e=>{ e.currentTarget.style.background=r.priority==="urgent"?"rgba(248,113,113,.04)":isDone?"rgba(255,255,255,.012)":"rgba(255,255,255,.025)"; }}
    >
      <div style={{width:34,height:34,borderRadius:10,background:`${pm.color}12`,border:`1px solid ${pm.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem"}}>
        {r.category==="Radiology"?"🩻":"🧪"}
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
        <div style={{fontSize:".57rem",color:"rgba(255,255,255,.27)",marginTop:1}}>{r.uhid} · {r.age}y {r.g}</div>
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontSize:".68rem",color:"rgba(255,255,255,.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.test}</div>
        <div style={{fontSize:".56rem",color:"rgba(255,255,255,.22)",marginTop:1}}>{r.category} · {r.dept}</div>
      </div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".63rem",color:"rgba(255,255,255,.34)",fontWeight:600}}>{r.date}</div>
      <span style={{padding:"3px 10px",borderRadius:50,textAlign:"center",background:pm.bg,border:`1px solid ${pm.border}`,color:pm.color,fontSize:".57rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{pm.label}</span>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:sm.color,boxShadow:r.status==="pending"?`0 0 7px ${sm.color}`:"",animation:r.status==="pending"?"blink 1.5s step-start infinite":""}}/>
        <span style={{fontSize:".61rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:sm.color}}>{sm.label}</span>
      </div>
      <button onClick={()=>onView(r)}
        style={{padding:"4px 11px",borderRadius:8,background:`${C.ring}0e`,border:`1px solid ${C.ring}28`,color:C.ring,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,transition:"all .2s",whiteSpace:"nowrap"}}
        onMouseOver={e=>e.currentTarget.style.background=`${C.ring}22`}
        onMouseOut={e=>e.currentTarget.style.background=`${C.ring}0e`}>
        View Report
      </button>
    </div>
  );
};


import DoctorSidebar from "./DoctorSidebar";

export default function DoctorReports() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time,         setTime]         = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter,    setCatFilter]    = useState("all");
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState(null);
  const [reports,      setReports]      = useState(ALL_REPORTS);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const markReviewed = (id) =>
    setReports(prev => prev.map(r => r.id===id ? {...r, status:"reviewed"} : r));

  const h        = time.getHours();
  const greeting = h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";

  const pending       = reports.filter(r => r.status==="pending");
  const urgentAll     = reports.filter(r => r.priority==="urgent");
  const reviewed      = reports.filter(r => r.status==="reviewed");
  const urgentPending = urgentAll.filter(r => r.status==="pending");

  const filtered = reports.filter(r => {
    const mS = statusFilter==="all"      ? true
             : statusFilter==="pending"  ? r.status==="pending"
             : statusFilter==="urgent"   ? r.priority==="urgent"
             : r.status==="reviewed";
    const mC = catFilter==="all" ? true : r.category===catFilter;
    const mQ = search.trim()===""
             ? true
             : [r.name,r.test,r.uhid].some(f=>f.toLowerCase().includes(search.toLowerCase()));
    return mS && mC && mQ;
  });

  const tabBtn = (k, l, activeK, setK, ac=C.ring) => (
    <button key={k} onClick={()=>setK(k)}
      style={{padding:"5px 13px",borderRadius:8,border:activeK===k?"1px solid rgba(168,85,247,.3)":"1px solid transparent",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,letterSpacing:".03em",transition:"all .2s",background:activeK===k?"rgba(147,51,234,.14)":"transparent",color:activeK===k?ac:"rgba(255,255,255,.32)"}}
      onMouseOver={e=>{ if(activeK!==k){ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(255,255,255,.65)"; }}}
      onMouseOut={e=>{ if(activeK!==k){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.32)"; }}}
    >{l}</button>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn {from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink   {0%,100%{opacity:1}50%{opacity:.25}}

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:${C.bg}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.22);border-radius:99px}

        .dp{display:flex;height:100vh;overflow:hidden;background:${C.bg};position:relative}

        /* ── MAIN ── */
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:rgba(6,3,15,.96);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(14px);position:relative}
        .dtb::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.ring}42,transparent)}
        .dc{flex:1;overflow-y:auto;padding:1.3rem 1.8rem;display:flex;flex-direction:column;gap:1.1rem}
        .sh{font-family:'Syne',sans-serif;font-size:.65rem;font-weight:800;color:rgba(255,255,255,.24);text-transform:uppercase;letter-spacing:.12em;display:flex;align-items:center;gap:8px;margin-bottom:.65rem}
        .sh::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.045)}

        @media(max-width:768px){.sidebar{display:none}.dc{padding:1rem}}
      `}</style>

      {selected && (
        <ReportModal
          report={selected}
          onClose={()=>setSelected(null)}
          onMarkReviewed={markReviewed}
        />
      )}

      <div className="dp">
        <ParticleBg/>

        <DoctorSidebar active="reports" />

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

          {}
          <div className="dc" style={{animation:"slideIn .36s cubic-bezier(.16,1,.3,1) both"}}>

            {}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:10}}>
                  📋 Patient Reports
                  {urgentPending.length > 0 && (
                    <span style={{padding:"2px 9px",borderRadius:50,background:"rgba(248,113,113,.12)",border:"1px solid rgba(248,113,113,.28)",color:C.red,fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,animation:"blink 2s step-start infinite"}}>
                      {urgentPending.length} Urgent
                    </span>
                  )}
                </div>
                <div style={{fontSize:".7rem",color:"rgba(255,255,255,.3)",marginTop:3}}>Review and manage all patient investigation reports</div>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700,color:`${C.glow}60`}}>
                {DOCTOR.hospital} · {DOCTOR.dept}
              </div>
            </div>

            {}
            <div>
              <div className="sh">Reports Overview — March 2026</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
                {[
                  { label:"Total Reports",  value:reports.length,       sub:"This month",            color:C.glow,  icon:"📋" },
                  { label:"Pending Review", value:pending.length,       sub:"Awaiting sign-off",     color:C.amber, icon:"⏳" },
                  { label:"Urgent Reports", value:urgentPending.length, sub:"Need immediate action", color:C.red,   icon:"🚨" },
                  { label:"Reviewed",       value:reviewed.length,      sub:"Completed",             color:C.green, icon:"✅" },
                ].map((s,i) => (
                  <div key={s.label}
                    style={{background:C.card,border:`1px solid ${s.color}1e`,borderRadius:18,padding:"1.1rem 1.2rem",animation:`fadeUp .4s ${i*.07}s both`,position:"relative",overflow:"hidden",transition:"border-color .2s,box-shadow .2s",cursor:"default"}}
                    onMouseOver={e=>{e.currentTarget.style.borderColor=`${s.color}40`;e.currentTarget.style.boxShadow=`0 0 22px ${s.color}14`;}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor=`${s.color}1e`;e.currentTarget.style.boxShadow="";}}
                  >
                    <div style={{position:"absolute",top:-20,right:-20,width:88,height:88,borderRadius:"50%",background:s.color,filter:"blur(36px)",opacity:.13,pointerEvents:"none"}}/>
                    <div style={{width:42,height:42,borderRadius:13,background:`${s.color}14`,border:`1px solid ${s.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem",marginBottom:".6rem"}}>{s.icon}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.75rem",fontWeight:800,color:"#fff",lineHeight:1,marginBottom:3}}>{s.value}</div>
                    <div style={{fontSize:".68rem",color:"rgba(255,255,255,.42)",marginBottom:3}}>{s.label}</div>
                    <div style={{fontSize:".62rem",color:s.color,fontWeight:600}}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"10px 14px",borderRadius:13,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{display:"flex",gap:3}}>
                {[
                  ["all",      `All (${reports.length})`          ],
                  ["pending",  `Pending (${pending.length})`      ],
                  ["urgent",   `Urgent (${urgentPending.length})` ],
                  ["reviewed", `Reviewed (${reviewed.length})`    ],
                ].map(([k,l]) => tabBtn(k,l,statusFilter,setStatusFilter))}
              </div>
              <div style={{width:1,height:22,background:"rgba(255,255,255,.07)",flexShrink:0}}/>
              <div style={{display:"flex",gap:3}}>
                {[["all","All Types"],["Lab","🧪 Lab"],["Radiology","🩻 Radiology"]].map(([k,l]) => tabBtn(k,l,catFilter,setCatFilter,C.indigo))}
              </div>
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7,padding:"5px 11px",borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
                <span style={{fontSize:".78rem",opacity:.4}}>🔍</span>
                <input
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder="Search patient, test, UHID…"
                  style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:".68rem",fontFamily:"'DM Sans',sans-serif",width:195}}
                />
                {search && <button onClick={()=>setSearch("")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".75rem",lineHeight:1,padding:0}}>✕</button>}
              </div>
            </div>

            {}
            <div>
              <div style={{display:"grid",gridTemplateColumns:"40px 1.7fr 1.3fr 90px 100px 110px 100px",gap:10,padding:"5px 14px",marginBottom:".4rem"}}>
                {["","Patient","Test / Investigation","Date","Priority","Status","Action"].map((hd,i) => (
                  <span key={i} style={{fontFamily:"'Syne',sans-serif",fontSize:".57rem",fontWeight:800,color:"rgba(255,255,255,.2)",textTransform:"uppercase",letterSpacing:".09em"}}>{hd}</span>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:"3.5rem",color:"rgba(255,255,255,.2)"}}>
                  <div style={{fontSize:"2.5rem"}}>🗂️</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".88rem",fontWeight:700}}>No reports found</div>
                  <div style={{fontSize:".7rem"}}>Try adjusting your filters or search term</div>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {filtered.map((r,i) => <ReportRow key={r.id} r={r} idx={i} onView={setSelected}/>)}
                </div>
              )}
            </div>

            {}
            <div style={{padding:"9px 15px",borderRadius:12,background:"rgba(255,255,255,.015)",border:`1px solid ${C.faint}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.ring}10`,border:`1px solid ${C.ring}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem"}}>🏥</div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:800,color:"rgba(255,255,255,.55)"}}>{DOCTOR.hospital} · {DOCTOR.dept}</div>
                  <div style={{fontSize:".57rem",color:"rgba(255,255,255,.22)",marginTop:1}}>Reg: {DOCTOR.regNo} · Showing {filtered.length} of {reports.length} reports</div>
                </div>
              </div>
              {urgentPending.length > 0 && (
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:".62rem",color:C.red,fontFamily:"'Syne',sans-serif",fontWeight:700}}>
                  <span style={{animation:"blink 1s step-start infinite"}}>🔴</span>
                  {urgentPending.length} urgent report(s) require immediate attention
                </div>
              )}
            </div>

          </div>{}
        </div>{}
      </div>{}
    </>
  );
}
