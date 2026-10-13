import { describe, expect, it } from 'vitest';
import { awaitingExtraGame, canGoBack, getActiveStages, getNextStage, getPreviousStage, stageNumber, STAGES } from './stageFlow';
import type { AbilityId, Stage } from '../types';

const round = (stage: Stage, cards = false, theme = false, selected: AbilityId | null = null) => ({
  stage,
  optionalRules: {
    cards: { enabled: cards, options: [], selected },
    randomCategory: { enabled: theme, category: null, rerollsUsed: 0 },
  },
});

describe('fluxo de etapas', () => {
  it('pula habilidades e tema quando as regras opcionais estão desligadas', () => {
    expect(getActiveStages(round('chosen'))).not.toContain('abilities');
    expect(getActiveStages(round('chosen'))).not.toContain('theme');
    expect(getNextStage(round('chosen'))).toBe('nominations');
    expect(getPreviousStage(round('nominations'))).toBe('chosen');
  });
  it('inclui habilidades e tema quando ativos', () => {
    expect(getNextStage(round('chosen', true, true))).toBe('abilities');
    expect(getNextStage(round('abilities', true, true))).toBe('theme');
    expect(getNextStage(round('theme', true, true))).toBe('nominations');
    expect(getNextStage(round('chosen', false, true))).toBe('theme');
  });
  it('não tem etapa depois do vencedor nem antes das regras opcionais', () => {
    expect(getNextStage(round('winner'))).toBeUndefined();
    expect(getPreviousStage(round('optionalRules'))).toBeUndefined();
  });
  it('numera as fases conforme as etapas ativas', () => {
    expect(stageNumber(round('chosen'), 'nominations')).toBe(4);
    expect(stageNumber(round('chosen', true, true), 'nominations')).toBe(6);
    expect(stageNumber(round('chosen'), 'winner')).toBe(getActiveStages(round('chosen')).length);
  });
  it('só permite voltar para etapas revisitáveis', () => {
    const allowed = STAGES.map(s => s.stage).filter(stage => canGoBack(round(stage, true, true)));
    expect(allowed).toEqual(['players', 'voting']);
  });
});

describe('jogo extra', () => {
  const base = { participantIds: ['a', 'b'], currentIndex: 2, extraGameUsed: false, ...round('nominations', true, false, 'one-more') };
  it('espera o jogo extra só com a carta "Só Mais Um" ativa e não usada', () => {
    expect(awaitingExtraGame(base)).toBe(true);
    expect(awaitingExtraGame({ ...base, extraGameUsed: true })).toBe(false);
    expect(awaitingExtraGame({ ...base, currentIndex: 1 })).toBe(false);
    expect(awaitingExtraGame({ ...base, ...round('nominations', false, false, 'one-more') })).toBe(false);
  });
});
