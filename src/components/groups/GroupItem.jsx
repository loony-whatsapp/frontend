import React from "react";
import { FaCircle } from "react-icons/fa";
import { API_URL } from "../../Config";

const GroupItem = ({ group, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={
            group
              ? `${API_URL}/media/${group.id}`
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        {/* {group.isOnline && (
          <FaCircle className="absolute bottom-0 right-0 text-green-500 text-xs bg-white rounded-full" />
        )} */}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{group.name}</h3>
          {/* <span className="text-xs text-gray-500">{group.lastSeen}</span> */}
        </div>
        <p className="text-sm text-gray-600 truncate">{group.description}</p>
      </div>
    </div>
  );
};

export default GroupItem;
