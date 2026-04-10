import { db } from "../config/firebase.admin.js";

// ✅ Get all conversations
export const getConversations = async (req, res) => {
    try {
        const uid = req.user.uid;

        const snap = await db.collection("messages")
            .where("participants", "array-contains", uid)
            .orderBy("updatedAt", "desc")
            .get();

        const chats = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// ✅ Get messages of a chat
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const snap = await db.collection("messages")
            .doc(chatId)
            .collection("messages")
            .orderBy("createdAt", "asc")
            .get();

        const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// ✅ Send message
export const sendMessage = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { chatId, text } = req.body;

        if (!chatId || !text) {
            return res.status(400).json({ error: "chatId & text required" });
        }

        const msg = {
            senderId: uid,
            text,
            createdAt: new Date().toISOString(),
            seen: false,
        };

        await db.collection("messages")
            .doc(chatId)
            .collection("messages")
            .add(msg);

        // update last message
        await db.collection("messages")
            .doc(chatId)
            .update({
                lastMessage: text,
                updatedAt: new Date().toISOString(),
            });

        res.status(200).json({ success: true, message: "Message sent" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


// ✅ Create new chat (patient → doctor)
export const createChat = async (req, res) => {
    try {
        const uid = req.user.uid;
        const { doctorId } = req.body;

        const newChat = {
            participants: [uid, doctorId],
            lastMessage: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const ref = await db.collection("messages").add(newChat);

        res.status(201).json({
            success: true,
            chatId: ref.id,
            data: newChat,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};