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
  name:      "Dr. Sarah Mitchell",
  initials:  "SM",
  specialty: "Endocrinology",
  hospital:  "City General Hospital",
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


const PATIENTS = [
  {
    id:"CGH-0042", name:"Alex Johnson",    age:37, gender:"Male",   blood:"O+",
    phone:"+91 98765-43210", email:"alex.j@email.com",
    condition:"Type 2 Diabetes · Hypothyroidism · Dyslipidaemia",
    medications:["Metformin 500mg","Atorvastatin 20mg","Levothyroxine 50mcg","Amlodipine 5mg"],
    lastVisit:"Mar 01, 2026", nextAppt:"Mar 28, 2026", priority:"high",
    hba1c:"7.2%", bp:"118/76", weight:"82 kg", bmi:"26.4", visits:14, since:"Jan 2025",
    notes:"HbA1c improving. Lipid profile borderline. TSH slightly elevated — dose review next visit.",
    vitals:[{l:"HbA1c",v:"7.2%",r:"<5.7%",f:"H"},{l:"TSH",v:"6.8",r:"0.4–4.0",f:"H"},{l:"LDL",v:"132",r:"<100",f:"H"},{l:"BP",v:"118/76",r:"<120/80",f:"N"}],
  },
  {
    id:"CGH-0118", name:"Priya Sharma",    age:29, gender:"Female", blood:"B+",
    phone:"+91 87654-32109", email:"priya.s@email.com",
    condition:"Hypothyroidism (Primary)",
    medications:["Levothyroxine 75mcg","Calcium + Vit D"],
    lastVisit:"Feb 12, 2026", nextAppt:"Apr 10, 2026", priority:"normal",
    hba1c:"—", bp:"112/72", weight:"58 kg", bmi:"21.5", visits:6, since:"Aug 2024",
    notes:"TSH normalising on current dose. Repeat TFT in 8 weeks. No other concerns.",
    vitals:[{l:"TSH",v:"3.2",r:"0.4–4.0",f:"N"},{l:"Free T4",v:"1.1",r:"0.8–1.8",f:"N"},{l:"BP",v:"112/72",r:"<120/80",f:"N"},{l:"Weight",v:"58 kg",r:"—",f:"N"}],
  },
  {
    id:"CGH-0231", name:"Rajan Mehta",     age:54, gender:"Male",   blood:"A-",
    phone:"+91 76543-21098", email:"rajan.m@email.com",
    condition:"Type 2 Diabetes · Peripheral Neuropathy · Hypertension",
    medications:["Metformin 1000mg","Glimepiride 2mg","Amlodipine 10mg","Pregabalin 75mg"],
    lastVisit:"Mar 14, 2026", nextAppt:"Mar 21, 2026", priority:"urgent",
    hba1c:"9.1%", bp:"148/92", weight:"96 kg", bmi:"31.2", visits:22, since:"Mar 2023",
    notes:"Blood sugar spiking. Diabetic foot review required. BP elevated. Urgent follow-up.",
    vitals:[{l:"HbA1c",v:"9.1%",r:"<5.7%",f:"H"},{l:"FBS",v:"248",r:"70–100",f:"H"},{l:"BP",v:"148/92",r:"<120/80",f:"H"},{l:"BMI",v:"31.2",r:"<25",f:"H"}],
  },
  {
    id:"CGH-0304", name:"Anjali Verma",    age:42, gender:"Female", blood:"O-",
    phone:"+91 65432-10987", email:"anjali.v@email.com",
    condition:"Thyroid Nodule (Follow-up) · Subclinical Hypothyroidism",
    medications:["Levothyroxine 25mcg"],
    lastVisit:"Mar 05, 2026", nextAppt:"Apr 05, 2026", priority:"normal",
    hba1c:"—", bp:"116/74", weight:"64 kg", bmi:"23.8", visits:9, since:"Oct 2023",
    notes:"Thyroid nodule stable on ultrasound. Continue low-dose Levothyroxine. Annual review.",
    vitals:[{l:"TSH",v:"4.8",r:"0.4–4.0",f:"H"},{l:"Free T4",v:"0.9",r:"0.8–1.8",f:"N"},{l:"BP",v:"116/74",r:"<120/80",f:"N"},{l:"Nodule",v:"8mm",r:"<10mm",f:"N"}],
  },
  {
    id:"CGH-0389", name:"Suresh Pillai",   age:61, gender:"Male",   blood:"AB+",
    phone:"+91 54321-09876", email:"suresh.p@email.com",
    condition:"Type 2 Diabetes · CKD Stage 2 · Dyslipidaemia",
    medications:["Sitagliptin 100mg","Rosuvastatin 10mg","Furosemide 20mg"],
    lastVisit:"Mar 14, 2026", nextAppt:"Mar 28, 2026", priority:"high",
    hba1c:"7.8%", bp:"126/80", weight:"74 kg", bmi:"25.1", visits:18, since:"May 2023",
    notes:"KFT mildly deranged. Adjusted diuretic dose. Monitor creatinine every 4 weeks.",
    vitals:[{l:"HbA1c",v:"7.8%",r:"<5.7%",f:"H"},{l:"eGFR",v:"62",r:">60",f:"N"},{l:"Creatinine",v:"1.4",r:"0.7–1.2",f:"H"},{l:"BP",v:"126/80",r:"<120/80",f:"H"}],
  },
  {
    id:"CGH-0412", name:"Meena Krishnan",  age:35, gender:"Female", blood:"B-",
    phone:"+91 43210-98765", email:"meena.k@email.com",
    condition:"PCOD · Insulin Resistance · Obesity",
    medications:["Metformin 500mg","Inositol 2g","OCP (Yasmin)"],
    lastVisit:"Mar 14, 2026", nextAppt:"Apr 14, 2026", priority:"high",
    hba1c:"5.9%", bp:"122/78", weight:"79 kg", bmi:"28.9", visits:5, since:"Dec 2024",
    notes:"Insulin elevated at 48 µIU/mL. Lifestyle counselling initiated. Weight management plan started.",
    vitals:[{l:"Fasting Insulin",v:"48",r:"<25",f:"H"},{l:"LH:FSH",v:"2.8",r:"<2",f:"H"},{l:"BMI",v:"28.9",r:"<25",f:"H"},{l:"BP",v:"122/78",r:"<120/80",f:"N"}],
  },
  {
    id:"CGH-0501", name:"Vikram Choudhry", age:48, gender:"Male",   blood:"A+",
    phone:"+91 32109-87654", email:"vikram.c@email.com",
    condition:"Adrenal Mass (Under Investigation) · Hypertension",
    medications:["Amlodipine 5mg","Spironolactone 25mg"],
    lastVisit:"Mar 14, 2026", nextAppt:"Mar 17, 2026", priority:"urgent",
    hba1c:"—", bp:"156/98", weight:"88 kg", bmi:"27.3", visits:4, since:"Feb 2026",
    notes:"CT biopsy results awaited. High suspicion of adrenal adenoma. Urgent endocrine workup.",
    vitals:[{l:"BP",v:"156/98",r:"<120/80",f:"H"},{l:"Cortisol",v:"28",r:"6–23",f:"H"},{l:"Aldosterone",v:"High",r:"Normal",f:"H"},{l:"BMI",v:"27.3",r:"<25",f:"H"}],
  },
  {
    id:"CGH-0567", name:"Fatima Naqvi",    age:23, gender:"Female", blood:"O+",
    phone:"+91 21098-76543", email:"fatima.n@email.com",
    condition:"New Patient – Irregular Menstrual Cycle",
    medications:["—"],
    lastVisit:"Mar 14, 2026", nextAppt:"Mar 28, 2026", priority:"normal",
    hba1c:"—", bp:"108/68", weight:"52 kg", bmi:"19.8", visits:1, since:"Mar 2026",
    notes:"New patient. Hormonal panel ordered. Awaiting results. Rule out PCOD and thyroid disorder.",
    vitals:[{l:"TSH",v:"Pending",r:"0.4–4.0",f:"N"},{l:"Hormones",v:"Pending",r:"—",f:"N"},{l:"BP",v:"108/68",r:"<120/80",f:"N"},{l:"BMI",v:"19.8",r:"18.5–24.9",f:"N"}],
  },
  {
    id:"CGH-0631", name:"Dinesh Rao",      age:52, gender:"Male",   blood:"B+",
    phone:"+91 19876-54321", email:"dinesh.r@email.com",
    condition:"Type 2 Diabetes · Fatty Liver (NAFLD)",
    medications:["Metformin 500mg","Vitamin E 400IU","Ursodeoxycholic Acid 300mg"],
    lastVisit:"Feb 20, 2026", nextAppt:"Mar 30, 2026", priority:"normal",
    hba1c:"6.8%", bp:"120/78", weight:"86 kg", bmi:"27.9", visits:11, since:"Jun 2023",
    notes:"LFT improving. HbA1c trending down from 7.4. Dietary compliance good.",
    vitals:[{l:"HbA1c",v:"6.8%",r:"<5.7%",f:"H"},{l:"SGPT",v:"48",r:"7–56",f:"N"},{l:"BMI",v:"27.9",r:"<25",f:"H"},{l:"BP",v:"120/78",r:"<120/80",f:"N"}],
  },
  {
    id:"CGH-0712", name:"Sunita Agarwal",  age:46, gender:"Female", blood:"A+",
    phone:"+91 98012-34567", email:"sunita.a@email.com",
    condition:"Graves' Disease · Hyperthyroidism",
    medications:["Carbimazole 20mg","Propranolol 40mg"],
    lastVisit:"Mar 10, 2026", nextAppt:"Mar 24, 2026", priority:"high",
    hba1c:"—", bp:"110/70", weight:"55 kg", bmi:"20.4", visits:8, since:"Sep 2024",
    notes:"TSH suppressed. Free T4 elevated. Carbimazole dose increased. HR controlled on propranolol.",
    vitals:[{l:"TSH",v:"<0.01",r:"0.4–4.0",f:"L"},{l:"Free T4",v:"3.2",r:"0.8–1.8",f:"H"},{l:"HR",v:"88 bpm",r:"60–100",f:"N"},{l:"Weight",v:"55 kg",r:"—",f:"N"}],
  },
  {
    id:"CGH-0834", name:"Harish Bose",     age:39, gender:"Male",   blood:"O+",
    phone:"+91 97654-32101", email:"harish.b@email.com",
    condition:"Hashimoto's Thyroiditis · Hypothyroidism",
    medications:["Levothyroxine 100mcg","Selenium 200mcg"],
    lastVisit:"Mar 08, 2026", nextAppt:"Mar 30, 2026", priority:"normal",
    hba1c:"—", bp:"118/76", weight:"76 kg", bmi:"24.2", visits:7, since:"Nov 2023",
    notes:"TPO antibodies elevated. TSH normalised on Levothyroxine. Stable.",
    vitals:[{l:"TSH",v:"2.1",r:"0.4–4.0",f:"N"},{l:"TPO Ab",v:"320",r:"<35",f:"H"},{l:"Free T4",v:"1.2",r:"0.8–1.8",f:"N"},{l:"BP",v:"118/76",r:"<120/80",f:"N"}],
  },
  {
    id:"CGH-0918", name:"Lata Iyer",       age:55, gender:"Female", blood:"AB-",
    phone:"+91 96543-21098", email:"lata.i@email.com",
    condition:"New Patient – Post-menopausal Osteoporosis Screening",
    medications:["—"],
    lastVisit:"Mar 14, 2026", nextAppt:"Apr 01, 2026", priority:"normal",
    hba1c:"—", bp:"124/82", weight:"61 kg", bmi:"22.8", visits:1, since:"Mar 2026",
    notes:"New patient. DEXA scan ordered. Calcium and Vit D levels pending.",
    vitals:[{l:"DEXA Scan",v:"Pending",r:"—",f:"N"},{l:"Calcium",v:"Pending",r:"8.5–10.5",f:"N"},{l:"Vit D",v:"Pending",r:">30",f:"N"},{l:"BP",v:"124/82",r:"<120/80",f:"H"}],
  },
];


