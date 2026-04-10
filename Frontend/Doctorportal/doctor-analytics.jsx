import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg:"#070410",sidebar:"rgba(6,3,15,.97)",accent:"#9333ea",ring:"#a855f7",glow:"#c084fc",
  indigo:"#818cf8",green:"#34d399",amber:"#fbbf24",red:"#f87171",pink:"#f472b6",
  border:"rgba(168,85,247,.12)",card:"rgba(255,255,255,.03)",faint:"rgba(255,255,255,.05)",
};
const DOCTOR={name:"Dr. Sarah Mitchell",initials:"SM",specialty:"Endocrinology",regNo:"MCI-DL-2009-44821",dept:"Dept. of Endocrinology",hospital:"City General Hospital",opd:"OPD 4, Second Floor",exp:"14 yrs",rating:"4.9"};
const NAV=[
  {key:"dashboard",icon:"⚕",label:"Dashboard"},{key:"patients",icon:"👥",label:"My Patients"},
  {key:"appointments",icon:"📅",label:"Appointments"},{key:"reports",icon:"📋",label:"Reports"},
  {key:"prescriptions",icon:"💊",label:"Prescriptions"},{key:"analytics",icon:"📈",label:"Analytics"},
  {key:"messages",icon:"💬",label:"Messages"},{key:"chat",icon:"✨",label:"AI Chat"},{key:"settings",icon:"⚙️",label:"Settings"},
];

