<<<<<<< HEAD
// src/GoogleAuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import { gapi } from "gapi-script";

export const AuthContext = createContext();

const CLIENT_ID = "407851505342-0vceq0agtg4fu253jv5a5to23lsbe2f4.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";

export const GoogleAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const initializeGapi = () => {
      gapi.load("client", async () => {
        await gapi.client.init({});
      });

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => setAccessToken(tokenResponse.access_token),
      });

      setTokenClient(client);
    };

    initializeGapi();
  }, []);

  const login = () => {
    if (tokenClient) tokenClient.requestAccessToken();
  };

  return (
    <AuthContext.Provider value={{ accessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
};
=======
// src/GoogleAuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import { gapi } from "gapi-script";

export const AuthContext = createContext();

const CLIENT_ID = "407851505342-0vceq0agtg4fu253jv5a5to23lsbe2f4.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";

export const GoogleAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const initializeGapi = () => {
      gapi.load("client", async () => {
        await gapi.client.init({});
      });

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => setAccessToken(tokenResponse.access_token),
      });

      setTokenClient(client);
    };

    initializeGapi();
  }, []);

  const login = () => {
    if (tokenClient) tokenClient.requestAccessToken();
  };

  return (
    <AuthContext.Provider value={{ accessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
};
>>>>>>> 1517673 (update fitur baru)
