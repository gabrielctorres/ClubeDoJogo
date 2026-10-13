import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AbilityId, CardsRule, GameEntry, OptionalRules, Player, RandomCategoryRule, Round, RoundResult, Stage, Vote } from '../types';
import { calculateWeightedWinner } from '../services/weightedRandom';
import { calculatePlayerVotePoints, updateGameScores } from '../services/scoring';

const id = () => crypto.randomUUID();
const emptyRules = (): OptionalRules => ({ randomCategory: { enabled:false, category:null, rerollsUsed:0 }, cards: { enabled:false, options:[], selected:null } });
const normalizeRound = (round?: Partial<Round>): Round | undefined => { if (!round) return undefined; const oldCategory = round.optionalRules?.randomCategory as Partial<Round['optionalRules']['randomCategory']> & { rerollUsed?: boolean }; return { ...round as Round, optionalRules: { randomCategory: { enabled:oldCategory?.enabled??false, category:oldCategory?.category??null, drawnCategories:oldCategory?.drawnCategories??(oldCategory?.category?[oldCategory.category]:[]), rerollsUsed:oldCategory?.rerollsUsed??(oldCategory?.rerollUsed?1:0) }, cards: { enabled:round.optionalRules?.cards?.enabled??false, options:round.optionalRules?.cards?.options??[], selected:round.optionalRules?.cards?.selected??null } }, extraGameUsed:round.extraGameUsed??false, usedEffects:round.usedEffects??[] }; };
interface ClubState { players: Player[]; chosenHistory: string[]; round?: Round; history: RoundResult[]; addPlayer:(name:string)=>void; removePlayer:(playerId:string)=>void; updatePlayer:(playerId:string,name:string)=>void; prepareRound:()=>void; startRound:(ids:string[])=>void; setRandomCategory:(patch:Partial<RandomCategoryRule>)=>void; setCardsRule:(patch:Partial<CardsRule>)=>void; setAbilityOptions:(options:AbilityId[])=>void; selectAbility:(id:AbilityId)=>void; addNomination:(name:string,playerId:string)=>void; choosePlayer:()=>void; updateGame:(gameId:string,patch:Partial<GameEntry>)=>void; adjustGameScore:(gameId:string,delta:number,effect:string)=>void; transferPoint:(fromId:string,toId:string)=>void; markEffect:(effect:string)=>void; vote:(vote:Vote)=>void; setStage:(stage:Stage)=>void; setCurrentIndex:(n:number)=>void; spinWinner:()=>void; finishRound:()=>void; resetRound:()=>void; importBackup:(data:unknown)=>boolean }
interface ClubBackup { version:1; exportedAt:string; players:Player[]; chosenHistory:string[]; history:RoundResult[] }
const isBackup = (data:unknown):data is ClubBackup => {
  if (!data || typeof data !== 'object') return false;
  const value = data as Record<string, unknown>;
  const isPlayer = (entry: unknown): entry is Player => !!entry && typeof entry === 'object'
    && typeof (entry as Player).id === 'string' && typeof (entry as Player).name === 'string';
  const isResult = (entry: unknown): entry is RoundResult => {
    if (!entry || typeof entry !== 'object') return false;
    const result = entry as RoundResult;
    return typeof result.id === 'string' && typeof result.date === 'string'
      && !Number.isNaN(Date.parse(result.date)) && typeof result.winnerGameId === 'string'
      && typeof result.winnerGameName === 'string' && Array.isArray(result.nominatedBy)
      && result.nominatedBy.every(name => typeof name === 'string')
      && typeof result.chosenPlayerId === 'string' && typeof result.chosenPlayerName === 'string'
      && Number.isFinite(result.finalScore) && Number.isFinite(result.probability);
  };
  return value.version === 1 && Array.isArray(value.players) && value.players.every(isPlayer)
    && Array.isArray(value.chosenHistory) && value.chosenHistory.every(id => typeof id === 'string')
    && Array.isArray(value.history) && value.history.every(isResult);
};
export const useClubStore = create<ClubState>()(persist((set) => ({
  players:[], chosenHistory:[], history:[],
  addPlayer:name=>set(s=>{const normalized=name.trim();if(s.round?.chosenPlayerId||!normalized||s.players.some(p=>p.name.toLowerCase()===normalized.toLowerCase()))return s;return{players:[...s.players,{id:id(),name:normalized}]};}),
  removePlayer:playerId=>set(s=>s.round?.chosenPlayerId?s:{players:s.players.filter(p=>p.id!==playerId)}),
  updatePlayer:(playerId,name)=>set(s=>{const normalized=name.trim();if(s.round?.chosenPlayerId||!normalized||s.players.some(p=>p.id!==playerId&&p.name.toLowerCase()===normalized.toLowerCase()))return s;return{players:s.players.map(p=>p.id===playerId?{...p,name:normalized}:p)};}),
  prepareRound:()=>set(s=>s.round?s:{round:{id:id(),participantIds:[],games:[],chosenPlayerId:'',chosenPlayerName:'',stage:'optionalRules',currentIndex:0,optionalRules:emptyRules(),extraGameUsed:false,usedEffects:[]}}),
  startRound:participantIds=>set(s=>{if(s.round?.chosenPlayerId)return s;const uniqueIds=[...new Set(participantIds)].filter(playerId=>s.players.some(player=>player.id===playerId));if(uniqueIds.length<2)return s;return{round:{id:s.round?.id??id(),participantIds:uniqueIds,games:[],chosenPlayerId:'',chosenPlayerName:'',stage:'chosen',currentIndex:0,optionalRules:s.round?.optionalRules??emptyRules(),extraGameUsed:false,usedEffects:[]}};}),
  setRandomCategory:patch=>set(s=>({round:s.round?{...s.round,optionalRules:{...s.round.optionalRules,randomCategory:{...s.round.optionalRules.randomCategory,...patch}}}:undefined})),
  setCardsRule:patch=>set(s=>({round:s.round?{...s.round,optionalRules:{...s.round.optionalRules,cards:{...s.round.optionalRules.cards,...patch}}}:undefined})),
  setAbilityOptions:options=>set(s=>({round:s.round?{...s.round,optionalRules:{...s.round.optionalRules,cards:{...s.round.optionalRules.cards,options}}}:undefined})),
  selectAbility:id=>set(s=>({round:s.round?{...s.round,optionalRules:{...s.round.optionalRules,cards:{...s.round.optionalRules.cards,selected:id}}}:undefined})),
  addNomination:(name,playerId)=>set(s=>{if(!s.round)return s;const normalized=name.trim().toLowerCase();const existing=s.round.games.find(g=>g.name.toLowerCase()===normalized);const games=existing?s.round.games.map(g=>g.id===existing.id&&!g.nominatedBy.includes(playerId)?{...g,nominatedBy:[...g.nominatedBy,playerId]}:g):[...s.round.games,{id:id(),name:name.trim(),nominatedBy:[playerId],freeToPlay:false,steamGreen:false,ownedBy:[],votes:[],accessibilityScore:0,voteScore:0,finalScore:0}];return{round:{...s.round,games,currentIndex:s.round.currentIndex+1,extraGameUsed:s.round.extraGameUsed||s.round.currentIndex>=s.round.participantIds.length}};}),
  choosePlayer:()=>set(s=>{if(!s.round)return s;const pool=s.players.filter(p=>s.round!.participantIds.includes(p.id));if(!pool.length)return s;const eligible=pool.filter(p=>!s.chosenHistory.includes(p.id));const candidates=eligible.length?eligible:pool;const values=new Uint32Array(1);crypto.getRandomValues(values);const player=candidates[values[0]%candidates.length];const nextStage=s.round.optionalRules.cards.enabled?'abilities':s.round.optionalRules.randomCategory.enabled?'theme':'nominations';return{chosenHistory:eligible.length?[...s.chosenHistory,player.id]:[player.id],round:{...s.round,chosenPlayerId:player.id,chosenPlayerName:player.name,stage:nextStage,currentIndex:0}};}),
  updateGame:(gameId,patch)=>set(s=>({round:s.round?{...s.round,games:s.round.games.map(g=>g.id===gameId?updateGameScores({...g,...patch}):g)}:undefined})),
  adjustGameScore:(gameId,delta,effect)=>set(s=>({round:s.round&&!s.round.usedEffects.includes(effect)?{...s.round,usedEffects:[...s.round.usedEffects,effect],games:s.round.games.map(g=>g.id===gameId?{...g,finalScore:g.finalScore+delta}:g)}:s.round})),
  transferPoint:(fromId,toId)=>set(s=>({round:s.round&&!s.round.usedEffects.includes('point-pix')?{...s.round,usedEffects:[...s.round.usedEffects,'point-pix'],games:s.round.games.map(g=>g.id===fromId?{...g,finalScore:g.finalScore-1}:g.id===toId?{...g,finalScore:g.finalScore+1}:g)}:s.round})),
  markEffect:effect=>set(s=>({round:s.round&&!s.round.usedEffects.includes(effect)?{...s.round,usedEffects:[...s.round.usedEffects,effect]}:s.round})),
  vote:vote=>set(s=>{
    if (!s.round || !s.round.participantIds.includes(vote.playerId)
      || !s.round.games.some(game => game.id === vote.gameId)
      || s.round.games.some(game => game.votes.some(existing => existing.playerId === vote.playerId))) return s;
    return {round:{...s.round,games:s.round.games.map(g=>g.id===vote.gameId?updateGameScores({...g,votes:[...g.votes,{...vote,points:calculatePlayerVotePoints(s.round!,vote.playerId)}]}):g),currentIndex:s.round.currentIndex+1}};
  }),
  setStage:stage=>set(s=>({round:s.round?{...s.round,stage,currentIndex:0}:undefined})), setCurrentIndex:n=>set(s=>({round:s.round?{...s.round,currentIndex:n}:undefined})),
  spinWinner:()=>set(s=>s.round?.games.length?{round:{...s.round,weightedWinnerId:calculateWeightedWinner(s.round.games),stage:'winner'}}:s),
  finishRound:()=>set(s=>{if(!s.round||!s.round.weightedWinnerId)return s;const game=s.round.games.find(g=>g.id===s.round!.weightedWinnerId);if(!game)return s;const chosen=s.players.find(p=>p.id===s.round!.chosenPlayerId);const total=s.round.games.reduce((a,g)=>a+Math.max(0,g.finalScore),0);const result:RoundResult={id:s.round.id,date:new Date().toISOString(),winnerGameId:game.id,winnerGameName:game.name,nominatedBy:game.nominatedBy.map(pid=>s.players.find(p=>p.id===pid)?.name||pid),chosenPlayerId:s.round.chosenPlayerId,chosenPlayerName:chosen?.name??s.round.chosenPlayerName,finalScore:game.finalScore,probability:total?Math.max(0,game.finalScore)/total:0};return{history:[result,...s.history],round:undefined};}),
  resetRound:()=>set({round:undefined}), importBackup:data=>{if(!isBackup(data))return false;set({players:data.players,chosenHistory:data.chosenHistory,history:data.history,round:undefined});return true;}
}),{name:'clube-do-jogo',merge:(persisted,current)=>{const saved=persisted as Partial<ClubState>;return {...current,...saved,round:normalizeRound(saved.round)};}}));
