import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = "https://healthtest-production-3366.up.railway.app";


const ECGCanvas = ({ color = "#00ff9d", glowColor = "#00ff9d" }) => {
  const ref = useRef(null); const rafRef = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const DPR = window.devicePixelRatio || 1;
    const CW = canvas.offsetWidth, CH = canvas.offsetHeight;
    canvas.width = CW * DPR; canvas.height = CH * DPR;
    const ctx = canvas.getContext("2d"); ctx.scale(DPR, DPR);
    const mid = CH / 2;
    const cycle = [
      [0.00, 0], [0.06, 0], [0.10, -3], [0.12, 3], [0.14, 0],
      [0.20, 0], [0.23, -20], [0.26, 32], [0.29, -10], [0.32, 0],
      [0.36, 0], [0.40, 6], [0.44, 6], [0.48, 0],
      [0.56, 0], [0.60, -3], [0.62, 3], [0.64, 0],
      [0.70, 0], [0.73, -20], [0.76, 32], [0.79, -10], [0.82, 0],
      [0.86, 0], [0.90, 6], [0.94, 6], [1.00, 0],
    ];
    let offset = 0;
    const draw = () => {
      ctx.clearRect(0, 0, CW, CH); ctx.save(); ctx.beginPath();
      for (let rep = -1; rep <= 1; rep++) cycle.forEach(([px, py], i) => { const x = rep * CW + px * CW - offset, y = mid + py; (i === 0 && rep === -1) ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      const g = ctx.createLinearGradient(0, 0, CW, 0); g.addColorStop(0, `${color}00`); g.addColorStop(.4, `${color}55`); g.addColorStop(.8, `${color}cc`); g.addColorStop(1, color);
      ctx.strokeStyle = g; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.shadowColor = glowColor; ctx.shadowBlur = 10; ctx.stroke(); ctx.restore();
      const dotX = ((0.26 * CW - offset) % CW + CW) % CW;
      ctx.save(); ctx.beginPath(); ctx.arc(dotX, mid + 32, 4, 0, Math.PI * 2); ctx.fillStyle = glowColor; ctx.shadowColor = glowColor; ctx.shadowBlur = 18; ctx.fill(); ctx.restore();
      offset = (offset + 1.4) % CW; rafRef.current = requestAnimationFrame(draw);
    }; draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [color, glowColor]);
  return <canvas ref={ref} style={{ width: "100%", height: "62px", display: "block" }} />;
};


const BrainWaveCanvas = () => {
  const ref = useRef(null); const rafRef = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const DPR = window.devicePixelRatio || 1;
    const CW = canvas.offsetWidth, CH = canvas.offsetHeight;
    canvas.width = CW * DPR; canvas.height = CH * DPR;
    const ctx = canvas.getContext("2d"); ctx.scale(DPR, DPR);
    const mid = CH / 2; let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, CW, CH); ctx.save(); ctx.beginPath();
      for (let x = 0; x <= CW; x += 2) { const p = x / CW; const y = mid + Math.sin((p * 6 + t) * Math.PI) * 12 + Math.sin((p * 3 + t * .7) * Math.PI) * 6 + Math.sin((p * 12 + t * 1.3) * Math.PI) * 3; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      const g = ctx.createLinearGradient(0, 0, CW, 0); g.addColorStop(0, "rgba(0,230,255,0)"); g.addColorStop(.3, "rgba(0,200,255,.5)"); g.addColorStop(.7, "rgba(100,80,255,.8)"); g.addColorStop(1, "rgba(180,60,255,1)");
      ctx.strokeStyle = g; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 12; ctx.stroke(); ctx.restore();
      const dotX = ((t * 60) % CW + CW) % CW, dotP = dotX / CW;
      const dotY = mid + Math.sin((dotP * 6 + t) * Math.PI) * 12 + Math.sin((dotP * 3 + t * .7) * Math.PI) * 6 + Math.sin((dotP * 12 + t * 1.3) * Math.PI) * 3;
      ctx.save(); ctx.beginPath(); ctx.arc(dotX, dotY, 4, 0, Math.PI * 2); ctx.fillStyle = "#c084fc"; ctx.shadowColor = "#c084fc"; ctx.shadowBlur = 18; ctx.fill(); ctx.restore();
      t += 0.012; rafRef.current = requestAnimationFrame(draw);
    }; draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={ref} style={{ width: "100%", height: "62px", display: "block" }} />;
};


