import { io, Socket } from "socket.io-client";
import { API_URL } from "../Config";

let socket: Socket | null = null;

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

  // Authenticate only after the TCP handshake completes, not before.
  // Emitting before "connect" fires means the event is silently dropped.
  s.once("connect", () => {
    s.emit("authenticate", token);
    s.emit("join-user", userId);
  });

  s.connect();
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
