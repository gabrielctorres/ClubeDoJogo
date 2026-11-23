import type { Player, ReportGame, Round, RoundReport } from '../types';
import { calculateWinProbability } from './weightedRandom';

/** Monta o relatório completo da rodada com os nomes da época, para o histórico. */
export function createRoundReport(round: Round, players: Player[]): RoundReport {
  const player = (playerId: string): Player => ({ id: playerId, name: players.find(p => p.id === playerId)?.name ?? playerId });
  const cards = round.optionalRules.cards;
  const category = round.optionalRules.randomCategory;
  const games: ReportGame[] = round.games.map(game => ({
    id: game.id,
    name: game.name,
    nominatedBy: game.nominatedBy.map(player),
    freeToPlay: game.freeToPlay,
    steamGreen: game.steamGreen,
    emulator: game.emulator,
    ownedBy: game.ownedBy.map(player),
    votes: game.votes.map(vote => ({ player: player(vote.playerId), points: vote.points })),
    accessibilityScore: game.accessibilityScore,
    voteScore: game.voteScore,
    effectScore: game.effectScore,
    finalScore: game.finalScore,
    probability: calculateWinProbability(round.games, game.id),
  }));
  return {
    participants: round.participantIds.map(player),
    blockedNominators: round.blockedNominatorIds.map(player),
    games,
    category: category.enabled ? category.category : null,
    ability: cards.enabled ? cards.selected : null,
  };
}