const ParticleField = () => {
  const ref = useRef(null); const rafRef = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ctx = c.getContext("2d"), W = c.width, H = c.height;
    const pts = Array.from({ length: 35 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .4, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
    const draw = () => { ctx.clearRect(0, 0, W, H); pts.forEach(p => { p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H; const a = .25 + .35 * Math.abs(Math.sin(Date.now() * .001 + p.x)); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(168,85,247,${a})`; ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 5; ctx.fill(); }); rafRef.current = requestAnimationFrame(draw); }; draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

const HeartSVG = ({ color }) => (<svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill={color}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>);
const StethSVG = ({ color }) => (<svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></svg>);
const GoogleSVG = () => (<svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>);
const FacebookSVG = () => (<svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>);

const PulseRings = ({ color }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
    {[0, .8, 1.6].map((d, i) => (<div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${color}40`, animation: `pr 2.4s ease-out ${d}s infinite` }} />))}
  </div>
);

const FCard = ({ icon, label, value, color, s }) => (
  <div style={{ position: "absolute", zIndex: 3, animation: `floatY ${s.dur}s ease-in-out ${s.delay}s infinite`, ...s.pos }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9, background: "rgba(8,12,30,.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 11, padding: "8px 13px", whiteSpace: "nowrap", boxShadow: "0 6px 24px rgba(0,0,0,.35)" }}>
      <span style={{ fontSize: "1rem", color }}>{icon}</span>
      <div>
        <div style={{ fontSize: ".58rem", color: "rgba(255,255,255,.36)", textTransform: "uppercase", letterSpacing: ".1em", lineHeight: 1.3 }}>{label}</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 700, color }}>{value}</div>
      </div>
    </div>
  </div>
);

const FloatingHeader = ({ accent }) => (
  <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", zIndex: 20, animation: "floatMsg 3s ease-in-out infinite", whiteSpace: "nowrap" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(6,10,22,.82)", backdropFilter: "blur(18px)", border: `1px solid ${accent}35`, borderRadius: 50, padding: "7px 20px", boxShadow: `0 4px 24px rgba(0,0,0,.4),0 0 0 1px ${accent}20` }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}`, display: "inline-block", animation: "blink 1.2s step-start infinite", flexShrink: 0 }} />
      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#fff" }}>Remote Healthcare Monitoring System</span>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}`, display: "inline-block", animation: "blink 1.2s step-start .6s infinite", flexShrink: 0 }} />
    </div>
  </div>
);


