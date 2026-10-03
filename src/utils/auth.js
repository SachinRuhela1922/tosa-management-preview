// src/utils/auth.js
// JWT / session helpers (token localStorage me "tosaToken" key se saved hai)

const TOKEN_KEY = "tosaToken";
const PROFILE_KEY = "tosaProfile";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null;
  } catch {
    return null;
  }
};

// JWT ka payload decode karta hai (signature verify server karega)
const decodeJwt = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

// Token hai + valid format + expire nahi hua => true
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const payload = decodeJwt(token);
  if (!payload) return false;

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    clearSession(); // expired token saaf kar do
    return false;
  }
  return true;
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
};