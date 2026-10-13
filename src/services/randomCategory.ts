const GAMES_API = 'https://www.freetogame.com/api/games';

type FreeToGameEntry = { genre?: string; tags?: string };

const fallbackCategories = ['Horror', 'Survival', 'Turn-Based', 'RPG', 'Indie', 'Pixel Art', 'Open World', 'Puzzle', 'Platformer', 'Racing', 'Strategy', 'Adventure'];

const categoryKey = (category: string) => category.trim().toLowerCase().replace(/[\s_-]+/g, ' ');
export const isAllowedCategory = (category: string) => Boolean(category.trim()) &&
  !/(multi[\s-]*player|multijogador|\bmmo|\bmoba\b|co[\s-]*op\b|cooperativ|massively|\bpvp\b|battle[\s-]*royale)/i.test(category);

export function getAvailableCategories(categories: string[], excluded: string[] = []): string[] {
  const seen = new Set(excluded.map(categoryKey));
  return categories.filter(category => {
    const key = categoryKey(category);
    if (!isAllowedCategory(category) || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(category => category.trim());
}

export async function fetchRandomGameCategory(excluded: string[] = []): Promise<string> {
  const response = await fetch(GAMES_API);
  if (!response.ok) throw new Error('Não foi possível buscar uma categoria.');
  const games = await response.json() as FreeToGameEntry[];
  const categories = getAvailableCategories(games.flatMap(game => [game.genre, ...(game.tags?.split(',').map(tag => tag.trim()) ?? [])])
    .filter((category): category is string => typeof category === 'string'), excluded);
  if (!categories.length) throw new Error('A API não retornou categorias.');
  return categories[Math.floor(Math.random() * categories.length)];
}

export function getFallbackCategory(excluded: string[] = []): string {
  const categories = getAvailableCategories(fallbackCategories, excluded);
  if (!categories.length) throw new Error('Não há novos temas disponíveis.');
  return categories[Math.floor(Math.random() * categories.length)];
}
