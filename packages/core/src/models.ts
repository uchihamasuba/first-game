export type PlayerType = 'Player' | 'AI';

export interface Position {
  x: number;
  y: number;
}

export interface Unit {
  id: string;
  name: string;
  type: PlayerType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  moveRange: number; // default: 2
  attackRange: number; // default: 1
  position: Position;
  isAlive: boolean;
  hasMoved: boolean;
  hasAttacked: boolean;
}

export enum TileType {
  Walkable = 'Walkable',
  Blocked = 'Blocked',
  Buff = 'Buff' // +2 Attack
}

export interface Tile {
  x: number;
  y: number;
  type: TileType;
}

export type Board = Tile[][];

export enum TurnPhase {
  START_TURN = 'START_TURN',
  MOVE = 'MOVE',
  ATTACK = 'ATTACK',
  END_TURN = 'END_TURN'
}

export enum GameStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  VICTORY = 'VICTORY', // Player wins
  DEFEAT = 'DEFEAT' // AI wins
}

export interface GameState {
  board: Board;
  units: Record<string, Unit>;
  currentTurn: PlayerType;
  phase: TurnPhase;
  status: GameStatus;
  turnNumber: number;
}
