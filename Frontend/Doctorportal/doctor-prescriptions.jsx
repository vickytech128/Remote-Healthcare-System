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


const ALL_PRESCRIPTIONS = [
  {
    id:"RX-2026-001",
    name:"Rajan Mehta",          uhid:"CGH-0231", age:54, g:"M",
    date:"Mar 14, 2026",         validTill:"Apr 13, 2026",
    diagnosis:"Type 2 DM + Diabetic Foot Infection",
    status:"active",             refills:2, refillsUsed:0,
    pharmacy:"CGH Pharmacy",
    drugs:[
      { name:"Piperacillin-Tazobactam", dose:"4.5g", freq:"Every 8 hrs", route:"IV",   duration:"7 days",  type:"antibiotic" },
      { name:"Metformin 500mg",         dose:"500mg", freq:"Twice daily", route:"Oral", duration:"30 days", type:"antidiabetic"},
      { name:"Insulin Glargine",        dose:"20 IU", freq:"Once at night",route:"SC",  duration:"30 days", type:"insulin"    },
      { name:"Pantoprazole 40mg",       dose:"40mg",  freq:"Once daily",  route:"Oral", duration:"14 days", type:"gastroprotective"},
    ],
    notes:"Monitor blood glucose every 4 hrs. Wound dressing twice daily. Avoid NSAIDs.",
    followUp:"Mar 21, 2026",
  },
  {
    id:"RX-2026-002",
    name:"Meena Krishnan",       uhid:"CGH-0412", age:35, g:"F",
    date:"Mar 14, 2026",         validTill:"Apr 13, 2026",
    diagnosis:"PCOD + Insulin Resistance",
    status:"active",             refills:3, refillsUsed:0,
    pharmacy:"MedPlus, Anna Nagar",
    drugs:[
      { name:"Metformin 500mg",       dose:"500mg", freq:"Twice daily",      route:"Oral", duration:"90 days", type:"antidiabetic" },
      { name:"Spironolactone 50mg",   dose:"50mg",  freq:"Once daily",       route:"Oral", duration:"90 days", type:"antiandrogen" },
      { name:"Inositol + Folic Acid", dose:"2g",    freq:"Once daily (AM)",  route:"Oral", duration:"90 days", type:"supplement"   },
    ],
    notes:"Low-carb diet advised. Recheck LH/FSH and fasting insulin at 3 months. Avoid OCP unless discussed.",
    followUp:"Jun 14, 2026",
  },
  {
    id:"RX-2026-003",
    name:"Vikram Choudhry",      uhid:"CGH-0501", age:48, g:"M",
    date:"Mar 12, 2026",         validTill:"Apr 11, 2026",
    diagnosis:"Adrenal Mass — Post Biopsy",
    status:"active",             refills:1, refillsUsed:0,
    pharmacy:"CGH Pharmacy",
    drugs:[
      { name:"Hydrocortisone 20mg", dose:"20mg", freq:"Morning 15mg + Evening 5mg", route:"Oral", duration:"30 days", type:"steroid"     },
      { name:"Pantoprazole 40mg",   dose:"40mg", freq:"Once daily",                 route:"Oral", duration:"30 days", type:"gastroprotective"},
      { name:"Calcium + Vit D3",    dose:"500mg",freq:"Once daily",                 route:"Oral", duration:"30 days", type:"supplement"   },
    ],
    notes:"Carry steroid card at all times. Do not stop abruptly. Review after biopsy report. Watch for adrenal crisis signs.",
    followUp:"Mar 26, 2026",
  },
  {
    id:"RX-2026-004",
    name:"Priya Sharma",         uhid:"CGH-0118", age:29, g:"F",
    date:"Mar 12, 2026",         validTill:"Jun 11, 2026",
    diagnosis:"Hypothyroidism (Hashimoto's)",
    status:"active",             refills:2, refillsUsed:1,
    pharmacy:"Apollo Pharmacy",
    drugs:[
      { name:"Levothyroxine 75mcg", dose:"75mcg", freq:"Once daily (empty stomach)", route:"Oral", duration:"90 days", type:"thyroid"  },
      { name:"Selenium 200mcg",     dose:"200mcg",freq:"Once daily",                  route:"Oral", duration:"90 days", type:"supplement"},
    ],
    notes:"Take 30 min before breakfast. Avoid calcium/iron supplements within 4 hrs. Recheck TSH at 6 weeks.",
    followUp:"Apr 23, 2026",
  },
  {
    id:"RX-2026-005",
    name:"Suresh Pillai",        uhid:"CGH-0389", age:61, g:"M",
    date:"Mar 08, 2026",         validTill:"Jun 07, 2026",
    diagnosis:"Type 2 DM — Quarterly Review",
    status:"active",             refills:2, refillsUsed:0,
    pharmacy:"MedPlus, T Nagar",
    drugs:[
      { name:"Metformin 1000mg",    dose:"1000mg", freq:"Twice daily (with meals)", route:"Oral", duration:"90 days", type:"antidiabetic"  },
      { name:"Glimepiride 2mg",     dose:"2mg",    freq:"Once daily (before bkfst)",route:"Oral", duration:"90 days", type:"antidiabetic"  },
      { name:"Telmisartan 40mg",    dose:"40mg",   freq:"Once daily",               route:"Oral", duration:"90 days", type:"antihypertensive"},
      { name:"Atorvastatin 10mg",   dose:"10mg",   freq:"Once at night",            route:"Oral", duration:"90 days", type:"statin"        },
    ],
    notes:"BP and glucose home monitoring daily. Diet: low sugar, low salt. Foot examination monthly.",
    followUp:"Jun 08, 2026",
  },
  {
    id:"RX-2026-006",
    name:"Anjali Verma",         uhid:"CGH-0304", age:42, g:"F",
    date:"Mar 05, 2026",         validTill:"Jun 04, 2026",
    diagnosis:"Thyroid Nodule — Observation",
    status:"active",             refills:1, refillsUsed:1,
    pharmacy:"CGH Pharmacy",
    drugs:[
      { name:"Levothyroxine 50mcg", dose:"50mcg", freq:"Once daily (empty stomach)", route:"Oral", duration:"90 days", type:"thyroid"   },
      { name:"Vitamin D3 60000 IU", dose:"60000 IU",freq:"Once weekly",              route:"Oral", duration:"8 weeks", type:"supplement" },
    ],
    notes:"TSH suppression therapy. Keep TSH between 0.5–1.0. Repeat USG thyroid at 6 months.",
    followUp:"Sep 05, 2026",
  },
  {
    id:"RX-2026-007",
    name:"Alex Johnson",         uhid:"CGH-0042", age:37, g:"M",
    date:"Mar 01, 2026",         validTill:"May 31, 2026",
    diagnosis:"Type 2 DM + Dyslipidaemia",
    status:"completed",          refills:0, refillsUsed:2,
    pharmacy:"Apollo Pharmacy",
    drugs:[
      { name:"Metformin 500mg",   dose:"500mg", freq:"Twice daily",  route:"Oral", duration:"60 days", type:"antidiabetic"},
      { name:"Rosuvastatin 10mg", dose:"10mg",  freq:"Once at night",route:"Oral", duration:"60 days", type:"statin"      },
      { name:"Omega-3 1000mg",    dose:"1000mg",freq:"Once daily",   route:"Oral", duration:"60 days", type:"supplement"  },
    ],
    notes:"Repeat HbA1c and Lipid profile after 60 days. Dietary modifications — Mediterranean diet recommended.",
    followUp:"May 01, 2026",
  },
  {
    id:"RX-2026-008",
    name:"Fatima Naqvi",         uhid:"CGH-0567", age:23, g:"F",
    date:"Mar 14, 2026",         validTill:"Jun 13, 2026",
    diagnosis:"New Patient — PCOD Workup",
    status:"active",             refills:2, refillsUsed:0,
    pharmacy:"MedPlus, Adyar",
    drugs:[
      { name:"Metformin 500mg (SR)",  dose:"500mg", freq:"Once daily (with dinner)", route:"Oral", duration:"90 days", type:"antidiabetic"},
      { name:"Folic Acid 5mg",        dose:"5mg",   freq:"Once daily",               route:"Oral", duration:"90 days", type:"supplement" },
      { name:"Evening Primrose Oil",  dose:"1000mg",freq:"Once daily",               route:"Oral", duration:"90 days", type:"supplement" },
    ],
    notes:"Lifestyle changes paramount — weight management and regular exercise. Recheck hormones at 3 months.",
    followUp:"Jun 14, 2026",
  },
];


