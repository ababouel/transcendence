import { UNAUTHORIZED_EVENT } from "@transcendence/common";
import axios from "axios";
import { io } from "socket.io-client";

export function getSocket() {
  const socket = io("http://localhost:8080", {
    withCredentials: true,
  });

  socket.on(UNAUTHORIZED_EVENT, async () => {
    console.log("Unauthorized");

    try {
      // try to refresh tokens
      await axios.post("/api/auth/refresh-tokens");
      setTimeout(() => {
        socket.connect();
      }, 200);
    } catch (error) {}
  });
  return socket;
}
