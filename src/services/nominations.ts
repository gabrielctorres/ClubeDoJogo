import type { Player, Round, RoundResult } from '../types';

/**
 * Quem indicou o vencedor da rodada anterior. Resultados antigos não têm IDs:
 * nesse caso, casa pelo nome gravado.
 */
export function getLastWinnerNominatorIds(history: RoundResult[], players: Player[]): string[] {
  const last = history[0];
  if (!last) return [];
  return last.nominatedByIds ?? players.filter(player => last.nominatedBy.includes(player.name)).map(player => player.id);
}

/**
 * Participantes que ficam sem indicar nesta rodada (só votam).
 * Se todos estiverem bloqueados, ninguém fica, porque a rodada precisa de jogos.
 */
export function getBlockedNominatorIds(participantIds: string[], lastWinnerNominatorIds: string[]): string[] {
  const blocked = participantIds.filter(playerId => lastWinnerNominatorIds.includes(playerId));
  return blocked.length < participantIds.length ? blocked : [];
}

type NominationRound = Pick<Round, 'participantIds'> & Partial<Pick<Round, 'blockedNominatorIds'>>;

/** Participantes que indicam jogo nesta rodada, na ordem das indicações. */
export const getNominatorIds = (round: NominationRound) =>
  round.participantIds.filter(playerId => !round.blockedNominatorIds?.includes(playerId));

export const isBlockedNominator = (round: Partial<Pick<Round, 'blockedNominatorIds'>>, playerId: string) =>
  Boolean(round.blockedNominatorIds?.includes(playerId));
