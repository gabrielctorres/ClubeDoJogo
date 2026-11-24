import type { AbilityId } from '../types';
import { secureRandomInt } from './weightedRandom';
import { CHOSEN_VOTE_POINTS, VOTE_POINTS } from './scoring';

/** Pontos que cada carta aplica. Mudam `effectScore`, nunca `finalScore` direto. */
export const EFFECT_POINTS = { funInspector: -3, pointPix: 1, coinHeads: 3, coinTails: -2 } as const;

export interface Ability { id: AbilityId; name: string; description: string }

export const abilities: Ability[] = [
  { id: 'democracy', name: 'Democracia Premium', description: `O voto do Escolhido vale ${CHOSEN_VOTE_POINTS} pontos em vez de ${VOTE_POINTS}.` },
  { id: 'fun-inspector', name: 'Fiscal de Diversão', description: `Aplica ${EFFECT_POINTS.funInspector} pontos em um jogo antes da roleta.` },
  { id: 'one-more', name: 'Só Mais Um, Confia', description: 'Permite adicionar mais 1 jogo à rodada.' },
  { id: 'humility', name: 'Humildade Nunca Foi Meu Forte', description: 'O Escolhido vota no próprio jogo.' },
  { id: 'bad-rule', name: 'Essa Regra Tá Uma Bosta', description: 'Ganha 1 reroll extra do tema, se a categoria estiver ativa.' },
  { id: 'pretend', name: 'Finge Que Não Viu', description: 'Sorteia novamente uma habilidade e escolha qual das duas usar.' },
  { id: 'point-pix', name: 'Pix de Pontinho', description: `Tira ${EFFECT_POINTS.pointPix} ponto de um jogo e adiciona a outro.` },
  { id: 'coin-flip', name: 'Vai Dar Merda', description: `Escolha um jogo: cara dá +${EFFECT_POINTS.coinHeads}, coroa dá ${EFFECT_POINTS.coinTails}.` },
];

export function randomAbilities(amount: number, excluded: AbilityId[] = []) {
  const pool = abilities.filter(ability => !excluded.includes(ability.id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, amount);
}

export function getAbility(id: AbilityId | null | undefined) { return abilities.find(a => a.id === id); }
