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

const SETTINGS_TABS = [
  { key:"profile",       icon:"👤", label:"Personal Profile"   },
  { key:"clinic",        icon:"🏥", label:"Clinic & Practice"  },
  { key:"schedule",      icon:"📅", label:"Schedule & OPD"     },
  { key:"notifications", icon:"🔔", label:"Notifications"      },
  { key:"security",      icon:"🔒", label:"Security"           },
  { key:"appearance",    icon:"🎨", label:"Appearance"         },
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



const SectionTitle = ({ icon, title, subtitle }) => (
  <div style={{marginBottom:"1.2rem"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
      <div style={{width:34,height:34,borderRadius:10,background:`rgba(168,85,247,.12)`,border:`1px solid rgba(168,85,247,.22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>{icon}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:800,color:"#fff"}}>{title}</div>
    </div>
    {subtitle && <div style={{fontSize:".68rem",color:"rgba(255,255,255,.32)",marginLeft:44}}>{subtitle}</div>}
  </div>
);

const Field = ({ label, value, onChange, type="text", placeholder="", hint="" }) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>{label}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{padding:"9px 12px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color .2s"}}
      onFocus={e=>e.target.style.borderColor="rgba(168,85,247,.4)"}
      onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}
    />
    {hint && <div style={{fontSize:".58rem",color:"rgba(255,255,255,.22)"}}>{hint}</div>}
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>{label}</label>
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{padding:"9px 12px",borderRadius:10,background:"rgba(14,9,28,.98)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const TextareaField = ({ label, value, onChange, rows=3, placeholder="" }) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>{label}</label>
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{padding:"9px 12px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",lineHeight:1.6,transition:"border-color .2s"}}
      onFocus={e=>e.target.style.borderColor="rgba(168,85,247,.4)"}
      onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}
    />
  </div>
);

const Toggle = ({ label, sublabel, value, onChange }) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:11,background:C.card,border:`1px solid ${C.faint}`}}>
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".73rem",fontWeight:700,color:"rgba(255,255,255,.7)"}}>{label}</div>
      {sublabel && <div style={{fontSize:".6rem",color:"rgba(255,255,255,.28)",marginTop:2}}>{sublabel}</div>}
    </div>
    <div onClick={()=>onChange(!value)}
      style={{width:42,height:24,borderRadius:99,background:value?`linear-gradient(90deg,${C.accent},${C.ring})`:"rgba(255,255,255,.1)",border:value?`1px solid ${C.ring}50`:"1px solid rgba(255,255,255,.12)",cursor:"pointer",position:"relative",transition:"all .25s",flexShrink:0,boxShadow:value?`0 0 12px ${C.ring}40`:"none"}}>
      <div style={{position:"absolute",top:3,left:value?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.4)"}}/>
    </div>
  </div>
);

const SaveBar = ({ dirty, onSave, onDiscard }) => dirty ? (
  <div style={{position:"sticky",bottom:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderRadius:14,background:"rgba(14,9,28,.97)",border:`1px solid ${C.ring}30`,boxShadow:`0 0 30px rgba(147,51,234,.2)`,backdropFilter:"blur(12px)",animation:"fadeUp .25s both",marginTop:".5rem"}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:C.amber,animation:"blink 1.2s step-start infinite"}}/>
      <span style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:700,color:"rgba(255,255,255,.55)"}}>You have unsaved changes</span>
    </div>
    <div style={{display:"flex",gap:8}}>
      <button onClick={onDiscard} style={{padding:"7px 16px",borderRadius:9,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,transition:"all .2s"}}
        onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.09)"}
        onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}>Discard</button>
      <button onClick={onSave} style={{padding:"7px 18px",borderRadius:9,background:`linear-gradient(135deg,${C.accent},${C.ring})`,border:"none",color:"#fff",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:800,boxShadow:`0 0 16px ${C.ring}40`,transition:"all .2s"}}
        onMouseOver={e=>e.currentTarget.style.opacity=".88"}
        onMouseOut={e=>e.currentTarget.style.opacity="1"}>Save Changes</button>
    </div>
  </div>
) : null;



const ProfileSection = ({ data, setData, onDirty }) => {
  const set = (key, val) => { setData(d=>({...d,[key]:val})); onDirty(); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <SectionTitle icon="👤" title="Personal Profile" subtitle="Your basic personal and professional information"/>

      {}
      <div style={{display:"flex",alignItems:"center",gap:18,padding:"1.2rem",borderRadius:16,background:C.card,border:`1px solid ${C.faint}`}}>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:72,height:72,borderRadius:20,background:`linear-gradient(135deg,#5b21b6,${C.ring})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#fff",border:`2px solid ${C.ring}50`,boxShadow:`0 0 20px ${C.ring}30`}}>
            {data.firstName[0]}{data.lastName[0]}
          </div>
          <button style={{position:"absolute",bottom:-4,right:-4,width:22,height:22,borderRadius:7,background:`${C.ring}`,border:`2px solid ${C.bg}`,color:"#fff",cursor:"pointer",fontSize:".65rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✏</button>
        </div>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:800,color:"#fff"}}>Dr. {data.firstName} {data.lastName}</div>
          <div style={{fontSize:".68rem",color:`${C.glow}80`,marginTop:2}}>{data.specialty} · {data.qualification}</div>
          <div style={{fontSize:".62rem",color:"rgba(255,255,255,.3)",marginTop:3}}>{data.regNo} · {data.experience} years experience</div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            {[{val:data.rating,icon:"⭐",color:C.amber},{val:`${data.patientsToday} today`,icon:"👥",color:C.glow},{val:data.opd,icon:"🏥",color:C.indigo}].map(({val,icon,color})=>(
              <span key={val} style={{padding:"2px 9px",borderRadius:50,background:`${color}12`,border:`1px solid ${color}22`,color,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{icon} {val}</span>
            ))}
          </div>
        </div>
      </div>

      {}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        <Field label="First Name" value={data.firstName} onChange={v=>set("firstName",v)} placeholder="First name"/>
        <Field label="Last Name"  value={data.lastName}  onChange={v=>set("lastName",v)}  placeholder="Last name"/>
        <Field label="Date of Birth" value={data.dob} onChange={v=>set("dob",v)} type="date"/>
        <SelectField label="Gender" value={data.gender} onChange={v=>set("gender",v)} options={[{value:"female",label:"Female"},{value:"male",label:"Male"},{value:"other",label:"Other / Prefer not to say"}]}/>
        <Field label="Phone Number" value={data.phone} onChange={v=>set("phone",v)} type="tel" placeholder="+91 98765 43210"/>
        <Field label="Email Address" value={data.email} onChange={v=>set("email",v)} type="email" placeholder="doctor@hospital.com"/>
        <Field label="Personal Email" value={data.personalEmail} onChange={v=>set("personalEmail",v)} type="email" placeholder="personal@email.com"/>
        <Field label="Emergency Contact" value={data.emergencyContact} onChange={v=>set("emergencyContact",v)} placeholder="Name · Phone"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1rem"}}>
        <Field label="Primary Specialty" value={data.specialty} onChange={v=>set("specialty",v)} placeholder="e.g. Endocrinology"/>
        <Field label="Sub-Specialty" value={data.subSpecialty} onChange={v=>set("subSpecialty",v)} placeholder="e.g. Diabetes & Thyroid"/>
        <Field label="MCI Reg. Number" value={data.regNo} onChange={v=>set("regNo",v)} placeholder="MCI-XX-XXXX-XXXXX" hint="As printed on your registration certificate"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1rem"}}>
        <Field label="Qualification" value={data.qualification} onChange={v=>set("qualification",v)} placeholder="e.g. MBBS, MD"/>
        <Field label="Fellowship / DM" value={data.fellowship} onChange={v=>set("fellowship",v)} placeholder="e.g. DNB Endocrinology"/>
        <Field label="Years of Experience" value={data.experience} onChange={v=>set("experience",v)} type="number" placeholder="14"/>
      </div>

      <TextareaField label="Professional Bio" value={data.bio} onChange={v=>set("bio",v)} rows={4} placeholder="Brief professional summary visible to patients…"/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        <Field label="Languages Spoken" value={data.languages} onChange={v=>set("languages",v)} placeholder="English, Tamil, Hindi"/>
        <Field label="LinkedIn / Website" value={data.website} onChange={v=>set("website",v)} placeholder="https://…"/>
      </div>
    </div>
  );
};

const ClinicSection = ({ data, setData, onDirty }) => {
  const set=(key,val)=>{setData(d=>({...d,[key]:val}));onDirty();};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <SectionTitle icon="🏥" title="Clinic & Practice" subtitle="Hospital, department, and consultation room details"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        <Field label="Hospital / Institution" value={data.hospital} onChange={v=>set("hospital",v)} placeholder="City General Hospital"/>
        <Field label="Department" value={data.dept} onChange={v=>set("dept",v)} placeholder="Dept. of Endocrinology"/>
        <Field label="OPD Room / Location" value={data.opd} onChange={v=>set("opd",v)} placeholder="OPD 4, Second Floor"/>
        <Field label="Clinic Phone" value={data.clinicPhone} onChange={v=>set("clinicPhone",v)} placeholder="+91 44 2678 0000"/>
        <Field label="Consultation Fees (₹)" value={data.fees} onChange={v=>set("fees",v)} type="number" placeholder="800"/>
        <Field label="Follow-up Fees (₹)" value={data.followUpFees} onChange={v=>set("followUpFees",v)} type="number" placeholder="500"/>
      </div>
      <TextareaField label="Clinic Address" value={data.address} onChange={v=>set("address",v)} rows={3} placeholder="Full address including pincode…"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        <Field label="City" value={data.city} onChange={v=>set("city",v)} placeholder="Chennai"/>
        <Field label="State" value={data.state} onChange={v=>set("state",v)} placeholder="Tamil Nadu"/>
        <Field label="Pincode" value={data.pincode} onChange={v=>set("pincode",v)} placeholder="600001"/>
        <Field label="Hospital Website" value={data.hospitalWebsite} onChange={v=>set("hospitalWebsite",v)} placeholder="https://hospital.com"/>
      </div>
      <div>
        <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:8}}>Services Offered</label>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {["Diabetes Management","Thyroid Disorders","PCOD / PCOS","Adrenal Disorders","Obesity Clinic","Insulin Pump","Teleconsultation","Home Visits"].map(s=>{
            const active=data.services.includes(s);
            return(
              <button key={s} onClick={()=>{onDirty();setData(d=>({...d,services:active?d.services.filter(x=>x!==s):[...d.services,s]}));}}
                style={{padding:"5px 12px",borderRadius:8,border:active?`1px solid ${C.ring}40`:"1px solid rgba(255,255,255,.08)",background:active?`rgba(147,51,234,.14)`:"rgba(255,255,255,.03)",color:active?C.ring:"rgba(255,255,255,.4)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700,transition:"all .2s"}}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ScheduleSection = ({ data, setData, onDirty }) => {
  const set=(key,val)=>{setData(d=>({...d,[key]:val}));onDirty();};
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <SectionTitle icon="📅" title="Schedule & OPD" subtitle="Manage your working hours, slot duration and appointment availability"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1rem"}}>
        <Field label="Morning Start" value={data.morningStart} onChange={v=>set("morningStart",v)} type="time"/>
        <Field label="Morning End" value={data.morningEnd} onChange={v=>set("morningEnd",v)} type="time"/>
        <Field label="Slot Duration (min)" value={data.slotDuration} onChange={v=>set("slotDuration",v)} type="number" placeholder="20"/>
        <Field label="Afternoon Start" value={data.afternoonStart} onChange={v=>set("afternoonStart",v)} type="time"/>
        <Field label="Afternoon End" value={data.afternoonEnd} onChange={v=>set("afternoonEnd",v)} type="time"/>
        <Field label="Max Patients / Day" value={data.maxPatients} onChange={v=>set("maxPatients",v)} type="number" placeholder="30"/>
      </div>
      <div>
        <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:8}}>Working Days</label>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {days.map(d=>{
            const active=data.workingDays.includes(d);
            return(
              <button key={d} onClick={()=>{onDirty();setData(dt=>({...dt,workingDays:active?dt.workingDays.filter(x=>x!==d):[...dt.workingDays,d]}));}}
                style={{padding:"5px 14px",borderRadius:8,border:active?`1px solid ${C.ring}40`:"1px solid rgba(255,255,255,.08)",background:active?`rgba(147,51,234,.14)`:"rgba(255,255,255,.03)",color:active?C.ring:"rgba(255,255,255,.4)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,transition:"all .2s"}}>
                {d.slice(0,3)}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[
          {key:"allowWalkIns",    label:"Allow Walk-in Patients",     sub:"Patients can visit without prior appointment"},
          {key:"allowTeleconsult",label:"Enable Teleconsultation",     sub:"Allow video and phone consultations"},
          {key:"autoConfirm",    label:"Auto-confirm Appointments",   sub:"New bookings are confirmed automatically"},
          {key:"sendReminders",  label:"Send Appointment Reminders",  sub:"SMS and email reminders to patients 24hrs before"},
        ].map(t=>(
          <Toggle key={t.key} label={t.label} sublabel={t.sub} value={data[t.key]} onChange={v=>{set(t.key,v);}}/>
        ))}
      </div>
    </div>
  );
};

const NotificationsSection = ({ data, setData, onDirty }) => {
  const set=(key,val)=>{setData(d=>({...d,[key]:val}));onDirty();};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <SectionTitle icon="🔔" title="Notifications" subtitle="Control what alerts and updates you receive"/>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:4}}>Patient Notifications</div>
        {[
          {key:"newMessage",      label:"New Patient Messages",         sub:"Alert when a patient sends you a message"},
          {key:"urgentReport",    label:"Urgent Report Uploads",        sub:"Immediate alert for critical lab results"},
          {key:"appointmentBooked",label:"New Appointment Booked",     sub:"Notify when a patient books a slot"},
          {key:"appointmentCancelled",label:"Appointment Cancellations",sub:"Notify when a patient cancels"},
          {key:"missedCalls",    label:"Missed Call Alerts",           sub:"Notify if a patient call is missed"},
        ].map(t=><Toggle key={t.key} label={t.label} sublabel={t.sub} value={data[t.key]} onChange={v=>set(t.key,v)}/>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:4}}>System Notifications</div>
        {[
          {key:"systemUpdates",  label:"System & Portal Updates",     sub:"Feature releases and maintenance notices"},
          {key:"reportReadyEmail",label:"Report Ready Emails",         sub:"Email when lab reports are uploaded"},
          {key:"dailySummary",   label:"Daily Patient Summary",       sub:"End-of-day digest of OPD activity"},
          {key:"weeklyStats",    label:"Weekly Analytics Report",     sub:"Weekly email with practice statistics"},
        ].map(t=><Toggle key={t.key} label={t.label} sublabel={t.sub} value={data[t.key]} onChange={v=>set(t.key,v)}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        <SelectField label="Notification Sound" value={data.sound} onChange={v=>set("sound",v)} options={[{value:"default",label:"Default Chime"},{value:"soft",label:"Soft Bell"},{value:"none",label:"Silent"}]}/>
        <SelectField label="Digest Frequency" value={data.digest} onChange={v=>set("digest",v)} options={[{value:"realtime",label:"Real-time"},{value:"hourly",label:"Every Hour"},{value:"daily",label:"Once Daily"}]}/>
      </div>
    </div>
  );
};

const SecuritySection = ({ data, setData, onDirty }) => {
  const set=(key,val)=>{setData(d=>({...d,[key]:val}));onDirty();};
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw,     setShowNewPw]     = useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <SectionTitle icon="🔒" title="Security" subtitle="Manage your password, two-factor authentication and session settings"/>
      {}
      <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:16,padding:"1.1rem 1.2rem"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.55)",marginBottom:"1rem"}}>Change Password</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>Current Password</label>
            <div style={{position:"relative"}}>
              <input type={showCurrentPw?"text":"password"} value={data.currentPw} onChange={e=>set("currentPw",e.target.value)} placeholder="••••••••"
                style={{width:"100%",padding:"9px 36px 9px 12px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
              <button onClick={()=>setShowCurrentPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".8rem"}}>{showCurrentPw?"🙈":"👁"}</button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>New Password</label>
            <div style={{position:"relative"}}>
              <input type={showNewPw?"text":"password"} value={data.newPw} onChange={e=>set("newPw",e.target.value)} placeholder="••••••••"
                style={{width:"100%",padding:"9px 36px 9px 12px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
              <button onClick={()=>setShowNewPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".8rem"}}>{showNewPw?"🙈":"👁"}</button>
            </div>
          </div>
          <Field label="Confirm New Password" value={data.confirmPw} onChange={v=>set("confirmPw",v)} type="password" placeholder="••••••••"/>
        </div>
        {}
        {data.newPw && (
          <div style={{marginTop:"1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,color:"rgba(255,255,255,.3)"}}>Password Strength</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,color:data.newPw.length>10?C.green:data.newPw.length>6?C.amber:C.red}}>
                {data.newPw.length>10?"Strong":data.newPw.length>6?"Medium":"Weak"}
              </span>
            </div>
            <div style={{height:5,borderRadius:99,background:"rgba(255,255,255,.06)"}}>
              <div style={{height:"100%",borderRadius:99,background:data.newPw.length>10?C.green:data.newPw.length>6?C.amber:C.red,width:`${Math.min((data.newPw.length/12)*100,100)}%`,transition:"width .3s,background .3s"}}/>
            </div>
          </div>
        )}
      </div>
      {}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[
          {key:"twoFactor",  label:"Two-Factor Authentication",    sub:"Require OTP on every login — highly recommended"},
          {key:"biometric",  label:"Biometric Login",               sub:"Use fingerprint or face ID on mobile devices"},
          {key:"autoLogout", label:"Auto Logout After Inactivity",  sub:"Session expires after 30 minutes of inactivity"},
          {key:"loginAlerts",label:"Login Alerts",                  sub:"Email notification on new device login"},
        ].map(t=><Toggle key={t.key} label={t.label} sublabel={t.sub} value={data[t.key]} onChange={v=>set(t.key,v)}/>)}
      </div>
      {}
      <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:16,padding:"1.1rem 1.2rem"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.55)",marginBottom:".8rem"}}>Active Sessions</div>
        {[
          {device:"MacBook Pro · Chrome",location:"Chennai, IN",time:"Current session",active:true},
          {device:"iPhone 15 · Safari",location:"Chennai, IN",time:"2 hours ago",active:false},
          {device:"iPad · Safari",location:"Chennai, IN",time:"Yesterday",active:false},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<2?"1px solid rgba(255,255,255,.04)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:9,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem"}}>{s.device.includes("iPhone")?"📱":s.device.includes("iPad")?"📱":"💻"}</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,color:s.active?"#fff":"rgba(255,255,255,.55)"}}>{s.device}</div>
                <div style={{fontSize:".57rem",color:"rgba(255,255,255,.25)",marginTop:1}}>{s.location} · {s.time}</div>
              </div>
            </div>
            {s.active
              ?<span style={{padding:"2px 9px",borderRadius:50,background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.22)",color:C.green,fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>● Active</span>
              :<button style={{padding:"3px 10px",borderRadius:7,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.18)",color:C.red,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:700}}>Revoke</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

const AppearanceSection = ({ data, setData, onDirty }) => {
  const set=(key,val)=>{setData(d=>({...d,[key]:val}));onDirty();};
  const themes=[
    {key:"purple",label:"Purple (Default)",colors:["#9333ea","#a855f7","#c084fc"]},
    {key:"blue",  label:"Ocean Blue",       colors:["#3b82f6","#60a5fa","#93c5fd"]},
    {key:"teal",  label:"Teal Green",       colors:["#0d9488","#14b8a6","#5eead4"]},
    {key:"rose",  label:"Rose Pink",        colors:["#e11d48","#f43f5e","#fb7185"]},
  ];
  const accents=[C.ring,C.indigo,C.green,C.amber,C.red,C.pink];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <SectionTitle icon="🎨" title="Appearance" subtitle="Customise the look and feel of your portal"/>
      {}
      <div>
        <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:10}}>Colour Theme</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
          {themes.map(t=>(
            <button key={t.key} onClick={()=>set("theme",t.key)}
              style={{padding:"12px 10px",borderRadius:12,border:data.theme===t.key?`1px solid ${C.ring}50`:"1px solid rgba(255,255,255,.07)",background:data.theme===t.key?"rgba(147,51,234,.12)":"rgba(255,255,255,.03)",cursor:"pointer",transition:"all .2s"}}>
              <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:7}}>
                {t.colors.map(col=><div key={col} style={{width:16,height:16,borderRadius:"50%",background:col,boxShadow:`0 0 6px ${col}88`}}/>)}
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:data.theme===t.key?C.ring:"rgba(255,255,255,.4)",textAlign:"center"}}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>
      {}
      <div>
        <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:10}}>Accent Colour</label>
        <div style={{display:"flex",gap:10}}>
          {accents.map(col=>(
            <button key={col} onClick={()=>set("accent",col)}
              style={{width:32,height:32,borderRadius:9,background:col,border:data.accent===col?`3px solid #fff`:"3px solid transparent",cursor:"pointer",boxShadow:`0 0 10px ${col}80`,transition:"all .2s"}}/>
          ))}
        </div>
      </div>
      {}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:4}}>Display Preferences</div>
        {[
          {key:"compactMode",    label:"Compact Mode",              sub:"Reduce spacing for more information density"},
          {key:"showAnimations", label:"Animations & Transitions",  sub:"Smooth transitions throughout the portal"},
          {key:"showAvatars",    label:"Patient Avatars",           sub:"Show patient initials avatar in lists"},
          {key:"sidebarExpanded",label:"Keep Sidebar Expanded",     sub:"Sidebar stays open by default on load"},
        ].map(t=><Toggle key={t.key} label={t.label} sublabel={t.sub} value={data[t.key]} onChange={v=>set(t.key,v)}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        <SelectField label="Font Size" value={data.fontSize} onChange={v=>set("fontSize",v)} options={[{value:"sm",label:"Small"},{value:"md",label:"Medium (Default)"},{value:"lg",label:"Large"}]}/>
        <SelectField label="Language" value={data.language} onChange={v=>set("language",v)} options={[{value:"en",label:"English"},{value:"ta",label:"Tamil"},{value:"hi",label:"Hindi"}]}/>
        <SelectField label="Date Format" value={data.dateFormat} onChange={v=>set("dateFormat",v)} options={[{value:"dmy",label:"DD/MM/YYYY"},{value:"mdy",label:"MM/DD/YYYY"},{value:"ymd",label:"YYYY-MM-DD"}]}/>
        <SelectField label="Time Format" value={data.timeFormat} onChange={v=>set("timeFormat",v)} options={[{value:"12h",label:"12-hour (AM/PM)"},{value:"24h",label:"24-hour"}]}/>
      </div>
    </div>
  );
};

import DoctorSidebar from "./DoctorSidebar";

export default function DoctorSettings() {
  const navigate = useNavigate();
  const [ripple, setRipple] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("profile");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  
  const [profile, setProfile] = useState({
    firstName: "Sarah", lastName: "Mitchell",
    dob: "1982-05-14", gender: "female",
    phone: "+91 98400 12345", email: "sarah.mitchell@cgh.in",
    personalEmail: "sarahmitchell@gmail.com", emergencyContact: "James Mitchell · +91 98400 56789",
    specialty: "Endocrinology", subSpecialty: "Diabetes & Thyroid",
    regNo: "MCI-DL-2009-44821", qualification: "MBBS, MD (Medicine)",
    fellowship: "DM Endocrinology (AIIMS)", experience: "14",
    bio: "Senior Consultant Endocrinologist with 14 years of specialised experience in managing complex endocrine disorders including Type 1 & 2 Diabetes, Thyroid diseases, PCOD, Adrenal and Pituitary disorders.",
    languages: "English, Tamil, Hindi", website: "https://linkedin.com/in/drsarahmitchell",
    patientsToday: 24, rating: "4.9", opd: "OPD 4",
  });
  const [clinic, setClinic] = useState({
    hospital: "City General Hospital", dept: "Dept. of Endocrinology",
    opd: "OPD 4, Second Floor", clinicPhone: "+91 44 2678 0000",
    fees: "800", followUpFees: "500",
    address: "12, Anna Salai, Nungambakkam", city: "Chennai", state: "Tamil Nadu",
    pincode: "600006", hospitalWebsite: "https://citygeneralhospital.in",
    services: ["Diabetes Management", "Thyroid Disorders", "PCOD / PCOS", "Teleconsultation"],
  });
  const [schedule, setSchedule] = useState({
    morningStart: "09:00", morningEnd: "13:00",
    afternoonStart: "14:30", afternoonEnd: "18:00",
    slotDuration: "20", maxPatients: "30",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    allowWalkIns: true, allowTeleconsult: true, autoConfirm: false, sendReminders: true,
  });
  const [notifs, setNotifs] = useState({
    newMessage: true, urgentReport: true, appointmentBooked: true,
    appointmentCancelled: true, missedCalls: false,
    systemUpdates: true, reportReadyEmail: true, dailySummary: true, weeklyStats: false,
    sound: "default", digest: "realtime",
  });
  const [security, setSecurity] = useState({
    currentPw: "", newPw: "", confirmPw: "",
    twoFactor: true, biometric: false, autoLogout: true, loginAlerts: true,
  });
  const [appearance, setAppearance] = useState({
    theme: "purple", accent: C.ring,
    compactMode: false, showAnimations: true, showAvatars: true, sidebarExpanded: false,
    fontSize: "md", language: "en", dateFormat: "dmy", timeFormat: "12h",
  });

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours();
  const greeting = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";

  const onSave = () => { setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const onDiscard = () => { setDirty(false); };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp  {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn {from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink   {0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes toastIn {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:${C.bg}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,.22);border-radius:99px}
        .dp{display:flex;height:100vh;overflow:hidden;background:${C.bg};position:relative}
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:rgba(6,3,15,.96);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(14px);position:relative}
        .dtb::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.ring}42,transparent)}
        .set-layout{flex:1;display:flex;overflow:hidden}
        .set-tabs{width:220px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.05);padding:14px 10px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}
        .set-content{flex:1;overflow-y:auto;padding:1.4rem 1.8rem;display:flex;flex-direction:column;gap:0}
        input[type=date]::-webkit-calendar-picker-indicator, input[type=time]::-webkit-calendar-picker-indicator{filter:invert(.5)}
        @media(max-width:768px){.sidebar{display:none}.set-tabs{display:none}.set-content{padding:1rem}}
      `}</style>

      {}
      {saved && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 300, padding: "10px 18px", borderRadius: 12, background: `rgba(52,211,153,.12)`, border: `1px solid rgba(52,211,153,.3)`, color: C.green, fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 8, boxShadow: `0 0 24px rgba(52,211,153,.2)`, animation: "toastIn .3s both" }}>
          ✅ Settings saved successfully
        </div>
      )}

      <div className="dp">
        <ParticleBg />
        
        <DoctorSidebar active="settings" />

        <div className="dm">
          {}
          <div className="dtb">
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,color:`${C.glow}70`,textTransform:"uppercase",letterSpacing:".09em"}}>{greeting}, Doctor</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",marginTop:1}}>
                Dr. Sarah Mitchell
                <span style={{color:`${C.ring}70`,fontSize:".78rem",fontWeight:600}}> · Endocrinology</span>
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

          <div className="set-layout">
            <div className="set-tabs">
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:800,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".12em",padding:"4px 8px",marginBottom:4}}>Settings</div>
              {SETTINGS_TABS.map(t=>(
                <button key={t.key} onClick={()=>setActiveTab(t.key)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:10,border:activeTab===t.key?"1px solid rgba(168,85,247,.25)":"1px solid transparent",background:activeTab===t.key?"rgba(147,51,234,.13)":"transparent",cursor:"pointer",color:activeTab===t.key?C.ring:"rgba(255,255,255,.38)",transition:"all .2s",width:"100%",textAlign:"left"}}
                  onMouseOver={e=>{ if(activeTab!==t.key){ e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.color="rgba(255,255,255,.7)"; }}}
                  onMouseOut={e=>{ if(activeTab!==t.key){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.38)"; }}}>
                  <span style={{fontSize:".95rem",flexShrink:0}}>{t.icon}</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:700,letterSpacing:".02em",whiteSpace:"nowrap"}}>{t.label}</span>
                  {activeTab===t.key&&<div style={{width:3,height:14,borderRadius:99,background:C.ring,boxShadow:`0 0 6px ${C.ring}`,marginLeft:"auto"}}/>}
                </button>
              ))}
              <div style={{marginTop:"auto",paddingTop:"1rem",borderTop:"1px solid rgba(255,255,255,.05)"}}>
                <button 
                  onClick={() => navigate("/doctor-delete-account")}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:10,border:"1px solid rgba(248,113,113,.12)",background:"rgba(248,113,113,.04)",cursor:"pointer",color:"rgba(248,113,113,.6)",width:"100%",fontFamily:"'Syne',sans-serif",fontSize:".66rem",fontWeight:700,transition:"all .2s"}}
                  onMouseOver={e=>{e.currentTarget.style.background="rgba(248,113,113,.1)";e.currentTarget.style.color=C.red;}}
                  onMouseOut={e=>{e.currentTarget.style.background="rgba(248,113,113,.04)";e.currentTarget.style.color="rgba(248,113,113,.6)";}}>
                  🗑 Delete Account
                </button>
              </div>
            </div>

            <div className="set-content" key={activeTab} style={{animation:"slideIn .28s cubic-bezier(.16,1,.3,1) both"}}>
              {activeTab==="profile"       && <ProfileSection      data={profile}    setData={setProfile}    onDirty={()=>setDirty(true)}/>}
              {activeTab==="clinic"        && <ClinicSection        data={clinic}     setData={setClinic}     onDirty={()=>setDirty(true)}/>}
              {activeTab==="schedule"      && <ScheduleSection      data={schedule}   setData={setSchedule}   onDirty={()=>setDirty(true)}/>}
              {activeTab==="notifications" && <NotificationsSection data={notifs}     setData={setNotifs}     onDirty={()=>setDirty(true)}/>}
              {activeTab==="security"      && <SecuritySection      data={security}   setData={setSecurity}   onDirty={()=>setDirty(true)}/>}
              {activeTab==="appearance"    && <AppearanceSection    data={appearance} setData={setAppearance} onDirty={()=>setDirty(true)}/>}

              <SaveBar dirty={dirty} onSave={onSave} onDiscard={onDiscard}/>
            </div>

          </div>{}
        </div>{}
      </div>{}
    </>
  );
}
