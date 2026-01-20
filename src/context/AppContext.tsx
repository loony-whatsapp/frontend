import { createContext, SetStateAction, useState } from "react";

export enum CHAT_AREA_NAME {
  NONE = 1,
  DIRECT_MESSAGES = 2,
  GROUP_MESSAGES = 3,
  COMMUNITY_POSTS = 4,
  USER_INFO = 5,
}

export enum TAB_NAME {
  NONE = 1,
  ALL_MESSAGES = 2,
  GROUPS = 3,
  COMMUNITIES = 4,
  CALLS = 5,
  CONTACTS = 6,
}

export const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setAppContext] = useState({
    tabName: TAB_NAME.ALL_MESSAGES,
    chatAreaName: null,
    data: null,
    userInfo: null,
  });

  const resetAppContext = () => {
    setAppContext({
      tabName: TAB_NAME.ALL_MESSAGES,
      chatAreaName: null,
      data: null,
      userInfo: null,
    });
  };

  return (
    <AppContext.Provider value={{ ...state, setAppContext, resetAppContext }}>
      {children}
    </AppContext.Provider>
  );
}
