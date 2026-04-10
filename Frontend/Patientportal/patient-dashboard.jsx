import { useState, useEffect, useRef } from "react";


const ECGCanvas = ({ color = "#00ff9d", height = 70 }) => {
  const ref = useRef(null); const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const DPR = window.devicePixelRatio || 1;
    const CW = c.offsetWidth, CH = c.offsetHeight;
    c.width = CW * DPR; c.height = CH * DPR;
    const ctx = c.getContext("2d"); ctx.scale(DPR, DPR);
    const mid = CH / 2;
    const cycle = [
      [0, .0], [.06, .0], [.10, -.04], [.12, .04], [.14, .0],
      [.20, .0], [.23, -.32], [.26, .52], [.29, -.16], [.32, .0],
      [.36, .0], [.40, .09], [.44, .09], [.48, .0],
      [.56, .0], [.60, -.04], [.62, .04], [.64, .0],
      [.70, .0], [.73, -.32], [.76, .52], [.79, -.16], [.82, .0],
      [.86, .0], [.90, .09], [.94, .09], [1.0, .0],
    ];
    let off = 0;
    const draw = () => {
      ctx.clearRect(0, 0, CW, CH);
      ctx.save(); ctx.beginPath();
      for (let rep = -1; rep <= 1; rep++) cycle.forEach(([px, py], i) => {
        const x = rep * CW + px * CW - off, y = mid + py * CH * .85;
        (i === 0 && rep === -1) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      const g = ctx.createLinearGradient(0, 0, CW, 0);
      g.addColorStop(0, `${color}00`); g.addColorStop(.35, `${color}44`);
      g.addColorStop(.75, `${color}bb`); g.addColorStop(1, color);
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.stroke(); ctx.restore();
      const dotX = ((0.26 * CW - off) % CW + CW) % CW;
      ctx.save(); ctx.beginPath(); ctx.arc(dotX, mid + .52 * CH * .85, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 18; ctx.fill(); ctx.restore();
      off = (off + 1.3) % CW; raf.current = requestAnimationFrame(draw);
    }; draw();
    return () => cancelAnimationFrame(raf.current);
  }, [color]);
  return <canvas ref={ref} style={{ width: "100%", height, display: "block" }} />;
};


const Sparkline = ({ data, color, height = 40 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const DPR = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = c.offsetHeight;
    c.width = W * DPR; c.height = H * DPR;
    const ctx = c.getContext("2d"); ctx.scale(DPR, DPR);
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - ((v - min) / range) * (H * .8) - H * .1]);
    ctx.beginPath();
    pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = "round";
    ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.stroke();
    
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `${color}33`); g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g; ctx.fill();
  }, [data, color]);
  return <canvas ref={ref} style={{ width: "100%", height, display: "block" }} />;
};


const Donut = ({ pct, color, size = 90 }) => {
  const ref = useRef(null); const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const DPR = window.devicePixelRatio || 1;
    c.width = size * DPR; c.height = size * DPR;
    const ctx = c.getContext("2d"); ctx.scale(DPR, DPR);
    const cx = size / 2, cy = size / 2, r = size / 2 - 8;
    let prog = 0; const target = pct / 100;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 7; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2);
      ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.lineCap = "round";
      ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = `bold ${size * .18}px Syne,sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(prog * 100)}%`, cx, cy);
      if (prog < target) { prog = Math.min(prog + .015, target); raf.current = requestAnimationFrame(draw); }
    }; draw();
    return () => cancelAnimationFrame(raf.current);
  }, [pct, color, size]);
  return <canvas ref={ref} style={{ width: size, height: size }} />;
};


const HeartSVG = ({ color = "#ff6b6b", size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);


const AlertItem = ({ icon, title, desc, time, color, urgent }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 14px", borderRadius: 12, background: urgent ? "rgba(255,80,80,.06)" : "rgba(255,255,255,.03)", border: `1px solid ${urgent ? "rgba(255,80,80,.2)" : "rgba(255,255,255,.06)"}`, marginBottom: 8 }}>
    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: urgent ? "#ff6b6b" : "#fff" }}>{title}</span>
        <span style={{ fontSize: ".62rem", color: "rgba(255,255,255,.3)" }}>{time}</span>
      </div>
      <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", lineHeight: 1.4 }}>{desc}</div>
    </div>
  </div>
);


const RxCard = ({ name, dose, freq, days, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", marginBottom: 8 }}>
    <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".95rem", flexShrink: 0 }}>💊</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 700, color: "#fff" }}>{name} <span style={{ color, fontWeight: 400, fontSize: ".75rem" }}>{dose}</span></div>
      <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.35)", marginTop: 1 }}>{freq}</div>
    </div>
    <div style={{ textAlign: "right", flexShrink: 0 }}>
      <div style={{ fontSize: ".68rem", color, fontWeight: 600 }}>{days}d left</div>
      <div style={{ width: 40, height: 3, borderRadius: 99, background: "rgba(255,255,255,.08)", marginTop: 4 }}>
        <div style={{ width: `${Math.min(days / 30 * 100, 100)}%`, height: "100%", borderRadius: 99, background: color }} />
      </div>
    </div>
  </div>
);


