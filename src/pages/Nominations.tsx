import { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useClubStore } from '../store/clubStore';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { awaitingExtraGame } from '../services/stageFlow';
import { getNominatorIds } from '../services/nominations';
import { Button, Card, StageEyebrow } from '../components/UI';
import { sfx } from '../feel/sound';

export default function Nominations() {
  const { round, players, addNomination } = useClubStore();
  const advance = useAdvanceStage();
  const [game, setGame] = useState('');
  if (!round) return null;
  const nominatorIds = getNominatorIds(round);
  const player = players.find(x => x.id === nominatorIds[round.currentIndex]);
  const extra = !player && awaitingExtraGame(round);
  const total = nominatorIds.length;
  const blocked = players.filter(p => round.blockedNominatorIds.includes(p.id));

  const submit = () => {
    if (!game.trim()) return;
    sfx.plus();
    addNomination(game, extra ? round.chosenPlayerId : player!.id);
    setGame('');
    const after = useClubStore.getState().round!;
    const done = after.currentIndex >= getNominatorIds(after).length;
    if (done && !awaitingExtraGame(after)) advance();
  };

  const blockedNotice = blocked.length > 0 && <Card className="blocked-notice">
    <Lock size={18}/>
    <span>
      <strong>{blocked.map(p => p.name).join(', ')}</strong> {blocked.length === 1 ? 'indicou' : 'indicaram'} o jogo
      vencedor do mês passado e só {blocked.length === 1 ? 'vota' : 'votam'} nesta rodada.
    </span>
  </Card>;

  // Todas as indicações feitas (por exemplo, ao recarregar a página): só resta seguir.
  if (!player && !extra) return <div className="center-step">
    <StageEyebrow stage="nominations">ESCOLHA DE JOGOS</StageEyebrow>
    <div className="step-icon">🎮</div>
    <h2>Indicações concluídas</h2>
    <p>Todos os participantes já indicaram seus jogos.</p>
    <Button onClick={advance}>Ir para acessibilidade <span>→</span></Button>
  </div>;

  return <div className="center-step">
    <StageEyebrow stage="nominations">ESCOLHA DE JOGOS</StageEyebrow>
    {/* A cada jogador, o ícone quica e o título entra deslizando. */}
    <motion.div key={`icon-${round.currentIndex}`} initial={{ scale: 0.6, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
      <div className="step-icon">🎮</div>
    </motion.div>
    <motion.h2 key={`title-${round.currentIndex}`} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      {extra ? 'Só mais um jogo, confia' : `${player!.name}, qual é sua indicação?`}
    </motion.h2>
    <p>{extra ? 'O Escolhido pode adicionar uma indicação extra.' : 'Cada jogador indica um jogo para a rodada.'}</p>
    {blockedNotice}
    <Card>
      <label className="field-label">Nome do jogo
        <input autoFocus value={game} onChange={e => setGame(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Ex.: Valheim"/>
      </label>
      <Button sound={null} onClick={submit} disabled={!game.trim()}>{extra ? 'Adicionar jogo' : 'Confirmar indicação'} <Check size={20}/></Button>
    </Card>
    {!extra && <small>Indicação {round.currentIndex + 1} de {total}</small>}
  </div>;
}
