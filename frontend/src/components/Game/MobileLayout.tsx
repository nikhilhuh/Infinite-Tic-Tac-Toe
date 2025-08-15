import { GameState, OnlinePlayer } from "@/types/game";
import React from "react";
import ScoreBoard from "./ScoreBoard";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import InfiniteBoard from "./InfiniteBoard";

interface MobileLayoutProps {
  gameState: GameState;
  mode: "local" | "online";
  playerName: string;
  connectedPlayers: OnlinePlayer[];
  currentRoomId: string | null;
  makeMove: (x: number, y: number) => void;
  error: string | null;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  gameState,
  mode,
  playerName,
  connectedPlayers,
  currentRoomId,
  makeMove,
  error
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  return (
    <div className="lg:hidden space-y-4">
      {error && <p className="text-red-400 text-center text-xs p-2">{error}</p>}
      {mode === "online" && currentRoomId && connectedPlayers.length < 2 && (
        <motion.div
          className={`bg-game-blue/10 border border-game-blue/30 rounded-lg p-2 ${
            connectedPlayers.length === 2 ? "hidden" : "block"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h3 className="font-semibold text-game-blue mb-2 text-sm">Room Created!</h3>
            <p className="text-xs text-muted-foreground mb-2">
              Share this ID with friends:
            </p>
            <div className="font-mono text-lg font-bold text-game-blue mb-2">
              {currentRoomId}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => 
                navigator.clipboard.writeText(currentRoomId || "").then(()=> {
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 2000);
                    })
              }
              className="text-xs"
            >
              {copied? "✅Copied" : "Copy Room Id"}
            </Button>
          </div>
        </motion.div>
      )}

      <InfiniteBoard
        board={gameState.board || new Map()}
        onMove={makeMove}
        currentPlayer={gameState.currentPlayer || "X"}
        isGameActive={gameState.isGameActive || true}
        winningPositions={gameState.winningPositions || null}
        mode={mode}
        connectedPlayers={connectedPlayers}
        playerName={playerName}
      />

      <ScoreBoard
        scores={gameState.scores || { X: 0, O: 0 }}
        currentPlayer={gameState.currentPlayer || "X"}
        winner={gameState.winner || null}
        mode={mode}
        playerName={playerName}
        connectedPlayers={connectedPlayers}
      />
    </div>
  );
};

export default MobileLayout;
