import { GameState, Move } from "@/types/game";
import { checkWinner } from "./checkWinner";
import { getAIMove } from "./aiMove";

// Store all active timeouts globally (per position)
const moveTimeouts = new Map<string, NodeJS.Timeout>();

export const makeMoveFunction = (
  mode: "online" | "local" | "ai",
  currentRoomId: string | null,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  x: number,
  y: number,
  makeOnlineMove: (roomId: string, x: number, y: number) => void,
  difficulty: "easy" | "medium" | "hard"
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
    for (const [, timeoutId] of moveTimeouts.entries()) {
      clearTimeout(timeoutId);
    }
    moveTimeouts.clear();

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      scores: { ...prev.scores, [player]: prev.scores[player] + 1 },
      winner: player,
      winningPositions,
      isGameActive: false,
    }));

    // 🕒 Reset game after 5s
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
    return; // stop here if game ended
  }

  // ✅ Apply human (or AI) move
  setGameState((prev) => ({
    ...prev,
    board: newBoard,
    currentPlayer: prev.currentPlayer === "X" ? "O" : "X",
  }));

  // 🕒 Schedule removal of this move
  const timeoutId = setTimeout(() => {
    setGameState((prev) => {
      const updatedBoard = new Map(prev.board);
      updatedBoard.delete(position);
      return { ...prev, board: updatedBoard };
    });
    moveTimeouts.delete(position);
  }, 20000);
  moveTimeouts.set(position, timeoutId);

  // ✅ If playing against AI, trigger it AFTER the human finishes their move
  if (mode === "ai" && difficulty && move.player === "X") {
    setGameState((prev) => {
      if (!prev.isGameActive || prev.currentPlayer !== "O") return prev;

      const aiMove = getAIMove(prev.board, difficulty, move.position);
      if (!aiMove) return prev;

      const [aiX, aiY] = aiMove;

      makeMoveFunction(
        "ai",
        null,
        prev,
        setGameState,
        aiX,
        aiY,
        makeOnlineMove,
        difficulty
      );

      return prev;
    });
  }
};