const PATIENTS = [
  {
    id:"CGH-0231",name:"Rajan Mehta",age:54,g:"M",blood:"B+",
    diagnosis:"Type 2 DM + Diabetic Foot",risk:"critical",
    lastVisit:"Mar 14, 2026",nextVisit:"Mar 21, 2026",
    vitals:{bp:"148/92",hr:88,spo2:96,temp:"37.8°C",weight:"84 kg",bmi:"28.6"},
    hba1c:[{m:"Oct",v:9.8},{m:"Nov",v:10.1},{m:"Dec",v:10.4},{m:"Jan",v:10.2},{m:"Feb",v:10.6},{m:"Mar",v:10.2}],
    glucose:[{m:"Oct",v:218},{m:"Nov",v:234},{m:"Dec",v:241},{m:"Jan",v:228},{m:"Feb",v:245},{m:"Mar",v:231}],
    history:[
      {date:"Mar 14, 2026",type:"critical",icon:"🦠",event:"Wound Culture: Pseudomonas aeruginosa — IV antibiotics started"},
      {date:"Mar 01, 2026",type:"warning",icon:"🩸",event:"HbA1c 10.2% — Insulin dose escalated"},
      {date:"Jan 10, 2026",type:"warning",icon:"🦶",event:"Diabetic foot ulcer detected — Grade II Wagner"},
      {date:"Nov 14, 2025",type:"normal",icon:"💊",event:"Metformin increased to 1000mg BD + Glargine added"},
      {date:"Sep 08, 2023",type:"critical",icon:"❤️",event:"Previous Heart Attack (NSTEMI) — Stented LAD artery"},
      {date:"Jun 15, 2021",type:"warning",icon:"🫀",event:"Hypertension diagnosed — Telmisartan started"},
      {date:"Mar 12, 2019",type:"normal",icon:"📋",event:"Type 2 DM diagnosed — Metformin 500mg initiated"},
    ],
    comorbidities:["Hypertension","NSTEMI (2023)","CKD Stage 2","Dyslipidaemia"],
    allergies:["Penicillin","Sulfonamides"],
    medications:["Metformin 1000mg","Insulin Glargine 20IU","Telmisartan 40mg","Atorvastatin 20mg"],
    alerts:["Critical HbA1c","Active Foot Infection","Cardiac History"],
  },
  {
    id:"CGH-0412",name:"Meena Krishnan",age:35,g:"F",blood:"O+",
    diagnosis:"PCOD + Insulin Resistance",risk:"high",
    lastVisit:"Mar 14, 2026",nextVisit:"Jun 14, 2026",
    vitals:{bp:"122/78",hr:76,spo2:99,temp:"37.0°C",weight:"72 kg",bmi:"27.3"},
    hba1c:[{m:"Oct",v:5.4},{m:"Nov",v:5.6},{m:"Dec",v:5.7},{m:"Jan",v:5.9},{m:"Feb",v:5.8},{m:"Mar",v:5.9}],
    glucose:[{m:"Oct",v:98},{m:"Nov",v:104},{m:"Dec",v:108},{m:"Jan",v:112},{m:"Feb",v:110},{m:"Mar",v:112}],
    history:[
      {date:"Mar 14, 2026",type:"critical",icon:"🧪",event:"Fasting Insulin 48 µU/mL — critically elevated, OGTT abnormal"},
      {date:"Feb 20, 2026",type:"warning",icon:"📊",event:"LH/FSH ratio 2.8 — PCOD pattern confirmed on USG"},
      {date:"Jan 05, 2026",type:"normal",icon:"💊",event:"Metformin SR 500mg + Inositol started"},
      {date:"Oct 12, 2025",type:"warning",icon:"⚖️",event:"Weight gain 6 kg over 6 months — lifestyle counselling"},
      {date:"Jul 18, 2024",type:"normal",icon:"📋",event:"PCOD diagnosed — irregular cycles for 18 months"},
    ],
    comorbidities:["PCOD","Insulin Resistance","Mild Anxiety"],
    allergies:["None known"],
    medications:["Metformin SR 500mg","Spironolactone 50mg","Inositol 2g","Folic Acid 5mg"],
    alerts:["Elevated Fasting Insulin","OGTT Abnormal"],
  },
  {
    id:"CGH-0501",name:"Vikram Choudhry",age:48,g:"M",blood:"A+",
    diagnosis:"Adrenal Mass — Post Biopsy",risk:"critical",
    lastVisit:"Mar 12, 2026",nextVisit:"Mar 26, 2026",
    vitals:{bp:"136/88",hr:82,spo2:97,temp:"37.2°C",weight:"78 kg",bmi:"25.9"},
    hba1c:[{m:"Oct",v:5.8},{m:"Nov",v:5.7},{m:"Dec",v:5.9},{m:"Jan",v:6.0},{m:"Feb",v:6.1},{m:"Mar",v:6.0}],
    glucose:[{m:"Oct",v:105},{m:"Nov",v:102},{m:"Dec",v:108},{m:"Jan",v:112},{m:"Feb",v:115},{m:"Mar",v:111}],
    history:[
      {date:"Mar 12, 2026",type:"critical",icon:"🔬",event:"Adrenal CT Biopsy — awaiting histopathology report"},
      {date:"Feb 28, 2026",type:"critical",icon:"🩻",event:"CT Abdomen: 3.2 cm right adrenal mass — malignancy cannot be excluded"},
      {date:"Feb 05, 2026",type:"warning",icon:"💊",event:"Hydrocortisone replacement started — adrenal insufficiency screen"},
      {date:"Nov 20, 2025",type:"warning",icon:"⚠️",event:"Incidental adrenal nodule on abdominal USG — referred to endocrinology"},
      {date:"May 03, 2022",type:"critical",icon:"🫀",event:"Previous Cardiac Arrest — Resuscitated, ICD implanted"},
    ],
    comorbidities:["Hypertension","Cardiac Arrest (2022)","ICD In Situ","Adrenal Mass"],
    allergies:["Aspirin","Ibuprofen"],
    medications:["Hydrocortisone 20mg","Amlodipine 5mg","Pantoprazole 40mg","Calcium+VitD3"],
    alerts:["Adrenal Malignancy Suspected","Cardiac History","ICD Present"],
  },
  {
    id:"CGH-0118",name:"Priya Sharma",age:29,g:"F",blood:"AB-",
    diagnosis:"Hypothyroidism (Hashimoto's)",risk:"normal",
    lastVisit:"Mar 12, 2026",nextVisit:"Apr 23, 2026",
    vitals:{bp:"112/70",hr:68,spo2:99,temp:"36.7°C",weight:"58 kg",bmi:"21.6"},
    hba1c:[{m:"Oct",v:5.2},{m:"Nov",v:5.1},{m:"Dec",v:5.2},{m:"Jan",v:5.3},{m:"Feb",v:5.2},{m:"Mar",v:5.2}],
    glucose:[{m:"Oct",v:88},{m:"Nov",v:86},{m:"Dec",v:90},{m:"Jan",v:92},{m:"Feb",v:89},{m:"Mar",v:91}],
    history:[
      {date:"Mar 12, 2026",type:"warning",icon:"🧪",event:"TSH 7.2 mIU/L — dose titration to Levothyroxine 75mcg"},
      {date:"Jan 18, 2026",type:"warning",icon:"📊",event:"Anti-TPO 210 IU/mL — Hashimoto's confirmed"},
      {date:"Nov 05, 2025",type:"normal",icon:"💊",event:"Selenium 200mcg added to regimen"},
      {date:"Aug 22, 2025",type:"normal",icon:"📋",event:"Hypothyroidism diagnosed — Levothyroxine 50mcg started"},
      {date:"Jun 10, 2024",type:"normal",icon:"👶",event:"Postpartum thyroiditis — self-resolved, monitored"},
    ],
    comorbidities:["Hashimoto's Thyroiditis","Postpartum Thyroiditis (2024)"],
    allergies:["None known"],
    medications:["Levothyroxine 75mcg","Selenium 200mcg"],
    alerts:["TSH Elevated"],
  },
  {
    id:"CGH-0389",name:"Suresh Pillai",age:61,g:"M",blood:"O-",
    diagnosis:"Type 2 DM — Quarterly Review",risk:"high",
    lastVisit:"Mar 08, 2026",nextVisit:"Jun 08, 2026",
    vitals:{bp:"140/86",hr:74,spo2:97,temp:"36.9°C",weight:"79 kg",bmi:"26.8"},
    hba1c:[{m:"Oct",v:8.4},{m:"Nov",v:8.1},{m:"Dec",v:7.9},{m:"Jan",v:7.6},{m:"Feb",v:7.4},{m:"Mar",v:7.3}],
    glucose:[{m:"Oct",v:196},{m:"Nov",v:188},{m:"Dec",v:178},{m:"Jan",v:168},{m:"Feb",v:161},{m:"Mar",v:156}],
    history:[
      {date:"Mar 08, 2026",type:"warning",icon:"🧪",event:"KFT: Creatinine 1.6 — mild azotemia, nephrology referral"},
      {date:"Dec 14, 2025",type:"normal",icon:"📈",event:"HbA1c improving trend — Glimepiride added"},
      {date:"Oct 02, 2025",type:"warning",icon:"💔",event:"Mild angina on exertion — Cardiology review, stress test normal"},
      {date:"Jul 12, 2025",type:"normal",icon:"💊",event:"Atorvastatin added — LDL 162 mg/dL"},
      {date:"Mar 18, 2023",type:"critical",icon:"❤️",event:"STEMI (Heart Attack) — Emergency PCI, 2 stents placed"},
      {date:"Jan 04, 2021",type:"warning",icon:"🫀",event:"Hypertension + Dyslipidaemia diagnosed"},
      {date:"Jun 10, 2016",type:"normal",icon:"📋",event:"Type 2 DM diagnosed at annual check-up"},
    ],
    comorbidities:["Hypertension","STEMI (2023)","CKD Stage 2","Dyslipidaemia"],
    allergies:["Codeine"],
    medications:["Metformin 1000mg","Glimepiride 2mg","Telmisartan 40mg","Atorvastatin 10mg"],
    alerts:["STEMI History","Elevated Creatinine","Angina Episodes"],
  },
  {
    id:"CGH-0304",name:"Anjali Verma",age:42,g:"F",blood:"B-",
    diagnosis:"Thyroid Nodule — Observation",risk:"normal",
    lastVisit:"Mar 05, 2026",nextVisit:"Sep 05, 2026",
    vitals:{bp:"118/74",hr:72,spo2:99,temp:"36.8°C",weight:"64 kg",bmi:"23.1"},
    hba1c:[{m:"Oct",v:5.3},{m:"Nov",v:5.4},{m:"Dec",v:5.3},{m:"Jan",v:5.4},{m:"Feb",v:5.3},{m:"Mar",v:5.4}],
    glucose:[{m:"Oct",v:92},{m:"Nov",v:94},{m:"Dec",v:91},{m:"Jan",v:96},{m:"Feb",v:93},{m:"Mar",v:95}],
    history:[
      {date:"Mar 05, 2026",type:"warning",icon:"🩻",event:"Thyroid USG: 9mm hypoechoic nodule — TIRADS 3, 6-month follow-up"},
      {date:"Jan 10, 2026",type:"normal",icon:"🧪",event:"TSH 1.8 — normal, Levothyroxine dose unchanged"},
      {date:"Sep 20, 2025",type:"normal",icon:"💊",event:"Vitamin D3 supplementation started — deficient at 14 ng/mL"},
      {date:"Jun 15, 2025",type:"warning",icon:"📋",event:"Thyroid nodule incidentally found on neck USG"},
    ],
    comorbidities:["Thyroid Nodule (TIRADS 3)","Vitamin D Deficiency"],
    allergies:["None known"],
    medications:["Levothyroxine 50mcg","Vitamin D3 60000 IU weekly"],
    alerts:["Nodule Follow-up Due Sep 2026"],
  },
  {
    id:"CGH-0042",name:"Alex Johnson",age:37,g:"M",blood:"A+",
    diagnosis:"Type 2 DM + Dyslipidaemia",risk:"high",
    lastVisit:"Mar 01, 2026",nextVisit:"May 01, 2026",
    vitals:{bp:"128/82",hr:79,spo2:98,temp:"37.0°C",weight:"88 kg",bmi:"29.4"},
    hba1c:[{m:"Oct",v:8.6},{m:"Nov",v:8.4},{m:"Dec",v:8.1},{m:"Jan",v:7.9},{m:"Feb",v:7.8},{m:"Mar",v:7.6}],
    glucose:[{m:"Oct",v:204},{m:"Nov",v:196},{m:"Dec",v:182},{m:"Jan",v:174},{m:"Feb",v:168},{m:"Mar",v:158}],
    history:[
      {date:"Mar 01, 2026",type:"normal",icon:"📈",event:"HbA1c 7.6% — improving, LDL 138 borderline"},
      {date:"Jan 15, 2026",type:"warning",icon:"🫀",event:"Palpitations — 24hr Holter: occasional PAC, no treatment needed"},
      {date:"Nov 08, 2025",type:"normal",icon:"💊",event:"Rosuvastatin 10mg added for dyslipidaemia"},
      {date:"Aug 22, 2025",type:"warning",icon:"📋",event:"HbA1c 8.6% — poor control, diet counselling + Metformin uptitrated"},
      {date:"Apr 10, 2024",type:"normal",icon:"📋",event:"Type 2 DM + Dyslipidaemia diagnosed on annual check"},
    ],
    comorbidities:["Dyslipidaemia","Occasional PAC","Obesity"],
    allergies:["None known"],
    medications:["Metformin 500mg","Rosuvastatin 10mg","Omega-3 1000mg"],
    alerts:["HbA1c Borderline","LDL Elevated"],
  },
  {
    id:"CGH-0567",name:"Fatima Naqvi",age:23,g:"F",blood:"O+",
    diagnosis:"New Patient — PCOD Workup",risk:"normal",
    lastVisit:"Mar 14, 2026",nextVisit:"Jun 14, 2026",
    vitals:{bp:"110/70",hr:80,spo2:99,temp:"36.8°C",weight:"66 kg",bmi:"24.2"},
    hba1c:[{m:"Oct",v:5.0},{m:"Nov",v:5.1},{m:"Dec",v:5.0},{m:"Jan",v:5.2},{m:"Feb",v:5.1},{m:"Mar",v:5.2}],
    glucose:[{m:"Oct",v:86},{m:"Nov",v:88},{m:"Dec",v:85},{m:"Jan",v:90},{m:"Feb",v:88},{m:"Mar",v:92}],
    history:[
      {date:"Mar 14, 2026",type:"warning",icon:"🧪",event:"Pelvic USG: Bilateral polycystic ovaries — AFC 14 follicles"},
      {date:"Mar 14, 2026",type:"warning",icon:"📊",event:"LH/FSH 2.8, Testosterone 0.9 ng/mL — hyperandrogenism suspected"},
      {date:"Mar 01, 2026",type:"normal",icon:"📋",event:"New patient registration — irregular cycles × 14 months"},
    ],
    comorbidities:["PCOD (provisional)"],
    allergies:["None known"],
    medications:["Metformin SR 500mg","Folic Acid 5mg","Evening Primrose Oil 1000mg"],
    alerts:["Hyperandrogenism Workup Pending"],
  },
];

