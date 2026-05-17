import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import Login from "./components/Login";
import { AppProvider } from "./context/AppContext";
import { useSocketConnection } from "./hooks/useSocket";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { refreshAccessToken } from "./lib/auth";
import { API_URL } from "./Config";

function MainApp({ currentUser, onLogout }) {
  useSocketConnection(currentUser?.id);
  usePushNotifications(currentUser?.id);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="md:hidden bg-green-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">WhatsApp</h1>
        </div>
      </div>

      <AppProvider currentUser={currentUser} onLogout={onLogout}>
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <ChatArea />
        </div>
      </AppProvider>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // On mount, if there's a user in storage but the access token might be
  // expired, try to silently refresh before showing the app.
  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem("token");
    if (!token) {
      refreshAccessToken().catch(() => {});
    }
  }, []);

  const handleLogin = (user, refresh_token) => {
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      const token         = localStorage.getItem("token");
      const refresh_token = localStorage.getItem("refresh_token");
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ refresh_token }),
      });
    } catch { /* best-effort */ }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return <MainApp currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
