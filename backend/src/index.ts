import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { handleSocketConnection, startGlobalMoveCleanup } from "./routes/socket.js";
import { mainRouter } from "./routes/mainRouter.js";

// 👇 Exported function you can import elsewhere
export function createServer() {
  const app = express();
  const httpServer = createHttpServer(app);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  startGlobalMoveCleanup(io);

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", mainRouter);

  io.on("connection", (socket) => {
    handleSocketConnection(socket, io);
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  return { app, httpServer };
}

// 👇 Main script execution starts here
const { app, httpServer } = createServer();
const port = process.env.PORT || 3001;

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const distPath = path.join(__dirname, "../spa");

app.use(express.static(distPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

httpServer.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(
    `📱 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
