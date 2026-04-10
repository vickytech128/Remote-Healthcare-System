import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { doc, onSnapshot, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, db } from "../src/firebaseConfig.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ECGCanvas = ({ color = "#00ff9d", height = 90 }) => {
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
        const x = rep * CW + px * CW - off, y = mid + py * CH * .82;
        (i === 0 && rep === -1) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      const g = ctx.createLinearGradient(0, 0, CW, 0);
      g.addColorStop(0, `${color}00`); g.addColorStop(.3, `${color}44`);
      g.addColorStop(.75, `${color}bb`); g.addColorStop(1, color);
      ctx.strokeStyle = g; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.stroke(); ctx.restore();
      const dotX = ((0.26 * CW - off) % CW + CW) % CW;
      ctx.save(); ctx.beginPath(); ctx.arc(dotX, mid + .52 * CH * .82, 5, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 20; ctx.fill(); ctx.restore();
      off = (off + 1.4) % CW; raf.current = requestAnimationFrame(draw);
    }; draw();
    return () => cancelAnimationFrame(raf.current);
  }, [color]);
  return <canvas ref={ref} style={{ width: "100%", height, display: "block" }} />;
};


const Sparkline = ({ data, color, height = 50, filled = true }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const DPR = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = c.offsetHeight;
    c.width = W * DPR; c.height = H * DPR;
    const ctx = c.getContext("2d"); ctx.scale(DPR, DPR);
    const min = Math.min(...data) - 2, max = Math.max(...data) + 2;
    const range = max - min || 1;
    const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - ((v - min) / range) * (H * .85) - H * .05]);
    ctx.beginPath();
    pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = "round";
    ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.stroke();
    if (filled) {
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `${color}40`); g.addColorStop(1, `${color}00`);
      ctx.fillStyle = g; ctx.shadowBlur = 0; ctx.fill();
    }
  }, [data, color, filled]);
  return <canvas ref={ref} style={{ width: "100%", height, display: "block" }} />;
};


const RingGauge = ({ value, max, color, size = 110, label, unit }) => {
  const ref = useRef(null); const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const DPR = window.devicePixelRatio || 1;
    c.width = size * DPR; c.height = size * DPR;
    const ctx = c.getContext("2d"); ctx.scale(DPR, DPR);
    const cx = size / 2, cy = size / 2, r = size / 2 - 10;
    let prog = 0; const target = value / max;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 8; ctx.stroke();
      const start = -Math.PI / 2, end = start + prog * Math.PI * 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, start, end);
      ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.lineCap = "round";
      ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = `bold ${size * .18}px Syne,sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowBlur = 0; ctx.fillText(Math.round(prog * max), cx, cy - 6);
      ctx.font = `${size * .1}px DM Sans,sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillText(unit, cx, cy + 9);
      if (prog < target) { prog = Math.min(prog + .018, target); raf.current = requestAnimationFrame(draw); }
    }; draw();
    return () => cancelAnimationFrame(raf.current);
  }, [value, max, color, size]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <canvas ref={ref} style={{ width: size, height: size }} />
      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
    </div>
  );
};


const VitalCard = ({ icon, label, value, unit, color, status, statusColor, data, trend, delay }) => (
  <div style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${color}22`, borderRadius: 18, padding: "1.2rem", position: "relative", overflow: "hidden", animation: "fadeUp .4s both", animationDelay: delay }}>
    <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: color, filter: "blur(45px)", opacity: .18, pointerEvents: "none" }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: ".7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>{icon}</div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em" }}>{label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.7rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.35)", fontWeight: 400 }}>{unit}</span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 50, background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}28`, fontSize: ".62rem", fontWeight: 600 }}>● {status}</span>
        <div style={{ fontSize: ".65rem", color: trend > 0 ? "#00ff9d" : trend < 0 ? "#ff6b6b" : "rgba(255,255,255,.3)", marginTop: 5, textAlign: "right" }}>
          {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {Math.abs(trend)}% vs yesterday
        </div>
      </div>
    </div>
    <Sparkline data={data} color={color} height={48} />
  </div>
);