const RISK_MAP={
  critical:{color:C.red,  bg:"rgba(248,113,113,.1)",border:"rgba(248,113,113,.22)",label:"Critical"},
  high:    {color:C.amber,bg:"rgba(251,191,36,.09)",border:"rgba(251,191,36,.22)", label:"High Risk"},
  normal:  {color:C.green,bg:"rgba(52,211,153,.09)",border:"rgba(52,211,153,.2)",  label:"Stable"},
};
const HIST_MAP={
  critical:{color:C.red,  dot:"rgba(248,113,113,.15)"},
  warning: {color:C.amber,dot:"rgba(251,191,36,.12)"},
  normal:  {color:C.green,dot:"rgba(52,211,153,.1)"},
};

const ParticleBg=()=>{
  const ref=useRef(null),raf=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    c.width=c.offsetWidth;c.height=c.offsetHeight;
    const ctx=c.getContext("2d"),W=c.width,H=c.height;
    const pts=Array.from({length:30},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.4,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22}));
    const draw=()=>{ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.x=(p.x+p.vx+W)%W;p.y=(p.y+p.vy+H)%H;const a=.12+.2*Math.abs(Math.sin(Date.now()*.0008+p.x));ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(168,85,247,${a})`;ctx.shadowColor="#a855f7";ctx.shadowBlur=5;ctx.fill();});raf.current=requestAnimationFrame(draw);};
    draw();return()=>cancelAnimationFrame(raf.current);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
};

const Spark=({data,color=C.ring,w=110,h=34})=>{
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const DPR=window.devicePixelRatio||1;c.width=w*DPR;c.height=h*DPR;
    const ctx=c.getContext("2d");ctx.scale(DPR,DPR);
    const vals=data.map(d=>d.v);const min=Math.min(...vals),max=Math.max(...vals);const pad=4;
    const pts=vals.map((v,i)=>({x:pad+(i/(vals.length-1))*(w-pad*2),y:pad+(1-(v-min)/(max-min||1))*(h-pad*2)}));
    const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,color+"55");grad.addColorStop(1,color+"00");
    ctx.beginPath();ctx.moveTo(pts[0].x,h);pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,h);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
    ctx.beginPath();pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=1.8;ctx.lineJoin="round";ctx.stroke();
    const last=pts[pts.length-1];ctx.beginPath();ctx.arc(last.x,last.y,3,0,Math.PI*2);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=6;ctx.fill();
  },[data,color]);
  return <canvas ref={ref} style={{width:w,height:h,display:"block"}}/>;
};

const LineChart=({data,color=C.ring})=>{
  const ref=useRef(null),raf=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const DPR=window.devicePixelRatio||1;c.width=c.offsetWidth*DPR;c.height=c.offsetHeight*DPR;
    const ctx=c.getContext("2d");ctx.scale(DPR,DPR);
    const W=c.offsetWidth,H=c.offsetHeight;const pad={t:18,r:12,b:26,l:36};const iW=W-pad.l-pad.r,iH=H-pad.t-pad.b;
    const vals=data.map(d=>d.v);const min=Math.min(...vals)*0.95,max=Math.max(...vals)*1.05;
    const pts=data.map((d,i)=>({x:pad.l+(i/(data.length-1))*iW,y:pad.t+iH-(d.v-min)/(max-min)*iH,v:d.v,m:d.m}));
    let prog=0;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);const p=Math.min(prog,1);
      for(let i=0;i<=4;i++){const y=pad.t+(i/4)*iH;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+iW,y);ctx.strokeStyle="rgba(255,255,255,.04)";ctx.lineWidth=1;ctx.stroke();ctx.fillStyle="rgba(255,255,255,.2)";ctx.font=`${8*DPR/DPR}px DM Sans`;ctx.textAlign="right";ctx.fillText((max-(max-min)*(i/4)).toFixed(1),pad.l-4,y+3);}
      const dp=pts.map(pt=>({x:pt.x,y:pad.t+iH-(pt.v-min)/(max-min)*iH*p}));
      const grad=ctx.createLinearGradient(0,pad.t,0,pad.t+iH);grad.addColorStop(0,color+"44");grad.addColorStop(1,color+"00");
      ctx.beginPath();ctx.moveTo(dp[0].x,pad.t+iH);dp.forEach(pt=>ctx.lineTo(pt.x,pt.y));ctx.lineTo(dp[dp.length-1].x,pad.t+iH);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
      ctx.beginPath();dp.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineJoin="round";ctx.lineCap="round";ctx.shadowColor=color;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
      if(p>=1){dp.forEach((pt,i)=>{ctx.beginPath();ctx.arc(pt.x,pt.y,3.5,0,Math.PI*2);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle="#fff";ctx.font=`bold ${8*DPR/DPR}px Syne`;ctx.textAlign="center";ctx.fillText(pts[i].v,pt.x,pt.y-8);ctx.fillStyle="rgba(255,255,255,.28)";ctx.font=`${8*DPR/DPR}px DM Sans`;ctx.fillText(pts[i].m,pt.x,H-4);});}
      if(prog<1){prog+=0.04;raf.current=requestAnimationFrame(draw);}
    };
    draw();return()=>cancelAnimationFrame(raf.current);
  },[data,color]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

const PatientRow=({p,idx,onSelect})=>{
  const rm=RISK_MAP[p.risk]||RISK_MAP.normal;
  const lastHba1c=p.hba1c[p.hba1c.length-1].v;
  const trend=(lastHba1c-p.hba1c[p.hba1c.length-2].v).toFixed(1);
  const hasCrit=p.history.some(h=>h.type==="critical");
  return(
    <div onClick={()=>onSelect(p)} style={{display:"grid",gridTemplateColumns:"44px 1.6fr 1.4fr 90px 110px 120px 90px 90px",gap:10,alignItems:"center",padding:"11px 14px",borderRadius:13,background:p.risk==="critical"?"rgba(248,113,113,.04)":"rgba(255,255,255,.025)",border:p.risk==="critical"?"1px solid rgba(248,113,113,.15)":"1px solid rgba(255,255,255,.05)",animation:`fadeUp .3s ${idx*.04}s both`,transition:"all .2s",cursor:"pointer"}}
      onMouseOver={e=>{e.currentTarget.style.background="rgba(168,85,247,.06)";e.currentTarget.style.borderColor="rgba(168,85,247,.22)";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseOut={e=>{e.currentTarget.style.background=p.risk==="critical"?"rgba(248,113,113,.04)":"rgba(255,255,255,.025)";e.currentTarget.style.borderColor=p.risk==="critical"?"rgba(248,113,113,.15)":"rgba(255,255,255,.05)";e.currentTarget.style.transform="";}}>
      <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${rm.color}22,${rm.color}44)`,border:`1px solid ${rm.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:800,color:rm.color}}>
        {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".76rem",fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
        <div style={{fontSize:".57rem",color:"rgba(255,255,255,.28)",marginTop:1}}>{p.id} · {p.age}y {p.g} · {p.blood}</div>
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontSize:".67rem",color:"rgba(255,255,255,.58)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.diagnosis}</div>
        <div style={{fontSize:".56rem",color:"rgba(255,255,255,.22)",marginTop:1}}>{p.comorbidities.length} comorbidities</div>
      </div>
      <div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:".75rem",fontWeight:800,color:lastHba1c>7?C.red:lastHba1c>6?C.amber:C.green}}>{lastHba1c}%</div>
        <div style={{fontSize:".55rem",color:"rgba(255,255,255,.25)",marginTop:1}}>HbA1c {trend>0?`▲+${trend}`:`▼${trend}`}</div>
      </div>
      <div><Spark data={p.hba1c} color={lastHba1c>7?C.red:lastHba1c>6?C.amber:C.green} w={110} h={34}/></div>
      <span style={{padding:"3px 10px",borderRadius:50,background:rm.bg,border:`1px solid ${rm.border}`,color:rm.color,fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,textAlign:"center"}}>{hasCrit?"⚠ ":""}{rm.label}</span>
      <div style={{fontSize:".6rem",color:"rgba(255,255,255,.32)",fontFamily:"'Syne',sans-serif",fontWeight:600}}>{p.lastVisit}</div>
      <button onClick={e=>{e.stopPropagation();onSelect(p);}} style={{padding:"4px 10px",borderRadius:8,background:`${C.ring}0e`,border:`1px solid ${C.ring}28`,color:C.ring,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,transition:"all .2s"}}
        onMouseOver={e=>e.currentTarget.style.background=`${C.ring}22`} onMouseOut={e=>e.currentTarget.style.background=`${C.ring}0e`}>Analytics</button>
    </div>
  );
};

const PatientDetail=({p,onBack})=>{
  const rm=RISK_MAP[p.risk]||RISK_MAP.normal;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1rem",animation:"slideIn .32s cubic-bezier(.16,1,.3,1) both"}}>
      {}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{padding:"6px 14px",borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",color:"rgba(255,255,255,.55)",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,transition:"all .2s"}}
          onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>← Back to List</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:10}}>
            {p.name}
            <span style={{padding:"2px 9px",borderRadius:50,background:rm.bg,border:`1px solid ${rm.border}`,color:rm.color,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{rm.label}</span>
          </div>
          <div style={{fontSize:".65rem",color:"rgba(255,255,255,.35)",marginTop:2}}>{p.id} · {p.age}y {p.g} · Blood: {p.blood} · {p.diagnosis}</div>
        </div>
      </div>
      {}
      {p.alerts.length>0&&(
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {p.alerts.map(a=>(
            <div key={a} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:8,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)"}}>
              <span style={{animation:"blink 1.2s step-start infinite",fontSize:".7rem"}}>🔴</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,color:C.red}}>{a}</span>
            </div>
          ))}
        </div>
      )}
      {}
      <div>
        <div className="sh">Current Vitals</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:".6rem"}}>
          {[
            {label:"Blood Pressure",value:p.vitals.bp,icon:"🫀",color:parseInt(p.vitals.bp)>140?C.red:C.green},
            {label:"Heart Rate",value:`${p.vitals.hr} bpm`,icon:"❤️",color:p.vitals.hr>90?C.amber:C.green},
            {label:"SpO₂",value:`${p.vitals.spo2}%`,icon:"🫁",color:p.vitals.spo2<95?C.red:C.green},
            {label:"Temperature",value:p.vitals.temp,icon:"🌡️",color:C.indigo},
            {label:"Weight",value:p.vitals.weight,icon:"⚖️",color:C.glow},
            {label:"BMI",value:p.vitals.bmi,icon:"📊",color:parseFloat(p.vitals.bmi)>25?C.amber:C.green},
          ].map((v,i)=>(
            <div key={v.label} style={{background:C.card,border:`1px solid ${v.color}22`,borderRadius:13,padding:"10px",animation:`fadeUp .3s ${i*.05}s both`,textAlign:"center"}}>
              <div style={{fontSize:"1rem",marginBottom:4}}>{v.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".78rem",fontWeight:800,color:v.color}}>{v.value}</div>
              <div style={{fontSize:".52rem",color:"rgba(255,255,255,.3)",marginTop:2}}>{v.label}</div>
            </div>
          ))}
        </div>
      </div>
      {}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".85rem"}}>
        <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:18,padding:"1rem 1.1rem"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".7rem"}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:800,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em"}}>HbA1c Trend (6M)</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.4rem",fontWeight:800,color:p.hba1c[p.hba1c.length-1].v>7?C.red:C.green,lineHeight:1,marginTop:2}}>{p.hba1c[p.hba1c.length-1].v}%</div>
            </div>
            <span style={{padding:"2px 9px",borderRadius:50,fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,background:p.hba1c[p.hba1c.length-1].v>7?"rgba(248,113,113,.1)":"rgba(52,211,153,.1)",color:p.hba1c[p.hba1c.length-1].v>7?C.red:C.green}}>Target: &lt;7.0%</span>
          </div>
          <div style={{height:120}}><LineChart data={p.hba1c} color={p.hba1c[p.hba1c.length-1].v>7?C.red:C.green}/></div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:18,padding:"1rem 1.1rem"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".7rem"}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:800,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em"}}>Fasting Glucose (6M)</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.4rem",fontWeight:800,color:p.glucose[p.glucose.length-1].v>126?C.amber:C.green,lineHeight:1,marginTop:2}}>{p.glucose[p.glucose.length-1].v} mg/dL</div>
            </div>
            <span style={{padding:"2px 9px",borderRadius:50,fontSize:".58rem",fontFamily:"'Syne',sans-serif",fontWeight:700,background:p.glucose[p.glucose.length-1].v>126?"rgba(251,191,36,.1)":"rgba(52,211,153,.1)",color:p.glucose[p.glucose.length-1].v>126?C.amber:C.green}}>Normal: &lt;126</span>
          </div>
          <div style={{height:120}}><LineChart data={p.glucose} color={p.glucose[p.glucose.length-1].v>126?C.amber:C.indigo}/></div>
        </div>
      </div>
      {}
      <div>
        <div className="sh">Medical History Timeline</div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {p.history.map((h,i)=>{
            const hm=HIST_MAP[h.type]||HIST_MAP.normal;
            return(
              <div key={i} style={{display:"flex",gap:12}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:30,flexShrink:0}}>
                  <div style={{width:30,height:30,borderRadius:9,background:hm.dot,border:`1px solid ${hm.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",flexShrink:0,zIndex:1}}>{h.icon}</div>
                  {i<p.history.length-1&&<div style={{width:2,flex:1,minHeight:12,background:"rgba(255,255,255,.05)",margin:"2px 0"}}/>}
                </div>
                <div style={{flex:1,paddingBottom:i<p.history.length-1?"10px":"0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:700,color:hm.color,padding:"1px 7px",borderRadius:50,background:hm.dot}}>{h.date}</span>
                    {h.type==="critical"&&<span style={{fontSize:".55rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:C.red,padding:"1px 7px",borderRadius:50,background:"rgba(248,113,113,.1)"}}>CRITICAL</span>}
                  </div>
                  <div style={{fontSize:".7rem",color:"rgba(255,255,255,.65)",lineHeight:1.5}}>{h.event}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".75rem"}}>
        <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:14,padding:"1rem"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:800,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".6rem"}}>Comorbidities</div>
          {p.comorbidities.map(cm=>(
            <div key={cm} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.indigo,flexShrink:0}}/>
              <span style={{fontSize:".67rem",color:"rgba(255,255,255,.6)"}}>{cm}</span>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:14,padding:"1rem"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:800,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".6rem"}}>Current Medications</div>
          {p.medications.map(m=>(
            <div key={m} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <span style={{fontSize:".75rem"}}>💊</span>
              <span style={{fontSize:".67rem",color:"rgba(255,255,255,.6)"}}>{m}</span>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.faint}`,borderRadius:14,padding:"1rem",display:"flex",flexDirection:"column",gap:".7rem"}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:".58rem",fontWeight:800,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".5rem"}}>Allergies</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {p.allergies.map(a=>(
                <span key={a} style={{padding:"2px 8px",borderRadius:6,background:a==="None known"?"rgba(52,211,153,.08)":"rgba(248,113,113,.1)",border:`1px solid ${a==="None known"?"rgba(52,211,153,.2)":"rgba(248,113,113,.22)"}`,color:a==="None known"?C.green:C.red,fontSize:".6rem",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{a}</span>
              ))}
            </div>
          </div>
          <div style={{height:1,background:"rgba(255,255,255,.05)"}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {[{label:"Last Visit",value:p.lastVisit,color:C.glow},{label:"Next Visit",value:p.nextVisit,color:C.ring}].map(({label,value,color})=>(
              <div key={label}>
                <div style={{fontSize:".55rem",color:"rgba(255,255,255,.25)",fontFamily:"'Syne',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>{label}</div>
                <div style={{fontSize:".65rem",color,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


import DoctorSidebar from "./DoctorSidebar";

export default function DoctorAnalytics() {
  const navigate = useNavigate();
  const [time,       setTime]       = useState(new Date());
  const [selected,   setSelected]   = useState(null);
  const [search,     setSearch]     = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(()=>{const id=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(id);},[]);

  const h=time.getHours();const greeting=h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";
  const critical=PATIENTS.filter(p=>p.risk==="critical");
  const high=PATIENTS.filter(p=>p.risk==="high");
  const filtered=PATIENTS.filter(p=>{const mR=riskFilter==="all"?true:p.risk===riskFilter;const mQ=search.trim()===""?true:[p.name,p.id,p.diagnosis].some(f=>f.toLowerCase().includes(search.toLowerCase()));return mR&&mQ;});

  const tabBtn=(k,l,activeK,setK)=>(
    <button key={k} onClick={()=>setK(k)} style={{padding:"5px 13px",borderRadius:8,border:activeK===k?"1px solid rgba(168,85,247,.3)":"1px solid transparent",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:".68rem",fontWeight:700,letterSpacing:".03em",transition:"all .2s",background:activeK===k?"rgba(147,51,234,.14)":"transparent",color:activeK===k?C.ring:"rgba(255,255,255,.32)"}}
      onMouseOver={e=>{if(activeK!==k){e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="rgba(255,255,255,.65)";}}} onMouseOut={e=>{if(activeK!==k){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,.32)";}}}>
      {l}
    </button>
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
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(168,85,247,.22);border-radius:99px}
        .dp{display:flex;height:100vh;overflow:hidden;background:${C.bg};position:relative}
        .dm{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative;z-index:1}
        .dtb{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:rgba(6,3,15,.96);border-bottom:1px solid ${C.border};flex-shrink:0;backdrop-filter:blur(14px);position:relative}
        .dtb::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.ring}42,transparent)}
        .dc{flex:1;overflow-y:auto;padding:1.3rem 1.8rem;display:flex;flex-direction:column;gap:1.1rem}
        .sh{font-family:'Syne',sans-serif;font-size:.65rem;font-weight:800;color:rgba(255,255,255,.24);text-transform:uppercase;letter-spacing:.12em;display:flex;align-items:center;gap:8px;margin-bottom:.65rem}
        .sh::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.045)}
        @media(max-width:768px){.sidebar{display:none}.dc{padding:1rem}}
      `}</style>

      <div className="dp">
        <ParticleBg/>
        
        <DoctorSidebar active="analytics" />

        <div className="dm">
          <div className="dtb">
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".6rem",fontWeight:700,color:`${C.glow}70`,textTransform:"uppercase",letterSpacing:".09em"}}>{greeting}, Doctor</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",marginTop:1}}>{DOCTOR.name}<span style={{color:`${C.ring}70`,fontSize:".78rem",fontWeight:600}}> · {DOCTOR.specialty}</span></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",transition:"all .2s"}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.07)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
                🔔
                <div style={{position:"absolute",top:-4,right:-4,width:17,height:17,borderRadius:"50%",background:C.red,fontFamily:"'Syne',sans-serif",fontSize:".5rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.bg}`,animation:"blink 2s step-start infinite"}}>7</div>
              </div>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:700,color:`${C.glow}70`}}>{time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
            </div>
          </div>

          <div className="dc">
            {selected ? <PatientDetail p={selected} onBack={()=>setSelected(null)}/> : (
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:10}}>
                      📈 Patient Analytics
                      {critical.length>0&&<span style={{padding:"2px 9px",borderRadius:50,background:"rgba(248,113,113,.12)",border:"1px solid rgba(248,113,113,.28)",color:C.red,fontFamily:"'Syne',sans-serif",fontSize:".62rem",fontWeight:700,animation:"blink 2s step-start infinite"}}>{critical.length} Critical</span>}
                    </div>
                    <div style={{fontSize:".7rem",color:"rgba(255,255,255,.3)",marginTop:3}}>Click any patient to view full clinical analytics, history & data</div>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".65rem",fontWeight:700,color:`${C.glow}60`}}>{DOCTOR.hospital} · {DOCTOR.dept}</div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".75rem"}}>
                  {[
                    {icon:"👥",label:"Total Patients",value:PATIENTS.length,sub:"Under observation",color:C.glow},
                    {icon:"🚨",label:"Critical",value:critical.length,sub:"Immediate attention",color:C.red},
                    {icon:"⚠️",label:"High Risk",value:high.length,sub:"Close monitoring",color:C.amber},
                    {icon:"✅",label:"Stable",value:PATIENTS.filter(p=>p.risk==="normal").length,sub:"Routine follow-up",color:C.green},
                  ].map((s,i)=>(
                    <div key={s.label} style={{background:C.card,border:`1px solid ${s.color}1e`,borderRadius:18,padding:"1.1rem 1.2rem",animation:`fadeUp .4s ${i*.07}s both`,position:"relative",overflow:"hidden",transition:"border-color .2s,box-shadow .2s",cursor:"default"}}
                      onMouseOver={e=>{e.currentTarget.style.borderColor=`${s.color}40`;e.currentTarget.style.boxShadow=`0 0 22px ${s.color}14`;}} onMouseOut={e=>{e.currentTarget.style.borderColor=`${s.color}1e`;e.currentTarget.style.boxShadow="";}}>
                      <div style={{position:"absolute",top:-20,right:-20,width:88,height:88,borderRadius:"50%",background:s.color,filter:"blur(36px)",opacity:.13,pointerEvents:"none"}}/>
                      <div style={{width:42,height:42,borderRadius:13,background:`${s.color}14`,border:`1px solid ${s.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem",marginBottom:".6rem"}}>{s.icon}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.75rem",fontWeight:800,color:"#fff",lineHeight:1,marginBottom:3}}>{s.value}</div>
                      <div style={{fontSize:".68rem",color:"rgba(255,255,255,.42)",marginBottom:3}}>{s.label}</div>
                      <div style={{fontSize:".62rem",color:s.color,fontWeight:600}}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"10px 14px",borderRadius:13,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)"}}>
                  <div style={{display:"flex",gap:3}}>
                    {[["all",`All (${PATIENTS.length})`],["critical",`Critical (${critical.length})`],["high",`High Risk (${high.length})`],["normal",`Stable (${PATIENTS.filter(p=>p.risk==="normal").length})`]].map(([k,l])=>tabBtn(k,l,riskFilter,setRiskFilter))}
                  </div>
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7,padding:"5px 11px",borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
                    <span style={{fontSize:".78rem",opacity:.4}}>🔍</span>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient, ID, diagnosis…" style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:".68rem",fontFamily:"'DM Sans',sans-serif",width:210}}/>
                    {search&&<button onClick={()=>setSearch("")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:".75rem",lineHeight:1,padding:0}}>✕</button>}
                  </div>
                </div>

                <div>
                  <div style={{display:"grid",gridTemplateColumns:"44px 1.6fr 1.4fr 90px 110px 120px 90px 90px",gap:10,padding:"5px 14px",marginBottom:".4rem"}}>
                    {["","Patient","Diagnosis","HbA1c","6-Month Trend","Risk","Last Visit",""].map((hd,i)=>(
                      <span key={i} style={{fontFamily:"'Syne',sans-serif",fontSize:".57rem",fontWeight:800,color:"rgba(255,255,255,.2)",textTransform:"uppercase",letterSpacing:".09em"}}>{hd}</span>
                    ))}
                  </div>
                  {filtered.length===0?(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:"3.5rem",color:"rgba(255,255,255,.2)"}}>
                      <div style={{fontSize:"2.5rem"}}>🔍</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".88rem",fontWeight:700}}>No patients found</div>
                    </div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {filtered.map((p,i)=><PatientRow key={p.id} p={p} idx={i} onSelect={setSelected}/>)}
                    </div>
                  )}
                </div>

                <div style={{padding:"9px 15px",borderRadius:12,background:"rgba(255,255,255,.015)",border:`1px solid ${C.faint}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:28,height:28,borderRadius:8,background:`${C.ring}10`,border:`1px solid ${C.ring}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem"}}>🏥</div>
                    <div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:".7rem",fontWeight:800,color:"rgba(255,255,255,.55)"}}>{DOCTOR.hospital} · {DOCTOR.dept}</div>
                      <div style={{fontSize:".57rem",color:"rgba(255,255,255,.22)",marginTop:1}}>Reg: {DOCTOR.regNo} · {filtered.length} of {PATIENTS.length} patients shown</div>
                    </div>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:".64rem",fontWeight:700,color:`${C.glow}55`}}>⭐ {DOCTOR.rating} · {DOCTOR.exp} Experience</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
