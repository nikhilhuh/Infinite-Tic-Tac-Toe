import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Move, Player, Position } from "@/types/game";
import { Cell } from "../Board/Cell";

interface InfiniteBoardProps {
  board: Map<string, Move>;
  onMove: (x: number, y: number) => void;
  currentPlayer: Player;
  isGameActive: boolean;
  winningPositions: Position[] | null;
}

export default function InfiniteBoard({
  board,
  onMove,
  currentPlayer,
  isGameActive,
  winningPositions,
}: InfiniteBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState(10);
  const [gridRows, setGridRows] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsive grid sizes
  useEffect(() => {
    const updateGridSize = () => {
      if (window.innerWidth >= 1200) {
        setGridCols(15);
        setGridRows(15);
      } else if (window.innerWidth >= 768) {
        setGridCols(15);
        setGridRows(12);
      } else {
        setGridCols(10);
        setGridRows(14);
      }
    };
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

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
      className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-2 md:p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex flex-wrap flex-row items-center justify-between gap-2">
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

      {/* Board */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden bg-game-bg/50 rounded-lg w-full h-[60vh] lg:h-[70vh]`}
      >
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          }}
        >
          {Array.from({ length: gridRows * gridCols }).map((_, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            const x = col - Math.floor(gridCols / 2);
            const y = row - Math.floor(gridRows / 2);
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
      </div>
    </motion.div>
  );
}
