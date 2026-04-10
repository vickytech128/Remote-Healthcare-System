// src/api/reportsApi.js
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, auth } from "../firebaseConfig.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
};

const authHeaders = async () => ({
  "Content-Type":  "application/json",
  "Authorization": `Bearer ${await getToken()}`,
});

// ── Fetch all reports + summary ───────────────────────────────────────────────
export const fetchReports = async () => {
  const res = await fetch(`${API_URL}/api/reports`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Fetch single report ───────────────────────────────────────────────────────
export const fetchReportById = async (id) => {
  const res = await fetch(`${API_URL}/api/reports/${id}`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Fetch hospital info ───────────────────────────────────────────────────────
export const fetchHospitalInfo = async () => {
  const res = await fetch(`${API_URL}/api/reports/hospital`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Delete a report ───────────────────────────────────────────────────────────
export const deleteReport = async (id) => {
  const res = await fetch(`${API_URL}/api/reports/${id}`, {
    method:  "DELETE",
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Real-time reports listener from Firestore ─────────────────────────────────
export const subscribeToReports = (uid, callback) => {
  return onSnapshot(
    query(
      collection(db, "users", uid, "reports"),
      orderBy("createdAt", "desc")
    ),
    (snap) => {
      const reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(reports);
    }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE IN reports.jsx
// ─────────────────────────────────────────────────────────────────────────────
/*
import { useEffect, useState, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { fetchHospitalInfo, subscribeToReports } from "../api/reportsApi";

export default function ReportsPage() {
  const [reports,  setReports]  = useState([]);
  const [hospital, setHospital] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // ✅ Real-time reports listener from Firestore
    const unsubscribe = subscribeToReports(user.uid, (fetchedReports) => {
      setReports(fetchedReports);
    });

    // ✅ Load hospital info
    fetchHospitalInfo().then(res => {
      if (res.success) setHospital(res.data);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Summary counts — computed from live reports
  const labCnt  = reports.filter(r => r.category?.toLowerCase().includes("biochemistry") || r.category?.toLowerCase().includes("haematology")).length;
  const radCnt  = reports.filter(r => r.category?.toLowerCase().includes("radiology") || r.category?.toLowerCase().includes("cardiology")).length;
  const xrayCnt = reports.filter(r => r.category?.toLowerCase().includes("x-ray")).length;
  const abnCnt  = reports.filter(r => r.status === "Abnormal").length;
  const brdCnt  = reports.filter(r => r.status === "Borderline").length;

  // ✅ Replace REPORTS with reports state everywhere
  // REPLACE: REPORTS.filter(...)     → reports.filter(...)
  // REPLACE: REPORTS.length          → reports.length
  // REPLACE: HOSPITAL.name           → hospital?.name || "City General Hospital"
  // REPLACE: PATIENT.name            → patient?.name  || "Patient"
}
*/
