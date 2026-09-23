import { describe, it, expect } from 'vitest';
import { evaluateWinCondition, GameStatus } from '../src';
import { createBaseState, createUnit } from './helpers';

describe('Game state logic', () => {
  it('should continue in progress if both sides have alive units', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1);
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1);

    const newState = evaluateWinCondition(baseState);
    expect(newState.status).toBe(GameStatus.IN_PROGRESS);
  });

  it('should result in victory if all AI units are dead', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { isAlive: true });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { isAlive: false });
    baseState.units['u3'] = createUnit('u3', 'AI', 3, 1, { isAlive: false });

    const newState = evaluateWinCondition(baseState);
    expect(newState.status).toBe(GameStatus.VICTORY);
  });

  it('should result in defeat if all Player units are dead', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { isAlive: false });
    baseState.units['u2'] = createUnit('u2', 'Player', 2, 1, { isAlive: false });
    baseState.units['u3'] = createUnit('u3', 'AI', 3, 1, { isAlive: true });

    const newState = evaluateWinCondition(baseState);
    expect(newState.status).toBe(GameStatus.DEFEAT);
  });

  it('should result in defeat if all units are dead (draw scenario defaults to defeat)', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { isAlive: false });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { isAlive: false });

    const newState = evaluateWinCondition(baseState);
    expect(newState.status).toBe(GameStatus.DEFEAT);
  });
});
