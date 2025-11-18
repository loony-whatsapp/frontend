import { createContext, useState } from "react";

export const AppContext = createContext({
  viewContext: "chats",
});

export function AppProvider({ children }) {
  const [state, setAppContext] = useState({
    viewContext: "chats",
    selectedChat: null,
  });

  return (
    <AppContext.Provider value={{ ...state, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
}
