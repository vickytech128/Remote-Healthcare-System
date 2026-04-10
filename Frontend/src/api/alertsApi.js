// src/api/alertsApi.js
// Import and use these functions inside alerts.jsx

import { getAuth } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
};

const authHeaders = async () => ({
  "Content-Type":  "application/json",
  "Authorization": `Bearer ${await getToken()}`,
});

// ── Fetch all alerts (logItems) ───────────────────────────────────────────────
export const fetchAlerts = async () => {
  const res = await fetch(`${API_URL}/api/alerts`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Fetch only unread alerts ──────────────────────────────────────────────────
export const fetchUnreadAlerts = async () => {
  const res = await fetch(`${API_URL}/api/alerts/unread`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Mark single alert as read ─────────────────────────────────────────────────
export const markAlertRead = async (id) => {
  const res = await fetch(`${API_URL}/api/alerts/${id}/read`, {
    method:  "PUT",
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Mark all alerts as read ───────────────────────────────────────────────────
export const markAllRead = async () => {
  const res = await fetch(`${API_URL}/api/alerts/mark-all-read`, {
    method:  "PUT",
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Delete an alert ───────────────────────────────────────────────────────────
export const deleteAlert = async (id) => {
  const res = await fetch(`${API_URL}/api/alerts/${id}`, {
    method:  "DELETE",
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Fetch alert settings (thresholds, toggles) ───────────────────────────────
export const fetchAlertSettings = async () => {
  const res = await fetch(`${API_URL}/api/alerts/settings`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Save alert settings when user changes threshold or toggle ─────────────────
export const saveAlertSettings = async (settings) => {
  const res = await fetch(`${API_URL}/api/alerts/settings`, {
    method:  "PUT",
    headers: await authHeaders(),
    body:    JSON.stringify({ settings }),
  });
  return await res.json();
};

// ── Toggle global alerts on/off ───────────────────────────────────────────────
export const toggleGlobalAlerts = async (enabled) => {
  const res = await fetch(`${API_URL}/api/alerts/global-toggle`, {
    method:  "PUT",
    headers: await authHeaders(),
    body:    JSON.stringify({ enabled }),
  });
  return await res.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE IN alerts.jsx
// ─────────────────────────────────────────────────────────────────────────────
/*
import { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import app from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  markAlertRead, markAllRead, fetchAlertSettings,
  saveAlertSettings, toggleGlobalAlerts,
} from "../api/alertsApi";

const db   = getFirestore(app);
const auth = getAuth(app);

export default function AlertsPage() {
  const [logItems,      setLogItems]      = useState([]);
  const [alertSettings, setAlertSettings] = useState([]);
  const [globalAlerts,  setGlobalAlerts]  = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // ✅ Real-time listener for alerts from Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", user.uid, "alerts"),
        orderBy("createdAt", "desc")
      ),
      (snap) => {
        setLogItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    // ✅ Load alert settings from backend
    fetchAlertSettings().then(res => {
      if (res.success) setAlertSettings(res.data);
    });

    return () => unsubscribe();
  }, []);

  // ✅ When user marks alert as read (click on alert item)
  const handleMarkRead = async (alertId) => {
    await markAlertRead(alertId);
    // Firestore listener will auto-update logItems
  };

  // ✅ When user clicks "Mark all read" button
  const handleMarkAllRead = async () => {
    await markAllRead();
    // Firestore listener will auto-update logItems
  };

  // ✅ When user changes global alerts toggle
  const handleGlobalToggle = async (val) => {
    setGlobalAlerts(val);
    await toggleGlobalAlerts(val);
  };

  // ✅ When user changes threshold or toggle on an AlertRow
  const handleAlertChange = async (updated) => {
    const newSettings = alertSettings.map(a =>
      a.id === updated.id ? updated : a
    );
    setAlertSettings(newSettings);
    await saveAlertSettings(newSettings); // auto-save to backend
  };
}
*/
