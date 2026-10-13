export interface Player { id: string; name: string }
export interface Vote { playerId: string; gameId: string; points: number }
export interface GameEntry {
  id: string;
  name: string;
  nominatedBy: string[];
  freeToPlay: boolean;
  steamGreen: boolean;
  ownedBy: string[];
  votes: Vote[];
  accessibilityScore: number;
  voteScore: number;
  /** Pontos vindos de habilidades (Fiscal, Pix, moeda). Preservados quando o placar é recalculado. */
  effectScore: number;
  finalScore: number;
}
export interface RoundResult {
  id: string;
  date: string;
  winnerGameId: string;
  winnerGameName: string;
  /** Nomes no momento da rodada, para exibição. */
  nominatedBy: string[];
  /** IDs de quem indicou. Ausente em resultados antigos. */
  nominatedByIds?: string[];
  chosenPlayerId: string;
  chosenPlayerName: string;
  finalScore: number;
  probability: number;
}
export type AbilityId = 'democracy'|'fun-inspector'|'one-more'|'humility'|'bad-rule'|'pretend'|'point-pix'|'coin-flip';
export interface RandomCategoryRule { enabled: boolean; category: string | null; rerollsUsed: number; drawnCategories?: string[] }
export interface CardsRule { enabled: boolean; options: AbilityId[]; selected: AbilityId | null; replacement?: AbilityId | null }
export interface OptionalRules { randomCategory: RandomCategoryRule; cards: CardsRule }
export type Stage = 'optionalRules'|'players'|'chosen'|'abilities'|'theme'|'nominations'|'accessibility'|'voting'|'score'|'roulette'|'winner';
export interface Round {
  id: string;
  participantIds: string[];
  games: GameEntry[];
  chosenPlayerId: string;
  chosenPlayerName: string;
  stage: Stage;
  currentIndex: number;
  optionalRules: OptionalRules;
  extraGameUsed: boolean;
  usedEffects: string[];
  weightedWinnerId?: string;
}
