import express, { Request, Response } from "express";
import { generateRoomId, rooms } from "../utils/room";
import { Room } from "../types/game";
const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res
      .status(400)
      .json({ success: false, message: "Player name is required" });
    return;
  }

  const roomId = generateRoomId();
  const room: Room = {
    id: roomId,
    players: [], 
    board: new Map(),
    currentPlayer: "X",
    scores: { X: 0, O: 0 },
    isGameActive: true,
    winner: null,
    winningPositions: null,
  };

  rooms.set(roomId, room);

  res.json({ success: true, roomId, message: "Player created the room , now join him in the room" });
});

export { router };
