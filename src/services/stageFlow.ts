import type { Round, Stage } from '../types';

type FlowRound = Pick<Round, 'stage' | 'optionalRules'>;

/** Única fonte da ordem das etapas, das rotas e dos rótulos. */
export const STAGES: readonly { stage: Stage; path: string; label: string }[] = [
  { stage: 'optionalRules', path: '/optional-rules', label: 'Regras opcionais' },
  { stage: 'players', path: '/players', label: 'Jogadores' },
  { stage: 'chosen', path: '/chosen', label: 'Escolhido' },
  { stage: 'abilities', path: '/abilities', label: 'Habilidades' },
  { stage: 'theme', path: '/theme', label: 'Tema' },
  { stage: 'nominations', path: '/nominations', label: 'Escolha de jogos' },
  { stage: 'accessibility', path: '/accessibility', label: 'Acesso' },
  { stage: 'voting', path: '/voting', label: 'Votação' },
  { stage: 'score', path: '/score', label: 'Pontos' },
  { stage: 'roulette', path: '/roulette', label: 'Roleta' },
  { stage: 'winner', path: '/winner', label: 'Final' },
];

/** Etapas que podem ser reabertas pelo "Voltar" sem corromper a rodada. */
const REVISITABLE: ReadonlySet<Stage> = new Set(['optionalRules', 'accessibility']);

export const stagePath = (stage: Stage) => STAGES.find(item => item.stage === stage)!.path;
export const stageLabel = (stage: Stage) => STAGES.find(item => item.stage === stage)!.label;

export function isStageActive(stage: Stage, round: Pick<Round, 'optionalRules'>) {
  if (stage === 'abilities') return round.optionalRules.cards.enabled;
  if (stage === 'theme') return round.optionalRules.randomCategory.enabled;
  return true;
}

export const getActiveStages = (round: Pick<Round, 'optionalRules'>): Stage[] =>
  STAGES.map(item => item.stage).filter(stage => isStageActive(stage, round));

export function getNextStage(round: FlowRound): Stage | undefined {
  const stages = getActiveStages(round);
  return stages[stages.indexOf(round.stage) + 1];
}

export function getPreviousStage(round: FlowRound): Stage | undefined {
  const stages = getActiveStages(round);
  const index = stages.indexOf(round.stage);
  return index > 0 ? stages[index - 1] : undefined;
}

export function canGoBack(round: FlowRound) {
  const previous = getPreviousStage(round);
  return Boolean(previous && REVISITABLE.has(previous));
}

/** Número da etapa (1-based) contando apenas as etapas ativas na rodada. */
export const stageNumber = (round: Pick<Round, 'optionalRules'>, stage: Stage) =>
  getActiveStages(round).indexOf(stage) + 1;

/** O Escolhido ainda pode indicar o jogo extra da carta "Só Mais Um, Confia". */
export const awaitingExtraGame = (round: Pick<Round, 'currentIndex' | 'participantIds' | 'optionalRules' | 'extraGameUsed'>) =>
  round.currentIndex >= round.participantIds.length
  && round.optionalRules.cards.enabled
  && round.optionalRules.cards.selected === 'one-more'
  && !round.extraGameUsed;
