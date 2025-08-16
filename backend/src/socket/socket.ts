import { Socket, Server as SocketIOServer } from "socket.io";
import { rooms } from "../utils/room";
import { checkWinner } from "../utils/checkWinner";
import { PlayerSymbol } from "../types/game";

type ServerSocket = Socket & {
  data: {
    userId?: string;
    roomId?: string;
    playerName?: string;
  };
};

const playerRooms = new Map<string, string>(); // userId -> roomId
const socketToUserId = new Map<string, string>(); // socket.id -> userId
const disconnectTimers = new Map<string, NodeJS.Timeout>(); // userId -> timeout

export function startGlobalMoveCleanup(io: SocketIOServer) {
  setInterval(() => {
    const now = Date.now();

    for (const room of rooms.values()) {
      let hasExpired = false;

      for (const [posKey, move] of room.board.entries()) {
        if (now - move.timestamp >= 20000) {
          room.board.delete(posKey);
          hasExpired = true;
        }
      }

      if (hasExpired) {
        io.to(room.id).emit("game-state-update", {
          board: Array.from(room.board.entries()),
          currentPlayer: room.currentPlayer,
          scores: room.scores,
          isGameActive: room.isGameActive,
          winner: room.winner,
          winningPositions: room.winningPositions,
        });
      }
    }
  }, 1000);
}

function serializeGameState(room: any) {
  return {
    board: Array.from(room.board.entries()),
    currentPlayer: room.currentPlayer,
    scores: room.scores,
    isGameActive: room.isGameActive,
    winner: room.winner,
    winningPositions: room.winningPositions,
  };
}

function assignSymbol(room: any): PlayerSymbol {
  const taken = room.players.map((p: any) => p.symbol);
  if (!taken.includes("X")) return "X";
  if (!taken.includes("O")) return "O";
  return "O";
}