const VitalsCanvas = () => {
  const ref = useRef(null); const rafRef = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const DPR = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * DPR; c.height = c.offsetHeight * DPR;
    const ctx = c.getContext("2d"); ctx.scale(DPR, DPR);
    const W = c.offsetWidth, H = c.offsetHeight;
    let t = 0;

    
    const pts = Array.from({ length: 28 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + .5,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      hue: Math.random() > .5 ? "0,200,255" : "0,255,160",
    }));

    
    const ecgCycle = [
      [0, .0], [.06, .0], [.10, -.04], [.12, .04], [.14, .0],
      [.20, .0], [.23, -.28], [.26, .44], [.29, -.14], [.32, .0],
      [.36, .0], [.40, .08], [.44, .08], [.48, .0],
      [.56, .0], [.60, -.04], [.62, .04], [.64, .0],
      [.70, .0], [.73, -.28], [.76, .44], [.79, -.14], [.82, .0],
      [.86, .0], [.90, .08], [.94, .08], [1.0, .0],
    ];

    let ecgOff = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
        const a = .15 + .25 * Math.abs(Math.sin(Date.now() * .0008 + p.x));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${a})`; ctx.shadowColor = `rgba(${p.hue},.6)`; ctx.shadowBlur = 6; ctx.fill();
      });

      
      const EY = H * .72, EH = H * .22;
      ctx.save(); ctx.beginPath();
      for (let rep = -1; rep <= 1; rep++) {
        ecgCycle.forEach(([px, py], i) => {
          const x = rep * W + px * W - ecgOff, y = EY + py * EH;
          (i === 0 && rep === -1) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
      }
      const eg = ctx.createLinearGradient(0, 0, W, 0);
      eg.addColorStop(0, "rgba(0,255,157,0)"); eg.addColorStop(.4, "rgba(0,255,157,.4)");
      eg.addColorStop(.85, "rgba(0,255,157,.9)"); eg.addColorStop(1, "#00ff9d");
      ctx.strokeStyle = eg; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.shadowColor = "#00ff9d"; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
      ecgOff = (ecgOff + 1.2) % W;

      
      const dotX = ((0.26 * W - ecgOff) % W + W) % W;
      ctx.save(); ctx.beginPath(); ctx.arc(dotX, EY + .44 * EH, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#00ff9d"; ctx.shadowColor = "#00ff9d"; ctx.shadowBlur = 20; ctx.fill(); ctx.restore();

      
      const cx = W * .5, cy = H * .36;
      const pulse = 1 + .04 * Math.sin(t * 2.8);
      
      [60, 90, 120].forEach((r, i) => {
        const a = (.12 - i * .035) * Math.abs(Math.sin(t * .8 + i * .6));
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * pulse);
        g.addColorStop(0, `rgba(0,200,255,${a})`); g.addColorStop(1, "rgba(0,200,255,0)");
        ctx.beginPath(); ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      
      const hs = 22 * pulse, hx = cx, hy = cy + 2;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(hx, hy + hs * .3);
      ctx.bezierCurveTo(hx - hs, hy - hs * .4, hx - hs * 1.2, hy + hs * .6, hx, hy + hs * 1.1);
      ctx.bezierCurveTo(hx + hs * 1.2, hy + hs * .6, hx + hs, hy - hs * .4, hx, hy + hs * .3);
      ctx.fillStyle = `rgba(255,100,120,${.7 + .3 * Math.abs(Math.sin(t * 2.8))})`;
      ctx.shadowColor = "#ff6b6b"; ctx.shadowBlur = 18 + 10 * Math.abs(Math.sin(t * 2.8)); ctx.fill(); ctx.restore();

      
      const orbitals = [
        { r: 90, speed: .4, offset: 0, label: "❤ 72 BPM", color: "#ff6b6b" },
        { r: 118, speed: -.28, offset: 1.2, label: "SpO₂ 98%", color: "#00c8ff" },
        { r: 146, speed: .18, offset: 2.4, label: "36.6°C", color: "#ffd93d" },
      ];
      orbitals.forEach(({ r, speed, offset, label, color }) => {
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${color}20`; ctx.lineWidth = 1; ctx.setLineDash([4, 6]); ctx.stroke();
        ctx.restore();

        const angle = t * speed + offset;
        const dx = cx + Math.cos(angle) * r, dy = cy + Math.sin(angle) * r;
        ctx.save();
        ctx.beginPath(); ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.font = "bold 10px 'DM Sans',sans-serif";
        ctx.fillStyle = "#fff";
        ctx.shadowColor = color; ctx.shadowBlur = 8;
        const lx = cx + Math.cos(angle) * (r + 20), ly = cy + Math.sin(angle) * (r + 20);
        const clampX = Math.max(30, Math.min(W - 50, lx));
        const clampY = Math.max(14, Math.min(H - 10, ly));
        ctx.fillText(label, clampX - 16, clampY + 4);
        ctx.restore();
      });

      t += .016; rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};


