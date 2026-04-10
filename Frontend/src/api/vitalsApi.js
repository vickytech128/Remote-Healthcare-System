// src/api/vitalsApi.js
import { getAuth } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = async () => {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Not authenticated");
    return await user.getIdToken();
};

const authHeaders = async () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${await getToken()}`,
});

export const fetchLatestVitals = async () => {
    try {
        const res = await fetch(`${API_URL}/api/vitals/latest`, {
            headers: await authHeaders(),
        });
        return await res.json();
    } catch (err) {
        console.error("fetchLatestVitals error:", err);
        return { success: false, error: err.message };
    }
};

export const fetchVitalsHistory = async (limit = 50) => {
    try {
        const res = await fetch(`${API_URL}/api/vitals/history?limit=${limit}`, {
            headers: await authHeaders(),
        });
        return await res.json();
    } catch (err) {
        console.error("fetchVitalsHistory error:", err);
        return { success: false, error: err.message };
    }
};

export const fetchSparklineData = async () => {
    try {
        const res = await fetch(`${API_URL}/api/vitals/sparkline`, {
            headers: await authHeaders(),
        });
        return await res.json();
    } catch (err) {
        console.error("fetchSparklineData error:", err);
        return { success: false, error: err.message };
    }
};

export const fetchWeekComparison = async () => {
    try {
        const res = await fetch(`${API_URL}/api/vitals/week-comparison`, {
            headers: await authHeaders(),
        });
        return await res.json();
    } catch (err) {
        console.error("fetchWeekComparison error:", err);
        return { success: false, error: err.message };
    }
};
