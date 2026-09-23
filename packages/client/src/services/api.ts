

const API_BASE = 'http://localhost:3000/api';

export const fetchLeaderboard = async () => {
  const res = await fetch(`${API_BASE}/leaderboard`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
};

export const submitMatch = async (winner: string, totalTurns: number, durationSeconds: number) => {
  const res = await fetch(`${API_BASE}/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ winner, totalTurns, durationSeconds })
  });
  if (!res.ok) throw new Error('Failed to submit match');
  return res.json();
};

export const fetchTaunt = async (event: string, unitName: string, damage?: number, hpRemaining?: number) => {
  const res = await fetch(`${API_BASE}/npc/taunt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, unitName, damage, hpRemaining })
  });
  if (!res.ok) throw new Error('Failed to fetch taunt');
  const data = await res.json();
  return data.taunt as string;
};
