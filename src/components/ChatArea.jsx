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
import { AppContext, CHAT_AREA_NAME, TAB_NAME } from "../context/AppContext";
import {
  useGroupMessagesFromId,
  useMessagesFromId,
  useCommsPostsFromId,
} from "../hooks";
import EmojiPicker from "emoji-picker-react";
import { API_URL } from "../Config";
import UserProfile from "../profile/UserProfile";
import { useIncomingDirectMessages, useIncomingGroupMessages, useMessageError } from "../hooks/useSocket";
import { emitDirectMessage, emitGroupMessage } from "../socket/socketClient";

const ChatArea = () => {
  const {
    data: chatAreaData,
    chatAreaName,
    tabName,
    setAppContext,
    currentUser,
  } = useContext(AppContext);

  const [messages, setMessages] = useMessagesFromId(
    currentUser?.id,
    chatAreaData?.other_user_id,
    chatAreaName,
  );
  const [groupmessages, setGroupMessages] = useGroupMessagesFromId(
    chatAreaData?.group_id,
    chatAreaName,
  );
  const [commsPosts] = useCommsPostsFromId(
    chatAreaData?.context_id,
    chatAreaName,
  );

  // Real-time: append incoming messages from socket
  useIncomingDirectMessages(
    currentUser?.id,
    chatAreaData?.other_user_id,
    setMessages,
  );
  useIncomingGroupMessages(
    chatAreaData?.group_id,
    setGroupMessages,
  );
  useMessageError(currentUser?.id, setMessages, setGroupMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const emojiPickerRef = useRef(null);
  const settingsRef = useRef(null);
  const attachmentMenuRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupmessages]);

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
    const text = newMessage.trim();
    if (!text) return;

    const temp_id = crypto.randomUUID();
    const sent_at = new Date().toISOString();

    if (chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES) {
      const group_id = chatAreaData?.group_id || chatAreaData?.id;
      // Show optimistically before the server round-trip
      setGroupMessages((prev) => [
        ...(prev || []),
        { temp_id, group_id, sender_id: currentUser?.id, body_text: text, message_type: "text", sent_at },
      ]);
      emitGroupMessage({ group_id, body_text: text, temp_id });
    } else {
      const receiver_id = chatAreaData?.other_user_id;
      setMessages((prev) => [
        ...(prev || []),
        { temp_id, sender_id: currentUser?.id, receiver_id, body_text: text, message_type: "text", sent_at },
      ]);
      emitDirectMessage({ receiver_id, body_text: text, temp_id });
    }

    setNewMessage("");
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleCall = (type) => {
    const callType = type === "video" ? "Video" : "Audio";
    alert(
      `Initiating ${callType} call with ${
        chatAreaData?.other_user_name ||
        chatAreaData?.group_name ||
        chatAreaData?.context_name
      }`,
    );
  };

  const handleSearchInChat = () => {
    setShowSearch(!showSearch);
  };

  const onClickUserProfile = (userProfile) => {
    setAppContext((prev) => ({
      ...prev,
      data: userProfile,
      chatAreaName: CHAT_AREA_NAME.USER_INFO,
    }));
  };

  if (chatAreaName == CHAT_AREA_NAME.NONE || !chatAreaData) {
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

  if (chatAreaName == CHAT_AREA_NAME.USER_INFO) {
    return <UserProfile />;
  }

  // Derive display name and avatar based on chat type
  const chatName =
    chatAreaData?.other_user_name ||
    chatAreaData?.group_name ||
    chatAreaData?.context_name ||
    "Unknown";
  const chatAvatarId =
    chatAreaData?.other_user_id ||
    chatAreaData?.group_id ||
    chatAreaData?.context_id;

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
            <input
              type="text"
              placeholder="Search messages..."
              className="flex-1 px-4 py-2 rounded-lg focus:outline-none bg-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-gray-200 px-4 py-3 flex items-center justify-between border-b border-gray-300 relative">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => onClickUserProfile(chatAreaData)}
        >
          <button className="md:hidden mr-3 text-gray-600" onClick={() => {}}>
            <FaArrowLeft />
          </button>
          <img
            src={`${API_URL}/media/${chatAvatarId}`}
            alt={chatName}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=25D366&color=fff`;
            }}
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">{chatName}</h3>
            <p className="text-xs text-gray-600">Click here for contact info</p>
          </div>
        </div>

        {/* Header Icons */}
        <div className="flex space-x-4 text-gray-600 relative">
          <FaVideo
            className="cursor-pointer hover:text-green-500"
            onClick={() => handleCall("video")}
            title="Video call"
          />
          <FaPhone
            className="cursor-pointer hover:text-green-500"
            onClick={() => handleCall("audio")}
            title="Voice call"
          />
          <FaSearch
            className="cursor-pointer hover:text-green-500"
            onClick={handleSearchInChat}
            title="Search messages"
          />
          <div className="relative" ref={settingsRef}>
            <FaEllipsisV
              className="cursor-pointer hover:text-green-500"
              onClick={() => setShowSettings(!showSettings)}
              title="More options"
            />
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
                    Clear chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]">
        <div className="max-w-4xl mx-auto">
          {chatAreaName === CHAT_AREA_NAME.DIRECT_MESSAGES &&
            messages &&
            messages.map((message, i) => (
              <ViewMessage
                key={message.temp_id || message.id || i}
                message={message}
                currentUserId={currentUser?.id}
              />
            ))}
          {chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES &&
            groupmessages &&
            groupmessages.map((message, i) => (
              <ViewMessage
                key={message.temp_id || message.id || i}
                message={message}
                currentUserId={currentUser?.id}
              />
            ))}
          {chatAreaName === CHAT_AREA_NAME.COMMUNITY_POSTS &&
            commsPosts &&
            commsPosts.map((message) => (
              <ViewPost key={message.id} message={message} currentUserId={currentUser?.id} />
            ))}
          <div ref={messagesEndRef} />
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
                onClick={() => setShowAttachmentMenu(false)}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📷</span>
                <span>Photos & Videos</span>
              </button>
              <button
                onClick={() => setShowAttachmentMenu(false)}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📄</span>
                <span>Document</span>
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
            className="text-gray-600 hover:text-green-500 p-2 relative"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji"
          >
            <FaSmile size={20} />
          </button>

          <div className="relative">
            <button
              type="button"
              className="text-gray-600 hover:text-green-500 p-2"
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
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>

          {newMessage.trim() ? (
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
              title="Send message"
            >
              <FaPaperPlane size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="text-gray-600 hover:text-green-500 p-2"
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
