import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import { clearDB } from '../src/db';

describe('API Endpoints', () => {
  beforeEach(() => {
    clearDB();
  });

  describe('POST /api/matches', () => {
    it('should add a match and return 201', async () => {
      const payload = { winner: 'Player', totalTurns: 10, durationSeconds: 45 };
      const res = await request(app).post('/api/matches').send(payload);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.winner).toBe('Player');
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app).post('/api/matches').send({ winner: 'Player' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/leaderboard', () => {
    it('should return an empty array initially', async () => {
      const res = await request(app).get('/api/leaderboard');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return matches sorted by totalTurns', async () => {
      await request(app).post('/api/matches').send({ winner: 'AI', totalTurns: 15, durationSeconds: 60 });
      await request(app).post('/api/matches').send({ winner: 'Player', totalTurns: 8, durationSeconds: 30 });
      
      const res = await request(app).get('/api/leaderboard');
      expect(res.body).toHaveLength(2);
      expect(res.body[0].totalTurns).toBe(8); // lowest turns first
    });
  });

  describe('POST /api/npc/taunt', () => {
    it('should return 400 if missing event or unitName', async () => {
      const res = await request(app).post('/api/npc/taunt').send({ event: 'PLAYER_ATTACK' });
      expect(res.status).toBe(400);
    });

    it('should return a taunt string', async () => {
      const res = await request(app).post('/api/npc/taunt').send({
        event: 'PLAYER_ATTACK',
        unitName: 'Knight',
        damage: 5,
        hpRemaining: 5
      });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('taunt');
      expect(typeof res.body.taunt).toBe('string');
    });
  });
});
