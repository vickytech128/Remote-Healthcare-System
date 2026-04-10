import express from "express";
import {
    getConversations,
    getMessages,
    sendMessage,
    createChat
} from "../controllers/messages.controller.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.get("/:chatId", verifyToken, getMessages);
router.post("/send", verifyToken, sendMessage);
router.post("/create", verifyToken, createChat);

export default router;