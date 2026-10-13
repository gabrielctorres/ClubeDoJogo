import type { AbilityId } from '../types';

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
  return abilities.filter(a => !excluded.includes(a.id)).sort(() => Math.random() - .5).slice(0, amount);
}

export function getAbility(id: AbilityId | null) { return abilities.find(a => a.id === id); }
