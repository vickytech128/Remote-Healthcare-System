// controllers/alerts.controller.js
import { db } from "../config/firebase.admin.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/alerts
// Fetches all alerts for the patient from Firestore subcollection
// Matches: logItems in alerts.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const getAlerts = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("alerts")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const alerts = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Separate unread count
    const unreadCount = alerts.filter(a => !a.read).length;

    return res.status(200).json({
      success: true,
      data: alerts,
      unreadCount,
    });
  } catch (err) {
    console.error("❌ Get alerts error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/alerts/unread
// Returns only unread alerts
// Matches: unreadItems in alerts.jsx → showUnread panel
// ─────────────────────────────────────────────────────────────────────────────
export const getUnreadAlerts = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("alerts")
      .where("read", "==", false)
      .orderBy("createdAt", "desc")
      .get();

    const unread = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.status(200).json({
      success: true,
      data: unread,
      count: unread.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/alerts/:id/read
// Marks a single alert as read
// Matches: onClick on alert item → setLogItems unread: false
// ─────────────────────────────────────────────────────────────────────────────
export const markAlertRead = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    await db
      .collection("users").doc(uid)
      .collection("alerts").doc(id)
      .update({ read: true });

    return res.status(200).json({ success: true, message: "Alert marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/alerts/mark-all-read
// Marks ALL alerts as read
// Matches: markAllRead() → "Mark all read" button in alerts.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const markAllAlertsRead = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("alerts")
      .where("read", "==", false)
      .get();

    // Batch update all unread alerts
    const batch = db.batch();
    snap.docs.forEach(doc => batch.update(doc.ref, { read: true }));
    await batch.commit();

    return res.status(200).json({
      success: true,
      message: `${snap.size} alerts marked as read`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/alerts/:id
// Deletes a single alert
// ─────────────────────────────────────────────────────────────────────────────
export const deleteAlert = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    await db
      .collection("users").doc(uid)
      .collection("alerts").doc(id)
      .delete();

    return res.status(200).json({ success: true, message: "Alert deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/alerts/settings
// Returns saved alert settings (thresholds, notify channels, enabled/disabled)
// Matches: alerts state in alerts.jsx (hr_high, spo2_low etc.)
// ─────────────────────────────────────────────────────────────────────────────
export const getAlertSettings = async (req, res) => {
  try {
    const uid = req.user.uid;

    const doc = await db.collection("users").doc(uid).get();
    const settings = doc.data()?.alertSettings || null;

    // Return saved settings or default settings
    if (!settings) {
      return res.status(200).json({
        success: true,
        data: getDefaultAlertSettings(),
      });
    }

    return res.status(200).json({ success: true, data: settings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/alerts/settings
// Saves alert settings when user changes thresholds or toggles
// Matches: onChange on AlertRow → updates alerts state in alerts.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const saveAlertSettings = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { settings } = req.body;

    if (!settings) {
      return res.status(400).json({ success: false, error: "Settings are required" });
    }

    // Save alertSettings as a field inside the user document
    await db.collection("users").doc(uid).set(
      { alertSettings: settings, alertSettingsUpdatedAt: new Date().toISOString() },
      { merge: true }
    );

    return res.status(200).json({ success: true, message: "Alert settings saved" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/alerts/global-toggle
// Enables or disables ALL alerts globally
// Matches: globalAlerts toggle in alerts.jsx topbar
// ─────────────────────────────────────────────────────────────────────────────
export const toggleGlobalAlerts = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { enabled } = req.body;

    await db.collection("users").doc(uid).set(
      { globalAlertsEnabled: enabled },
      { merge: true }
    );

    return res.status(200).json({
      success: true,
      message: `Global alerts ${enabled ? "enabled" : "disabled"}`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper — Default alert settings (matches alerts.jsx initial state)
// ─────────────────────────────────────────────────────────────────────────────
const getDefaultAlertSettings = () => ([
  { id: "hr_high",    enabled: true,  severity: "High",   notifyChannels: ["App", "WhatsApp", "Doctor"], threshold: { low: 60, high: 100, unit: "BPM" } },
  { id: "hr_low",     enabled: true,  severity: "High",   notifyChannels: ["App", "Doctor"],             threshold: { low: 50, high: 100, unit: "BPM" } },
  { id: "hr_spike",   enabled: true,  severity: "High",   notifyChannels: ["App", "WhatsApp", "Doctor"], threshold: undefined },
  { id: "hr_irreg",   enabled: true,  severity: "High",   notifyChannels: ["App", "Doctor"],             threshold: undefined },
  { id: "ecg_st",     enabled: true,  severity: "High",   notifyChannels: ["App", "WhatsApp", "SMS", "Doctor"], threshold: undefined },
  { id: "spo2_low",   enabled: true,  severity: "High",   notifyChannels: ["App", "WhatsApp", "Doctor"], threshold: { low: 94, high: 100, unit: "%" } },
  { id: "temp_high",  enabled: true,  severity: "Medium", notifyChannels: ["App", "Doctor"],             threshold: { low: 36, high: 38, unit: "°C" } },
  { id: "bp_high",    enabled: true,  severity: "Medium", notifyChannels: ["App", "Doctor"],             threshold: { low: 80, high: 130, unit: "mmHg" } },
  { id: "med_missed", enabled: true,  severity: "Medium", notifyChannels: ["App", "WhatsApp"],           threshold: undefined },
  { id: "steps",      enabled: false, severity: "Low",    notifyChannels: ["App"],                       threshold: { low: 0, high: 8000, unit: "steps" } },
]);
