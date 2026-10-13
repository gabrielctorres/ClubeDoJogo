import { motion } from 'framer-motion';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClubStore } from '../store/clubStore';
import type { Stage } from '../types';

const stages: Stage[] = ['optionalRules', 'players', 'chosen', 'abilities', 'theme', 'nominations', 'accessibility', 'voting', 'score', 'roulette', 'winner'];
const labels = ['Regras opcionais', 'Jogadores', 'Escolhido', 'Habilidades', 'Tema', 'Escolha de jogos', 'Acesso', 'Votação', 'Pontos', 'Roleta', 'Final'];

export function Layout({ children }: { children: React.ReactNode }) {
  const round = useClubStore(s => s.round);
  const reset = useClubStore(s => s.resetRound);
  const setStage = useClubStore(s => s.setStage);
  const navigate = useNavigate();
  const index = round ? stages.indexOf(round.stage) : 0;
  const previous = round && index > 0 ? stages[index - 1] : undefined;
  const paths: Record<Stage, string> = { optionalRules: '/optional-rules', players: '/players', nominations: '/nominations', chosen: '/chosen', abilities: '/abilities', theme: '/theme', accessibility: '/accessibility', voting: '/voting', score: '/score', roulette: '/roulette', winner: '/winner' };
  const goBack = () => { if (previous) { setStage(previous); navigate(paths[previous]); } };
  const leave = () => { if (confirm('Sair da rodada atual? Os dados desta rodada serão descartados.')) { reset(); navigate('/'); } };
  return <main><header><div className="brand"><span className="logo"><Trophy size={22}/></span><span>Clube do Jogo</span></div>{round && <div className="header-actions">{previous && <button className="back-stage" onClick={goBack}><ArrowLeft size={17}/> Voltar</button>}<button className="exit-stage" onClick={leave}>Sair da rodada</button></div>}</header>{round && <div className="progress-wrap"><div className="progress-label"><span>{labels[index]}</span><span>{index + 1}/{stages.length}</span></div><div className="progress"><motion.div animate={{ width: `${((index + 1) / stages.length) * 100}%` }}/></div></div>}<section className="page">{children}</section></main>;
}
