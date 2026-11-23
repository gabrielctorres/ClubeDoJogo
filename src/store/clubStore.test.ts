// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { normalizeRound, useClubStore } from './clubStore';
import type { Round } from '../types';

const store = () => useClubStore.getState();
const round = () => store().round!;

/** Cria jogadores e inicia uma rodada com todos eles, sem regras opcionais. */
const startWith = (...names: string[]) => {
  names.forEach(name => store().addPlayer(name));
  store().prepareRound();
  store().startRound(store().players.map(p => p.id));
};
const playerId = (name: string) => store().players.find(p => p.name === name)!.id;
const gameId = (name: string) => round().games.find(g => g.name === name)!.id;

beforeEach(() => {
  localStorage.clear();
  useClubStore.setState({ players: [], chosenHistory: [], history: [], round: undefined });
});

describe('Escolhido', () => {
  it('não sorteia duas vezes na mesma rodada', () => {
    startWith('Ana', 'Bia', 'Caio');
    store().choosePlayer();
    const first = round().chosenPlayerId;
    store().choosePlayer();
    expect(round().chosenPlayerId).toBe(first);
    expect(store().chosenHistory).toEqual([first]);
    expect(round().stage).toBe('chosen');
  });
  it('respeita o cooldown e reinicia o ciclo', () => {
    startWith('Ana', 'Bia');
    useClubStore.setState({ chosenHistory: [playerId('Ana')] });
    store().choosePlayer();
    expect(round().chosenPlayerId).toBe(playerId('Bia'));
    expect(store().chosenHistory).toEqual([playerId('Ana'), playerId('Bia')]);

    store().resetRound();
    store().startRound([playerId('Ana'), playerId('Bia')]);
    store().choosePlayer();
    expect(store().chosenHistory).toEqual([round().chosenPlayerId]);
  });
  it('não repete o Escolhido da rodada anterior quando o ciclo reinicia', () => {
    startWith('Ana', 'Bia', 'Caio');
    for (let i = 0; i < 20; i++) {
      store().resetRound();
      useClubStore.setState({ chosenHistory: [playerId('Ana'), playerId('Caio'), playerId('Bia')] });
      store().startRound(store().players.map(p => p.id));
      store().choosePlayer();
      expect(round().chosenPlayerId).not.toBe(playerId('Bia'));
      expect(store().chosenHistory).toEqual([round().chosenPlayerId]);
    }
  });
});

describe('indicações e votos', () => {
  beforeEach(() => {
    startWith('Ana', 'Bia', 'Caio');
    useClubStore.setState({ chosenHistory: [playerId('Bia'), playerId('Caio')] });
    store().choosePlayer(); // Ana é a única elegível
  });

  it('junta jogos repetidos sem duplicar quem indicou', () => {
    store().addNomination('Valheim', playerId('Ana'));
    store().addNomination(' valheim ', playerId('Bia'));
    store().addNomination('Hades', playerId('Caio'));
    expect(round().games.map(g => g.name)).toEqual(['Valheim', 'Hades']);
    expect(round().games[0].nominatedBy).toEqual([playerId('Ana'), playerId('Bia')]);
  });

  it('aplica peso 2 ao Escolhido e rejeita um segundo voto', () => {
    store().addNomination('Valheim', playerId('Ana'));
    store().addNomination('Hades', playerId('Bia'));
    store().vote({ playerId: playerId('Ana'), gameId: gameId('Valheim'), points: 99 });
    store().vote({ playerId: playerId('Ana'), gameId: gameId('Hades'), points: 1 });
    store().vote({ playerId: playerId('Bia'), gameId: gameId('Valheim'), points: 1 });
    expect(round().games.find(g => g.name === 'Valheim')!.voteScore).toBe(3);
    expect(round().games.find(g => g.name === 'Hades')!.voteScore).toBe(0);
  });

  it('preserva efeitos de habilidade quando o placar é recalculado', () => {
    store().addNomination('Valheim', playerId('Ana'));
    store().addNomination('Hades', playerId('Bia'));
    store().updateGame(gameId('Valheim'), { freeToPlay: true });
    store().adjustGameScore(gameId('Valheim'), -3, 'fun-inspector');
    store().adjustGameScore(gameId('Valheim'), -3, 'fun-inspector'); // efeito só vale uma vez
    store().transferPoint(gameId('Hades'), gameId('Valheim'));
    store().updateGame(gameId('Valheim'), { steamGreen: true });
    const valheim = round().games.find(g => g.name === 'Valheim')!;
    expect(valheim.effectScore).toBe(-2);
    expect(valheim.finalScore).toBe(1 + 2 + 1 - 2); // base + F2P + Steam Verde + efeitos
    expect(round().games.find(g => g.name === 'Hades')!.finalScore).toBe(1 - 1);
  });

  it('renomeia um jogo, mas recusa nome vazio ou repetido', () => {
    store().addNomination('Valhem', playerId('Ana'));
    store().addNomination('Hades', playerId('Bia'));
    expect(store().renameGame(gameId('Valhem'), '  Valheim ')).toBe(true);
    expect(round().games.map(g => g.name)).toEqual(['Valheim', 'Hades']);
    expect(store().renameGame(gameId('Valheim'), 'hades')).toBe(false);
    expect(store().renameGame(gameId('Valheim'), '   ')).toBe(false);
    expect(round().games.map(g => g.name)).toEqual(['Valheim', 'Hades']);
  });
});

