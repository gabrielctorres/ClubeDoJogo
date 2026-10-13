import { describe, expect, it } from 'vitest';
import { calculatePlayerVotePoints } from './scoring';
import { abilities } from './abilities';
import type { AbilityId } from '../types';

const round = (enabled: boolean, selected: AbilityId | null = null) => ({
  chosenPlayerId: 'chosen',
  optionalRules: {
    cards: { enabled, selected, options: [] },
    randomCategory: { enabled: false, category: null, rerollsUsed: 0 },
  },
});

describe('voto do Escolhido', () => {
  it('mantém o bônus padrão sem cartas', () => {
    expect(calculatePlayerVotePoints(round(false), 'chosen')).toBe(2);
    expect(calculatePlayerVotePoints(round(false), 'other')).toBe(1);
  });
  it.each([null, ...abilities.map(ability => ability.id)])('usa somente a carta ativa: %s', selected => {
    expect(calculatePlayerVotePoints(round(true, selected), 'chosen')).toBe(selected === 'democracy' ? 2 : 1);
    expect(calculatePlayerVotePoints(round(true, selected), 'other')).toBe(1);
  });
  it('ignora uma carta antiga quando a regra está desativada', () => {
    expect(calculatePlayerVotePoints(round(false, 'humility'), 'chosen')).toBe(2);
  });
});
