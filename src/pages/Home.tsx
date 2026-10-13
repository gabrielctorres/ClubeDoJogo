import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Play, Sparkles, Users } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { Button, Card } from '../components/UI';
import { CountUp } from '../components/Feel';

const rise = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, type: 'spring', stiffness: 260, damping: 20 } } as const);

export default function Home() {
  const { history, round } = useClubStore();
  const last = history[0];
  return <div className="home">
    <div className="hero">
      {/* O wrapper faz a entrada; o .hero-orb fica livre para a animação de flutuar do CSS. */}
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}>
        <div className="hero-orb">🎲</div>
      </motion.div>
      <motion.p className="eyebrow" {...rise(0.15)}>UMA NOVA AVENTURA COMEÇA</motion.p>
      <motion.h1 {...rise(0.25)}>Clube do<br/><span>Jogo</span></motion.h1>
      <motion.p className="lead" {...rise(0.35)}>Escolham juntos o próximo jogo inesquecível.</motion.p>
    </div>
    <motion.div className="actions" {...rise(0.45)}>
      {round
        ? <Link to="/round"><Button sound="whoosh"><Play size={20}/> Continuar rodada</Button></Link>
        : <Link to="/optional-rules"><Button sound="whoosh"><Sparkles size={20}/> Nova rodada</Button></Link>}
      <Link to="/history"><Button variant="secondary"><History size={20}/> Histórico</Button></Link>
    </motion.div>
    <div className="stats">
      <Card delay={0.55}><strong><CountUp value={history.length}/></strong><span>rodadas</span></Card>
      <Card delay={0.62}><strong><CountUp value={new Set(history.map(h => h.winnerGameName)).size}/></strong><span>jogos escolhidos</span></Card>
      <Card delay={0.69}><strong>{last?.winnerGameName || '—'}</strong><span>último vencedor</span></Card>
    </div>
    <div className="tip"><Users size={20}/><span>Reúna a galera e deixe a sorte decidir.</span></div>
  </div>;
}
