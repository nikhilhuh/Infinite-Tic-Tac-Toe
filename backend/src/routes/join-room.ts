import express, { Request, Response } from "express";
import { rooms } from "../utils/room";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const { roomId, name } = req.body;

  if (!roomId || !name) {
    res.status(400).json({
      success: false,
      message: "Room ID and player name are required",
    });
    return;
  }

  const room = rooms.get(roomId);

  if (!room) {
    res.status(404).json({ success: false, message: "Room not found" });
    return;
  }

  const playerExists = room.players.some((p) => p.name === name);
  if (playerExists) {
    res
      .status(400)
      .json({
        success: false,
        message: "Player with this name is already in the room",
      });
    return;
  }

  if (room.players.length >= 2) {
    res.status(400).json({ success: false, message: "Room is full" });
    return;
  }

  res.json({ success: true, message: "Player can join the room" });
});

export { router };
