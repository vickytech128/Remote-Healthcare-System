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
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,255,${d.alpha})`; ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,180,255,${.08 * (1 - dist / 100)})`;
          ctx.lineWidth = .6; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
};

export default function PatientDeleteAccount() {
  const navigate = useNavigate();
  const [step, setStep] = useState("confirm"); 
  const [progress, setProgress] = useState(0);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    if (confirmText !== "DELETE") return;
    setStep("deleting");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setProgress(100);
        setTimeout(() => {
          setStep("done");
          setTimeout(() => navigate("/"), 2000);
        }, 500);
      }
      setProgress(Math.min(p, 100));
    }, 150);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0 }
        body { background:#050f1f; color:#fff; font-family:'DM Sans',sans-serif; overflow:hidden }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, background: "#050f1f",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", zIndex: 1000, animation: "fadeIn .5s ease-out both"
      }}>
        <ParticleCanvas />

        {}
        <div style={{ position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle,rgba(220,38,38,.08),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle,rgba(0,180,255,.08),transparent 70%)", pointerEvents: "none" }} />

        {step === "confirm" && (
          <div style={{
            position: "relative", zIndex: 2, width: "100%", maxWidth: 460,
            background: "linear-gradient(165deg,#0c1d34,#08121f)",
            border: "1px solid rgba(220,38,38,.2)", borderRadius: 28,
            overflow: "hidden", animation: "scaleIn .4s cubic-bezier(.16,1,.3,1) both",
            boxShadow: "0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.03)",
          }}>
            <div style={{ height: 4, background: "linear-gradient(90deg,transparent,#dc2626,#ef4444,transparent)" }} />
            
            <div style={{ padding: "2.5rem 2rem" }}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%", margin: "0 auto 1.5rem",
                  background: "rgba(220,38,38,.1)", border: "2px solid rgba(220,38,38,.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.5rem", color: "#ef4444"
                }}>🚫</div>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.5rem" }}>Delete My Account</h1>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,.4)", lineHeight: 1.6 }}>
                  Closing your account will remove all your medical records, appointment history, and reports. This cannot be undone.
                </p>
              </div>

              {}
              <div style={{
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 16, padding: "1rem", marginBottom: "1.5rem",
                display: "flex", alignItems: "center", gap: "12px"
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#0066ff,#00c8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>👤</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{PATIENT.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.3)" }}>{PATIENT.id} • {PATIENT.doctor}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,.4)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Type <span style={{ color: "#ef4444", fontWeight: 700 }}>DELETE</span> to confirm
                </label>
                <input 
                  type="text" 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Final confirmation..."
                  style={{
                    width: "100%", background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: "0.9rem",
                    outline: "none", transition: "border .2s", textAlign: "center"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  onClick={() => navigate(-1)}
                  style={{ flex: 1, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem" }}>
                  Go Back
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={confirmText !== "DELETE"}
                  style={{ 
                    flex: 2, padding: "12px", borderRadius: 12, 
                    background: confirmText === "DELETE" ? "#dc2626" : "rgba(220,38,38,.2)", 
                    border: "none", color: "#fff", cursor: confirmText === "DELETE" ? "pointer" : "not-allowed", 
                    fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem",
                    transition: "all .3s"
                  }}>
                  Erase Data 🗑️
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "deleting" && (
          <div style={{ textAlign: "center", width: "100%", maxWidth: 400, position: "relative", zIndex: 2 }}>
            <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 2rem" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid rgba(220,38,38,.1)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid transparent", borderTopColor: "#ef4444", animation: "spin .7s linear infinite" }} />
              <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: "rgba(220,38,38,.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🗑️</div>
            </div>

            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>Deleting Account</h2>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,107,107,.6)", marginBottom: "2rem", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              SHREDDING PATIENT_DATA_0042.LOG
            </p>

            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,.05)", borderRadius: 10, overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#dc2626,#ef4444)", transition: "width .2s ease-out" }} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start", maxWidth: 280, margin: "2rem auto 0" }}>
              {[
                { label: "Revoking health record access", t: 20 },
                { label: "Wiping appointment history", t: 45 },
                { label: "Deleting secure messages", t: 75 },
                { label: "Cleaning database entries", t: 98 },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "10px", opacity: progress >= s.t ? 1 : 0.3 }}>
                   <div style={{ width: 6, height: 6, borderRadius: "50%", background: progress >= s.t ? "#ef4444" : "#fff" }} />
                   <span style={{ fontSize: "0.75rem", color: progress >= s.t ? "#fff" : "rgba(255,255,255,.3)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", animation: "scaleIn .5s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%", margin: "0 auto 2rem",
              background: "rgba(220,38,38,.1)", border: "2px solid rgba(220,38,38,.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "3rem"
            }}>✅</div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>Data Erased</h1>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,.4)" }}>Your account has been permanently deleted.</p>
          </div>
        )}
      </div>
    </>
  );
}
