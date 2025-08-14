import { useEffect, useState } from "react";
import { GameState, Move, OnlinePlayer, Player } from "@/types/game";
import { getOrCreateUserId } from "@/utils/getOrCreateUserId";
import socket from "@/socket/socketSetup";

const userId = getOrCreateUserId();

interface UseSocketReturn {
  socket: typeof socket;
  isConnected: boolean;
  connectedPlayers: OnlinePlayer[];
  joinRoom: (roomId: string, playerName: string) => void;
  makeMove: (roomId: string, x: number, y: number) => void;
  gameState: GameState | null;
  error: string | null;
}

export function useSocket(): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connectedPlayers, setConnectedPlayers] = useState<OnlinePlayer[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle connect/disconnect
    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setError(null);
      setIsConnected(false);
    });

    // When a player joins or reconnects
    socket.on("room-joined", ({ players, serverGameState }) => {
      setError(null);
      setConnectedPlayers(players);
      if (serverGameState) {
        const boardMap = new Map<string, Move>();
        serverGameState.board.forEach(([key, move]: [string, Move]) => {
          boardMap.set(key, move);
        });

        setGameState({
          ...serverGameState,
          board: boardMap,
        });
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
      return;
    }

    // Check turn
    if (gameState.currentPlayer !== player.symbol) {
      setError("Not your turn.");
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
    isConnected,
    connectedPlayers,
    joinRoom,
    makeMove,
    gameState,
    error,
  };
}
