import React, { useState, useContext, use } from "react";
import {
  FaSearch,
  FaEllipsisV,
  FaComment,
  FaUsers,
  FaPhone,
  FaCircle,
  FaCamera,
} from "react-icons/fa";

import Calls from "./calls/Calls";
import Groups from "./groups/Groups";
import Contacts from "./contacts/Contacts";
import Messages from "./messages/Messages";
import Communities from "./communities/Communities";

import { useAuthUserInfo } from "../hooks";
import { AppContext, CHAT_AREA_NAME, TAB_NAME } from "../context/AppContext";
import { API_URL } from "../Config";

const TABS = [
  { key: TAB_NAME.ALL_MESSAGES, icon: FaComment, label: "Chats" },
  { key: TAB_NAME.GROUPS, icon: FaUsers, label: "Groups" },
  { key: TAB_NAME.COMMUNITIES, icon: FaUsers, label: "Communities" },
  { key: TAB_NAME.CALLS, icon: FaPhone, label: "Calls" },
  { key: TAB_NAME.CONTACTS, icon: FaCircle, label: "Contacts" },
];

const Sidebar = () => {
  const { tabName, setAppContext } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [authUserInfo] = useAuthUserInfo(1);

  const changeTab = (changedTabName) => {
    setAppContext((prev) => ({
      ...prev,
      tabName: changedTabName,
      chatAreaName: CHAT_AREA_NAME.NONE,
      data: null,
    }));
  };

  const onClickUserProfile = () => {
    setAppContext((prev) => ({
      ...prev,
      userInfo: authUserInfo,
      chatAreaName: CHAT_AREA_NAME.USER_INFO,
    }));
  };

  return (
    <div className="w-full md:w-1/3 border-r border-gray-300 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center" onClick={onClickUserProfile}>
            <img
              src={
                authUserInfo
                  ? `${API_URL}/media/${authUserInfo.id}`
                  : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="ml-3 font-semibold">
              {authUserInfo && authUserInfo.display_name}
            </span>
          </div>
          <div className="flex space-x-4 text-gray-600">
            <FaCamera className="cursor-pointer hover:text-whatsapp-green-500" />
            <FaEllipsisV className="cursor-pointer hover:text-whatsapp-green-500" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-300 bg-white">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-colors ${
              tabName === key
                ? "border-whatsapp-green-500 text-whatsapp-green-500"
                : "border-transparent text-gray-500 hover:text-whatsapp-green-500"
            }`}
            onClick={() => changeTab(key)}
          >
            <Icon size={18} />
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {/* <AppProvider> */}
      {tabName === TAB_NAME.ALL_MESSAGES && <Messages />}
      {tabName === TAB_NAME.GROUPS && <Groups />}
      {tabName === TAB_NAME.COMMUNITIES && <Communities />}
      {tabName === TAB_NAME.CALLS && <Calls />}
      {tabName === TAB_NAME.CONTACTS && <Contacts />}
      {/* </AppProvider> */}
    </div>
  );
};

export default Sidebar;
