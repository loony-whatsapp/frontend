import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socketClient";

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
 * Listen for incoming direct messages and append them to the sender's state.
 * Deduplicates by temp_id so an optimistic message is never shown twice.
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
      if (
        activeChatUserId &&
        (message.sender_id === activeChatUserId ||
          message.receiver_id === activeChatUserId)
      ) {
        setMessages((prev) => {
          const list = prev || [];
          // Skip if an optimistic message with the same temp_id already exists
          if (message.temp_id && list.some((m) => m.temp_id === message.temp_id)) {
            return list;
          }
          return [...list, message];
        });
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
        setMessages((prev) => {
          const list = prev || [];
          if (message.temp_id && list.some((m) => m.temp_id === message.temp_id)) {
            return list;
          }
          return [...list, message];
        });
      }
    };

    socket.on("new-group-message", handler);
    return () => {
      socket.off("new-group-message", handler);
    };
  }, [activeGroupId]);
}

/**
 * Handle message-error: remove the optimistic message from both lists.
 */
export function useMessageError(
  currentUserId: number | undefined,
  setMessages: (updater: (prev: any[]) => any[]) => void,
  setGroupMessages: (updater: (prev: any[]) => any[]) => void,
) {
  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();

    const handler = ({ temp_id }: { temp_id: string }) => {
      const remove = (prev: any[]) => (prev || []).filter((m) => m.temp_id !== temp_id);
      setMessages(remove);
      setGroupMessages(remove);
    };

    socket.on("message-error", handler);
    return () => {
      socket.off("message-error", handler);
    };
  }, [currentUserId]);
}
