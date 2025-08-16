import { useEffect, useState } from "react";
import { GameState, Move, OnlinePlayer, Player } from "@/types/game";
import { getOrCreateUserId } from "@/utils/getOrCreateUserId";
import socket from "@/socket/socketSetup";

const userId = getOrCreateUserId();

interface UseSocketReturn {
  socket: typeof socket;
  connectedPlayers: OnlinePlayer[];
  joinRoom: (roomId: string, playerName: string) => void;
  makeMove: (roomId: string, x: number, y: number) => void;
  gameState: GameState | null;
  error: string | null;
}

export function useSocket(): UseSocketReturn {
  const [connectedPlayers, setConnectedPlayers] = useState<OnlinePlayer[]>(
    () => {
      const saved = sessionStorage.getItem("connectedPlayers");
      return saved ? JSON.parse(saved) : [];
    }
  );

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = sessionStorage.getItem("gameState");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
    return null;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle connect/disconnect
    socket.on("connect", () => {
      setError(null);
    });

    socket.on("disconnect", () => {
      setError(null);
    });

    // When a player joins or reconnects
    socket.on("room-joined", ({ players, serverGameState }) => {
      setError(null);
      setConnectedPlayers(players);
      sessionStorage.setItem("connectedPlayers", JSON.stringify(players));
      if (serverGameState) {
        const boardMap = new Map<string, Move>();
        serverGameState.board.forEach(([key, move]: [string, Move]) => {
          boardMap.set(key, move);
        });

        setGameState({
          ...serverGameState,
          board: boardMap,
        });
        sessionStorage.setItem("gameState", JSON.stringify(gameState));
      }
    });

    // When a player leaves
    socket.on("player-left", ({ players }) => {
      setError(null);
      setConnectedPlayers(players);
    });

    // Game state updates
    socket.on("game-state-update", (serverGameState) => {
      const boardMap = new Map<string, Move>();
      serverGameState.board.forEach(([key, move]: [string, Move]) => {
        boardMap.set(key, move);
      });

      setGameState({
        ...serverGameState,
        board: boardMap,
      });
    });

    // Error handling
    socket.on("error", ({ message }) => {
      setError(message);
      setTimeout(() => {
        setError(null)
      }, 2000);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-joined");
      socket.off("player-left");
      socket.off("game-state-update");
      socket.off("error");
    };
  }, []);

  // Event emitters
  const joinRoom = (roomId: string, playerName: string) => {
    setError(null);
    socket.emit("join-room", { roomId, playerName, userId });
  };

  // Make move
  const makeMove = (roomId: string, x: number, y: number) => {
    if (!gameState) return;

    const player = connectedPlayers.find((p) => p.id === userId);
    if (!player) {
      setError("You are not in the game.");
      setTimeout(() => {
        setError(null)
      }, 2000);
      return;
    }

    // Check turn
    if (gameState.currentPlayer !== player.symbol) {
      setError("Not your turn.");
      setTimeout(() => {
        setError(null)
      }, 2000);
      return;
    }

    // Emit move to server
    const move: Move = {
      player: player.symbol as Player,
      timestamp: Date.now(),
      position: { x, y },
    };

    setError(null);
    socket.emit("make-move", { roomId, move, userId });
  };

  return {
    socket,
    connectedPlayers,
    joinRoom,
    makeMove,
    gameState,
    error,
  };
}
