import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Sidebar from "./Sidebar.jsx";
import { getAuth } from "firebase/auth";
import { fetchHospitalInfo, subscribeToReports } from "../src/api/reportsApi.js";
import { db, doc, getDoc } from "../src/firebaseConfig.js";



const HOSPITAL = {
  name: "City General Hospital",
  address: "14, MG Road, New Delhi – 110001",
  phone: "+91 11-2345-6789",
  lab: "CGH Central Diagnostic Laboratory",
  regNo: "CGH-DL-2004-0041",
  labLic: "DL-LAB-2004-7823",
};

const PATIENT = {
  name: "Alex Johnson",
  id: "PAT-0042",
  uhid: "UHID-CGH-20240042",
  dob: "14 Jun 1988",
  age: "37 yrs",
  gender: "Male",
  blood: "O+",
  phone: "+91 98765-43210",
  ward: "Outpatient – OPD 4",
};


const REPORTS = [
  {
    id: "CGH-LAB-2026-0312",
    testName: "Complete Blood Count (CBC)",
    shortCode: "CBC",
    category: "Haematology",
    sampleType: "Whole Blood (EDTA)",
    collectedOn: "Mar 01, 2026 · 8:00 AM",
    reportedOn: "Mar 01, 2026 · 11:30 AM",
    referredBy: "Dr. Sarah Mitchell",
    department: "Endocrinology – OPD 4",
    conductedAt: "Haematology Lab, Ground Floor",
    technician: "Mr. Rohit Sharma (Lab Tech)",
    validatedBy: "Dr. Meera Kapoor (Pathologist)",
    status: "Normal",
    icon: "🩸",
    color: "#00ff9d",
    summary: "All haematological parameters within normal reference range. No evidence of anaemia, infection, or platelet abnormality.",
    parameters: [
      { test: "Haemoglobin", value: "14.2", unit: "g/dL", refRange: "13.0 – 17.0", flag: "N" },
      { test: "Total RBC", value: "4.90", unit: "mill/cmm", refRange: "4.5 – 5.5", flag: "N" },
      { test: "Haematocrit (PCV)", value: "43.5", unit: "%", refRange: "40 – 50", flag: "N" },
      { test: "MCV", value: "88.8", unit: "fL", refRange: "83 – 101", flag: "N" },
      { test: "MCH", value: "29.0", unit: "pg", refRange: "27 – 32", flag: "N" },
      { test: "MCHC", value: "32.6", unit: "g/dL", refRange: "31.5 – 34.5", flag: "N" },
      { test: "Total WBC Count", value: "7400", unit: "cells/cmm", refRange: "4000 – 11000", flag: "N" },
      { test: "Neutrophils", value: "58", unit: "%", refRange: "40 – 75", flag: "N" },
      { test: "Lymphocytes", value: "34", unit: "%", refRange: "20 – 45", flag: "N" },
      { test: "Monocytes", value: "6", unit: "%", refRange: "2 – 10", flag: "N" },
      { test: "Eosinophils", value: "2", unit: "%", refRange: "1 – 6", flag: "N" },
      { test: "Platelet Count", value: "2.4", unit: "lakh/cmm", refRange: "1.5 – 4.0", flag: "N" },
    ],
  },
  {
    id: "CGH-LAB-2026-0313",
    testName: "Lipid Profile",
    shortCode: "LIPID",
    category: "Biochemistry",
    sampleType: "Serum (Fasting 12 hrs)",
    collectedOn: "Mar 01, 2026 · 8:00 AM",
    reportedOn: "Mar 01, 2026 · 12:00 PM",
    referredBy: "Dr. Sarah Mitchell",
    department: "Endocrinology – OPD 4",
    conductedAt: "Biochemistry Lab, Ground Floor",
    technician: "Ms. Priya Iyer (Lab Tech)",
    validatedBy: "Dr. Meera Kapoor (Pathologist)",
    status: "Borderline",
    icon: "🔬",
    color: "#fbbf24",
    summary: "LDL cholesterol mildly elevated above optimal levels. Total cholesterol borderline. Lifestyle modification and dietary changes recommended. Atorvastatin currently prescribed.",
    parameters: [
      { test: "Total Cholesterol", value: "205", unit: "mg/dL", refRange: "< 200", flag: "H" },
      { test: "HDL Cholesterol", value: "48", unit: "mg/dL", refRange: "> 40", flag: "N" },
      { test: "LDL Cholesterol", value: "132", unit: "mg/dL", refRange: "< 100", flag: "H" },
      { test: "VLDL Cholesterol", value: "25", unit: "mg/dL", refRange: "< 30", flag: "N" },
      { test: "Triglycerides", value: "126", unit: "mg/dL", refRange: "< 150", flag: "N" },
      { test: "TC / HDL Ratio", value: "4.3", unit: "ratio", refRange: "< 5.0", flag: "N" },
    ],
  },
  {
    id: "CGH-LAB-2026-0314",
    testName: "Blood Glucose & HbA1c",
    shortCode: "HbA1c",
    category: "Biochemistry",
    sampleType: "Serum + Whole Blood (EDTA)",
    collectedOn: "Mar 01, 2026 · 8:00 AM",
    reportedOn: "Mar 01, 2026 · 1:00 PM",
    referredBy: "Dr. Sarah Mitchell",
    department: "Endocrinology – OPD 4",
    conductedAt: "Biochemistry Lab, Ground Floor",
    technician: "Ms. Priya Iyer (Lab Tech)",
    validatedBy: "Dr. Meera Kapoor (Pathologist)",
    status: "Abnormal",
    icon: "💉",
    color: "#ff6b6b",
    summary: "HbA1c elevated at 7.2% indicating suboptimal glycaemic control over the past 3 months. Fasting and post-prandial glucose both above normal. Metformin therapy ongoing — dose review advised.",
    parameters: [
      { test: "Fasting Blood Glucose", value: "118", unit: "mg/dL", refRange: "70 – 100", flag: "H" },
      { test: "Post-Prandial Glucose (2hr)", value: "162", unit: "mg/dL", refRange: "< 140", flag: "H" },
      { test: "HbA1c", value: "7.2", unit: "%", refRange: "< 5.7", flag: "H" },
      { test: "eAG (Est. Avg Glucose)", value: "160", unit: "mg/dL", refRange: "< 126", flag: "H" },
    ],
  },
  {
    id: "CGH-LAB-2026-0221",
    testName: "Liver Function Test (LFT)",
    shortCode: "LFT",
    category: "Biochemistry",
    sampleType: "Serum",
    collectedOn: "Feb 12, 2026 · 9:00 AM",
    reportedOn: "Feb 12, 2026 · 1:30 PM",
    referredBy: "Dr. Raj Patel",
    department: "Cardiology – OPD 2",
    conductedAt: "Biochemistry Lab, Ground Floor",
    technician: "Mr. Arun Das (Lab Tech)",
    validatedBy: "Dr. Meera Kapoor (Pathologist)",
    status: "Normal",
    icon: "🧪",
    color: "#00ff9d",
    summary: "All liver enzymes and function markers within normal reference limits. No evidence of hepatotoxicity. Safe to continue current statin therapy.",
    parameters: [
      { test: "Total Bilirubin", value: "0.8", unit: "mg/dL", refRange: "0.2 – 1.2", flag: "N" },
      { test: "Direct Bilirubin", value: "0.2", unit: "mg/dL", refRange: "0.0 – 0.4", flag: "N" },
      { test: "Indirect Bilirubin", value: "0.6", unit: "mg/dL", refRange: "0.2 – 0.8", flag: "N" },
      { test: "SGOT / AST", value: "28", unit: "U/L", refRange: "10 – 40", flag: "N" },
      { test: "SGPT / ALT", value: "32", unit: "U/L", refRange: "7 – 56", flag: "N" },
      { test: "Alkaline Phosphatase", value: "74", unit: "U/L", refRange: "44 – 147", flag: "N" },
      { test: "GGT", value: "22", unit: "U/L", refRange: "8 – 61", flag: "N" },
      { test: "Total Protein", value: "7.1", unit: "g/dL", refRange: "6.3 – 8.2", flag: "N" },
      { test: "Albumin", value: "4.2", unit: "g/dL", refRange: "3.4 – 5.4", flag: "N" },
      { test: "Globulin", value: "2.9", unit: "g/dL", refRange: "2.0 – 3.5", flag: "N" },
    ],
  },
  {
    id: "CGH-LAB-2026-0222",
    testName: "Thyroid Function Test (TFT)",
    shortCode: "TFT",
    category: "Endocrinology / Immunoassay",
    sampleType: "Serum",
    collectedOn: "Feb 12, 2026 · 9:00 AM",
    reportedOn: "Feb 12, 2026 · 3:00 PM",
    referredBy: "Dr. Raj Patel",
    department: "Endocrinology – OPD 4",
    conductedAt: "Immunoassay Lab, First Floor",
    technician: "Mr. Arun Das (Lab Tech)",
    validatedBy: "Dr. Meera Kapoor (Pathologist)",
    status: "Abnormal",
    icon: "🦋",
    color: "#ff6b6b",
    summary: "TSH elevated at 6.8 µIU/mL — above normal range, consistent with hypothyroidism. T3 and T4 within normal limits (compensated). Current Levothyroxine dose may need upward revision. Follow-up TFT in 6 weeks advised.",
    parameters: [
      { test: "T3 (Triiodothyronine)", value: "0.92", unit: "ng/mL", refRange: "0.8 – 2.0", flag: "N" },
      { test: "T4 (Thyroxine)", value: "5.8", unit: "µg/dL", refRange: "5.1 – 14.1", flag: "N" },
      { test: "TSH (Thyroid Stim. Horm.)", value: "6.8", unit: "µIU/mL", refRange: "0.4 – 4.0", flag: "H" },
      { test: "Free T3 (FT3)", value: "3.1", unit: "pg/mL", refRange: "2.3 – 4.2", flag: "N" },
      { test: "Free T4 (FT4)", value: "0.98", unit: "ng/dL", refRange: "0.8 – 1.8", flag: "N" },
    ],
  },
  {
    id: "CGH-RAD-2026-0091",
    testName: "Chest X-Ray (PA View)",
    shortCode: "CXR",
    category: "Radiology / Imaging",
    sampleType: "N/A – Imaging",
    collectedOn: "Mar 05, 2026 · 10:30 AM",
    reportedOn: "Mar 05, 2026 · 12:00 PM",
    referredBy: "Dr. Anand Kumar",
    department: "Gastroenterology – OPD 6",
    conductedAt: "Radiology Dept., Second Floor",
    technician: "Mr. Suresh Nair (Rad. Tech)",
    validatedBy: "Dr. Meera Kapoor (Radiologist)",
    status: "Normal",
    icon: "🫁",
    color: "#00c8ff",
    summary: "No active cardiopulmonary disease detected. Cardiac silhouette normal. Lung fields clear bilaterally with no consolidation or pleural effusion.",
    findings: [
      { organ: "Lung Fields", result: "Clear bilaterally. No consolidation, cavity, or pleural effusion." },
      { organ: "Heart", result: "Normal size. Cardiothoracic ratio < 0.5. No cardiomegaly." },
      { organ: "Mediastinum", result: "Central. No widening or mass lesion." },
      { organ: "Hilum", result: "Normal bilaterally. No lymphadenopathy." },
      { organ: "Diaphragm", result: "Both costophrenic angles clear and sharp." },
      { organ: "Bony Thorax", result: "Ribs and clavicles intact. No fracture or lytic lesion." },
      { organ: "Soft Tissues", result: "Normal" },
      { organ: "Impression", result: "Normal chest radiograph. No significant pathology detected." },
    ],
  },
  {
    id: "CGH-RAD-2026-0092",
    testName: "Ultrasound Whole Abdomen",
    shortCode: "USG ABD",
    category: "Radiology / Imaging",
    sampleType: "N/A – Imaging",
    collectedOn: "Mar 05, 2026 · 11:00 AM",
    reportedOn: "Mar 05, 2026 · 1:00 PM",
    referredBy: "Dr. Anand Kumar",
    department: "Gastroenterology – OPD 6",
    conductedAt: "Radiology Dept., Second Floor",
    technician: "Mr. Suresh Nair (Rad. Tech)",
    validatedBy: "Dr. Meera Kapoor (Radiologist)",
    status: "Borderline",
    icon: "🔊",
    color: "#fbbf24",
    summary: "Mild hepatomegaly with mildly coarsened echotexture noted. All other abdominal organs — gallbladder, spleen, kidneys, and urinary bladder — appear normal. Clinical correlation with LFT advised.",
    findings: [
      { organ: "Liver", result: "Mildly enlarged (span ~17 cm). Echotexture mildly coarsened. No focal lesion or mass." },
      { organ: "Gallbladder", result: "Normal size. Wall thickness normal. No calculi or polyp." },
      { organ: "Common Bile Duct", result: "Not dilated (~4 mm)." },
      { organ: "Pancreas", result: "Head and body normal where visualised. Tail obscured by bowel gas." },
      { organ: "Spleen", result: "Normal size (~10 cm). Homogeneous echotexture. No focal lesion." },
      { organ: "Right Kidney", result: "Normal size (~11 cm), shape, and echotexture. No calculus or hydronephrosis." },
      { organ: "Left Kidney", result: "Normal size (~10.5 cm), shape, and echotexture. No calculus." },
      { organ: "Urinary Bladder", result: "Adequately distended. Walls smooth and not thickened." },
      { organ: "Aorta / IVC", result: "Normal calibre." },
      { organ: "Ascites", result: "None detected." },
      { organ: "Impression", result: "Mild hepatomegaly with coarsened echotexture. Correlate with LFT and clinical history. Repeat USG in 3 months." },
    ],
  },
  {
    id: "CGH-RAD-2025-0441",
    testName: "12-Lead ECG",
    shortCode: "ECG",
    category: "Cardiology / Electrophysiology",
    sampleType: "N/A – Electrophysiology",
    collectedOn: "Dec 08, 2025 · 9:30 AM",
    reportedOn: "Dec 08, 2025 · 10:00 AM",
    referredBy: "Dr. Sarah Mitchell",
    department: "Cardiology – OPD 2",
    conductedAt: "ECG Room, Cardiology Wing, First Floor",
    technician: "Ms. Anita Roy (Cardiac Tech)",
    validatedBy: "Dr. Raj Patel (Cardiologist)",
    status: "Normal",
    icon: "💓",
    color: "#00ff9d",
    summary: "Normal sinus rhythm. No ST-T segment changes. No evidence of ischaemia, conduction defect, or arrhythmia. ECG within normal limits for age and gender.",
    findings: [
      { organ: "Heart Rate", result: "72 beats per minute — Normal" },
      { organ: "Rhythm", result: "Regular sinus rhythm" },
      { organ: "Electrical Axis", result: "Normal axis at 60°" },
      { organ: "P Wave", result: "Normal duration (100 ms) and morphology. Upright in I, II, aVF." },
      { organ: "PR Interval", result: "168 ms — within normal limits (120–200 ms)" },
      { organ: "QRS Duration", result: "88 ms — normal (< 120 ms). No bundle branch block." },
      { organ: "ST Segment", result: "No ST elevation or depression in any lead" },
      { organ: "T Wave", result: "Normal morphology. No inversion. No peaked T waves." },
      { organ: "QTc Interval", result: "408 ms — normal (< 450 ms male)" },
      { organ: "Impression", result: "Normal 12-Lead ECG. No cardiac abnormality detected." },
    ],
  },
  {
    id: "CGH-XRAY-2026-0188",
    testName: "X-Ray Right Knee (AP & Lateral)",
    shortCode: "XRAY KNEE",
    category: "X-Ray / Radiograph",
    sampleType: "N/A – Radiograph",
    collectedOn: "Mar 03, 2026 · 10:15 AM",
    reportedOn: "Mar 03, 2026 · 11:30 AM",
    referredBy: "Dr. Arvind Sharma",
    department: "Orthopaedics – OPD 8",
    conductedAt: "X-Ray Suite 2, Radiology Dept., Second Floor",
    technician: "Mr. Suresh Nair (Rad. Tech)",
    validatedBy: "Dr. Meera Kapoor (Radiologist)",
    status: "Borderline",
    icon: "🦴",
    color: "#fbbf24",
    summary: "Mild medial compartment joint space narrowing noted in the right knee, consistent with early Grade I–II osteoarthritis. No fracture, dislocation, or soft tissue calcification seen.",
    xrayMeta: { view: "AP & Lateral", region: "Right Knee", kV: "60 kVp", mAs: "8 mAs", film: "Digital CR", SID: "100 cm" },
    findings: [
      { organ: "Joint Space", result: "Mild narrowing of the medial tibiofemoral compartment. Lateral compartment preserved." },
      { organ: "Articular Surfaces", result: "Marginal osteophytes at medial femoral condyle and medial tibial plateau." },
      { organ: "Patellofemoral Joint", result: "Normal alignment. No patellar subluxation." },
      { organ: "Bone Density", result: "Adequate. No osteoporosis pattern identified." },
      { organ: "Soft Tissues", result: "No swelling or soft tissue calcification." },
      { organ: "Tibial Spine", result: "Mild sharpening of intercondylar tibial spines." },
      { organ: "Fibula", result: "Intact. No fracture or periosteal reaction." },
      { organ: "Impression", result: "Early osteoarthritis right knee — Grade I–II (Kellgren–Lawrence scale). Physiotherapy and weight management advised. Repeat X-ray in 6 months if symptomatic." },
    ],
  },
  {
    id: "CGH-XRAY-2026-0189",
    testName: "X-Ray Lumbar Spine (AP & Lateral)",
    shortCode: "XRAY LS",
    category: "X-Ray / Radiograph",
    sampleType: "N/A – Radiograph",
    collectedOn: "Mar 03, 2026 · 10:45 AM",
    reportedOn: "Mar 03, 2026 · 12:00 PM",
    referredBy: "Dr. Arvind Sharma",
    department: "Orthopaedics – OPD 8",
    conductedAt: "X-Ray Suite 2, Radiology Dept., Second Floor",
    technician: "Mr. Suresh Nair (Rad. Tech)",
    validatedBy: "Dr. Meera Kapoor (Radiologist)",
    status: "Abnormal",
    icon: "🩻",
    color: "#ff6b6b",
    summary: "Reduced disc space at L4-L5 and L5-S1 levels with marginal osteophyte formation — consistent with degenerative disc disease. Vertebral alignment maintained. No fracture or spondylolisthesis.",
    xrayMeta: { view: "AP & Lateral", region: "Lumbar Spine (L1–S1)", kV: "80 kVp", mAs: "20 mAs", film: "Digital CR", SID: "100 cm" },
    findings: [
      { organ: "Vertebral Alignment", result: "Maintained. No spondylolisthesis or scoliosis." },
      { organ: "Vertebral Bodies", result: "L4, L5, S1 show mild end-plate sclerosis. Heights maintained." },
      { organ: "Disc Spaces", result: "Reduced at L4-L5 and L5-S1. Anterior and posterior marginal osteophytes." },
      { organ: "Pedicles", result: "Intact at all levels. No erosion or destruction." },
      { organ: "Facet Joints", result: "Mild degenerative changes at L4-L5 and L5-S1 facet joints." },
      { organ: "Sacroiliac Joints", result: "Normal bilaterally. No sacroiliitis." },
      { organ: "Paraspinal Soft Tissue", result: "No abnormal calcification or paraspinal mass." },
      { organ: "Impression", result: "Degenerative disc disease L4-L5 and L5-S1. MRI lumbar spine recommended for further evaluation of disc herniation or nerve root compression." },
    ],
  },
  {
    id: "CGH-XRAY-2025-0991",
    testName: "X-Ray Left Hand & Wrist (PA View)",
    shortCode: "XRAY HAND",
    category: "X-Ray / Radiograph",
    sampleType: "N/A – Radiograph",
    collectedOn: "Nov 14, 2025 · 2:00 PM",
    reportedOn: "Nov 14, 2025 · 3:30 PM",
    referredBy: "Dr. Priya Nair",
    department: "Endocrinology – OPD 4",
    conductedAt: "X-Ray Suite 1, Radiology Dept., Second Floor",
    technician: "Ms. Anita Roy (Rad. Tech)",
    validatedBy: "Dr. Meera Kapoor (Radiologist)",
    status: "Normal",
    icon: "🖐",
    color: "#00c8ff",
    summary: "No acute fracture, dislocation, or bony lesion detected. Bone density and joint spaces appear normal. X-ray performed to assess bone health and exclude metabolic bone disease in context of thyroid disorder.",
    xrayMeta: { view: "PA View", region: "Left Hand & Wrist", kV: "55 kVp", mAs: "5 mAs", film: "Digital CR", SID: "100 cm" },
    findings: [
      { organ: "Carpal Bones", result: "All 8 carpal bones visible and intact. No fracture or avascular necrosis." },
      { organ: "Metacarpals", result: "Normal length, alignment, and cortical thickness." },
      { organ: "Phalanges", result: "All phalanges intact. No periosteal reaction or erosion." },
      { organ: "Wrist Joint", result: "Normal joint space. No carpal instability pattern." },
      { organ: "Radiocarpal Joint", result: "Maintained joint space. No arthritic changes." },
      { organ: "Bone Density", result: "Normal cortical thickness. No osteoporosis pattern at this site." },
      { organ: "Soft Tissues", result: "Normal. No foreign body or calcification." },
      { organ: "Impression", result: "Normal X-ray left hand and wrist. No fracture, dislocation, or metabolic bone disease identified." },
    ],
  },
];


