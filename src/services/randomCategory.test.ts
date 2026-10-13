import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchRandomGameCategory, getAvailableCategories, getFallbackCategory, isAllowedCategory } from './randomCategory';

afterEach(() => vi.unstubAllGlobals());

describe('sorteio de temas', () => {
  it('remove duplicatas e temas já sorteados sem distinguir maiúsculas', () => {
    expect(getAvailableCategories(['RPG', ' rpg ', 'Horror', 'Open-World', 'Open World'], ['HORROR']))
      .toEqual(['RPG', 'Open-World']);
  });
  it.each(['Multiplayer', 'Online Multiplayer RPG', 'Multi-player', 'Multijogador', 'MMORPG', 'MMOARPG', 'MOBA', 'Co-op', 'Cooperative', 'Cooperativo', 'PvP', 'Battle Royale'])('exclui %s', category => {
    expect(isAllowedCategory(category)).toBe(false);
  });
  it('sorteia somente categorias únicas, permitidas e novas da API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [
      { genre: 'RPG', tags: 'Multiplayer, Horror' }, { genre: 'RPG' }, { genre: 'MMORPG' },
    ] }));
    expect(await fetchRandomGameCategory(['rpg'])).toBe('Horror');
  });
  it('permite usar o fallback quando a API só oferece temas excluídos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [{ genre: 'Multiplayer' }] }));
    await expect(fetchRandomGameCategory()).rejects.toThrow();
  });
  it('não repete temas no fallback durante os cinco sorteios possíveis da rodada', () => {
    const drawn: string[] = [];
    for (let index = 0; index < 5; index++) {
      const category = getFallbackCategory(drawn);
      expect(drawn).not.toContain(category);
      expect(isAllowedCategory(category)).toBe(true);
      drawn.push(category);
    }
  });
});
