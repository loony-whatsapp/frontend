import React from "react";

export const ViewMessage = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.sender_id === 1 ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.sender_id === 1
            ? "bg-whatsapp-green text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="text-sm">{message.body_text}</p>
        <div
          className={`text-xs mt-1 ${
            message.sender_id === 1 ? "text-whatsapp-light" : "text-gray-500"
          } text-right`}
        >
          {message.sent_at}
        </div>
      </div>
    </div>
  );
};

export const MessageItem = ({ message, onClick, isActive }) => {
  return (
    <div
      className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={`http://localhost:2000/file/${message.other_user_id}`}
          alt={message.other_user_name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {/* {message.isOnline && (
          <FaCircle className="absolute bottom-0 right-0 text-green-500 text-xs bg-white rounded-full" />
        )} */}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            {message.other_user_name}
          </h3>
          {/* <span className="text-xs text-gray-500">{message.lastSeen}</span> */}
        </div>
        <p className="text-sm text-gray-600 truncate">{message.body_text}</p>
      </div>
    </div>
  );
};

export const GroupMessageItem = ({ message, onClick }) => {
  const isActive = false;
  return (
    <div
      className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={`http://localhost:2000/file/${message.group_id}`}
          alt={message.group_name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {/* {message.isOnline && (
          <FaCircle className="absolute bottom-0 right-0 text-green-500 text-xs bg-white rounded-full" />
        )} */}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{message.group_name}</h3>
          {/* <span className="text-xs text-gray-500">{message.lastSeen}</span> */}
        </div>
        <p className="text-sm text-gray-600 truncate">{message.body_text}</p>
      </div>
    </div>
  );
};
