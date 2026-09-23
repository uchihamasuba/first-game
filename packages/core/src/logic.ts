import { GameState, Position, TileType, Unit, TurnPhase, GameStatus, PlayerType } from './models';

/**
 * Helper to calculate Manhattan distance
 */
export const getDistance = (p1: Position, p2: Position): number => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

/**
 * Checks if a position is within the 8x8 board bounds
 */
export const isWithinBounds = (pos: Position): boolean => {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
};

/**
 * Evaluates the win/loss condition of the game.
 * Victory: All AI units are dead.
 * Defeat: All Player units are dead.
 */
export const evaluateWinCondition = (state: GameState): GameState => {
  const units = Object.values(state.units);
  const playerUnits = units.filter(u => u.type === 'Player');
  const aiUnits = units.filter(u => u.type === 'AI');

  const playerAlive = playerUnits.some(u => u.isAlive);
  const aiAlive = aiUnits.some(u => u.isAlive);

  let newStatus = state.status;
  if (!playerAlive && aiAlive) {
    newStatus = GameStatus.DEFEAT;
  } else if (playerAlive && !aiAlive) {
    newStatus = GameStatus.VICTORY;
  } else if (!playerAlive && !aiAlive) {
    newStatus = GameStatus.DEFEAT; // Draw implies defeat for simplicity
  }

  return {
    ...state,
    status: newStatus
  };
};

/**
 * Advances the game to the next turn, swapping the active player and resetting action points.
 */
export const nextTurn = (state: GameState): GameState => {
  const nextPlayer = state.currentTurn === 'Player' ? 'AI' : 'Player';
  
  // Reset hasMoved and hasAttacked for all units of the next player
  const newUnits: Record<string, Unit> = {};
  for (const [id, unit] of Object.entries(state.units)) {
    if (unit.type === nextPlayer) {
      newUnits[id] = { ...unit, hasMoved: false, hasAttacked: false };
    } else {
      newUnits[id] = { ...unit };
    }
  }

  return {
    ...state,
    units: newUnits,
    currentTurn: nextPlayer,
    phase: TurnPhase.START_TURN,
    turnNumber: state.currentTurn === 'AI' ? state.turnNumber + 1 : state.turnNumber
  };
};

/**
 * Moves a unit to a target position if valid.
 */
export const moveUnit = (state: GameState, unitId: string, targetPos: Position): GameState => {
  if (state.status !== GameStatus.IN_PROGRESS) return state;

  const unit = state.units[unitId];
  if (!unit || !unit.isAlive || unit.type !== state.currentTurn || unit.hasMoved) {
    return state;
  }

  if (!isWithinBounds(targetPos)) {
    return state;
  }

  const distance = getDistance(unit.position, targetPos);
  if (distance > unit.moveRange) {
    return state;
  }

  const targetTile = state.board[targetPos.y][targetPos.x];
  if (targetTile.type === TileType.Blocked) {
    return state; // Cannot move into obstacles
  }

  // Check if target position is occupied by any ALIVE unit
  const isOccupied = Object.values(state.units).some(u => u.isAlive && u.position.x === targetPos.x && u.position.y === targetPos.y);
  if (isOccupied) {
    return state;
  }

  return {
    ...state,
    units: {
      ...state.units,
      [unitId]: {
        ...unit,
        position: targetPos,
        hasMoved: true
      }
    },
    phase: TurnPhase.MOVE
  };
};

/**
 * Performs an attack from one unit to another if valid.
 */
export const attackTarget = (state: GameState, attackerId: string, targetId: string): GameState => {
  if (state.status !== GameStatus.IN_PROGRESS) return state;

  const attacker = state.units[attackerId];
  const target = state.units[targetId];

  if (!attacker || !attacker.isAlive || attacker.type !== state.currentTurn || attacker.hasAttacked) {
    return state;
  }

  if (!target || !target.isAlive || attacker.type === target.type) {
    return state; // Cannot attack invalid, dead, or friendly units
  }

  const distance = getDistance(attacker.position, target.position);
  if (distance > attacker.attackRange) {
    return state;
  }

  const attackerTile = state.board[attacker.position.y][attacker.position.x];
  const buffBonus = attackerTile.type === TileType.Buff ? 2 : 0;
  
  const damage = Math.max(1, (attacker.attack + buffBonus) - target.defense);
  const newHp = Math.max(0, target.hp - damage);
  const isAlive = newHp > 0;

  const newState = {
    ...state,
    units: {
      ...state.units,
      [attackerId]: {
        ...attacker,
        hasAttacked: true
      },
      [targetId]: {
        ...target,
        hp: newHp,
        isAlive
      }
    },
    phase: TurnPhase.ATTACK
  };

  return evaluateWinCondition(newState);
};
