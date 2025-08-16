import { GameState, OnlinePlayer } from "@/types/game";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import InfiniteBoard from "./InfiniteBoard";
import ScoreBoard from "./ScoreBoard";

interface MainLayoutProps {
  gameState: GameState;
  mode: "local" | "online";
  playerName: string;
  connectedPlayers: OnlinePlayer[];
  currentRoomId: string | null;
  makeMove: (x: number, y: number) => void;
  lastReaction: { emoji: string } | null;
  sendReaction: (roomId: string, playerName: string, emoji: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  gameState,
  mode,
  playerName,
  connectedPlayers,
  currentRoomId,
  makeMove,
  lastReaction,
  sendReaction,
}) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-4 w-full h-full">
      {/* === Scoreboard (mobile: bottom, desktop: left) === */}
      <div className="lg:col-span-1">
        <ScoreBoard
          scores={gameState.scores || { X: 0, O: 0 }}
          currentPlayer={gameState.currentPlayer || "X"}
          winner={gameState.winner || null}
          mode={mode}
          playerName={playerName}
          connectedPlayers={connectedPlayers}
        />
      </div>

      {/* === Board & Room Info === */}
      <div className="lg:col-span-3 space-y-4">
        {mode === "online" && currentRoomId && connectedPlayers.length < 2 && (
          <motion.div
            className="bg-game-blue/10 border border-game-blue/30 rounded-lg p-2 lg:p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left">
                <h3 className="font-semibold text-game-blue mb-1 text-sm lg:text-base">
                  Room Created!
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-0">
                  Share this ID with friends:
                </p>
              </div>
              <div className="text-center lg:text-right">
                <div className="font-mono text-lg font-bold text-game-blue">
                  {currentRoomId}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard.writeText(currentRoomId || "").then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    })
                  }
                  className="mt-1 text-xs"
                >
                  {copied ? "✅Copied" : "Copy Room Id"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <InfiniteBoard
          board={gameState.board || new Map()}
          onMove={makeMove}
          currentPlayer={gameState.currentPlayer || "X"}
          isGameActive={gameState.isGameActive ?? true}
          winningPositions={gameState.winningPositions || null}
          mode={mode}
          connectedPlayers={connectedPlayers}
          playerName={playerName}
          currentRoomId={currentRoomId}
          lastReaction={lastReaction}
          sendReaction={sendReaction}
        />
      </div>
    </div>
  );
};

export default MainLayout;
