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
  opd:       "OPD 4, Second Floor",
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


const INIT_APPTS = [
  { id:"APT-0001", patient:"Alex Johnson",    pid:"CGH-0042", age:37, gender:"M", date:"2026-03-14", time:"09:00 AM", type:"Follow-up",     mode:"In-person", dept:"Endocrinology", reason:"HbA1c review + TSH follow-up",         status:"Completed", notes:"HbA1c 7.2% — dose review discussed.",     priority:"high"   },
  { id:"APT-0002", patient:"Priya Sharma",    pid:"CGH-0118", age:29, gender:"F", date:"2026-03-14", time:"09:20 AM", type:"Follow-up",     mode:"In-person", dept:"Endocrinology", reason:"Hypothyroid management check",          status:"Completed", notes:"TSH normalising. Continue current dose.",  priority:"normal" },
  { id:"APT-0003", patient:"Rajan Mehta",     pid:"CGH-0231", age:54, gender:"M", date:"2026-03-14", time:"09:40 AM", type:"Urgent",        mode:"In-person", dept:"Endocrinology", reason:"Diabetic foot + glucose spike",         status:"In Progress",notes:"Active consult — glucose 248 mg/dL.",      priority:"urgent" },
  { id:"APT-0004", patient:"Anjali Verma",    pid:"CGH-0304", age:42, gender:"F", date:"2026-03-14", time:"10:00 AM", type:"Follow-up",     mode:"In-person", dept:"Endocrinology", reason:"Thyroid nodule follow-up",              status:"Waiting",   notes:"",                                         priority:"normal" },
  { id:"APT-0005", patient:"Suresh Pillai",   pid:"CGH-0389", age:61, gender:"M", date:"2026-03-14", time:"10:20 AM", type:"Review",        mode:"In-person", dept:"Endocrinology", reason:"Type 2 DM quarterly check",            status:"Waiting",   notes:"",                                         priority:"normal" },
  { id:"APT-0006", patient:"Meena Krishnan",  pid:"CGH-0412", age:35, gender:"F", date:"2026-03-14", time:"10:40 AM", type:"Review",        mode:"In-person", dept:"Endocrinology", reason:"PCOD + insulin resistance screen",     status:"Waiting",   notes:"",                                         priority:"high"   },
  { id:"APT-0007", patient:"Vikram Choudhry", pid:"CGH-0501", age:48, gender:"M", date:"2026-03-14", time:"11:00 AM", type:"Urgent",        mode:"In-person", dept:"Endocrinology", reason:"Adrenal mass — biopsy results review", status:"Waiting",   notes:"",                                         priority:"urgent" },
  { id:"APT-0008", patient:"Fatima Naqvi",    pid:"CGH-0567", age:23, gender:"F", date:"2026-03-14", time:"11:20 AM", type:"New Patient",   mode:"In-person", dept:"Endocrinology", reason:"Irregular periods — first consult",    status:"Waiting",   notes:"",                                         priority:"normal" },
  { id:"APT-0009", patient:"Dinesh Rao",      pid:"CGH-0631", age:52, gender:"M", date:"2026-03-14", time:"02:30 PM", type:"Follow-up",     mode:"In-person", dept:"Endocrinology", reason:"Diabetes + fatty liver review",        status:"Scheduled", notes:"",                                         priority:"normal" },
  { id:"APT-0010", patient:"Sunita Agarwal",  pid:"CGH-0712", age:46, gender:"F", date:"2026-03-14", time:"04:00 PM", type:"Consultation",  mode:"Telecall",  dept:"Endocrinology", reason:"Graves disease — medication review",   status:"Scheduled", notes:"",                                         priority:"high"   },
  { id:"APT-0011", patient:"Harish Bose",     pid:"CGH-0834", age:39, gender:"M", date:"2026-03-15", time:"09:30 AM", type:"Review",        mode:"In-person", dept:"Endocrinology", reason:"Hashimoto — TSH + TPO check",          status:"Scheduled", notes:"",                                         priority:"normal" },
  { id:"APT-0012", patient:"Lata Iyer",       pid:"CGH-0918", age:55, gender:"F", date:"2026-03-15", time:"11:00 AM", type:"New Patient",   mode:"In-person", dept:"Endocrinology", reason:"Post-menopausal osteoporosis screen",  status:"Scheduled", notes:"",                                         priority:"normal" },
  { id:"APT-0013", patient:"Pratik Shah",     pid:"CGH-1012", age:44, gender:"M", date:"2026-03-15", time:"03:00 PM", type:"Telecall",      mode:"Telecall",  dept:"Endocrinology", reason:"Diabetes management — remote check",   status:"Scheduled", notes:"",                                         priority:"normal" },
  { id:"APT-0014", patient:"Geeta Nair",      pid:"CGH-1105", age:38, gender:"F", date:"2026-03-16", time:"10:00 AM", type:"Follow-up",     mode:"In-person", dept:"Endocrinology", reason:"Thyroid post-surgery follow-up",       status:"Scheduled", notes:"",                                         priority:"high"   },
  { id:"APT-0015", patient:"Ravi Sharma",     pid:"CGH-1218", age:60, gender:"M", date:"2026-03-16", time:"12:00 PM", type:"Review",        mode:"In-person", dept:"Endocrinology", reason:"Annual diabetes + lipid review",       status:"Scheduled", notes:"",                                         priority:"normal" },
];


