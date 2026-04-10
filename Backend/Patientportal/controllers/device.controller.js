import { db } from "../config/firebase.admin.js";

// ── Validation helpers ────────────────────────────────────────────────────────
const isValidHeartRate = (v) => typeof v === "number" && v >= 30 && v <= 250;
const isValidTemp = (v) => typeof v === "number" && v >= 30 && v <= 45;
const isValidAccel = (v) => typeof v === "number" && v >= -20 && v <= 20;
const isValidGPS = (g) =>
  g &&
  typeof g.lat === "number" && g.lat >= -90 && g.lat <= 90 &&
  typeof g.lng === "number" && g.lng >= -180 && g.lng <= 180;

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/device/ping
// Device sends live sensor data → saved to Firestore
// users/{uid}/device/current  (single doc, always overwritten)
// ─────────────────────────────────────────────────────────────────────────────
export const devicePing = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { heartRate, temperature, gps, ax, ay, az } = req.body;

    // ── Validate all fields ────────────────────────────────────────────────
    const errors = [];

    if (heartRate === undefined || heartRate === null) {
      errors.push("heartRate is required");
    } else if (!isValidHeartRate(heartRate)) {
      errors.push(`heartRate must be between 30–250 BPM, got: ${heartRate}`);
    }

    if (temperature === undefined || temperature === null) {
      errors.push("temperature is required");
    } else if (!isValidTemp(temperature)) {
      errors.push(`temperature must be between 30–45°C, got: ${temperature}`);
    }

    if (ax === undefined || !isValidAccel(ax)) errors.push(`ax invalid, got: ${ax}`);
    if (ay === undefined || !isValidAccel(ay)) errors.push(`ay invalid, got: ${ay}`);
    if (az === undefined || !isValidAccel(az)) errors.push(`az invalid, got: ${az}`);

    if (gps !== undefined && gps !== null && !isValidGPS(gps)) {
      errors.push("gps must have valid lat (-90 to 90) and lng (-180 to 180)");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    const now = new Date().toISOString();

    // ── Save current (live) data — always overwrites ───────────────────────
    await db
      .collection("users").doc(uid)
      .collection("device").doc("current")
      .set({
        heartRate,
        temperature,
        gps: gps || null,
        ax, ay, az,
        lastUpdated: now,
      });

    // ── Also save to history subcollection for charts/trends ──────────────
    await db
      .collection("users").doc(uid)
      .collection("device_history")
      .add({
        heartRate,
        temperature,
        gps: gps || null,
        ax, ay, az,
        recordedAt: now,
      });

    // ── Auto-trigger alert if vitals are out of range ─────────────────────
    const alerts = [];

    if (heartRate > 100) alerts.push({ type: "hr_high", message: `High heart rate: ${heartRate} BPM`, severity: "High" });
    if (heartRate < 50) alerts.push({ type: "hr_low", message: `Low heart rate: ${heartRate} BPM`, severity: "High" });
    if (temperature > 38) alerts.push({ type: "temp_high", message: `High temperature: ${temperature}°C`, severity: "Medium" });

    if (alerts.length > 0) {
      const batch = db.batch();
      alerts.forEach(alert => {
        const ref = db
          .collection("users").doc(uid)
          .collection("alerts").doc();
        batch.set(ref, {
          ...alert,
          read: false,
          createdAt: now,
          source: "device",
        });
      });
      await batch.commit();
    }

    return res.status(200).json({
      success: true,
      message: "Device data saved",
      alertsTriggered: alerts.length,
      savedAt: now,
    });

  } catch (err) {
    console.error("❌ Device ping error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/device/current
// Returns the latest live reading for this patient
// ─────────────────────────────────────────────────────────────────────────────
export const getCurrentData = async (req, res) => {
  try {
    const uid = req.user.uid;

    const doc = await db
      .collection("users").doc(uid)
      .collection("device").doc("current")
      .get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "No device data yet" });
    }

    return res.status(200).json({ success: true, data: doc.data() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/device/history
// Returns last 50 readings for charts/sparklines
// ─────────────────────────────────────────────────────────────────────────────
export const getDeviceHistory = async (req, res) => {
  try {
    const uid = req.user.uid;
    const limit = parseInt(req.query.limit) || 50;

    const snap = await db
      .collection("users").doc(uid)
      .collection("device_history")
      .orderBy("recordedAt", "desc")
      .limit(limit)
      .get();

    const history = snap.docs.map(d => d.data()).reverse();

    return res.status(200).json({ success: true, data: history, count: history.length });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};