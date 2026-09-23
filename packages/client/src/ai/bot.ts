import { GameState, getDistance, moveUnit, attackTarget, nextTurn, TileType } from '@first-game/core';

export const executeAITurn = (state: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>, logAction: (msg: string) => void) => {
  // We need to execute actions sequentially with a small delay for visual effect
  let currentState = state;
  const aiUnits = Object.values(currentState.units).filter(u => u.type === 'AI' && u.isAlive);
  
  if (aiUnits.length === 0) {
    currentState = nextTurn(currentState);
    setGameState(currentState);
    return;
  }

  let delay = 0;
  const stepDelay = 600;

  aiUnits.forEach((aiUnit) => {
    // 1. Move Phase
    setTimeout(() => {
      // Re-fetch unit from current state as it might have been attacked/changed
      const unit = currentState.units[aiUnit.id];
      if (!unit || !unit.isAlive) return;

      const playerUnits = Object.values(currentState.units).filter(u => u.type === 'Player' && u.isAlive);
      if (playerUnits.length === 0) return;

      // Find nearest player
      let nearestPlayer = playerUnits[0];
      let minDistance = getDistance(unit.position, nearestPlayer.position);

      playerUnits.forEach(p => {
        const d = getDistance(unit.position, p.position);
        if (d < minDistance) {
          minDistance = d;
          nearestPlayer = p;
        }
      });

      // If already in attack range, don't move (unless to grab a buff, but keep it simple greedy)
      if (minDistance <= unit.attackRange) {
        return; 
      }

      // Try to find the best tile to move to (closest to nearestPlayer)
      let bestMove = unit.position;
      let bestDistanceToTarget = minDistance;
      
      // Explore all valid moves within moveRange
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const distToTile = getDistance(unit.position, { x, y });
          if (distToTile > 0 && distToTile <= unit.moveRange) {
            const tile = currentState.board[y][x];
            if (tile.type === TileType.Blocked) continue;

            const isOccupied = Object.values(currentState.units).some(u => u.isAlive && u.position.x === x && u.position.y === y);
            if (isOccupied) continue;

            const distToTarget = getDistance({ x, y }, nearestPlayer.position);
            
            // Prefer buff tiles if they don't take us further away
            let score = distToTarget;
            if (tile.type === TileType.Buff) score -= 1.5; // Artificial boost for buff tiles

            if (score < bestDistanceToTarget) {
              bestDistanceToTarget = score;
              bestMove = { x, y };
            }
          }
        }
      }

      if (bestMove !== unit.position) {
        currentState = moveUnit(currentState, unit.id, bestMove);
        setGameState(currentState);
        logAction(`${unit.name} moved to (${bestMove.x}, ${bestMove.y})`);
      }

    }, delay);
    
    delay += stepDelay;

    // 2. Attack Phase
    setTimeout(() => {
      const unit = currentState.units[aiUnit.id];
      if (!unit || !unit.isAlive) return;

      const playerUnits = Object.values(currentState.units).filter(u => u.type === 'Player' && u.isAlive);
      
      // Find a valid target within range
      for (const p of playerUnits) {
        if (getDistance(unit.position, p.position) <= unit.attackRange) {
          const oldHp = p.hp;
          currentState = attackTarget(currentState, unit.id, p.id);
          const newHp = currentState.units[p.id].hp;
          setGameState(currentState);
          logAction(`${unit.name} attacked ${p.name} for ${oldHp - newHp} damage!`);
          break; // Only attack once
        }
      }
    }, delay);

    delay += stepDelay;
  });

  // End Turn
  setTimeout(() => {
    currentState = nextTurn(currentState);
    setGameState(currentState);
    logAction(`AI Turn ended.`);
  }, delay + 200);
};
