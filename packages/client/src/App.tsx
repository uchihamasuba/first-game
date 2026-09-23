import { useState, useEffect } from 'react';
import { GameStatus, moveUnit, attackTarget, nextTurn, getDistance, TileType } from '@first-game/core';
import { BoardView } from './components/BoardView';
import { HUD } from './components/HUD';
import { createInitialState } from './utils/initialState';
import { executeAITurn } from './ai/bot';
import { LeaderboardModal } from './components/LeaderboardModal';
import { fetchTaunt, submitMatch } from './services/api';

function App() {
  const [gameState, setGameState] = useState(createInitialState());
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [taunt, setTaunt] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const logAction = (msg: string) => {
    setActionLog(prev => [...prev, `[Turn ${gameState.turnNumber}] ${msg}`]);
  };

  // AI Turn trigger
  useEffect(() => {
    if (gameState.currentTurn === 'AI' && gameState.status === GameStatus.IN_PROGRESS) {
      setSelectedUnitId(null);
      // Execute AI turn
      executeAITurn(gameState, setGameState, logAction);
    }
  }, [gameState.currentTurn, gameState.status]);

  useEffect(() => {
    if (gameState.status === GameStatus.VICTORY || gameState.status === GameStatus.DEFEAT) {
      const winner = gameState.status === GameStatus.VICTORY ? 'Player' : 'AI';
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      submitMatch(winner, gameState.turnNumber, duration).catch(console.error);
      
      fetchTaunt(gameState.status, winner)
        .then(setTaunt)
        .catch(console.error);
        
      setTimeout(() => setShowLeaderboard(true), 2500);
    }
  }, [gameState.status, startTime, gameState.turnNumber]);

  const handleTileClick = (x: number, y: number) => {
    if (gameState.currentTurn !== 'Player' || gameState.status !== GameStatus.IN_PROGRESS) return;
    if (!selectedUnitId) return;

    const unit = gameState.units[selectedUnitId];
    if (!unit || unit.type !== 'Player' || !unit.isAlive) return;

    // Check if there is an enemy unit on the target tile
    const enemyUnit = Object.values(gameState.units).find(u => u.isAlive && u.position.x === x && u.position.y === y && u.type === 'AI');

    if (enemyUnit) {
      // Attempt attack
      if (!unit.hasAttacked && getDistance(unit.position, { x, y }) <= unit.attackRange) {
        const oldHp = enemyUnit.hp;
        const newState = attackTarget(gameState, selectedUnitId, enemyUnit.id);
        const newHp = newState.units[enemyUnit.id].hp;
        setGameState(newState);
        logAction(`${unit.name} attacked ${enemyUnit.name} for ${oldHp - newHp} damage!`);
        
        fetchTaunt('PLAYER_ATTACK', unit.name, oldHp - newHp, newHp)
          .then(setTaunt)
          .catch(console.error);

        setSelectedUnitId(null); // Deselect after action
      }
    } else {
      // Attempt move
      if (!unit.hasMoved && getDistance(unit.position, { x, y }) <= unit.moveRange) {
        const tile = gameState.board[y][x];
        if (tile.type !== TileType.Blocked) {
          const newState = moveUnit(gameState, selectedUnitId, { x, y });
          if (newState !== gameState) { // Valid move happened
            setGameState(newState);
            logAction(`${unit.name} moved to (${x}, ${y})`);
            setSelectedUnitId(null); // Deselect after action
          }
        }
      }
    }
  };

  const handleUnitClick = (unitId: string) => {
    if (gameState.currentTurn !== 'Player' || gameState.status !== GameStatus.IN_PROGRESS) return;
    
    // Select friendly unit
    const unit = gameState.units[unitId];
    if (unit && unit.type === 'Player' && unit.isAlive && (!unit.hasMoved || !unit.hasAttacked)) {
      setSelectedUnitId(unitId);
    }
  };

  const handleEndTurn = () => {
    if (gameState.currentTurn === 'Player') {
      logAction(`Player Turn ended.`);
      setGameState(nextTurn(gameState));
      setSelectedUnitId(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-black text-center mb-2 tracking-tight">ViteBattle</h1>
      <p className="text-center text-slate-400 mb-4 font-medium">Turn-Based Grid Tactics</p>
      
      {taunt && (
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 border border-yellow-600/50 text-yellow-300 px-6 py-3 rounded-2xl shadow-lg relative max-w-lg text-center font-serif italic">
            "{taunt}"
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-800 border-b border-r border-yellow-600/50 rotate-45"></div>
          </div>
        </div>
      )}
      
      <BoardView 
        state={gameState} 
        selectedUnitId={selectedUnitId} 
        onTileClick={handleTileClick}
        onUnitClick={handleUnitClick}
      />
      
      <HUD 
        state={gameState}
        onEndTurn={handleEndTurn}
        actionLog={actionLog}
      />
      
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}

export default App;
