import { useEffect, useState } from "react";
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
 * When the server acks a sent message, update the optimistic entry:
 * replace it with the server payload and set status → 'sent'.
 */
export function useMessageSent(
  currentUserId: number | undefined,
  setMessages: (updater: (prev: any[]) => any[]) => void,
) {
  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket();
    const handler = ({ temp_id, message }: { temp_id: string; message: any }) => {
      setMessages((prev) =>
        (prev || []).map((m) =>
          m.temp_id === temp_id ? { ...m, ...message, status: "sent" } : m,
        ),
      );
    };
    socket.on("message-sent", handler);
    return () => { socket.off("message-sent", handler); };
  }, [currentUserId]);
}

/**
 * Update message status when:
 *  - message-delivered: receiver came online → show double grey ticks
 *  - message-read:      receiver opened chat → show double blue ticks
 * Only updates messages the current user sent to the active chat partner.
 */
export function useMessageStatusUpdates(
  currentUserId: number | undefined,
  otherUserId: number | undefined,
  setMessages: (updater: (prev: any[]) => any[]) => void,
) {
  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket();

    const onDelivered = ({ to_user_id }: { to_user_id: number }) => {
      if (otherUserId && to_user_id !== otherUserId) return;
      setMessages((prev) =>
        (prev || []).map((m) =>
          m.sender_id === currentUserId && m.status !== "read"
            ? { ...m, status: "delivered" }
            : m,
        ),
      );
    };

    const onRead = ({ reader_id }: { reader_id: number }) => {
      if (otherUserId && reader_id !== otherUserId) return;
      setMessages((prev) =>
        (prev || []).map((m) =>
          m.sender_id === currentUserId ? { ...m, status: "read" } : m,
        ),
      );
    };

    socket.on("message-delivered", onDelivered);
    socket.on("message-read", onRead);
    return () => {
      socket.off("message-delivered", onDelivered);
      socket.off("message-read", onRead);
    };
  }, [currentUserId, otherUserId]);
}

/**
 * Track whether the other participant in a chat is currently typing.
 * Returns true while a `user-typing` event with typing=true is in flight;
 * auto-clears after 3 s of silence (in case the stop event is lost).
 */
export function useTypingIndicator(
  watchUserId: number | undefined,
): boolean {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!watchUserId) return;
    const socket = getSocket();
    let clearTimer: ReturnType<typeof setTimeout> | null = null;

    const handler = ({ user_id, typing }: { user_id: number; typing: boolean }) => {
      if (user_id !== watchUserId) return;
      setIsTyping(typing);
      if (clearTimer) clearTimeout(clearTimer);
      if (typing) {
        clearTimer = setTimeout(() => setIsTyping(false), 3_000);
      }
    };

    socket.on("user-typing", handler);
    return () => {
      socket.off("user-typing", handler);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, [watchUserId]);

  return isTyping;
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
