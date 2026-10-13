import type { AbilityId } from '../types';
import { secureRandomInt } from './weightedRandom';

export interface Ability { id: AbilityId; name: string; description: string }

export const abilities: Ability[] = [
  { id: 'democracy', name: 'Democracia Premium', description: 'O voto do Escolhido vale 2 pontos em vez de 1.' },
  { id: 'fun-inspector', name: 'Fiscal de Diversão', description: 'Aplica -3 pontos em um jogo antes da roleta.' },
  { id: 'one-more', name: 'Só Mais Um, Confia', description: 'Permite adicionar mais 1 jogo à rodada.' },
  { id: 'humility', name: 'Humildade Nunca Foi Meu Forte', description: 'O Escolhido vota no próprio jogo.' },
  { id: 'bad-rule', name: 'Essa Regra Tá Uma Bosta', description: 'Ganha 1 reroll extra do tema, se a categoria estiver ativa.' },
  { id: 'pretend', name: 'Finge Que Não Viu', description: 'Sorteia novamente uma habilidade e escolha qual das duas usar.' },
  { id: 'point-pix', name: 'Pix de Pontinho', description: 'Tira 1 ponto de um jogo e adiciona a outro.' },
  { id: 'coin-flip', name: 'Vai Dar Merda', description: 'Escolha um jogo: cara dá +3, coroa dá -2.' },
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
