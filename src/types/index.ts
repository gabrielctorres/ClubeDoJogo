export interface Player { id: string; name: string }
export interface Vote { playerId: string; gameId: string; points: number }
export interface GameEntry {
  id: string;
  name: string;
  nominatedBy: string[];
  freeToPlay: boolean;
  steamGreen: boolean;
  /** Roda em emulador (jogo retrô ou de console). */
  emulator: boolean;
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
  /** Retrato completo da rodada. Ausente em resultados antigos. */
  report?: RoundReport;
}
export interface ReportVote { player: Player; points: number }
export interface ReportGame {
  id: string;
  name: string;
  nominatedBy: Player[];
  freeToPlay: boolean;
  steamGreen: boolean;
  emulator: boolean;
  ownedBy: Player[];
  votes: ReportVote[];
  accessibilityScore: number;
  voteScore: number;
  effectScore: number;
  finalScore: number;
  probability: number;
}
/** Tudo o que aconteceu na rodada, com os nomes da época, para o relatório do histórico. */
export interface RoundReport {
  participants: Player[];
  /** Quem ficou sem indicar por ter vencido no mês anterior. */
  blockedNominators: Player[];
  games: ReportGame[];
  category: string | null;
  ability: AbilityId | null;
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
  /** Quem indicou o vencedor da rodada anterior: neste mês só vota. */
  blockedNominatorIds: string[];
  weightedWinnerId?: string;
}
