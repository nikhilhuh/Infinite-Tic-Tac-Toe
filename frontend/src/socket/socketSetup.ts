import { getOrCreateUserId } from "@/utils/getOrCreateUserId";
import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const socket: Socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  query: { userId: getOrCreateUserId() },
});

export default socket;
