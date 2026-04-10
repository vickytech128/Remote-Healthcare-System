import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Sidebar from "./Sidebar.jsx";
import { getAuth } from "firebase/auth";
import { fetchHospitalInfo, explainMedicineAI, subscribeToBills } from "../src/api/medicationApi.js";
import { db, doc, getDoc } from "../src/firebaseConfig.js";



const DEFAULT_HOSPITAL = {
  name: "City General Hospital",
  address: "14, MG Road, New Delhi – 110001",
  phone: "+91 11-2345-6789",
  email: "pharmacy@citygeneralhospital.in",
  gstin: "07AAACG1234F1ZK",
  regNo: "CGH-DL-2004-0041",
  logo: "🏥",
};

const PATIENT = {
  name: "Alex Johnson",
  id: "PAT-0042",
  dob: "14 Jun 1988",
  gender: "Male",
  blood: "O+",
  phone: "+91 98765-43210",
  ward: "Outpatient",
  uhid: "UHID-CGH-20240042",
};


const DEFAULT_BILLS = [
  {
    billNo: "CGH-RX-2026-0312",
    billDate: "Mar 01, 2026",
    doctor: "Dr. Sarah Mitchell",
    department: "Endocrinology",
    status: "Paid",
    paidOn: "Mar 01, 2026",
    payMode: "UPI",
    items: [
      { name: "Metformin HCl", dosage: "500 mg", form: "Tablet", qty: 60, unitPrice: 7.00, purpose: "Type 2 Diabetes" },
      { name: "Atorvastatin Calcium", dosage: "20 mg", form: "Tablet", qty: 30, unitPrice: 18.67, purpose: "Cholesterol Control" },
      { name: "Vitamin B12", dosage: "500 mcg", form: "Tablet", qty: 30, unitPrice: 4.50, purpose: "B12 Deficiency" },
    ],
    color: "#00ff9d",
  },
  {
    billNo: "CGH-RX-2026-0278",
    billDate: "Feb 12, 2026",
    doctor: "Dr. Raj Patel",
    department: "Cardiology",
    status: "Paid",
    paidOn: "Feb 12, 2026",
    payMode: "Card",
    items: [
      { name: "Amlodipine Besylate", dosage: "5 mg", form: "Tablet", qty: 30, unitPrice: 10.33, purpose: "Blood Pressure" },
      { name: "Aspirin", dosage: "75 mg", form: "Enteric Coated Tablet", qty: 30, unitPrice: 2.50, purpose: "Blood Thinning / Heart Protection" },
    ],
    color: "#00c8ff",
  },
  {
    billNo: "CGH-RX-2026-0341",
    billDate: "Mar 05, 2026",
    doctor: "Dr. Anand Kumar",
    department: "Gastroenterology",
    status: "Pending",
    paidOn: null,
    payMode: null,
    items: [
      { name: "Pantoprazole Sodium", dosage: "40 mg", form: "Enteric Coated Tablet", qty: 14, unitPrice: 13.21, purpose: "Acid Reflux / GERD" },
      { name: "Domperidone", dosage: "10 mg", form: "Tablet", qty: 14, unitPrice: 5.80, purpose: "Nausea & Bloating" },
    ],
    color: "#fbbf24",
  },
  {
    billNo: "CGH-RX-2026-0189",
    billDate: "Jan 20, 2026",
    doctor: "Dr. Priya Nair",
    department: "Endocrinology",
    status: "Paid",
    paidOn: "Jan 20, 2026",
    payMode: "Cash",
    items: [
      { name: "Levothyroxine Sodium", dosage: "50 mcg", form: "Tablet", qty: 90, unitPrice: 2.72, purpose: "Hypothyroidism" },
    ],
    color: "#ff6b6b",
  },
  {
    billNo: "CGH-RX-2025-1142",
    billDate: "Dec 08, 2025",
    doctor: "Dr. Sarah Mitchell",
    department: "Endocrinology",
    status: "Paid",
    paidOn: "Dec 08, 2025",
    payMode: "UPI",
    items: [
      { name: "Metformin HCl", dosage: "500 mg", form: "Tablet", qty: 60, unitPrice: 7.00, purpose: "Type 2 Diabetes" },
      { name: "Vitamin D3", dosage: "1000 IU", form: "Soft Gelatin Capsule", qty: 30, unitPrice: 6.33, purpose: "Vitamin D Deficiency" },
    ],
    color: "#a78bfa",
  },
];

