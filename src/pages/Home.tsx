import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Play, Sparkles, Users } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { Button, Card } from '../components/UI';

export default function Home() {
  const { history, round } = useClubStore();
  const last = history[0];
  return <div className="home"><div className="hero"><motion.div initial={{scale:.8,rotate:-8}} animate={{scale:1,rotate:0}} className="hero-orb">🎲</motion.div><p className="eyebrow">UMA NOVA AVENTURA COMEÇA</p><h1>Clube do<br/><span>Jogo</span></h1><p className="lead">Escolham juntos o próximo jogo inesquecível.</p></div><div className="actions">{round?<Link to="/round"><Button><Play size={20}/> Continuar rodada</Button></Link>:<Link to="/optional-rules"><Button><Sparkles size={20}/> Nova rodada</Button></Link>}<Link to="/history"><Button variant="secondary"><History size={20}/> Histórico</Button></Link></div><div className="stats"><Card><strong>{history.length}</strong><span>rodadas</span></Card><Card><strong>{new Set(history.map(h=>h.winnerGameName)).size}</strong><span>jogos escolhidos</span></Card><Card><strong>{last?.winnerGameName||'—'}</strong><span>último vencedor</span></Card></div><div className="tip"><Users size={20}/><span>Reúna a galera e deixe a sorte decidir.</span></div></div>;
}
