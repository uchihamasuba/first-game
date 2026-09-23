import { describe, it, expect } from 'vitest';
import { moveUnit, TurnPhase, TileType } from '../src';
import { createBaseState, createUnit } from './helpers';

describe('Movement logic', () => {
  it('should move a unit to a valid position within range', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { moveRange: 2 });
    baseState.currentTurn = 'Player';

    const newState = moveUnit(baseState, 'u1', { x: 2, y: 2 });
    
    expect(newState.units['u1'].position).toEqual({ x: 2, y: 2 });
    expect(newState.units['u1'].hasMoved).toBe(true);
    expect(newState.phase).toBe(TurnPhase.MOVE);
  });

  it('should not move a unit beyond its movement range', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { moveRange: 2 });

    // Distance is 3
    const newState = moveUnit(baseState, 'u1', { x: 3, y: 2 });
    
    expect(newState.units['u1'].position).toEqual({ x: 1, y: 1 });
    expect(newState.units['u1'].hasMoved).toBe(false);
  });

  it('should not move out of bounds', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 0, 0, { moveRange: 2 });

    const newState = moveUnit(baseState, 'u1', { x: -1, y: 0 });
    expect(newState.units['u1'].position).toEqual({ x: 0, y: 0 });
  });

  it('should not move into a blocked tile', () => {
    const baseState = createBaseState();
    baseState.board[1][2].type = TileType.Blocked;
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { moveRange: 2 });

    const newState = moveUnit(baseState, 'u1', { x: 2, y: 1 });
    expect(newState.units['u1'].position).toEqual({ x: 1, y: 1 });
  });

  it('should not move into an occupied tile by alive unit', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { moveRange: 2 });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { isAlive: true });

    const newState = moveUnit(baseState, 'u1', { x: 2, y: 1 });
    expect(newState.units['u1'].position).toEqual({ x: 1, y: 1 });
  });

  it('should move into a tile occupied by a dead unit', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { moveRange: 2 });
    baseState.units['u2'] = createUnit('u2', 'AI', 2, 1, { isAlive: false });

    const newState = moveUnit(baseState, 'u1', { x: 2, y: 1 });
    expect(newState.units['u1'].position).toEqual({ x: 2, y: 1 });
    expect(newState.units['u1'].hasMoved).toBe(true);
  });

  it('should not allow moving if it is not the unit\'s turn', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { moveRange: 2 });
    baseState.currentTurn = 'AI'; // Not player's turn

    const newState = moveUnit(baseState, 'u1', { x: 2, y: 1 });
    expect(newState.units['u1'].position).toEqual({ x: 1, y: 1 });
    expect(newState.units['u1'].hasMoved).toBe(false);
  });

  it('should not allow moving if unit has already moved', () => {
    const baseState = createBaseState();
    baseState.units['u1'] = createUnit('u1', 'Player', 1, 1, { moveRange: 2, hasMoved: true });
    
    const newState = moveUnit(baseState, 'u1', { x: 2, y: 1 });
    expect(newState.units['u1'].position).toEqual({ x: 1, y: 1 });
  });
});
