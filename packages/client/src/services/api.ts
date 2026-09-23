const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const fetchLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/api/leaderboard`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
};

export const submitMatch = async (winner: string, totalTurns: number, durationSeconds: number) => {
  const res = await fetch(`${BASE_URL}/api/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ winner, totalTurns, durationSeconds })
  });
  if (!res.ok) throw new Error('Failed to submit match');
  return res.json();
};

export const fetchTaunt = async (event: string, unitName: string, damage?: number, hpRemaining?: number) => {
  const res = await fetch(`${BASE_URL}/api/npc/taunt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, unitName, damage, hpRemaining })
  });
  if (!res.ok) throw new Error('Failed to fetch taunt');
  const data = await res.json();
  return data.taunt as string;
};