const PATIENT_LIST = [
  "Alex Johnson (CGH-0042)",    "Priya Sharma (CGH-0118)",
  "Rajan Mehta (CGH-0231)",     "Anjali Verma (CGH-0304)",
  "Suresh Pillai (CGH-0389)",   "Meena Krishnan (CGH-0412)",
  "Vikram Choudhry (CGH-0501)", "Fatima Naqvi (CGH-0567)",
  "Dinesh Rao (CGH-0631)",      "Sunita Agarwal (CGH-0712)",
  "Harish Bose (CGH-0834)",     "Lata Iyer (CGH-0918)",
  "Pratik Shah (CGH-1012)",     "Geeta Nair (CGH-1105)",
  "Ravi Sharma (CGH-1218)",     "New Patient",
];


const statusMeta = (s) => ({
  "Completed":    { color:"rgba(255,255,255,.3)",  bg:"rgba(255,255,255,.06)", border:"rgba(255,255,255,.1)",  dot:"#555" },
  "In Progress":  { color:C.ring,                  bg:`${C.ring}12`,           border:`${C.ring}30`,           dot:C.ring  },
  "Waiting":      { color:C.amber,                 bg:"rgba(251,191,36,.1)",   border:"rgba(251,191,36,.28)",  dot:C.amber },
  "Scheduled":    { color:C.indigo,                bg:"rgba(129,140,248,.1)",  border:"rgba(129,140,248,.28)", dot:C.indigo},
  "Cancelled":    { color:C.red,                   bg:"rgba(248,113,113,.1)",  border:"rgba(248,113,113,.28)", dot:C.red   },
})[s] || {};

const priorityColor = (p) => ({ urgent:C.red, high:C.amber, normal:"rgba(255,255,255,.18)" })[p];

const typeMeta = (t) => ({
  "Urgent":     { color:C.red,    icon:"🚨" },
  "New Patient":{ color:C.indigo, icon:"🆕" },
  "Follow-up":  { color:C.ring,   icon:"🔄" },
  "Review":     { color:C.amber,  icon:"📋" },
  "Consultation":{ color:C.green, icon:"💬" },
  "Telecall":   { color:C.glow,   icon:"📞" },
})[t] || { color:C.ring, icon:"📅" };

const TODAY       = "2026-03-14";
const TOMORROW    = "2026-03-15";
const DAY_AFTER   = "2026-03-16";

const labelDate = (d) =>
  d === TODAY     ? "Today" :
  d === TOMORROW  ? "Tomorrow" :
  d === DAY_AFTER ? "Mar 16" : d;


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


