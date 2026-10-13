import type { Player } from '../types';
export const getEligibleChosenPlayers = (players: Player[], history: string[]) => { const eligible = players.filter(p => !history.includes(p.id)); return eligible.length ? eligible : players; };