export function handleSocketConnection(_socket: Socket, io: SocketIOServer) {
  const socket = _socket as ServerSocket;

  // Extract userId from handshake (authoritative)
  const { userId: qUserId } = socket.handshake.query as { userId?: string };
  if (!qUserId || typeof qUserId !== "string" || !qUserId.trim()) {
    socket.disconnect(true);
    return;
  }

  socket.data.userId = qUserId;
  socketToUserId.set(socket.id, qUserId);

  // If there was a pending disconnect removal for this user (e.g., refresh), cancel it.
  const pending = disconnectTimers.get(qUserId);
  if (pending) {
    clearTimeout(pending);
    disconnectTimers.delete(qUserId);
  }

  // === JOIN ROOM ===
  socket.on(
    "join-room",
    ({ roomId, playerName }: { roomId: string; playerName: string }) => {
      try {
        const userId = socket.data.userId!;
        if (!roomId || !playerName) {
          return socket.emit("error", { message: "Invalid join payload" });
        }

        // If same user was in a different room, leave that room properly
        const prevRoomId = playerRooms.get(userId);
        if (prevRoomId && prevRoomId !== roomId) {
          socket.leave(prevRoomId);

          const prevRoom = rooms.get(prevRoomId);
          if (prevRoom) {
            prevRoom.players = prevRoom.players.filter(
              (p: any) => p.id !== userId
            );

            io.to(prevRoomId).emit("player-left", {
              playerName,
              players: prevRoom.players,
            });

            if (prevRoom.players.length === 0) {
              rooms.delete(prevRoomId);
            }
          }
          playerRooms.delete(userId);
        }

        // Ensure room exists
        let room = rooms.get(roomId);
        if (!room) {
          room = {
            id: roomId,
            players: [],
            board: new Map(),
            currentPlayer: "X" as PlayerSymbol,
            scores: { X: 0, O: 0 },
            isGameActive: true,
            winner: null as PlayerSymbol | null,
            winningPositions: null,
          };
          rooms.set(roomId, room);
        }

        // Upsert player
        let player = room.players.find((p: any) => p.id === userId);
        if (!player) {
          const symbol = assignSymbol(room);
          if (!symbol) {
            // Room full for player roles; optionally allow spectator or reject
            return socket.emit("error", { message: "Room is full" });
          }
          player = { id: userId, name: playerName, symbol };
          room.players.push(player);
        } else {
          // Update name if changed (optional)
          player.name = playerName;
        }

        // Track membership
        playerRooms.set(userId, roomId);
        socket.data.roomId = roomId;
        socket.data.playerName = playerName;
        socket.join(roomId);

        io.to(roomId).emit("room-joined", {
          players: room.players, // always send objects
          serverGameState: serializeGameState(room),
        });
      } catch (err) {
        console.error("Error joining room:", err);
        socket.emit("error", { message: "Failed to join room" });
      }
    }
  );

  // === MAKE MOVE ===
  socket.on("make-move", ({ roomId, move }: { roomId: string; move: any }) => {
    try {
      const userId = socket.data.userId!;
      const room = rooms.get(roomId);
      if (!room) return socket.emit("error", { message: "Room not found" });

      const player = room.players.find((p: any) => p.id === userId);
      if (!player)
        return socket.emit("error", { message: "Player not in room" });

      if (player.symbol !== room.currentPlayer)
        return socket.emit("error", { message: "Not your turn" });

      if (!room.isGameActive)
        return socket.emit("error", { message: "Game not active" });

      const posKey = `${move.position.x},${move.position.y}`;
      if (room.board.has(posKey))
        return socket.emit("error", { message: "Cell already occupied" });

      room.board.set(posKey, move);

      const winnerResult = checkWinner(room.board, move.position);
      if (winnerResult) {
        const { player: winnerPlayer, winningPositions } = winnerResult;

        room.scores[winnerPlayer]++;
        room.winner = winnerPlayer;
        room.winningPositions = winningPositions;
        room.isGameActive = false;

        io.to(roomId).emit("game-state-update", {
          ...serializeGameState(room),
          isGameActive: false,
          winner: winnerPlayer,
          winningPositions,
        });

        setTimeout(() => {
          room.board.clear();
          room.currentPlayer = "X";
          room.winner = null;
          room.winningPositions = null;
          room.isGameActive = true;

          io.to(roomId).emit("game-state-update", serializeGameState(room));
        }, 3000);
      } else {
        room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";
        io.to(roomId).emit("game-state-update", serializeGameState(room));
      }
    } catch (err) {
      console.error("Error making move:", err);
      socket.emit("error", { message: "Failed to make move" });
    }
  });

  // === LEAVE ROOM (explicit, e.g., SPA nav) ===
  socket.on("leaveRoom", ({ roomId }: { roomId: string }) => {
    try {
      const userId = socket.data.userId!;
      const room = rooms.get(roomId);
      if (room) {
        room.players = room.players.filter((p: any) => p.id !== userId);

        io.to(roomId).emit("player-left", {
          playerName: socket.data.playerName,
          players: room.players, // objects
        });

        if (room.players.length === 0) {
          rooms.delete(roomId);
        }
      }

      playerRooms.delete(userId);
      socket.leave(roomId);
      if (socket.data.roomId === roomId) socket.data.roomId = undefined;
    } catch (err) {
      console.error("Error leaving room:", err);
      socket.emit("error", { message: "Failed to leave room" });
    }
  });

  // === SEND REACTION ===
  socket.on(
    "send-reaction",
    ({ roomId, playerName, emoji }: { roomId: string; playerName: string; emoji: string }) => {
      try {
        const room = rooms.get(roomId);
        if (!room) return socket.emit("error", { message: "Room not found" });

        const player = room.players.find((p: any) => p.name === playerName);
        if (!player)
          return socket.emit("error", { message: "Player not in room" });

        // Broadcast to everyone in the room
        io.to(roomId).emit("reaction", {
          emoji,
        });
      } catch (err) {
        console.error("Error sending reaction:", err);
        socket.emit("error", { message: "Failed to send reaction" });
      }
    }
  );

  // === DISCONNECT (browser close/refresh) ===
  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    const roomId = socket.data.roomId;

    // Clean old socket mapping immediately
    if (userId) {
      socketToUserId.delete(socket.id);
    }

    // If no userId known, nothing to do
    if (!userId) return;

    // If they reconnect quickly, cancel removal
    if (disconnectTimers.has(userId)) {
      clearTimeout(disconnectTimers.get(userId)!);
      disconnectTimers.delete(userId);
    }

    // Schedule removal after grace period
    const timer = setTimeout(() => {
      // If userId appears in ANY current socket mapping, they reconnected
      const stillConnected = Array.from(socketToUserId.values()).includes(
        userId
      );
      if (stillConnected) return;

      const currentRoomId = playerRooms.get(userId) ?? roomId;
      if (currentRoomId) {
        const room = rooms.get(currentRoomId);
        if (room) {
          const player = room.players.find((p: any) => p.id === userId);
          room.players = room.players.filter((p: any) => p.id !== userId);

          if (player) {
            io.to(currentRoomId).emit("player-left", {
              playerName: player.name,
              players: room.players, // objects
            });
          }

          if (room.players.length === 0) {
            rooms.delete(currentRoomId);
          }
        }
        playerRooms.delete(userId);
      }

      disconnectTimers.delete(userId);
    }, 3000);

    disconnectTimers.set(userId, timer);
  });
}
