import type { GameEntry } from '../types';

export function secureRandomInt(max: number) {
  if (max <= 0) return 0;
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

const weight = (game: Pick<GameEntry, 'finalScore'>) => Math.max(0, game.finalScore);

export function calculateWeightedWinner(games: GameEntry[]): string {
  if (!games.length) throw new Error('Nenhum jogo disponível');
  const total = games.reduce((sum, game) => sum + weight(game), 0);
  if (!total) return games[secureRandomInt(games.length)].id;
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  let cursor = (values[0] / 4294967296) * total;
  for (const game of games) {
    cursor -= weight(game);
    if (cursor < 0) return game.id;
  }
  return games.at(-1)!.id;
}

/** Chance do jogo na roleta, com as mesmas regras de `calculateWeightedWinner`. */
export function calculateWinProbability(games: Pick<GameEntry, 'id' | 'finalScore'>[], gameId: string) {
  const game = games.find(item => item.id === gameId);
  if (!game) return 0;
  const total = games.reduce((sum, item) => sum + weight(item), 0);
  return total ? weight(game) / total : 1 / games.length;
}
