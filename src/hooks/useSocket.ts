import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socketClient";

/**
 * Connects socket on mount (when user is authenticated) and disconnects on unmount.
 * Call this once at the app root level after login.
 */
export function useSocketConnection(userId: number | undefined) {
  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    connectSocket(token, userId);
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      disconnectSocket();
    };
  }, [userId]);
}

/**
 * Listen for incoming direct messages and append them to the provided setter.
 */
export function useIncomingDirectMessages(
  currentUserId: number | undefined,
  activeChatUserId: number | undefined,
  setMessages: (updater: (prev: any[]) => any[]) => void,
) {
  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();

    const handler = (message: any) => {
      // Only append if the message belongs to the currently open chat
      if (
        activeChatUserId &&
        (message.sender_id === activeChatUserId ||
          message.receiver_id === activeChatUserId)
      ) {
        setMessages((prev) => [...(prev || []), message]);
      }
    };

    socket.on("new-direct-message", handler);
    return () => {
      socket.off("new-direct-message", handler);
    };
  }, [currentUserId, activeChatUserId]);
}

/**
 * Listen for incoming group messages and append them.
 */
export function useIncomingGroupMessages(
  activeGroupId: number | undefined,
  setMessages: (updater: (prev: any[]) => any[]) => void,
) {
  useEffect(() => {
    if (!activeGroupId) return;

    const socket = getSocket();

    const handler = (message: any) => {
      if (message.group_id === activeGroupId) {
        setMessages((prev) => [...(prev || []), message]);
      }
    };

    socket.on("new-group-message", handler);
    return () => {
      socket.off("new-group-message", handler);
    };
  }, [activeGroupId]);
}
