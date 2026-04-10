import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";



const PATIENT = {
  name: "Alex Johnson",
  id: "PAT-0042",
  doctor: "Dr. Sarah Mitchell",
};


const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.8 + .5,
      alpha: Math.random() * .4 + .1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${d.alpha})`;
        ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,200,255,${.08 * (1 - dist / 100)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
};


export default function LogoutPage({ onLogout, onStay }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("confirm"); 
  const [progress, setProgress] = useState(0);

  
  const navigateToLogin = () => {
    if (typeof onLogout === "function") { onLogout(); return; }
    navigate("/");
  };

  const handleConfirm = () => {
    setStep("loading");
    
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setProgress(100);
        setTimeout(() => {
          setStep("done");
          setTimeout(navigateToLogin, 900);
        }, 350);
      }
      setProgress(Math.min(p, 100));
    }, 100);
  };

  const handleStay = () => {
    if (typeof onStay === "function") { onStay(); return; }
    navigate(-1);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn   { from{opacity:0}                     to{opacity:1} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,107,.4)} 60%{box-shadow:0 0 0 14px rgba(255,107,107,0)} }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-20deg);opacity:0} 70%{transform:scale(1.18) rotate(4deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes slideBar { from{width:0} to{width:var(--pw)} }
        @keyframes glowPulse{ 0%,100%{opacity:.7} 50%{opacity:1} }

        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0 }
        html,body,#root { height:100%; font-family:'DM Sans',sans-serif; background:#050f1f }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-thumb { background:rgba(0,200,255,.2); border-radius:99px }
      `}</style>

      {}
      <div style={{
        position: "fixed", inset: 0, background: "#050f1f",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", zIndex: 10, animation: "fadeIn .4s both",
      }}>
        <ParticleCanvas />

        {}
        <div style={{ position: "fixed", top: "15%", left: "20%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,80,80,.07),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "20%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,100,255,.08),transparent 70%)", pointerEvents: "none" }} />

        {}
        {step === "confirm" && (
          <div style={{
            position: "relative", zIndex: 2, width: "100%", maxWidth: 440,
            background: "linear-gradient(160deg,#0c1d34,#08121f)",
            border: "1px solid rgba(255,255,255,.08)", borderRadius: 24,
            overflow: "hidden", animation: "scaleIn .35s cubic-bezier(.16,1,.3,1) both",
            boxShadow: "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04)",
          }}>

            {}
            <div style={{ height: 3, background: "linear-gradient(90deg,transparent,#ff6b6b,#fbbf24,transparent)" }} />

            {}
            <div style={{ padding: "2rem 2rem 1.6rem" }}>

              {}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.4rem" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(255,107,107,.1)", border: "2px solid rgba(255,107,107,.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", animation: "pulse 2s ease-in-out infinite",
                }}>🚪</div>
              </div>

              {}
              <div style={{ textAlign: "center", marginBottom: "1.6rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                  Log Out?
                </div>
                <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.42)", lineHeight: 1.7 }}>
                  You're about to sign out of the<br />
                  <span style={{ color: "rgba(0,200,255,.8)", fontWeight: 600 }}>City General Hospital</span> patient portal.
                </div>
              </div>

              {/* patient info chip */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 14,
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
                marginBottom: "1.6rem",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg,#0066ff,#00c8ff)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", border: "2px solid rgba(0,200,255,.3)",
                }}>👤</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 800, color: "#fff" }}>{PATIENT.name}</div>
                  <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.3)", marginTop: 1 }}>
                    {PATIENT.id} · {PATIENT.doctor}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 50, background: "rgba(0,255,157,.07)", border: "1px solid rgba(0,255,157,.2)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 6px #00ff9d", animation: "blink 1.2s step-start infinite" }} />
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "#00ff9d", letterSpacing: ".05em" }}>ACTIVE</span>
                </div>
              </div>

              {/* warning note */}
              <div style={{
                display: "flex", gap: 9, alignItems: "flex-start",
                padding: "10px 13px", borderRadius: 11,
                background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.15)",
                marginBottom: "1.6rem",
              }}>
                <span style={{ fontSize: ".9rem", flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.42)", lineHeight: 1.65 }}>
                  Any unsaved changes will be lost. You'll need to log in again to access your health records.
                </div>
              </div>

              {}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleStay}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 12,
                    background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.6)", cursor: "pointer",
                    fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700,
                    letterSpacing: ".04em", transition: "all .2s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,.09)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "rgba(255,255,255,.6)"; }}
                >
                  ← Stay
                </button>
                <button
                  onClick={handleConfirm}
                  style={{
                    flex: 2, padding: "12px", borderRadius: 12,
                    background: "linear-gradient(135deg,rgba(220,38,38,.5),rgba(255,107,107,.35))",
                    border: "1px solid rgba(255,107,107,.4)",
                    color: "#fff", cursor: "pointer",
                    fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700,
                    letterSpacing: ".04em", transition: "all .2s",
                    boxShadow: "0 4px 20px rgba(255,107,107,.2)",
                  }}
                  onMouseOver={e => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(255,107,107,.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseOut={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,107,107,.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Yes, Log Me Out 🚪
                </button>
              </div>

            </div>
          </div>
        )}

        {}
        {step === "loading" && (
          <div style={{
            position: "relative", zIndex: 2, width: "100%", maxWidth: 400,
            textAlign: "center", animation: "fadeUp .3s both",
          }}>
            {}
            <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 1.8rem" }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "3px solid rgba(255,107,107,.1)",
              }} />
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#ff6b6b",
                animation: "spin .9s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: 8, borderRadius: "50%",
                background: "rgba(255,107,107,.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem",
              }}>🚪</div>
            </div>

            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              Signing you out…
            </div>
            <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.35)", marginBottom: "1.8rem" }}>
              Clearing session data securely
            </div>

            {}
            <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,.07)", overflow: "hidden", maxWidth: 260, margin: "0 auto" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg,#ff6b6b,#fbbf24)",
                width: `${progress}%`,
                transition: "width .12s ease-out",
                boxShadow: "0 0 10px rgba(255,107,107,.6)",
              }} />
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".62rem", fontWeight: 700, color: "rgba(255,107,107,.6)", marginTop: 8 }}>
              {Math.round(progress)}%
            </div>

            {}
            <div style={{ marginTop: "1.6rem", display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-start", maxWidth: 240, margin: "1.6rem auto 0" }}>
              {[
                { label: "Saving preferences", threshold: 20 },
                { label: "Revoking session tokens", threshold: 55 },
                { label: "Clearing secure cache", threshold: 80 },
                { label: "Redirecting to login", threshold: 98 },
              ].map(({ label, threshold }) => {
                const done = progress >= threshold;
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      background: done ? "rgba(0,255,157,.15)" : "rgba(255,255,255,.05)",
                      border: done ? "1px solid rgba(0,255,157,.35)" : "1px solid rgba(255,255,255,.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: ".55rem", transition: "all .3s",
                    }}>
                      {done ? "✓" : "·"}
                    </div>
                    <span style={{ fontSize: ".68rem", color: done ? "rgba(255,255,255,.65)" : "rgba(255,255,255,.22)", transition: "color .3s" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {}
        {step === "done" && (
          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            animation: "fadeUp .35s both",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 1.4rem",
              background: "rgba(0,255,157,.1)", border: "2px solid rgba(0,255,157,.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.2rem", animation: "checkPop .5s cubic-bezier(.16,1,.3,1) both",
              boxShadow: "0 0 30px rgba(0,255,157,.2)",
            }}>✅</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              Logged Out Successfully
            </div>
            <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.35)" }}>
              Redirecting to login…
            </div>
          </div>
        )}

      </div>
    </>
  );
}
