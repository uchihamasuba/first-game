import { describe, it, expect } from 'vitest';
import { attackTarget, TurnPhase, TileType, GameStatus } from '../src';
import { createBaseState, createUnit } from './helpers';

describe('Combat logic', () => {
  it('should damage a target unit successfully within range', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { attack: 4, attackRange: 1 });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hp: 10, defense: 2 });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    expect(newState.units['u2'].hp).toBe(8); // max(1, 4 - 2) = 2 damage
    expect(newState.units['u1'].hasAttacked).toBe(true);
    expect(newState.phase).toBe(TurnPhase.ATTACK);
  });

  it('should apply at least 1 damage even if defense is higher than attack', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { attack: 2 });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hp: 10, defense: 5 });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    expect(newState.units['u2'].hp).toBe(9); // max(1, 2 - 5) = 1 damage
  });

  it('should not attack if out of range', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { attackRange: 1 });
    baseState.units['u2'] = createUnit('u2', 'AI', 3, 1, { hp: 10 });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    expect(newState.units['u2'].hp).toBe(10);
    expect(newState.units['u1'].hasAttacked).toBe(false);
  });

  it('should not attack a friendly unit', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1);
    baseState.units['u2'] = createUnit('u2', 'Player', 2, 1, { hp: 10 });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    expect(newState.units['u2'].hp).toBe(10);
    expect(newState.units['u1'].hasAttacked).toBe(false);
  });

  it('should not attack a dead unit', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1);
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hp: 0, isAlive: false });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    expect(newState.units['u1'].hasAttacked).toBe(false);
  });

  it('should handle target death properly', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { attack: 12 });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hp: 5, defense: 2 });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    expect(newState.units['u2'].hp).toBe(0); // 12 - 2 = 10 damage
    expect(newState.units['u2'].isAlive).toBe(false);
    expect(newState.status).toBe(GameStatus.VICTORY); // Since only AI unit died
  });

  it('should apply +2 attack bonus when standing on Buff tile', () => {
    const baseState = createBaseState();
    baseState.board[1][1].type = TileType.Buff;
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { attack: 4 });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hp: 10, defense: 2 });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    // (4 + 2) - 2 = 4 damage
    expect(newState.units['u2'].hp).toBe(6);
  });

  it('should not attack if it has already attacked', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { hasAttacked: true });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hp: 10 });

    const newState = attackTarget(baseState, 'u1', 'u2');
    
    expect(newState.units['u2'].hp).toBe(10);
  });
});
