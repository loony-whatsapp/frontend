import React from "react";
import { FaCircle } from "react-icons/fa";
import { API_URL } from "../../Config";

const GroupItem = ({ group, onClick }) => {
  return (
    <div
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={`${API_URL}/media/${group.id}`}
          alt={group.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name || "?")}&background=128C7E&color=fff`;
          }}
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
