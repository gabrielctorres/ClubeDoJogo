import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useClubStore } from '../store/clubStore';
import { calculateWinProbability } from '../services/weightedRandom';
import { Button, Confetti } from '../components/UI';

const rise = (delay: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, type: 'spring', stiffness: 260, damping: 20 } } as const);

export default function Winner() {
  const { round, players, finishRound } = useClubStore();
  const nav = useNavigate();
  if (!round) return null;
  const game = round.games.find(g => g.id === round.weightedWinnerId);
  if (!game) return null;
  const probability = calculateWinProbability(round.games, game.id);
  return <div className="winner center-step">
    <Confetti/>
    <motion.div initial={{ scale: 0, rotate: -200, y: -80 }} animate={{ scale: 1, rotate: 0, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 11 }}>
      <motion.div className="winner-trophy" animate={{ rotate: [0, -8, 8, 0] }} transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatDelay: 2.2 }}>
        <Trophy size={52}/>
      </motion.div>
    </motion.div>
    <motion.p className="eyebrow" {...rise(0.3)}>🎉 JOGO DO MÊS 🎉</motion.p>
    <motion.h1 initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45, type: 'spring', stiffness: 300, damping: 10 }}>{game.name}</motion.h1>
    <div className="winner-meta">
      <motion.p {...rise(0.7)}>Indicado por <strong>{game.nominatedBy.map(id => players.find(p => p.id === id)?.name).join(', ')}</strong></motion.p>
      <motion.p {...rise(0.8)}><strong>{game.finalScore} pontos</strong> · {(probability * 100).toFixed(0)}% de chance</motion.p>
      <motion.p {...rise(0.9)}>Escolhido: <strong>{round.chosenPlayerName}</strong></motion.p>
    </div>
    <motion.div {...rise(1.05)}>
      <Button sound="win" onClick={() => { finishRound(); nav('/history'); }}>Finalizar rodada <span>✓</span></Button>
    </motion.div>
  </div>;
}
