import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";



const Toggle = ({ on, onChange, color = "#00c8ff" }) => (
  <div onClick={() => onChange(!on)} style={{ width: 40, height: 22, borderRadius: 99, background: on ? color : "rgba(255,255,255,.1)", border: `1px solid ${on ? color : "rgba(255,255,255,.15)"}`, cursor: "pointer", position: "relative", transition: "all .25s", flexShrink: 0, boxShadow: on ? `0 0 10px ${color}55` : "none" }}>
    <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: on ? "#fff" : "rgba(255,255,255,.4)", transition: "left .25s", boxShadow: on ? `0 0 6px ${color}` : "none" }} />
  </div>
);


const NumInput = ({ value, onChange, min, max, unit, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: ".8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
    <div style={{ minWidth: 48, textAlign: "center", fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 700, color, padding: "2px 8px", borderRadius: 7, background: `${color}12`, border: `1px solid ${color}28` }}>{value}<span style={{ fontSize: ".6rem", color: "rgba(255,255,255,.35)", fontWeight: 400, marginLeft: 2 }}>{unit}</span></div>
    <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: ".8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
  </div>
);


const AlertLogItem = ({ icon, title, desc, time, color, severity, unread }) => (
  <div style={{ display: "flex", gap: 12, padding: "11px 14px", borderRadius: 12, background: unread ? `${color}08` : "rgba(255,255,255,.02)", border: `1px solid ${unread ? color + "28" : "rgba(255,255,255,.05)"}`, marginBottom: 6, position: "relative" }}>
    {unread && <div style={{ position: "absolute", top: 10, right: 12, width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />}
    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: "#fff" }}>{title}</span>
        <span style={{ padding: "1px 7px", borderRadius: 50, background: `${color}15`, color, border: `1px solid ${color}28`, fontSize: ".58rem", fontWeight: 700 }}>{severity}</span>
      </div>
      <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", lineHeight: 1.4 }}>{desc}</div>
    </div>
    <div style={{ flexShrink: 0, textAlign: "right" }}>
      <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.25)" }}>{time}</div>
    </div>
  </div>
);


const SectionHd = ({ icon, title, count, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: ".7rem", marginTop: ".3rem" }}>
    <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{icon}</div>
    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 800, color: "#fff" }}>{title}</span>
    {count !== undefined && <span style={{ padding: "2px 8px", borderRadius: 50, background: `${color}18`, color, border: `1px solid ${color}28`, fontSize: ".6rem", fontWeight: 700 }}>{count} types</span>}
  </div>
);


