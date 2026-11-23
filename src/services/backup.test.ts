import { describe, expect, it } from 'vitest';
import { createBackup, isBackup } from './backup';

const result = {
  id: 'r1', date: '2026-01-01T00:00:00.000Z', winnerGameId: 'g1', winnerGameName: 'Valheim', nominatedBy: ['Ana'],
  chosenPlayerId: 'p1', chosenPlayerName: 'Ana', finalScore: 5, probability: 0.5,
};
const backup = { version: 1, exportedAt: '2026-01-01T00:00:00.000Z', players: [{ id: 'p1', name: 'Ana' }], chosenHistory: ['p1'], history: [result] };

describe('backup', () => {
  it('aceita backups antigos, sem nominatedByIds', () => expect(isBackup(backup)).toBe(true));
  it('aceita backups novos, com nominatedByIds', () =>
    expect(isBackup({ ...backup, history: [{ ...result, nominatedByIds: ['p1'] }] })).toBe(true));
  it('aceita backups com relatório da rodada', () => {
    const report = { participants: [{ id: 'p1', name: 'Ana' }], blockedNominators: [], category: null, ability: null,
      games: [{ name: 'Valheim', votes: [] }] };
    expect(isBackup({ ...backup, history: [{ ...result, report }] })).toBe(true);
  });
  it.each([
    ['relatório inválido', { ...backup, history: [{ ...result, report: { games: 'x' } }] }],
    ['nulo', null],
    ['versão errada', { ...backup, version: 2 }],
    ['jogador inválido', { ...backup, players: [{ id: 1 }] }],
    ['data inválida', { ...backup, history: [{ ...result, date: 'ontem' }] }],
    ['nominatedByIds inválido', { ...backup, history: [{ ...result, nominatedByIds: [1] }] }],
    ['pontuação não numérica', { ...backup, history: [{ ...result, finalScore: NaN }] }],
  ])('rejeita %s', (_, data) => expect(isBackup(data)).toBe(false));
  it('gera um backup que passa na validação', () => {
    const created = createBackup({ players: backup.players, chosenHistory: backup.chosenHistory, history: [result] });
    expect(isBackup(JSON.parse(JSON.stringify(created)))).toBe(true);
  });
});
