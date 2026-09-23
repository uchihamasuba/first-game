import { Router } from 'express';
import { addMatch, getLeaderboard } from './db.js';
import { generateTaunt } from './services/gemini.js';

const router = Router();

router.post('/matches', (req, res) => {
  const { winner, totalTurns, durationSeconds } = req.body;
  if (!winner || typeof totalTurns !== 'number' || typeof durationSeconds !== 'number') {
    return res.status(400).json({ error: 'Invalid match data' });
  }
  
  const match = addMatch({ winner, totalTurns, durationSeconds });
  res.status(201).json(match);
});

router.get('/leaderboard', (req, res) => {
  res.json(getLeaderboard());
});

router.post('/npc/taunt', async (req, res) => {
  const { event, unitName, damage, hpRemaining } = req.body;
  if (!event || !unitName) {
    return res.status(400).json({ error: 'Missing event or unitName' });
  }
  
  const taunt = await generateTaunt({ event, unitName, damage, hpRemaining });
  res.json({ taunt });
});

export default router;
