import { describe, it, expect } from 'vitest';
import { nextTurn, TurnPhase } from '../src';
import { createBaseState, createUnit } from './helpers';

describe('Turn logic', () => {
  it('should switch turn from Player to AI and reset AI actions', () => {
    const baseState = createBaseState();
    baseState.currentTurn = 'Player';
    baseState.turnNumber = 1;
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { hasMoved: true, hasAttacked: true });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hasMoved: true, hasAttacked: true });

    const newState = nextTurn(baseState);

    expect(newState.currentTurn).toBe('AI');
    expect(newState.turnNumber).toBe(1); // turn number increments when AI finishes
    expect(newState.phase).toBe(TurnPhase.START_TURN);
    
    // AI unit actions should be reset
    expect(newState.units['u2'].hasMoved).toBe(false);
    expect(newState.units['u2'].hasAttacked).toBe(false);

    // Player unit actions should remain unchanged (true)
    expect(newState.units['u1'].hasMoved).toBe(true);
    expect(newState.units['u1'].hasAttacked).toBe(true);
  });

  it('should switch turn from AI to Player, increment turn number, and reset Player actions', () => {
    const baseState = createBaseState();
    baseState.currentTurn = 'AI';
    baseState.turnNumber = 1;
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { hasMoved: true, hasAttacked: true });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { hasMoved: true, hasAttacked: true });

    const newState = nextTurn(baseState);

    expect(newState.currentTurn).toBe('Player');
    expect(newState.turnNumber).toBe(2);
    expect(newState.phase).toBe(TurnPhase.START_TURN);
    
    // Player unit actions should be reset
    expect(newState.units['u1'].hasMoved).toBe(false);
    expect(newState.units['u1'].hasAttacked).toBe(false);

    // AI unit actions should remain unchanged (true)
    expect(newState.units['u2'].hasMoved).toBe(true);
    expect(newState.units['u2'].hasAttacked).toBe(true);
  });
});
