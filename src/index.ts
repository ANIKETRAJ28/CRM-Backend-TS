import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { FRONTEND_URL, PORT } from "./config/env.config";
import { router } from "./routes";
import { WebSocket, WebSocketServer } from "ws";

const app = express();

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

export const server = app.listen(PORT, () => {
  console.log("Server up! on port", PORT);
});

export const wss = new WebSocketServer({ server });
export const clients = new Map<string, WebSocket>();

wss.on("connection", (ws, req) => {
  // console.log("new user connected...");
  ws.on("error", console.error);
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const userId = params.get("userId");
  if (userId) {
    clients.set(userId, ws);
  }
  ws.on("close", () => {
    // console.log(`User ${userId} disconnected.`);
    clients.delete(userId!);
  });
});