const HistoryRow = ({ date, hr, spo2, temp, bp, note }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr 1.8fr", gap: ".5rem", alignItems: "center", padding: "10px 14px", borderRadius: 11, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", marginBottom: 6 }}>
    <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.5)" }}>{date}</span>
    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#ff6b6b" }}>{hr} <span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)", fontWeight: 400 }}>BPM</span></span>
    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#00c8ff" }}>{spo2}<span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)", fontWeight: 400 }}>%</span></span>
    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#ffd93d" }}>{temp}<span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)", fontWeight: 400 }}>°C</span></span>
    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#a78bfa" }}>{bp}</span>
    <span style={{ fontSize: ".66rem", color: "rgba(255,255,255,.35)", fontStyle: "italic" }}>{note}</span>
  </div>
);


const DayGroup = ({ date, day, badge, avg, rows, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={{ marginBottom: ".6rem" }}>
      {}
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,.04)", border: `1px solid rgba(255,255,255,.07)`, cursor: "pointer", transition: "background .18s", userSelect: "none" }}
        onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,.07)"}
        onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,.04)"}>
        {}
        <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,.3)", transition: "transform .2s", display: "inline-block", transform: open ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>▶</span>
        {}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 700, color: "#fff" }}>{date}</span>
          <span style={{ padding: "2px 9px", borderRadius: 50, background: `${badge}15`, color: badge, border: `1px solid ${badge}28`, fontSize: ".6rem", fontWeight: 700 }}>{day}</span>
          <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.28)", marginLeft: 4 }}>{rows.length} readings</span>
        </div>
        {}
        <div style={{ display: "flex", gap: "1.2rem", flexShrink: 0 }}>
          {[
            { label: "HR", value: `${avg.hr}`, unit: "BPM", color: "#ff6b6b" },
            { label: "SpO₂", value: `${avg.spo2}`, unit: "%", color: "#00c8ff" },
            { label: "Temp", value: `${avg.temp}`, unit: "°C", color: "#ffd93d" },
            { label: "BP", value: avg.bp, unit: "", color: "#a78bfa" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color }}>{value}<span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)", fontWeight: 400 }}>{unit}</span></div>
              <div style={{ fontSize: ".55rem", color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".07em" }}>avg {label}</div>
            </div>
          ))}
        </div>
      </div>

      {}
      {open && (
        <div style={{ marginTop: 4, paddingLeft: 12, borderLeft: `2px solid ${badge}40` }}>
          {}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 1.6fr", gap: ".5rem", padding: "6px 14px", marginBottom: 2 }}>
            {["Time", "Heart Rate", "SpO₂", "Temp", "BP", "Note"].map(h => (
              <span key={h} style={{ fontSize: ".58rem", fontWeight: 700, color: "rgba(255,255,255,.22)", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</span>
            ))}
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 1.6fr", gap: ".5rem", alignItems: "center", padding: "9px 14px", borderRadius: 10, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)", marginBottom: 4, animation: "fadeUp .2s both", animationDelay: `${i * .05}s` }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 600, color: "rgba(255,255,255,.45)" }}>{r.time}</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#ff6b6b" }}>{r.hr} <span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)", fontWeight: 400 }}>BPM</span></span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#00c8ff" }}>{r.spo2}<span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)", fontWeight: 400 }}>%</span></span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#ffd93d" }}>{r.temp}<span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)", fontWeight: 400 }}>°C</span></span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#a78bfa" }}>{r.bp}</span>
              <span style={{ fontSize: ".66rem", color: "rgba(255,255,255,.35)", fontStyle: "italic" }}>{r.note}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default function VitalsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [showAIChat, setShowAIChat] = useState(false);

  // ADD these new states instead:
  const [heartRate,  setHeartRate]  = useState(0);
  const [spo2,       setSpo2]       = useState(0);
  const [temp,       setTemp]       = useState(0);
  const [bp,         setBp]         = useState("--");
  const [ecgStatus,  setEcgStatus]  = useState("--");
  const [hrData,     setHrData]     = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [spo2Data,   setSpo2Data]   = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [tempData,   setTempData]   = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [bpSysData,  setBpSysData]  = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(true);

  // Weekly comparison data (kept for analysis tab to not break since prompt did not replace it)
  const [weekCompData, setWeekCompData] = useState([
     { label: "Avg Heart Rate", thisWeek: "72 BPM", lastWeek: "74 BPM", change: -2.7, color: "#ff6b6b" },
     { label: "Avg SpO₂", thisWeek: "98%", lastWeek: "97.5%", change: +0.5, color: "#00c8ff" },
     { label: "Avg Temp", thisWeek: "36.6°C", lastWeek: "36.5°C", change: +0.1, color: "#ffd93d" },
     { label: "Avg BP", thisWeek: "118/76", lastWeek: "120/78", change: -1.7, color: "#a78bfa" },
  ]);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;

    // ── 1. Real-time listener on vitals/current document ──────────────────
    const unsubVitals = onSnapshot(
      doc(db, "users", uid, "vitals", "current"),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setHeartRate(data.heartRate    || 0);
          setSpo2(data.spo2              || 0);
          setTemp(data.temperature       || 0);
          setBp(data.bloodPressure       || "--");
          setEcgStatus(data.ecgStatus    || "--");
        }
        setLoading(false);
      }
    );

    // ── 2. Real-time sparkline history (last 16 readings) ─────────────────
    const unsubHistory = onSnapshot(
      query(
        collection(db, "users", uid, "vitals_history"),
        orderBy("recordedAt", "desc"),
        limit(16)
      ),
      (snap) => {
        const vitals = snap.docs.map(d => d.data()).reverse();
        setHrData(vitals.map(v => v.heartRate   || 0));
        setSpo2Data(vitals.map(v => v.spo2       || 0));
        setTempData(vitals.map(v => v.temperature || 0));
        setBpSysData(vitals.map(v => parseInt(v.bloodPressure?.split("/")[0]) || 0));
      }
    );

    // ── 3. Fetch history table for History tab ────────────────────────────
    const fetchHistory = async () => {
      const snap = await getDocs(
        query(
          collection(db, "users", uid, "vitals_history"),
          orderBy("recordedAt", "desc"),
          limit(50)
        )
      );

      const readings = snap.docs.map(d => d.data());

      const grouped = {};
      readings.forEach(r => {
        const date    = new Date(r.recordedAt);
        const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push({
          time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          hr:   r.heartRate     || "--",
          spo2: r.spo2          || "--",
          temp: r.temperature   || "--",
          bp:   r.bloodPressure || "--",
          note: r.ecgStatus     || "Reading recorded",
        });
      });

      const dayGroups = Object.entries(grouped).map(([date, rows]) => ({
        date,
        day:   new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        badge: "#00c8ff",
        avg: {
          hr:   Math.round(rows.reduce((s, r) => s + (r.hr   || 0), 0) / rows.length),
          spo2: Math.round(rows.reduce((s, r) => s + (r.spo2 || 0), 0) / rows.length),
          temp: (rows.reduce((s, r) => s + (parseFloat(r.temp) || 0), 0) / rows.length).toFixed(1),
          bp:   rows[0]?.bp || "--",
        },
        rows,
      }));

      setHistory(dayGroups);
    };

    fetchHistory();

    return () => {
      unsubVitals();
      unsubHistory();
    };
  }, []);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "ecg", label: "ECG Live" },
    { key: "history", label: "History" },
    { key: "analysis", label: "Analysis" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:#050f1f}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.2)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}

        .vp{display:flex;height:100vh;overflow:hidden;background:#050f1f}

        /* SIDEBAR */
        .sidebar{
          width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;
          padding:1rem .5rem;background:rgba(5,12,28,.95);border-right:1px solid rgba(255,255,255,.06);
          gap:4px;z-index:20;transition:width .3s cubic-bezier(.16,1,.3,1);overflow:hidden;
        }
        .sidebar.expanded{width:220px;align-items:flex-start;padding:1rem .8rem}
        .sb-profile{display:flex;align-items:center;gap:11px;padding:10px 8px;border-radius:13px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.14);margin-bottom:.8rem;width:100%;cursor:pointer;transition:background .2s;flex-shrink:0}
        .sb-profile:hover{background:rgba(0,200,255,.1)}
        .sb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00c8ff);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;border:2px solid rgba(0,200,255,.35);animation:hb 3s ease-in-out infinite}
        .sb-profile-info{display:none;flex-direction:column;min-width:0}
        .sidebar.expanded .sb-profile-info{display:flex}
        .sb-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-role{font-size:.62rem;color:rgba(0,200,255,.7);margin-top:1px}
        .sb-toggle{width:100%;display:flex;align-items:center;flex-direction:row;gap:6px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);cursor:pointer;color:rgba(255,255,255,.5);transition:all .2s;margin-bottom:.5rem;flex-shrink:0}
        .sb-toggle:hover{background:rgba(255,255,255,.08);color:#fff}
        .sb-toggle-lines{display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor;transition:all .3s}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none;transition:opacity .2s}
        .sidebar.expanded .sb-item-label{display:block}
        .sb-active-bar{width:3px;height:16px;border-radius:99px;background:#00c8ff;box-shadow:0 0 8px #00c8ff;margin-left:auto;flex-shrink:0;display:none}
        .sb-item.active .sb-active-bar{display:block}
        .sb-divider{width:100%;height:1px;background:rgba(255,255,255,.06);margin:.4rem 0;flex-shrink:0}
        .sb-bottom{display:flex;flex-direction:column;gap:4px;width:100%;flex-shrink:0}
        .sb-logout{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:11px;border:1px solid rgba(255,80,80,.15);cursor:pointer;background:rgba(255,80,80,.05);transition:all .2s;color:rgba(255,100,100,.7);width:100%;white-space:nowrap;overflow:hidden}
        .sb-logout:hover{background:rgba(255,80,80,.12);color:#ff6b6b;border-color:rgba(255,80,80,.3)}
        .sidebar.expanded .sb-logout{justify-content:flex-start}
        .sb-logout-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.expanded .sb-logout-label{display:block}

        /* MAIN */
        .vp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

        /* TOPBAR */
        .vp-topbar{display:flex;align-items:center;justify-content:space-between;padding:.9rem 1.8rem;background:rgba(5,15,31,.96);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;backdrop-filter:blur(10px)}
        .vp-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:800;color:#fff}
        .vp-sub{font-size:.72rem;color:rgba(255,255,255,.32);margin-top:1px}
        .vp-topright{display:flex;align-items:center;gap:12px}
        .live-pill{display:flex;align-items:center;gap:7px;padding:6px 14px;background:rgba(0,255,157,.07);border:1px solid rgba(0,255,157,.2);border-radius:50px}
        .live-dot{width:7px;height:7px;border-radius:50%;background:#00ff9d;box-shadow:0 0 8px #00ff9d;animation:blink 1s step-start infinite;flex-shrink:0}
        .live-pill span{font-size:.7rem;color:#00ff9d;font-weight:700;letter-spacing:.06em}
        .time-txt{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700;color:#00c8ff}

        /* TABS */
        .vp-tabs{display:flex;align-items:center;gap:4px;padding:.8rem 1.8rem .6rem;border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;background:rgba(5,15,31,.7)}
        .vp-tab{padding:7px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:.76rem;font-weight:700;letter-spacing:.04em;transition:all .2s;background:transparent;color:rgba(255,255,255,.35)}
        .vp-tab:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .vp-tab.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);color:#00c8ff}

        /* CONTENT */
        .vp-content{flex:1;overflow-y:auto;padding:1.4rem 1.8rem}

        /* CARDS */
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.1rem;animation:fadeUp .4s both}
        .card-hd{font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.9rem;display:flex;align-items:center;justify-content:space-between}

        /* ECG CARD */
        .ecg-stats{display:flex;justify-content:space-between;margin-top:.9rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.06)}
        .ecg-stat-item{text-align:center}
        .ecg-stat-val{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;color:#00ff9d}
        .ecg-stat-lbl{font-size:.6rem;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.07em;margin-top:2px}

        /* HISTORY TABLE */
        .hist-header{display:grid;gridTemplateColumns:1.4fr 1fr 1fr 1fr 1fr 1.8fr;gap:.5rem;padding:6px 14px;margin-bottom:4px}
        .hist-col-hd{font-size:.6rem;font-weight:700;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:.1em}

        /* ANALYSIS */
        .analysis-bar{height:8px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden;margin-top:5px}
        .analysis-fill{height:100%;border-radius:99px;transition:width 1.2s cubic-bezier(.16,1,.3,1)}

        /* MOBILE */
        @media(max-width:768px){
          .sidebar{display:none}
          .vp-content{padding:1rem}
        }

        /* NAV CLICK ANIMATIONS */
        .sb-item{position:relative;overflow:hidden}
        .sb-item.clicked{animation:navBounce .5s cubic-bezier(.36,.07,.19,.97) both}
        .sb-item.clicked.active{animation:navBounceActive .5s cubic-bezier(.36,.07,.19,.97) both}
        @keyframes navBounce{
          0%{transform:scale(1)}
          18%{transform:scale(.88)}
          45%{transform:scale(1.06)}
          72%{transform:scale(.97)}
          100%{transform:scale(1)}
        }
        @keyframes navBounceActive{
          0%{transform:scale(1);box-shadow:none}
          18%{transform:scale(.88)}
          45%{transform:scale(1.07);box-shadow:0 0 0 5px rgba(0,200,255,.2)}
          72%{transform:scale(.98);box-shadow:0 0 0 10px rgba(0,200,255,0)}
          100%{transform:scale(1);box-shadow:none}
        }
        .sb-item.clicked .sb-item-icon{animation:iconPop .45s cubic-bezier(.36,.07,.19,.97) both}
        @keyframes iconPop{
          0%{transform:scale(1) rotate(0deg)}
          20%{transform:scale(1.35) rotate(-15deg)}
          50%{transform:scale(1.15) rotate(10deg)}
          75%{transform:scale(1.05) rotate(-4deg)}
          100%{transform:scale(1) rotate(0deg)}
        }
        .sb-ripple{
          position:absolute;border-radius:50%;
          background:rgba(0,200,255,.28);
          width:0;height:0;
          transform:translate(-50%,-50%);
          animation:navRipple .55s ease-out forwards;
          pointer-events:none;
        }
        .sb-item.active .sb-ripple{background:rgba(0,200,255,.35)}
        @keyframes navRipple{
          0%{width:0;height:0;opacity:.9}
          100%{width:90px;height:90px;opacity:0}
        }
      `}</style>

      <div className="vp">

        <Sidebar active="vitals" />

        {}
        <div className="vp-main">

          {}
          <div className="vp-topbar">
            <div>
              <div className="vp-title">Vitals Monitor</div>
              <div className="vp-sub">Alex Johnson · PAT-0042 · Real-time health tracking</div>
            </div>
            <div className="vp-topright">
              <div className="live-pill">
                <span className="live-dot" />
                <span>LIVE</span>
              </div>
              <span className="time-txt">{time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            </div>
          </div>

          {}
          <div className="vp-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`vp-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          {}
          <div className="vp-content">
            {loading ? (
              <div style={{ color: "#00c8ff", textAlign: "center", padding: "2rem" }}>
                Loading vitals...
              </div>
            ) : (
              <>
            {}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                {}
                <div className="card" style={{ animationDelay: ".05s" }}>
                  <div className="card-hd">
                    <span>Live Vitals</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff9d", display: "inline-block", animation: "blink 1s step-start infinite", boxShadow: "0 0 6px #00ff9d" }} />
                      <span style={{ fontSize: ".65rem", color: "#00ff9d" }}>Updating live</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "1rem", padding: ".5rem 0" }}>
                    <RingGauge value={heartRate} max={200} color="#ff6b6b" size={110} label="Heart Rate" unit="BPM" />
                    <RingGauge value={spo2} max={100} color="#00c8ff" size={110} label="SpO₂" unit="%" />
                    <RingGauge value={temp * 10} max={400} color="#ffd93d" size={110} label="Temperature" unit="°C" />
                    <RingGauge value={parseInt(bp?.split("/")[0]) || 118} max={200} color="#a78bfa" size={110} label="Systolic BP" unit="mmHg" />
                    <RingGauge value={parseInt(bp?.split("/")[1]) || 76} max={120} color="#f472b6" size={110} label="Diastolic BP" unit="mmHg" />
                  </div>
                </div>

                {}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <VitalCard icon="❤️" label="Heart Rate" value={heartRate} unit="BPM" color="#ff6b6b" status="Normal" statusColor="#00ff9d" data={hrData} trend={2.1} delay=".1s" />
                  <VitalCard icon="🩸" label="SpO₂" value={spo2} unit="%" color="#00c8ff" status="Excellent" statusColor="#00c8ff" data={spo2Data} trend={0} delay=".16s" />
                  <VitalCard icon="🌡️" label="Temperature" value={temp} unit="°C" color="#ffd93d" status="Normal" statusColor="#00ff9d" data={tempData} trend={-0.3} delay=".22s" />
                  <VitalCard icon="💉" label="Blood Pressure" value={bp} unit="mmHg" color="#a78bfa" status="Optimal" statusColor="#a78bfa" data={bpSysData} trend={1.2} delay=".28s" />
                </div>

                {}
                <div className="card" style={{ animationDelay: ".34s" }}>
                  <div className="card-hd">
                    <span>ECG Signal Preview</span>
                    <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.3)", cursor: "pointer" }} onClick={() => setActiveTab("ecg")}>Full view →</span>
                  </div>
                  <ECGCanvas color="#00ff9d" height={70} />
                  <div className="ecg-stats">
                    {[["Rhythm", "Normal Sinus", "#00ff9d"], ["PR", "142 ms", "#00c8ff"], ["QRS", "88 ms", "#ffd93d"], ["QT", "380 ms", "#a78bfa"], ["Rate", `${heartRate} BPM`, "#ff6b6b"]].map(([l, v, c]) => (
                      <div key={l} className="ecg-stat-item">
                        <div className="ecg-stat-val" style={{ color: c }}>{v}</div>
                        <div className="ecg-stat-lbl">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {}
            {activeTab === "ecg" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="card" style={{ animationDelay: ".05s" }}>
                  <div className="card-hd">
                    <span>Lead II — Real-time ECG</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", animation: "blink 1s step-start infinite", display: "inline-block", boxShadow: "0 0 6px #00ff9d" }} />
                      <span style={{ fontSize: ".65rem", color: "#00ff9d", fontWeight: 600 }}>Recording</span>
                    </div>
                  </div>
                  <ECGCanvas color="#00ff9d" height={120} />
                  <div className="ecg-stats">
                    {[["Rhythm", "Normal Sinus", "#00ff9d"], ["PR Interval", "142 ms", "#00c8ff"], ["QRS Duration", "88 ms", "#ffd93d"], ["QT Interval", "380 ms", "#a78bfa"], ["Heart Rate", `${heartRate} BPM`, "#ff6b6b"], ["Axis", "Normal", "#f472b6"]].map(([l, v, c]) => (
                      <div key={l} className="ecg-stat-item">
                        <div className="ecg-stat-val" style={{ color: c }}>{v}</div>
                        <div className="ecg-stat-lbl">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {[["Lead I", "#00c8ff", 1.0], ["Lead III", "#a78bfa", 0.8], ["aVR", "#ffd93d", 1.1], ["aVF", "#f472b6", 0.9]].map(([lead, color, scale]) => (
                    <div key={lead} className="card" style={{ animationDelay: ".15s" }}>
                      <div className="card-hd"><span>{lead}</span></div>
                      <ECGCanvas color={color} height={55} />
                    </div>
                  ))}
                </div>

                {}
                <div className="card" style={{ animationDelay: ".25s" }}>
                  <div className="card-hd"><span>AI Interpretation</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".8rem" }}>
                    {[
                      { label: "Overall Rhythm", value: "Normal Sinus Rhythm", color: "#00ff9d", icon: "✅" },
                      { label: "ST Segment", value: "No elevation detected", color: "#00ff9d", icon: "✅" },
                      { label: "T Wave", value: "Normal morphology", color: "#00ff9d", icon: "✅" },
                      { label: "P Wave", value: "Present, normal axis", color: "#00ff9d", icon: "✅" },
                      { label: "QRS Complex", value: "Normal duration 88ms", color: "#00ff9d", icon: "✅" },
                      { label: "Arrhythmia", value: "None detected", color: "#00ff9d", icon: "✅" },
                    ].map(({ label, value, color, icon }) => (
                      <div key={label} style={{ padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: ".85rem" }}>{icon}</span>
                          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
                        </div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 600, color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {}
            {activeTab === "history" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                {}
                <div className="card" style={{ animationDelay: ".05s" }}>
                  <div className="card-hd">
                    <span>Vitals History Log</span>
                    <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.3)" }}>Last 7 days</span>
                  </div>

                  {history.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: ".8rem" }}>No history available</div>
                  ) : (
                    history.map((group, i) => (
                      <DayGroup key={i} {...group} defaultOpen={i === 0} />
                    ))
                  )}
                </div>

                {}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {[
                    { label: "Heart Rate — 7 Day Trend", data: hrData, color: "#ff6b6b" },
                    { label: "SpO₂ — 7 Day Trend", data: spo2Data, color: "#00c8ff" },
                    { label: "Temperature — 7 Day Trend", data: tempData, color: "#ffd93d" },
                    { label: "Systolic BP — 7 Day Trend", data: bpSysData, color: "#a78bfa" },
                  ].map(({ label, data, color }) => (
                    <div key={label} className="card" style={{ animationDelay: ".1s" }}>
                      <div className="card-hd"><span>{label}</span></div>
                      <Sparkline data={data} color={color} height={70} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.3)" }}>7 days ago</span>
                        <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.3)" }}>Today</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {activeTab === "analysis" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                {}
                <div className="card" style={{ animationDelay: ".05s" }}>
                  <div className="card-hd"><span>Overall Health Score</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                    <RingGauge value={87} max={100} color="#00c8ff" size={130} label="Health Score" unit="/100" />
                    <div style={{ flex: 1, minWidth: 200 }}>
                      {[
                        { label: "Cardiovascular Health", pct: 82, color: "#ff6b6b" },
                        { label: "Respiratory Function", pct: 96, color: "#00c8ff" },
                        { label: "Temperature Regulation", pct: 94, color: "#ffd93d" },
                        { label: "Blood Pressure Control", pct: 88, color: "#a78bfa" },
                        { label: "Overall Stability", pct: 90, color: "#00ff9d" },
                      ].map(({ label, pct, color }) => (
                        <div key={label} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.5)" }}>{label}</span>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color }}>{pct}%</span>
                          </div>
                          <div className="analysis-bar">
                            <div className="analysis-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color}88,${color})`, boxShadow: `0 0 8px ${color}66` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {}
                <div className="card" style={{ animationDelay: ".12s" }}>
                  <div className="card-hd">
                    <span>AI Health Insights</span>
                    <button onClick={() => setShowAIChat(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 50, background: showAIChat ? "rgba(0,200,255,.18)" : "rgba(0,200,255,.08)", border: "1px solid rgba(0,200,255,.28)", color: "#00c8ff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".66rem", fontWeight: 700, letterSpacing: ".04em", transition: "all .2s" }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(0,200,255,.2)"}
                      onMouseOut={e => e.currentTarget.style.background = showAIChat ? "rgba(0,200,255,.18)" : "rgba(0,200,255,.08)"}>
                      <span style={{ fontSize: ".8rem" }}>🤖</span> Ask AI
                    </button>
                  </div>

                  {}
                  {showAIChat && (
                    <div style={{ marginBottom: "1rem", padding: "12px 14px", borderRadius: 12, background: "rgba(0,200,255,.04)", border: "1px solid rgba(0,200,255,.14)", animation: "fadeUp .25s both" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#0066ff,#00c8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", flexShrink: 0 }}>🤖</div>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".74rem", fontWeight: 700, color: "#00c8ff" }}>JarvisAI Health Assistant</span>
                        <span style={{ marginLeft: "auto", fontSize: ".6rem", color: "rgba(255,255,255,.3)" }}>Analyzing your vitals…</span>
                      </div>
                      <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.55)", lineHeight: 1.7, marginBottom: 12, padding: "10px 12px", borderRadius: 9, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)" }}>
                        Based on your last 7 days of data, your overall health is <span style={{ color: "#00ff9d", fontWeight: 600 }}>stable</span>. Your heart rate averaged <span style={{ color: "#ff6b6b", fontWeight: 600 }}>72 BPM</span>, SpO₂ held steady at <span style={{ color: "#00c8ff", fontWeight: 600 }}>98%</span>, and temperature remained normal. I've flagged a mild BP trend — worth monitoring over the next 3 days. No immediate concern.
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                        {["Why is my BP elevated?", "How can I improve my SpO₂?", "Is my heart rate normal?", "Generate health summary"].map(q => (
                          <button key={q} style={{ padding: "4px 11px", borderRadius: 50, background: "rgba(0,200,255,.08)", border: "1px solid rgba(0,200,255,.2)", color: "#00c8ff", fontSize: ".62rem", fontFamily: "'Syne',sans-serif", fontWeight: 600, cursor: "pointer", transition: "all .18s" }}
                            onMouseOver={e => e.currentTarget.style.background = "rgba(0,200,255,.16)"}
                            onMouseOut={e => e.currentTarget.style.background = "rgba(0,200,255,.08)"}>{q}</button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input placeholder="Ask about your vitals…" style={{ flex: 1, padding: "8px 12px", borderRadius: 9, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", fontSize: ".72rem", fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
                        <button style={{ padding: "8px 16px", borderRadius: 9, background: "linear-gradient(135deg,#0066ff,#00c8ff)", border: "none", color: "#fff", fontSize: ".72rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, cursor: "pointer" }}>Send</button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { icon: "✅", title: "Heart Rate Stable", desc: "Your resting HR of 72 BPM is within the optimal range of 60–100 BPM. Consistent over the past week.", color: "#00ff9d", type: "Good" },
                      { icon: "✅", title: "SpO₂ Excellent", desc: "Blood oxygen level maintained at 98% — excellent respiratory function. No hypoxia risk detected.", color: "#00c8ff", type: "Good" },
                      { icon: "⚠️", title: "Mild Hypertension Watch", desc: "Occasional systolic readings above 120 mmHg noted. Consider reducing sodium intake and increasing hydration.", color: "#fbbf24", type: "Watch" },
                      { icon: "✅", title: "Temperature Normal", desc: "Core body temperature stable at 36.6°C throughout the day. No fever or hypothermia risk.", color: "#ffd93d", type: "Good" },
                      { icon: "💡", title: "Activity Recommendation", desc: "Based on your vitals, 30 minutes of moderate cardio daily could further improve cardiovascular metrics.", color: "#a78bfa", type: "Tip" },
                    ].map(({ icon, title, desc, color, type }) => (
                      <div key={title} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: `1px solid ${color}18` }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: "#fff" }}>{title}</span>
                            <span style={{ padding: "1px 7px", borderRadius: 50, background: `${color}15`, color, border: `1px solid ${color}28`, fontSize: ".58rem", fontWeight: 600 }}>{type}</span>
                          </div>
                          <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.42)", lineHeight: 1.5 }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly comparison */}
                <div className="card" style={{ animationDelay: ".2s" }}>
                  <div className="card-hd"><span>This Week vs Last Week</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: ".8rem" }}>
                    {weekCompData.map(({ label, thisWeek, lastWeek, change, color }) => (
                      <div key={label} style={{ padding: "12px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                        <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{label}</div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 800, color, marginBottom: 2 }}>{thisWeek}</div>
                        <div style={{ fontSize: ".66rem", color: "rgba(255,255,255,.35)", marginBottom: 5 }}>Last: {lastWeek}</div>
                        <span style={{ fontSize: ".65rem", fontWeight: 600, color: change < 0 && label !== "Avg SpO₂" ? "#00ff9d" : change > 0 ? "#ff6b6b" : "rgba(255,255,255,.3)" }}>
                          {change < 0 ? "▼" : "▲"} {Math.abs(change)}% {change < 0 ? (label === "Avg SpO₂" ? "decreased" : "improved") : "changed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
