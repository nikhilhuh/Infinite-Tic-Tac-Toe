import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { GameState } from "@/types/game";
import DesktopLayout from "@/components/Game/DesktopLayout";
import MobileLayout from "@/components/Game/MobileLayout";
import Header from "@/components/Game/Header";
import Invalid from "@/components/Game/Invalid";
import { makeMoveFunction } from "@/utils/makeMove";
import { useSocketContext } from "@/context/SocketContext";

export default function Game() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") as "local" | "online";
  const playerName = searchParams.get("name") || "Player";
  const roomId = searchParams.get("room");
  const [currentRoomId] = useState<string | null>(() => {
    const saved = sessionStorage.getItem("roomId");
    return saved || roomId;
  });
  const hasRoom = useRef(false);

  const scores = JSON.parse(
    sessionStorage.getItem(`${mode}-scores`) || JSON.stringify({ X: 0, O: 0 })
  );

  const [gameState, setGameState] = useState<GameState>({
    board: new Map(),
    currentPlayer: "X",
    scores: scores,
    isGameActive: true,
    winner: null,
    winningPositions: null,
  });

  const {
    socket,
    connectedPlayers,
    joinRoom,
    makeMove: makeOnlineMove,
    gameState: onlineGameState,
    error,
  } = useSocketContext();

  useEffect(() => {
    window.scrollTo(0,0);
    
    if (mode === "online" && currentRoomId && playerName && !hasRoom.current) {
      joinRoom(currentRoomId, playerName);
      hasRoom.current = true;
    }

    return () => {
      // Normal SPA route change cleanup
      const stillOnGamePage = window.location.pathname.includes("/game");
      if (!stillOnGamePage) {
        socket.emit("leaveRoom", { roomId: currentRoomId, playerName });
        sessionStorage.removeItem("roomId");
        hasRoom.current = false;
        sessionStorage.removeItem(`${mode}-scores`);
      }
    };
  }, [mode, currentRoomId, playerName, joinRoom, socket]);

  // ✅ Sync onlineGameState into local state when in online mode
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
      makeOnlineMove
    );
  }

  // Save scores only in local mode
  useEffect(() => {
    if (mode === "local") {
      sessionStorage.setItem(
        `${mode}-scores`,
        JSON.stringify(gameState.scores)
      );
    }
  }, [gameState.scores, mode]);

  if (mode === "online" && !roomId) {
    return <Invalid />;
  }

  return (
    <div className="min-h-screen bg-game-bg">
      <Header mode={mode} currentRoomId={currentRoomId} />

      <div className="max-w-7xl mx-auto p-2 lg:p-4">
        <MobileLayout
          gameState={gameState}
          mode={mode}
          playerName={playerName}
          connectedPlayers={connectedPlayers}
          currentRoomId={currentRoomId}
          makeMove={makeMove}
          error={error}
        />

        <DesktopLayout
          gameState={gameState}
          mode={mode}
          playerName={playerName}
          connectedPlayers={connectedPlayers}
          currentRoomId={currentRoomId}
          makeMove={makeMove}
          error={error}
        />
      </div>
    </div>
  );
}
