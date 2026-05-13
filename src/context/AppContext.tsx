import { createContext, useState } from "react";

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

export interface CurrentUser {
  id: number;
  phone_number: string;
  display_name: string;
  profile_photo?: string;
  about?: string;
}

export const AppContext = createContext<any>(null);

export function AppProvider({
  children,
  currentUser,
  onLogout,
}: {
  children: React.ReactNode;
  currentUser: CurrentUser;
  onLogout: () => void;
}) {
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
    <AppContext.Provider
      value={{ ...state, setAppContext, resetAppContext, currentUser, onLogout }}
    >
      {children}
    </AppContext.Provider>
  );
}