const ApptModal = ({ appt, onClose, onCancel }) => {
  const sm = statusMeta(appt.status);
  const tm = typeMeta(appt.type);
  const [notes, setNotes] = useState(appt.notes || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.82)", backdropFilter:"blur(14px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.2rem", animation:"fadeIn .2s both" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"linear-gradient(155deg,#0e0820,#070410)", border:`1px solid ${C.ring}28`, borderRadius:22, width:"100%", maxWidth:580, maxHeight:"92vh", overflowY:"auto", position:"relative" }}>

        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:C.ring, filter:"blur(90px)", opacity:.07, pointerEvents:"none" }}/>

        {}
        <div style={{ position:"sticky", top:0, zIndex:2, background:"#0e0820", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"1.2rem 1.6rem .9rem", borderRadius:"22px 22px 0 0" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:46, height:46, borderRadius:13, background:`linear-gradient(135deg,${C.accent},${C.ring})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:".9rem", fontWeight:800, color:"#fff", flexShrink:0 }}>
                {appt.patient.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:"#fff" }}>{appt.patient}</div>
                <div style={{ fontSize:".62rem", color:"rgba(255,255,255,.35)", marginTop:2 }}>{appt.pid} · {appt.age}y · {appt.gender} · {appt.id}</div>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:5 }}>
                  <span style={{ padding:"2px 9px", borderRadius:50, background:sm.bg, color:sm.color, border:`1px solid ${sm.border}`, fontSize:".58rem", fontFamily:"'Syne',sans-serif", fontWeight:700 }}>● {appt.status}</span>
                  <span style={{ padding:"2px 9px", borderRadius:50, background:`${tm.color}12`, color:tm.color, border:`1px solid ${tm.color}25`, fontSize:".58rem", fontFamily:"'Syne',sans-serif", fontWeight:700 }}>{tm.icon} {appt.type}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.5)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".85rem", flexShrink:0 }}>✕</button>
          </div>
        </div>

        <div style={{ padding:"1.3rem 1.6rem" }}>

          {}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".7rem", marginBottom:"1rem" }}>
            {[
              { l:"Date",        v:labelDate(appt.date) + (appt.date === TODAY ? " (Today)" : "") },
              { l:"Time",        v:appt.time },
              { l:"Mode",        v:appt.mode === "Telecall" ? "📞 Telecall" : "🏥 In-person" },
              { l:"Department",  v:appt.dept },
              { l:"OPD",         v:DOCTOR.opd },
              { l:"Doctor",      v:DOCTOR.name },
            ].map(({ l, v }) => (
              <div key={l} style={{ padding:"9px 12px", borderRadius:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)" }}>
                <div style={{ fontSize:".56rem", color:"rgba(255,255,255,.25)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:3 }}>{l}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".74rem", fontWeight:700, color:"rgba(255,255,255,.8)" }}>{v}</div>
              </div>
            ))}
          </div>

          {}
          <div style={{ padding:"11px 14px", borderRadius:12, background:`${C.ring}0a`, border:`1px solid ${C.ring}20`, marginBottom:"1rem" }}>
            <div style={{ fontSize:".56rem", color:C.ring, fontWeight:700, textTransform:"uppercase", letterSpacing:".09em", marginBottom:5 }}>📋 Reason for Visit</div>
            <div style={{ fontSize:".8rem", color:"rgba(255,255,255,.72)", lineHeight:1.65 }}>{appt.reason}</div>
          </div>

          {}
          <div style={{ marginBottom:"1rem" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".58rem", fontWeight:700, color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:7 }}>📝 Doctor's Notes</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add clinical notes for this appointment…"
              rows={4}
              style={{ width:"100%", padding:"10px 14px", borderRadius:11, background:"rgba(255,255,255,.04)", border:`1px solid ${C.border}`, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", resize:"vertical", outline:"none", lineHeight:1.65, transition:"border-color .2s" }}
              onFocus={e => e.target.style.borderColor=`rgba(168,85,247,.4)`}
              onBlur={e => e.target.style.borderColor=C.border}
            />
          </div>

          {/* actions */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".6rem" }}>
            <button onClick={handleSave}
              style={{ padding:"10px", borderRadius:11, background:`${C.ring}12`, border:`1px solid ${C.ring}28`, color:saved?C.green:C.ring, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:".72rem", fontWeight:700, transition:"all .2s" }}
              onMouseOver={e=>e.currentTarget.style.background=`${C.ring}22`}
              onMouseOut={e=>e.currentTarget.style.background=`${C.ring}12`}>
              {saved ? "✓ Notes Saved!" : "💾 Save Notes"}
            </button>
            {appt.status !== "Completed" && appt.status !== "Cancelled" && (
              <button onClick={() => { onCancel(appt.id); onClose(); }}
                style={{ padding:"10px", borderRadius:11, background:"rgba(248,113,113,.08)", border:"1px solid rgba(248,113,113,.22)", color:C.red, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:".72rem", fontWeight:700, transition:"all .2s" }}
                onMouseOver={e=>e.currentTarget.style.background="rgba(248,113,113,.18)"}
                onMouseOut={e=>e.currentTarget.style.background="rgba(248,113,113,.08)"}>
                ✕ Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   BOOK APPOINTMENT MODAL
══════════════════════════════════════ */
const BookModal = ({ onClose, onBook }) => {
  const [form, setForm] = useState({
    patient:"", date:"", time:"", type:"Follow-up", mode:"In-person",
    reason:"", priority:"normal",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (k) => (v) => setForm(f => ({ ...f, [k]:v }));

  const validate = () => {
    const e = {};
    if (!form.patient) e.patient = "Select a patient";
    if (!form.date)    e.date    = "Select a date";
    if (!form.time)    e.time    = "Select a time";
    if (!form.reason.trim()) e.reason = "Enter reason for visit";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onBook(form);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onClose(); }, 1600);
  };

  const InputRow = ({ label, children, err }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontFamily:"'Syne',sans-serif", fontSize:".6rem", fontWeight:700, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:".08em" }}>{label}</label>
      {children}
      {err && <div style={{ fontSize:".6rem", color:C.red }}>⚠ {err}</div>}
    </div>
  );

  const inputStyle = (err) => ({
    width:"100%", padding:"10px 13px", borderRadius:10,
    background:"rgba(255,255,255,.04)",
    border:`1px solid ${err ? C.red : "rgba(168,85,247,.2)"}`,
    color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:".8rem", outline:"none",
    transition:"border-color .2s, box-shadow .2s",
  });

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", backdropFilter:"blur(16px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.2rem", animation:"fadeIn .2s both" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"linear-gradient(155deg,#0e0820,#070410)", border:`1px solid ${C.ring}30`, borderRadius:22, width:"100%", maxWidth:540, maxHeight:"95vh", overflowY:"auto", position:"relative" }}>

        <div style={{ position:"absolute", top:-30, left:-30, width:180, height:180, borderRadius:"50%", background:C.ring, filter:"blur(80px)", opacity:.09, pointerEvents:"none" }}/>

        {/* header */}
        <div style={{ position:"sticky", top:0, zIndex:2, background:"#0e0820", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"1.2rem 1.6rem .9rem", borderRadius:"22px 22px 0 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${C.ring}18`, border:`1px solid ${C.ring}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>📅</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:"#fff" }}>Book Appointment</div>
              <div style={{ fontSize:".62rem", color:"rgba(255,255,255,.32)", marginTop:1 }}>Schedule a new patient appointment</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.5)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".85rem" }}>✕</button>
        </div>

        {success ? (
          <div style={{ padding:"3rem 2rem", textAlign:"center", animation:"fadeUp .3s both" }}>
            <div style={{ fontSize:"3rem", marginBottom:".8rem", animation:"checkPop .5s cubic-bezier(.16,1,.3,1) both" }}>✅</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:800, color:"#fff" }}>Appointment Booked!</div>
            <div style={{ fontSize:".76rem", color:"rgba(255,255,255,.38)", marginTop:6 }}>{form.patient} · {form.date} · {form.time}</div>
          </div>
        ) : (
          <div style={{ padding:"1.3rem 1.6rem", display:"flex", flexDirection:"column", gap:".85rem" }}>

            {/* patient */}
            <InputRow label="Patient *" err={errors.patient}>
              <select value={form.patient} onChange={e => set("patient")(e.target.value)}
                style={{ ...inputStyle(errors.patient), cursor:"pointer" }}
                onFocus={e => { e.target.style.borderColor="rgba(168,85,247,.45)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,.09)"; }}
                onBlur={e => { e.target.style.borderColor=errors.patient?C.red:"rgba(168,85,247,.2)"; e.target.style.boxShadow="none"; }}>
                <option value="" style={{ background:"#0e0820" }}>— Select patient —</option>
                {PATIENT_LIST.map(p => <option key={p} value={p} style={{ background:"#0e0820" }}>{p}</option>)}
              </select>
            </InputRow>

            {/* date + time */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".7rem" }}>
              <InputRow label="Date *" err={errors.date}>
                <input type="date" value={form.date} onChange={e => set("date")(e.target.value)}
                  min="2026-03-14"
                  style={{ ...inputStyle(errors.date), colorScheme:"dark" }}
                  onFocus={e => { e.target.style.borderColor="rgba(168,85,247,.45)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,.09)"; }}
                  onBlur={e => { e.target.style.borderColor=errors.date?C.red:"rgba(168,85,247,.2)"; e.target.style.boxShadow="none"; }}/>
              </InputRow>
              <InputRow label="Time *" err={errors.time}>
                <select value={form.time} onChange={e => set("time")(e.target.value)}
                  style={{ ...inputStyle(errors.time), cursor:"pointer" }}
                  onFocus={e => { e.target.style.borderColor="rgba(168,85,247,.45)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,.09)"; }}
                  onBlur={e => { e.target.style.borderColor=errors.time?C.red:"rgba(168,85,247,.2)"; e.target.style.boxShadow="none"; }}>
                  <option value="" style={{ background:"#0e0820" }}>— Select —</option>
                  {["09:00 AM","09:20 AM","09:40 AM","10:00 AM","10:20 AM","10:40 AM","11:00 AM","11:20 AM","11:40 AM","12:00 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM"]
                    .map(t => <option key={t} value={t} style={{ background:"#0e0820" }}>{t}</option>)}
                </select>
              </InputRow>
            </div>

            {/* type + mode */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".7rem" }}>
              <InputRow label="Appointment Type">
                <select value={form.type} onChange={e => set("type")(e.target.value)}
                  style={{ ...inputStyle(false), cursor:"pointer" }}
                  onFocus={e => e.target.style.borderColor="rgba(168,85,247,.45)"}
                  onBlur={e => e.target.style.borderColor="rgba(168,85,247,.2)"}>
                  {["Follow-up","New Patient","Review","Urgent","Consultation","Telecall"].map(t => <option key={t} value={t} style={{ background:"#0e0820" }}>{t}</option>)}
                </select>
              </InputRow>
              <InputRow label="Mode">
                <select value={form.mode} onChange={e => set("mode")(e.target.value)}
                  style={{ ...inputStyle(false), cursor:"pointer" }}
                  onFocus={e => e.target.style.borderColor="rgba(168,85,247,.45)"}
                  onBlur={e => e.target.style.borderColor="rgba(168,85,247,.2)"}>
                  {["In-person","Telecall"].map(m => <option key={m} value={m} style={{ background:"#0e0820" }}>{m}</option>)}
                </select>
              </InputRow>
            </div>

            {/* priority */}
            <InputRow label="Priority">
              <div style={{ display:"flex", gap:8 }}>
                {["normal","high","urgent"].map(pr => (
                  <button key={pr} onClick={() => set("priority")(pr)}
                    style={{ flex:1, padding:"8px", borderRadius:9, border:`1px solid ${form.priority===pr ? priorityColor(pr)+"55" : "rgba(255,255,255,.08)"}`, background:form.priority===pr ? `${priorityColor(pr)}14` : "rgba(255,255,255,.03)", color:form.priority===pr ? priorityColor(pr) : "rgba(255,255,255,.35)", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:".68rem", fontWeight:700, textTransform:"uppercase", transition:"all .2s" }}>
                    {pr === "urgent" ? "🔴" : pr === "high" ? "🟡" : "⚪"} {pr}
                  </button>
                ))}
              </div>
            </InputRow>

            {/* reason */}
            <InputRow label="Reason for Visit *" err={errors.reason}>
              <textarea value={form.reason} onChange={e => set("reason")(e.target.value)}
                placeholder="Describe the reason for this appointment…"
                rows={3}
                style={{ ...inputStyle(errors.reason), resize:"vertical", lineHeight:1.65 }}
                onFocus={e => { e.target.style.borderColor="rgba(168,85,247,.45)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,.09)"; }}
                onBlur={e => { e.target.style.borderColor=errors.reason?C.red:"rgba(168,85,247,.2)"; e.target.style.boxShadow="none"; }}/>
            </InputRow>

            {/* submit */}
            <button onClick={handleSubmit}
              style={{ width:"100%", padding:"13px", borderRadius:12, background:`linear-gradient(135deg,${C.accent},${C.ring})`, border:"none", color:"#fff", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:".82rem", fontWeight:700, letterSpacing:".04em", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s", boxShadow:`0 6px 20px ${C.ring}30` }}
              onMouseOver={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow=`0 10px 28px ${C.ring}45`; }}
              onMouseOut={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 6px 20px ${C.ring}30`; }}>
              📅 Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   APPOINTMENT ROW
══════════════════════════════════════ */
const ApptRow = ({ appt, idx, onClick }) => {
  const sm = statusMeta(appt.status);
  const tm = typeMeta(appt.type);
  return (
    <div onClick={() => onClick(appt)}
      style={{ display:"grid", gridTemplateColumns:"52px 1.8fr 1.2fr 80px 90px 100px 110px 72px", gap:10, alignItems:"center", padding:"11px 15px", borderRadius:13, background:C.card, border:`1px solid ${priorityColor(appt.priority)}18`, cursor:"pointer", animation:`fadeUp .3s ${idx*.04}s both`, transition:"all .18s", position:"relative", overflow:"hidden" }}
      onMouseOver={e => { e.currentTarget.style.background="rgba(147,51,234,.08)"; e.currentTarget.style.borderColor=`${priorityColor(appt.priority)}35`; e.currentTarget.style.transform="translateX(3px)"; }}
      onMouseOut={e => { e.currentTarget.style.background=C.card; e.currentTarget.style.borderColor=`${priorityColor(appt.priority)}18`; e.currentTarget.style.transform="translateX(0)"; }}>

      {/* priority bar */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:priorityColor(appt.priority), borderRadius:"3px 0 0 3px", opacity:.75 }}/>

      {/* avatar */}
      <div style={{ width:38, height:38, borderRadius:11, background:`linear-gradient(135deg,${C.accent},${C.ring})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:".72rem", fontWeight:800, color:"#fff", marginLeft:4, flexShrink:0 }}>
        {appt.patient.split(" ").map(n=>n[0]).join("").slice(0,2)}
      </div>

      {/* patient */}
      <div style={{ minWidth:0 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".8rem", fontWeight:800, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{appt.patient}</div>
        <div style={{ fontSize:".58rem", color:"rgba(255,255,255,.28)", marginTop:1 }}>{appt.pid} · {appt.age}y {appt.gender}</div>
      </div>

      {/* reason */}
      <div style={{ fontSize:".66rem", color:"rgba(255,255,255,.42)", lineHeight:1.4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{appt.reason}</div>

      {/* time */}
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".7rem", fontWeight:700, color:"rgba(255,255,255,.55)", whiteSpace:"nowrap" }}>{appt.time}</div>

      {/* type */}
      <span style={{ padding:"3px 8px", borderRadius:6, background:`${tm.color}12`, color:tm.color, border:`1px solid ${tm.color}25`, fontSize:".6rem", fontFamily:"'Syne',sans-serif", fontWeight:700, whiteSpace:"nowrap", textAlign:"center" }}>{tm.icon} {appt.type}</span>

      {/* mode */}
      <span style={{ padding:"3px 9px", borderRadius:6, background:appt.mode==="Telecall"?"rgba(129,140,248,.1)":"rgba(52,211,153,.08)", color:appt.mode==="Telecall"?C.indigo:C.green, border:`1px solid ${appt.mode==="Telecall"?"rgba(129,140,248,.25)":"rgba(52,211,153,.2)"}`, fontSize:".6rem", fontFamily:"'Syne',sans-serif", fontWeight:700, whiteSpace:"nowrap" }}>
        {appt.mode === "Telecall" ? "📞 Telecall" : "🏥 In-person"}
      </span>

      {/* status */}
      <span style={{ padding:"3px 9px", borderRadius:50, background:sm.bg, color:sm.color, border:`1px solid ${sm.border}`, fontSize:".6rem", fontFamily:"'Syne',sans-serif", fontWeight:700, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ width:5, height:5, borderRadius:"50%", background:sm.dot, display:"inline-block", boxShadow:appt.status==="In Progress"?`0 0 6px ${sm.dot}`:""  }}/>
        {appt.status}
      </span>

      {/* arrow */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:30, height:30, borderRadius:8, background:`${C.ring}0e`, border:`1px solid ${C.ring}22`, color:C.ring, fontSize:".85rem", transition:"all .18s" }}
        onMouseOver={e => { e.currentTarget.style.background=`${C.ring}22`; e.currentTarget.style.transform="translateX(2px)"; }}
        onMouseOut={e => { e.currentTarget.style.background=`${C.ring}0e`; e.currentTarget.style.transform="translateX(0)"; }}>→</div>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
import DoctorSidebar from "./DoctorSidebar";

/* ══════════════════════════════════════
   MAIN PAGE
 ══════════════════════════════════════ */
export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [animKey,   setAnimKey]   = useState(0);
  const [appts,     setAppts]     = useState(INIT_APPTS);
  const [selAppt,   setSelAppt]   = useState(null);
  const [showBook,  setShowBook]  = useState(false);
  const [tabDate,   setTabDate]   = useState("all");
  const [tabStatus, setTabStatus] = useState("all");
  const [search,    setSearch]    = useState("");
  const [time,      setTime]      = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setAnimKey(prev => prev + 1);
  }, [tabDate, tabStatus, search]);

  const handleCancel = (id) => setAppts(prev => prev.map(a => a.id===id ? {...a, status:"Cancelled"} : a));

  const handleBook = (form) => {
    const newAppt = {
      id:`APT-${String(appts.length+1).padStart(4,"0")}`,
      patient: form.patient.split(" (")[0],
      pid: form.patient.includes("(") ? form.patient.split("(")[1].replace(")","") : "CGH-NEW",
      age:"—", gender:"—",
      date: form.date, time: form.time,
      type: form.type, mode: form.mode,
      dept:"Endocrinology", reason: form.reason,
      status:"Scheduled", notes:"", priority: form.priority,
    };
    setAppts(prev => [...prev, newAppt]);
  };

  const filtered = appts.filter(a => {
    const matchDate   = tabDate   === "all" || a.date === tabDate;
    const matchStatus = tabStatus === "all" || a.status === tabStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || a.patient.toLowerCase().includes(q) || a.pid.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q);
    return matchDate && matchStatus && matchSearch;
  });

  /* stats */
  const todayAppts     = appts.filter(a => a.date === TODAY);
  const scheduledCount = appts.filter(a => a.status === "Scheduled").length;
  const completedCount = appts.filter(a => a.status === "Completed").length;
  const urgentCount    = appts.filter(a => a.priority === "urgent" && a.status !== "Completed" && a.status !== "Cancelled").length;

  const h = time.getHours();
  const greeting = h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";

  /* group filtered by date */
  const grouped = filtered.reduce((acc, a) => {
    const key = labelDate(a.date);
    acc[key] = acc[key] || [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-20deg);opacity:0} 70%{transform:scale(1.18) rotate(4deg)} 100%{transform:scale(1) rotate(0);opacity:1} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }
        html, body, #root { height:100%; font-family:'DM Sans',sans-serif; background:${C.bg} }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-thumb { background:rgba(168,85,247,.22); border-radius:99px }

        .dp { display:flex; height:100vh; overflow:hidden; background:${C.bg}; position:relative }

        /* ── MAIN ── */
        .dm  { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; position:relative; z-index:1 }
        .dtb { display:flex; align-items:center; justify-content:space-between; padding:.85rem 1.8rem; background:rgba(6,3,15,.96); border-bottom:1px solid ${C.border}; flex-shrink:0; backdrop-filter:blur(14px); position:relative }
        .dtb::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,${C.ring}42,transparent) }
        .dc  { flex:1; overflow-y:auto; padding:1.3rem 1.8rem; display:flex; flex-direction:column; gap:1rem }

        /* tabs */
        .tab { padding:5px 13px; border-radius:8px; border:none; cursor:pointer; font-family:'Syne',sans-serif; font-size:.68rem; font-weight:700; transition:all .2s; background:transparent; color:rgba(255,255,255,.3) }
        .tab:hover { background:rgba(255,255,255,.05); color:rgba(255,255,255,.65) }
        .tab.on  { background:rgba(147,51,234,.12); border:1px solid rgba(168,85,247,.25); color:${C.ring} }

        /* group heading */
        .grp { font-family:'Syne',sans-serif; font-size:.64rem; font-weight:800; color:rgba(255,255,255,.25); text-transform:uppercase; letter-spacing:.12em; display:flex; align-items:center; gap:8px; margin-bottom:.5rem; margin-top:.3rem }
        .grp::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.05) }

        /* col headers */
        .ch  { display:grid; grid-template-columns:52px 1.8fr 1.2fr 80px 90px 100px 110px 72px; gap:10px; padding:4px 15px; margin-bottom:4px }
        .chc { font-size:.53rem; font-weight:700; color:rgba(255,255,255,.16); text-transform:uppercase; letter-spacing:.09em }

        .slide { animation:slideIn .36s cubic-bezier(.16,1,.3,1) both }
        input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(1) opacity(0.4); cursor:pointer }

        @media(max-width:768px) { .sidebar{display:none} .dc{padding:1rem} .ch{display:none} }
      `}</style>

      <div className="dp">
        <ParticleBg/>

        <DoctorSidebar active="appointments" />

        {/* ══ MAIN ══ */}
        <div className="dm">

          {/* topbar */}
          <div className="dtb">
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".6rem", fontWeight:700, color:`${C.glow}70`, textTransform:"uppercase", letterSpacing:".09em" }}>{greeting}, Doctor</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.05rem", fontWeight:800, color:"#fff", marginTop:1 }}>
                {DOCTOR.name}<span style={{ color:`${C.ring}70`, fontSize:".78rem", fontWeight:600 }}> · Appointments</span>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* book btn */}
              <button onClick={() => setShowBook(true)}
                style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:10, background:`linear-gradient(135deg,${C.accent},${C.ring})`, border:"none", color:"#fff", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:".74rem", fontWeight:700, letterSpacing:".03em", boxShadow:`0 4px 16px ${C.ring}35`, transition:"all .2s" }}
                onMouseOver={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow=`0 8px 22px ${C.ring}50`; }}
                onMouseOut={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 4px 16px ${C.ring}35`; }}>
                + Book Appointment
              </button>
              <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}
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

              {/* stat cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".7rem", animation:"fadeUp .3s both" }}>
                {[
                  { label:"Today's Appointments", value:todayAppts.length,  icon:"📅", color:C.glow   },
                  { label:"Scheduled",             value:scheduledCount,     icon:"🗓", color:C.indigo },
                  { label:"Completed",             value:completedCount,     icon:"✅", color:C.green  },
                  { label:"Urgent Pending",        value:urgentCount,        icon:"🚨", color:C.red    },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} style={{ background:C.card, border:`1px solid ${color}1e`, borderRadius:14, padding:".9rem 1rem", display:"flex", alignItems:"center", gap:10, transition:"border-color .2s" }}
                    onMouseOver={e => e.currentTarget.style.borderColor=`${color}40`}
                    onMouseOut={e => e.currentTarget.style.borderColor=`${color}1e`}>
                    <div style={{ width:38, height:38, borderRadius:11, background:`${color}14`, border:`1px solid ${color}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".95rem", flexShrink:0 }}>{icon}</div>
                    <div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", fontWeight:800, color, lineHeight:1 }}>{value}</div>
                      <div style={{ fontSize:".58rem", color:"rgba(255,255,255,.28)", textTransform:"uppercase", letterSpacing:".07em", marginTop:2 }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* filters row */}
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                {/* date tabs */}
                <div style={{ display:"flex", gap:4 }}>
                  {[
                    { k:"all",      l:"All Dates" },
                    { k:TODAY,      l:`Today (${todayAppts.length})` },
                    { k:TOMORROW,   l:"Tomorrow" },
                    { k:DAY_AFTER,  l:"Mar 16"   },
                  ].map(({ k, l }) => (
                    <button key={k} className={`tab${tabDate===k?" on":""}`} onClick={() => setTabDate(k)}>{l}</button>
                  ))}
                </div>

                <div style={{ width:1, height:20, background:"rgba(255,255,255,.08)", margin:"0 4px" }}/>

                {/* status tabs */}
                {["all","Waiting","In Progress","Scheduled","Completed","Cancelled"].map(s => (
                  <button key={s} className={`tab${tabStatus===s?" on":""}`} onClick={() => setTabStatus(s)}>
                    {s === "all" ? "All Status" : s}
                  </button>
                ))}

                {/* search */}
                <div style={{ marginLeft:"auto", position:"relative" }}>
                  <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", fontSize:".7rem", color:"rgba(255,255,255,.3)" }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, ID, reason…"
                    style={{ paddingLeft:28, paddingRight:12, paddingTop:6, paddingBottom:6, borderRadius:9, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", color:"#fff", fontSize:".72rem", fontFamily:"'DM Sans',sans-serif", outline:"none", width:230 }}
                    onFocus={e => { e.target.style.borderColor="rgba(168,85,247,.4)"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,.08)"; }}
                    onBlur={e => { e.target.style.borderColor="rgba(255,255,255,.08)"; e.target.style.boxShadow="none"; }}/>
                </div>
              </div>

              {/* col headers */}
              <div className="ch">
                {["","Patient","Reason","Time","Type","Mode","Status",""].map((h,i) => (
                  <span key={i} className="chc">{h}</span>
                ))}
              </div>

              {/* grouped appointment rows */}
              {Object.keys(grouped).length === 0 ? (
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:"rgba(255,255,255,.18)", padding:"3rem" }}>
                  <div style={{ fontSize:"2.5rem" }}>📅</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:".9rem", fontWeight:800 }}>No appointments found</div>
                  <div style={{ fontSize:".72rem" }}>Try adjusting the filters or search</div>
                </div>
              ) : (
                Object.entries(grouped).map(([date, list]) => (
                  <div key={date}>
                    <div className="grp">{date} <span style={{ color:"rgba(255,255,255,.18)", fontWeight:600, fontSize:".6rem" }}>({list.length})</span></div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:".3rem" }}>
                      {list.map((a, i) => <ApptRow key={a.id} appt={a} idx={i} onClick={setSelAppt}/>)}
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>

      {selAppt && <ApptModal appt={selAppt} onClose={() => setSelAppt(null)} onCancel={handleCancel}/>}
      {showBook && <BookModal onClose={() => setShowBook(false)} onBook={handleBook}/>}
    </>
  );
}
