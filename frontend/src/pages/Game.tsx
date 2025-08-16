import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { GameState } from "@/types/game";
import Header from "@/components/Game/Header";
import Invalid from "@/components/Game/Invalid";
import { makeMoveFunction } from "@/utils/makeMove";
import { useSocketContext } from "@/context/SocketContext";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "@/components/Game/MainLayout";

const demoGameState: GameState = {
  board: new Map(),
  currentPlayer: "X",
  scores: { X: 0, O: 0 },
  isGameActive: true,
  winner: null,
  winningPositions: null,
};

// Helpers to save/restore Map safely
function saveGameState(mode: string, gameState: GameState) {
  const serializable = {
    ...gameState,
    board: Object.fromEntries(gameState.board),
  };
  sessionStorage.setItem(`${mode}-state`, JSON.stringify(serializable));
}

function loadGameState(mode: string): GameState {
  const data = sessionStorage.getItem(`${mode}-state`);
  if (!data) return demoGameState;
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    board: new Map(Object.entries(parsed.board)),
  };
}

export default function Game() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") as "local" | "online" | "ai";
  const difficulty = searchParams.get("difficulty") as
    | "easy"
    | "medium"
    | "hard";
  const playerName = searchParams.get("name") || "Player";
  const roomId = searchParams.get("room");
  const [currentRoomId] = useState<string | null>(() => {
    const saved = sessionStorage.getItem("roomId");
    return saved || roomId;
  });
  const hasRoom = useRef(false);
  const [gameState, setGameState] = useState<GameState>(() =>
    loadGameState(mode)
  );

  const {
    socket,
    connectedPlayers,
    joinRoom,
    makeMove: makeOnlineMove,
    gameState: onlineGameState,
    error,
    lastReaction,
    sendReaction,
  } = useSocketContext();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (mode === "online" && currentRoomId && playerName && !hasRoom.current) {
      joinRoom(currentRoomId, playerName);
      hasRoom.current = true;
    }

    return () => {
      // Normal SPA route change cleanup
      const stillOnGamePage = window.location.pathname.includes("/game");
      if (!stillOnGamePage) {
        socket.emit("leaveRoom", { roomId: currentRoomId, playerName });
        hasRoom.current = false;
        sessionStorage.clear();
      }
    };
  }, [mode, currentRoomId, playerName, joinRoom, socket]);

  // ✅ Sync onlineGameState
  useEffect(() => {
    if (mode === "online" && onlineGameState) {
      setGameState(onlineGameState);
    }
  }, [mode, onlineGameState]);

  function makeMove(x: number, y: number) {
    makeMoveFunction(
      mode,
      currentRoomId,
      gameState,
      setGameState,
      x,
      y,
      makeOnlineMove,
      difficulty
    );
  }

  // Save scores only in local and ai mode
  useEffect(() => {
    if (mode === "local" || mode === "ai") {
      saveGameState(mode, gameState);
    }
  }, [gameState, mode]);

  if (mode === "online" && !roomId) {
    return <Invalid />;
  }

  return (
    <div className="min-h-screen bg-game-bg">
      <Header
        mode={mode}
        currentRoomId={currentRoomId}
        difficulty={difficulty}
      />
      {/* ✅ Animated Error Dialog */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-red-500 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-2 lg:p-4">
        <MainLayout
          gameState={gameState}
          mode={mode}
          playerName={playerName}
          connectedPlayers={connectedPlayers}
          currentRoomId={currentRoomId}
          makeMove={makeMove}
          lastReaction={lastReaction}
          sendReaction={sendReaction}
        />
      </div>
    </div>
  );
}
