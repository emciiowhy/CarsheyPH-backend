import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL?.split(",") || ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("message", (data) => console.log("📩 Message received:", data));
    socket.on("join-user", (userId: string) => socket.join(`user_${userId}`));
    socket.on("join-vehicle", (vehicleId: string) => socket.join(`vehicle_${vehicleId}`));
    socket.on("leave-vehicle", (vehicleId: string) => socket.leave(`vehicle_${vehicleId}`));

    socket.on("disconnect", () =>
      console.log("🔴 Client disconnected:", socket.id)
    );
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("❌ Socket.io not initialized!");
  return io;
};
