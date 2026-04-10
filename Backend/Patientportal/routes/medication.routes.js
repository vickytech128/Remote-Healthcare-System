// routes/medication.routes.js
import express from "express";
import {
  getBills,
  getBillById,
  addBill,
  markBillPaid,
  getHospitalInfo,
  explainMedicine,
} from "../controllers/medication.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/bills",           verifyToken, getBills);         // GET  all bills (BILLS array)
router.get("/bills/:id",       verifyToken, getBillById);      // GET  single bill (ViewModal)
router.post("/bills/add",      verifyToken, addBill);          // POST add new bill (doctor)
router.put("/bills/:id/pay",   verifyToken, markBillPaid);     // PUT  mark bill as paid
router.get("/hospital",        verifyToken, getHospitalInfo);  // GET  hospital info (HOSPITAL)
router.post("/ai-explain",     verifyToken, explainMedicine);  // POST AI medicine explanation

export default router;