const statusColor = (s) => ({ "Paid": "#00ff9d", "Pending": "#fbbf24", "Cancelled": "#ff6b6b" }[s] || "#00ff9d");
const billSubtotal = (bill) => Number(bill.subtotal !== undefined ? bill.subtotal : (bill.items || []).reduce((s, i) => s + (Number(i.qty) * Number(i.unitPrice)), 0));
const billTax = (bill) => Number(bill.tax !== undefined ? bill.tax : billSubtotal(bill) * 0.05);
const billTotalAmount = (bill) => Number(bill.totalAmount !== undefined ? bill.totalAmount : billSubtotal(bill) + billTax(bill));


const downloadBill = (bill, hospital, patientProp) => {
  try {
    const p = { ...PATIENT, ...(patientProp || {}) };
    const total = billSubtotal(bill);
    const tax = billTax(bill);
    const finalAmnt = billTotalAmount(bill);
  const linesText = [
    "==================================================",
    "          MEDICINE PURCHASE BILL RECEIPT          ",
    "==================================================",
    "",
    `  ${hospital.name}`,
    `  ${hospital.address}`,
    `  Phone : ${hospital.phone}`,
    `  Email : ${hospital.email}`,
    `  GSTIN : ${hospital.gstin}`,
    `  Reg No: ${hospital.regNo}`,
    "",
    "--------------------------------------------------",
    "  PATIENT DETAILS",
    "--------------------------------------------------",
    `  Name      : ${p.name || ''}`,
    `  Patient ID: ${p.id || ''}   UHID: ${p.uhid || ''}`,
    `  DOB       : ${p.dob || p.dateOfBirt || ''}   Blood: ${p.blood || p.bloodType || ''}`,
    `  Phone     : ${p.phone || p.emergency || ''}`,
    "",
    "  BILL DETAILS",
    "--------------------------------------------------",
    `  Bill No    : ${bill.billNo || ''}`,
    `  Bill Date  : ${bill.billDate || ''}`,
    `  Doctor     : ${bill.doctor || ''}`,
    `  Department : ${bill.department || ''}`,
    `  Status     : ${bill.status || ''}`,
    bill.paidOn ? `  Paid On    : ${bill.paidOn}  via ${bill.payMode}` : "",
    "",
    "--------------------------------------------------",
    "  MEDICINE DETAILS",
    "--------------------------------------------------",
    ...(bill.items || []).map((item, i) => {
      const qty = item.qty || 1;
      const up = item.unitPrice || 0;
      return [
        `  ${i + 1}. ${item.name || 'Medicine'}`,
        `     Dosage     : ${item.dosage || ''}`,
        `     Form       : ${item.form || ''}`,
        `     Qty        : ${qty} units  @  Rs.${Number(up).toFixed(2)} each`,
        `     Amount     : Rs.${(qty * up).toFixed(2)}`,
        `     For        : ${item.purpose || ''}`,
        "",
      ].join("\n");
    }),
    "--------------------------------------------------",
    `  Subtotal   :  Rs.${total.toFixed(2)}`,
    `  GST (5%)   :  Rs.${tax.toFixed(2)}`,
    `  ---------------------------------`,
    `  TOTAL      :  Rs.${finalAmnt.toFixed(2)}`,
    "--------------------------------------------------",
    "",
    "  Keep this receipt for insurance reimbursement.",
    "  For queries: " + hospital.phone,
    "",
    "==================================================",
    "             Thank you for your visit!            ",
    "==================================================",
  ].filter(l => l !== undefined);

  const doc = new jsPDF();
  doc.setFont("courier", "normal");
  doc.setFontSize(10);

  const splitText = doc.splitTextToSize(linesText.join("\n"), 180);
  let y = 15;
  for (let i = 0; i < splitText.length; i++) {
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
    doc.text(splitText[i], 15, y);
    y += 5;
  }

  doc.save(`${bill.billNo || 'Bill'}.pdf`);
  } catch (err) {
    console.error("PDF Download error:", err);
    alert("Could not download PDF. Check console for details.");
  }
};



