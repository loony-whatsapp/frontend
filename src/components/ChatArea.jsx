import React, { useContext, useState } from "react";
import {
  FaSearch,
  FaEllipsisV,
  FaPaperclip,
  FaMicrophone,
  FaSmile,
  FaPaperPlane,
  FaPhone,
  FaVideo,
  FaArrowLeft,
} from "react-icons/fa";
import { ViewMessage } from "./messages/MessageItem";
import { AppContext } from "../context/AppContext";
import {
  useGroupMessagesFromId,
  useMessagesFromId,
  useNewMessage,
} from "../hooks";

const ChatArea = () => {
  const { selectedChat } = useContext(AppContext);
  const [messages] = useMessagesFromId(selectedChat?.other_user_id);
  const [groupmessages] = useGroupMessagesFromId(selectedChat?.group_id);
  const sendNewMessage = useNewMessage();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (selectedChat?.group_id) {
        sendNewMessage.newGroupMessage({
          group_id: selectedChat?.group_id,
          body_text: newMessage,
        });
        setNewMessage("");
      } else {
        sendNewMessage.newMessage({
          other_user_id: selectedChat?.other_user_id,
          body_text: newMessage,
        });
        setNewMessage("");
      }
    }
  };

  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              WhatsApp Web
            </h2>
            <p className="text-gray-600 mb-4">
              Send and receive messages without keeping your phone online.
            </p>
            <p className="text-gray-500 text-sm">
              Use WhatsApp on up to 4 linked devices and 1 phone at the same
              time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="bg-gray-200 px-4 py-3 flex items-center justify-between border-b border-gray-300">
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 text-gray-600"
            onClick={() => setSelectedChat(null)}
          >
            <FaArrowLeft />
          </button>
          <img
            src={`http://localhost:2000/file/${selectedChat.other_user_id}`}
            alt={selectedChat.other_user_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">
              {selectedChat.other_user_name}
            </h3>
            <p className="text-xs text-gray-600">
              {selectedChat.isOnline
                ? "Online"
                : selectedChat.lastSeen || "Click here for contact info"}
            </p>
          </div>
        </div>
        <div className="flex space-x-4 text-gray-600">
          <FaVideo className="cursor-pointer hover:text-whatsapp-green-500" />
          <FaPhone className="cursor-pointer hover:text-whatsapp-green-500" />
          <FaSearch className="cursor-pointer hover:text-whatsapp-green-500" />
          <FaEllipsisV className="cursor-pointer hover:text-whatsapp-green-500" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-chat-bg bg-repeat bg-center bg-[#e5ddd5]">
        <div className="max-w-4xl mx-auto">
          {messages &&
            messages.map((message) => (
              <ViewMessage key={message.id} message={message} />
            ))}
          {groupmessages &&
            groupmessages.map((message) => (
              <ViewMessage key={message.id} message={message} />
            ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gray-200 px-4 py-3">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            className="text-gray-600 hover:text-whatsapp-green-500 p-2"
          >
            <FaSmile size={20} />
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-whatsapp-green-500 p-2"
          >
            <FaPaperclip size={20} />
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          {newMessage.trim() ? (
            <button
              type="submit"
              className="bg-whatsapp-green-500 text-white p-2 rounded-full hover:bg-whatsapp-teal-500 transition-colors"
            >
              <FaPaperPlane size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="text-gray-600 hover:text-whatsapp-green-500 p-2"
            >
              <FaMicrophone size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
