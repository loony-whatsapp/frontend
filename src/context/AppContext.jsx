import { createContext, useState } from "react";

export const AppContext = createContext({
  viewContext: "chats",
});

export function AppProvider({ children }) {
  const [state, setAppContext] = useState({
    viewContext: "chats",
  });

  return (
    <AppContext.Provider value={{ ...state, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
}
