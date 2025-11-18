import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import {
  contacts,
  groups,
  communities,
  calls,
  messages,
  statusUpdates,
} from "./data/mockData";
import { AppProvider } from "./context/AppContext";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden bg-whatsapp-green text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">WhatsApp</h1>
          <div className="flex space-x-4">
            <button className="text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AppProvider>
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />

          <ChatArea />
        </div>
      </AppProvider>
    </div>
  );
}

export default App;
