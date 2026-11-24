import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useClubStore } from '../store/clubStore';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { Button, Confetti, StageEyebrow } from '../components/UI';
import { sfx } from '../feel/sound';
import { CHOSEN_VOTE_POINTS } from '../services/scoring';

/** Intervalos do caça-níquel: começa rápido e vai freando (~2,1 s no total). */
const SLOT_STEPS = Array.from({ length: 16 }, (_, i) => Math.round(50 * 1.12 ** i));

export default function Chosen() {
  const round = useClubStore(s => s.round);
  const players = useClubStore(s => s.players);
  const choosePlayer = useClubStore(s => s.choosePlayer);
  const advance = useAdvanceStage();
  // Só faz suspense quando o sorteio acontece nesta visita; ao recarregar, mostra direto.
  const [show, setShow] = useState(() => Boolean(round?.chosenPlayerId));
  const [rolling, setRolling] = useState('???');

  useEffect(() => {
    if (show) return;
    choosePlayer(); // idempotente: a store ignora se já houver Escolhido (StrictMode chama duas vezes)
    const names = players.filter(p => useClubStore.getState().round?.participantIds.includes(p.id)).map(p => p.name);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    SLOT_STEPS.forEach((step, i) => {
      elapsed += step;
      timers.push(setTimeout(() => { setRolling(names[i % names.length] ?? '???'); sfx.tick(); }, elapsed));
    });
    timers.push(setTimeout(() => { setShow(true); sfx.reveal(); }, elapsed + 380));
    return () => timers.forEach(clearTimeout);
  }, [show, choosePlayer, players]);

  if (!round) return null;
  const cards = round.optionalRules.cards.enabled;
  return <div className="chosen center-step">
    {show && <Confetti/>}
    <StageEyebrow stage="chosen">O ESCOLHIDO</StageEyebrow>
    <motion.div className="chosen-die"
      animate={show ? { rotate: 0, scale: [1, 1.4, 1] } : { rotate: [0, 360], y: [0, -10, 0] }}
      transition={show ? { duration: 0.5 } : { duration: 0.6, repeat: Infinity, ease: 'linear' }}>🎲</motion.div>
    <p className="eyebrow">O ESCOLHIDO É...</p>
    <h1>
      {show
        ? <motion.span className="slot-name" initial={{ scale: 0.3, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 12 }}>{round.chosenPlayerName}</motion.span>
        : <motion.span key={rolling} className="slot-name rolling" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.06 }}>{rolling}</motion.span>}
    </h1>
    {show && <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <div className="chosen-badge">{cards ? 'Seu poder será a carta escolhida' : `Seu voto vale ${CHOSEN_VOTE_POINTS} pontos nesta rodada`}</div>
      <Button onClick={advance}>Continuar <span>→</span></Button>
    </motion.div>}
  </div>;
}
