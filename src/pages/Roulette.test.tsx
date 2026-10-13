import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { getSlices, getWinnerRotation, PieWheel, sliceAtPointer } from './Roulette';
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

it('para a roleta com o ponteiro sobre a fatia vencedora', () => {
  const slices = getSlices(games([5, 0, 3, -2, 2]));
  for (const slice of slices.filter(item => item.sweep > 0)) {
    for (const jitter of [-0.35, 0, 0.35]) {
      for (const start of [0, 137, 1000]) {
        const rotation = start + getWinnerRotation(slices, slice.id, 6, jitter) - (start % 360);
        expect(sliceAtPointer(slices, rotation)).toBe(slice.id);
        expect(rotation - start).toBeGreaterThan(5 * 360);
      }
    }
  }
});

it('ignora fatias sem chance ao apontar', () => {
  const slices = getSlices(games([0, 4, 0]));
  expect(sliceAtPointer(slices, 0)).toBe('1');
  expect(sliceAtPointer(slices, 200)).toBe('1');
});
