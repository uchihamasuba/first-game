import { Board, GameState, GameStatus, TileType, TurnPhase, Unit } from '@first-game/core';

export const createInitialState = (): GameState => {
  const board: Board = [];
  for (let y = 0; y < 8; y++) {
    const row: any[] = [];
    for (let x = 0; x < 8; x++) {
      let type = TileType.Walkable;
      
      // Add some obstacles
      if ((x === 3 && y === 3) || (x === 4 && y === 3) || (x === 3 && y === 4)) {
        type = TileType.Blocked;
      }
      
      // Add buff tiles
      if ((x === 1 && y === 6) || (x === 6 && y === 1)) {
        type = TileType.Buff;
      }

      row.push({ x, y, type });
    }
    board.push(row);
  }

  const units: Record<string, Unit> = {
    'p1': {
      id: 'p1',
      name: 'Knight',
      type: 'Player',
      hp: 12,
      maxHp: 12,
      attack: 4,
      defense: 2,
      moveRange: 3,
      attackRange: 1,
      position: { x: 1, y: 7 },
      isAlive: true,
      hasMoved: false,
      hasAttacked: false
    },
    'p2': {
      id: 'p2',
      name: 'Archer',
      type: 'Player',
      hp: 8,
      maxHp: 8,
      attack: 3,
      defense: 1,
      moveRange: 2,
      attackRange: 3,
      position: { x: 2, y: 7 },
      isAlive: true,
      hasMoved: false,
      hasAttacked: false
    },
    'ai1': {
      id: 'ai1',
      name: 'Goblin',
      type: 'AI',
      hp: 10,
      maxHp: 10,
      attack: 3,
      defense: 1,
      moveRange: 2,
      attackRange: 1,
      position: { x: 5, y: 0 },
      isAlive: true,
      hasMoved: false,
      hasAttacked: false
    },
    'ai2': {
      id: 'ai2',
      name: 'Orc',
      type: 'AI',
      hp: 15,
      maxHp: 15,
      attack: 5,
      defense: 2,
      moveRange: 2,
      attackRange: 1,
      position: { x: 6, y: 0 },
      isAlive: true,
      hasMoved: false,
      hasAttacked: false
    }
  };

  return {
    board,
    units,
    currentTurn: 'Player',
    phase: TurnPhase.START_TURN,
    status: GameStatus.IN_PROGRESS,
    turnNumber: 1
  };
};
