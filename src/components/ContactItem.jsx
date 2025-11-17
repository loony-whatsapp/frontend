import React from "react";
import { FaCircle } from "react-icons/fa";

const ContactItem = ({ contact, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={contact.avatar}
          alt={contact.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {contact.isOnline && (
          <FaCircle className="absolute bottom-0 right-0 text-green-500 text-xs bg-white rounded-full" />
        )}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{contact.name}</h3>
          <span className="text-xs text-gray-500">{contact.lastSeen}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{contact.status}</p>
      </div>
    </div>
  );
};

export default ContactItem;
