import { GameState, OnlinePlayer } from "@/types/game";
import React from "react";
import ScoreBoard from "./ScoreBoard";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import InfiniteBoard from "./InfiniteBoard";

interface DesktopLayoutProps {
  gameState: GameState;
  mode: "local" | "online";
  playerName: string;
  connectedPlayers: OnlinePlayer[];
  currentRoomId: string | null;
  isCreating: boolean;
  makeMove: (x: number, y: number) => void;
  error: string | null;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  gameState,
  mode,
  playerName,
  connectedPlayers,
  currentRoomId,
  isCreating,
  makeMove,
  error
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  return (
    <div className="hidden lg:grid lg:grid-cols-4 gap-4 h-full w-full">
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

      <div className="lg:col-span-3 space-y-4">
        {error && <p className="text-red-400 text-center text-sm p-2">{error}</p>}
        {mode === "online" && currentRoomId && isCreating && connectedPlayers.length < 2  && (
          <motion.div
            className="bg-game-blue/10 border border-game-blue/30 rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-game-blue">Room Created!</h3>
                <p className="text-sm text-muted-foreground">
                  Share this ID with friends:
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold text-game-blue">
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
                  className="mt-1"
                >
                  {copied? "✅Copied" : "Copy Room Id"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <InfiniteBoard
          board={gameState.board || new Map()}
          onMove={makeMove}
          connectedPlayers={connectedPlayers}
          currentPlayer={gameState.currentPlayer || "X"}
          isGameActive={gameState.isGameActive || true}
          winningPositions={gameState.winningPositions || null}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default DesktopLayout;
