import React, { useContext, useState, useRef, useEffect, useCallback } from "react";
import {
  FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone,
  FaSmile, FaPaperPlane, FaPhone, FaVideo, FaArrowLeft, FaTimes,
} from "react-icons/fa";
import { ViewMessage, ViewPost } from "./messages/MessageItem";
import { AppContext, CHAT_AREA_NAME } from "../context/AppContext";
import { useGroupMessagesFromId, useMessagesFromId, useCommsPostsFromId } from "../hooks";
import EmojiPicker from "emoji-picker-react";
import { API_URL } from "../Config";
import UserProfile from "../profile/UserProfile";
import {
  useIncomingDirectMessages, useIncomingGroupMessages,
  useMessageError, useMessageSent, useMessageStatusUpdates,
  useTypingIndicator, usePresence,
} from "../hooks/useSocket";
import { authFetch } from "../lib/auth";
import {
  emitDirectMessage, emitGroupMessage, emitOpenChat,
  emitTypingStart, emitTypingStop,
} from "../socket/socketClient";

const TYPING_DEBOUNCE_MS = 1500;
const PAGE_SIZE = 50;

function formatLastSeen(iso) {
  if (!iso) return null;
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return "last seen just now";
  if (diff < 3600)  return `last seen ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `last seen ${Math.floor(diff / 3600)}h ago`;
  return `last seen ${new Date(iso).toLocaleDateString()}`;
}

const ChatArea = () => {
  const { data: chatAreaData, chatAreaName, setAppContext, currentUser } = useContext(AppContext);

  const [messages, setMessages] = useMessagesFromId(
    currentUser?.id, chatAreaData?.other_user_id, chatAreaName,
  );
  const [groupmessages, setGroupMessages] = useGroupMessagesFromId(
    chatAreaData?.group_id, chatAreaName,
  );
  const [commsPosts] = useCommsPostsFromId(chatAreaData?.context_id, chatAreaName);

  // ── Socket hooks ────────────────────────────────────────────────────────────
  useIncomingDirectMessages(currentUser?.id, chatAreaData?.other_user_id, setMessages);
  useIncomingGroupMessages(chatAreaData?.group_id, setGroupMessages);
  useMessageSent(currentUser?.id, setMessages);
  useMessageStatusUpdates(currentUser?.id, chatAreaData?.other_user_id, setMessages);
  useMessageError(currentUser?.id, setMessages, setGroupMessages);

  const otherIsTyping = useTypingIndicator(chatAreaData?.other_user_id);
  const { online: otherOnline, lastSeen: otherLastSeen } = usePresence(chatAreaData?.other_user_id);

  // Mark conversation read when this chat is opened
  useEffect(() => {
    if (chatAreaName === CHAT_AREA_NAME.DIRECT_MESSAGES && chatAreaData?.other_user_id) {
      emitOpenChat(chatAreaData.other_user_id);
    }
  }, [chatAreaName, chatAreaData?.other_user_id]);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [newMessage, setNewMessage]           = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch]           = useState(false);
  const [searchQuery, setSearchQuery]         = useState("");
  const [showSettings, setShowSettings]       = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isUploading, setIsUploading]         = useState(false);

  // ── Pagination state ────────────────────────────────────────────────────────
  const [hasMore, setHasMore]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset pagination when chat changes
  useEffect(() => { setHasMore(true); }, [chatAreaData?.other_user_id, chatAreaData?.group_id]);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const messagesEndRef      = useRef(null);
  const messagesContainerRef = useRef(null);
  const emojiPickerRef      = useRef(null);
  const settingsRef         = useRef(null);
  const attachmentMenuRef   = useRef(null);
  const fileInputRef        = useRef(null);
  const typingTimerRef      = useRef(null);
  const isTypingRef         = useRef(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupmessages]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target))
        setShowEmojiPicker(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target))
        setShowSettings(false);
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target))
        setShowAttachmentMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Infinite scroll ─────────────────────────────────────────────────────────
  const fetchOlderMessages = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const isDirect = chatAreaName === CHAT_AREA_NAME.DIRECT_MESSAGES;
    const isGroup  = chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES;
    if (!isDirect && !isGroup) return;

    const currentList = isDirect ? messages : groupmessages;
    if (!currentList || currentList.length === 0) return;

    // Use the oldest message's sent_at as the time cursor
    const oldest = currentList[0];
    const before_time = oldest?.sent_at;
    if (!before_time) return;

    setLoadingMore(true);
    const container = messagesContainerRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;

    try {
      let url;
      if (isDirect) {
        url = `${API_URL}/messages/direct/${chatAreaData.other_user_id}?limit=${PAGE_SIZE}&before_time=${encodeURIComponent(before_time)}`;
      } else {
        url = `${API_URL}/messages/groups/${chatAreaData.group_id}/messages?limit=${PAGE_SIZE}&before_time=${encodeURIComponent(before_time)}`;
      }

      const res  = await authFetch(url);
      const data = await res.json();
      const older = Array.isArray(data) ? data.reverse() : [];

      if (older.length < PAGE_SIZE) setHasMore(false);
      if (older.length === 0) { setLoadingMore(false); return; }

      if (isDirect) {
        setMessages((prev) => [...older, ...(prev || [])]);
      } else {
        setGroupMessages((prev) => [...older, ...(prev || [])]);
      }

      // Restore scroll position after prepend
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - prevScrollHeight;
        }
      });
    } catch (err) {
      console.error("[pagination] fetch failed:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, chatAreaName, messages, groupmessages, chatAreaData]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (container.scrollTop < 60) fetchOlderMessages();
  }, [fetchOlderMessages]);

  // ── Typing indicators ────────────────────────────────────────────────────────
  const handleTyping = () => {
    const chatId   = chatAreaData?.other_user_id ?? chatAreaData?.group_id;
    const is_group = chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES;
    if (!chatId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTypingStart(chatId, is_group);
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitTypingStop(chatId, is_group);
    }, TYPING_DEBOUNCE_MS);
  };

  const stopTyping = () => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    const chatId   = chatAreaData?.other_user_id ?? chatAreaData?.group_id;
    const is_group = chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES;
    if (chatId) emitTypingStop(chatId, is_group);
  };

  useEffect(() => () => { stopTyping(); }, [chatAreaData]);

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text && !isUploading) return;
    if (!text) return;

    stopTyping();
    const temp_id = crypto.randomUUID();
    const sent_at = new Date().toISOString();

    if (chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES) {
      const group_id = chatAreaData?.group_id || chatAreaData?.id;
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

  // ── Media upload ─────────────────────────────────────────────────────────────
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttachmentMenu(false);

    const temp_id   = crypto.randomUUID();
    const sent_at   = new Date().toISOString();
    const blobUrl   = URL.createObjectURL(file);
    const isImage   = file.type.startsWith("image/");
    const msg_type  = isImage ? "image" : "document";

    // Optimistic preview
    if (chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES) {
      const group_id = chatAreaData?.group_id || chatAreaData?.id;
      setGroupMessages((prev) => [
        ...(prev || []),
        { temp_id, group_id, sender_id: currentUser?.id, media_url: blobUrl, message_type: msg_type, sent_at },
      ]);
    } else {
      const receiver_id = chatAreaData?.other_user_id;
      setMessages((prev) => [
        ...(prev || []),
        { temp_id, sender_id: currentUser?.id, receiver_id, media_url: blobUrl, message_type: msg_type, sent_at },
      ]);
    }

    // Upload then send via socket
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await authFetch(`${API_URL}/uploads/file`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url: media_url } = await res.json();

      // Replace blob URL with real server URL in state
      const updateUrl = (prev) => (prev || []).map((m) =>
        m.temp_id === temp_id ? { ...m, media_url } : m,
      );
      if (chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES) {
        setGroupMessages(updateUrl);
        emitGroupMessage({ group_id: chatAreaData?.group_id || chatAreaData?.id, media_url, message_type: msg_type, temp_id });
      } else {
        setMessages(updateUrl);
        emitDirectMessage({ receiver_id: chatAreaData?.other_user_id, media_url, message_type: msg_type, temp_id });
      }
    } catch (err) {
      console.error("[upload] failed:", err);
      // Remove optimistic on failure
      const remove = (prev) => (prev || []).filter((m) => m.temp_id !== temp_id);
      setMessages(remove);
      setGroupMessages(remove);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(blobUrl);
      e.target.value = "";
    }
  };

  const handleEmojiClick = (emojiData) => setNewMessage((prev) => prev + emojiData.emoji);

  const onClickUserProfile = (userProfile) => {
    setAppContext((prev) => ({ ...prev, data: userProfile, chatAreaName: CHAT_AREA_NAME.USER_INFO }));
  };

  // ── Early returns ────────────────────────────────────────────────────────────
  if (chatAreaName === CHAT_AREA_NAME.NONE || !chatAreaData) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">WhatsApp Web</h2>
            <p className="text-gray-600 mb-4">Send and receive messages without keeping your phone online.</p>
            <p className="text-gray-500 text-sm">Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
          </div>
        </div>
      </div>
    );
  }

  if (chatAreaName === CHAT_AREA_NAME.USER_INFO) return <UserProfile />;

  const chatName = chatAreaData?.other_user_name || chatAreaData?.group_name || chatAreaData?.context_name || "Unknown";
  const chatAvatarId = chatAreaData?.other_user_id || chatAreaData?.group_id || chatAreaData?.context_id;
  const isDirect = chatAreaName === CHAT_AREA_NAME.DIRECT_MESSAGES;

  return (
    <div className="flex-1 flex flex-col bg-gray-100 relative">

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute top-0 left-0 right-0 bg-white z-50 shadow-lg">
          <div className="flex items-center p-3">
            <button onClick={() => setShowSearch(false)} className="text-gray-600 mr-3 p-2">
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
        <div className="flex items-center cursor-pointer" onClick={() => onClickUserProfile(chatAreaData)}>
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
            {isDirect && otherIsTyping ? (
              <p className="text-xs text-green-600 font-medium">typing…</p>
            ) : isDirect && otherOnline ? (
              <p className="text-xs text-green-500 font-medium">online</p>
            ) : isDirect && otherLastSeen ? (
              <p className="text-xs text-gray-500">{formatLastSeen(otherLastSeen)}</p>
            ) : (
              <p className="text-xs text-gray-600">Click here for contact info</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 text-gray-600 relative">
          <FaVideo className="cursor-pointer hover:text-green-500" title="Video call" />
          <FaPhone className="cursor-pointer hover:text-green-500" title="Voice call" />
          <FaSearch className="cursor-pointer hover:text-green-500" onClick={() => setShowSearch(!showSearch)} title="Search" />
          <div className="relative" ref={settingsRef}>
            <FaEllipsisV className="cursor-pointer hover:text-green-500" onClick={() => setShowSettings(!showSettings)} />
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Contact info</button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Select messages</button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Clear chat</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]"
        onScroll={handleScroll}
      >
        {/* Load-more spinner */}
        {loadingMore && (
          <div className="text-center py-2 text-xs text-gray-500">Loading older messages…</div>
        )}
        {!hasMore && (messages?.length > 0 || groupmessages?.length > 0) && (
          <div className="text-center py-2 text-xs text-gray-400">No more messages</div>
        )}

        <div className="max-w-4xl mx-auto">
          {chatAreaName === CHAT_AREA_NAME.DIRECT_MESSAGES && messages?.map((message, i) => (
            <ViewMessage key={message.temp_id || message.id || i} message={message} currentUserId={currentUser?.id} />
          ))}
          {chatAreaName === CHAT_AREA_NAME.GROUP_MESSAGES && groupmessages?.map((message, i) => (
            <ViewMessage key={message.temp_id || message.id || i} message={message} currentUserId={currentUser?.id} />
          ))}
          {chatAreaName === CHAT_AREA_NAME.COMMUNITY_POSTS && commsPosts?.map((message) => (
            <ViewPost key={message.id} message={message} currentUserId={currentUser?.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gray-200 px-4 py-3 relative">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" skinTonesDisabled width={350} height={400} />
          </div>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <div ref={attachmentMenuRef} className="absolute bottom-full left-12 mb-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
            <div className="py-2">
              <button
                onClick={() => { fileInputRef.current?.click(); }}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📷</span><span>Photos &amp; Videos</span>
              </button>
              <button
                onClick={() => { fileInputRef.current?.click(); }}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3">📄</span><span>Document</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-600 hover:text-green-500 p-2"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji"
          >
            <FaSmile size={20} />
          </button>

          <button
            type="button"
            className="text-gray-600 hover:text-green-500 p-2"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            title="Attach file"
          >
            <FaPaperclip size={20} />
          </button>

          <div className="flex-1">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) stopTyping(); }}
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
            >
              <FaMicrophone size={20} />
            </button>
          )}
        </form>

        {isUploading && (
          <div className="text-xs text-gray-500 mt-1 pl-2">Uploading…</div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
