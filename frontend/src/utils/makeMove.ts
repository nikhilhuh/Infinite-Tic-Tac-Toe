import { GameState, Move } from "@/types/game";
import { checkWinner } from "./checkWinner";

// Store all active timeouts globally (per position)
const moveTimeouts = new Map<string, NodeJS.Timeout>();

export const makeMoveFunction = (
  mode: "online" | "local",
  currentRoomId: string | null,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  x: number,
  y: number,
  makeOnlineMove: (roomId: string, x: number, y: number) => void
) => {
  if (!gameState.isGameActive) return;
  const position = `${x},${y}`;
  if (gameState.board.has(position)) return;

  if (mode === "online") {
    if (currentRoomId) makeOnlineMove(currentRoomId, x, y);
    return;
  }

  const move: Move = {
    player: gameState.currentPlayer,
    timestamp: Date.now(),
    position: { x, y },
  };

  const newBoard = new Map(gameState.board);
  newBoard.set(position, move);

  const result = checkWinner(newBoard, { x, y });

  if (result) {
    const { player, winningPositions } = result;

    // ❌ Cancel ALL move deletion timeouts if winner is found
    for (const [pos, timeoutId] of moveTimeouts.entries()) {
      clearTimeout(timeoutId);
      moveTimeouts.delete(pos);
    }

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      scores: { ...prev.scores, [player]: prev.scores[player] + 1 },
      winner: player,
      winningPositions,
      isGameActive: false,
    }));

    // 🕒 Set timeout to reset the game
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        board: new Map(),
        winner: null,
        isGameActive: true,
        currentPlayer: "X",
        winningPositions: null,
      }));
    }, 5000);
  } else {
    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === "X" ? "O" : "X",
    }));

    // 🕒 Set timeout to remove this move
    const timeoutId = setTimeout(() => {
      setGameState((prev) => {
        const updatedBoard = new Map(prev.board);
        updatedBoard.delete(position);
        return { ...prev, board: updatedBoard };
      });

      moveTimeouts.delete(position); // Clean up after firing
    }, 20000);

    moveTimeouts.set(position, timeoutId); // Save timeout for potential clearing
  }
};
