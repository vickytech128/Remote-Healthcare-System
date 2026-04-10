// ─────────────────────────────────────────────────────────────────────────────
// HOW TO CALL BACKEND FROM login.jsx
// Add this file as: src/api/authApi.js
// ─────────────────────────────────────────────────────────────────────────────
import { getAuth } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Helper — gets Firebase idToken from currently logged-in user
const getIdToken = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("No user logged in");
  return await user.getIdToken();
};

// ─────────────────────────────────────────────────────────────────────────────
// Call after Firebase signInWithEmailAndPassword succeeds
// Usage in handleLogin():
//   const result = await loginUserApi(portal); // portal = "patient" or "doctor"
// ─────────────────────────────────────────────────────────────────────────────
export const loginUserApi = async (portalRole) => {
  const idToken = await getIdToken();

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${idToken}`,  // ✅ Token in header
    },
    body: JSON.stringify({ portalRole }),     // "patient" or "doctor"
  });

  return await res.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// Call after Firebase createUserWithEmailAndPassword succeeds
// Usage in handleSignup():
//   const result = await signupUserApi({ name, patientId, role: portal });
// ─────────────────────────────────────────────────────────────────────────────
export const signupUserApi = async ({ name, patientId, role }) => {
  const idToken = await getIdToken();

  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${idToken}`,
    },
    body: JSON.stringify({ name, patientId, role }),
  });

  return await res.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// Call after Firebase signInWithPopup (Google) succeeds
// Usage in handleGoogleSignIn():
//   const result = await googleSignInApi(portal);
// ─────────────────────────────────────────────────────────────────────────────
export const googleSignInApi = async (portalRole) => {
  const idToken = await getIdToken();

  const res = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${idToken}`,
    },
    body: JSON.stringify({ portalRole }),
  });

  return await res.json();
};
