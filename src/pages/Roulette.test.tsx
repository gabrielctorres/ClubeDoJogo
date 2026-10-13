import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PieWheel } from './Roulette';
import type { GameEntry } from '../types';

const games = (scores: number[]) => scores.map((finalScore, index) => ({
  id: String(index), name: `Jogo com nome longo ${index}`, finalScore,
} as GameEntry));

it('preserva as letras e o nome completo acessível', () => {
  const markup = renderToStaticMarkup(<PieWheel games={games([1, 1, 1])} spinning={false}/>);
  expect(markup).not.toContain('textLength');
  expect(markup).not.toContain('lengthAdjust');
  expect(markup).toContain('<title>Jogo com nome longo 0</title>');
});

it('desenha um círculo inteiro quando só um jogo tem chance', () => {
  const markup = renderToStaticMarkup(<PieWheel games={games([2, 0, -1])} spinning={false}/>);
  expect(markup).toContain('r="82"');
  expect(markup).not.toContain('<path');
  expect(markup).not.toContain('NaN');
});

it('distribui as fatias igualmente quando todos estão sem pontos', () => {
  const markup = renderToStaticMarkup(<PieWheel games={games([0, 0, 0])} spinning={false}/>);
  expect(markup.match(/<path /g)).toHaveLength(3);
  expect(markup).not.toContain('NaN');
});