const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer", background: active ? "rgba(0,200,255,.1)" : "transparent", transition: "all .2s", color: active ? "#00c8ff" : "rgba(255,255,255,.35)" }}>
    <span style={{ fontSize: "1.2rem" }}>{icon}</span>
    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</span>
    {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00c8ff", boxShadow: "0 0 6px #00c8ff" }} />}
  </button>
);

import { useNavigate } from "react-router-dom";
import {
  fetchDashboardSummary, fetchVitalsHistory, fetchNotifications, fetchDeviceStatus, markAllNotificationsRead
} from "../src/api/dashboardApi.js";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [expanded, setExpanded] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showAllNotif, setShowAllNotif] = useState(false);

  // 1. STATE VARIABLES FOR REAL DATA
  const [patient, setPatient] = useState(null);
  const [latestVitals, setLatestVitals] = useState(null);
  const [apiAlerts, setApiAlerts] = useState([]);
  const [apiPrescriptions, setApiPrescriptions] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [apiNotifications, setApiNotifications] = useState([]);
  const [hrHistoryData, setHrHistoryData] = useState([]);
  const [spo2HistoryData, setSpo2HistoryData] = useState([]);
  const [device, setDevice] = useState({ isOnline: false });
  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 2. FETCH DATA ON MOUNT
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sum, hist, notifs, dev] = await Promise.all([
          fetchDashboardSummary(), fetchVitalsHistory(), fetchNotifications(), fetchDeviceStatus()
        ].map(p => p.catch(() => ({ success: false }))));

        if (sum.success && sum.data) {
          setPatient(sum.data.patient);
          setLatestVitals(sum.data.latestVitals);
          setApiAlerts(sum.data.alerts || []);
          setApiPrescriptions(sum.data.prescriptions || []);
          setDoctor(sum.data.doctor);
        }
        if (hist.success && hist.data) {
          setHrHistoryData(hist.data.hrHistory || []);
          setSpo2HistoryData(hist.data.spo2History || []);
        }
        if (notifs.success && notifs.data) {
          setApiNotifications(notifs.data || []);
        }
        if (dev.success && dev.device) {
          setDevice(dev.device);
        }
      } catch (err) { } finally { setLoading(false); }
    };
    loadData();
  }, []);

  // 3. MAP STATE TO UI VARIABLES (Fallbacks to dummy if empty, so UI looks rich)
  const notifications = apiNotifications.length ? apiNotifications : [
    { icon: "✅", title: "No new notifications", desc: "You're all caught up.", time: "Now", color: "#00ff9d", bg: "rgba(0,255,157,.12)", unread: false }
  ];

  const currentHr = latestVitals?.heartRate || 72;
  const currentSpo2 = latestVitals?.spo2 || 98;
  const currentTemp = latestVitals?.temperature || 36.6;
  const currentBp = latestVitals?.bloodPressure || "118/76";
  
  const hrHistory = hrHistoryData.length ? hrHistoryData : [68, 71, 74, 70, 72, 75, 73, 72, 76, 74, 72, 73, 71, 74, 72, currentHr];
  const spo2History = spo2HistoryData.length ? spo2HistoryData : [97, 98, 98, 99, 98, 97, 98, 98, 99, 98, 98, 97, 98, 99, 98, currentSpo2];

  const vitals = [
    { icon: <HeartSVG color="#ff6b6b" />, label: "Heart Rate", value: currentHr, unit: "BPM", color: "#ff6b6b", sub: "Normal range", data: hrHistory },
    { icon: "🩸", label: "SpO₂", value: currentSpo2, unit: "%", color: "#00c8ff", sub: "Excellent", data: spo2History },
    { icon: "🌡️", label: "Temperature", value: currentTemp, unit: "°C", color: "#ffd93d", sub: "Normal", data: [36.4, 36.5, 36.6, 36.5, 36.7, 36.6, 36.6, 36.5, 36.6, 36.7, 36.6, 36.6, 36.5, 36.6, 36.6, currentTemp] },
    { icon: "💉", label: "Blood Pressure", value: currentBp, unit: "mmHg", color: "#a78bfa", sub: "Optimal", data: [115, 118, 120, 116, 118, 119, 117, 118, 120, 118, 117, 119, 118, 118, 117, parseInt(currentBp.split('/')[0]) || 118] },
  ];

  const alerts = apiAlerts.length ? apiAlerts : [
    { icon: "✅", title: "All Clear", desc: "No active health alerts.", time: "Now", color: "#00ff9d", urgent: false }
  ];

  const prescriptions = apiPrescriptions.length ? apiPrescriptions : [
    { name: "Consult your doctor for prescriptions.", dose: "", freq: "", days: 0, color: "#888" }
  ];

  const today = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:#050f1f}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,107,107,.4)}70%{box-shadow:0 0 0 10px rgba(255,107,107,0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}

        .dash{display:flex;height:100vh;overflow:hidden;background:#050f1f;position:relative}

        /* SIDEBAR */
        .sidebar{
          width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;
          padding:1rem .5rem;background:rgba(5,12,28,.95);border-right:1px solid rgba(255,255,255,.06);
          gap:4px;z-index:20;transition:width .3s cubic-bezier(.16,1,.3,1);overflow:hidden;
        }
        .sidebar.expanded{width:220px;align-items:flex-start;padding:1rem .8rem}

        /* profile top */
        .sb-profile{display:flex;align-items:center;gap:11px;padding:10px 8px;border-radius:13px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.14);margin-bottom:.8rem;width:100%;cursor:pointer;transition:background .2s;flex-shrink:0}
        .sb-profile:hover{background:rgba(0,200,255,.1)}
        .sb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00c8ff);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;border:2px solid rgba(0,200,255,.35);animation:hb 3s ease-in-out infinite}
        .sb-profile-info{display:none;flex-direction:column;min-width:0}
        .sidebar.expanded .sb-profile-info{display:flex}
        .sb-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-role{font-size:.62rem;color:rgba(0,200,255,.7);margin-top:1px}

        /* expand toggle */
        .sb-toggle{width:100%;display:flex;align-items:center;flex-direction:row;gap:6px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);cursor:pointer;color:rgba(255,255,255,.5);transition:all .2s;margin-bottom:.5rem;flex-shrink:0}
        .sb-toggle:hover{background:rgba(255,255,255,.08);color:#fff}
        .sb-toggle-lines{display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor;transition:all .3s}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}

        /* nav items */
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none;transition:opacity .2s}
        .sidebar.expanded .sb-item-label{display:block}
        .sb-active-bar{width:3px;height:16px;border-radius:99px;background:#00c8ff;box-shadow:0 0 8px #00c8ff;margin-left:auto;flex-shrink:0;display:none}
        .sb-item.active .sb-active-bar{display:block}

        /* divider */
        .sb-divider{width:100%;height:1px;background:rgba(255,255,255,.06);margin:.4rem 0;flex-shrink:0}

        /* bottom */
        .sb-bottom{display:flex;flex-direction:column;gap:4px;width:100%;flex-shrink:0}
        .sb-logout{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:11px;border:1px solid rgba(255,80,80,.15);cursor:pointer;background:rgba(255,80,80,.05);transition:all .2s;color:rgba(255,100,100,.7);width:100%;white-space:nowrap;overflow:hidden}
        .sb-logout:hover{background:rgba(255,80,80,.12);color:#ff6b6b;border-color:rgba(255,80,80,.3)}
        .sidebar.expanded .sb-logout{justify-content:flex-start}
        .sb-logout-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.expanded .sb-logout-label{display:block}

        /* MAIN */
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

        /* TOPBAR */
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.8rem;background:rgba(5,15,31,.95);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;backdrop-filter:blur(10px)}
        .topbar-left h1{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff}
        .topbar-left p{font-size:.75rem;color:rgba(255,255,255,.35);margin-top:1px}
        .topbar-right{display:flex;align-items:center;gap:12px}
        .time-badge{display:flex;flex-direction:column;align-items:flex-end}
        .time-badge .t{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#00c8ff}
        .time-badge .d{font-size:.65rem;color:rgba(255,255,255,.3)}
        .notif-btn{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;position:relative}
        .notif-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:#ff6b6b;animation:blink .9s step-start infinite;box-shadow:0 0 5px #ff6b6b}
        .status-pill{display:flex;align-items:center;gap:6px;padding:5px 12px;borderRadius:50px;background:rgba(0,255,157,.07);border:1px solid rgba(0,255,157,.18);border-radius:50px}
        .status-dot{width:6px;height:6px;border-radius:50%;background:#00ff9d;animation:blink 1.2s step-start infinite;box-shadow:0 0 6px #00ff9d}
        .status-pill span{font-size:.7rem;color:#00ff9d;font-weight:600}

        /* CONTENT */
        .content{flex:1;overflow-y:auto;padding:1.4rem 1.8rem;display:flex;gap:1rem;min-height:0}
        .content-left{width:340px;flex-shrink:0;display:flex;flex-direction:column;gap:1rem}
        .content-right{flex:1;display:flex;flex-direction:column;gap:1rem;overflow-y:auto}

        /* VITAL GRID inside left */
        .vital-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}

        /* PATIENT PROFILE PANEL */
        .pp-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00c8ff);display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto .7rem;border:3px solid rgba(0,200,255,.3);box-shadow:0 0 20px rgba(0,200,255,.2);animation:hb 3s ease-in-out infinite}
        .pp-name{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;text-align:center;margin-bottom:2px}
        .pp-id{font-size:.68rem;color:rgba(0,200,255,.7);text-align:center;margin-bottom:.9rem}
        .pp-status{display:flex;align-items:center;justify-content:center;gap:6px;padding:5px 14px;background:rgba(0,255,157,.07);border:1px solid rgba(0,255,157,.18);border-radius:50px;width:fit-content;margin:0 auto .9rem}
        .pp-status-dot{width:6px;height:6px;border-radius:50%;background:#00ff9d;box-shadow:0 0 6px #00ff9d;animation:blink 1.2s step-start infinite}
        .pp-status span{font-size:.68rem;color:#00ff9d;font-weight:600}
        .pp-divider{height:1px;background:rgba(255,255,255,.06);margin:.6rem 0}
        .pp-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0}
        .pp-row-label{font-size:.67rem;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em}
        .pp-row-val{font-family:'Syne',sans-serif;font-size:.78rem;font-weight:700;color:#fff}
        .pp-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:50px;font-size:.62rem;font-weight:600}

        /* CARDS */
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.1rem;position:relative;overflow:hidden;animation:fadeUp .4s both}
        .card-hd{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.9rem;display:flex;align-items:center;justify-content:space-between}
        .card-hd-dot{width:5px;height:5px;border-radius:50%;background:#00c8ff;box-shadow:0 0 6px #00c8ff;animation:blink 1.2s step-start infinite}

        /* VITAL CARD */
        .vc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:.9rem 1rem;position:relative;overflow:hidden;animation:fadeUp .4s both}
        .vc-glow{position:absolute;top:-30px;right:-30px;width:100px;height:100px;border-radius:50%;filter:blur(40px);opacity:.3;pointer-events:none}
        .vc-icon{font-size:1.2rem;margin-bottom:.5rem;display:block;animation:hb 2s ease-in-out infinite}
        .vc-val{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:#fff;line-height:1}
        .vc-unit{font-size:.75rem;font-weight:400;color:rgba(255,255,255,.45);margin-left:3px}
        .vc-lbl{font-size:.68rem;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;margin:.3rem 0 .5rem}
        .vc-sub{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:50px;font-size:.6rem;font-weight:600}

        /* NOTIFICATION PANEL */
        .notif-panel{position:absolute;top:60px;right:16px;width:320px;background:rgba(6,12,26,.97);border:1px solid rgba(255,255,255,.1);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 0 1px rgba(0,200,255,.08);z-index:100;overflow:hidden;animation:fadeUp .25s cubic-bezier(.16,1,.3,1) both}
        .notif-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;border-bottom:1px solid rgba(255,255,255,.06)}
        .notif-header-title{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#fff;display:flex;align-items:center;gap:8px}
        .notif-badge{background:#ff6b6b;color:#fff;font-size:.58rem;font-weight:700;padding:2px 6px;border-radius:99px;box-shadow:0 0 8px rgba(255,107,107,.5)}
        .notif-clear{font-size:.68rem;color:rgba(0,200,255,.7);cursor:pointer;font-weight:600}
        .notif-clear:hover{color:#00c8ff}
        .notif-list{max-height:340px;overflow-y:auto;padding:8px}
        .notif-item{display:flex;align-items:flex-start;gap:11px;padding:10px 12px;border-radius:12px;margin-bottom:5px;cursor:pointer;transition:background .18s;position:relative}
        .notif-item:hover{background:rgba(255,255,255,.04)}
        .notif-item.unread{background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.08)}
        .notif-item-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0}
        .notif-item-body{flex:1;min-width:0}
        .notif-item-title{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;color:#fff;margin-bottom:2px}
        .notif-item-desc{font-size:.67rem;color:rgba(255,255,255,.38);line-height:1.4}
        .notif-item-time{font-size:.6rem;color:rgba(255,255,255,.25);margin-top:3px}
        .notif-unread-dot{width:6px;height:6px;border-radius:50%;background:#00c8ff;box-shadow:0 0 5px #00c8ff;flex-shrink:0;margin-top:4px}
        .notif-footer{padding:10px 16px;border-top:1px solid rgba(255,255,255,.06);text-align:center;font-size:.72rem;color:rgba(0,200,255,.7);cursor:pointer;font-weight:600}
        .notif-footer:hover{color:#00c8ff}

        /* FULL NOTIFICATIONS PAGE */
        .notif-page{position:absolute;inset:0;z-index:50;background:#050f1f;display:flex;flex-direction:column;animation:fadeUp .3s cubic-bezier(.16,1,.3,1) both}
        .notif-page-header{display:flex;align-items:center;gap:14px;padding:1.2rem 1.8rem;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(5,15,31,.98);backdrop-filter:blur(10px);flex-shrink:0}
        .notif-back{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.9rem;color:rgba(255,255,255,.6);transition:all .2s;flex-shrink:0}
        .notif-back:hover{background:rgba(255,255,255,.1);color:#fff}
        .notif-page-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;flex:1}
        .notif-page-badge{background:rgba(255,107,107,.15);border:1px solid rgba(255,107,107,.3);color:#ff6b6b;font-size:.7rem;font-weight:700;padding:3px 10px;border-radius:50px}
        .notif-mark-all{font-size:.74rem;color:rgba(0,200,255,.7);cursor:pointer;font-weight:600;white-space:nowrap}
        .notif-mark-all:hover{color:#00c8ff}
        .notif-page-body{flex:1;overflow-y:auto;padding:1.2rem 1.8rem}
        .notif-section-label{font-family:'Syne',sans-serif;font-size:.65rem;font-weight:700;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:.12em;margin:1rem 0 .5rem;padding-left:4px}
        .notif-full-item{display:flex;align-items:flex-start;gap:14px;padding:14px 16px;border-radius:14px;margin-bottom:8px;cursor:pointer;transition:all .2s;border:1px solid transparent;position:relative;overflow:hidden}
        .notif-full-item:hover{background:rgba(255,255,255,.04)}
        .notif-full-item.unread{background:rgba(0,200,255,.03);border-color:rgba(0,200,255,.1)}
        .notif-full-item.unread::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:0 3px 3px 0}
        .notif-full-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
        .notif-full-body{flex:1;min-width:0}
        .notif-full-title{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:700;margin-bottom:4px}
        .notif-full-desc{font-size:.75rem;color:rgba(255,255,255,.42);line-height:1.5;margin-bottom:5px}
        .notif-full-meta{display:flex;align-items:center;gap:8px}
        .notif-full-time{font-size:.65rem;color:rgba(255,255,255,.25)}
        .notif-full-tag{font-size:.6rem;font-weight:600;padding:2px 8px;border-radius:50px}
        .notif-full-unread-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px}

        /* WELLNESS */
        .wellness-grid{display:flex;justify-content:space-around;align-items:center;padding:.5rem 0}

        /* MOBILE */
        @media(max-width:900px){
          .content{flex-direction:column}
          .content-right{width:100%}
        }
        @media(max-width:600px){
          .sidebar{display:none}
          .content{padding:1rem}
          .content-right{width:100%}
          .topbar{padding:.8rem 1rem}
          .topbar-left h1{font-size:1rem}
        }
      `}</style>

      <div className="dash">
        {}
        <div className={`sidebar${expanded ? " expanded" : ""}`}>

          {}
          <div className="sb-profile">
            <div className="sb-avatar">👤</div>
            <div className="sb-profile-info">
              <span className="sb-name">{patient?.name || "Loading..."}</span>
              <span className="sb-role">Patient · ID: {patient?.patientId || "N/A"}</span>
            </div>
          </div>

          {}
          <button className="sb-toggle" onClick={() => setExpanded(e => !e)}>
            {!expanded && (
              <div className="sb-toggle-lines">
                <span className="sb-toggle-line" />
                <span className="sb-toggle-line" />
                <span className="sb-toggle-line" />
              </div>
            )}
            {expanded && <span style={{ fontSize: ".9rem", fontWeight: 700, color: "rgba(255,255,255,.5)" }}>←</span>}
          </button>

          {}
          <div className="sb-nav">
            {[
              { icon: "📊", label: "Dashboard", key: "dashboard" },
              { icon: "❤️", label: "Vitals", key: "vitals" },
              { icon: "🔔", label: "Alerts", key: "alerts" },
              { icon: "💊", label: "Medications", key: "meds" },
              { icon: "📋", label: "Reports", key: "reports" },
              { icon: "💬", label: "AI Chat", key: "chat" },
              { icon: "✉️", label: "Messages", key: "messages" },
              { icon: "⚙️", label: "Settings", key: "settings" },
            ].map(({ icon, label, key }) => (
              <button key={key} className={`sb-item${activeNav === key ? " active" : ""}`} onClick={() => {
                setActiveNav(key);
                if (key === "vitals") navigate("/vitals");
                else if (key === "alerts") navigate("/alerts");
                else if (key === "reports") navigate("/reports");
                else if (key === "chat") navigate("/jarvis-chat");
                else if (key === "settings") navigate("/settings");
                else if (key === "meds") navigate("/medication");
                else if (key === "messages") navigate("/messages");
              }}>
                <span className="sb-item-icon">
                  {icon}
                </span>
                <span className="sb-item-label">{label}</span>
                <span className="sb-active-bar" />
              </button>
            ))}
          </div>


          <div className="sb-divider" />

          {}
          <div className="sb-bottom">
            <button className="sb-logout" onClick={() => navigate("/logout")}>
              <span className="sb-item-icon">🚪</span>
              <span className="sb-logout-label">Log Out</span>
            </button>
          </div>

        </div>

        {}
        <div className="main">

          {}
          <div className="topbar" style={{ position: "relative" }}>
            <div className="topbar-left">
              <h1>Good Morning, {patient?.name ? patient.name.split(' ')[0] : "there"} 👋</h1>
              <p>Here's your health summary for today</p>
            </div>
            <div className="topbar-right">
              <div className="status-pill" style={{
                borderColor: device.isOnline ? "rgba(0,255,157,.2)" : "rgba(255,80,80,.2)",
                background:  device.isOnline ? "rgba(0,255,157,.06)" : "rgba(255,80,80,.06)"
              }}>
                <span className="status-dot" style={{
                  background:  device.isOnline ? "#00ff9d" : "#ff4444",
                  boxShadow:   device.isOnline ? "0 0 6px #00ff9d" : "0 0 6px #ff4444",
                  animation:   device.isOnline ? "blink 1.2s step-start infinite" : "none"
                }} />
                <span style={{ color: device.isOnline ? "#00ff9d" : "#ff4444" }}>
                  {device.isOnline ? "Device Active" : "Device Offline"}
                </span>
              </div>
              <div className="time-badge">
                <span className="t">{timeStr}</span>
                <span className="d">{today}</span>
              </div>
              <div className="notif-btn" onClick={() => setShowNotif(v => !v)} style={{ cursor: "pointer", background: showNotif ? "rgba(0,200,255,.1)" : "rgba(255,255,255,.04)", borderColor: showNotif ? "rgba(0,200,255,.3)" : "rgba(255,255,255,.08)" }}>
                🔔
                <span className="notif-dot" />
              </div>
            </div>

            {/* NOTIFICATION PANEL */}
            {showNotif && (
              <div className="notif-panel">
                <div className="notif-header">
                  <div className="notif-header-title">
                    🔔 Notifications
                    <span className="notif-badge">{notifications.filter(n => n.unread).length} new</span>
                  </div>
                  <span className="notif-clear" onClick={() => setShowNotif(false)}>✕ Close</span>
                </div>
                <div className="notif-list">
                  {notifications.map((n, i) => (
                    <div key={i} className={`notif-item${n.unread ? " unread" : ""}`}>
                      <div className="notif-item-icon" style={{ background: n.bg }}>{n.icon}</div>
                      <div className="notif-item-body">
                        <div className="notif-item-title" style={{ color: n.unread ? "#fff" : "rgba(255,255,255,.6)" }}>{n.title}</div>
                        <div className="notif-item-desc">{n.desc}</div>
                        <div className="notif-item-time">{n.time}</div>
                      </div>
                      {n.unread && <span className="notif-unread-dot" />}
                    </div>
                  ))}
                </div>
                <div className="notif-footer" onClick={() => { setShowAllNotif(true); setShowNotif(false) }}>View all notifications →</div>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="content">
            <div className="content-right">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridAutoRows: "auto", gap: "1rem", alignContent: "start" }}>

                {/* ── ROW 1: Profile Banner — full width ── */}
                <div className="card" style={{ animationDelay: ".08s", gridColumn: "1/4" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                    <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#0066ff,#00c8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", flexShrink: 0, border: "3px solid rgba(0,200,255,.3)", boxShadow: "0 0 28px rgba(0,200,255,.22)" }}>👤</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#fff", marginBottom: 3 }}>{patient?.name || "Loading..."}</div>
                      <div style={{ fontSize: ".72rem", color: "rgba(0,200,255,.65)", marginBottom: 9 }}>Patient ID: {patient?.patientId || "N/A"}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[
                          [patient?.bloodType || "O+", "#ff6b6b"], 
                          [patient?.gender || "Not Set", "#00c8ff"], 
                          [patient?.age ? `${patient.age} yrs` : "Age N/A", "#ffd93d"]
                        ].map(([t, c]) => (
                          <span key={t} style={{ padding: "3px 11px", borderRadius: 50, background: `${c}15`, color: c, border: `1px solid ${c}28`, fontSize: ".64rem", fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right", borderLeft: "1px solid rgba(255,255,255,.06)", paddingLeft: 20 }}>
                      <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.25)", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".08em" }}>Patient Since</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", color: "#fff", fontWeight: 600, marginBottom: 12 }}>{patient?.createdAt || "Recent"}</div>
                      <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.25)", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".08em" }}>Status</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 6px #00ff9d", display: "inline-block" }} />
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".74rem", color: "#00ff9d", fontWeight: 600 }}>Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── ROW 2: Personal Info (col 1) + Physical Details (col 2) + Contact (col 3) ── */}
                <div className="card" style={{ animationDelay: ".14s" }}>
                  <div className="card-hd"><span>Personal Information</span></div>
                  {[
                    ["Full Name", patient?.name || "N/A"],
                    ["Date of Birth", patient?.dob || "N/A"],
                    ["Age", patient?.age ? `${patient.age} years` : "N/A"],
                    ["Gender", patient?.gender || "N/A"],
                    ["Nationality", patient?.nationality || "N/A"],
                    ["Language", patient?.language || "N/A"],
                  ].map(([l, v]) => (
                    <div className="pp-row" key={l}>
                      <span className="pp-row-label">{l}</span>
                      <span className="pp-row-val">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ animationDelay: ".18s" }}>
                  <div className="card-hd"><span>Physical Details</span></div>
                  {[
                    ["Height", patient?.height ? `${patient.height} cm` : "N/A"],
                    ["Weight", patient?.weight ? `${patient.weight} kg` : "N/A"],
                    ["BMI", patient?.bmi || "N/A"],
                    ["Blood Type", patient?.bloodType || "N/A"],
                    ["Allergies", patient?.allergies || "None Reported"],
                    ["Organ Donor", patient?.organDonor || "N/A"],
                  ].map(([l, v]) => (
                    <div className="pp-row" key={l}>
                      <span className="pp-row-label">{l}</span>
                      <span className="pp-row-val">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ animationDelay: ".22s" }}>
                  <div className="card-hd"><span>Contact Details</span></div>
                  {[
                    ["📧", "Email", patient?.email || "N/A"],
                    ["📱", "Phone", patient?.phone || "N/A"],
                    ["📞", "Emergency", patient?.emergencyContact || "N/A"],
                    ["📍", "Address", patient?.address || "N/A"],
                    ["🏙️", "City", patient?.city || "N/A"],
                    ["📮", "Zip Code", patient?.zipCode || "N/A"],
                  ].map(([icon, l, v]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                      <span style={{ fontSize: ".67rem", color: "rgba(255,255,255,.35)", display: "flex", alignItems: "center", gap: 5 }}><span>{icon}</span>{l}</span>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".7rem", fontWeight: 600, color: "rgba(255,255,255,.75)", textAlign: "right", maxWidth: "52%", wordBreak: "break-word" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* ── ROW 3: Medical History wide (col 1+2) + Doctor (col 3) ── */}
                <div className="card" style={{ animationDelay: ".26s", gridColumn: "1/3" }}>
                  <div className="card-hd"><span>Medical History</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Diagnosed Conditions</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "1rem" }}>
                        {(patient?.conditions || []).length > 0 ? patient.conditions.map(c => (
                          <span key={c} style={{ padding: "3px 10px", borderRadius: 50, background: "rgba(255,107,107,.12)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,.28)", fontSize: ".62rem", fontWeight: 600 }}>{c}</span>
                        )) : <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.45)" }}>No conditions reported</span>}
                      </div>
                      <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Past Surgeries</div>
                      <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{patient?.surgeries || "No major surgeries"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Family History</div>
                      <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.45)", lineHeight: 1.6, marginBottom: "1rem" }}>{patient?.familyHistory || "No significant history"}</div>
                      <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Current Medications</div>
                      <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{prescriptions.map(p => p.name).join(" · ") || "None"}</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ animationDelay: ".3s" }}>
                  <div className="card-hd"><span>Assigned Doctor</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: ".9rem" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0, border: "2px solid rgba(167,139,250,.3)" }}>👩‍⚕️</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".88rem", fontWeight: 700, color: "#fff" }}>{doctor?.name || "Unassigned"}</div>
                      <div style={{ fontSize: ".65rem", color: "rgba(167,139,250,.8)", marginTop: 1 }}>{doctor?.specialty || "General Physician"}</div>
                    </div>
                  </div>
                  {[
                    ["Hospital", doctor?.hospital || "N/A"],
                    ["Reg. No", doctor?.registration || "N/A"],
                    ["Consultation", doctor?.phone || "N/A"],
                    ["Email", doctor?.email || "N/A"],
                  ].map(([l, v]) => (
                    <div className="pp-row" key={l}>
                      <span className="pp-row-label">{l}</span>
                      <span className="pp-row-val" style={{ fontSize: ".74rem" }}>{v}</span>
                    </div>
                  ))}
                  <button style={{ width: "100%", marginTop: ".9rem", padding: "10px", borderRadius: 10, background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.22)", color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, cursor: "pointer", transition: "all .2s" }}
                    onClick={() => navigate("/messages")}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(167,139,250,.2)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(167,139,250,.1)"}>
                    💬 Message Doctor
                  </button>
                </div>

                {/* ── ROW 4: Insurance (col 1) + Alerts wide (col 2+3) ── */}
                <div className="card" style={{ animationDelay: ".34s" }}>
                  <div className="card-hd"><span>Insurance Details</span></div>
                  {[
                    ["Provider", patient?.insuranceProvider || "N/A"],
                    ["Policy No", patient?.insurancePolicy || "N/A"],
                    ["Valid Until", patient?.insuranceValidUntil || "N/A"],
                    ["Coverage", patient?.insuranceCoverage || "N/A"],
                    ["Type", patient?.insuranceType || "N/A"],
                    ["Status", patient?.insuranceStatus || "N/A"],
                  ].map(([l, v]) => (
                    <div className="pp-row" key={l}>
                      <span className="pp-row-label">{l}</span>
                      <span className="pp-row-val" style={{ fontSize: ".74rem", color: l === "Status" && v !== "N/A" ? "#00ff9d" : "#fff" }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ animationDelay: ".38s", gridColumn: "2/4" }}>
                  <div className="card-hd">
                    <span>Recent Alerts</span>
                    <span style={{ fontSize: ".65rem", color: "#ff6b6b", cursor: "pointer" }} onClick={() => navigate("/alerts")}>View all →</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem" }}>
                    {alerts.map((a, i) => <AlertItem key={i} {...a} />)}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ══ FULL NOTIFICATIONS PAGE ══ */}
        {showAllNotif && (
          <div className="notif-page">
            <div className="notif-page-header">
              <div className="notif-back" onClick={() => setShowAllNotif(false)}>←</div>
              <div className="notif-page-title">Notifications</div>
              <span className="notif-page-badge">{notifications.filter(n => n.unread).length} unread</span>
              <span style={{ flex: 1 }} />
              <span className="notif-mark-all">Mark all as read</span>
            </div>

            <div className="notif-page-body">

              {/* NEW section */}
              <div className="notif-section-label">🔴 New</div>
              {notifications.filter(n => n.unread).map((n, i) => (
                <div key={i} className="notif-full-item unread">
                  <div className="notif-full-icon" style={{ background: n.bg, border: `1px solid ${n.color}28` }}>{n.icon}</div>
                  <div className="notif-full-body">
                    <div className="notif-full-title" style={{ color: "#fff" }}>{n.title}</div>
                    <div className="notif-full-desc">{n.desc}</div>
                    <div className="notif-full-meta">
                      <span className="notif-full-time">🕐 {n.time}</span>
                      <span className="notif-full-tag" style={{ background: `${n.color}15`, color: n.color, border: `1px solid ${n.color}25` }}>New</span>
                    </div>
                  </div>
                  <div className="notif-full-unread-dot" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }} />
                  {/* left accent bar */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: "0 3px 3px 0", background: n.color }} />
                </div>
              ))}

              {/* EARLIER section */}
              <div className="notif-section-label" style={{ marginTop: "1.4rem" }}>📁 Earlier</div>
              {notifications.filter(n => !n.unread).map((n, i) => (
                <div key={i} className="notif-full-item">
                  <div className="notif-full-icon" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}>{n.icon}</div>
                  <div className="notif-full-body">
                    <div className="notif-full-title" style={{ color: "rgba(255,255,255,.6)" }}>{n.title}</div>
                    <div className="notif-full-desc">{n.desc}</div>
                    <div className="notif-full-meta">
                      <span className="notif-full-time">🕐 {n.time}</span>
                      <span className="notif-full-tag" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.3)", border: "1px solid rgba(255,255,255,.08)" }}>Read</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* extra older ones */}
              <div className="notif-section-label" style={{ marginTop: "1.4rem" }}>📂 Older</div>
              {[
                { icon: "🏃", title: "Weekly Activity Summary", desc: "You completed 45,200 steps this week — 12% more than last week.", time: "2 days ago", color: "#00ff9d", bg: "rgba(0,255,157,.1)" },
                { icon: "🩸", title: "SpO₂ Level Normal", desc: "Your blood oxygen returned to 98% after a brief dip to 95%.", time: "3 days ago", color: "#00c8ff", bg: "rgba(0,200,255,.1)" },
                { icon: "📅", title: "Appointment Confirmed", desc: "Your checkup with Dr. Priya is confirmed for Monday 10:00 AM.", time: "4 days ago", color: "#a78bfa", bg: "rgba(167,139,250,.1)" },
                { icon: "💤", title: "Sleep Goal Met", desc: "You achieved 8 hours of sleep last night. Keep it up!", time: "5 days ago", color: "#f472b6", bg: "rgba(244,114,182,.1)" },
              ].map((n, i) => (
                <div key={i} className="notif-full-item">
                  <div className="notif-full-icon" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>{n.icon}</div>
                  <div className="notif-full-body">
                    <div className="notif-full-title" style={{ color: "rgba(255,255,255,.45)" }}>{n.title}</div>
                    <div className="notif-full-desc">{n.desc}</div>
                    <div className="notif-full-meta">
                      <span className="notif-full-time">🕐 {n.time}</span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </>
  );
}
