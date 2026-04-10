// routes/vitals.routes.js
import express from "express";
import {
  updateVitals,
  getLatestVitals,
  getVitalsHistory,
  getSparklineData,
  getWeekComparison,
} from "../controllers/vitals.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ NO token — ESP32 can't do Firebase auth
// PUT /api/vitals/update  ← ESP32 updates single "current" document
router.put("/update", updateVitals);

// ✅ Protected — patient must be logged in
router.get("/latest",          verifyToken, getLatestVitals);   // current live values
router.get("/history",         verifyToken, getVitalsHistory);  // history tab
router.get("/sparkline",       verifyToken, getSparklineData);  // sparkline charts
router.get("/week-comparison", verifyToken, getWeekComparison); // analysis tab

export default router;
