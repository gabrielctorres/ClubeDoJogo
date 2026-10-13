import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AbilityId, CardsRule, GameEntry, OptionalRules, Player, RandomCategoryRule, Round, RoundResult, Stage, Vote } from '../types';
import { calculateWeightedWinner, calculateWinProbability, secureRandomInt } from '../services/weightedRandom';
import { calculateAccessibilityScore, calculatePlayerVotePoints, calculateVoteScore, updateGameScores } from '../services/scoring';
import { randomAbilities } from '../services/abilities';
import { isBackup } from '../services/backup';

const id = () => crypto.randomUUID();

const emptyRules = (): OptionalRules => ({
  randomCategory: { enabled: false, category: null, rerollsUsed: 0 },
  cards: { enabled: false, options: [], selected: null, replacement: null },
});

const newRound = (patch: Partial<Round> = {}): Round => ({
  id: id(), participantIds: [], games: [], chosenPlayerId: '', chosenPlayerName: '',
  stage: 'optionalRules', currentIndex: 0, optionalRules: emptyRules(), extraGameUsed: false, usedEffects: [],
  ...patch,
});

/** Chaves antigas de `usedEffects` que foram renomeadas para o `AbilityId`. */
const legacyEffects: Record<string, string> = { fiscal: 'fun-inspector' };

/** Completa rodadas salvas por versões anteriores do app com os campos novos. */
export const normalizeRound = (round?: Partial<Round>): Round | undefined => {
  if (!round) return undefined;
  const oldCategory = round.optionalRules?.randomCategory as Partial<RandomCategoryRule> & { rerollUsed?: boolean } | undefined;
  const oldCards = round.optionalRules?.cards;
  return {
    ...round as Round,
    games: (round.games ?? []).map(game => ({
      ...game,
      effectScore: game.effectScore ?? game.finalScore - calculateAccessibilityScore(game) - calculateVoteScore(game),
    })),
    optionalRules: {
      randomCategory: {
        enabled: oldCategory?.enabled ?? false,
        category: oldCategory?.category ?? null,
        drawnCategories: oldCategory?.drawnCategories ?? (oldCategory?.category ? [oldCategory.category] : []),
        rerollsUsed: oldCategory?.rerollsUsed ?? (oldCategory?.rerollUsed ? 1 : 0),
      },
      cards: {
        enabled: oldCards?.enabled ?? false,
        options: oldCards?.options ?? [],
        selected: oldCards?.selected ?? null,
        replacement: oldCards?.replacement ?? null,
      },
    },
    extraGameUsed: round.extraGameUsed ?? false,
    usedEffects: (round.usedEffects ?? []).map(effect => legacyEffects[effect] ?? effect),
  };
};

interface ClubState {
  players: Player[];
  chosenHistory: string[];
  round?: Round;
  history: RoundResult[];
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, name: string) => void;
  prepareRound: () => void;
  startRound: (ids: string[]) => void;
  setRandomCategory: (patch: Partial<RandomCategoryRule>) => void;
  setCardsRule: (patch: Partial<CardsRule>) => void;
  setAbilityOptions: (options: AbilityId[]) => void;
  selectAbility: (id: AbilityId) => void;
  drawAbilityReplacement: () => void;
  addNomination: (name: string, playerId: string) => void;
  choosePlayer: () => void;
  updateGame: (gameId: string, patch: Partial<GameEntry>) => void;
  adjustGameScore: (gameId: string, delta: number, effect: string) => void;
  transferPoint: (fromId: string, toId: string) => void;
  vote: (vote: Vote) => void;
  setStage: (stage: Stage) => void;
  setCurrentIndex: (n: number) => void;
  spinWinner: () => void;
  finishRound: () => void;
  resetRound: () => void;
  clearHistory: () => void;
  importBackup: (data: unknown) => boolean;
}

type Persisted = Pick<ClubState, 'players' | 'chosenHistory' | 'round' | 'history'>;

/** Aplica `fn` à rodada atual; sem rodada, o estado não muda. */
const updateRound = (s: Persisted, fn: (round: Round) => Round | undefined): Partial<Persisted> => {
  if (!s.round) return {};
  const round = fn(s.round);
  return round && round !== s.round ? { round } : {};
};