const pCol = (p) => ({ urgent:C.red, high:C.amber, normal:"rgba(255,255,255,.18)" })[p] || "rgba(255,255,255,.18)";
const fCol = (f) => ({ H:C.red, L:C.amber, N:"rgba(255,255,255,.38)" })[f] || "rgba(255,255,255,.38)";


const ParticleBg = () => {
  const ref = useRef(null), raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx = c.getContext("2d"), W = c.width, H = c.height;
    const pts = Array.from({ length:28 }, () => ({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.2+.3, vx:(Math.random()-.5)*.2, vy:(Math.random()-.5)*.2,
    }));
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H;
        const a=.1+.18*Math.abs(Math.sin(Date.now()*.0008+p.x));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,85,247,${a})`; ctx.fill();
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf.current);
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}/>;
};


const PatientModal = ({ p, onClose }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.82)", backdropFilter:"blur(14px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.2rem", animation:"fadeIn .2s both" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background:"linear-gradient(155deg,#0e0820,#070410)", border:`1px solid ${C.ring}28`, borderRadius:22, width:"100%", maxWidth:700, maxHeight:"92vh", overflowY:"auto", position:"relative" }}>

      {}
      <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:C.ring, filter:"blur(90px)", opacity:.08, pointerEvents:"none" }}/>

      {}
      <div style={{ position:"sticky", top:0, zIndex:2, background:"#0e0820", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"1.3rem 1.8rem 1rem", borderRadius:"22px 22px 0 0" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${C.accent},${C.ring})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:"#fff", flexShrink:0, boxShadow:`0 0 20px ${C.ring}40` }}>
              {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.08rem", fontWeight:800, color:"#fff" }}>{p.name}</div>
              <div style={{ fontSize:".63rem", color:"rgba(255,255,255,.35)", marginTop:2 }}>{p.id} · {p.age} yrs · {p.gender} · Blood: {p.blood}</div>
              <div style={{ fontSize:".62rem", color:"rgba(255,255,255,.28)", marginTop:3 }}>Patient since {p.since} · {p.visits} visits total</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.5)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".85rem", flexShrink:0 }}>✕</button>
        </div>
      </div>

      <div style={{ padding:"1.4rem 1.8rem" }}>

        {}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".8rem", marginBottom:"1.1rem" }}>
          <div style={{ padding:"12px 14px", borderRadius:13, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".58rem", fontWeight:700, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>📞 Contact</div>
            {[{l:"Phone",v:p.phone},{l:"Email",v:p.email},{l:"Last Visit",v:p.lastVisit},{l:"Next Appt",v:p.nextAppt,c:C.ring}].map(({l,v,c})=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:".61rem", color:"rgba(255,255,255,.28)" }}>{l}</span>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:".68rem", fontWeight:700, color:c||"rgba(255,255,255,.72)" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:"12px 14px", borderRadius:13, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".58rem", fontWeight:700, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>📊 Quick Stats</div>
            {[{l:"HbA1c",v:p.hba1c},{l:"BP",v:p.bp},{l:"Weight",v:p.weight},{l:"BMI",v:p.bmi}].map(({l,v})=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:".61rem", color:"rgba(255,255,255,.28)" }}>{l}</span>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:".68rem", fontWeight:700, color:"rgba(255,255,255,.72)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {}
        <div style={{ padding:"11px 14px", borderRadius:12, background:`${C.ring}0a`, border:`1px solid ${C.ring}20`, marginBottom:"1rem" }}>
          <div style={{ fontSize:".58rem", color:C.ring, fontWeight:700, textTransform:"uppercase", letterSpacing:".09em", marginBottom:5 }}>⚕ Condition</div>
          <div style={{ fontSize:".8rem", color:"rgba(255,255,255,.72)", lineHeight:1.7 }}>{p.condition}</div>
        </div>

        {}
        <div style={{ marginBottom:"1rem" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".58rem", fontWeight:700, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:7 }}>🧬 Recent Lab Values</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {p.vitals.map(v => {
              const fc = fCol(v.f);
              return (
                <div key={v.l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", borderRadius:10, background:v.f!=="N"?`${fc}09`:"rgba(255,255,255,.025)", border:v.f!=="N"?`1px solid ${fc}22`:"1px solid rgba(255,255,255,.06)" }}>
                  <span style={{ fontSize:".7rem", color:"rgba(255,255,255,.6)" }}>{v.l}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:".78rem", fontWeight:800, color:fc }}>{v.v}</span>
                    <span style={{ fontSize:".55rem", padding:"1px 7px", borderRadius:50, background:`${fc}14`, color:fc, border:`1px solid ${fc}24`, fontWeight:700 }}>
                      {v.f==="H"?"HIGH":v.f==="L"?"LOW":"NORM"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {}
        <div style={{ marginBottom:"1rem" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".58rem", fontWeight:700, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:7 }}>💊 Current Medications</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {p.medications.map(m => (
              <span key={m} style={{ padding:"5px 12px", borderRadius:9, background:`${C.indigo}10`, border:`1px solid ${C.indigo}22`, color:"#c7d2fe", fontSize:".7rem", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>💊 {m}</span>
            ))}
          </div>
        </div>

        {}
        <div style={{ padding:"12px 14px", borderRadius:12, background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", marginBottom:"1.1rem" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".58rem", fontWeight:700, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>📝 Doctor's Notes</div>
          <div style={{ fontSize:".78rem", color:"rgba(255,255,255,.65)", lineHeight:1.75, fontStyle:"italic" }}>"{p.notes}"</div>
          <div style={{ fontSize:".6rem", color:`${C.ring}60`, marginTop:6 }}>— {DOCTOR.name} · {DOCTOR.specialty}</div>
        </div>

        {/* actions */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:".6rem" }}>
          {[
            { label:"📅 Book Appointment",  color:C.ring   },
            { label:"💊 Write Prescription", color:C.indigo },
            { label:"📋 View Reports",       color:C.amber  },
          ].map(({ label, color }) => (
            <button key={label} style={{ padding:"10px", borderRadius:11, background:`${color}0e`, border:`1px solid ${color}28`, color, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:".68rem", fontWeight:700, transition:"all .2s" }}
              onMouseOver={e=>e.currentTarget.style.background=`${color}22`}
              onMouseOut={e=>e.currentTarget.style.background=`${color}0e`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

import DoctorSidebar from "./DoctorSidebar";

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function MyPatientsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");
  const [time,     setTime]     = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = PATIENTS.filter(p => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q);
  });

  const h = time.getHours();
  const greeting = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.25} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }
        html, body, #root { height:100%; font-family:'DM Sans',sans-serif; background:${C.bg} }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-thumb { background:rgba(168,85,247,.22); border-radius:99px }

        .dp  { display:flex; height:100vh; overflow:hidden; background:${C.bg}; position:relative }
        .dm  { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; position:relative; z-index:1 }
        .dtb { display:flex; align-items:center; justify-content:space-between; padding:.85rem 1.8rem; background:rgba(6,3,15,.96); border-bottom:1px solid ${C.border}; flex-shrink:0; backdrop-filter:blur(14px); position:relative }
        .dtb::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,${C.ring}42,transparent) }
        .dc  { flex:1; overflow-y:auto; padding:1.3rem 1.8rem; display:flex; flex-direction:column; gap:1rem }

        .ch  { display:grid; grid-template-columns:52px 2.2fr 1.8fr 1fr 1fr 80px; gap:12px; padding:5px 16px; margin-bottom:4px }
        .chc { font-size:.54rem; font-weight:700; color:rgba(255,255,255,.16); text-transform:"uppercase"; letter-spacing:".09em" }
        .slide { animation:slideIn .36s cubic-bezier(.16,1,.3,1) both }

        @media(max-width:768px) { .sidebar{display:none} .dc{padding:1rem} .ch{display:none} }
      `}</style>

      <div className="dp">
        <ParticleBg/>
        <DoctorSidebar active="patients" />

        <div className="dm">
          {/* topbar */}
          <div className="dtb">
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".6rem", fontWeight:700, color:`${C.glow}70`, textTransform:"uppercase", letterSpacing:".09em" }}>{greeting}, Doctor</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.05rem", fontWeight:800, color:"#fff", marginTop:1 }}>
                {DOCTOR.name}
                <span style={{ color:`${C.ring}70`, fontSize:".78rem", fontWeight:600 }}> · {DOCTOR.specialty}</span>
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ padding:"0px 10px", height:32, borderRadius:8, background:"rgba(147,51,234,.1)", border:"1px solid rgba(168,85,247,.2)", display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, boxShadow:`0 0 8px ${C.green}` }}/>
                <span style={{ fontSize:".62rem", fontWeight:700, color:"rgba(255,255,255,.6)", fontFamily:"'Syne',sans-serif", letterSpacing:".02em" }}>OPD ACTIVE</span>
              </div>
              <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,.4)", cursor:"pointer", transition:"all .2s", position:"relative" }}
                onMouseOver={e => e.currentTarget.style.background="rgba(255,255,255,.07)"}
                onMouseOut={e => e.currentTarget.style.background="rgba(255,255,255,.04)"}>
                🔔
                <div style={{ position:"absolute", top:-4, right:-4, width:17, height:17, borderRadius:"50%", background:C.red, fontFamily:"'Syne',sans-serif", fontSize:".5rem", fontWeight:800, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${C.bg}`, animation:"blink 2s step-start infinite" }}>7</div>
              </div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:".9rem", fontWeight:700, color:`${C.glow}70` }}>
                {time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
              </span>
            </div>
          </div>

          <div className="slide" style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div className="dc">
              {/* header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, animation:"fadeUp .3s both" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".65rem", fontWeight:800, color:"rgba(255,255,255,.24)", textTransform:"uppercase", letterSpacing:".12em" }}>
                  {filtered.length} Patient{filtered.length !== 1 ? "s" : ""} · {DOCTOR.hospital}
                </div>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:".75rem", color:"rgba(255,255,255,.28)" }}>🔍</span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, ID or condition…"
                    style={{ paddingLeft:32, paddingRight:14, paddingTop:8, paddingBottom:8, borderRadius:10, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#fff", fontSize:".76rem", fontFamily:"'DM Sans',sans-serif", outline:"none", width:260, transition:"border-color .2s,box-shadow .2s" }}
                    onFocus={e => { e.target.style.borderColor="rgba(168,85,247,.45)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,.09)"; }}
                    onBlur={e => { e.target.style.borderColor="rgba(255,255,255,.08)"; e.target.style.boxShadow="none"; }}
                  />
                </div>
              </div>

              {/* col headers */}
              <div className="ch">
                {["", "Patient", "Condition", "Last Visit", "Next Appt", ""].map((h, i) => (
                  <span key={i} className="chc">{h}</span>
                ))}
              </div>

              {/* patient rows */}
              {filtered.length === 0 ? (
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:"rgba(255,255,255,.18)", padding:"3rem" }}>
                  <div style={{ fontSize:"2.5rem" }}>🔍</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".9rem", fontWeight:800 }}>No patients found</div>
                  <div style={{ fontSize:".72rem" }}>Try a different name or ID</div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {filtered.map((p, i) => (
                    <div
                      key={p.id}
                      onClick={() => setSelected(p)}
                      style={{ display:"grid", gridTemplateColumns:"52px 2.2fr 1.8fr 1fr 1fr 80px", gap:12, alignItems:"center", padding:"13px 16px", borderRadius:14, background:C.card, border:`1px solid ${pCol(p.priority)}18`, cursor:"pointer", animation:`fadeUp .32s ${i * .05}s both`, transition:"all .2s", position:"relative", overflow:"hidden" }}
                      onMouseOver={e => { e.currentTarget.style.background="rgba(147,51,234,.08)"; e.currentTarget.style.borderColor=`${pCol(p.priority)}38`; e.currentTarget.style.transform="translateX(3px)"; }}
                      onMouseOut={e => { e.currentTarget.style.background=C.card; e.currentTarget.style.borderColor=`${pCol(p.priority)}18`; e.currentTarget.style.transform="translateX(0)"; }}
                    >
                      {/* priority left bar */}
                      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:pCol(p.priority), borderRadius:"3px 0 0 3px", opacity:.75 }}/>

                      {/* avatar */}
                      <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg,${C.accent},${C.ring})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:".76rem", fontWeight:800, color:"#fff", flexShrink:0, boxShadow:`0 0 12px ${C.ring}28`, marginLeft:4 }}>
                        {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>

                      {/* name + id + meds */}
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".84rem", fontWeight:800, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                        <div style={{ fontSize:".6rem", color:"rgba(255,255,255,.28)", marginTop:2 }}>{p.id} · {p.age}y · {p.gender} · {p.blood}</div>
                        <div style={{ display:"flex", gap:5, marginTop:5, flexWrap:"wrap" }}>
                          {p.medications.slice(0, 2).map(m => (
                            <span key={m} style={{ padding:"1px 7px", borderRadius:5, background:"rgba(129,140,248,.1)", border:"1px solid rgba(129,140,248,.2)", color:"#c7d2fe", fontSize:".55rem", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>💊 {m}</span>
                          ))}
                          {p.medications.length > 2 && <span style={{ fontSize:".55rem", color:"rgba(255,255,255,.25)" }}>+{p.medications.length - 2} more</span>}
                        </div>
                      </div>

                      {/* condition */}
                      <div style={{ fontSize:".68rem", color:"rgba(255,255,255,.45)", lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{p.condition}</div>

                      {/* last visit */}
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".7rem", fontWeight:600, color:"rgba(255,255,255,.5)" }}>{p.lastVisit}</div>
                        <div style={{ fontSize:".58rem", color:"rgba(255,255,255,.22)", marginTop:2 }}>{p.visits} visit{p.visits !== 1 ? "s" : ""}</div>
                      </div>

                      {/* next appt */}
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".7rem", fontWeight:700, color:C.ring }}>{p.nextAppt}</div>

                      {/* arrow */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:32, height:32, borderRadius:9, background:`${C.ring}0e`, border:`1px solid ${C.ring}22`, color:C.ring, fontSize:".9rem", transition:"all .2s" }}
                        onMouseOver={e => { e.currentTarget.style.background=`${C.ring}22`; e.currentTarget.style.transform="translateX(2px)"; }}
                        onMouseOut={e => { e.currentTarget.style.background=`${C.ring}0e`; e.currentTarget.style.transform="translateX(0)"; }}>
                        →
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {selected && <PatientModal p={selected} onClose={() => setSelected(null)}/>}
    </>
  );
}
