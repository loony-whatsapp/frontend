import React from "react";
import { FaPhone, FaVideo, FaArrowDown } from "react-icons/fa";

const CallItem = ({ call }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
      <div className="flex items-center">
        <img
          src={
            call
              ? `http://localhost:2000/file/${call.id}`
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-800">{call.name}</h3>
            <span
              className={`ml-2 ${
                call.type === "incoming" ? "text-green-500" : "text-red-500"
              }`}
            >
              <FaArrowDown
                className={`transform ${
                  call.type === "incoming" ? "rotate-45" : "-rotate-45"
                }`}
              />
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {call.date} • {call.time} • {call.duration}
          </p>
        </div>
      </div>
      <div className="flex space-x-3">
        <button className="text-whatsapp-green hover:text-whatsapp-teal">
          <FaPhone />
        </button>
        <button className="text-whatsapp-green hover:text-whatsapp-teal">
          <FaVideo />
        </button>
      </div>
    </div>
  );
};

export default CallItem;
