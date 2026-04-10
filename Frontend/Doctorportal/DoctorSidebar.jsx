import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    { icon: "⚕",   label: "Dashboard",     key: "dashboard",     path: "/doctor-dashboard"     },
    { icon: "👥",  label: "My Patients",   key: "patients",      path: "/doctor-patients"      },
    { icon: "📅",  label: "Appointments",  key: "appointments",  path: "/doctor-appointments"  },
    { icon: "📋",  label: "Reports",       key: "reports",       path: "/doctor-reports"       },
    { icon: "💊",  label: "Prescriptions", key: "prescriptions", path: "/doctor-prescriptions" },
    { icon: "📈",  label: "Analytics",     key: "analytics",     path: "/doctor-analytics"     },
    { icon: "💬",  label: "Messages",      key: "messages",      path: "/doctor-messages"      },
    { icon: "✨",  label: "AI Chat",       key: "chat",          path: "/doctor-chat"          },
    { icon: "⚙️", label: "Settings",      key: "settings",      path: "/doctor-settings"      },
];

const DOCTOR = {
    name: "Dr. Sarah Mitchell",
    initials: "SM",
    specialty: "Endocrinology",
};

export default function DoctorSidebar({ active }) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(true);
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
        .sidebar{width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:1rem .5rem;background:rgba(6,3,15,.97);border-right:1px solid rgba(168,85,247,.12);gap:4px;z-index:20;transition:width .32s cubic-bezier(.16,1,.3,1);overflow:hidden;position:relative}
        .sidebar.expanded{width:222px;align-items:flex-start;padding:1rem .8rem}
        
        .sb-profile{display:flex;align-items:center;gap:11px;padding:10px 8px;border-radius:13px;background:rgba(147,51,234,.08);border:1px solid rgba(168,85,247,.18);margin-bottom:.8rem;width:100%;cursor:pointer;transition:background .2s;flex-shrink:0}
        .sb-profile:hover{background:rgba(147,51,234,.14)}
        .sb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#5b21b6,#a855f7);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;flex-shrink:0;border:2px solid rgba(168,85,247,.4);animation:hb 3s ease-in-out infinite;box-shadow:0 0 14px rgba(168,85,247,.3)}
        
        .sb-profile-info{display:none;flex-direction:column;min-width:0}
        .sidebar.expanded .sb-profile-info{display:flex}
        .sb-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-role{font-size:.62rem;color:rgba(192,132,252,.65);margin-top:1px}
        
        .sb-toggle{width:100%;display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);cursor:pointer;color:rgba(255,255,255,.42);transition:all .2s;margin-bottom:.5rem;flex-shrink:0;border:none;outline:none}
        .sb-toggle:hover{background:rgba(255,255,255,.07);color:#fff}
        .sb-toggle-lines{display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}
        
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.35);width:100%;white-space:nowrap;overflow:hidden;position:relative}
        .sb-item:hover{background:rgba(255,255,255,.045);color:rgba(255,255,255,.72)}
        .sb-item.active{background:rgba(147,51,234,.13);border:1px solid rgba(168,85,247,.25);color:#a855f7}
        
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.expanded .sb-item-label{display:block}
        
        .sb-active-bar{width:3px;height:16px;border-radius:99px;background:#a855f7;box-shadow:0 0 8px #a855f7;margin-left:auto;flex-shrink:0;display:none}
        .sb-item.active .sb-active-bar{display:block}
        
        .sb-divider{width:100%;height:1px;background:rgba(255,255,255,.06);margin:.4rem 0;flex-shrink:0}
        
        .sb-bottom{display:flex;flex-direction:column;gap:4px;width:100%;flex-shrink:0}
        .sb-logout{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:11px;border:1px solid rgba(255,80,80,.12);cursor:pointer;background:rgba(255,80,80,.04);transition:all .2s;color:rgba(255,100,100,.6);width:100%;white-space:nowrap;overflow:hidden;border:none;outline:none}
        .sb-logout:hover{background:rgba(255,80,80,.1);color:#f87171;border-color:rgba(255,80,80,.26)}
        .sidebar.expanded .sb-logout{justify-content:flex-start}
        .sb-logout-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.expanded .sb-logout-label{display:block}
        
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}
        
        /* NAV CLICK ANIMATIONS */
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
          45%{transform:scale(1.07);box-shadow:0 0 0 5px rgba(168,85,247,.2)}
          72%{transform:scale(.98);box-shadow:0 0 0 10px rgba(168,85,247,0)}
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
          background:rgba(168,85,247,.28);
          width:0;height:0;
          transform:translate(-50%,-50%);
          animation:navRipple .5s ease-out forwards;
          pointer-events:none;
        }
        .sb-item.active .sb-ripple{background:rgba(168,85,247,.35)}
        @keyframes navRipple{
          0%{width:0;height:0;opacity:.9}
          100%{width:90px;height:90px;opacity:0}
        }
      `}</style>

            <div className={`sidebar${expanded ? " expanded" : ""}`}>
                <div style={{ position: "absolute", top: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(150,40,255,.14),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

                {}
                <div className="sb-profile" style={{ position: "relative", zIndex: 1 }}>
                    <div className="sb-avatar">{DOCTOR.initials}</div>
                    <div className="sb-profile-info">
                        <span className="sb-name">{DOCTOR.name}</span>
                        <span className="sb-role">{DOCTOR.specialty} · MCI Reg.</span>
                    </div>
                </div>

                {}
                <button className="sb-toggle" onClick={() => setExpanded(e => !e)} style={{ position: "relative", zIndex: 1 }}>
                    {!expanded ? (
                        <div className="sb-toggle-lines">
                            <span className="sb-toggle-line" />
                            <span className="sb-toggle-line" />
                            <span className="sb-toggle-line" />
                        </div>
                    ) : <span style={{ fontSize: ".9rem", fontWeight: 700, color: "rgba(255,255,255,.5)" }}>←</span>}
                </button>

                {}
                <div className="sb-nav" style={{ position: "relative", zIndex: 1 }}>
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
                <div className="sb-bottom" style={{ position: "relative", zIndex: 1 }}>
                    <button className="sb-logout" onClick={() => navigate("/doctor-logout")}>
                        <span className="sb-item-icon">🚪</span>
                        <span className="sb-logout-label">Log Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
