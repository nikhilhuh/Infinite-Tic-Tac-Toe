import { Move } from "@/types/game";

export function getAIMove(
  board: Map<string, Move>,
  difficulty: "easy" | "medium" | "hard",
  lastPlayerMove: { x: number; y: number }
): [number, number] | null {
  const min = -7;
  const max = 7;

  const getKey = (x: number, y: number) => `${x},${y}`;
  const isValid = (x: number, y: number) => x >= min && x <= max && y >= min && y <= max;

  const directions = [
    [1, 0], // horizontal
    [0, 1], // vertical
    [1, 1], // diagonal \
    [1, -1], // diagonal /
  ];

  const emptyCells: [number, number][] = [];
  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      if (!board.has(getKey(i, j))) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length === 0) return null;

  // ✅ helper: check if move leads to win/blocks 5 in a row
  function findCriticalMove(player: "X" | "O", length = 4): [number, number] | null {
    for (const [key, move] of board.entries()) {
      if (move.player !== player) continue;

      const [x, y] = key.split(",").map(Number);

      for (const [dx, dy] of directions) {
        let count = 1;

        // forward
        let i = 1;
        while (board.get(getKey(x + dx * i, y + dy * i))?.player === player) {
          count++;
          i++;
        }
        const forwardEmpty = [x + dx * i, y + dy * i] as [number, number];

        // backward
        i = 1;
        while (board.get(getKey(x - dx * i, y - dy * i))?.player === player) {
          count++;
          i++;
        }
        const backwardEmpty = [x - dx * i, y - dy * i] as [number, number];

        // If there are "length" in a row, play at open end
        if (count >= length) {
          if (isValid(...forwardEmpty) && !board.has(getKey(...forwardEmpty))) return forwardEmpty;
          if (isValid(...backwardEmpty) && !board.has(getKey(...backwardEmpty))) return backwardEmpty;
        }
      }
    }
    return null;
  }

  // ✅ EASY AI logic (place near last move)
  function getNearLastMove(): [number, number] | null {
    if (!lastPlayerMove) return null;
    const { x: px, y: py } = lastPlayerMove;
    const adjMoves: [number, number][] = [];

    const adjDirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [dx, dy] of adjDirs) {
      const nx = px + dx;
      const ny = py + dy;
      if (isValid(nx, ny) && !board.has(getKey(nx, ny))) {
        adjMoves.push([nx, ny]);
      }
    }

    if (adjMoves.length > 0) {
      return adjMoves[Math.floor(Math.random() * adjMoves.length)];
    }
    return null;
  }

  // ✅ Prefer extending AI’s own sequences
  function getBestOffensiveMove(): [number, number] | null {
    let bestMove: [number, number] | null = null;
    let bestScore = -1;

    for (const [nx, ny] of emptyCells) {
      let score = 0;

      for (const [dx, dy] of directions) {
        let forward = 0;
        let i = 1;
        while (board.get(getKey(nx + dx * i, ny + dy * i))?.player === "O") {
          forward++;
          i++;
        }

        let backward = 0;
        i = 1;
        while (board.get(getKey(nx - dx * i, ny - dy * i))?.player === "O") {
          backward++;
          i++;
        }

        score = Math.max(score, forward + backward);
      }

      if (score > bestScore) {
        bestScore = score;
        bestMove = [nx, ny];
      }
    }

    return bestMove;
  }

  // 🎯 AI decision-making
  if (difficulty === "easy") {
    return getNearLastMove() ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  if (difficulty === "medium") {
    // 1. Try to win
    const winMove = findCriticalMove("O");
    if (winMove) return winMove;

    // 2. Block user
    const blockMove = findCriticalMove("X");
    if (blockMove) return blockMove;

    // 3. Otherwise play like easy AI
    return getNearLastMove() ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  if (difficulty === "hard") {
    // 1. Win if possible
    const winMove = findCriticalMove("O");
    if (winMove) return winMove;

    // 2. Block user’s immediate win
    const blockMove = findCriticalMove("X");
    if (blockMove) return blockMove;

    // 3. Block user’s 3-in-a-row with open ends (prevent setup)
    const preBlock = findCriticalMove("X", 3);
    if (preBlock) return preBlock;

    // 4. Play offensively: extend AI’s own sequences
    const offensiveMove = getBestOffensiveMove();
    if (offensiveMove) return offensiveMove;

    // 5. Fallback: play near user (like easy AI)
    return getNearLastMove() ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  // fallback
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}
