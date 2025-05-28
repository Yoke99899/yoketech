// src/GoogleAuthProvider.jsx import React, { createContext, useEffect, useState } from "react"; import { gapi } from "gapi-script";

export const AuthContext = createContext();

const CLIENT_ID = "407851505342-0vceq0agtg4fu253jv5a5to23lsbe2f4.apps.googleusercontent.com"; const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";

export const GoogleAuthProvider = ({ children }) => { const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || ""); const [tokenClient, setTokenClient] = useState(null); const [refreshTimer, setRefreshTimer] = useState(null);

useEffect(() => { const initializeGapi = () => { gapi.load("client", async () => { await gapi.client.init({}); });

const client = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse) => {
      if (tokenResponse?.access_token) {
        setAccessToken(tokenResponse.access_token);
        localStorage.setItem("accessToken", tokenResponse.access_token);

        // 🔁 Set timer untuk refresh token sebelum kadaluarsa (setiap 50 menit)
        if (refreshTimer) clearTimeout(refreshTimer);
        const timer = setTimeout(() => {
          client.requestAccessToken();
        }, 50 * 60 * 1000); // 50 menit
        setRefreshTimer(timer);
      }
    },
  });

  setTokenClient(client);

  const checkStoredToken = async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) return;

    try {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${storedToken}`
      );
      if (!res.ok) throw new Error("Token expired or invalid");

      await res.json();
      setAccessToken(storedToken);

      // 🔁 Set auto refresh jika token valid saat reload
      const timer = setTimeout(() => {
        client.requestAccessToken();
      }, 50 * 60 * 1000);
      setRefreshTimer(timer);
    } catch (err) {
      console.warn("Auto login failed:", err.message);
      setAccessToken("");
      localStorage.removeItem("accessToken");
    }
  };

  checkStoredToken();
};

initializeGapi();

}, []);

const login = () => { if (tokenClient) { tokenClient.requestAccessToken(); } };

const logout = () => { setAccessToken(""); localStorage.removeItem("accessToken"); if (refreshTimer) { clearTimeout(refreshTimer); setRefreshTimer(null); } };

return ( <AuthContext.Provider value={{ accessToken, login, logout }}> {children} </AuthContext.Provider> ); };

