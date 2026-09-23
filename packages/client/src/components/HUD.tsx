import React from 'react';
import { GameState, GameStatus } from '@first-game/core';
import { Shield, Sword, Heart } from 'lucide-react';
import { clsx } from 'clsx';

interface HUDProps {
  state: GameState;
  onEndTurn: () => void;
  actionLog: string[];
}

export const HUD: React.FC<HUDProps> = ({ state, onEndTurn, actionLog }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 max-w-4xl mx-auto">
      {/* Status Panel */}
      <div className="flex-1 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Turn {state.turnNumber}</h2>
          <div className={clsx("px-4 py-1 rounded-full font-bold uppercase tracking-wider text-sm", {
            "bg-blue-900 text-blue-300": state.currentTurn === 'Player',
            "bg-red-900 text-red-300": state.currentTurn === 'AI'
          })}>
            {state.currentTurn} Turn
          </div>
        </div>

        {state.status !== GameStatus.IN_PROGRESS && (
          <div className={clsx("p-4 mb-6 rounded-lg text-center font-bold text-xl", {
            "bg-green-900/50 text-green-400 border border-green-600": state.status === GameStatus.VICTORY,
            "bg-red-900/50 text-red-400 border border-red-600": state.status === GameStatus.DEFEAT,
          })}>
            {state.status === GameStatus.VICTORY ? 'VICTORY ACHIEVED!' : 'DEFEAT...'}
          </div>
        )}

        <button 
          className="btn w-full flex justify-center items-center gap-2"
          onClick={onEndTurn}
          disabled={state.currentTurn !== 'Player' || state.status !== GameStatus.IN_PROGRESS}
        >
          End Turn
        </button>

        <div className="mt-8 space-y-4">
          <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Units Alive</h3>
          {Object.values(state.units).filter(u => u.isAlive).map(unit => (
            <div key={unit.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className={clsx("w-3 h-3 rounded-full", unit.type === 'Player' ? "bg-blue-500" : "bg-red-500")} />
                <span className="font-medium">{unit.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-green-500" /> {unit.hp}/{unit.maxHp}</span>
                <span className="flex items-center gap-1"><Sword className="w-4 h-4 text-orange-500" /> {unit.attack}</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" /> {unit.defense}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Log */}
      <div className="flex-1 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col max-h-[500px]">
        <h3 className="text-xl font-bold mb-4">Action Log</h3>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono text-sm">
          {actionLog.map((log, idx) => (
            <div key={idx} className="p-2 bg-slate-900/50 rounded border-l-2 border-slate-600 text-slate-300">
              {log}
            </div>
          ))}
          {actionLog.length === 0 && (
            <div className="text-slate-500 italic text-center mt-10">Game started. Waiting for actions...</div>
          )}
        </div>
      </div>
    </div>
  );
};