const statusMeta = (s) => ({
  Normal: { color: "#00ff9d", bg: "rgba(0,255,157,.12)", border: "rgba(0,255,157,.25)" },
  Borderline: { color: "#fbbf24", bg: "rgba(251,191,36,.12)", border: "rgba(251,191,36,.25)" },
  Abnormal: { color: "#ff6b6b", bg: "rgba(255,107,107,.12)", border: "rgba(255,107,107,.25)" },
  Pending: { color: "#a78bfa", bg: "rgba(167,139,250,.12)", border: "rgba(167,139,250,.25)" },
}[s] || { color: "#00c8ff", bg: "rgba(0,200,255,.12)", border: "rgba(0,200,255,.25)" });

const flagMeta = (f) => ({
  H: { color: "#ff6b6b", label: "HIGH" },
  L: { color: "#fbbf24", label: "LOW" },
  N: { color: "rgba(255,255,255,.4)", label: "NORM" },
}[f] || { color: "rgba(255,255,255,.4)", label: "—" });


const downloadReport = (r, hospProp, patProp) => {
  const hospital = { ...HOSPITAL, ...(hospProp || {}) };
  const patient = { ...PATIENT, ...(patProp || {}) };
  
  const cleanStr = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/µ/g, "u")
      .replace(/°/g, "deg")
      .replace(/–/g, "-") 
      .replace(/—/g, "-")
      .replace(/[^\x00-\x7F]/g, ""); // Strip other unprintable Unicode causing %%% in Courier
  };

  const bar = "-".repeat(56);
  const linesText = [
    "==========================================================",
    "             HOSPITAL DIAGNOSTIC TEST REPORT              ",
    "==========================================================",
    "",
    `  ${hospital.name}`,
    `  ${hospital.lab}`,
    `  ${hospital.address}`,
    `  Tel : ${hospital.phone}   Reg: ${hospital.regNo}`,
    `  Lab Licence : ${hospital.labLic}`,
    "",
    bar,
    "  PATIENT INFORMATION",
    bar,
    `  Name        : ${patient.name || ''}`,
    `  Patient ID  : ${patient.id || ''}`,
    `  UHID        : ${patient.uhid || ''}`,
    `  DOB / Age   : ${patient.dob || patient.dateOfBirt || ''} / ${patient.age || ''}`,
    `  Gender      : ${patient.gender || ''}   Blood Group: ${patient.blood || patient.bloodType || ''}`,
    `  Ward        : ${patient.ward || ''}`,
    `  Phone       : ${patient.phone || patient.emergency || ''}`,
    "",
    bar,
    "  TEST INFORMATION",
    bar,
    `  Report ID     : ${r.id}`,
    `  Test Name     : ${r.testName}`,
    `  Category      : ${r.category}`,
    `  Sample Type   : ${r.sampleType}`,
    `  Collected On  : ${r.collectedOn}`,
    `  Reported On   : ${r.reportedOn}`,
    `  Referred By   : ${r.referredBy}`,
    `  Department    : ${r.department}`,
    `  Conducted At  : ${r.conductedAt}`,
    `  Technician    : ${r.technician}`,
    `  Validated By  : ${r.validatedBy}`,
    `  Result Status : ${r.status}`,
    ...(r.xrayMeta ? [
      "",
      bar,
      "  X-RAY TECHNICAL PARAMETERS",
      bar,
      `  View / Projection  : ${r.xrayMeta.view}`,
      `  Region Examined    : ${r.xrayMeta.region}`,
      `  Tube Voltage       : ${r.xrayMeta.kV}`,
      `  Tube Current       : ${r.xrayMeta.mAs}`,
      `  Film / Detector    : ${r.xrayMeta.film}`,
      `  Source-Image Dist  : ${r.xrayMeta.SID}`,
    ] : []),
    "",
    bar,
    "  CLINICAL SUMMARY",
    bar,
    `  ${r.summary}`,
    "",
    ...(r.parameters ? [
      bar,
      "  TEST PARAMETERS",
      bar,
      `  ${"PARAMETER".padEnd(36)} ${"VALUE".padStart(8)}  ${"UNIT".padEnd(16)} ${"REF RANGE".padEnd(18)} FLAG`,
      bar,
      ...r.parameters.map(p =>
        `  ${p.test.padEnd(36)} ${p.value.padStart(8)}  ${p.unit.padEnd(16)} ${p.refRange.padEnd(18)} [${flagMeta(p.flag).label}]`
      ),
    ] : [
      bar,
      "  FINDINGS",
      bar,
      ...r.findings.map(f => `  ${(f.organ + ":").padEnd(22)} ${f.result}`),
    ]),
    "",
    bar,
    "  * Report generated electronically from CGH Patient Portal.",
    "  * This report is valid only with the signature/stamp of the",
    "    reporting pathologist / radiologist.",
    "  * For queries contact: " + hospital.phone,
    "",
    "==========================================================",
    "         City General Hospital — Diagnostic Centre        ",
    "==========================================================",
  ];

  const doc = new jsPDF();
  doc.setFont("courier", "normal");
  doc.setFontSize(9);

  const splitText = doc.splitTextToSize(linesText.map(cleanStr).join("\n"), 180);
  let y = 15;
  for (let i = 0; i < splitText.length; i++) {
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
    doc.text(splitText[i], 15, y);
    y += 4.5;
  }

  doc.save(`${r.id}.pdf`);
};


