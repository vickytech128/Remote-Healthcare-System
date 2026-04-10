// routes/reports.routes.js
import express from "express";
import {
  getReports,
  getReportById,
  addReport,
  deleteReport,
  getHospitalInfo,
} from "../controllers/reports.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/",          verifyToken, getReports);      // GET  all reports + summary counts
router.get("/hospital",  verifyToken, getHospitalInfo); // GET  hospital info (HOSPITAL constant)
router.get("/:id",       verifyToken, getReportById);   // GET  single report (ReportModal)
router.post("/add",      verifyToken, addReport);       // POST add new report (doctor/lab)
router.delete("/:id",    verifyToken, deleteReport);    // DELETE remove report

export default router;