const ViewModal = ({ bill, hospital, patientProp, onClose }) => {
  const p = { ...PATIENT, ...(patientProp || {}) };
  const [loadingItem, setLoadingItem] = useState(null);
  const [aiResults, setAiResults] = useState({});
  const [expandedItem, setExpandedItem] = useState(null);
  const total = billSubtotal(bill);
  const tax = billTax(bill);
  const finalAmnt = billTotalAmount(bill);

  const fetchAI = async (item) => {
    const key = item.name;
    if (aiResults[key]) { setExpandedItem(k => k === key ? null : key); return; }
    setLoadingItem(key);
    try {
      const res = await explainMedicineAI({
        name: item.name,
        dosage: item.dosage,
        form: item.form,
        purpose: item.purpose
      });
      if (res && res.success) {
        setAiResults(prev => ({ ...prev, [key]: res.data }));
      } else {
        throw new Error(res?.error || "Failed AI Expl");
      }
      setExpandedItem(key);
    } catch (e) {
      setAiResults(prev => ({
        ...prev,
        [key]: {
          purpose: `${item.name} is prescribed for ${item.purpose}. It helps manage your condition as recommended by your doctor.`,
          dosageGuide: `Take ${item.dosage} ${item.form.toLowerCase()} as directed by your doctor. Follow the prescription label carefully.`,
          tips: ["Take at the same time each day", "Do not skip doses", "Store in a cool dry place away from sunlight"],
          warning: "Consult your doctor immediately if you experience any allergic reactions or unusual side effects.",
        }
      }));
      setExpandedItem(key);
    }
    setLoadingItem(null);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.82)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.2rem", animation: "fadeUp .2s both" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "linear-gradient(160deg,#0b1a30,#060f1e)", border: `1px solid ${bill.color}30`, borderRadius: 22, width: "100%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>

        {}
        <div style={{ padding: "1.6rem 1.8rem 1.2rem", borderBottom: "1px solid rgba(255,255,255,.07)", position: "sticky", top: 0, background: "#0b1a30", zIndex: 2, borderRadius: "22px 22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${bill.color}18`, border: `1px solid ${bill.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>🏥</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>{hospital.name}</div>
                <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.38)", marginTop: 1 }}>{hospital.address}</div>
                <div style={{ fontSize: ".63rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>GSTIN: {hospital.gstin} · Reg: {hospital.regNo}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: ".85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "1.4rem 1.8rem" }}>

          {}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem", marginBottom: "1.2rem" }}>
            {}
            <div style={{ padding: "12px 14px", borderRadius: 13, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Bill Details</div>
              {[
                { label: "Bill No", value: bill.billNo },
                { label: "Date", value: bill.billDate },
                { label: "Doctor", value: bill.doctor },
                { label: "Department", value: bill.department },
                { label: "Status", value: bill.status, color: statusColor(bill.status) },
                ...(bill.paidOn ? [{ label: "Paid via", value: `${bill.payMode} · ${bill.paidOn}`, color: "#00ff9d" }] : []),
              ].map(({ label, value, color: c }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ fontSize: ".63rem", color: "rgba(255,255,255,.3)" }}>{label}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: c || "rgba(255,255,255,.75)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>
            {}
            <div style={{ padding: "12px 14px", borderRadius: 13, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Patient Details</div>
              {[
                { label: "Name", value: p.name || '' },
                { label: "Patient ID", value: p.id || '' },
                { label: "UHID", value: p.uhid || '' },
                { label: "DOB", value: p.dob || p.dateOfBirt || '' },
                { label: "Blood Group", value: p.blood || p.bloodType || '', color: "#ff6b6b" },
                { label: "Ward", value: p.ward || '' },
              ].map(({ label, value, color: c }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ fontSize: ".63rem", color: "rgba(255,255,255,.3)" }}>{label}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: c || "rgba(255,255,255,.75)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {}
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".65rem", fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: ".7rem", display: "flex", alignItems: "center", gap: 8 }}>
            <span>💊</span> Medicines Dispensed
            <span style={{ marginLeft: "auto", fontSize: ".6rem", color: "rgba(0,200,255,.55)", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>🤖 Click "AI Explain" for medicine details</span>
          </div>

          {}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", gap: 8, padding: "6px 12px", marginBottom: 4 }}>
            {["Medicine", "Dosage", "Qty", "Amount", ""].map(h => (
              <span key={h} style={{ fontSize: ".58rem", fontWeight: 700, color: "rgba(255,255,255,.22)", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1.2rem" }}>
            {bill.items.map((item) => {
              const ai = aiResults[item.name];
              const isLoading = loadingItem === item.name;
              const isOpen = expandedItem === item.name;

              return (
                <div key={item.name} style={{ borderRadius: 12, border: `1px solid ${isOpen ? bill.color + "35" : "rgba(255,255,255,.07)"}`, overflow: "hidden", transition: "border-color .2s" }}>
                  {}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", gap: 8, alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,.025)" }}>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#fff" }}>{item.name}</div>
                      <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.32)", marginTop: 1 }}>{item.form} · {item.purpose}</div>
                    </div>
                    <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.6)" }}>{item.dosage}</span>
                    <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.6)" }}>{item.qty} units</span>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: bill.color }}>₹{(item.qty * item.unitPrice).toFixed(2)}</span>
                    <button onClick={() => fetchAI(item)}
                      style={{ padding: "5px 8px", borderRadius: 7, background: isOpen ? "rgba(0,200,255,.18)" : "rgba(0,200,255,.08)", border: "1px solid rgba(0,200,255,.22)", color: "#00c8ff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, transition: "all .18s", whiteSpace: "nowrap" }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(0,200,255,.22)"}
                      onMouseOut={e => e.currentTarget.style.background = isOpen ? "rgba(0,200,255,.18)" : "rgba(0,200,255,.08)"}>
                      {isLoading ? "⟳ …" : isOpen ? "▲ Hide" : "🤖 AI"}
                    </button>
                  </div>

                  {}
                  {isOpen && ai && (
                    <div style={{ padding: "14px 16px", background: "linear-gradient(135deg,rgba(0,200,255,.03),rgba(167,139,250,.03))", borderTop: "1px solid rgba(0,200,255,.1)", animation: "fadeUp .22s both" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#0066ff,#00c8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", flexShrink: 0 }}>🤖</div>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".7rem", fontWeight: 700, color: "#00c8ff" }}>AI Pharmacist Explanation</span>
                        <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: 50, background: "rgba(0,255,157,.1)", border: "1px solid rgba(0,255,157,.2)", color: "#00ff9d", fontSize: ".56rem", fontWeight: 700 }}>AI</span>
                      </div>
                      {}
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: ".58rem", color: "#00c8ff", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>🎯 Purpose &amp; Why It's Prescribed</div>
                        <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.7)", lineHeight: 1.7, padding: "9px 11px", borderRadius: 9, background: "rgba(255,255,255,.03)" }}>{ai.purpose}</div>
                      </div>
                      {/* Dosage */}
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: ".58rem", color: "#ffd93d", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>⏰ How to Take {item.dosage}</div>
                        <div style={{ fontSize: ".76rem", color: "rgba(255,255,255,.7)", lineHeight: 1.7, padding: "9px 11px", borderRadius: 9, background: "rgba(255,255,255,.03)" }}>{ai.dosageGuide}</div>
                      </div>
                      {/* Tips */}
                      {ai.tips && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: ".58rem", color: "#00ff9d", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5, display: "flex", alignItems: "center", gap: 4 }}>💡 Tips</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {ai.tips.map((t, i) => (
                              <div key={i} style={{ display: "flex", gap: 7, padding: "6px 10px", borderRadius: 8, background: "rgba(0,255,157,.04)", border: "1px solid rgba(0,255,157,.1)" }}>
                                <span style={{ color: "#00ff9d", fontSize: ".7rem", flexShrink: 0 }}>✓</span>
                                <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Warning */}
                      {ai.warning && (
                        <div style={{ display: "flex", gap: 8, padding: "9px 11px", borderRadius: 9, background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.18)" }}>
                          <span style={{ fontSize: ".9rem", flexShrink: 0 }}>⚠️</span>
                          <div>
                            <div style={{ fontSize: ".58rem", color: "#fbbf24", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Warning</div>
                            <div style={{ fontSize: ".72rem", color: "rgba(255,191,36,.8)", lineHeight: 1.5 }}>{ai.warning}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── BILL TOTALS ── */}
          <div style={{ borderRadius: 14, border: `1px solid ${bill.color}22`, overflow: "hidden", marginBottom: "1rem" }}>
            {[
              { label: "Subtotal", value: `₹${total.toFixed(2)}`, muted: true },
              { label: "GST (5%)", value: `₹${tax.toFixed(2)}`, muted: true },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 16px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)" }}>{label}</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 600, color: "rgba(255,255,255,.5)" }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: `${bill.color}0c` }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: ".08em" }}>Total Paid</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.45rem", fontWeight: 800, color: bill.color }}>₹{finalAmnt.toFixed(2)}</span>
            </div>
          </div>

          {/* ── DOWNLOAD ── */}
          <button onClick={() => downloadBill(bill, hospital, p)}
            style={{ width: "100%", padding: "11px", borderRadius: 11, background: "rgba(0,200,255,.09)", border: "1px solid rgba(0,200,255,.25)", color: "#00c8ff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, letterSpacing: ".05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all .2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(0,200,255,.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(0,200,255,.09)"}>
            ⬇️ Download Bill Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   BILL ROW (list view)
══════════════════════════════════════ */
const BillRow = ({ bill, hospital, patientProp, idx, onView }) => {
  const finalAmnt = billTotalAmount(bill);
  const sc = statusColor(bill.status);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "40px 1.4fr 1fr 1fr 1fr 80px 80px 100px", gap: 10, alignItems: "center", padding: "12px 18px", borderRadius: 13, background: "rgba(255,255,255,.025)", border: `1px solid rgba(255,255,255,.06)`, transition: "background .18s,border-color .18s", animation: "fadeUp .3s both", animationDelay: `${idx * .06}s` }}
      onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = `${bill.color}28`; }}
      onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; }}>
      {/* index */}
      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${bill.color}15`, border: `1px solid ${bill.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, color: bill.color }}>{idx + 1}</div>
      {/* bill no + date */}
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, color: "#fff" }}>{bill.billNo}</div>
        <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.3)", marginTop: 1 }}>{bill.billDate}</div>
      </div>
      {/* doctor */}
      <div>
        <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.65)" }}>{bill.doctor}</div>
        <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>{bill.department}</div>
      </div>
      {/* medicines count */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {bill.items.map(i => (
          <span key={i.name} style={{ fontSize: ".6rem", padding: "2px 7px", borderRadius: 50, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.45)" }}>{i.name.split(" ")[0]}</span>
        ))}
      </div>
      {/* total */}
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".88rem", fontWeight: 800, color: bill.color }}>₹{finalAmnt.toFixed(2)}</div>
      {/* status */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 50, background: `${sc}15`, color: sc, border: `1px solid ${sc}25`, fontSize: ".6rem", fontWeight: 700, whiteSpace: "nowrap" }}>● {bill.status}</span>
      {/* pay mode */}
      <span style={{ fontSize: ".65rem", color: "rgba(255,255,255,.35)" }}>{bill.payMode || "—"}</span>
      {/* actions */}
      <div style={{ display: "flex", gap: 5 }}>
        <button onClick={() => onView(bill)}
          style={{ flex: 1, padding: "6px 8px", borderRadius: 8, background: `${bill.color}0f`, border: `1px solid ${bill.color}28`, color: bill.color, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".62rem", fontWeight: 700, transition: "all .18s" }}
          onMouseOver={e => e.currentTarget.style.background = `${bill.color}22`}
          onMouseOut={e => e.currentTarget.style.background = `${bill.color}0f`}>👁 View</button>
        <button onClick={() => downloadBill(bill, hospital, patientProp)}
          style={{ flex: 1, padding: "6px 8px", borderRadius: 8, background: "rgba(0,200,255,.07)", border: "1px solid rgba(0,200,255,.2)", color: "#00c8ff", cursor: "pointer", fontSize: ".62rem", fontWeight: 700, transition: "all .18s" }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(0,200,255,.16)"}
          onMouseOut={e => e.currentTarget.style.background = "rgba(0,200,255,.07)"}>⬇️</button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function MedicineBillsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [viewBill, setViewBill] = useState(null);
  const [time, setTime] = useState(new Date());

  const [bills, setBills] = useState(DEFAULT_BILLS);
  const [hospital, setHospital] = useState(DEFAULT_HOSPITAL);
  const [patient, setPatient] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    let unsubscribe = () => {};

    const authUnsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsubscribe = subscribeToBills(user.uid, (fetchedBills) => {
          if (fetchedBills && fetchedBills.length > 0) {
            setBills(fetchedBills);
          }
        });
        fetchHospitalInfo().then(res => {
          if (res && res.success && res.data) {
            setHospital(prev => ({ ...prev, ...res.data }));
          }
        }).catch(err => console.error(err));

        getDoc(doc(db, "users", user.uid)).then(snap => {
          if (snap.exists()) {
            setPatient({ id: user.uid, ...snap.data() });
          }
        }).catch(err => console.error("Patient fetch error:", err));
      }
    });

    return () => {
      clearInterval(id);
      unsubscribe();
      authUnsub();
    };
  }, []);

  const filtered = bills.filter(b => {
    const matchTab = activeTab === "all"
      || (activeTab === "paid" && b.status === "Paid")
      || (activeTab === "pending" && b.status === "Pending");
    const q = search.toLowerCase();
    const matchSearch = !q || b.billNo.toLowerCase().includes(q) || b.doctor.toLowerCase().includes(q) || b.department.toLowerCase().includes(q) || b.items.some(i => i.name.toLowerCase().includes(q));
    return matchTab && matchSearch;
  });

  const totalSpent = bills.filter(b => b.status === "Paid").reduce((s, b) => s + billTotalAmount(b), 0);
  const totalPending = bills.filter(b => b.status === "Pending").reduce((s, b) => s + billTotalAmount(b), 0);
  const grandTotal = bills.reduce((s, b) => s + billTotalAmount(b), 0);

  const p = { ...PATIENT, ...(patient || {}) };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:99px}
        .vp{display:flex;height:100vh;background:#050f1f;color:#fff;overflow:hidden;font-family:'DM Sans',sans-serif}
        .sidebar{width:58px;min-width:58px;background:rgba(5,12,25,.98);border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;align-items:center;padding:.9rem .5rem;gap:4px;transition:width .25s cubic-bezier(.16,1,.3,1),min-width .25s;overflow:hidden;flex-shrink:0}
        .sidebar.expanded{width:220px;min-width:220px;padding:.9rem .7rem}
        .sb-profile{display:flex;align-items:center;gap:10px;width:100%;padding:8px 4px;margin-bottom:.3rem;overflow:hidden;white-space:nowrap}
        .sb-avatar{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#0066ff,#00c8ff);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
        .sb-info{display:none;flex-direction:column}.sidebar.expanded .sb-info{display:flex}
        .sb-name{font-family:'Syne',sans-serif;font-size:.8rem;font-weight:700;color:#fff}
        .sb-role{font-size:.6rem;color:rgba(255,255,255,.35);margin-top:1px}
        .sb-toggle{width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .18s;align-self:flex-start}
        .sb-toggle:hover{background:rgba(255,255,255,.09)}
        .sb-lines{display:flex;flex-direction:column;gap:3.5px}
        .sb-line{width:16px;height:2px;border-radius:99px;background:rgba(255,255,255,.45)}
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:1px solid transparent;cursor:pointer;background:transparent;transition:all .18s;color:rgba(255,255,255,.45);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.8)}
        .sb-item.active{background:rgba(0,200,255,.1);border-color:rgba(0,200,255,.18);color:#00c8ff}
        .sb-icon{font-size:1.1rem;flex-shrink:0;width:24px;text-align:center}
        .sb-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}.sidebar.expanded .sb-label{display:block}
        .sb-bar{width:3px;height:16px;border-radius:99px;background:#00c8ff;box-shadow:0 0 8px #00c8ff;margin-left:auto;display:none}.sb-item.active .sb-bar{display:block}
        .sb-div{width:100%;height:1px;background:rgba(255,255,255,.06);margin:.4rem 0;flex-shrink:0}
        .sb-bot{display:flex;flex-direction:column;gap:4px;width:100%;flex-shrink:0}
        .sb-out{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:11px;border:1px solid rgba(255,80,80,.15);cursor:pointer;background:rgba(255,80,80,.05);color:rgba(255,100,100,.7);width:100%;white-space:nowrap;overflow:hidden;transition:all .2s}
        .sb-out:hover{background:rgba(255,80,80,.12);color:#ff6b6b}
        .sidebar.expanded .sb-out{justify-content:flex-start}
        .sb-out-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;display:none}.sidebar.expanded .sb-out-label{display:block}
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.8rem;background:rgba(5,15,31,.97);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;backdrop-filter:blur(10px)}
        .topbar-left{}
        .page-title{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;display:flex;align-items:center;gap:8px}
        .page-sub{font-size:.7rem;color:rgba(255,255,255,.3);margin-top:2px}
        .topbar-right{display:flex;align-items:center;gap:10px}
        .pill{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:50px;background:rgba(0,200,255,.07);border:1px solid rgba(0,200,255,.2)}
        .pill-dot{width:6px;height:6px;border-radius:50%;background:#00c8ff;box-shadow:0 0 6px #00c8ff;animation:blink 2s step-start infinite}
        .pill span{font-size:.66rem;color:#00c8ff;font-weight:700;letter-spacing:.06em}
        .clock{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;color:rgba(255,255,255,.35)}
        .hospital-banner{display:flex;align-items:center;gap:14px;padding:10px 1.8rem;background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0}
        .hosp-logo{width:36px;height:36px;border-radius:10px;background:rgba(0,200,255,.12);border:1px solid rgba(0,200,255,.2);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
        .hosp-name{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#fff}
        .hosp-addr{font-size:.62rem;color:rgba(255,255,255,.3);margin-top:1px}
        .tabs{display:flex;align-items:center;gap:4px;padding:.7rem 1.8rem .5rem;border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;background:rgba(5,15,31,.7)}
        .tab{padding:6px 14px;border-radius:8px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:.73rem;font-weight:700;letter-spacing:.04em;transition:all .2s;background:transparent;color:rgba(255,255,255,.32)}
        .tab:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .tab.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);color:#00c8ff}
        .content{flex:1;overflow-y:auto;padding:1.3rem 1.8rem}
        @media(max-width:768px){.sidebar{display:none}.content{padding:.9rem}.hospital-banner{padding:.6rem 1rem}}
      `}</style>

      <div className="vp">
        <Sidebar active="meds" />

        {/* ══ MAIN ══ */}
        <div className="main">
          {/* topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="page-title"><span>🧾</span> Medicine Bills</div>
              <div className="page-sub">Purchase receipts for {p.name} · {p.id}</div>
            </div>
            <div className="topbar-right">
              <div className="pill"><div className="pill-dot" /><span>SYNCED</span></div>
              <span className="clock">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          {/* hospital banner */}
          <div className="hospital-banner">
            <div className="hosp-logo">🏥</div>
            <div>
              <div className="hosp-name">{hospital.name}</div>
              <div className="hosp-addr">{hospital.address} · {hospital.phone} · GSTIN: {hospital.gstin}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".7rem", fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em" }}>Patient UHID</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".8rem", fontWeight: 700, color: "#00c8ff" }}>{p.uhid}</div>
              </div>
            </div>
          </div>

          {/* tabs + search */}
          <div className="tabs">
            {[
              { key: "all", label: `All Bills (${bills.length})` },
              { key: "paid", label: `Paid (${bills.filter(b => b.status === "Paid").length})` },
              { key: "pending", label: `Pending (${bills.filter(b => b.status === "Pending").length})` },
            ].map(({ key, label }) => (
              <button key={key} className={`tab${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
            ))}
            <div style={{ marginLeft: "auto", position: "relative" }}>
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: ".7rem", color: "rgba(255,255,255,.3)" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bills, doctor, medicine…"
                style={{ paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6, borderRadius: 8, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", fontSize: ".72rem", fontFamily: "'DM Sans',sans-serif", outline: "none", width: 230 }} />
            </div>
          </div>

          {/* content */}
          <div className="content">

            {/* summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: ".75rem", marginBottom: "1.3rem" }}>
              {[
                { icon: "🧾", label: "Total Bills", value: bills.length, color: "#00c8ff" },
                { icon: "✅", label: "Paid", value: bills.filter(b => b.status === "Paid").length, color: "#00ff9d" },
                { icon: "💰", label: "Amount Paid", value: `₹${totalSpent.toFixed(2)}`, color: "#a78bfa" },
                { icon: "⏳", label: "Pending", value: `₹${totalPending.toFixed(2)}`, color: "#fbbf24" },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${color}1e`, borderRadius: 13, padding: ".9rem 1rem", display: "flex", alignItems: "center", gap: 10, animation: "fadeUp .3s both" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}26`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: ".58rem", color: "rgba(255,255,255,.28)", textTransform: "uppercase", letterSpacing: ".07em", marginTop: 3 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* table header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1.4fr 1fr 1fr 1fr 80px 80px 100px", gap: 10, padding: "6px 18px", marginBottom: 6 }}>
              {["#", "Bill No / Date", "Doctor", "Medicines", "Amount", "Status", "Payment", "Actions"].map(h => (
                <span key={h} style={{ fontSize: ".58rem", fontWeight: 700, color: "rgba(255,255,255,.22)", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</span>
              ))}
            </div>

            {/* bill rows */}
            {filtered.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filtered.map((bill, i) => (
                  <BillRow key={bill.billNo} bill={bill} hospital={hospital} patientProp={patient} idx={i} onView={setViewBill} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem", color: "rgba(255,255,255,.18)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🧾</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".95rem", fontWeight: 700 }}>No bills found</div>
              </div>
            )}

            {/* grand total footer */}
            {filtered.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, marginTop: "1.2rem", padding: "12px 18px", borderRadius: 12, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)" }}>
                <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em" }}>Grand Total (all bills)</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#00c8ff" }}>₹{grandTotal.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewBill && <ViewModal bill={viewBill} hospital={hospital} patientProp={patient} onClose={() => setViewBill(null)} />}
    </>
  );
}
