import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import Login from "./components/Login";
import { AppProvider } from "./context/AppContext";
import { useSocketConnection } from "./hooks/useSocket";

function MainApp({ currentUser, onLogout }) {
  // Establish socket connection once the user is authenticated
  useSocketConnection(currentUser?.id);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Mobile Header */}
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

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return <MainApp currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
