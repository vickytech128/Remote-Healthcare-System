// src/api/dashboardApi.js
// Add this file and import functions into patient-dashboard.jsx

import { getAuth } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper — gets Firebase token from current user
const getToken = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
};

const authHeaders = async () => ({
  "Content-Type":  "application/json",
  "Authorization": `Bearer ${await getToken()}`,
});

// ─── Dashboard Summary (profile + vitals + alerts + doctor + prescriptions) ──
export const fetchDashboardSummary = async () => {
  const res = await fetch(`${API_URL}/api/dashboard/summary`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ─── Vitals History (for sparkline charts) ────────────────────────────────────
export const fetchVitalsHistory = async () => {
  const res = await fetch(`${API_URL}/api/dashboard/vitals-history`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const fetchNotifications = async () => {
  const res = await fetch(`${API_URL}/api/dashboard/notifications`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

export const markAllNotificationsRead = async () => {
  const res = await fetch(`${API_URL}/api/dashboard/notifications/mark-all-read`, {
    method:  "PUT",
    headers: await authHeaders(),
  });
  return await res.json();
};

// ─── Device Status ────────────────────────────────────────────────────────────
export const fetchDeviceStatus = async () => {
  const res = await fetch(`${API_URL}/api/device/status`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE IN patient-dashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
/*
import { useEffect, useState } from "react";
import {
  fetchDashboardSummary,
  fetchVitalsHistory,
  fetchNotifications,
  fetchDeviceStatus,
  markAllNotificationsRead,
} from "../api/dashboardApi";

export default function PatientDashboard() {
  const [patient,       setPatient]       = useState(null);
  const [latestVitals,  setLatestVitals]  = useState(null);
  const [alerts,        setAlerts]        = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctor,        setDoctor]        = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hrHistory,     setHrHistory]     = useState([]);
  const [spo2History,   setSpo2History]   = useState([]);
  const [device,        setDevice]        = useState({ isOnline: false, status: "offline" });
  const [loading,       setLoading]       = useState(true);

  // ── Load dashboard data on mount ────────────────────────────────────────────
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summary, history, notifs, deviceStatus] = await Promise.all([
          fetchDashboardSummary(),
          fetchVitalsHistory(),
          fetchNotifications(),
          fetchDeviceStatus(),
        ]);

        if (summary.success) {
          setPatient(summary.data.patient);
          setLatestVitals(summary.data.latestVitals);
          setAlerts(summary.data.alerts);
          setPrescriptions(summary.data.prescriptions);
          setDoctor(summary.data.doctor);
        }

        if (history.success) {
          setHrHistory(history.data.hrHistory);
          setSpo2History(history.data.spo2History);
        }

        if (notifs.success) setNotifications(notifs.data);

        if (deviceStatus.success) setDevice(deviceStatus.device);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ── Poll device status every 30 seconds ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetchDeviceStatus();
      if (res.success) setDevice(res.device);
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ── Device Active pill — replace hardcoded version ─────────────────────────
  // REPLACE THIS in your JSX:
  //   <div className="status-pill">
  //     <span className="status-dot" />
  //     <span>Device Active</span>
  //   </div>
  //
  // WITH THIS:
  //   <div className="status-pill" style={{
  //     borderColor: device.isOnline ? "rgba(0,255,157,.2)" : "rgba(255,80,80,.2)",
  //     background:  device.isOnline ? "rgba(0,255,157,.06)" : "rgba(255,80,80,.06)",
  //   }}>
  //     <span className="status-dot" style={{
  //       background:  device.isOnline ? "#00ff9d" : "#ff4444",
  //       boxShadow:   device.isOnline ? "0 0 6px #00ff9d" : "0 0 6px #ff4444",
  //       animation:   device.isOnline ? "blink 1.2s step-start infinite" : "none",
  //     }} />
  //     <span style={{ color: device.isOnline ? "#00ff9d" : "#ff4444" }}>
  //       {device.isOnline ? "Device Active" : "Device Offline"}
  //     </span>
  //   </div>
}
*/
