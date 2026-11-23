import type { GameEntry, Round } from '../types';

export const ACCESSIBILITY_BONUS = { freeToPlay: 2, steamGreen: 1, emulator: 1, perOwner: 0.5 } as const;

/** Ponto que todo jogo recebe só por estar na rodada. A acessibilidade soma em cima dele. */
export const BASE_SCORE = 1;

export const calculatePlayerVotePoints = (round: Pick<Round, 'chosenPlayerId' | 'optionalRules'>, playerId: string) => {
  if (playerId !== round.chosenPlayerId) return 1;
  const cards = round.optionalRules.cards;
  return !cards.enabled || cards.selected === 'democracy' ? 2 : 1;
};

export const calculateAccessibilityScore = (game: Pick<GameEntry, 'freeToPlay' | 'steamGreen' | 'emulator' | 'ownedBy'>) =>
  (game.freeToPlay ? ACCESSIBILITY_BONUS.freeToPlay : 0)
  + (game.steamGreen ? ACCESSIBILITY_BONUS.steamGreen : 0)
  + (game.emulator ? ACCESSIBILITY_BONUS.emulator : 0)
  + game.ownedBy.length * ACCESSIBILITY_BONUS.perOwner;

export const calculateVoteScore = (game: Pick<GameEntry, 'votes'>) => game.votes.reduce((sum, vote) => sum + vote.points, 0);

export const updateGameScores = (game: GameEntry): GameEntry => {
  const accessibilityScore = calculateAccessibilityScore(game);
  const voteScore = calculateVoteScore(game);
  const effectScore = game.effectScore ?? 0;
  return { ...game, accessibilityScore, voteScore, effectScore, finalScore: BASE_SCORE + accessibilityScore + voteScore + effectScore };
};
