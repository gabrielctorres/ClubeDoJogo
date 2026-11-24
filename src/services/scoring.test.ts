import { describe, expect, it } from 'vitest';
import { BASE_SCORE, calculateAccessibilityScore, calculateVoteScore, updateGameScores } from './scoring';
import { getEligibleChosenPlayers } from './chosenPlayer';
import { calculateWeightedWinner, calculateWinProbability, rouletteWeight } from './weightedRandom';
import type { GameEntry } from '../types';

const access = (patch: Partial<Pick<GameEntry, 'freeToPlay' | 'steamGreen' | 'emulator' | 'ownedBy'>>) =>
  calculateAccessibilityScore({ freeToPlay: false, steamGreen: false, emulator: false, ownedBy: [], ...patch });

describe('regras do Clube do Jogo', () => {
  it('calcula acessibilidade', () => {
    expect(access({})).toBe(0);
    expect(access({ steamGreen: true })).toBe(1);
    expect(access({ emulator: true })).toBe(1);
    expect(access({ ownedBy: ['a'] })).toBe(0.5);
  });
  it('limita o bônus de donos a +1 e soma o resto sem teto', () => {
    expect(access({ ownedBy: ['a', 'b'] })).toBe(1);
    expect(access({ ownedBy: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] })).toBe(1);
    expect(access({ freeToPlay: true, ownedBy: ['a', 'b', 'c'] })).toBe(3);
    expect(access({ steamGreen: true, emulator: true, ownedBy: ['a'] })).toBe(2.5);
  });
  it('aplica a fórmula do consenso: 2 + tipo + donos (até +1) + 2 × votos', () => {
    // Zelda de novembro: emulador, 3 donos, 3 votos comuns
    const zelda = { freeToPlay: false, steamGreen: false, emulator: true, ownedBy: ['a', 'b', 'c'], effectScore: 0,
      votes: [2, 2, 2].map((points, i) => ({ playerId: `p${i}`, gameId: 'z', points })) } as unknown as GameEntry;
    expect(updateGameScores(zelda).finalScore).toBe(10);
    // Mass Effect: Steam Verde, 1 dono, sem votos
    const massEffect = { freeToPlay: false, steamGreen: true, emulator: false, ownedBy: ['a'], effectScore: 0, votes: [] } as unknown as GameEntry;
    expect(updateGameScores(massEffect).finalScore).toBe(3.5);
  });
  it('soma o ponto base à pontuação final', () => {
    const game = { freeToPlay: false, steamGreen: true, emulator: false, ownedBy: [], effectScore: 0,
      votes: [{ playerId: 'a', gameId: 'g', points: 2 }] } as unknown as GameEntry;
    expect(updateGameScores(game).finalScore).toBe(BASE_SCORE + 1 + 2);
  });
  it('calcula votos', () => expect(calculateVoteScore({ votes: [{ playerId: 'a', gameId: 'g', points: 1 }, { playerId: 'b', gameId: 'g', points: 2 }] })).toBe(3));
  it('aplica cooldown e reinicia ciclo', () => {
    const ps = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }];
    expect(getEligibleChosenPlayers(ps, ['a']).map(p => p.id)).toEqual(['b']);
    expect(getEligibleChosenPlayers(ps, ['a', 'b']).map(p => p.id)).toEqual(['a', 'b']);
  });
  it('retorna um jogo válido na roleta ponderada', () => {
    const games = [{ id: 'a', finalScore: 10 }, { id: 'b', finalScore: 1 }] as never[];
    expect(['a', 'b']).toContain(calculateWeightedWinner(games));
  });
  it('garante peso mínimo 1 na roleta, mesmo com pontuação negativa', () => {
    expect(rouletteWeight({ finalScore: -3 })).toBe(1);
    expect(rouletteWeight({ finalScore: 0.5 })).toBe(1);
    expect(rouletteWeight({ finalScore: 4.5 })).toBe(4.5);
    const games = [{ id: 'a', finalScore: 3 }, { id: 'b', finalScore: -2 }];
    expect(calculateWinProbability(games, 'b')).toBe(0.25);
  });
});
