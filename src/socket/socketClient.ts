import { io, Socket } from "socket.io-client";
import { API_URL } from "../Config";

let socket: Socket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket(token: string, userId: number): Socket {
  const s = getSocket();
  if (s.connected) return s;

  s.once("connect", () => {
    s.emit("authenticate", token);
    s.emit("join-user", userId);
    // Start heartbeat after authentication — keeps presence:online score fresh.
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (s.connected) s.emit("heartbeat");
    }, 30_000);
  });

  s.connect();
  return s;
}

export function disconnectSocket(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function emitDirectMessage(payload: {
  receiver_id: number;
  body_text?: string;
  media_url?: string;
  temp_id: string;
}): void {
  getSocket().emit("direct-message", payload);
}

export function emitGroupMessage(payload: {
  group_id: number;
  body_text?: string;
  media_url?: string;
  temp_id: string;
}): void {
  getSocket().emit("group-message", payload);
}
