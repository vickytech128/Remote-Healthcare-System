// routes/alerts.routes.js
import express from "express";
import {
  getAlerts,
  getUnreadAlerts,
  markAlertRead,
  markAllAlertsRead,
  deleteAlert,
  getAlertSettings,
  saveAlertSettings,
  toggleGlobalAlerts,
} from "../controllers/alerts.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// All routes protected — patient must be logged in
router.get("/",                  verifyToken, getAlerts);           // GET  all alerts (logItems)
router.get("/unread",            verifyToken, getUnreadAlerts);     // GET  unread only (showUnread panel)
router.put("/mark-all-read",     verifyToken, markAllAlertsRead);   // PUT  mark all as read
router.put("/:id/read",          verifyToken, markAlertRead);       // PUT  mark single alert as read
router.delete("/:id",            verifyToken, deleteAlert);         // DELETE single alert
router.get("/settings",          verifyToken, getAlertSettings);    // GET  alert settings (thresholds)
router.put("/settings",          verifyToken, saveAlertSettings);   // PUT  save alert settings
router.put("/global-toggle",     verifyToken, toggleGlobalAlerts);  // PUT  enable/disable all alerts

export default router;
