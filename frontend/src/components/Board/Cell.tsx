import { Move, OnlinePlayer, Player, Position } from "@/types/game";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CellProps {
  x: number;
  y: number;
  move?: Move;
  onClick: () => void;
  isHovered: boolean;
  currentPlayer: Player;
  isGameActive: boolean;
  winningPositions: Position[] | null;
  mode: "online" | "local";
  connectedPlayers: OnlinePlayer[];
  playerName: string;
}

export const Cell: React.FC<CellProps> = ({
  x,
  y,
  move,
  onClick,
  isHovered,
  currentPlayer,
  isGameActive,
  winningPositions,
  mode,
  connectedPlayers,
  playerName,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(20);

  const me = connectedPlayers.find((p) => p.name === playerName);

  const isWinningCell = winningPositions?.some(
    (pos) => pos.x === x && pos.y === y
  );

  useEffect(() => {
    if (!move || winningPositions) {
      setTimeLeft(20);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - move.timestamp;
      const remaining = Math.max(0, 20 - elapsed / 1000);
      setTimeLeft(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [move, winningPositions]);

  const opacity = move
    ? winningPositions
      ? 1
      : Math.max(0.3, timeLeft / 20)
    : 1;

  return (
    <motion.div
      className={`h-full w-full border border-border flex items-center justify-center cursor-pointer
    relative transition-colors duration-200
    ${isWinningCell ? "bg-green-200" : ""}
    ${
      isHovered && !move && isGameActive && !winningPositions
        ? "bg-primary/10"
        : "bg-background/50"
    }
    ${!isGameActive && !winningPositions ? "cursor-not-allowed opacity-50" : ""}
  `}
      onClick={onClick}
      whileHover={
        !move && isGameActive && !winningPositions ? { scale: 1.05 } : {}
      }
      whileTap={
        !move && isGameActive && !winningPositions ? { scale: 0.95 } : {}
      }
    >
      <AnimatePresence>
        {move && (
          <motion.div
            className={`
              text-lg sm:text-xl md:text-2xl font-bold select-none
              ${move.player === "X" ? "text-game-blue" : "text-game-red"}
            `}
            style={{ opacity }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {move.player === "X" ? "X" : "O"}
          </motion.div>
        )}

        {/* Preview for hover */}
        {!move && isHovered && isGameActive && !winningPositions && (
          <motion.div
            className={`
              text-lg sm:text-xl md:text-2xl font-bold select-none opacity-30
              ${mode === "online" ? me?.symbol === "X" ? "text-game-blue" : "text-game-red" : currentPlayer === "X" ? "text-game-blue" : "text-game-red"}
            `}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {mode === "online" ? me?.symbol : (
              <>{currentPlayer === "X" ? "X" : "O"}</>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer indicator */}
      {move && isGameActive && !winningPositions && timeLeft > 0 && (
        <div
          className="absolute bottom-0 left-0 bg-yellow-400 h-1 transition-all duration-100"
          style={{ width: `${(timeLeft / 20) * 100}%` }}
        />
      )}
    </motion.div>
  );
};