const ReportModal = ({ r, hospitalProp, patientProp, onClose }) => {
  const sm = statusMeta(r.status);
  const hospital = { ...HOSPITAL, ...(hospitalProp || {}) };
  const p = { ...PATIENT, ...(patientProp || {}) };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.84)", backdropFilter: "blur(14px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.2rem", animation: "fadeUp .2s both" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "linear-gradient(155deg,#0c1d34,#060f1e)", border: `1px solid ${r.color}30`, borderRadius: 22, width: "100%", maxWidth: 720, maxHeight: "92vh", overflowY: "auto", position: "relative" }}>

        {}
        <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: r.color, filter: "blur(90px)", opacity: .07, pointerEvents: "none" }} />

        {}
        <div style={{ position: "sticky", top: 0, zIndex: 2, background: "#0c1d34", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "1.3rem 1.8rem 1rem", borderRadius: "22px 22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${r.color}18`, border: `1px solid ${r.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>{r.testName}</div>
                <div style={{ fontSize: ".64rem", color: "rgba(255,255,255,.36)", marginTop: 2 }}>{r.id} · {r.category}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
                  <span style={{ padding: "2px 10px", borderRadius: 50, background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`, fontSize: ".6rem", fontWeight: 700 }}>● {r.status}</span>
                  <span style={{ fontSize: ".62rem", color: "rgba(255,255,255,.3)" }}>{r.referredBy}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: ".85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "1.4rem 1.8rem" }}>

          {}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem", marginBottom: "1.2rem" }}>
            <div style={{ padding: "12px 14px", borderRadius: 13, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".58rem", fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>🏥 Conducted At</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{hospital.name}</div>
              <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.35)", marginBottom: 2 }}>{r.conductedAt}</div>
              <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginBottom: 2 }}>{r.technician}</div>
              <div style={{ fontSize: ".64rem", color: r.color, marginTop: 4, fontWeight: 600 }}>Validated: {r.validatedBy}</div>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 13, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".58rem", fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>👤 Patient</div>
              {[
                { l: "Name", v: p.name || '' },
                { l: "ID", v: p.id || '' },
                { l: "UHID", v: p.uhid || '' },
                { l: "Age/Sex", v: `${p.age || ''} / ${p.gender || ''}` },
                { l: "Blood", v: p.blood || p.bloodType || '', c: "#ff6b6b" },
                { l: "Ward", v: p.ward || '' },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: ".6rem", color: "rgba(255,255,255,.28)" }}>{l}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, color: c || "rgba(255,255,255,.75)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".7rem", marginBottom: "1.1rem" }}>
            {[
              { label: "Sample Type", value: r.sampleType },
              { label: "Collected On", value: r.collectedOn },
              { label: "Reported On", value: r.reportedOn },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ fontSize: ".57rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: "rgba(255,255,255,.78)" }}>{value}</div>
              </div>
            ))}
          </div>

          {}
          {r.xrayMeta && (
            <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(0,200,255,.05)", border: "1px solid rgba(0,200,255,.18)", marginBottom: "1.1rem" }}>
              <div style={{ fontSize: ".58rem", color: "#00c8ff", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                🦴 X-Ray Technical Parameters
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".55rem" }}>
                {[
                  { label: "View / Projection", value: r.xrayMeta.view },
                  { label: "Region Examined", value: r.xrayMeta.region },
                  { label: "Tube Voltage", value: r.xrayMeta.kV },
                  { label: "Tube Current (mAs)", value: r.xrayMeta.mAs },
                  { label: "Film / Detector", value: r.xrayMeta.film },
                  { label: "Source-Image Dist.", value: r.xrayMeta.SID },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ fontSize: ".55rem", color: "rgba(255,255,255,.26)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: "#00c8ff" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          <div style={{ padding: "12px 15px", borderRadius: 12, background: `${r.color}0b`, border: `1px solid ${r.color}22`, marginBottom: "1.2rem" }}>
            <div style={{ fontSize: ".58rem", color: r.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 5 }}>📝 Clinical Summary</div>
            <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.72)", lineHeight: 1.75 }}>{r.summary}</div>
          </div>

          {}
          {r.parameters && (
            <>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>
                🧬 Test Parameters
                <span style={{ marginLeft: "auto", fontSize: ".58rem", color: "rgba(255,107,107,.6)", fontWeight: 600 }}>🔴 = High &nbsp; 🟡 = Low</span>
              </div>
              {}
              <div style={{ display: "grid", gridTemplateColumns: "2.2fr 80px 110px 130px 62px", gap: 8, padding: "5px 12px", marginBottom: 4 }}>
                {["Parameter", "Value", "Unit", "Reference", "Flag"].map(h => (
                  <span key={h} style={{ fontSize: ".56rem", fontWeight: 700, color: "rgba(255,255,255,.2)", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "1.2rem" }}>
                {r.parameters.map((p, i) => {
                  const fm = flagMeta(p.flag);
                  const isAbnormal = p.flag !== "N";
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2.2fr 80px 110px 130px 62px", gap: 8, alignItems: "center", padding: "9px 12px", borderRadius: 9, background: isAbnormal ? `${fm.color}08` : "rgba(255,255,255,.025)", border: `1px solid ${isAbnormal ? fm.color + "22" : "rgba(255,255,255,.05)"}` }}>
                      <span style={{ fontSize: ".74rem", color: isAbnormal ? "#fff" : "rgba(255,255,255,.65)" }}>{p.test}</span>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 800, color: fm.color }}>{p.value}</span>
                      <span style={{ fontSize: ".66rem", color: "rgba(255,255,255,.38)" }}>{p.unit}</span>
                      <span style={{ fontSize: ".63rem", color: "rgba(255,255,255,.3)" }}>{p.refRange}</span>
                      <span style={{ padding: "3px 8px", borderRadius: 50, background: `${fm.color}15`, color: fm.color, border: `1px solid ${fm.color}28`, fontSize: ".58rem", fontWeight: 700, textAlign: "center" }}>{fm.label}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {}
          {r.findings && (
            <>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 7 }}>
                🩻 Radiological Findings
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: "1.2rem" }}>
                {r.findings.map((f, i) => {
                  const isImpression = f.organ === "Impression";
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12, padding: "9px 13px", borderRadius: 9, background: isImpression ? `${r.color}0c` : "rgba(255,255,255,.025)", border: `1px solid ${isImpression ? r.color + "30" : "rgba(255,255,255,.05)"}` }}>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, color: isImpression ? r.color : "rgba(255,255,255,.48)" }}>{f.organ}</span>
                      <span style={{ fontSize: ".74rem", color: isImpression ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.58)", lineHeight: 1.5 }}>{f.result}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {}
          <button onClick={() => downloadReport(r, hospital, p)}
            style={{ width: "100%", padding: "11px", borderRadius: 11, background: "rgba(0,200,255,.09)", border: "1px solid rgba(0,200,255,.25)", color: "#00c8ff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, letterSpacing: ".05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all .2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(0,200,255,.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(0,200,255,.09)"}>
            ⬇️ Download Report
          </button>
        </div>
      </div>
    </div>
  );
};


const ReportCard = ({ r, idx, hospitalProp, patientProp, onView }) => {
  const sm = statusMeta(r.status);
  return (
    <div style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${r.color}18`, borderRadius: 18, padding: "1.15rem", position: "relative", overflow: "hidden", animation: "fadeUp .35s both", animationDelay: `${idx * .06}s`, transition: "border-color .2s,box-shadow .2s", cursor: "default" }}
      onMouseOver={e => { e.currentTarget.style.borderColor = `${r.color}35`; e.currentTarget.style.boxShadow = `0 0 26px ${r.color}10`; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = `${r.color}18`; e.currentTarget.style.boxShadow = "none"; }}>

      {}
      <div style={{ position: "absolute", top: -25, right: -25, width: 110, height: 110, borderRadius: "50%", background: r.color, filter: "blur(48px)", opacity: .1, pointerEvents: "none" }} />

      {}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: ".85rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: `${r.color}18`, border: `1px solid ${r.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>{r.icon}</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".88rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{r.testName}</div>
            <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.32)", marginTop: 2 }}>{r.category}</div>
          </div>
        </div>
        <span style={{ padding: "3px 9px", borderRadius: 50, background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`, fontSize: ".6rem", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>● {r.status}</span>
      </div>

      {}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".45rem", marginBottom: ".8rem" }}>
        {[
          { l: "Report ID", v: r.id },
          { l: "Date", v: r.reportedOn ? r.reportedOn.split(" · ")[0] : "" },
          { l: "Referred By", v: r.referredBy || "" },
          { l: "Department", v: r.department ? r.department.split(" – ")[0] : "" },
          { l: "Sample", v: r.sampleType || "" },
          { l: "Conducted At", v: r.conductedAt ? r.conductedAt.split(",")[0] : "" },
        ].map(({ l, v }) => (
          <div key={l}>
            <div style={{ fontSize: ".54rem", color: "rgba(255,255,255,.22)", textTransform: "uppercase", letterSpacing: ".07em" }}>{l}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.68)", marginTop: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{v}</div>
          </div>
        ))}
      </div>

      {}
      <div style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)", marginBottom: ".85rem" }}>
        <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.45)", lineHeight: 1.55, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.summary}</div>
      </div>

      {}
      {r.xrayMeta && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: ".7rem" }}>
          {[
            { label: r.xrayMeta.view, icon: "📐" },
            { label: r.xrayMeta.kV, icon: "⚡" },
            { label: r.xrayMeta.film, icon: "🎞" },
          ].map(({ label, icon }) => (
            <span key={label} style={{ padding: "2px 9px", borderRadius: 50, background: "rgba(0,200,255,.08)", border: "1px solid rgba(0,200,255,.2)", color: "#00c8ff", fontSize: ".6rem", fontWeight: 600 }}>
              {icon} {label}
            </span>
          ))}
        </div>
      )}

      {}
      {r.parameters && r.parameters.some(p => p.flag !== "N") && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: ".75rem" }}>
          {r.parameters.filter(p => p.flag !== "N").map(p => (
            <span key={p.test} style={{ padding: "2px 8px", borderRadius: 50, background: "rgba(255,107,107,.1)", border: "1px solid rgba(255,107,107,.22)", color: "#ff9999", fontSize: ".58rem", fontWeight: 600 }}>
              ↑ {p.test.split(" ")[0]} {p.value} {p.unit}
            </span>
          ))}
        </div>
      )}

      {}
      <div style={{ display: "flex", gap: 7 }}>
        <button onClick={() => onView(r)}
          style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 10, background: `${r.color}0f`, border: `1px solid ${r.color}28`, color: r.color, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".04em", transition: "all .18s" }}
          onMouseOver={e => e.currentTarget.style.background = `${r.color}22`}
          onMouseOut={e => e.currentTarget.style.background = `${r.color}0f`}>
          👁 View Report
        </button>
        <button onClick={() => downloadReport(r, hospitalProp, patientProp)}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 0", borderRadius: 10, background: "rgba(0,200,255,.08)", border: "1px solid rgba(0,200,255,.2)", color: "#00c8ff", cursor: "pointer", fontSize: ".7rem", fontWeight: 700, transition: "all .18s" }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(0,200,255,.18)"}
          onMouseOut={e => e.currentTarget.style.background = "rgba(0,200,255,.08)"}>
          ⬇️
        </button>
      </div>
    </div>
  );
};


export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [viewRpt, setViewRpt] = useState(null);
  const [time, setTime] = useState(new Date());

  const [reports, setReports] = useState(REPORTS);
  const [hospital, setHospital] = useState(HOSPITAL);
  const [patient, setPatient] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    let unsubscribe = () => {};

    const authUnsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsubscribe = subscribeToReports(user.uid, (fetchedReports) => {
          if (fetchedReports && fetchedReports.length > 0) setReports(fetchedReports);
        });
        fetchHospitalInfo().then(res => {
          if (res && res.success && res.data) setHospital(prev => ({ ...prev, ...res.data }));
        }).catch(err => console.error(err));

        getDoc(doc(db, "users", user.uid)).then(snap => {
          if (snap.exists()) setPatient({ id: user.uid, ...snap.data() });
        }).catch(err => console.error("Patient fetch error:", err));
      }
    });

    return () => {
      clearInterval(id);
      unsubscribe();
      authUnsub();
    };
  }, []);

  const isLab = r => (r.category || "") !== "Radiology / Imaging" && (r.category || "") !== "Cardiology / Electrophysiology" && (r.category || "") !== "X-Ray / Radiograph";
  const isRad = r => r.category === "Radiology / Imaging" || r.category === "Cardiology / Electrophysiology";
  const isXray = r => r.category === "X-Ray / Radiograph";

  const filtered = reports.filter(r => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "lab" && isLab(r)) ||
      (activeTab === "radiology" && isRad(r)) ||
      (activeTab === "xray" && isXray(r)) ||
      (activeTab === "abnormal" && r.status === "Abnormal") ||
      (activeTab === "borderline" && r.status === "Borderline");
    const q = search.toLowerCase();
    const matchSearch = !q || 
      (r.testName || "").toLowerCase().includes(q) || 
      (r.id || "").toLowerCase().includes(q) || 
      (r.referredBy || "").toLowerCase().includes(q) || 
      (r.department || "").toLowerCase().includes(q) || 
      (r.category || "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const labCnt = reports.filter(isLab).length;
  const radCnt = reports.filter(isRad).length;
  const xrayCnt = reports.filter(isXray).length;
  const abnCnt = reports.filter(r => r.status === "Abnormal").length;
  const brdCnt = reports.filter(r => r.status === "Borderline").length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.09)}60%{transform:scale(1)}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:#050f1f}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        .vp{display:flex;height:100vh;overflow:hidden;background:#050f1f}

        /* ── SIDEBAR (exact dashboard match) ── */
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
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor;transition:all .3s}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none;transition:opacity .2s}
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

        /* ── MAIN LAYOUT ── */
        .vp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .vp-topbar{display:flex;align-items:center;justify-content:space-between;padding:.9rem 1.8rem;background:rgba(5,15,31,.96);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;backdrop-filter:blur(10px)}
        .vp-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:800;color:#fff}
        .vp-sub{font-size:.72rem;color:rgba(255,255,255,.32);margin-top:1px}
        .vp-topright{display:flex;align-items:center;gap:12px}
        .live-pill{display:flex;align-items:center;gap:7px;padding:6px 14px;background:rgba(0,255,157,.07);border:1px solid rgba(0,255,157,.2);border-radius:50px}
        .live-dot{width:7px;height:7px;border-radius:50%;background:#00ff9d;box-shadow:0 0 8px #00ff9d;animation:blink 1s step-start infinite;flex-shrink:0}
        .live-pill span{font-size:.7rem;color:#00ff9d;font-weight:700;letter-spacing:.06em}
        .time-txt{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700;color:#00c8ff}
        .hosp-bar{display:flex;align-items:center;gap:14px;padding:9px 1.8rem;background:rgba(255,255,255,.018);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0}
        .vp-tabs{display:flex;align-items:center;gap:4px;padding:.8rem 1.8rem .6rem;border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;background:rgba(5,15,31,.7);flex-wrap:wrap;gap:4px}
        .vp-tab{padding:7px 15px;border-radius:9px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;transition:all .2s;background:transparent;color:rgba(255,255,255,.35)}
        .vp-tab:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .vp-tab.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);color:#00c8ff}
        .vp-content{flex:1;overflow-y:auto;padding:1.4rem 1.8rem}
        .report-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem}
        @media(max-width:768px){.sidebar{display:none}.vp-content{padding:1rem}.report-grid{grid-template-columns:1fr}.hosp-bar{padding:.6rem 1rem}}
      `}</style>

      <div className="vp">

        <Sidebar active="reports" />

        {}
        <div className="vp-main">

          {}
          <div className="vp-topbar">
            <div>
              <div className="vp-title">📋 My Test Reports</div>
              <div className="vp-sub">Lab & diagnostic tests conducted at {(hospital || HOSPITAL).name}</div>
            </div>
            <div className="vp-topright">
              <div className="live-pill"><div className="live-dot" /><span>LIVE</span></div>
              <span className="time-txt">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          {}
          <div className="hosp-bar">
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(0,200,255,.1)", border: "1px solid rgba(0,200,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>🏥</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".84rem", fontWeight: 800, color: "#fff" }}>{(hospital || HOSPITAL).name} — {(hospital || HOSPITAL).lab}</div>
              <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>{(hospital || HOSPITAL).address} · {(hospital || HOSPITAL).phone} · Lab Lic: {(hospital || HOSPITAL).labLic}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: ".58rem", color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".08em" }}>Patient UHID</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#00c8ff" }}>{patient ? (patient.uhid || "Not Assigned") : PATIENT.uhid}</div>
            </div>
          </div>

          {}
          <div className="vp-tabs">
            {[
              { key: "all", label: `All (${reports.length})` },
              { key: "lab", label: `Lab Tests (${labCnt})` },
              { key: "radiology", label: `Radiology & ECG (${radCnt})` },
              { key: "xray", label: `X-Ray (${xrayCnt})` },
              { key: "abnormal", label: `Abnormal (${abnCnt})` },
              { key: "borderline", label: `Borderline (${brdCnt})` },
            ].map(({ key, label }) => (
              <button key={key} className={`vp-tab${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
            ))}
            <div style={{ marginLeft: "auto", position: "relative" }}>
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: ".7rem", color: "rgba(255,255,255,.3)" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search test, doctor, dept…"
                style={{ paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6, borderRadius: 8, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", fontSize: ".72rem", fontFamily: "'DM Sans',sans-serif", outline: "none", width: 210 }} />
            </div>
          </div>

          {}
          <div className="vp-content">

            {}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: ".75rem", marginBottom: "1.3rem" }}>
              {[
                { icon: "📋", label: "Total Reports", value: reports.length, color: "#00c8ff" },
                { icon: "🧪", label: "Lab Tests", value: labCnt, color: "#a78bfa" },
                { icon: "🩻", label: "Imaging & ECG", value: radCnt, color: "#fbbf24" },
                { icon: "🦴", label: "X-Ray Reports", value: xrayCnt, color: "#00c8ff" },
                { icon: "⚠️", label: "Needs Attention", value: abnCnt + brdCnt, color: "#ff6b6b" },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${color}1e`, borderRadius: 13, padding: ".9rem 1rem", display: "flex", alignItems: "center", gap: 10, animation: "fadeUp .3s both" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}26`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: ".58rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".07em", marginTop: 3 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {}
            {filtered.length > 0
              ? <div className="report-grid">
                {filtered.map((r, i) => <ReportCard key={r.id} r={r} idx={i} hospitalProp={hospital} patientProp={patient} onView={setViewRpt} />)}
              </div>
              : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem", color: "rgba(255,255,255,.18)" }}>
                <div style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>📋</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700 }}>No reports found</div>
                <div style={{ fontSize: ".75rem", marginTop: 4 }}>Try changing the filter or search term</div>
              </div>
            }
          </div>
        </div>
      </div>

      {viewRpt && <ReportModal r={viewRpt} hospitalProp={hospital} patientProp={patient} onClose={() => setViewRpt(null)} />}
    </>
  );
}
