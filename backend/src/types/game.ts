export interface Player {
  id: string;
  name: string;
  symbol: "X" | "O";
}
export interface Position {
  x: number;
  y: number;
} 

export interface Move {
  player: "X" | "O";
  timestamp: number;
  position: Position;
}

export interface Room {
  id: string;
  players: Player[];
  board: Map<string, Move>;
  currentPlayer: "X" | "O";
  scores: { X: number; O: number };
  isGameActive: boolean;
  winner: "X" | "O" | null;
  winningPositions: Position[] | null;
}
