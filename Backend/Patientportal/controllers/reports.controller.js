// controllers/reports.controller.js
import { db } from "../config/firebase.admin.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/reports
// Returns all reports for the patient from Firestore subcollection
// Matches: REPORTS array in reports.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const getReports = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users").doc(uid)
      .collection("reports")
      .orderBy("createdAt", "desc")
      .get();

    const reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Summary counts matching reports.jsx tabs
    const labCnt      = reports.filter(r => r.category?.toLowerCase().includes("biochemistry") || r.category?.toLowerCase().includes("haematology") || r.category?.toLowerCase().includes("immunoassay")).length;
    const radCnt      = reports.filter(r => r.category?.toLowerCase().includes("radiology") || r.category?.toLowerCase().includes("cardiology")).length;
    const xrayCnt     = reports.filter(r => r.category?.toLowerCase().includes("x-ray")).length;
    const abnCnt      = reports.filter(r => r.status === "Abnormal").length;
    const brdCnt      = reports.filter(r => r.status === "Borderline").length;

    return res.status(200).json({
      success: true,
      data: reports,
      summary: {
        total:    reports.length,
        labCnt,
        radCnt,
        xrayCnt,
        abnCnt,
        brdCnt,
        needsAttention: abnCnt + brdCnt,
      },
    });
  } catch (err) {
    console.error("❌ Get reports error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/reports/:id
// Returns a single report by document ID
// Matches: ReportModal → r (report details)
// ─────────────────────────────────────────────────────────────────────────────
export const getReportById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    const doc = await db
      .collection("users").doc(uid)
      .collection("reports").doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    return res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/reports/add
// Doctor/lab adds a new report for patient
// ─────────────────────────────────────────────────────────────────────────────
export const addReport = async (req, res) => {
  try {
    const uid = req.user.uid;
    const {
      reportId, testName, shortCode, category,
      sampleType, collectedOn, reportedOn,
      referredBy, department, conductedAt,
      technician, validatedBy, status,
      icon, color, summary,
      parameters, findings, xrayMeta,
    } = req.body;

    if (!testName || !status) {
      return res.status(400).json({ success: false, error: "testName and status are required" });
    }

    const newReport = {
      reportId:    reportId || `RPT-${Date.now()}`,
      testName,
      shortCode:   shortCode   || "",
      category:    category    || "General",
      sampleType:  sampleType  || "",
      collectedOn: collectedOn || new Date().toISOString(),
      reportedOn:  reportedOn  || new Date().toISOString(),
      referredBy:  referredBy  || "",
      department:  department  || "",
      conductedAt: conductedAt || "",
      technician:  technician  || "",
      validatedBy: validatedBy || "",
      status,                               // "Normal" / "Abnormal" / "Borderline"
      icon:        icon        || "📋",
      color:       color       || "#00c8ff",
      summary:     summary     || "",
      parameters:  parameters  || [],       // array of { test, value, unit, refRange, flag }
      findings:    findings    || [],       // array of { organ, result }
      xrayMeta:    xrayMeta    || null,     // { view, region, kV, mAs, film, SID }
      createdAt:   new Date().toISOString(),
      patientId:   uid,
    };

    const ref = await db
      .collection("users").doc(uid)
      .collection("reports")
      .add(newReport);

    // Auto-create alert if report is Abnormal
    if (status === "Abnormal") {
      await db
        .collection("users").doc(uid)
        .collection("alerts")
        .add({
          title:     `⚠️ Abnormal Report: ${testName}`,
          desc:      summary || `Your ${testName} report has abnormal findings. Please consult your doctor.`,
          icon:      "⚠️",
          color:     "#ff6b6b",
          severity:  "High",
          urgent:    true,
          read:      false,
          createdAt: new Date().toISOString(),
        });
    }

    return res.status(201).json({
      success: true,
      message: "Report added successfully",
      id: ref.id,
      data: newReport,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/reports/:id
// Deletes a report
// ─────────────────────────────────────────────────────────────────────────────
export const deleteReport = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    await db
      .collection("users").doc(uid)
      .collection("reports").doc(id)
      .delete();

    return res.status(200).json({ success: true, message: "Report deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/reports/hospital
// Returns hospital info (HOSPITAL constant in reports.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const getHospitalInfo = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    let hospital = null;
    if (userData?.assignedDoctorId) {
      const drDoc = await db.collection("users").doc(userData.assignedDoctorId).get();
      if (drDoc.exists) {
        const dr = drDoc.data();
        hospital = {
          name:    dr.hospitalName    || "City General Hospital",
          address: dr.hospitalAddress || "14, MG Road, New Delhi – 110001",
          phone:   dr.phone           || "+91 11-2345-6789",
          lab:     dr.labName         || "CGH Central Diagnostic Laboratory",
          regNo:   dr.regNo           || "CGH-DL-2004-0041",
          labLic:  dr.labLic          || "DL-LAB-2004-7823",
        };
      }
    }

    // Default hospital if not assigned
    if (!hospital) {
      hospital = {
        name:    "City General Hospital",
        address: "14, MG Road, New Delhi – 110001",
        phone:   "+91 11-2345-6789",
        lab:     "CGH Central Diagnostic Laboratory",
        regNo:   "CGH-DL-2004-0041",
        labLic:  "DL-LAB-2004-7823",
      };
    }

    return res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
