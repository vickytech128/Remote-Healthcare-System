// routes/jarvis.routes.js
import express from "express";
import {
  jarvisChat,
  getChatHistory,
  clearChatHistory,
} from "../controllers/jarvis.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// All Jarvis routes are protected — patient must be logged in
router.post("/chat",        verifyToken, jarvisChat);        // POST  send message → get AI reply
router.get("/history",      verifyToken, getChatHistory);    // GET   restore last 30 messages
router.delete("/history",   verifyToken, clearChatHistory);  // DELETE clear all history

export default router;
