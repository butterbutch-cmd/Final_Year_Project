// services/websocketfileapi.js
// Example Socket.IO client wrapper for realtime forum updates.

import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // change to your socket server origin if different
let socket = null;

/**
 * Connect socket (singleton). Reads token from localStorage and sends as auth.
 */
export function connectSocket() {
  if (socket && socket.connected) return socket;

  const token = localStorage.getItem("token");

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    auth: {
      // server middleware should accept this (it can extract Bearer token)
      token: token ? `Bearer ${token}` : "",
    },
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.debug("Socket connected", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.debug("Socket disconnected", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect error", err.message || err);
  });

  return socket;
}

/** Disconnect and cleanup */
export function disconnectSocket() {
  if (!socket) return;
  try {
    socket.disconnect();
  } catch (e) {
    console.error("Error disconnecting socket", e);
  } finally {
    socket = null;
  }
}

/** Join a thread-specific room on the server (server should handle this event) */
export function joinThreadRoom(threadId) {
  if (!socket) connectSocket();
  if (!socket) return;
  socket.emit("thread:join", { threadId });
}

/** Leave thread room */
export function leaveThreadRoom(threadId) {
  if (!socket) return;
  socket.emit("thread:leave", { threadId });
}

/** Listen for comment created events
 *  cb(payload) where payload expected { threadId, comment }
 */
export function onCommentCreated(cb) {
  if (!socket) connectSocket();
  if (!socket) return;
  socket.on("comment:created", cb);
}

/** Remove comment created listener.
 *  If cb omitted, remove all listeners for comment:created
 */
export function offCommentCreated(cb) {
  if (!socket) return;
  if (cb) socket.off("comment:created", cb);
  else socket.removeAllListeners("comment:created");
}

/** (Optional) Emit create-comment event through socket (if you want to support creating via socket)
 *  server must support "comment:create" or similar
 */
export function emitCreateComment(threadId, commentPayload) {
  if (!socket) connectSocket();
  if (!socket) return;
  socket.emit("comment:create", { threadId, comment: commentPayload });
}