import React from 'react';
import { GameState, TileType, getDistance } from '@first-game/core';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sword } from 'lucide-react';

interface BoardViewProps {
  state: GameState;
  selectedUnitId: string | null;
  onTileClick: (x: number, y: number) => void;
  onUnitClick: (unitId: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ state, selectedUnitId, onTileClick, onUnitClick }) => {
  const selectedUnit = selectedUnitId ? state.units[selectedUnitId] : null;

  return (
    <div className="flex justify-center my-8">
      <div className="grid grid-cols-8 gap-1 bg-slate-800 p-2 rounded-lg shadow-xl">
        {state.board.map((row, y) =>
          row.map((tile, x) => {
            // Find if there's a unit on this tile
            const unitOnTile = Object.values(state.units).find(u => u.isAlive && u.position.x === x && u.position.y === y);

            // Determine tile base color based on type
            let baseColor = 'bg-slate-700';
            if (tile.type === TileType.Blocked) baseColor = 'bg-slate-900 border border-slate-600';
            if (tile.type === TileType.Buff) baseColor = 'bg-yellow-900/50 border border-yellow-600';

            // Check valid moves / attacks
            let isValidMove = false;
            let isValidAttack = false;

            if (selectedUnit && selectedUnit.isAlive && selectedUnit.type === state.currentTurn) {
              const distance = getDistance(selectedUnit.position, { x, y });
              
              if (!selectedUnit.hasMoved && distance > 0 && distance <= selectedUnit.moveRange && tile.type !== TileType.Blocked && (!unitOnTile || !unitOnTile.isAlive)) {
                isValidMove = true;
              }

              if (!selectedUnit.hasAttacked && unitOnTile && unitOnTile.type !== selectedUnit.type && distance <= selectedUnit.attackRange) {
                isValidAttack = true;
              }
            }

            return (
              <div
                key={`${x}-${y}`}
                className={twMerge(
                  clsx(
                    'w-16 h-16 relative flex items-center justify-center cursor-pointer transition-colors',
                    baseColor,
                    {
                      'hover:bg-slate-600': !isValidMove && !isValidAttack && tile.type !== TileType.Blocked,
                      'ring-2 ring-inset ring-green-500 bg-green-900/40 hover:bg-green-800/60': isValidMove,
                      'ring-2 ring-inset ring-red-500 bg-red-900/40 hover:bg-red-800/60': isValidAttack,
                    }
                  )
                )}
                onClick={() => {
                  if (unitOnTile && unitOnTile.type === state.currentTurn) {
                    onUnitClick(unitOnTile.id);
                  } else {
                    onTileClick(x, y);
                  }
                }}
              >
                {/* Tile Coordinates (for debugging, small) */}
                <span className="absolute top-0.5 left-1 text-[8px] text-slate-500">{x},{y}</span>
                
                {/* Buff Icon */}
                {tile.type === TileType.Buff && !unitOnTile && (
                  <Sword className="absolute text-yellow-500/30 w-8 h-8" />
                )}

                {/* Render Unit */}
                {unitOnTile && (
                  <div
                    className={clsx(
                      'relative z-10 flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 shadow-sm transition-transform',
                      {
                        'bg-blue-600 border-blue-400': unitOnTile.type === 'Player',
                        'bg-red-600 border-red-400': unitOnTile.type === 'AI',
                        'ring-4 ring-white animate-pulse': selectedUnitId === unitOnTile.id,
                        'opacity-50': (unitOnTile.hasMoved && unitOnTile.hasAttacked) || unitOnTile.type !== state.currentTurn
                      }
                    )}
                  >
                    <span className="text-xs font-bold truncate max-w-full px-1">{unitOnTile.name.substring(0, 3)}</span>
                    
                    {/* Health Bar */}
                    <div className="absolute -bottom-2 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-700">
                      <div 
                        className={clsx("h-full", {
                          "bg-green-500": unitOnTile.hp / unitOnTile.maxHp > 0.5,
                          "bg-yellow-500": unitOnTile.hp / unitOnTile.maxHp <= 0.5 && unitOnTile.hp / unitOnTile.maxHp > 0.2,
                          "bg-red-500": unitOnTile.hp / unitOnTile.maxHp <= 0.2
                        })}
                        style={{ width: `${(unitOnTile.hp / unitOnTile.maxHp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
