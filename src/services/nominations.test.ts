import { describe, expect, it } from 'vitest';
import { getBlockedNominatorIds, getLastWinnerNominatorIds, getNominatorIds } from './nominations';
import { awaitingExtraGame } from './stageFlow';
import type { RoundResult } from '../types';

const result = (patch: Partial<RoundResult>): RoundResult => ({
  id: 'r', date: '2026-01-01', winnerGameId: 'g', winnerGameName: 'Hades', nominatedBy: ['Ana'],
  chosenPlayerId: '', chosenPlayerName: '', finalScore: 1, probability: 1, ...patch,
});
const players = [{ id: 'a', name: 'Ana' }, { id: 'b', name: 'Bia' }, { id: 'c', name: 'Caio' }];

describe('bloqueio de quem venceu no mês anterior', () => {
  it('usa só a rodada mais recente', () => {
    const history = [result({ nominatedByIds: ['b'] }), result({ nominatedByIds: ['a'] })];
    expect(getLastWinnerNominatorIds(history, players)).toEqual(['b']);
    expect(getLastWinnerNominatorIds([], players)).toEqual([]);
  });
  it('casa pelo nome em resultados antigos, sem IDs', () => {
    expect(getLastWinnerNominatorIds([result({ nominatedBy: ['Caio'] })], players)).toEqual(['c']);
  });
  it('bloqueia só quem participa e nunca bloqueia todos', () => {
    expect(getBlockedNominatorIds(['a', 'b'], ['b', 'c'])).toEqual(['b']);
    expect(getBlockedNominatorIds(['a', 'b'], ['a', 'b'])).toEqual([]);
  });
  it('tira os bloqueados da ordem de indicações', () => {
    expect(getNominatorIds({ participantIds: ['a', 'b', 'c'], blockedNominatorIds: ['b'] })).toEqual(['a', 'c']);
  });
  it('não dá jogo extra ao Escolhido bloqueado', () => {
    const base = {
      participantIds: ['a', 'b'], blockedNominatorIds: ['b'], currentIndex: 1, extraGameUsed: false, chosenPlayerId: 'a',
      optionalRules: { cards: { enabled: true, options: [], selected: 'one-more' as const }, randomCategory: { enabled: false, category: null, rerollsUsed: 0 } },
    };
    expect(awaitingExtraGame(base)).toBe(true);
    expect(awaitingExtraGame({ ...base, chosenPlayerId: 'b' })).toBe(false);
  });
});
