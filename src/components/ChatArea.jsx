import React, { useContext, useState, useRef, useEffect } from "react";
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
  FaTimes,
} from "react-icons/fa";
import { ViewMessage, ViewPost } from "./messages/MessageItem";
import { AppContext, ViewContext } from "../context/AppContext";
import {
  useGroupMessagesFromId,
  useMessagesFromId,
  useNewMessage,
  useCommsPostsFromId,
} from "../hooks";
import EmojiPicker from "emoji-picker-react";
import { API_URL } from "../Config";

const ChatArea = () => {
  const {
    selectedChat,
    chatAreaContext,
    setSelectedChat,
    setAppContext,
    screen,
  } = useContext(AppContext);
  const [messages] = useMessagesFromId(1, selectedChat?.other_user_id);
  const [groupmessages] = useGroupMessagesFromId(selectedChat?.group_id);
  const [commsPosts] = useCommsPostsFromId(selectedChat?.com_id);

  const sendNewMessage = useNewMessage();
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const emojiPickerRef = useRef(null);
  const settingsRef = useRef(null);
  const attachmentMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleAttachmentClick = (type) => {
    // Here you can implement file upload functionality
    console.log(`Attaching ${type}`);

    // For demo purposes, we'll just add a placeholder message
    const fileMessages = {
      image: "📷 [Image attached]",
      document: "📄 [Document attached]",
      camera: "📸 [Photo taken]",
      contact: "👤 [Contact shared]",
    };

    setNewMessage((prev) => prev + fileMessages[type]);
    setShowAttachmentMenu(false);
  };

  const handleSearchMessages = () => {
    if (!searchQuery.trim()) return;

    // Implement search functionality here
    console.log("Searching for:", searchQuery);
    // You could filter messages based on searchQuery and highlight matches
    alert(
      `Searching for: "${searchQuery}"\n\nThis would filter messages containing the search term.`
    );
  };

  const handleCall = (type) => {
    const callType = type === "video" ? "Video" : "Audio";
    alert(
      `Initiating ${callType} call with ${
        selectedChat?.other_user_name ||
        selectedChat?.group_name ||
        selectedChat?.com_name
      }`
    );
  };

  const handleSearchInChat = () => {
    setShowSearch(!showSearch);
    if (showSearch && searchQuery) {
      handleSearchMessages();
    }
  };

  const onClickUserProfile = (userProfile) => {
    setAppContext((prev) => ({
      ...prev,
      screen: "profile",
      userProfile,
      chatAreaContext: null,
      selectedChat: null,
    }));
  };

  if (screen !== "chat") {
    return null;
  }

  if (chatAreaContext == ViewContext.None || !selectedChat) {
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
    <div className="flex-1 flex flex-col bg-gray-100 relative">
      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute top-0 left-0 right-0 bg-white z-50 shadow-lg">
          <div className="flex items-center p-3">
            <button
              onClick={() => setShowSearch(false)}
              className="text-gray-600 mr-3 p-2"
            >
              <FaTimes />
            </button>
            <div className="flex-1 flex items-center">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full px-4 py-2 rounded-lg focus:outline-none bg-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchMessages()}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleSearchMessages}
                  className="ml-2 bg-whatsapp-green-500 text-white px-4 py-2 rounded-lg hover:bg-whatsapp-teal-500"
                >
                  Search
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-gray-200 px-4 py-3 flex items-center justify-between border-b border-gray-300 relative">
        <div
          className="flex items-center"
          onClick={() => onClickUserProfile(selectedChat)}
        >
          <button
            className="md:hidden mr-3 text-gray-600"
            onClick={() => setSelectedChat(null)}
          >
            <FaArrowLeft />
          </button>
          <img
            src={`${API_URL}/media/${
              selectedChat.other_user_id ||
              selectedChat.group_id ||
              selectedChat.com_id
            }`}
            alt={
              selectedChat.other_user_name ||
              selectedChat.group_name ||
              selectedChat.com_name
            }
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">
              {selectedChat.other_user_name ||
                selectedChat.group_name ||
                selectedChat.com_name}
            </h3>
            <p className="text-xs text-gray-600">
              {selectedChat.isOnline
                ? "Online"
                : selectedChat.lastSeen || "Click here for contact info"}
            </p>
          </div>
        </div>

        {/* Header Icons */}
        <div className="flex space-x-4 text-gray-600 relative">
          <FaVideo
            className="cursor-pointer hover:text-whatsapp-green-500"
            onClick={() => handleCall("video")}
            title="Video call"
          />
          <FaPhone
            className="cursor-pointer hover:text-whatsapp-green-500"
            onClick={() => handleCall("audio")}
            title="Voice call"
          />
          <FaSearch
            className="cursor-pointer hover:text-whatsapp-green-500"
            onClick={handleSearchInChat}
            title="Search messages"
          />
          <div className="relative" ref={settingsRef}>
            <FaEllipsisV
              className="cursor-pointer hover:text-whatsapp-green-500"
              onClick={() => setShowSettings(!showSettings)}
              title="More options"
            />

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Contact info
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Select messages
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mute notifications
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Disappearing messages
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Clear chat
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Delete chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-chat-bg bg-repeat bg-center bg-[#e5ddd5]">
        <div className="max-w-4xl mx-auto">
          {chatAreaContext === ViewContext.DM &&
            messages &&
            messages.map((message) => (
              <ViewMessage key={message.msg_id} message={message} />
            ))}
          {chatAreaContext === ViewContext.GM &&
            groupmessages &&
            groupmessages.map((message) => (
              <ViewMessage key={message.msg_id} message={message} />
            ))}
          {chatAreaContext === ViewContext.COMMS &&
            commsPosts &&
            commsPosts.map((message) => (
              <ViewPost key={message.id} message={message} />
            ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gray-200 px-4 py-3 relative">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-0 mb-2 z-50"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="light"
              searchDisabled={false}
              skinTonesDisabled
              width={350}
              height={400}
            />
          </div>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <div
            ref={attachmentMenuRef}
            className="absolute bottom-full left-12 mb-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
          >
            <div className="py-2">
              <button
                onClick={() => handleAttachmentClick("image")}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📷</span>
                <span>Photos & Videos</span>
              </button>
              <button
                onClick={() => handleAttachmentClick("document")}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📄</span>
                <span>Document</span>
              </button>
              <button
                onClick={() => handleAttachmentClick("camera")}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📸</span>
                <span>Camera</span>
              </button>
              <button
                onClick={() => handleAttachmentClick("contact")}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">👤</span>
                <span>Contact</span>
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            className="text-gray-600 hover:text-whatsapp-green-500 p-2 relative"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji"
          >
            <FaSmile size={20} />
          </button>

          <div className="relative">
            <button
              type="button"
              className="text-gray-600 hover:text-whatsapp-green-500 p-2"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              title="Attach file"
            >
              <FaPaperclip size={20} />
            </button>
          </div>

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
              title="Send message"
            >
              <FaPaperPlane size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="text-gray-600 hover:text-whatsapp-green-500 p-2"
              title="Record voice message"
              onClick={() => alert("Voice recording would start here")}
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
