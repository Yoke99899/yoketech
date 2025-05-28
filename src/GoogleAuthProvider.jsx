import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { gapi } from "gapi-script";

export const AuthContext = createContext();

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES;

export const GoogleAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [tokenClient, setTokenClient] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(null);

  useEffect(() => {
    const initializeGapi = () => {
      gapi.load("client", async () => {
        try {
          await gapi.client.init({});
        } catch (err) {
          console.error("GAPI client init error:", err);
        }
      });

      // Pastikan window.google tersedia
      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.oauth2
      ) {
        console.error("Google OAuth2 client not loaded.");
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse?.access_token) {
            console.log("Access token received:", tokenResponse);
            setAccessToken(tokenResponse.access_token);
            localStorage.setItem("accessToken", tokenResponse.access_token);

            // Atur timer refresh
            if (refreshTimer) clearTimeout(refreshTimer);
            const timer = setTimeout(() => {
              client.requestAccessToken();
            }, 50 * 60 * 1000); // refresh tiap 50 menit
            setRefreshTimer(timer);
          } else {
            console.error("Token response missing access_token:", tokenResponse);
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

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [refreshTimer]);

  const login = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    } else {
      console.error("Token client not initialized yet.");
    }
  }, [tokenClient]);

  const logout = useCallback(() => {
    setAccessToken("");
    localStorage.removeItem("accessToken");
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      setRefreshTimer(null);
    }
  }, [refreshTimer]);

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
