import type { Player, RoundResult } from '../types';

export interface ClubBackup { version: 1; exportedAt: string; players: Player[]; chosenHistory: string[]; history: RoundResult[] }

const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');

const isPlayer = (entry: unknown): entry is Player => !!entry && typeof entry === 'object'
  && typeof (entry as Player).id === 'string' && typeof (entry as Player).name === 'string';

/** Checagem leve do relatório: ele só é exibido, então basta a estrutura principal estar lá. */
const isReport = (value: unknown) => {
  if (!value || typeof value !== 'object') return false;
  const report = value as Record<string, unknown>;
  return Array.isArray(report.participants) && report.participants.every(isPlayer)
    && Array.isArray(report.blockedNominators) && report.blockedNominators.every(isPlayer)
    && Array.isArray(report.games) && report.games.every(game => !!game && typeof game === 'object'
      && typeof (game as { name?: unknown }).name === 'string' && Array.isArray((game as { votes?: unknown }).votes));
};

const isResult = (entry: unknown): entry is RoundResult => {
  if (!entry || typeof entry !== 'object') return false;
  const result = entry as RoundResult;
  return typeof result.id === 'string' && typeof result.date === 'string'
    && !Number.isNaN(Date.parse(result.date)) && typeof result.winnerGameId === 'string'
    && typeof result.winnerGameName === 'string' && isStringArray(result.nominatedBy)
    && (result.nominatedByIds === undefined || isStringArray(result.nominatedByIds))
    && typeof result.chosenPlayerId === 'string' && typeof result.chosenPlayerName === 'string'
    && Number.isFinite(result.finalScore) && Number.isFinite(result.probability)
    && (result.report === undefined || isReport(result.report));
};

export const isBackup = (data: unknown): data is ClubBackup => {
  if (!data || typeof data !== 'object') return false;
  const value = data as Record<string, unknown>;
  return value.version === 1 && Array.isArray(value.players) && value.players.every(isPlayer)
    && isStringArray(value.chosenHistory)
    && Array.isArray(value.history) && value.history.every(isResult);
};

export const createBackup = (state: Pick<ClubBackup, 'players' | 'chosenHistory' | 'history'>): ClubBackup => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  players: state.players,
  chosenHistory: state.chosenHistory,
  history: state.history,
});
