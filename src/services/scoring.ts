import type { GameEntry, Round } from '../types';

/** Bônus de acessibilidade. Ver docs/consenso-jogos-sem-voto.md. */
export const ACCESSIBILITY_BONUS = { freeToPlay: 2, steamGreen: 1, emulator: 1, perOwner: 0.5 } as const;

/** Teto do bônus de donos: a partir do 2º dono, ter mais donos não soma. */
export const MAX_OWNER_BONUS = 1;

/** Pontos que todo jogo recebe só por estar na rodada. A acessibilidade soma em cima deles. */
export const BASE_SCORE = 2;

/** Valor de um voto comum. */
export const VOTE_POINTS = 2;

/** Valor do voto do Escolhido (dobrado). */
export const CHOSEN_VOTE_POINTS = 2 * VOTE_POINTS;

export const calculatePlayerVotePoints = (round: Pick<Round, 'chosenPlayerId' | 'optionalRules'>, playerId: string) => {
  if (playerId !== round.chosenPlayerId) return VOTE_POINTS;
  const cards = round.optionalRules.cards;
  return !cards.enabled || cards.selected === 'democracy' ? CHOSEN_VOTE_POINTS : VOTE_POINTS;
};

export const calculateOwnerBonus = (owners: number) => Math.min(MAX_OWNER_BONUS, owners * ACCESSIBILITY_BONUS.perOwner);

export const calculateAccessibilityScore = (game: Pick<GameEntry, 'freeToPlay' | 'steamGreen' | 'emulator' | 'ownedBy'>) =>
  (game.freeToPlay ? ACCESSIBILITY_BONUS.freeToPlay : 0)
  + (game.steamGreen ? ACCESSIBILITY_BONUS.steamGreen : 0)
  + (game.emulator ? ACCESSIBILITY_BONUS.emulator : 0)
  + calculateOwnerBonus(game.ownedBy.length);

export const calculateVoteScore = (game: Pick<GameEntry, 'votes'>) => game.votes.reduce((sum, vote) => sum + vote.points, 0);

export const updateGameScores = (game: GameEntry): GameEntry => {
  const accessibilityScore = calculateAccessibilityScore(game);
  const voteScore = calculateVoteScore(game);
  const effectScore = game.effectScore ?? 0;
  return { ...game, accessibilityScore, voteScore, effectScore, finalScore: BASE_SCORE + accessibilityScore + voteScore + effectScore };
};
