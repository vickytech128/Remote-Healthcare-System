import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";



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

const SETTINGS_TABS = [
  { key: "profile",       label: "Profile",       icon: "👤" },
  { key: "contact",       label: "Contact",       icon: "📞" },
  { key: "emergency",     label: "Emergency",     icon: "🚨" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "account",       label: "Account",       icon: "🔐" },
];


const PATIENT_STATIC = {
  id: "PAT-0042",
  uhid: "UHID-CGH-20240042",
  regPhone: "+91 98765-43210",
  regDate: "10 Jan 2025",
};

const PATIENT_EDITABLE_DEFAULT = {
  name: "Alex Johnson",
  dob: "1988-06-14",
  gender: "Male",
  blood: "O+",
  email: "alex.johnson@email.com",
  altPhone: "",
  whatsapp: "+91 98765-43210",
  address: "12, Sector 5, Dwarka, New Delhi – 110075",
  emergencyName: "Sarah Johnson",
  emergencyRel: "Spouse",
  emergencyPhone: "+91 91234-56789",
  language: "English",
  notifyAppt: true,
  notifyReport: true,
  notifyBill: true,
  notifyReminder: true,
};



const SectionTitle = ({ icon, title, subtitle }) => (
  <div style={{marginBottom:"1.2rem"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
      <div style={{width:34,height:34,borderRadius:10,background:`rgba(0,200,255,.12)`,border:`1px solid rgba(0,200,255,.22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>{icon}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:800,color:"#fff"}}>{title}</div>
    </div>
    {subtitle && <div style={{fontSize:".68rem",color:"rgba(255,255,255,.32)",marginLeft:44}}>{subtitle}</div>}
  </div>
);

const Field = ({ label, value, onChange, disabled, type = "text", hint, required }) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:disabled?"rgba(255,255,255,.2)":"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em",display:"flex",alignItems:"center",gap:5}}>
      {label}
      {required && <span style={{ color: "#ff6b6b" }}>*</span>}
      {disabled && <span style={{ marginLeft: "auto", fontSize: ".55rem", padding: "1px 7px", borderRadius: 50, background: "rgba(255,107,107,.1)", border: "1px solid rgba(255,107,107,.18)", color: "#ff9999", fontWeight: 600, letterSpacing: ".04em" }}>🔒 LOCKED</span>}
    </label>
    <div style={{position:"relative"}}>
      <input type={type} value={value} onChange={e=>onChange&&onChange(e.target.value)} disabled={disabled}
        style={{padding:"9px 12px",borderRadius:10,background:disabled?"rgba(255,255,255,.02)":"rgba(255,255,255,.04)",border:disabled?"1px solid rgba(255,255,255,.05)":"1px solid rgba(255,255,255,.08)",color:disabled?"rgba(255,255,255,.3)":"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color .2s",width:"100%",cursor:disabled?"not-allowed":"text"}}
        onFocus={e=>{if(!disabled)e.target.style.borderColor="rgba(0,200,255,.4)"}}
        onBlur={e=>{if(!disabled)e.target.style.borderColor="rgba(255,255,255,.08)"}}
      />
    </div>
    {hint && <div style={{fontSize:".58rem",color:"rgba(255,255,255,.22)"}}>{hint}</div>}
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>{label}</label>
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{padding:"9px 12px",borderRadius:10,background:"rgba(5,15,31,.95)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer",transition:"border-color .2s"}}
      onFocus={e=>e.target.style.borderColor="rgba(0,200,255,.4)"}
      onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
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

const SaveBar = ({ dirty, onSave, onDiscard, saving }) => dirty ? (
  <div style={{position:"sticky",bottom:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderRadius:14,background:"rgba(5,15,31,.97)",border:`1px solid rgba(0,200,255,.3)`,boxShadow:`0 0 30px rgba(0,200,255,.15)`,backdropFilter:"blur(12px)",animation:"fadeUp .25s both",marginTop:".5rem",zIndex:100}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:C.amber,animation:"blink 1.2s step-start infinite"}}/>
      <span style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:700,color:"rgba(255,255,255,.55)"}}>You have unsaved changes</span>
    </div>
    <div style={{display:"flex",gap:8}}>
      <button onClick={onDiscard} disabled={saving} style={{padding:"7px 16px",borderRadius:9,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",cursor:saving?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,transition:"all .2s"}}
        onMouseOver={e=>{if(!saving)e.currentTarget.style.background="rgba(255,255,255,.09)"}}
        onMouseOut={e=>{if(!saving)e.currentTarget.style.background="rgba(255,255,255,.05)"}}>Discard</button>
      <button onClick={onSave} disabled={saving} style={{padding:"7px 18px",borderRadius:9,background:`linear-gradient(135deg,${C.accent},${C.ring})`,border:"none",color:"#fff",cursor:saving?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:800,boxShadow:`0 0 16px ${C.ring}40`,transition:"all .2s",display:"flex",alignItems:"center",gap:6,opacity:saving?.7:1}}
        onMouseOver={e=>{if(!saving)e.currentTarget.style.opacity=".88"}}
        onMouseOut={e=>{if(!saving)e.currentTarget.style.opacity="1"}}>
        {saving && <span style={{animation:"spin .8s linear infinite",display:"inline-block"}}>⟳</span>}
        {saving?"Saving...":"Save Changes"}
      </button>
    </div>
  </div>
) : null;




const ProfileSection = ({ form, setForm, onDirty }) => {
  const set=(key)=>(val)=>{setForm(f=>({...f,[key]:val}));onDirty();};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:700}}>
      <SectionTitle icon="👤" title="Personal Profile" subtitle="Your basic demographic and medical information"/>
      
      {}
      <div style={{display:"flex",alignItems:"center",gap:18,padding:"1.2rem",borderRadius:16,background:C.card,border:`1px solid ${C.faint}`}}>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#0066ff,#00c8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",border:`3px solid rgba(0,200,255,.35)`,boxShadow:`0 0 24px rgba(0,200,255,.2)`}}>👤</div>
        </div>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:800,color:"#fff"}}>{form.name || "—"}</div>
          <div style={{fontSize:".68rem",color:`rgba(0,200,255,.7)`,marginTop:2}}>Patient · {PATIENT_STATIC.id}</div>
          <div style={{fontSize:".62rem",color:"rgba(255,255,255,.3)",marginTop:3}}>Registered {PATIENT_STATIC.regDate} · City General Hospital</div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <span style={{padding:"2px 10px",borderRadius:50,background:"rgba(0,255,157,.1)",border:"1px solid rgba(0,255,157,.25)",color:"#00ff9d",fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>● Active</span>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:C.card,border:`1px solid ${C.faint}`,borderRadius:16,padding:"1.1rem 1.2rem"}}>
        <div style={{gridColumn:"1/-1",fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.55)",marginBottom:".5rem",borderBottom:`1px solid ${C.faint}`,paddingBottom:8}}>Hospital Registration (Read-only)</div>
        <Field label="Patient ID" value={PATIENT_STATIC.id} disabled hint="Assigned by hospital — cannot be changed"/>
        <Field label="UHID" value={PATIENT_STATIC.uhid} disabled hint="Unique Hospital ID — cannot be changed"/>
        <Field label="Registered Mobile" value={PATIENT_STATIC.regPhone} disabled hint="Mobile used during registration — contact hospital to update"/>
        <Field label="Registered On" value={PATIENT_STATIC.regDate} disabled/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:C.card,border:`1px solid ${C.faint}`,borderRadius:16,padding:"1.1rem 1.2rem"}}>
        <div style={{gridColumn:"1/-1",fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.55)",marginBottom:".5rem",borderBottom:`1px solid ${C.faint}`,paddingBottom:8}}>Editable Details</div>
        <Field label="Full Name" value={form.name} onChange={set("name")} required/>
        <Field label="Date of Birth" value={form.dob} onChange={set("dob")} type="date"/>
        <SelectField label="Gender" value={form.gender} onChange={set("gender")} options={["Male","Female","Non-binary","Prefer not to say"]}/>
        <SelectField label="Blood Group" value={form.blood} onChange={set("blood")} options={["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"]}/>
        <SelectField label="Preferred Language" value={form.language} onChange={set("language")} options={["English","Hindi","Tamil","Telugu","Bengali","Marathi","Gujarati"]}/>
      </div>
    </div>
  );
};

const ContactSection = ({ form, setForm, onDirty }) => {
  const set=(key)=>(val)=>{setForm(f=>({...f,[key]:val}));onDirty();};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:700}}>
      <SectionTitle icon="📞" title="Contact Details" subtitle="How the hospital can reach you"/>
      
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:C.card,border:`1px solid ${C.faint}`,borderRadius:16,padding:"1.1rem 1.2rem"}}>
        <Field label="Email Address" value={form.email} onChange={set("email")} type="email" required/>
        <Field label="Alternate Phone" value={form.altPhone} onChange={set("altPhone")} type="tel" hint="Optional secondary number"/>
        <div style={{gridColumn:"1/-1"}}>
          <Field label="Home Address" value={form.address} onChange={set("address")} placeholder="Full address including pincode"/>
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:16,padding:"1.1rem 1.2rem"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.55)",marginBottom:"1rem"}}>WhatsApp Notifications</div>
        
        <div style={{padding:"10px 14px",borderRadius:11,background:"rgba(0,255,157,.06)",border:"1px solid rgba(0,255,157,.15)",marginBottom:"1.5rem",display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:"1.1rem",marginTop:1}}>ℹ️</span>
          <div style={{fontSize:".74rem",color:"rgba(255,255,255,.55)",lineHeight:1.7}}>
            Add a <strong style={{color:"#00ff9d"}}>WhatsApp number</strong> to receive appointment reminders, report ready alerts, medicine reminders, and billing notifications directly on WhatsApp. This can be different from your registered mobile number.
          </div>
        </div>

        <Field label="WhatsApp Number" value={form.whatsapp} onChange={set("whatsapp")} type="tel" required hint="Enter with country code e.g. +91 98765-43210"/>
        
        <div style={{marginTop:"1.5rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:".5rem"}}>
          {[{icon:"📅",label:"Appointment Reminders",desc:"1 day & 1 hr before"},
            {icon:"📋",label:"Report Ready Alerts",desc:"When results are uploaded"},
            {icon:"💊",label:"Medicine Reminders",desc:"Daily dose reminders"},
            {icon:"🧾",label:"Bill Notifications",desc:"New bill or due reminders"}].map(({icon,label,desc})=>(
            <div key={label} style={{padding:"9px 12px",borderRadius:10,background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",display:"flex",gap:9,alignItems:"center"}}>
              <span style={{fontSize:"1rem"}}>{icon}</span>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,color:"rgba(255,255,255,.7)"}}>{label}</div>
                <div style={{fontSize:".58rem",color:"rgba(255,255,255,.28)",marginTop:1}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmergencySection = ({ form, setForm, onDirty }) => {
  const set=(key)=>(val)=>{setForm(f=>({...f,[key]:val}));onDirty();};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:700}}>
      <SectionTitle icon="🚨" title="Emergency Contact" subtitle="Who we should contact in case of emergency"/>
      
      <div style={{padding:"10px 14px",borderRadius:11,background:"rgba(255,107,107,.06)",border:"1px solid rgba(255,107,107,.15)",display:"flex",gap:10,alignItems:"center",animation:"fadeUp .3s both"}}>
        <span style={{fontSize:"1.1rem"}}>🚨</span>
        <div style={{fontSize:".74rem",color:"rgba(255,255,255,.5)",lineHeight:1.6}}>
          Emergency contact will be notified by the hospital in case of a medical emergency. Please keep this information up to date.
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:C.card,border:`1px solid ${C.faint}`,borderRadius:16,padding:"1.1rem 1.2rem"}}>
        <Field label="Contact Name" value={form.emergencyName} onChange={set("emergencyName")} required/>
        <SelectField label="Relationship" value={form.emergencyRel} onChange={set("emergencyRel")} options={["Spouse","Parent","Sibling","Child","Friend","Guardian","Other"]}/>
        <div style={{gridColumn:"1/-1"}}>
          <Field label="Emergency Phone Number" value={form.emergencyPhone} onChange={set("emergencyPhone")} type="tel" required hint="This number will be called first in an emergency"/>
        </div>
      </div>
    </div>
  );
};

const NotificationsSection = ({ form, setForm, onDirty }) => {
  const set=(key)=>(val)=>{setForm(f=>({...f,[key]:val}));onDirty();};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:700}}>
      <SectionTitle icon="🔔" title="Notifications" subtitle="Control what alerts and updates you receive"/>
      
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:4}}>WhatsApp Preferences</div>
        {[
          {key:"notifyAppt",    label:"Appointment Reminders",  sub:"Get reminders 1 day and 1 hour before scheduled appointment"},
          {key:"notifyReport",  label:"Report Ready Alerts",    sub:"Notified when your lab or radiology report is uploaded"},
          {key:"notifyBill",    label:"Billing Notifications",  sub:"New bill generated or payment due reminders"},
          {key:"notifyReminder",label:"Medicine Reminders",     sub:"Daily reminders for your current medications"},
        ].map(t=><Toggle key={t.key} label={t.label} sublabel={t.sub} value={form[t.key]} onChange={v=>set(t.key)(v)}/>)}
      </div>

      <div style={{padding:"14px",borderRadius:13,background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:".72rem",fontWeight:700,color:"rgba(255,255,255,.6)"}}>Sending to WhatsApp</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:".82rem",fontWeight:800,color:"#00ff9d",marginTop:2}}>{form.whatsapp || "—"}</div>
        </div>
        <div style={{fontSize:".6rem",color:"rgba(255,255,255,.28)"}}>Edit in Contact tab</div>
      </div>
    </div>
  );
};

const SecuritySection = () => {
  
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:700}}>
      <SectionTitle icon="🔒" title="Account Security" subtitle="Manage your password, two-factor authentication and session settings"/>
      
      {}
      <div style={{borderRadius:16,background:C.card,border:`1px solid ${showPwForm?"rgba(0,200,255,.35)":C.faint}`,overflow:"hidden",transition:"border-color .2s"}}>
        <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:"rgba(0,200,255,.1)",border:"1px solid rgba(0,200,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>🔑</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"rgba(255,255,255,.75)"}}>Password</div>
              <div style={{fontSize:".62rem",color:"rgba(255,255,255,.28)",marginTop:1}}>Last changed 30 days ago · ••••••••••••</div>
            </div>
          </div>
          <button onClick={()=>setShowPwForm(v=>!v)} style={{padding:"6px 14px",borderRadius:8,background:showPwForm?"rgba(255,107,107,.1)":"rgba(0,200,255,.1)",border:showPwForm?"1px solid rgba(255,107,107,.25)":"1px solid rgba(0,200,255,.25)",color:showPwForm?"#ff9999":"#00c8ff",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700,transition:"all .2s"}}>
            {showPwForm ? "✕ Cancel" : "🔑 Change"}
          </button>
        </div>

        {showPwForm && (
          <div style={{padding:"0 16px 16px",borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:14,animation:"fadeUp .25s both"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>Current Password</label>
                <div style={{position:"relative"}}>
                  <input type={showCurrentPw?"text":"password"} value={currentPw} onChange={e=>setCurrentPw(e.target.value)} placeholder="Enter current password" style={{width:"100%",padding:"9px 36px 9px 12px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
                  <button onClick={()=>setShowCurrentPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".8rem"}}>{showCurrentPw?"🙈":"👁"}</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <label style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".08em"}}>New Password</label>
                <div style={{position:"relative"}}>
                  <input type={showNewPw?"text":"password"} value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Min. 8 characters" style={{width:"100%",padding:"9px 36px 9px 12px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#fff",fontSize:".75rem",fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
                  <button onClick={()=>setShowNewPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".8rem"}}>{showNewPw?"🙈":"👁"}</button>
                </div>
              </div>
              <div style={{gridColumn:"2/3"}}>
                 <Field label="Confirm New Password" type="password" value={confirmPw} onChange={setConfirmPw} placeholder="Re-enter new password"/>
              </div>
            </div>
            <button style={{width:"100%",padding:"11px",borderRadius:10,background:`linear-gradient(135deg,${C.accent},${C.ring})`,border:"none",color:"#fff",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              🔐 Update Password
            </button>
          </div>
        )}
      </div>

      {}
      <div style={{padding:"14px 16px",borderRadius:13,background:C.card,border:`1px solid ${C.faint}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:"rgba(0,255,157,.08)",border:"1px solid rgba(0,255,157,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>🛡️</div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"rgba(255,255,255,.75)"}}>Two-Factor Authentication</div>
            <div style={{fontSize:".62rem",color:"rgba(255,255,255,.28)",marginTop:1}}>Extra security via OTP on registered mobile</div>
          </div>
        </div>
        <span style={{padding:"3px 10px",borderRadius:50,background:"rgba(0,255,157,.1)",border:"1px solid rgba(0,255,157,.22)",color:"#00ff9d",fontSize:".6rem",fontWeight:700}}>Enabled</span>
      </div>

       {}
      <div style={{padding:"14px 16px",borderRadius:13,background:C.card,border:`1px solid ${C.faint}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:"rgba(0,200,255,.08)",border:"1px solid rgba(0,200,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>📱</div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"rgba(255,255,255,.75)"}}>Active Sessions</div>
            <div style={{fontSize:".62rem",color:"rgba(255,255,255,.28)",marginTop:1}}>Chrome · Windows · New Delhi · Just now</div>
          </div>
        </div>
        <button style={{padding:"6px 14px",borderRadius:8,background:"rgba(255,107,107,.07)",border:"1px solid rgba(255,107,107,.18)",color:"#ff9999",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700}}>
          Sign Out All
        </button>
      </div>
      
      {}
      <div style={{display:"flex",flexDirection:"column",gap:".6rem",borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:"1.5rem"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:"rgba(255,107,107,.8)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:4}}>Danger Zone</div>
        <div style={{padding:"13px 16px",borderRadius:12,background:"rgba(255,107,107,.05)",border:"1px solid rgba(255,107,107,.12)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"rgba(255,255,255,.7)"}}>Download My Data</div>
            <div style={{fontSize:".62rem",color:"rgba(255,255,255,.28)",marginTop:1}}>Export all your reports, bills, and vitals</div>
          </div>
          <button style={{padding:"6px 14px",borderRadius:8,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700}}>
            Export
          </button>
        </div>
        <div style={{padding:"13px 16px",borderRadius:12,background:"rgba(255,107,107,.05)",border:"1px solid rgba(255,107,107,.12)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"#ff9999"}}>Log Out</div>
            <div style={{fontSize:".62rem",color:"rgba(255,255,255,.28)",marginTop:1}}>Sign out of the patient portal</div>
          </div>
          <button onClick={() => navigate("/logout")} style={{padding:"6px 14px",borderRadius:8,background:"rgba(255,107,107,.1)",border:"1px solid rgba(255,107,107,.25)",color:"#ff6b6b",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700}}>
            Log Out
          </button>
        </div>
        <div style={{padding:"13px 16px",borderRadius:12,background:"rgba(220,38,38,.08)",border:"1px solid rgba(220,38,38,.2)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"#ff4a4a"}}>Delete Account</div>
            <div style={{fontSize:".62rem",color:"rgba(255,255,255,.28)",marginTop:1}}>Permanently remove your records</div>
          </div>
          <button onClick={() => navigate("/patient-delete-account")} style={{padding:"6px 14px",borderRadius:8,background:"rgba(220,38,38,.1)",border:"1px solid rgba(220,38,38,.3)",color:"#ff4a4a",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700}}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};



export default function SettingsPage() {
  const [form, setForm] = useState({ ...PATIENT_EDITABLE_DEFAULT });
  const [saved, setSaved] = useState({ ...PATIENT_EDITABLE_DEFAULT });
  const [activeTab, setActiveTab] = useState("profile");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900)); 
    setSaved({ ...form });
    setDirty(false);
    setSaving(false);
  };

  const handleDiscard = () => {
    setForm({ ...saved });
    setDirty(false);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:#050f1f}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        
        .vp{display:flex;height:100vh;overflow:hidden;background:#050f1f;position:relative}

        /* MAIN */
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.8rem;background:rgba(5,15,31,.95);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(10px)}

        /* SETTINGS LAYOUT (GRID) */
        .set-layout{flex:1;display:flex;overflow:hidden}
        .set-tabs{width:220px;flex-shrink:0;border-right:1px solid rgba(255,255,255,.05);padding:14px 10px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}
        .set-content{flex:1;overflow-y:auto;padding:1.4rem 1.8rem;display:flex;flex-direction:column;gap:0}

        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator{filter:invert(1)}

        @media(max-width:768px){.set-tabs{display:none}.set-content{padding:1rem}}
      `}</style>

      <div className="vp">
        <Sidebar active="settings" />

        <div className="dm">
          {}
          <div className="dtb">
            <div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#fff"}}>Settings</h1>
              <p style={{fontSize:".75rem",color:"rgba(255,255,255,.35)",marginTop:1}}>Manage your profile, contact info & preferences</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 14px",background:"rgba(0,255,157,.07)",border:"1px solid rgba(0,255,157,.2)",borderRadius:50}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:"#00ff9d",boxShadow:"0 0 8px #00ff9d",animation:"blink 1s step-start infinite",flexShrink:0}}/>
                <span style={{fontSize:".7rem",color:"#00ff9d",fontWeight:700,letterSpacing:".06em"}}>SYNCED</span>
              </div>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700,color:"#00c8ff"}}>
                {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {}
          <div className="set-layout">
            
            {}
            <div className="set-tabs">
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:800,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".12em",padding:"4px 8px",marginBottom:4}}>Menu</div>
              {SETTINGS_TABS.map(t=>(
                <button key={t.key} onClick={()=>setActiveTab(t.key)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:10,border:activeTab===t.key?"1px solid rgba(0,200,255,.25)":"1px solid transparent",background:activeTab===t.key?"rgba(0,200,255,.1)":"transparent",cursor:"pointer",color:activeTab===t.key?"#00c8ff":"rgba(255,255,255,.38)",transition:"all .2s",width:"100%",textAlign:"left"}}
                  onMouseOver={e=>{if(activeTab!==t.key){e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color="rgba(255,255,255,.7)"}}}
                  onMouseOut={e=>{if(activeTab!==t.key){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,.38)"}}}>
                  <span style={{fontSize:".95rem",flexShrink:0}}>{t.icon}</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:700,letterSpacing:".02em",whiteSpace:"nowrap"}}>{t.label}</span>
                  {activeTab===t.key&&<div style={{width:3,height:14,borderRadius:99,background:"#00c8ff",boxShadow:`0 0 6px #00c8ff`,marginLeft:"auto"}}/>}
                </button>
              ))}
            </div>

            {}
            <div className="set-content" key={activeTab} style={{animation:"slideIn .28s cubic-bezier(.16,1,.3,1) both"}}>
              {activeTab === "profile"       && <ProfileSection       form={form} setForm={setForm} onDirty={()=>setDirty(true)}/>}
              {activeTab === "contact"       && <ContactSection       form={form} setForm={setForm} onDirty={()=>setDirty(true)}/>}
              {activeTab === "emergency"     && <EmergencySection     form={form} setForm={setForm} onDirty={()=>setDirty(true)}/>}
              {activeTab === "notifications" && <NotificationsSection form={form} setForm={setForm} onDirty={()=>setDirty(true)}/>}
              {activeTab === "account"       && <SecuritySection/>}

              <SaveBar dirty={dirty} onSave={handleSave} onDiscard={handleDiscard} saving={saving}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
