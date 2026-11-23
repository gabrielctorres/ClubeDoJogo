import type { GameEntry } from '../types';

export function secureRandomInt(max: number) {
  if (max <= 0) return 0;
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

/** Peso mínimo de qualquer jogo na roleta: mesmo com pontuação negativa, todos têm chance. */
export const MIN_WEIGHT = 1;

/** Peso do jogo na roleta. Usado pelo sorteio, pelas chances exibidas e pelas fatias. */
export const rouletteWeight = (game: Pick<GameEntry, 'finalScore'>) => Math.max(MIN_WEIGHT, game.finalScore);

const totalWeight = (games: Pick<GameEntry, 'finalScore'>[]) => games.reduce((sum, game) => sum + rouletteWeight(game), 0);

export function calculateWeightedWinner(games: GameEntry[]): string {
  if (!games.length) throw new Error('Nenhum jogo disponível');
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  let cursor = (values[0] / 4294967296) * totalWeight(games);
  for (const game of games) {
    cursor -= rouletteWeight(game);
    if (cursor < 0) return game.id;
  }
  return games.at(-1)!.id;
}

/** Chance do jogo na roleta, com as mesmas regras de `calculateWeightedWinner`. */
export function calculateWinProbability(games: Pick<GameEntry, 'id' | 'finalScore'>[], gameId: string) {
  const game = games.find(item => item.id === gameId);
  return game ? rouletteWeight(game) / totalWeight(games) : 0;
}