describe('quem venceu no mês anterior só vota', () => {
  it('bloqueia a indicação de quem indicou o último vencedor', () => {
    ['Ana', 'Bia', 'Caio'].forEach(name => store().addPlayer(name));
    useClubStore.setState({ history: [{ id: 'r', date: '2026-01-01', winnerGameId: 'g', winnerGameName: 'Hades', nominatedBy: ['Bia'],
      nominatedByIds: [playerId('Bia')], chosenPlayerId: '', chosenPlayerName: '', finalScore: 1, probability: 1 }] });
    store().prepareRound();
    store().startRound(store().players.map(p => p.id));
    expect(round().blockedNominatorIds).toEqual([playerId('Bia')]);

    store().choosePlayer();
    store().addNomination('Valheim', playerId('Bia'));
    expect(round().games).toEqual([]);
    store().addNomination('Valheim', playerId('Ana'));
    store().addNomination('Hades', playerId('Caio'));
    expect(round().games.map(g => g.name)).toEqual(['Valheim', 'Hades']);
    expect(round().currentIndex).toBe(2);

    // Bia continua votando normalmente.
    store().vote({ playerId: playerId('Bia'), gameId: gameId('Hades'), points: 1 });
    expect(round().games.find(g => g.name === 'Hades')!.voteScore).toBeGreaterThan(0);
  });
});

describe('roleta e fim da rodada', () => {
  it('não gira de novo e grava probabilidade, IDs e relatório no histórico', () => {
    startWith('Ana', 'Bia');
    store().choosePlayer();
    store().addNomination('Valheim', playerId('Ana'));
    store().addNomination('Hades', playerId('Bia'));
    store().updateGame(gameId('Valheim'), { ownedBy: [playerId('Bia')], steamGreen: true }); // 1 + 0,5 + 1
    store().adjustGameScore(gameId('Hades'), -2, 'coin-flip'); // negativo vale peso 1 na roleta
    store().vote({ playerId: playerId('Bia'), gameId: gameId('Valheim'), points: 1 });
    store().spinWinner();
    expect([gameId('Valheim'), gameId('Hades')]).toContain(round().weightedWinnerId);
    useClubStore.setState({ round: { ...round(), weightedWinnerId: gameId('Hades') } });
    store().spinWinner();
    expect(round().weightedWinnerId).toBe(gameId('Hades'));

    store().finishRound();
    const [result] = store().history;
    expect(store().round).toBeUndefined();
    expect(result.winnerGameName).toBe('Hades');
    expect(result.probability).toBe(1 / 4.5); // pesos 3,5 (2,5 + 1 voto) e 1
    expect(result.nominatedByIds).toEqual([playerId('Bia')]);

    const report = result.report!;
    expect(report.participants.map(p => p.name)).toEqual(['Ana', 'Bia']);
    const valheim = report.games.find(g => g.name === 'Valheim')!;
    expect(valheim.nominatedBy).toEqual([{ id: playerId('Ana'), name: 'Ana' }]);
    expect(valheim.ownedBy.map(p => p.name)).toEqual(['Bia']);
    expect(valheim.votes).toEqual([{ player: { id: playerId('Bia'), name: 'Bia' }, points: 1 }]);
    expect(valheim.probability).toBe(3.5 / 4.5);
  });
});

describe('limpar histórico', () => {
  it('apaga histórico e ciclo do Escolhido, mas mantém jogadores e a rodada', () => {
    startWith('Ana', 'Bia');
    store().choosePlayer();
    useClubStore.setState({ history: [{ id: 'r', date: '2026-01-01', winnerGameId: 'g', winnerGameName: 'Hades', nominatedBy: [], chosenPlayerId: '', chosenPlayerName: '', finalScore: 1, probability: 1 }] });
    store().clearHistory();
    expect(store().history).toEqual([]);
    expect(store().chosenHistory).toEqual([]);
    expect(store().players).toHaveLength(2);
    expect(store().round).toBeDefined();
  });
});

describe('migração de rodadas salvas', () => {
  it('completa campos novos de uma rodada antiga', () => {
    const old = {
      id: 'r', participantIds: [], chosenPlayerId: '', chosenPlayerName: '', stage: 'score', currentIndex: 0,
      usedEffects: ['fiscal'],
      optionalRules: { randomCategory: { enabled: true, category: 'RPG', rerollUsed: true }, cards: { enabled: true, options: [], selected: 'fun-inspector' } },
      games: [{ id: 'g', name: 'Valheim', nominatedBy: [], freeToPlay: true, steamGreen: false, ownedBy: [], votes: [], accessibilityScore: 2, voteScore: 0, finalScore: -1 }],
    } as unknown as Round;
    const normalized = normalizeRound(old)!;
    expect(normalized.games[0].effectScore).toBe(-3);
    expect(normalized.games[0].emulator).toBe(false);
    expect(normalized.games[0].finalScore).toBe(1 + 2 - 3); // agora com o ponto base
    expect(normalized.blockedNominatorIds).toEqual([]);
    expect(normalized.usedEffects).toEqual(['fun-inspector']);
    expect(normalized.optionalRules.randomCategory).toMatchObject({ rerollsUsed: 1, drawnCategories: ['RPG'] });
    expect(normalized.optionalRules.cards.replacement).toBeNull();
    expect(normalized.extraGameUsed).toBe(false);
  });
});