const DRUG_TYPE = {
  antibiotic:       { color:"#f87171", bg:"rgba(248,113,113,.09)" },
  antidiabetic:     { color:"#c084fc", bg:"rgba(192,132,252,.09)" },
  insulin:          { color:"#818cf8", bg:"rgba(129,140,248,.09)" },
  gastroprotective: { color:"#34d399", bg:"rgba(52,211,153,.08)"  },
  antiandrogen:     { color:"#f472b6", bg:"rgba(244,114,182,.09)" },
  supplement:       { color:"#fbbf24", bg:"rgba(251,191,36,.08)"  },
  steroid:          { color:"#fb923c", bg:"rgba(251,146,60,.09)"  },
  thyroid:          { color:"#a855f7", bg:"rgba(168,85,247,.09)"  },
  antihypertensive: { color:"#38bdf8", bg:"rgba(56,189,248,.08)"  },
  statin:           { color:"#4ade80", bg:"rgba(74,222,128,.08)"  },
};
const STAT_COLOR = {
  active:    { color:C.green,  bg:"rgba(52,211,153,.1)",   label:"Active"    },
  completed: { color:C.indigo, bg:"rgba(129,140,248,.1)",  label:"Completed" },
  expired:   { color:C.red,    bg:"rgba(248,113,113,.1)",  label:"Expired"   },
};
const ROUTE_ICON = { Oral:"💊", IV:"💉", SC:"💉", Topical:"🧴" };


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


