import type { GameEntry, Round } from '../types';
export const calculatePlayerVotePoints = (round: Pick<Round, 'chosenPlayerId' | 'optionalRules'>, playerId: string) => {
  if (playerId !== round.chosenPlayerId) return 1;
  const cards = round.optionalRules.cards;
  return !cards.enabled || cards.selected === 'democracy' ? 2 : 1;
};
export const calculateAccessibilityScore = (game: Pick<GameEntry,'freeToPlay'|'steamGreen'|'ownedBy'>) => (game.freeToPlay ? 2 : 0) + (game.steamGreen ? 1.5 : 0) + game.ownedBy.length * .5;
export const calculateVoteScore = (game: Pick<GameEntry,'votes'>) => game.votes.reduce((sum, vote) => sum + vote.points, 0);
export const updateGameScores = (game: GameEntry): GameEntry => ({ ...game, accessibilityScore: calculateAccessibilityScore(game), voteScore: calculateVoteScore(game), finalScore: calculateAccessibilityScore(game) + calculateVoteScore(game) });
