export type Player = "X" | "O";

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  player: Player;
  timestamp: number;
  position: Position;
}

export interface GameState {
  board: Map<string, Move>;
  currentPlayer: Player;
  scores: { X: number; O: number };
  isGameActive: boolean;
  winner: Player | null;
  winningPositions: Position[] | null;
}

export interface OnlinePlayer {
  id: string;
  name: string;
  symbol: "X" | "O";
}
export interface Room {
  id: string;
  players: OnlinePlayer[];
  board: Map<string, Move>;
  currentPlayer: "X" | "O";
  scores: { X: number; O: number };
  isGameActive: boolean;
  winner: "X" | "O" | null;
  winningPositions: Position[] | null;
}