const PrescriptionModal = ({ rx, onClose }) => {
  if (!rx) return null;
  const sc = STAT_COLOR[rx.status] || STAT_COLOR.active;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(7,4,16,.88)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:600,background:"rgba(11,7,24,.99)",border:`1px solid rgba(168,85,247,.25)`,borderRadius:22,boxShadow:`0 0 60px rgba(147,51,234,.2),0 24px 48px rgba(0,0,0,.7)`,overflow:"hidden",animation:"fadeUp .28s both"}}>

        {}
        <div style={{padding:"1.2rem 1.4rem",borderBottom:"1px solid rgba(255,255,255,.05)",background:"rgba(147,51,234,.06)",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:13,background:"rgba(168,85,247,.14)",border:"1px solid rgba(168,85,247,.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem"}}>💊</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".88rem",fontWeight:800,color:"#fff"}}>{rx.name}</div>
              <div style={{fontSize:".6rem",color:"rgba(255,255,255,.35)",marginTop:2}}>{rx.uhid} · {rx.age}y {rx.g} · {rx.id}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{padding:"3px 10px",borderRadius:50,background:sc.bg,color:sc.color,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{sc.label}</span>
            <button onClick={onClose} style={{width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:".85rem",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
          </div>
        </div>

        {}
        <div style={{padding:"1.2rem 1.4rem",display:"flex",flexDirection:"column",gap:"1rem",maxHeight:"72vh",overflowY:"auto"}}>

          {}
          <div style={{padding:"10px 13px",borderRadius:11,background:"rgba(168,85,247,.05)",border:"1px solid rgba(168,85,247,.12)"}}>
            <div style={{fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:`${C.glow}70`,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Diagnosis</div>
            <div style={{fontSize:".78rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff"}}>{rx.diagnosis}</div>
          </div>

          {}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[
              { label:"Prescribed On",  value:rx.date       },
              { label:"Valid Till",     value:rx.validTill  },
              { label:"Follow-up",      value:rx.followUp   },
              { label:"Pharmacy",       value:rx.pharmacy   },
              { label:"Refills",        value:`${rx.refills - rx.refillsUsed} remaining` },
              { label:"Dispensed",      value:`${rx.refillsUsed} of ${rx.refills}`        },
            ].map(({label,value}) => (
              <div key={label} style={{padding:"8px 11px",borderRadius:9,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontSize:".55rem",color:"rgba(255,255,255,.25)",fontFamily:"'Syne',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>{label}</div>
                <div style={{fontSize:".7rem",color:"rgba(255,255,255,.75)",fontWeight:600}}>{value}</div>
              </div>
            ))}
          </div>

          {}
          <div>
            <div style={{fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".6rem"}}>Medications ({rx.drugs.length})</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {rx.drugs.map((d,i) => {
                const dt = DRUG_TYPE[d.type] || {color:C.glow,bg:"rgba(192,132,252,.08)"};
                return (
                  <div key={i} style={{display:"grid",gridTemplateColumns:"28px 1fr",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:11,background:"rgba(255,255,255,.025)",border:`1px solid rgba(255,255,255,.05)`}}>
                    <div style={{width:28,height:28,borderRadius:8,background:dt.bg,border:`1px solid ${dt.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".8rem",flexShrink:0}}>
                      {ROUTE_ICON[d.route] || "💊"}
                    </div>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
                        <span style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"#fff"}}>{d.name}</span>
                        <span style={{padding:"1px 7px",borderRadius:50,background:dt.bg,color:dt.color,fontSize:".55rem",fontFamily:"'Syne',sans-serif",fontWeight:700,border:`1px solid ${dt.color}22`}}>{d.type}</span>
                      </div>
                      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                        {[
                          {icon:"⚖",  val:d.dose    },
                          {icon:"🔄", val:d.freq    },
                          {icon:"🛤",  val:d.route   },
                          {icon:"📅", val:d.duration},
                        ].map(({icon,val}) => (
                          <span key={val} style={{fontSize:".62rem",color:"rgba(255,255,255,.45)"}}>{icon} {val}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {}
          <div style={{padding:"10px 13px",borderRadius:11,background:"rgba(251,191,36,.04)",border:"1px solid rgba(251,191,36,.12)"}}>
            <div style={{fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:`${C.amber}90`,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>📝 Doctor's Notes</div>
            <div style={{fontSize:".7rem",color:"rgba(255,255,255,.6)",lineHeight:1.65}}>{rx.notes}</div>
          </div>

          {/* action buttons */}
          <div style={{display:"flex",gap:8,paddingTop:4}}>
            <button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:11,background:`linear-gradient(135deg,${C.accent},${C.ring})`,border:"none",color:"#fff",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,boxShadow:`0 0 20px ${C.ring}30`}}>
              🖨 Print Prescription
            </button>
            <button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:11,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",color:"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:700}}>
              📄 Download PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   PRESCRIPTION ROW
══════════════════════════════════════ */
const PrescriptionRow = ({ rx, idx, onView }) => {
  const sc   = STAT_COLOR[rx.status] || STAT_COLOR.active;
  const done = rx.status === "completed";
  return (
    <div
      style={{display:"grid",gridTemplateColumns:"40px 1.6fr 1.4fr 80px 70px 90px 110px 100px",gap:10,alignItems:"center",padding:"11px 14px",borderRadius:12,background:done?"rgba(255,255,255,.012)":"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.05)",animation:`fadeUp .3s ${idx*.045}s both`,transition:"background .2s",opacity:done?.65:1}}
      onMouseOver={e=>{ if(!done) e.currentTarget.style.background="rgba(168,85,247,.05)"; }}
      onMouseOut={e=>{ e.currentTarget.style.background=done?"rgba(255,255,255,.012)":"rgba(255,255,255,.025)"; }}
    >
      {/* icon */}
      <div style={{width:34,height:34,borderRadius:10,background:"rgba(168,85,247,.1)",border:"1px solid rgba(168,85,247,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem"}}>💊</div>

      {/* patient */}
      <div style={{minWidth:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{rx.name}</div>
        <div style={{fontSize:".57rem",color:"rgba(255,255,255,.27)",marginTop:1}}>{rx.uhid} · {rx.age}y {rx.g}</div>
      </div>

      {/* diagnosis */}
      <div style={{minWidth:0}}>
        <div style={{fontSize:".67rem",color:"rgba(255,255,255,.58)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{rx.diagnosis}</div>
        <div style={{fontSize:".56rem",color:"rgba(255,255,255,.22)",marginTop:1}}>{rx.drugs.length} drug{rx.drugs.length>1?"s":""} · {rx.pharmacy}</div>
      </div>

      {/* date */}
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",color:"rgba(255,255,255,.34)",fontWeight:600,whiteSpace:"nowrap"}}>{rx.date}</div>

      {/* drugs count badge */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{padding:"3px 9px",borderRadius:50,background:"rgba(168,85,247,.1)",border:"1px solid rgba(168,85,247,.22)",color:C.glow,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{rx.drugs.length} Rx</span>
      </div>

      {/* refills */}
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",color:"rgba(255,255,255,.4)",textAlign:"center"}}>
        <span style={{color:rx.refills-rx.refillsUsed>0?C.green:"rgba(255,255,255,.25)",fontWeight:700}}>{rx.refills-rx.refillsUsed}</span>
        <span style={{color:"rgba(255,255,255,.22)"}}> / {rx.refills}</span>
        <div style={{fontSize:".52rem",color:"rgba(255,255,255,.22)",marginTop:1}}>refills</div>
      </div>

      {/* status */}
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:sc.color,boxShadow:rx.status==="active"?`0 0 7px ${sc.color}`:"",animation:rx.status==="active"?"blink 2s step-start infinite":""}}/>
        <span style={{fontSize:".61rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:sc.color,whiteSpace:"nowrap"}}>{sc.label}</span>
      </div>

      {/* action */}
      <button onClick={()=>onView(rx)}
        style={{padding:"4px 11px",borderRadius:8,background:`${C.ring}0e`,border:`1px solid ${C.ring}28`,color:C.ring,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,transition:"all .2s",whiteSpace:"nowrap"}}
        onMouseOver={e=>e.currentTarget.style.background=`${C.ring}22`}
        onMouseOut={e=>e.currentTarget.style.background=`${C.ring}0e`}>
        View Rx
      </button>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
import DoctorSidebar from "./DoctorSidebar";

export default function DoctorPrescriptions() {
  const navigate = useNavigate();
  const [time,        setTime]        = useState(new Date());
  const [statFilter,  setStatFilter]  = useState("all");
  const [search,      setSearch]      = useState("");
  const [selected,    setSelected]    = useState(null);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h        = time.getHours();
  const greeting = h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";

  const active    = ALL_PRESCRIPTIONS.filter(r => r.status==="active");
  const completed = ALL_PRESCRIPTIONS.filter(r => r.status==="completed");

  const filtered = ALL_PRESCRIPTIONS.filter(rx => {
    const mS = statFilter==="all"       ? true
             : statFilter==="active"    ? rx.status==="active"
             : rx.status==="completed";
    const mQ = search.trim()===""
             ? true
             : [rx.name, rx.uhid, rx.diagnosis, rx.id].some(f => f.toLowerCase().includes(search.toLowerCase()));
    return mS && mQ;
  });

  const tabBtn = (k, l, activeK, setK) => (
    <button key={k} onClick={()=>setK(k)}
      style={{padding:"5px 13px",borderRadius:8,border:activeK===k?"1px solid rgba(168,85,247,.3)":"1px solid transparent",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,letterSpacing:".03em",transition:"all .2s",background:activeK===k?"rgba(147,51,234,.14)":"transparent",color:activeK===k?C.ring:"rgba(255,255,255,.32)"}}
      onMouseOver={e=>{ if(activeK!==k){ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(255,255,255,.65)"; }}}
      onMouseOut={e=>{ if(activeK!==k){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.32)"; }}}
    >{l}</button>
  );

  /* total unique drugs across all active Rx */
  const totalDrugs = active.reduce((s, rx) => s + rx.drugs.length, 0);
  /* refills pending */
  const refillsPending = active.filter(rx => rx.refills - rx.refillsUsed > 0).length;

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

        /* MAIN */
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:rgba(6,3,15,.96);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(14px);position:relative}
        .dtb::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.ring}42,transparent)}
        .dc{flex:1;overflow-y:auto;padding:1.3rem 1.8rem;display:flex;flex-direction:column;gap:1.1rem}
        .sh{font-family:'Syne',sans-serif;font-size:.65rem;font-weight:800;color:rgba(255,255,255,.24);text-transform:"uppercase",letterSpacing:".12em",display:"flex",alignItems:"center",gap:8px,marginBottom:".65rem"}
        .sh::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.045)}

        @media(max-width:768px){.sidebar{display:none}.dc{padding:1rem}}
      `}</style>

      {/* modal */}
      {selected && <PrescriptionModal rx={selected} onClose={()=>setSelected(null)}/>}

      <div className="dp">
        <ParticleBg/>

        <DoctorSidebar active="prescriptions" />

        {/* ══════════ MAIN ══════════ */}
        <div className="dm">

          {/* topbar */}
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

          {/* ── PRESCRIPTIONS CONTENT ── */}
          <div className="dc" style={{animation:"slideIn .36s cubic-bezier(.16,1,.3,1) both"}}>

            {/* page heading */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:10}}>
                  💊 Patient Prescriptions
                </div>
                <div style={{fontSize:".7rem",color:"rgba(255,255,255,.3)",marginTop:3}}>View and manage all issued prescriptions</div>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700,color:`${C.glow}60`}}>
                {DOCTOR.hospital} · {DOCTOR.dept}
              </div>
            </div>

            {/* stat cards */}
            <div>
              <div className="sh">Prescriptions Overview — March 2026</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
                {[
                  { label:"Total Issued",   value:ALL_PRESCRIPTIONS.length, sub:"This month",           color:C.glow,   icon:"💊" },
                  { label:"Active Rx",      value:active.length,            sub:"Currently running",    color:C.green,  icon:"✅" },
                  { label:"Total Drugs",    value:totalDrugs,               sub:"Across active Rx",     color:C.indigo, icon:"💉" },
                  { label:"Refills Open",   value:refillsPending,           sub:"Patients with refills",color:C.amber,  icon:"🔄" },
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

            {/* filter + search */}
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"10px 14px",borderRadius:13,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{display:"flex",gap:3}}>
                {[
                  ["all",       `All (${ALL_PRESCRIPTIONS.length})`],
                  ["active",    `Active (${active.length})`        ],
                  ["completed", `Completed (${completed.length})`  ],
                ].map(([k,l]) => tabBtn(k,l,statFilter,setStatFilter))}
              </div>
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7,padding:"5px 11px",borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
                <span style={{fontSize:".78rem",opacity:.4}}>🔍</span>
                <input
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder="Search patient, diagnosis, Rx ID…"
                  style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:".68rem",fontFamily:"'DM Sans',sans-serif",width:210}}
                />
                {search && <button onClick={()=>setSearch("")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".75rem",lineHeight:1,padding:0}}>✕</button>}
              </div>
            </div>

            {/* table */}
            <div>
              {/* column headers */}
              <div style={{display:"grid",gridTemplateColumns:"40px 1.6fr 1.4fr 80px 70px 90px 110px 100px",gap:10,padding:"5px 14px",marginBottom:".4rem"}}>
                {["","Patient","Diagnosis","Date","Drugs","Refills","Status","Action"].map((hd,i) => (
                  <span key={i} style={{fontFamily:"'Syne',sans-serif",fontSize:".57rem",fontWeight:800,color:"rgba(255,255,255,.2)",textTransform:"uppercase",letterSpacing:".09em"}}>{hd}</span>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:"3.5rem",color:"rgba(255,255,255,.2)"}}>
                  <div style={{fontSize:"2.5rem"}}>📭</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".88rem",fontWeight:700}}>No prescriptions found</div>
                  <div style={{fontSize:".7rem"}}>Try adjusting the filter or search term</div>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {filtered.map((rx,i) => <PrescriptionRow key={rx.id} rx={rx} idx={i} onView={setSelected}/>)}
                </div>
              )}
            </div>

            {/* footer */}
            <div style={{padding:"9px 15px",borderRadius:12,background:"rgba(255,255,255,.015)",border:`1px solid ${C.faint}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.ring}10`,border:`1px solid ${C.ring}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem"}}>🏥</div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:800,color:"rgba(255,255,255,.55)"}}>{DOCTOR.hospital} · {DOCTOR.dept}</div>
                  <div style={{fontSize:".57rem",color:"rgba(255,255,255,.22)",marginTop:1}}>Reg: {DOCTOR.regNo} · Showing {filtered.length} of {ALL_PRESCRIPTIONS.length} prescriptions</div>
                </div>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".64rem",fontWeight:700,color:`${C.glow}55`}}>
                ⭐ {DOCTOR.rating} · {DOCTOR.exp} Experience
              </div>
            </div>

          </div>{}
        </div>{}
      </div>{}
    </>
  );
}
