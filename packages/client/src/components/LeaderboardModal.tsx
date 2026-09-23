import { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/api';

export const LeaderboardModal = ({ onClose }: { onClose: () => void }) => {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setScores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 w-full max-w-md">
        <h2 className="text-3xl font-black text-center mb-6 text-yellow-400">Hall of Fame</h2>
        
        {loading ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : (
          <div className="space-y-3">
            {scores.length === 0 ? (
              <p className="text-center text-slate-400">No matches recorded yet.</p>
            ) : (
              scores.map((score, idx) => (
                <div key={score.id} className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <div>
                    <span className="font-bold text-slate-300 mr-2">#{idx + 1}</span>
                    <span className={score.winner === 'Player' ? 'text-blue-400' : 'text-red-400'}>
                      {score.winner} Victory
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm font-mono">
                    {score.totalTurns} turns / {score.durationSeconds}s
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        <button 
          onClick={onClose}
          className="mt-8 w-full py-3 bg-slate-700 hover:bg-slate-600 rounded font-bold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