const SignupLeftPanel = () => {
  return (
    <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", padding: "0 2.5rem 2.5rem" }}>
      <VitalsCanvas />

      {}
      <div style={{ position: "relative", zIndex: 3 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "6px 16px", borderRadius: 50, background: "rgba(0,150,255,.1)", border: "1px solid rgba(0,150,255,.22)", marginBottom: "1rem" }}>
          <span style={{ display: "flex", animation: "hb 1.8s ease-in-out infinite" }}><HeartSVG color="#00c8ff" /></span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", letterSpacing: ".05em" }}>Jarvis <span style={{ color: "#00c8ff" }}>AI</span></span>
        </div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.2rem", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: ".5rem" }}>
          <span style={{ background: "linear-gradient(135deg,#00c8ff,#00ffd0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your health,</span><br />always monitored.
        </h2>
        <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.4)", lineHeight: 1.6, maxWidth: 340 }}>
          Real-time vitals · AI alerts · WhatsApp reports · Cloud sync
        </p>
      </div>
    </div>
  );
};


export default function App() {
  const navigate = useNavigate();
  const [page, setPage] = useState("login");
  const [portal, setPortal] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [pwErrorMsg, setPwErrorMsg] = useState("");
  const [form, setForm] = useState({ email: "", pw: "", name: "", patientId: "", confirmPw: "" });
  const isP = portal === "patient";
  const isLogin = page === "login";

  const switchPortal = p => { if (p === portal) return; setPortal(p); setAnimKey(k => k + 1); setForm({ email: "", pw: "", name: "", patientId: "", confirmPw: "" }); setShowPw(false); setErrorMsg(""); setPwErrorMsg(""); };

  const handleLogin = async () => {
    setErrorMsg("");
    setPwErrorMsg("");
    
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!form.pw) {
      setPwErrorMsg("Please enter your password.");
      return;
    }
    if (form.pw.length < 6) {
      setPwErrorMsg("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      navigate(isP ? "/dashboard" : "/doctor-dashboard");
    }, 800);
  };

  const handleSignup = async () => {
    setErrorMsg("");
    setPwErrorMsg("");
    
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!form.pw) {
      setPwErrorMsg("Please enter a password.");
      return;
    }
    if (form.pw.length < 6) {
      setPwErrorMsg("Password must contain at least 6 characters.");
      return;
    }
    if (form.pw !== form.confirmPw) {
      setPwErrorMsg("Passwords do not match!");
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      navigate(isP ? "/dashboard" : "/doctor-dashboard");
    }, 800);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      navigate(isP ? "/dashboard" : "/doctor-dashboard");
    }, 800);
  };

  const goSignup = () => { setPage("signup"); setAnimKey(k => k + 1); setShowPw(false); setErrorMsg(""); setPwErrorMsg(""); };
  const goLogin = () => { setPage("login"); setAnimKey(k => k + 1); setShowPw(false); setErrorMsg(""); setPwErrorMsg(""); };

  const T = isP ? {
    appBg: "#050f1f", lpBg: "linear-gradient(135deg,#050f1f 0%,#0a1f3e 50%,#041525 100%)",
    orb1: "rgba(0,140,255,.15)", orb2: "rgba(0,200,160,.10)", orb3: "rgba(0,80,200,.08)",
    grid: "rgba(0,180,255,.035)", ring: "#00c8ff", accent: "#0088ff", accentRgb: "0,136,255",
    btnBg: "linear-gradient(135deg,#0066ff,#0044cc)", btnSh: "0 6px 20px rgba(0,102,255,.38)", btnShH: "0 10px 28px rgba(0,102,255,.52)",
    rpBg: "#060d1c", greet: "#00c8ff",
    ecgBg: "rgba(0,200,100,.05)", ecgBorder: "rgba(0,200,100,.16)", ecgLbl: "rgba(0,255,157,.55)", dot: "#00ff9d", sigLabel: "Live ECG Signal", emoji: "🫀",
    logoC: "#00c8ff", logoBg: "rgba(0,150,255,.08)", logoBorder: "rgba(0,150,255,.2)",
    cards: [
      { icon: "❤️", label: "Heart Rate", value: "72 BPM", color: "#ff6b6b", s: { pos: { top: "8%", left: "3%" }, dur: 3.8, delay: 0 } },
      { icon: "🩸", label: "SpO₂", value: "98%", color: "#00c8ff", s: { pos: { top: "14%", right: "3%" }, dur: 4.2, delay: .9 } },
      { icon: "🌡️", label: "Temp", value: "36.6°C", color: "#ffd93d", s: { pos: { bottom: "16%", left: "3%" }, dur: 4.0, delay: 1.8 } },
      { icon: "⚡", label: "ECG", value: "Normal", color: "#00ff9d", s: { pos: { bottom: "10%", right: "3%" }, dur: 3.6, delay: 2.5 } },
    ],
    heroTitle: <>Patient Health<br /><span style={{ background: "linear-gradient(90deg,#00c8ff,#00ffd0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Monitoring</span> Portal</>,
    heroSub: "Real-time vital tracking, AI-powered alerts and personalized health insights at your fingertips.",
    stats: [["24/7", "Monitoring"], ["98%", "Accuracy"], ["AI", "Powered"]],
  } : {
    appBg: "#070410", lpBg: "linear-gradient(135deg,#080510 0%,#130a28 50%,#06030f 100%)",
    orb1: "rgba(150,40,255,.14)", orb2: "rgba(60,0,200,.10)", orb3: "rgba(200,80,255,.07)",
    grid: "rgba(180,100,255,.03)", ring: "#a855f7", accent: "#9333ea", accentRgb: "147,51,234",
    btnBg: "linear-gradient(135deg,#7c3aed,#5b21b6)", btnSh: "0 6px 20px rgba(124,58,237,.40)", btnShH: "0 10px 28px rgba(124,58,237,.55)",
    rpBg: "#07040f", greet: "#c084fc",
    ecgBg: "rgba(140,50,255,.06)", ecgBorder: "rgba(168,85,247,.18)", ecgLbl: "rgba(200,150,255,.55)", dot: "#c084fc", sigLabel: "Live Brain Wave", emoji: "🧠",
    logoC: "#c084fc", logoBg: "rgba(150,40,255,.08)", logoBorder: "rgba(150,40,255,.2)",
    cards: [
      { icon: "🩺", label: "Patients Today", value: "24", color: "#c084fc", s: { pos: { top: "8%", left: "3%" }, dur: 3.8, delay: 0 } },
      { icon: "📋", label: "Pending", value: "7 Reviews", color: "#818cf8", s: { pos: { top: "14%", right: "3%" }, dur: 4.2, delay: .9 } },
      { icon: "💊", label: "Prescriptions", value: "12 Active", color: "#f472b6", s: { pos: { bottom: "16%", left: "3%" }, dur: 4.0, delay: 1.8 } },
      { icon: "🏥", label: "Ward", value: "Active", color: "#34d399", s: { pos: { bottom: "10%", right: "3%" }, dur: 3.6, delay: 2.5 } },
    ],
    heroTitle: <>Doctor<br /><span style={{ background: "linear-gradient(90deg,#c084fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management</span> Portal</>,
    heroSub: "Manage patients remotely, review diagnostics, issue prescriptions and access AI clinical insights.",
    stats: [["150+", "Patients"], ["AI", "Diagnostics"], ["24/7", "Support"]],
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif}
        .app{height:100vh;min-height:600px;display:flex;overflow:hidden;transition:background .6s;position:relative}
        @keyframes floatMsg{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-5px)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pr{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.4);opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.2)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

        /* LEFT */
        .lp{flex:1.3;position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4rem 2.5rem 2rem;overflow:hidden}
        .lp-bg,.lp-grid{position:absolute;inset:0;transition:background .6s}
        .lp-grid{background-size:40px 40px}
        .orb{position:absolute;border-radius:50%;filter:blur(75px);pointer-events:none}
        .o1{width:560px;height:560px;top:-140px;left:-140px}
        .o2{width:440px;height:440px;bottom:-100px;right:-100px}
        .o3{width:320px;height:320px;top:50%;left:50%;transform:translate(-50%,-50%)}
        .lp-inner{position:relative;z-index:2;text-align:center;width:100%;max-width:560px}
        .logo-pill{display:inline-flex;align-items:center;gap:10px;padding:9px 22px;border-radius:50px;backdrop-filter:blur(10px);margin-bottom:1.1rem}
        .logo-icon{animation:hb 1.8s ease-in-out infinite}
        .logo-txt{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;color:#fff;letter-spacing:.05em}
        .hc{position:relative;width:290px;height:290px;margin:0 auto 1.3rem;flex-shrink:0}
        .rc-out{position:absolute;inset:0;border-radius:50%;animation:spin 22s linear infinite}
        .rc-mid{position:absolute;inset:22px;border-radius:50%;animation:spin 16s linear infinite reverse}
        .rc-core{position:absolute;inset:48px;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .rc-emoji{font-size:4.2rem}
        .hero-ttl{font-family:'Syne',sans-serif;font-size:2.6rem;font-weight:800;color:#fff;line-height:1.2;margin-bottom:.7rem}
        .hero-sub{font-size:1rem;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:1.2rem}
        .ecg-box{border-radius:14px;padding:1.1rem 1.6rem;margin-bottom:1.2rem;overflow:hidden;transition:background .5s,border-color .5s}
        .ecg-lbl{font-size:.74rem;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.5rem;display:flex;align-items:center;gap:7px}
        .ecg-dot{width:7px;height:7px;border-radius:50%;animation:blink 1s step-start infinite;flex-shrink:0}
        .stats{display:flex;justify-content:center;gap:3.5rem}
        .sn{font-family:'Syne',sans-serif;font-size:2rem;font-weight:700}
        .sl{font-size:.76rem;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.08em}

        /* RIGHT */
        .rp{flex:1;position:relative;display:flex;align-items:center;justify-content:center;padding:4rem 2.5rem 2rem;transition:background .6s;overflow-y:auto}
        .rp::before{content:'';position:absolute;left:0;top:10%;bottom:10%;width:1px;background:linear-gradient(to bottom,transparent,rgba(255,255,255,.1),transparent)}
        .form-card{width:100%;max-width:440px}
        .form-anim{animation:fadeUp .48s cubic-bezier(.16,1,.3,1) both}
        .fhead{margin-bottom:1.6rem;text-align:center}
        .greeting{font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;line-height:1.1;margin-bottom:.4rem;display:block}
        .ftitle{font-size:.95rem;color:rgba(255,255,255,.4);font-weight:400}
        .psw{display:flex;gap:5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:5px;margin-bottom:1.4rem}
        .pbtn{flex:1;padding:11px 8px;border-radius:10px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:500;display:flex;align-items:center;justify-content:center;gap:7px;color:rgba(255,255,255,.34);background:transparent;transition:all .22s}
        .pbtn.ap{background:linear-gradient(135deg,#0066ff,#0044cc);color:#fff;box-shadow:0 3px 14px rgba(0,102,255,.32)}
        .pbtn.ad{background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;box-shadow:0 3px 14px rgba(124,58,237,.35)}
        .field{margin-bottom:.95rem}
        .flbl{display:block;font-size:.75rem;color:rgba(255,255,255,.38);margin-bottom:5px;letter-spacing:.05em;text-transform:uppercase;font-weight:500}
        .fwrap{position:relative}
        .fico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:.95rem;pointer-events:none}
        .finp{width:100%;padding:13px 14px 13px 42px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:11px;font-family:'DM Sans',sans-serif;font-size:.95rem;color:#fff;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}
        .finp::placeholder{color:rgba(255,255,255,.18)}
        .finp:focus{border-color:var(--ac);background:rgba(255,255,255,.06);box-shadow:0 0 0 3px rgba(var(--ac-rgb),.12)}
        .ptoggle{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:.95rem;color:rgba(255,255,255,.26)}
        .forgot{display:block;text-align:right;font-size:.8rem;color:var(--ac);margin-top:5px;cursor:pointer;opacity:.8}
        .forgot:hover{opacity:1}
        .sbtn{width:100%;padding:14px;border:none;border-radius:12px;background:var(--btn-bg);color:#fff;font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;letter-spacing:.04em;position:relative;overflow:hidden;margin-top:.4rem;box-shadow:var(--btn-sh);transition:transform .2s,box-shadow .2s}
        .sbtn:hover{transform:translateY(-2px);box-shadow:var(--btn-sh-h)}
        .sbtn:active{transform:translateY(0)}
        .shimmer{position:absolute;top:0;left:-100%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent);animation:sh 2.2s infinite}
        @keyframes sh{to{left:150%}}
        .dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#fff;margin:0 2px;animation:dt 1s ease-in-out infinite}
        .dots span:nth-child(2){animation-delay:.2s}.dots span:nth-child(3){animation-delay:.4s}
        @keyframes dt{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
        .divrow{display:flex;align-items:center;gap:10px;margin:1rem 0;color:rgba(255,255,255,.13);font-size:.8rem}
        .divrow::before,.divrow::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07)}
        .srow{display:flex;gap:10px;margin-bottom:1rem}
        .soc{flex:1;padding:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:11px;color:rgba(255,255,255,.55);font-size:.88rem;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:500}
        .soc:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#fff}
        .soc-g:hover{border-color:rgba(66,133,244,.4);background:rgba(66,133,244,.08)}
        .soc-f:hover{border-color:rgba(24,119,242,.4);background:rgba(24,119,242,.08)}
        .switch-row{text-align:center;font-size:.8rem;color:rgba(255,255,255,.32)}
        .switch-link{color:var(--ac);cursor:pointer;font-weight:500;margin-left:3px}
        .switch-link:hover{text-decoration:underline}
        @media(max-width:768px){.lp{display:none}.rp{flex:1;padding:1.2rem}}
      `}</style>

      <div className="app" style={{ background: T.appBg, "--ac": T.accent, "--ac-rgb": T.accentRgb, "--btn-bg": T.btnBg, "--btn-sh": T.btnSh, "--btn-sh-h": T.btnShH }}>

        <FloatingHeader accent={T.accent} key={portal} />

        {}
        <div className="lp">
          <div className="lp-bg" style={{ background: T.lpBg }} />
          <div className="lp-grid" style={{ backgroundImage: `linear-gradient(${T.grid} 1px,transparent 1px),linear-gradient(90deg,${T.grid} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
          <div className="orb o1" style={{ background: `radial-gradient(circle,${T.orb1} 0%,transparent 70%)` }} />
          <div className="orb o2" style={{ background: `radial-gradient(circle,${T.orb2} 0%,transparent 70%)` }} />
          <div className="orb o3" style={{ background: `radial-gradient(circle,${T.orb3} 0%,transparent 70%)` }} />
          {!isP && <ParticleField key={"pf" + portal} />}
          {isLogin && T.cards.map((c, i) => <FCard key={i} {...c} />)}

          {isLogin ? (
            
            <div className="lp-inner">
              <div className="logo-pill" style={{ background: T.logoBg, border: `1px solid ${T.logoBorder}` }}>
                <span className="logo-icon">{isP ? <HeartSVG color={T.logoC} /> : <StethSVG color={T.logoC} />}</span>
                <span className="logo-txt">Jarvis <span style={{ color: T.logoC }}>AI</span></span>
              </div>
              <div className="hc">
                <PulseRings color={T.ring} />
                <div className="rc-out" style={{ border: `1px solid ${T.ring}25` }} />
                <div className="rc-mid" style={{ border: `1px dashed ${T.ring}18` }} />
                <div className="rc-core" style={{ background: `${T.ring}0d`, border: `1px solid ${T.ring}35` }}>
                  <span className="rc-emoji" key={portal} style={{ filter: `drop-shadow(0 0 14px ${T.ring}88)` }}>{T.emoji}</span>
                </div>
              </div>
              <h1 className="hero-ttl" key={"ht" + portal}>{T.heroTitle}</h1>
              <p className="hero-sub" key={"hs" + portal}>{T.heroSub}</p>
              <div className="ecg-box" style={{ background: T.ecgBg, border: `1px solid ${T.ecgBorder}` }}>
                <div className="ecg-lbl" style={{ color: T.ecgLbl }}>
                  <span className="ecg-dot" style={{ background: T.dot, boxShadow: `0 0 6px ${T.dot}` }} />{T.sigLabel}
                </div>
                {isP ? <ECGCanvas key={"ecg" + portal} color="#00ff9d" glowColor="#00ff9d" /> : <BrainWaveCanvas key={"bw" + portal} />}
              </div>
              <div className="stats">
                {T.stats.map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div className="sn" style={{ color: T.accent }}>{n}</div>
                    <div className="sl">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            
            <SignupLeftPanel key="su" />
          )}
        </div>

        {}
        <div className="rp" style={{ background: T.rpBg }}>
          <div className="form-card">
            <div className="form-anim" key={animKey}>

              {isLogin ? (
                
                <>
                  <div className="fhead">
                    <span className="greeting" style={{ color: T.greet }}>Welcome Back</span>
                    <div className="ftitle">Sign in to your account</div>
                  </div>
                  {errorMsg && <div style={{background:"rgba(255,80,80,.1)",border:"1px solid rgba(255,80,80,.25)",color:"#ff6b6b",padding:"10px 14px",borderRadius:10,fontSize:".75rem",fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:".8rem",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:".9rem"}}>⚠️</span> {errorMsg}</div>}
                  <div className="psw">
                    <button className={`pbtn ${isP ? "ap" : ""}`} onClick={() => switchPortal("patient")}>🧑‍⚕️ Patient</button>
                    <button className={`pbtn ${!isP ? "ad" : ""}`} onClick={() => switchPortal("doctor")}>👨‍⚕️ Doctor</button>
                  </div>
                  <div className="field">
                    <label className="flbl">Email</label>
                    <div className="fwrap">
                      <span className="fico">📧</span>
                      <input className="finp" type="email" placeholder={isP ? "patient@email.com" : "doctor@hospital.com"} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="flbl">Password</label>
                    <div className="fwrap">
                      <span className="fico">🔒</span>
                      <input className="finp" type={showPw ? "text" : "password"} placeholder="••••••••" value={form.pw} onChange={e => { setForm({ ...form, pw: e.target.value }); setPwErrorMsg(""); }} style={{ borderColor: pwErrorMsg ? "rgba(255,80,80,.5)" : undefined, boxShadow: pwErrorMsg ? "0 0 0 2px rgba(255,80,80,.2)" : undefined }} />
                      <button className="ptoggle" onClick={() => setShowPw(!showPw)}>{showPw ? "🙈" : "👁️"}</button>
                    </div>
                    {pwErrorMsg && <div style={{ fontSize: ".7rem", color: "#ff6b6b", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span> {pwErrorMsg}</div>}
                    {!pwErrorMsg && <span className="forgot">Forgot password?</span>}
                  </div>
                  <button className="sbtn" onClick={handleLogin}>
                    <div className="shimmer" />
                    {loading ? <div className="dots"><span /><span /><span /></div> : "Sign In"}
                  </button>
                  <div className="divrow">or continue with</div>
                  <div className="srow">
                    <button className="soc soc-g" onClick={handleGoogleSignIn}><GoogleSVG /> Google</button>
                    <button className="soc soc-f"><FacebookSVG /> Facebook</button>
                  </div>
                  <div className="switch-row">
                    Don't have an account?<span className="switch-link" onClick={goSignup}> Sign Up</span>
                  </div>
                </>
              ) : (
                /* ── SIGNUP FORM ── */
                <>
                  <div className="fhead">
                    <span className="greeting" style={{ color: T.greet }}>Join Us</span>
                    <div className="ftitle">Create your account</div>
                  </div>
                  {errorMsg && <div style={{background:"rgba(255,80,80,.1)",border:"1px solid rgba(255,80,80,.25)",color:"#ff6b6b",padding:"10px 14px",borderRadius:10,fontSize:".75rem",fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:".8rem",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:".9rem"}}>⚠️</span> {errorMsg}</div>}
                  <div className="field">
                    <label className="flbl">Full Name</label>
                    <div className="fwrap">
                      <span className="fico">👤</span>
                      <input className="finp" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="flbl">Patient ID</label>
                    <div className="fwrap">
                      <span className="fico">🪪</span>
                      <input className="finp" type="text" placeholder="PAT-XXXX" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="flbl">Email</label>
                    <div className="fwrap">
                      <span className="fico">📧</span>
                      <input className="finp" type="email" placeholder="patient@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="flbl">Password</label>
                    <div className="fwrap">
                      <span className="fico">🔒</span>
                      <input className="finp" type={showPw ? "text" : "password"} placeholder="••••••••" value={form.pw} onChange={e => { setForm({ ...form, pw: e.target.value }); setPwErrorMsg(""); }} style={{ borderColor: pwErrorMsg ? "rgba(255,80,80,.5)" : undefined, boxShadow: pwErrorMsg ? "0 0 0 2px rgba(255,80,80,.2)" : undefined }} />
                      <button className="ptoggle" onClick={() => setShowPw(!showPw)}>{showPw ? "🙈" : "👁️"}</button>
                    </div>
                    {pwErrorMsg && <div style={{ fontSize: ".7rem", color: "#ff6b6b", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span> {pwErrorMsg}</div>}
                  </div>
                  <div className="field">
                    <label className="flbl">Confirm Password</label>
                    <div className="fwrap"><span className="fico">🔐</span><input className="finp" type="password" placeholder="••••••••" value={form.confirmPw} onChange={e => setForm({ ...form, confirmPw: e.target.value })} /></div>
                  </div>
                  <button className="sbtn" onClick={handleSignup}>
                    <div className="shimmer" />
                    {loading ? <div className="dots"><span /><span /><span /></div> : "Create Account"}
                  </button>
                  <div className="switch-row" style={{ marginTop: ".9rem" }}>
                    Already have an account?<span className="switch-link" onClick={goLogin}> Sign In</span>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
