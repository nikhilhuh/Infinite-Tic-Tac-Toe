import { motion, AnimatePresence } from "framer-motion";
import { OnlinePlayer, Player } from "@/types/game";
import {
  Repeat,
  Target,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

interface ScoreBoardProps {
  scores: { X: number; O: number };
  currentPlayer: Player;
  winner: Player | null;
  mode: "local" | "online";
  playerName: string;
  connectedPlayers: OnlinePlayer[];
}

export default function ScoreBoard({
  scores,
  currentPlayer,
  winner,
  mode,
  playerName,
  connectedPlayers,
}: ScoreBoardProps) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Current Turn */}
      <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          Current Turn
        </h3>

        <AnimatePresence>
          {winner ? (
            <motion.div
              className="text-center py-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <div className="text-xl sm:text-2xl mb-2">🎉</div>
              <div className="font-bold text-base sm:text-lg">
                <span
                  className={
                    winner === "X" ? "text-game-blue" : "text-game-red"
                  }
                >
                  {winner === "X" ? "× Player" : "○ Player"}
                </span>{" "}
                Wins!
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2">
                New round starting soon...
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center gap-3"
              key={currentPlayer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`
                w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg
                ${
                  currentPlayer === "X"
                    ? "bg-game-blue/20 text-game-blue"
                    : "bg-game-red/20 text-game-red"
                }
              `}
              >
                {currentPlayer === "X" ? "×" : "○"}
              </div>
              <div>
                <div className="font-semibold text-sm sm:text-base">
                  {currentPlayer === "X" ? "× Player" : "○ Player"}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {mode === "online"
                    ? (() => {
                        const me = connectedPlayers.find(
                          (p) => p.name === playerName
                        );
                        return me?.symbol === currentPlayer
                          ? "Your turn"
                          : "Opponent's turn";
                      })()
                    : "Your turn"}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scores */}
      <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
          Session Scores
        </h3>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-game-blue/20 text-game-blue flex items-center justify-center text-xs sm:text-sm font-bold">
                ×
              </div>
              <span className="font-medium text-sm sm:text-base">X Player</span>
            </div>
            <motion.div
              className="text-lg sm:text-xl font-bold text-game-blue"
              key={`x-${scores.X}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {scores.X}
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-game-red/20 text-game-red flex items-center justify-center text-xs sm:text-sm font-bold">
                ○
              </div>
              <span className="font-medium text-sm sm:text-base">O Player</span>
            </div>
            <motion.div
              className="text-lg sm:text-xl font-bold text-game-red"
              key={`o-${scores.O}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {scores.O}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
          Game Rules
        </h3>

        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="text-yellow-500">
              <Zap className="h-4 w-4" />
            </div>
            <div>Moves disappear after 20 seconds</div>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-green-500">
              <Target className="h-4 w-4" />
            </div>
            <div>Get 5 in a row to win</div>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-purple-500">
              <Repeat className="h-4 w-4" />
            </div>
            <div>Auto-reset after each round</div>
          </div>
        </div>
      </div>

      {/* Online Players (if online mode) */}
      {mode === "online" && (
        <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            Players
          </h3>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {connectedPlayers.length > 0 ? (
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
              )}
              <span className="text-muted-foreground">
                {connectedPlayers.length} connected
              </span>
            </div>

            {connectedPlayers.map((player) => (
              <div
                key={player.id}
                className={`
                  flex items-center justify-between gap-2 p-2 rounded
                  ${
                    player.name === playerName ? "bg-primary/10" : "bg-muted/50"
                  }
                `}
              >
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs sm:text-sm">
                    {player.name} {player.name === playerName && "(You)"}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold sm:text-sm ${
                    player.symbol === "X" ? "text-game-red" : "text-game-blue"
                  }`}
                >
                  {player.symbol}
                </span>
              </div>
            ))}

            {connectedPlayers.length < 2 && (
              <div className="text-xs text-muted-foreground">
                Waiting for another player to join...
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
