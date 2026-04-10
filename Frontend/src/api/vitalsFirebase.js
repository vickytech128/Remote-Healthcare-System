// src/api/vitalsFirebase.js
// Complete Firebase integration for vitals.jsx
// Replaces ALL hardcoded data with real Firestore data + real-time updates

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../config/firebaseConfig";

const db   = getFirestore(app);
const auth = getAuth(app);

// ─────────────────────────────────────────────────────────────────────────────
// 1. REAL-TIME LATEST VITALS LISTENER
// Replaces: setInterval heartRate simulation in vitals.jsx
// Updates instantly when ESP32 sends new data
// ─────────────────────────────────────────────────────────────────────────────
export const subscribeToLatestVitals = (uid, callback) => {
  return onSnapshot(
    query(
      collection(db, "users", uid, "vitals"),
      orderBy("recordedAt", "desc"),
      limit(1)
    ),
    (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        callback({
          heartRate:     data.heartRate     || 0,
          spo2:          data.spo2          || 0,
          temperature:   data.temperature   || 0,
          bloodPressure: data.bloodPressure || "0/0",
          ecgStatus:     data.ecgStatus     || "Unknown",
          recordedAt:    data.recordedAt    || null,
        });
      }
    }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SPARKLINE HISTORY DATA (last 16 readings)
// Replaces: hrData, spo2Data, tempData, bpSysData arrays in vitals.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const subscribeToVitalsHistory = (uid, callback) => {
  return onSnapshot(
    query(
      collection(db, "users", uid, "vitals"),
      orderBy("recordedAt", "desc"),
      limit(16)
    ),
    (snap) => {
      const vitals = snap.docs.map(d => d.data()).reverse(); // oldest first

      callback({
        hrData:    vitals.map(v => v.heartRate   || 0),
        spo2Data:  vitals.map(v => v.spo2         || 0),
        tempData:  vitals.map(v => v.temperature  || 0),
        bpSysData: vitals.map(v => parseInt(v.bloodPressure?.split("/")[0]) || 0),
      });
    }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. VITALS HISTORY TABLE (grouped by day)
// Replaces: history array in vitals.jsx
// Returns readings grouped by date for DayGroup component
// ─────────────────────────────────────────────────────────────────────────────
export const fetchVitalsHistoryGrouped = async (uid) => {
  const snap = await getDocs(
    query(
      collection(db, "users", uid, "vitals"),
      orderBy("recordedAt", "desc"),
      limit(50)
    )
  );

  const readings = snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));

  // Group readings by date
  const grouped = {};
  readings.forEach(r => {
    const date = new Date(r.recordedAt);
    const dateKey = date.toLocaleDateString("en-US", {
      month: "short", day: "2-digit", year: "numeric"
    }); // e.g. "Mar 09, 2026"

    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push({
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      hr:   r.heartRate     || "--",
      spo2: r.spo2          || "--",
      temp: r.temperature   || "--",
      bp:   r.bloodPressure || "--",
      note: r.ecgStatus     || "Reading recorded",
    });
  });

  // Build DayGroup format
  const dayGroups = Object.entries(grouped).map(([date, rows]) => {
    const avgHr   = Math.round(rows.reduce((s, r) => s + (r.hr   || 0), 0) / rows.length);
    const avgSpo2 = Math.round(rows.reduce((s, r) => s + (r.spo2 || 0), 0) / rows.length);
    const avgTemp = (rows.reduce((s, r) => s + (parseFloat(r.temp) || 0), 0) / rows.length).toFixed(1);
    const lastBp  = rows[0]?.bp || "--";

    return {
      date,
      day:  new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      badge: "#00c8ff",
      avg: { hr: avgHr, spo2: avgSpo2, temp: avgTemp, bp: lastBp },
      rows,
    };
  });

  return dayGroups;
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. WEEK COMPARISON DATA
// Replaces: hardcoded "This Week vs Last Week" in vitals.jsx Analysis tab
// ─────────────────────────────────────────────────────────────────────────────
export const fetchWeekComparison = async (uid) => {
  const now       = new Date();
  const weekAgo   = new Date(now - 7  * 24 * 60 * 60 * 1000).toISOString();
  const twoWeekAgo = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();

  // This week
  const thisWeekSnap = await getDocs(
    query(
      collection(db, "users", uid, "vitals"),
      where("recordedAt", ">=", weekAgo),
      orderBy("recordedAt", "desc")
    )
  );

  // Last week
  const lastWeekSnap = await getDocs(
    query(
      collection(db, "users", uid, "vitals"),
      where("recordedAt", ">=", twoWeekAgo),
      where("recordedAt", "<", weekAgo),
      orderBy("recordedAt", "desc")
    )
  );

  const avg = (docs, field) => {
    const vals = docs.map(d => parseFloat(d.data()[field]) || 0).filter(v => v > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  };

  const thisWeekDocs = thisWeekSnap.docs;
  const lastWeekDocs = lastWeekSnap.docs;

  const thisHR   = avg(thisWeekDocs, "heartRate");
  const lastHR   = avg(lastWeekDocs, "heartRate");
  const thisSpo2 = avg(thisWeekDocs, "spo2");
  const lastSpo2 = avg(lastWeekDocs, "spo2");
  const thisTemp = avg(thisWeekDocs, "temperature");
  const lastTemp = avg(lastWeekDocs, "temperature");

  const pctChange = (curr, prev) =>
    prev ? parseFloat(((curr - prev) / prev * 100).toFixed(1)) : 0;

  return [
    {
      label: "Avg Heart Rate",
      thisWeek: `${Math.round(thisHR)} BPM`,
      lastWeek: `${Math.round(lastHR)} BPM`,
      change: pctChange(thisHR, lastHR),
      color: "#ff6b6b",
    },
    {
      label: "Avg SpO₂",
      thisWeek: `${thisSpo2.toFixed(1)}%`,
      lastWeek: `${lastSpo2.toFixed(1)}%`,
      change: pctChange(thisSpo2, lastSpo2),
      color: "#00c8ff",
    },
    {
      label: "Avg Temp",
      thisWeek: `${thisTemp.toFixed(1)}°C`,
      lastWeek: `${lastTemp.toFixed(1)}°C`,
      change: pctChange(thisTemp, lastTemp),
      color: "#ffd93d",
    },
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE ALL OF THIS IN vitals.jsx
// ─────────────────────────────────────────────────────────────────────────────
/*
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  subscribeToLatestVitals,
  subscribeToVitalsHistory,
  fetchVitalsHistoryGrouped,
  fetchWeekComparison,
} from "../api/vitalsFirebase";

export default function VitalsPage() {
  const auth = getAuth();

  // ── Replace hardcoded state ──────────────────────────────────────────────
  const [heartRate,    setHeartRate]    = useState(0);
  const [spo2,         setSpo2]         = useState(0);
  const [temp,         setTemp]         = useState(0);
  const [bp,           setBp]           = useState("--");
  const [ecgStatus,    setEcgStatus]    = useState("--");

  const [hrData,       setHrData]       = useState([0]);
  const [spo2Data,     setSpo2Data]     = useState([0]);
  const [tempData,     setTempData]     = useState([0]);
  const [bpSysData,    setBpSysData]    = useState([0]);

  const [history,      setHistory]      = useState([]);
  const [weekComp,     setWeekComp]     = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;

    // 1. Real-time latest vitals (replaces random interval)
    const unsubLatest = subscribeToLatestVitals(uid, (v) => {
      setHeartRate(v.heartRate);
      setSpo2(v.spo2);
      setTemp(v.temperature);
      setBp(v.bloodPressure);
      setEcgStatus(v.ecgStatus);
    });

    // 2. Real-time sparkline history
    const unsubHistory = subscribeToVitalsHistory(uid, (data) => {
      setHrData(data.hrData);
      setSpo2Data(data.spo2Data);
      setTempData(data.tempData);
      setBpSysData(data.bpSysData);
    });

    // 3. Grouped history for History tab
    fetchVitalsHistoryGrouped(uid).then(setHistory);

    // 4. Week comparison for Analysis tab
    fetchWeekComparison(uid).then(setWeekComp);

    setLoading(false);

    return () => {
      unsubLatest();
      unsubHistory();
    };
  }, []);

  // ── Replace hardcoded vitals in JSX ─────────────────────────────────────
  // REPLACE: const [heartRate, setHeartRate] = useState(72);
  //          useEffect interval simulation
  // WITH:    the states above

  // REPLACE: hrData, spo2Data, tempData, bpSysData arrays
  // WITH:    the state arrays above

  // REPLACE: history array
  // WITH:    history state

  // IN Overview tab VitalCard:
  // value={heartRate}   → from Firebase ✅
  // value={spo2}        → from Firebase ✅
  // value={temp}        → from Firebase ✅
  // value={bp}          → from Firebase ✅

  // IN History tab DayGroup:
  // {history.map((group, i) => <DayGroup key={i} {...group} defaultOpen={i === 0} />)}

  // IN Analysis tab "This Week vs Last Week":
  // {weekComp.map(({ label, thisWeek, lastWeek, change, color }) => (...))}
}
*/
