// src/api/messagesApi.js
// Matches: patient-messages.jsx imports
// Usage: import { fetchChats, fetchMessages, sendMessageApi, createChatApi } from "../api/messagesApi.js"

import { getAuth } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Helper: get Firebase ID token ─────────────────────────────────────────────
const getToken = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
};

const authHeaders = async () => ({
  "Content-Type":  "application/json",
  "Authorization": `Bearer ${await getToken()}`,
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/messages/chats
// Fetches all chat conversations for the logged-in patient
// Used in: useEffect → setConvs(res.data)
// ─────────────────────────────────────────────────────────────────────────────
export const fetchChats = async () => {
  try {
    const res = await fetch(`${API_URL}/api/messages/chats`, {
      headers: await authHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("fetchChats error:", err);
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/messages/chats/:chatId/messages
// Fetches all messages for a specific chat
// Used in: loadMessages(conv) → setMessages(res.data)
// ─────────────────────────────────────────────────────────────────────────────
export const fetchMessages = async (chatId) => {
  try {
    const res = await fetch(`${API_URL}/api/messages/chats/${chatId}/messages`, {
      headers: await authHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("fetchMessages error:", err);
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/messages/chats/:chatId/messages
// Sends a new message in a chat
// Used in: sendMessage() → sendMessageApi(activeConv.id, txt)
// ─────────────────────────────────────────────────────────────────────────────
export const sendMessageApi = async (chatId, text) => {
  try {
    const res = await fetch(`${API_URL}/api/messages/chats/${chatId}/messages`, {
      method:  "POST",
      headers: await authHeaders(),
      body:    JSON.stringify({ text }),
    });
    return await res.json();
  } catch (err) {
    console.error("sendMessageApi error:", err);
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/messages/chats
// Creates a new chat conversation with a doctor
// Used in: handleNewChat() → createChatApi("DOC-001")
// ─────────────────────────────────────────────────────────────────────────────
export const createChatApi = async (doctorId) => {
  try {
    const res = await fetch(`${API_URL}/api/messages/chats`, {
      method:  "POST",
      headers: await authHeaders(),
      body:    JSON.stringify({ doctorId }),
    });
    return await res.json();
  } catch (err) {
    console.error("createChatApi error:", err);
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/messages/chats/:chatId/read
// Marks all messages in a chat as read (called when patient opens a chat)
// Used in: openConv(conv) → markChatRead(conv.id)
// ─────────────────────────────────────────────────────────────────────────────
export const markChatRead = async (chatId) => {
  try {
    const res = await fetch(`${API_URL}/api/messages/chats/${chatId}/read`, {
      method:  "PUT",
      headers: await authHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("markChatRead error:", err);
    return { success: false, error: err.message };
  }
};
