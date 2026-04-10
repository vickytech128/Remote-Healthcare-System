import { useState } from "react";
import { useNavigate } from "react-router-dom";


const NAV_ITEMS = [
    { icon: "📊", label: "Dashboard", key: "dashboard", path: "/dashboard" },
    { icon: "❤️", label: "Vitals", key: "vitals", path: "/vitals" },
    { icon: "🔔", label: "Alerts", key: "alerts", path: "/alerts" },
    { icon: "💊", label: "Medications", key: "meds", path: "/medication" },
    { icon: "📋", label: "Reports", key: "reports", path: "/reports" },
    { icon: "✨", label: "AI Chat", key: "chat", path: "/jarvis-chat" },
    { icon: "✉️", label: "Messages", key: "messages", path: "/messages" },
    { icon: "⚙️", label: "Settings", key: "settings", path: "/settings" },
];

export default function Sidebar({ active }) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [clickedItem, setClickedItem] = useState({ key: null, x: 0, y: 0 });

    const handleNavClick = (e, path, key) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setClickedItem({ key, x, y });
        setTimeout(() => {
            navigate(path);
        }, 350); 
    };

    return (
        <>
            <style>{`
        .sidebar{width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:1rem .5rem;background:rgba(5,12,28,.95);border-right:1px solid rgba(255,255,255,.06);gap:4px;z-index:20;transition:width .3s cubic-bezier(.16,1,.3,1);overflow:hidden}
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
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
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
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}
        
        /* NAV CLICK ANIMATIONS */
        .sb-item{position:relative;overflow:hidden}
        .sb-item.clicked{animation:navBounce .4s cubic-bezier(.36,.07,.19,.97) both}
        .sb-item.clicked.active{animation:navBounceActive .4s cubic-bezier(.36,.07,.19,.97) both}
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
        .sb-item.clicked .sb-item-icon{animation:iconPop .4s cubic-bezier(.36,.07,.19,.97) both}
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
          animation:navRipple .5s ease-out forwards;
          pointer-events:none;
        }
        .sb-item.active .sb-ripple{background:rgba(0,200,255,.35)}
        @keyframes navRipple{
          0%{width:0;height:0;opacity:.9}
          100%{width:90px;height:90px;opacity:0}
        }
      `}</style>

            <div className={`sidebar${expanded ? " expanded" : ""}`}>

                {}
                <div className="sb-profile">
                    <div className="sb-avatar">👤</div>
                    <div className="sb-profile-info">
                        <span className="sb-name">Alex Johnson</span>
                        <span className="sb-role">Patient · ID: PAT-0042</span>
                    </div>
                </div>

                {}
                <button className="sb-toggle" onClick={() => setExpanded(e => !e)}>
                    {!expanded ? (
                        <div className="sb-toggle-lines">
                            <span className="sb-toggle-line" />
                            <span className="sb-toggle-line" />
                            <span className="sb-toggle-line" />
                        </div>
                    ) : <span style={{ fontSize: ".9rem", fontWeight: 700, color: "rgba(255,255,255,.5)" }}>←</span>}
                </button>

                {}
                <div className="sb-nav">
                    {NAV_ITEMS.map(({ icon, label, key, path }) => {
                        const isClicked = clickedItem.key === key;
                        return (
                            <button
                                key={key}
                                className={`sb-item${active === key ? " active" : ""}${isClicked ? " clicked" : ""}`}
                                onClick={(e) => handleNavClick(e, path, key)}
                            >
                                <span className="sb-item-icon">{icon}</span>
                                <span className="sb-item-label">{label}</span>
                                <span className="sb-active-bar" />
                                {isClicked && (
                                    <span className="sb-ripple" style={{ left: clickedItem.x, top: clickedItem.y }} />
                                )}
                            </button>
                        );
                    })}
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
        </>
    );
}
