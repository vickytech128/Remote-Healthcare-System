// src/api/medicationApi.js
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebaseConfig.js";

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

// ── Fetch all bills ───────────────────────────────────────────────────────────
export const fetchBills = async () => {
  const res = await fetch(`${API_URL}/api/medication/bills`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Fetch single bill ─────────────────────────────────────────────────────────
export const fetchBillById = async (id) => {
  const res = await fetch(`${API_URL}/api/medication/bills/${id}`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── Mark bill as paid ─────────────────────────────────────────────────────────
export const markBillPaid = async (id, payMode) => {
  const res = await fetch(`${API_URL}/api/medication/bills/${id}/pay`, {
    method:  "PUT",
    headers: await authHeaders(),
    body:    JSON.stringify({ payMode }),
  });
  return await res.json();
};

// ── Get hospital info ─────────────────────────────────────────────────────────
export const fetchHospitalInfo = async () => {
  const res = await fetch(`${API_URL}/api/medication/hospital`, {
    headers: await authHeaders(),
  });
  return await res.json();
};

// ── AI medicine explanation (replaces fetchAI in ViewModal) ──────────────────
export const explainMedicineAI = async ({ name, dosage, form, purpose }) => {
  const res = await fetch(`${API_URL}/api/medication/ai-explain`, {
    method:  "POST",
    headers: await authHeaders(),
    body:    JSON.stringify({ name, dosage, form, purpose }),
  });
  return await res.json();
};

// ── Real-time bills listener from Firestore ───────────────────────────────────
export const subscribeToBills = (uid, callback) => {
  return onSnapshot(
    query(
      collection(db, "users", uid, "prescriptions"),
      orderBy("createdAt", "desc")
    ),
    (snap) => {
      const bills = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(bills);
    }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE IN medication.jsx
// ─────────────────────────────────────────────────────────────────────────────
/*
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { fetchHospitalInfo, explainMedicineAI, subscribeToBills } from "../api/medicationApi";

export default function MedicineBillsPage() {
  const [bills,    setBills]    = useState([]);
  const [hospital, setHospital] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // ✅ Real-time bills from Firestore
    const unsubscribe = subscribeToBills(user.uid, (fetchedBills) => {
      setBills(fetchedBills);
    });

    // ✅ Load hospital info
    fetchHospitalInfo().then(res => {
      if (res.success) setHospital(res.data);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Replace fetchAI() inside ViewModal with this:
  const fetchAI = async (item) => {
    const key = item.name;
    if (aiResults[key]) { setExpandedItem(k => k === key ? null : key); return; }
    setLoadingItem(key);
    const res = await explainMedicineAI({
      name:    item.name,
      dosage:  item.dosage,
      form:    item.form,
      purpose: item.purpose,
    });
    if (res.success) {
      setAiResults(prev => ({ ...prev, [key]: res.data }));
      setExpandedItem(key);
    }
    setLoadingItem(null);
  };

  // ✅ Replace hardcoded BILLS with dynamic bills state
  // REPLACE: BILLS.filter(b => ...)
  // WITH:    bills.filter(b => ...)

  // ✅ Replace hardcoded HOSPITAL with hospital state
  // REPLACE: HOSPITAL.name
  // WITH:    hospital?.name || "City General Hospital"
}
*/
