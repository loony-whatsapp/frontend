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
  if (!s.connected) {
    s.connect();
    s.emit("authenticate", token);
    s.emit("join-user", userId);
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
