import { createContext, SetStateAction, useState } from "react";

export enum ViewContext {
  None,
  DM,
  GM,
  COMMS,
  CALLS,
  CONTACTS,
}

export const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setAppContext] = useState({
    viewContext: ViewContext.DM,
    chatAreaContext: null,
    selectedChat: null,
    screen: "chat",
    userInfo: null,
  });

  const resetAppContext = () => {
    setAppContext({
      viewContext: ViewContext.DM,
      chatAreaContext: null,
      selectedChat: null,
      screen: "chat",
      userInfo: null,
    });
  };

  return (
    <AppContext.Provider value={{ ...state, setAppContext, resetAppContext }}>
      {children}
    </AppContext.Provider>
  );
}