const withRules = (round: Round, patch: Partial<OptionalRules>): Round =>
  ({ ...round, optionalRules: { ...round.optionalRules, ...patch } });

const withCards = (round: Round, patch: Partial<CardsRule>): Round =>
  withRules(round, { cards: { ...round.optionalRules.cards, ...patch } });

const mapGames = (round: Round, fn: (game: GameEntry) => GameEntry): Round =>
  ({ ...round, games: round.games.map(fn) });

const isDuplicateName = (players: Player[], name: string, exceptId?: string) =>
  players.some(p => p.id !== exceptId && p.name.toLowerCase() === name.toLowerCase());

export const useClubStore = create<ClubState>()(persist((set) => ({
  players: [], chosenHistory: [], history: [],

  addPlayer: name => set(s => {
    const normalized = name.trim();
    if (s.round?.chosenPlayerId || !normalized || isDuplicateName(s.players, normalized)) return s;
    return { players: [...s.players, { id: id(), name: normalized }] };
  }),
  removePlayer: playerId => set(s => s.round?.chosenPlayerId ? s : { players: s.players.filter(p => p.id !== playerId) }),
  updatePlayer: (playerId, name) => set(s => {
    const normalized = name.trim();
    if (s.round?.chosenPlayerId || !normalized || isDuplicateName(s.players, normalized, playerId)) return s;
    return { players: s.players.map(p => p.id === playerId ? { ...p, name: normalized } : p) };
  }),

  prepareRound: () => set(s => s.round ? s : { round: newRound() }),
  startRound: participantIds => set(s => {
    if (s.round?.chosenPlayerId) return s;
    const uniqueIds = [...new Set(participantIds)].filter(playerId => s.players.some(player => player.id === playerId));
    if (uniqueIds.length < 2) return s;
    return { round: newRound({
      id: s.round?.id ?? id(),
      participantIds: uniqueIds,
      stage: 'chosen',
      optionalRules: s.round?.optionalRules ?? emptyRules(),
    }) };
  }),

  setRandomCategory: patch => set(s => updateRound(s, round =>
    withRules(round, { randomCategory: { ...round.optionalRules.randomCategory, ...patch } }))),
  setCardsRule: patch => set(s => updateRound(s, round => withCards(round, patch))),
  setAbilityOptions: options => set(s => updateRound(s, round => withCards(round, { options }))),
  selectAbility: abilityId => set(s => updateRound(s, round => withCards(round, { selected: abilityId }))),
  drawAbilityReplacement: () => set(s => updateRound(s, round => {
    const cards = round.optionalRules.cards;
    if (cards.selected !== 'pretend' || cards.replacement) return round;
    return withCards(round, { replacement: randomAbilities(1, cards.options)[0]?.id ?? null });
  })),

  addNomination: (name, playerId) => set(s => updateRound(s, round => {
    const normalized = name.trim().toLowerCase();
    const existing = round.games.find(g => g.name.toLowerCase() === normalized);
    const games = existing
      ? round.games.map(g => g.id === existing.id && !g.nominatedBy.includes(playerId) ? { ...g, nominatedBy: [...g.nominatedBy, playerId] } : g)
      : [...round.games, {
        id: id(), name: name.trim(), nominatedBy: [playerId], freeToPlay: false, steamGreen: false, ownedBy: [], votes: [],
        accessibilityScore: 0, voteScore: 0, effectScore: 0, finalScore: 0,
      }];
    return {
      ...round,
      games,
      currentIndex: round.currentIndex + 1,
      extraGameUsed: round.extraGameUsed || round.currentIndex >= round.participantIds.length,
    };
  })),

  choosePlayer: () => set(s => {
    if (!s.round || s.round.chosenPlayerId) return s;
    const pool = s.players.filter(p => s.round!.participantIds.includes(p.id));
    if (!pool.length) return s;
    const eligible = pool.filter(p => !s.chosenHistory.includes(p.id));
    // Ao reiniciar o ciclo, quem foi o Escolhido da rodada anterior não pode repetir.
    const previous = s.chosenHistory.at(-1);
    const restart = pool.filter(p => p.id !== previous);
    const candidates = eligible.length ? eligible : restart.length ? restart : pool;
    const player = candidates[secureRandomInt(candidates.length)];
    return {
      chosenHistory: eligible.length ? [...s.chosenHistory, player.id] : [player.id],
      round: { ...s.round, chosenPlayerId: player.id, chosenPlayerName: player.name, currentIndex: 0 },
    };
  }),

  updateGame: (gameId, patch) => set(s => updateRound(s, round =>
    mapGames(round, g => g.id === gameId ? updateGameScores({ ...g, ...patch }) : g))),
  adjustGameScore: (gameId, delta, effect) => set(s => updateRound(s, round => {
    if (round.usedEffects.includes(effect)) return round;
    return {
      ...mapGames(round, g => g.id === gameId ? updateGameScores({ ...g, effectScore: g.effectScore + delta }) : g),
      usedEffects: [...round.usedEffects, effect],
    };
  })),
  transferPoint: (fromId, toId) => set(s => updateRound(s, round => {
    if (round.usedEffects.includes('point-pix') || fromId === toId) return round;
    const delta = (gameId: string) => gameId === fromId ? -1 : gameId === toId ? 1 : 0;
    return {
      ...mapGames(round, g => delta(g.id) ? updateGameScores({ ...g, effectScore: g.effectScore + delta(g.id) }) : g),
      usedEffects: [...round.usedEffects, 'point-pix'],
    };
  })),

  vote: vote => set(s => updateRound(s, round => {
    if (!round.participantIds.includes(vote.playerId)
      || !round.games.some(game => game.id === vote.gameId)
      || round.games.some(game => game.votes.some(existing => existing.playerId === vote.playerId))) return round;
    const points = calculatePlayerVotePoints(round, vote.playerId);
    return {
      ...mapGames(round, g => g.id === vote.gameId ? updateGameScores({ ...g, votes: [...g.votes, { ...vote, points }] }) : g),
      currentIndex: round.currentIndex + 1,
    };
  })),

  setStage: stage => set(s => updateRound(s, round => ({ ...round, stage, currentIndex: 0 }))),
  setCurrentIndex: n => set(s => updateRound(s, round => ({ ...round, currentIndex: n }))),

  spinWinner: () => set(s => updateRound(s, round => round.games.length && !round.weightedWinnerId
    ? { ...round, weightedWinnerId: calculateWeightedWinner(round.games) }
    : round)),

  finishRound: () => set(s => {
    const round = s.round;
    const game = round?.games.find(g => g.id === round.weightedWinnerId);
    if (!round || !game) return s;
    const chosen = s.players.find(p => p.id === round.chosenPlayerId);
    const result: RoundResult = {
      id: round.id,
      date: new Date().toISOString(),
      winnerGameId: game.id,
      winnerGameName: game.name,
      nominatedBy: game.nominatedBy.map(pid => s.players.find(p => p.id === pid)?.name || pid),
      nominatedByIds: game.nominatedBy,
      chosenPlayerId: round.chosenPlayerId,
      chosenPlayerName: chosen?.name ?? round.chosenPlayerName,
      finalScore: game.finalScore,
      probability: calculateWinProbability(round.games, game.id),
    };
    return { history: [result, ...s.history], round: undefined };
  }),

  resetRound: () => set({ round: undefined }),
  /** Apaga as rodadas finalizadas e o ciclo do Escolhido. Mantém jogadores e a rodada em andamento. */
  clearHistory: () => set({ history: [], chosenHistory: [] }),
  importBackup: data => {
    if (!isBackup(data)) return false;
    set({ players: data.players, chosenHistory: data.chosenHistory, history: data.history, round: undefined });
    return true;
  },
}), {
  name: 'clube-do-jogo',
  merge: (persisted, current) => {
    const saved = persisted as Partial<ClubState>;
    return { ...current, ...saved, round: normalizeRound(saved.round) };
  },
}));
