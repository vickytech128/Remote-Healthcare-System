// controllers/vitals.controller.js
import { db } from "../config/firebase.admin.js";
import { io } from "../../server.js";

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/vitals/update
// ESP32 calls this every 5 seconds
// Updates the SINGLE "current" document in vitals subcollection
// ─────────────────────────────────────────────────────────────────────────────
export const updateVitals = async (req, res) => {
  try {
    const { patientId, heartRate, spo2, temperature, bloodPressure, ecgStatus } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, error: "patientId is required" });
    }

    const vitalsData = {
      heartRate:     parseFloat(heartRate)   || 0,
      spo2:          parseFloat(spo2)        || 0,
      temperature:   parseFloat(temperature) || 0,
      bloodPressure: bloodPressure           || "0/0",
      ecgStatus:     ecgStatus              || "Normal",
      recordedAt:    new Date().toISOString(),
    };

    // ✅ Update SINGLE "current" document — users/{uid}/vitals/current
    await db
      .collection("users").doc(patientId)
      .collection("vitals").doc("current")
      .set(vitalsData); // overwrites with latest values

    // ✅ Also save a copy to vitals_history for History tab charts
    await db
      .collection("users").doc(patientId)
      .collection("vitals_history")
      .add(vitalsData);

    // ✅ Emit real-time WebSocket update to patient dashboard
    io.to(`patient-${patientId}`).emit("vitals-update", vitalsData);

    // ✅ Auto-create critical alerts
    const alerts = [];
    if (heartRate > 120 || heartRate < 40) {
      alerts.push({ title: "⚠️ Critical Heart Rate", desc: `Heart rate is ${heartRate} BPM — outside safe range`, icon: "⚠️", color: "#ff4444", severity: "High", urgent: true, read: false, createdAt: new Date().toISOString() });
    }
    if (spo2 < 90) {
      alerts.push({ title: "⚠️ Low Blood Oxygen", desc: `SpO₂ dropped to ${spo2}% — seek medical attention`, icon: "🩸", color: "#ff4444", severity: "High", urgent: true, read: false, createdAt: new Date().toISOString() });
    }
    if (temperature > 39.5) {
      alerts.push({ title: "⚠️ High Fever Detected", desc: `Temperature is ${temperature}°C — high fever`, icon: "🌡️", color: "#fbbf24", severity: "Medium", urgent: true, read: false, createdAt: new Date().toISOString() });
    }
    for (const alert of alerts) {
      await db.collection("users").doc(patientId).collection("alerts").add(alert);
      io.to(`patient-${patientId}`).emit("critical-alert", alert);
    }

    // ✅ Update device lastPing
    const deviceSnap = await db.collection("users").doc(patientId).collection("devices").limit(1).get();
    if (!deviceSnap.empty) {
      await deviceSnap.docs[0].ref.update({ lastPing: new Date().toISOString(), status: "online" });
    } else {
      await db.collection("users").doc(patientId).collection("devices").add({ deviceName: "ESP32 Sensor", deviceType: "ESP32", status: "online", lastPing: new Date().toISOString(), batteryLevel: 0, registeredAt: new Date().toISOString() });
    }
    io.to(`patient-${patientId}`).emit("device-status", { isOnline: true, lastSeen: new Date().toISOString() });

    return res.status(200).json({ success: true, message: "Vitals updated", data: vitalsData });
  } catch (err) {
    console.error("❌ Update vitals error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/vitals/latest
// Returns the single "current" document — live values
// ─────────────────────────────────────────────────────────────────────────────
export const getLatestVitals = async (req, res) => {
  try {
    const uid = req.user.uid;
    const doc = await db.collection("users").doc(uid).collection("vitals").doc("current").get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "No vitals found yet" });
    }
    return res.status(200).json({ success: true, data: doc.data() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/vitals/history
// Returns readings from vitals_history for History tab
// ─────────────────────────────────────────────────────────────────────────────
export const getVitalsHistory = async (req, res) => {
  try {
    const uid   = req.user.uid;
    const count = parseInt(req.query.limit) || 50;

    const snap = await db
      .collection("users").doc(uid)
      .collection("vitals_history")
      .orderBy("recordedAt", "desc")
      .limit(count)
      .get();

    const vitals = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ success: true, data: vitals, count: vitals.length });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/vitals/sparkline
// Returns last 16 readings for sparkline charts
// ─────────────────────────────────────────────────────────────────────────────
export const getSparklineData = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("vitals_history")
      .orderBy("recordedAt", "desc")
      .limit(16)
      .get();

    const vitals = snap.docs.map(d => d.data()).reverse();

    return res.status(200).json({
      success: true,
      data: {
        hrData:    vitals.map(v => v.heartRate   || 0),
        spo2Data:  vitals.map(v => v.spo2         || 0),
        tempData:  vitals.map(v => v.temperature  || 0),
        bpSysData: vitals.map(v => parseInt(v.bloodPressure?.split("/")[0]) || 0),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/vitals/week-comparison
// Returns this week vs last week averages for Analysis tab
// ─────────────────────────────────────────────────────────────────────────────
export const getWeekComparison = async (req, res) => {
  try {
    const uid        = req.user.uid;
    const now        = new Date();
    const weekAgo    = new Date(now - 7  * 24 * 60 * 60 * 1000).toISOString();
    const twoWeekAgo = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();

    const thisWeekSnap = await db.collection("users").doc(uid).collection("vitals_history").where("recordedAt", ">=", weekAgo).orderBy("recordedAt", "desc").get();
    const lastWeekSnap = await db.collection("users").doc(uid).collection("vitals_history").where("recordedAt", ">=", twoWeekAgo).where("recordedAt", "<", weekAgo).orderBy("recordedAt", "desc").get();

    const avg = (docs, field) => {
      const vals = docs.map(d => parseFloat(d.data()[field]) || 0).filter(v => v > 0);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    };

    const thisHR   = avg(thisWeekSnap.docs, "heartRate");
    const lastHR   = avg(lastWeekSnap.docs, "heartRate");
    const thisSpo2 = avg(thisWeekSnap.docs, "spo2");
    const lastSpo2 = avg(lastWeekSnap.docs, "spo2");
    const thisTemp = avg(thisWeekSnap.docs, "temperature");
    const lastTemp = avg(lastWeekSnap.docs, "temperature");
    const pctChange = (curr, prev) => prev ? parseFloat(((curr - prev) / prev * 100).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      data: [
        { label: "Avg Heart Rate", thisWeek: `${Math.round(thisHR)} BPM`,  lastWeek: `${Math.round(lastHR)} BPM`,  change: pctChange(thisHR, lastHR),     color: "#ff6b6b" },
        { label: "Avg SpO₂",       thisWeek: `${thisSpo2.toFixed(1)}%`,    lastWeek: `${lastSpo2.toFixed(1)}%`,    change: pctChange(thisSpo2, lastSpo2), color: "#00c8ff" },
        { label: "Avg Temp",       thisWeek: `${thisTemp.toFixed(1)}°C`,   lastWeek: `${lastTemp.toFixed(1)}°C`,   change: pctChange(thisTemp, lastTemp), color: "#ffd93d" },
      ],
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
