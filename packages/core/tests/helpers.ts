import { Board, GameState, GameStatus, PlayerType, TileType, TurnPhase, Unit } from '../src';

export const createEmptyBoard = (): Board => {
  const board: Board = [];
  for (let y = 0; y < 8; y++) {
    const row: any[] = [];
    for (let x = 0; x < 8; x++) {
      row.push({ x, y, type: TileType.Walkable });
    }
    board.push(row);
  }
  return board;
};

export const createBaseState = (): GameState => ({
  board: createEmptyBoard(),
  units: {},
  currentTurn: 'Player',
  phase: TurnPhase.START_TURN,
  status: GameStatus.IN_PROGRESS,
  turnNumber: 1
});

export const createUnit = (id: string, type: PlayerType, x: number, y: number, overrides: Partial<Unit> = {}): Unit => ({
  id,
  name: `${type} Unit ${id}`,
  type,
  hp: 10,
  maxHp: 10,
  attack: 3,
  defense: 1,
  moveRange: 2,
  attackRange: 1,
  position: { x, y },
  isAlive: true,
  hasMoved: false,
  hasAttacked: false,
  ...overrides
});
