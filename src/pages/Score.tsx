import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, StageEyebrow } from '../components/UI';
import { CountUp, ScoreDelta } from '../components/Feel';
import { getAbility } from '../services/abilities';
import { BASE_SCORE } from '../services/scoring';
import { secureRandomInt } from '../services/weightedRandom';
import { useClubStore } from '../store/clubStore';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { sfx } from '../feel/sound';

const COIN_FLIP_MS = 1100;

interface CoinFlip { name: string; heads: boolean; done: boolean }

export default function Score() {
  const { round, adjustGameScore, transferPoint } = useClubStore();
  const advance = useAdvanceStage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [coin, setCoin] = useState<CoinFlip | null>(null);
  const coinTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(coinTimer.current), []);
  if (!round) return null;
  const sorted = [...round.games].sort((a, b) => b.finalScore - a.finalScore);
  const max = Math.max(...sorted.map(g => g.finalScore), 1);
  const cards = round.optionalRules.cards;
  const chosen = cards.enabled ? cards.selected : null;
  const ability = getAbility(chosen);
  const used = (effect: string) => round.usedEffects.includes(effect);

  const flipCoin = (gameId: string, name: string) => {
    if (coin || used('coin-flip')) return;
    const heads = secureRandomInt(2) === 0;
    setCoin({ name, heads, done: false });
    sfx.whoosh();
    coinTimer.current = setTimeout(() => {
      adjustGameScore(gameId, heads ? 3 : -2, 'coin-flip');
      if (heads) sfx.win(); else sfx.minus();
      setCoin({ name, heads, done: true });
    }, COIN_FLIP_MS);
  };

  return <div>
    <StageEyebrow stage="score">RESULTADO DOS PONTOS</StageEyebrow>
    <h2>O placar está formado!</h2>
    <p>O ranking define as chances na roleta final.</p>
    {ability && <Card className="effect-panel">
      <strong>Habilidade: {ability.name}</strong>
      {chosen === 'fun-inspector' && <div className="effect-actions">
        <span>Escolha um jogo para aplicar -3 pontos.</span>
        {sorted.map(g => <Button key={g.id} variant="secondary" sound="minus" disabled={used('fun-inspector')} onClick={() => adjustGameScore(g.id, -3, 'fun-inspector')}>-3 em {g.name}</Button>)}
      </div>}
      {chosen === 'point-pix' && <div className="effect-actions">
        <span>Transfira 1 ponto entre dois jogos.</span>
        <select value={from} onChange={e => setFrom(e.target.value)}>
          <option value="">Tirar de...</option>
          {round.games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={to} onChange={e => setTo(e.target.value)}>
          <option value="">Adicionar em...</option>
          {round.games.filter(g => g.id !== from).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <Button sound="coin" disabled={!from || !to || from === to || used('point-pix')} onClick={() => transferPoint(from, to)}>Fazer Pix</Button>
      </div>}
      {chosen === 'coin-flip' && <div className="effect-actions">
        <span>Escolha um jogo e jogue a moeda.</span>
        {coin && <div className="coin-stage">
          <motion.div className="coin" initial={{ rotateY: 0, y: 0 }}
            animate={coin.done ? { rotateY: 0, y: 0, scale: [1.3, 1] } : { rotateY: 1800, y: [0, -60, 0] }}
            transition={coin.done ? { duration: 0.3 } : { duration: COIN_FLIP_MS / 1000, ease: 'easeOut' }}>
            {coin.done ? (coin.heads ? '😀' : '💀') : '?'}
          </motion.div>
          {coin.done && <motion.span className="coin-result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {coin.heads ? 'Cara: +3' : 'Coroa: -2'} pontos em {coin.name}
          </motion.span>}
        </div>}
        {sorted.map(g => <Button key={g.id} variant="secondary" sound={null} disabled={Boolean(coin) || used('coin-flip')} onClick={() => flipCoin(g.id, g.name)}>{g.name} · jogar moeda</Button>)}
      </div>}
    </Card>}
    <div className="score-list">{sorted.map((g, i) => <Card key={g.id} layout delay={i * 0.08} className="score-card">
      <div className="score-top">
        <span className="rank">{i + 1}</span>
        <strong>{g.name}</strong>
        <b><CountUp value={g.finalScore}/> pts<ScoreDelta value={g.finalScore}/></b>
      </div>
      <div className="score-bar">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, g.finalScore) / max * 100}%` }} transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 90, damping: 16 }}/>
      </div>
      <div className="score-detail">
        <span>Base {BASE_SCORE}</span>
        <span>Acesso {g.accessibilityScore}</span>
        <span>Votos {g.voteScore}</span>
        {g.effectScore !== 0 && <span>Habilidade {g.effectScore > 0 ? '+' : ''}{g.effectScore}</span>}
      </div>
    </Card>)}</div>
    <Button sound="whoosh" onClick={advance}>Ir para a roleta <span>→</span></Button>
  </div>;
}