const AlertRow = ({ cfg, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 13, background: cfg.enabled ? `${cfg.color}06` : "rgba(255,255,255,.02)", border: `1px solid ${cfg.enabled ? cfg.color + "22" : "rgba(255,255,255,.06)"}`, marginBottom: 6, overflow: "hidden", transition: "all .2s" }}>
      {}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cfg.color}18`, border: `1px solid ${cfg.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0, opacity: cfg.enabled ? 1 : .4 }}>{cfg.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 1 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: cfg.enabled ? "#fff" : "rgba(255,255,255,.4)" }}>{cfg.label}</span>
            <span style={{ padding: "1px 7px", borderRadius: 50, background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}20`, fontSize: ".57rem", fontWeight: 700 }}>{cfg.category}</span>
          </div>
          <div style={{ fontSize: ".66rem", color: "rgba(255,255,255,.3)" }}>{cfg.desc}</div>
        </div>
        {}
        {cfg.threshold && (
          <div style={{ textAlign: "center", flexShrink: 0, marginRight: 8 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: cfg.color }}>{cfg.threshold.low}–{cfg.threshold.high} <span style={{ fontSize: ".58rem", color: "rgba(255,255,255,.3)" }}>{cfg.threshold.unit}</span></div>
            <div style={{ fontSize: ".55rem", color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".07em" }}>threshold</div>
          </div>
        )}
        <Toggle on={cfg.enabled} onChange={v => onChange({ ...cfg, enabled: v })} color={cfg.color} />
        <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.2)", marginLeft: 2, transition: "transform .2s", display: "inline-block", transform: open ? "rotate(90deg)" : "none" }}>▶</span>
      </div>

      {}
      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(255,255,255,.05)", marginTop: 2, animation: "fadeUp .2s both" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            {}
            {cfg.threshold && (
              <>
                <div>
                  <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Low Threshold</div>
                  <NumInput value={cfg.threshold.low} min={cfg.threshold.minLow} max={cfg.threshold.maxLow} unit={cfg.threshold.unit} color={cfg.color}
                    onChange={v => onChange({ ...cfg, threshold: { ...cfg.threshold, low: v } })} />
                </div>
                <div>
                  <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>High Threshold</div>
                  <NumInput value={cfg.threshold.high} min={cfg.threshold.minHigh} max={cfg.threshold.maxHigh} unit={cfg.threshold.unit} color={cfg.color}
                    onChange={v => onChange({ ...cfg, threshold: { ...cfg.threshold, high: v } })} />
                </div>
              </>
            )}
            {}
            <div>
              <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Notify via</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["App", "WhatsApp", "SMS", "Doctor"].map(ch => (
                  <button key={ch} onClick={() => { const nc = cfg.notifyChannels.includes(ch) ? cfg.notifyChannels.filter(x => x !== ch) : [...cfg.notifyChannels, ch]; onChange({ ...cfg, notifyChannels: nc }); }}
                    style={{ padding: "3px 10px", borderRadius: 50, background: cfg.notifyChannels.includes(ch) ? `${cfg.color}20` : "rgba(255,255,255,.05)", border: `1px solid ${cfg.notifyChannels.includes(ch) ? cfg.color + "40" : "rgba(255,255,255,.1)"}`, color: cfg.notifyChannels.includes(ch) ? cfg.color : "rgba(255,255,255,.35)", fontSize: ".62rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>{ch}</button>
                ))}
              </div>
            </div>
            {}
            <div>
              <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Alert Severity</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["Low", "#00ff9d"], ["Medium", "#ffd93d"], ["High", "#ff6b6b"]].map(([sev, sc]) => (
                  <button key={sev} onClick={() => onChange({ ...cfg, severity: sev })}
                    style={{ padding: "3px 10px", borderRadius: 50, background: cfg.severity === sev ? `${sc}20` : "rgba(255,255,255,.05)", border: `1px solid ${cfg.severity === sev ? sc + "40" : "rgba(255,255,255,.1)"}`, color: cfg.severity === sev ? sc : "rgba(255,255,255,.35)", fontSize: ".62rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>{sev}</button>
                ))}
              </div>
            </div>
          </div>
          {}
          <div style={{ marginTop: "1rem", padding: "8px 12px", borderRadius: 9, background: "rgba(255,255,255,.03)", fontSize: ".66rem", color: "rgba(255,255,255,.35)", lineHeight: 1.6 }}>
            💡 <span style={{ color: cfg.color }}>{cfg.tip}</span>
          </div>
        </div>
      )}
    </div>
  );
};

import { useNavigate } from "react-router-dom";
import { fetchAlerts, fetchAlertSettings, markAlertRead as apiMarkRead, markAllRead as apiMarkAllRead, saveAlertSettings, toggleGlobalAlerts } from "../src/api/alertsApi.js";


export default function AlertsPage() {
  const navigate = useNavigate();
  const [expanded, setSbExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [time, setTime] = useState(new Date());
  const [globalAlerts, setGlobalAlerts] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [navClicked, setNavClicked] = useState(null);
  const handleNavClick = (key) => {
    setNavClicked(key);
    setTimeout(() => {
      setNavClicked(null);
      if (key === "dashboard") navigate("/dashboard");
      if (key === "vitals") navigate("/vitals");
      if (key === "alerts") navigate("/alerts");
    }, 600);
  };
  const [showUnread, setShowUnread] = useState(false);
  const [logItems, setLogItems] = useState([
    { icon: "⚠️", title: "Elevated Heart Rate", desc: "HR reached 82 BPM during rest at 2:14 PM. No movement detected.", time: "2h ago", color: "#fbbf24", severity: "Medium", unread: true },
    { icon: "💊", title: "Missed Dose — Metoprolol", desc: "Metoprolol 25mg was due at 1:00 PM. 35 minutes overdue.", time: "1h ago", color: "#fbbf24", severity: "Medium", unread: true },
    { icon: "✅", title: "Daily Step Goal Reached", desc: "You hit 8,000 steps at 3:47 PM. Great work today!", time: "3h ago", color: "#00ff9d", severity: "Good", unread: false },
    { icon: "🩺", title: "Doctor Review Complete", desc: "Dr. Priya reviewed your weekly ECG. No abnormalities noted.", time: "4h ago", color: "#a78bfa", severity: "Info", unread: false },
    { icon: "📋", title: "Weekly Report Ready", desc: "Your health summary for Mar 02–08 is ready to download.", time: "Yesterday", color: "#00c8ff", severity: "Info", unread: false },
    { icon: "❤️", title: "Irregular HR Pattern — Resolved", desc: "Brief irregular RR intervals detected at 11:20 PM. Resolved within 2 minutes.", time: "2 days ago", color: "#ff6b6b", severity: "High", unread: false },
    { icon: "🔋", title: "Device Low Battery", desc: "ESP32 wearable at 18% battery. Please charge to continue monitoring.", time: "2 days ago", color: "#ffd93d", severity: "Low", unread: false },
    { icon: "💉", title: "Elevated BP Noted", desc: "Systolic reading of 126 mmHg at 7:30 AM. Slightly above optimal range.", time: "3 days ago", color: "#a78bfa", severity: "Medium", unread: false },
  ]);

  
  const [alerts, setAlerts] = useState([
    
    { id: "hr_high", icon: "❤️", label: "High Heart Rate", category: "Cardiac", color: "#ff6b6b", desc: "Triggers when resting HR exceeds threshold. Indicates stress, arrhythmia, or fever.", enabled: true, severity: "High", notifyChannels: ["App", "WhatsApp", "Doctor"], tip: "Persistent high HR above 100 BPM at rest may indicate tachycardia. Doctor will be notified immediately.", threshold: { low: 60, high: 100, unit: "BPM", minLow: 40, maxLow: 80, minHigh: 80, maxHigh: 180 } },
    { id: "hr_low", icon: "💔", label: "Low Heart Rate", category: "Cardiac", color: "#f472b6", desc: "Triggers when resting HR drops below threshold. May indicate bradycardia.", enabled: true, severity: "High", notifyChannels: ["App", "Doctor"], tip: "HR below 50 BPM at rest in non-athletes can be dangerous. Seek medical attention if symptomatic.", threshold: { low: 50, high: 100, unit: "BPM", minLow: 30, maxLow: 60, minHigh: 60, maxHigh: 100 } },
    { id: "hr_spike", icon: "📈", label: "Sudden HR Spike", category: "Cardiac", color: "#fbbf24", desc: "AI detects a rapid rise of >20 BPM in under 30 seconds without movement.", enabled: true, severity: "High", notifyChannels: ["App", "WhatsApp", "Doctor"], tip: "Sudden spikes may indicate panic attack, SVT or severe stress. AI monitors rate-of-change continuously.", threshold: undefined },
    { id: "hr_irreg", icon: "〰️", label: "Irregular Heartbeat", category: "Cardiac", color: "#ff6b6b", desc: "AI pattern-matches ECG signal to detect irregular RR intervals.", enabled: true, severity: "High", notifyChannels: ["App", "Doctor"], tip: "Irregular rhythms like AFib have high stroke risk. Always alert the assigned doctor when triggered.", threshold: undefined },
    { id: "ecg_st", icon: "🫀", label: "ECG ST Elevation", category: "Cardiac", color: "#ff4444", desc: "Detects ST segment elevation in real-time ECG — potential myocardial infarction sign.", enabled: true, severity: "High", notifyChannels: ["App", "WhatsApp", "SMS", "Doctor"], tip: "ST elevation is a critical cardiac emergency. This alert bypasses all mute settings and calls the doctor.", threshold: undefined },
    { id: "ecg_qtlong", icon: "📉", label: "Prolonged QT Interval", category: "Cardiac", color: "#fbbf24", desc: "Flags QT interval >440ms which can predict dangerous ventricular arrhythmias.", enabled: true, severity: "Medium", notifyChannels: ["App", "Doctor"], tip: "Long QT can be drug-induced or congenital. Medication review may be required.", threshold: undefined },

    
    { id: "spo2_low", icon: "🩸", label: "Low SpO₂", category: "Respiratory", color: "#00c8ff", desc: "Triggers when blood oxygen drops below threshold. Risk of hypoxia.", enabled: true, severity: "High", notifyChannels: ["App", "WhatsApp", "Doctor"], tip: "SpO₂ below 94% is clinically concerning. Below 90% is an emergency. Ensure sensor is properly fitted.", threshold: { low: 94, high: 100, unit: "%", minLow: 80, maxLow: 96, minHigh: 97, maxHigh: 100 } },
    { id: "spo2_drop", icon: "📉", label: "Rapid SpO₂ Drop", category: "Respiratory", color: "#00c8ff", desc: "AI detects drop of >3% in SpO₂ within 60 seconds.", enabled: true, severity: "High", notifyChannels: ["App", "Doctor"], tip: "Rapid desaturation may indicate respiratory distress, mucus plugging, or worsening asthma.", threshold: undefined },
    { id: "apnea", icon: "😴", label: "Sleep Apnea Detected", category: "Respiratory", color: "#a78bfa", desc: "AI detects prolonged breathing pauses during sleep via HR pattern analysis.", enabled: true, severity: "Medium", notifyChannels: ["App"], tip: "Sleep apnea episodes >10 seconds are flagged. Frequent episodes should be reported to your doctor.", threshold: undefined },

    
    { id: "temp_high", icon: "🌡️", label: "High Temperature / Fever", category: "Temperature", color: "#ffd93d", desc: "Triggers when body temperature exceeds fever threshold.", enabled: true, severity: "Medium", notifyChannels: ["App", "WhatsApp"], tip: "Fever above 38.5°C requires medical assessment. Above 40°C is a critical emergency.", threshold: { low: 36.0, high: 38.5, unit: "°C", minLow: 34, maxLow: 37, minHigh: 37, maxHigh: 41 } },
    { id: "temp_low", icon: "🥶", label: "Hypothermia Warning", category: "Temperature", color: "#00c8ff", desc: "Triggers when temperature drops below normal range.", enabled: true, severity: "Medium", notifyChannels: ["App", "Doctor"], tip: "Body temp below 35°C is clinical hypothermia. Device may detect peripheral cooling first.", threshold: { low: 35.0, high: 37.5, unit: "°C", minLow: 32, maxLow: 36, minHigh: 36, maxHigh: 39 } },

    
    { id: "bp_high", icon: "💉", label: "Hypertension Alert", category: "BP", color: "#a78bfa", desc: "Triggers when systolic BP exceeds threshold consistently.", enabled: true, severity: "Medium", notifyChannels: ["App", "WhatsApp"], tip: "Sustained systolic >140 mmHg is Stage 2 hypertension. Lifestyle changes and medication review needed.", threshold: { low: 90, high: 140, unit: "mmHg", minLow: 70, maxLow: 100, minHigh: 120, maxHigh: 180 } },
    { id: "bp_low", icon: "💊", label: "Hypotension Alert", category: "BP", color: "#f472b6", desc: "Triggers when systolic BP drops below threshold — risk of fainting.", enabled: false, severity: "Medium", notifyChannels: ["App"], tip: "Systolic below 90 mmHg may cause dizziness or fainting, especially when standing quickly.", threshold: { low: 90, high: 120, unit: "mmHg", minLow: 60, maxLow: 95, minHigh: 100, maxHigh: 140 } },
    { id: "bp_crisis", icon: "🚨", label: "Hypertensive Crisis", category: "BP", color: "#ff4444", desc: "Systolic >180 or diastolic >120 — a life-threatening emergency.", enabled: true, severity: "High", notifyChannels: ["App", "WhatsApp", "SMS", "Doctor"], tip: "This is a medical emergency. Alert cannot be disabled. Emergency contacts notified automatically.", threshold: undefined },

    
    { id: "fall", icon: "🤸", label: "Fall Detection", category: "Activity", color: "#fbbf24", desc: "AI detects sudden motion change and stillness indicating a possible fall.", enabled: true, severity: "High", notifyChannels: ["App", "WhatsApp", "Doctor"], tip: "Fall detection uses accelerometer + HR spike pattern. Response window is 30 seconds before auto-alerting doctor.", threshold: undefined },
    { id: "inactivity", icon: "🪑", label: "Prolonged Inactivity", category: "Activity", color: "#ffd93d", desc: "Alert if no movement detected for a set duration.", enabled: false, severity: "Low", notifyChannels: ["App"], tip: "Sitting too long increases DVT risk. Set a reminder every 1–2 hours.", threshold: { low: 60, high: 120, unit: "min", minLow: 30, maxLow: 90, minHigh: 60, maxHigh: 240 } },
    { id: "steps", icon: "👟", label: "Daily Step Goal", category: "Activity", color: "#00ff9d", desc: "Notifies if daily step count is below your goal by a set time.", enabled: true, severity: "Low", notifyChannels: ["App"], tip: "Step goals improve cardiovascular health. Default goal is 8,000 steps/day.", threshold: { low: 5000, high: 10000, unit: "steps", minLow: 1000, maxLow: 8000, minHigh: 5000, maxHigh: 20000 } },

    
    { id: "med_remind", icon: "💊", label: "Medication Reminder", category: "Medication", color: "#00ff9d", desc: "Timed reminder for each scheduled medication dose.", enabled: true, severity: "Low", notifyChannels: ["App", "WhatsApp"], tip: "Medication reminders sync with your prescription schedule. Snooze up to 3 times per dose.", threshold: undefined },
    { id: "med_miss", icon: "⚠️", label: "Missed Dose Alert", category: "Medication", color: "#fbbf24", desc: "Triggers when a dose is 30+ minutes overdue.", enabled: true, severity: "Medium", notifyChannels: ["App", "WhatsApp", "Doctor"], tip: "Missing doses of cardiac medications like Metoprolol can cause rebound hypertension. Doctor is notified.", threshold: undefined },

    
    { id: "dev_low", icon: "🔋", label: "Device Low Battery", category: "Device", color: "#ffd93d", desc: "Alert when ESP32 wearable battery drops below 20%.", enabled: true, severity: "Low", notifyChannels: ["App"], tip: "Charge device when prompted to avoid monitoring gaps. Battery lasts ~18 hours on full charge.", threshold: { low: 20, high: 100, unit: "%", minLow: 5, maxLow: 30, minHigh: 30, maxHigh: 100 } },
    { id: "dev_off", icon: "📡", label: "Device Disconnected", category: "Device", color: "#ff6b6b", desc: "Triggers when wearable loses Bluetooth or WiFi connection.", enabled: true, severity: "Medium", notifyChannels: ["App", "WhatsApp"], tip: "Monitoring stops when device disconnects. Reconnect within 5 minutes to avoid data gaps.", threshold: undefined },
    { id: "dev_loose", icon: "🔧", label: "Sensor Loose / Poor Signal", category: "Device", color: "#fbbf24", desc: "AI detects abnormal readings that suggest poor sensor contact.", enabled: true, severity: "Low", notifyChannels: ["App"], tip: "Dry or loose sensor contact causes false readings. Clean sensor area and reposition.", threshold: undefined },
  ]);

  useEffect(() => {
    const loadApiData = async () => {
      try {
        const [alertsRes, settingsRes] = await Promise.all([
          fetchAlerts(),
          fetchAlertSettings()
        ]);
        if (alertsRes && alertsRes.success && alertsRes.data) {
          setLogItems(alertsRes.data.map(d => ({
            ...d,
            unread: d.read === false,
            title: d.title || d.label || "Health Alert",
            desc: d.description || d.desc || "A new health event was recorded.",
            time: d.createdAt ? new Date(d.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent",
            icon: d.icon || "🚨",
            color: d.color || "#ff6b6b",
            severity: d.severity || "Medium"
          })));
        }
        if (settingsRes && settingsRes.success && settingsRes.data && settingsRes.data.length > 0) {
          setAlerts(prev => prev.map(a => {
            const backed = settingsRes.data.find(s => s.id === a.id);
            if (backed) {
              return { ...a, ...backed, threshold: { ...a.threshold, ...backed.threshold } };
            }
            return a;
          }));
        }
      } catch (err) {
        console.error("Failed to load alerts from backend", err);
      }
    };
    loadApiData();

    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const markAllRead = async () => {
    setLogItems(p => p.map(a => ({ ...a, unread: false })));
    await apiMarkAllRead();
  };

  const handleMarkSingleRead = async (a) => {
    setLogItems(p => p.map(item => item.title === a.title ? { ...item, unread: false } : item));
    if (a.id) await apiMarkRead(a.id);
  };

  const unreadItems = logItems.filter(a => a.unread);

  const updateAlert = async (updated) => {
    const newAlerts = alerts.map(a => a.id === updated.id ? updated : a);
    setAlerts(newAlerts);
    const rulesToSave = newAlerts.map(a => ({
      id: a.id,
      enabled: a.enabled,
      severity: a.severity,
      notifyChannels: a.notifyChannels,
      threshold: a.threshold
    }));
    await saveAlertSettings(rulesToSave);
  };
  const categories = [...new Set(alerts.map(a => a.category))];
  const filtered = alerts.filter(a => a.label.toLowerCase().includes(searchQ.toLowerCase()) || a.category.toLowerCase().includes(searchQ.toLowerCase()));
  const categoryColors = { Cardiac: "#ff6b6b", Respiratory: "#00c8ff", Temperature: "#ffd93d", BP: "#a78bfa", Activity: "#00ff9d", Medication: "#fbbf24", Device: "#fbbf24" };
  const categoryIcons = { Cardiac: "❤️", Respiratory: "🫁", Temperature: "🌡️", BP: "💉", Activity: "🏃", Medication: "💊", Device: "📡" };

  const tabs = [
    { key: "live", label: "Live Alerts" },
    { key: "settings", label: "Alert Settings" },
    { key: "types", label: "Alert Types Guide" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:#050f1f}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.9);opacity:0}}
        @keyframes navClick{0%{transform:scale(1)}20%{transform:scale(.88)}60%{transform:scale(1.06)}100%{transform:scale(1)}}
        @keyframes bellShake{0%,100%{transform:rotate(0)}15%{transform:rotate(-18deg)}30%{transform:rotate(16deg)}45%{transform:rotate(-12deg)}60%{transform:rotate(10deg)}75%{transform:rotate(-6deg)}90%{transform:rotate(4deg)}}
        @keyframes ripple{0%{transform:scale(0);opacity:.5}100%{transform:scale(3.5);opacity:0}}

        .ap{display:flex;height:100vh;overflow:hidden;background:#050f1f}

        /* ── SIDEBAR (identical to dashboard) ── */
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
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden;position:relative}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item.clicked{animation:navClick .5s ease-out}
        .sb-item.clicked.active{animation:navClickActive .5s ease-out}
        @keyframes navClick{0%{transform:scale(1)}20%{transform:scale(.92)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
        @keyframes navClickActive{0%{transform:scale(1);box-shadow:none}25%{transform:scale(.94)}50%{transform:scale(1.03);box-shadow:0 0 0 6px rgba(255,107,107,.18)}80%{transform:scale(1);box-shadow:0 0 0 12px rgba(255,107,107,0)}100%{transform:scale(1);box-shadow:none}}
        .sb-ripple{position:absolute;border-radius:50%;background:rgba(255,107,107,.35);animation:ripple .55s ease-out forwards;pointer-events:none}
        @keyframes ripple{0%{width:0;height:0;opacity:.8;transform:translate(-50%,-50%)}100%{width:80px;height:80px;opacity:0;transform:translate(-50%,-50%)}}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center;transition:transform .15s}
        .sb-item.clicked .sb-item-icon{animation:iconShake .4s ease-out}
        @keyframes iconShake{0%{transform:rotate(0)}20%{transform:rotate(-18deg) scale(1.2)}50%{transform:rotate(12deg) scale(1.1)}75%{transform:rotate(-6deg)}100%{transform:rotate(0) scale(1)}}
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

        /* MAIN */
        .ap-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .ap-topbar{display:flex;align-items:center;justify-content:space-between;padding:.9rem 1.8rem;background:rgba(5,15,31,.96);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;backdrop-filter:blur(10px)}
        .ap-tabs{display:flex;align-items:center;gap:4px;padding:.8rem 1.8rem .6rem;border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;background:rgba(5,15,31,.7)}
        .ap-tab{padding:7px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:.76rem;font-weight:700;letter-spacing:.04em;transition:all .2s;background:transparent;color:rgba(255,255,255,.35)}
        .ap-tab:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .ap-tab.active{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.22);color:#ff6b6b}
        .ap-content{flex:1;overflow-y:auto;padding:1.4rem 1.8rem}
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.1rem;animation:fadeUp .4s both}
        .card-hd{font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.9rem;display:flex;align-items:center;justify-content:space-between}
        @media(max-width:768px){.sidebar{display:none}.ap-content{padding:1rem}}
      `}</style>

      <div className="ap">

        <Sidebar active="alerts" />


        {}
        <div className="ap-main">

          {}
          <div className="ap-topbar">
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>Alert Center</div>
              <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.32)", marginTop: 1 }}>Alex Johnson · PAT-0042 · AI-powered health monitoring</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {}
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 14px", borderRadius: 50, background: globalAlerts ? "rgba(255,107,107,.08)" : "rgba(255,255,255,.04)", border: `1px solid ${globalAlerts ? "rgba(255,107,107,.25)" : "rgba(255,255,255,.1)"}` }}>
                <span style={{ fontSize: ".7rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: globalAlerts ? "#ff6b6b" : "rgba(255,255,255,.3)" }}>All Alerts</span>
                <Toggle on={globalAlerts} onChange={async (val) => { setGlobalAlerts(val); await toggleGlobalAlerts(val); }} color="#ff6b6b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(255,107,107,.07)", border: "1px solid rgba(255,107,107,.2)", borderRadius: 50 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff6b6b", boxShadow: "0 0 8px #ff6b6b", display: "inline-block", animation: "blink 1.2s step-start infinite" }} />
                <span style={{ fontSize: ".7rem", color: "#ff6b6b", fontWeight: 700 }}>2 Unread</span>
              </div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".95rem", fontWeight: 700, color: "#00c8ff" }}>{time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            </div>
          </div>

          {}
          <div className="ap-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`ap-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
            ))}
          </div>

          {}
          <div className="ap-content">

            {}
            {activeTab === "live" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                {}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
                  {[
                    { label: "Total Today", value: logItems.length, color: "#00c8ff", icon: "📊", onClick: undefined },
                    { label: "High Severity", value: logItems.filter(a => a.severity === "High").length, color: "#ff6b6b", icon: "🚨", onClick: undefined },
                    { label: "Unread", value: unreadItems.length, color: "#fbbf24", icon: "🔔", onClick: () => setShowUnread(true) },
                    { label: "Resolved", value: logItems.filter(a => !a.unread).length, color: "#00ff9d", icon: "✅", onClick: undefined },
                  ].map(({ label, value, color, icon, onClick }) => (
                    <div key={label} className="card" onClick={onClick} style={{ animationDelay: ".05s", textAlign: "center", padding: ".9rem", cursor: onClick ? "pointer" : "default", transition: "all .2s", position: "relative", overflow: "hidden" }}
                      onMouseOver={e => { if (onClick) e.currentTarget.style.background = `${color}10`; }}
                      onMouseOut={e => { if (onClick) e.currentTarget.style.background = "rgba(255,255,255,.03)"; }}>
                      {onClick && <div style={{ position: "absolute", top: 8, right: 10, fontSize: ".55rem", color: "rgba(255,255,255,.25)", fontFamily: "'Syne',sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em" }}>tap to view →</div>}
                      <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{icon}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800, color }}>{value}</div>
                      <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {}
                <div className="card" style={{ animationDelay: ".1s" }}>
                  <div className="card-hd">
                    <span>Alert Log</span>
                    <span style={{ fontSize: ".65rem", color: "#00c8ff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600 }} onClick={markAllRead}>Mark all read</span>
                  </div>
                  {logItems.map((a, i) => <AlertLogItem key={i} {...a} />)}
                </div>
              </div>
            )}

            {}
            {activeTab === "settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

                {}
                <div className="card" style={{ animationDelay: ".05s", background: "rgba(255,107,107,.05)", border: "1px solid rgba(255,107,107,.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,107,107,.15)", border: "1px solid rgba(255,107,107,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>⚡</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".9rem", fontWeight: 800, color: "#fff", marginBottom: 3 }}>Alert Settings Shortcuts</div>
                      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                        {[
                          { label: "Enable All", action: () => setAlerts(p => p.map(a => ({ ...a, enabled: true }))), color: "#00ff9d" },
                          { label: "Disable All", action: () => setAlerts(p => p.map(a => ({ ...a, enabled: false }))), color: "#ff6b6b" },
                          { label: "High Only", action: () => setAlerts(p => p.map(a => ({ ...a, enabled: a.severity === "High" }))), color: "#fbbf24" },
                          { label: "Cardiac Only", action: () => setAlerts(p => p.map(a => ({ ...a, enabled: a.category === "Cardiac" }))), color: "#ff6b6b" },
                          { label: "Reset Defaults", action: () => setAlerts(p => p.map(a => ({ ...a, notifyChannels: ["App"] }))), color: "#00c8ff" },
                        ].map(({ label, action, color }) => (
                          <button key={label} onClick={action} style={{ padding: "5px 13px", borderRadius: 50, background: `${color}12`, border: `1px solid ${color}28`, color, fontSize: ".68rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, cursor: "pointer", transition: "all .18s" }}
                            onMouseOver={e => e.currentTarget.style.background = `${color}22`}
                            onMouseOut={e => e.currentTarget.style.background = `${color}12`}>{label}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 50, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)" }}>
                      <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,.4)", fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Active</span>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 800, color: "#00ff9d" }}>{alerts.filter(a => a.enabled).length}</span>
                      <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.25)" }}>/ {alerts.length}</span>
                    </div>
                  </div>
                </div>

                {}
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: ".85rem" }}>🔍</span>
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search alert types…"
                    style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 11, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", color: "#fff", fontSize: ".78rem", fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
                </div>

                {}
                {categories.map(cat => {
                  const catAlerts = filtered.filter(a => a.category === cat);
                  if (!catAlerts.length) return null;
                  const col = categoryColors[cat] || "#00c8ff";
                  const ico = categoryIcons[cat] || "📌";
                  return (
                    <div key={cat} className="card" style={{ animationDelay: ".08s" }}>
                      <SectionHd icon={ico} title={cat} count={catAlerts.length} color={col} />
                      {catAlerts.map(cfg => <AlertRow key={cfg.id} cfg={cfg} onChange={updateAlert} />)}
                    </div>
                  );
                })}
              </div>
            )}

            {}
            {activeTab === "types" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                <div className="card" style={{ animationDelay: ".05s", background: "rgba(0,200,255,.04)", border: "1px solid rgba(0,200,255,.14)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ fontSize: "1.5rem" }}>🤖</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".9rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>JarvisAI Alert Detection System</div>
                      <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>
                        JarvisAI monitors your ESP32 wearable data in real time using ML pattern recognition. Below is a complete reference of all alert types, what triggers them, and what they mean for your health.
                      </div>
                    </div>
                  </div>
                </div>

                {categories.map(cat => {
                  const catAlerts = alerts.filter(a => a.category === cat);
                  const col = categoryColors[cat] || "#00c8ff";
                  const ico = categoryIcons[cat] || "📌";
                  return (
                    <div key={cat} className="card" style={{ animationDelay: ".08s" }}>
                      <SectionHd icon={ico} title={`${cat} Alerts`} count={catAlerts.length} color={col} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {catAlerts.map(a => (
                          <div key={a.id} style={{ display: "flex", gap: 12, padding: "11px 14px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: `1px solid ${a.color}18` }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}15`, border: `1px solid ${a.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{a.icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: "#fff" }}>{a.label}</span>
                                <span style={{ padding: "1px 7px", borderRadius: 50, background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}28`, fontSize: ".57rem", fontWeight: 700 }}>{a.category}</span>
                                <span style={{ padding: "1px 7px", borderRadius: 50, background: a.severity === "High" ? "rgba(255,80,80,.12)" : a.severity === "Medium" ? "rgba(251,191,36,.1)" : "rgba(0,255,157,.08)", color: a.severity === "High" ? "#ff6b6b" : a.severity === "Medium" ? "#fbbf24" : "#00ff9d", fontSize: ".57rem", fontWeight: 700 }}>{a.severity}</span>
                                <span style={{ padding: "1px 7px", borderRadius: 50, background: a.enabled ? "rgba(0,255,157,.08)" : "rgba(255,255,255,.05)", color: a.enabled ? "#00ff9d" : "rgba(255,255,255,.3)", fontSize: ".57rem", fontWeight: 600 }}>{a.enabled ? "ON" : "OFF"}</span>
                              </div>
                              <div style={{ fontSize: ".71rem", color: "rgba(255,255,255,.42)", lineHeight: 1.5, marginBottom: 5 }}>{a.desc}</div>
                              {a.threshold && (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 50, background: `${a.color}10`, border: `1px solid ${a.color}20` }}>
                                  <span style={{ fontSize: ".6rem", color: "rgba(255,255,255,.3)" }}>Threshold:</span>
                                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".65rem", fontWeight: 700, color: a.color }}>{a.threshold.low}–{a.threshold.high} {a.threshold.unit}</span>
                                </div>
                              )}
                              <div style={{ marginTop: 5, fontSize: ".67rem", color: "rgba(255,255,255,.28)", fontStyle: "italic" }}>💡 {a.tip}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>{}

          {}
          {showUnread && (
            <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "#050f1f", display: "flex", flexDirection: "column", animation: "fadeUp .25s both" }}>

              {}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "1rem 1.8rem", background: "rgba(5,15,31,.98)", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 }}>
                <button onClick={() => setShowUnread(false)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>←</button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>Unread Alerts</div>
                  <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.3)", marginTop: 1 }}>{unreadItems.length} unread • Tap an alert to mark as read</div>
                </div>
                {unreadItems.length > 0 && (
                  <button onClick={() => { markAllRead(); setShowUnread(false); }} style={{ padding: "7px 16px", borderRadius: 50, background: "rgba(0,200,255,.1)", border: "1px solid rgba(0,200,255,.25)", color: "#00c8ff", fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, cursor: "pointer" }}>
                    ✓ Mark all read
                  </button>
                )}
              </div>

              {}
              <div style={{ flex: 1, overflowY: "auto", padding: "1.4rem 1.8rem" }}>
                {unreadItems.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60%", gap: 16 }}>
                    <div style={{ fontSize: "3rem" }}>✅</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>All caught up!</div>
                    <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.35)" }}>No unread alerts at the moment.</div>
                    <button onClick={() => setShowUnread(false)} style={{ marginTop: 8, padding: "8px 20px", borderRadius: 50, background: "rgba(0,200,255,.1)", border: "1px solid rgba(0,200,255,.25)", color: "#00c8ff", fontFamily: "'Syne',sans-serif", fontSize: ".74rem", fontWeight: 700, cursor: "pointer" }}>← Back to Alerts</button>
                  </div>
                ) : (
                  <>
                    {}
                    {unreadItems.filter(a => a.severity === "High" || a.severity === "Medium").length > 0 && (
                      <div style={{ marginBottom: "1.2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".7rem" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b6b", boxShadow: "0 0 8px #ff6b6b", display: "inline-block", animation: "blink 1s step-start infinite" }} />
                          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: "#ff6b6b", textTransform: "uppercase", letterSpacing: ".1em" }}>Needs Attention</span>
                        </div>
                        {unreadItems.filter(a => a.severity === "High" || a.severity === "Medium").map((a, i) => (
                          <div key={i} onClick={() => handleMarkSingleRead(a)}
                            style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 14, background: `${a.color}08`, border: `1px solid ${a.color}30`, marginBottom: 8, cursor: "pointer", transition: "all .18s", animation: `fadeUp .3s ${i * .06}s both` }}
                            onMouseOver={e => e.currentTarget.style.background = `${a.color}14`}
                            onMouseOut={e => e.currentTarget.style.background = `${a.color}08`}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${a.color}18`, border: `1px solid ${a.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{a.icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".88rem", fontWeight: 700, color: "#fff" }}>{a.title}</span>
                                <span style={{ padding: "2px 9px", borderRadius: 50, background: `${a.color}18`, color: a.color, border: `1px solid ${a.color}28`, fontSize: ".6rem", fontWeight: 700 }}>{a.severity}</span>
                                <span style={{ padding: "2px 9px", borderRadius: 50, background: "rgba(251,191,36,.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,.2)", fontSize: ".6rem", fontWeight: 600 }}>Unread</span>
                              </div>
                              <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.45)", lineHeight: 1.5 }}>{a.desc}</div>
                              <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.25)", marginTop: 4 }}>{a.time} · Tap to mark read</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {}
                    {unreadItems.filter(a => a.severity !== "High" && a.severity !== "Medium").length > 0 && (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".7rem" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00c8ff", display: "inline-block" }} />
                          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".1em" }}>Informational</span>
                        </div>
                        {unreadItems.filter(a => a.severity !== "High" && a.severity !== "Medium").map((a, i) => (
                          <div key={i} onClick={() => handleMarkSingleRead(a)}
                            style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", marginBottom: 6, cursor: "pointer", transition: "all .18s", animation: `fadeUp .3s ${i * .06}s both` }}
                            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,.06)"}
                            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,.03)"}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${a.color}18`, border: `1px solid ${a.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{a.icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: "#fff", marginBottom: 2 }}>{a.title}</div>
                              <div style={{ fontSize: ".71rem", color: "rgba(255,255,255,.4)" }}>{a.desc}</div>
                              <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.22)", marginTop: 3 }}>{a.time} · Tap to mark read</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

        </div>{}
      </div>{}
    </>
  );
}
