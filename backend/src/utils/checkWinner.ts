import { Move, PlayerSymbol, Position } from "../types/game";

export const checkWinner = (
  board: Map<string, Move>,
  lastMove: Position
): { player: PlayerSymbol; winningPositions: Position[] } | null => {
  const { x, y } = lastMove;
  const player = board.get(`${x},${y}`)?.player;
  if (!player) return null;

  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (const [dx, dy] of directions) {
    const positions: Position[] = [{ x, y }];

    // Forward
    for (let i = 1; i < 5; i++) {
      const pos = { x: x + dx * i, y: y + dy * i };
      const move = board.get(`${x + dx * i},${y + dy * i}`);
      if (move?.player === player && Date.now() - move.timestamp < 20000) {
        positions.push(pos);
      } else break;
    }

    // Backward
    for (let i = 1; i < 5; i++) {
      const pos = { x: x - dx * i, y: y - dy * i };
      const move = board.get(`${x - dx * i},${y - dy * i}`);
      if (move?.player === player && Date.now() - move.timestamp < 20000) {
        positions.unshift(pos);
      } else break;
    }

    if (positions.length >= 5) {
      return { player, winningPositions: positions };
    }
  }

  return null;
};
