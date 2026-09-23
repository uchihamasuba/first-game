export interface MatchHistory {
  id: string;
  winner: string;
  totalTurns: number;
  durationSeconds: number;
  createdAt: string;
}

export const matchHistory: MatchHistory[] = [];

export const getLeaderboard = (): MatchHistory[] => {
  return [...matchHistory]
    .sort((a, b) => a.totalTurns - b.totalTurns)
    .slice(0, 10);
};

export const addMatch = (match: Omit<MatchHistory, 'id' | 'createdAt'>): MatchHistory => {
  const newMatch: MatchHistory = {
    ...match,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  matchHistory.push(newMatch);
  return newMatch;
};

export const clearDB = () => {
  matchHistory.length = 0;
};
