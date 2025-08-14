import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Move, OnlinePlayer, Player, Position } from "@/types/game";
import { Cell } from "../Board/Cell";

interface InfiniteBoardProps {
  board: Map<string, Move>;
  onMove: (x: number, y: number) => void;
  currentPlayer: Player;
  isGameActive: boolean;
  winningPositions: Position[] | null;
  connectedPlayers?: OnlinePlayer[];
  mode: "online" | "local";
}

export default function InfiniteBoard({
  board,
  onMove,
  currentPlayer,
  isGameActive,
  winningPositions,
  connectedPlayers,
  mode
}: InfiniteBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const gridSize = 25; // Visible grid size
  const centerOffset = Math.floor(gridSize / 2);

  const handleCellClick = (x: number, y: number) => {
    if (!isGameActive || winningPositions) return;
    const position = `${x},${y}`;
    if (board.has(position)) return;

    onMove(x, y);
  };

  const handleCellHover = (x: number, y: number, isHovering: boolean) => {
    if (!isGameActive || winningPositions) return;
    const position = `${x},${y}`;
    setHoveredCell(isHovering ? position : null);
  };

  return (
    <motion.div
      className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-3 sm:p-4 md:p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-bold">Game Board</h2>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Current:{" "}
          <span
            className={
              currentPlayer === "X" ? "text-game-blue" : "text-game-red"
            }
          >
            {currentPlayer === "X" ? "× Player" : "○ Player"}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-game-bg/50 rounded-lg w-full min-h-[300px] ${mode === "online" && connectedPlayers && connectedPlayers.length < 2 ? "h-[50vh] max-h-[55vh]" : "h-[50vh] md:h-[60vh] lg:h-[65vh] max-h-[65vh]"} `}
      >
        <div className="absolute inset-0">
          {Array.from({ length: gridSize }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: gridSize }, (_, col) => {
                const x = col - centerOffset + 0;
                const y = row - centerOffset + 0;
                const position = `${x},${y}`;
                const move = board.get(position);
                const isHovered = hoveredCell === position;

                return (
                  <div
                    key={position}
                    onMouseEnter={() => handleCellHover(x, y, true)}
                    onMouseLeave={() => handleCellHover(x, y, false)}
                  >
                    <Cell
                      x={x}
                      y={y}
                      move={move}
                      onClick={() => handleCellClick(x, y)}
                      isHovered={isHovered}
                      currentPlayer={currentPlayer}
                      isGameActive={isGameActive}
                      winningPositions={winningPositions}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
