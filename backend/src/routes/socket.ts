import { Socket, Server as SocketIOServer } from "socket.io";
import { rooms } from "../utils/room";
import { checkWinner } from "../utils/checkWinner";

const playerRooms = new Map<string, string>();
const socketToUserId = new Map<string, string>();

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

export function handleSocketConnection(socket: Socket, io: SocketIOServer) {
  const { userId } = socket.handshake.query as { userId: string };
  if (!userId) {
    console.warn(`Socket ${socket.id} connected without userId`);
    socket.disconnect(true);
    return;
  }
  console.log(`Client connected: ${userId}`);
  // Store mapping on initial connection
  socketToUserId.set(socket.id, userId);

  // Join room event
  socket.on("join-room", ({ roomId, playerName, userId }) => {
    try {
      // Remove from previous room if necessary
      const prevRoomId = playerRooms.get(userId);
      if (prevRoomId && prevRoomId !== roomId) {
        socket.leave(prevRoomId);
        const prevRoom = rooms.get(prevRoomId);
        if (prevRoom) {
          prevRoom.players = prevRoom.players.filter((p) => p.id !== userId);
          io.to(prevRoomId).emit("player-left", {
            playerName,
            players: prevRoom.players.map((p) => p.name),
          });
          if (prevRoom.players.length === 0) {
            rooms.delete(prevRoomId);
          }
        }
      }

      // Ensure room exists
      let room = rooms.get(roomId);
      if (!room) {
        room = {
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
      }

      // ✅ Prevent duplicates
      let player = room.players.find((p) => p.id === userId);
      if (!player) {
        player = {
          id: userId,
          name: playerName,
          symbol: room.players.length === 0 ? "X" : "O",
        };
        room.players.push(player);
      }

      playerRooms.set(userId, roomId);
      socket.join(roomId);

      const serverGameState = {
        board: Array.from(room.board.entries()),
        currentPlayer: room.currentPlayer,
        scores: room.scores,
        isGameActive: room.isGameActive,
        winner: room.winner,
        winningPositions: room.winningPositions,
      };

      io.to(roomId).emit("room-joined", {
        players: room.players,
        serverGameState,
      });
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Make move
  socket.on("make-move", ({ roomId, move, userId }) => {
    try {
      const room = rooms.get(roomId);
      if (!room) return socket.emit("error", { message: "Room not found" });

      const player = room.players.find((p) => p.id === userId);
      if (!player)
        return socket.emit("error", { message: "Player not in room" });

      // Turn check
      if (player.symbol !== room.currentPlayer)
        return socket.emit("error", { message: "Not your turn" });

      // Game active check
      if (!room.isGameActive)
        return socket.emit("error", { message: "Game not active" });

      const posKey = `${move.position.x},${move.position.y}`;

      // Cell occupied check
      if (room.board.has(posKey))
        return socket.emit("error", { message: "Cell already occupied" });

      // Save move
      room.board.set(posKey, move);

      // Check for winner using your checkWinner function
      const winnerResult = checkWinner(room.board, move.position);
      if (winnerResult) {
        const { player: winnerPlayer, winningPositions } = winnerResult;

        room.scores[winnerPlayer.symbol]++;
        room.winner = winnerPlayer.symbol;
        room.winningPositions = winningPositions;
        room.isGameActive = false;

        // Broadcast win
        io.to(roomId).emit("game-state-update", {
          board: Array.from(room.board.entries()),
          currentPlayer: room.currentPlayer,
          scores: room.scores,
          isGameActive: false,
          winner: winnerPlayer,
          winningPositions,
        });

        // Reset board after 3 seconds
        setTimeout(() => {
          room.board.clear();
          room.currentPlayer = "X";
          room.winner = null;
          room.winningPositions = null;
          room.isGameActive = true;

          io.to(roomId).emit("game-state-update", {
            board: Array.from(room.board.entries()),
            currentPlayer: room.currentPlayer,
            scores: room.scores,
            isGameActive: true,
            winner: null,
            winningPositions: null,
          });
        }, 3000);
      } else {
        // Toggle turn
        room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";

        // Broadcast updated game state
        io.to(roomId).emit("game-state-update", {
          board: Array.from(room.board.entries()),
          currentPlayer: room.currentPlayer,
          scores: room.scores,
          isGameActive: room.isGameActive,
          winner: null,
          winningPositions: null,
        });
      }
    } catch (err) {
      console.error("Error making move:", err);
      socket.emit("error", { message: "Failed to make move" });
    }
  });

  // Leave room event
  socket.on("leaveRoom", ({ roomId, playerName }) => {
    try {
      const userId = socketToUserId.get(socket.id);
      if (!userId) return;

      const room = rooms.get(roomId);
      if (room) {
        // Remove the player
        room.players = room.players.filter((p) => p.id !== userId);

        io.to(roomId).emit("player-left", {
          playerName,
          players: room.players,
        });

        // If room empty, delete it
        if (room.players.length === 0) {
          rooms.delete(roomId);
        }
      }

      // Clear mapping
      playerRooms.delete(userId);
      socket.leave(roomId);

      console.log(`Player ${playerName} (${userId}) left room ${roomId}`);
    } catch (error) {
      console.error("Error leaving room:", error);
      socket.emit("error", { message: "Failed to leave room" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${userId}`);
    if (!userId) return;
    setTimeout(() => {
      // Only remove if they haven't reconnected by now
      if (!Array.from(socketToUserId.values()).includes(userId)) {
        const roomId = playerRooms.get(userId);
        if (roomId) {
          const room = rooms.get(roomId);
          if (room) {
            const player = room.players.find((p) => p.id === userId);
            room.players = room.players.filter((p) => p.id !== userId);

            if (player) {
              io.to(roomId).emit("player-left", {
                playerName: player.name,
                players: room.players.map((p) => p.name),
              });
            }

            if (room.players.length === 0) {
              rooms.delete(roomId);
            }
          }
          playerRooms.delete(userId);
        }
      }
      socketToUserId.delete(socket.id);
    }, 3000); // 3-second grace period
  });
}
