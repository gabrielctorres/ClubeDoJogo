import { useEffect, useRef, useState } from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useClubStore } from '../store/clubStore';
import { calculatePlayerVotePoints } from '../services/scoring';
import { Button, Card, StageEyebrow } from '../components/UI';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { sfx } from '../feel/sound';

/** Tempo que o carimbo do voto fica na tela antes de passar para o próximo participante. */
const STAMP_MS = 650;

export default function Voting() {
  const { round, players, vote, setCurrentIndex } = useClubStore();
  const finish = useAdvanceStage();
  const [picked, setPicked] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  if (!round) return null;

  const player = players.find(item => item.id === round.participantIds[round.currentIndex]);
  if (!player) return null;
  const chosen = player.id === round.chosenPlayerId;
  const points = calculatePlayerVotePoints(round, player.id);
  const humility = round.optionalRules.cards.enabled && round.optionalRules.cards.selected === 'humility';
  const games = humility && chosen ? round.games.filter(game => game.nominatedBy.includes(player.id)) : round.games;
  const alreadyVoted = round.games.some(game => game.votes.some(item => item.playerId === player.id));
  const last = round.currentIndex + 1 >= round.participantIds.length;
  const advance = () => {
    if (last) finish();
    else setCurrentIndex(round.currentIndex + 1);
  };
  const pick = (gameId: string) => {
    if (picked) return;
    setPicked(gameId);
    if (points > 1) sfx.reveal(); else sfx.plus();
    timer.current = setTimeout(() => {
      setPicked(null);
      vote({ playerId: player.id, gameId, points });
      advance();
    }, STAMP_MS);
  };

  return <div>
    <StageEyebrow stage="voting">VOTAÇÃO</StageEyebrow>
    <motion.h2 key={player.id} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      {player.name}, escolha seu favorito
    </motion.h2>
    {chosen && <motion.div className="chosen-badge" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
      <Crown size={20}/> Você é o Escolhido {humility ? '· vote no seu próprio jogo' : points === 2 ? '· seu voto vale 2 pontos' : '· poder especial: apenas a carta escolhida'}
    </motion.div>}
    {alreadyVoted ? <Card><p>Este participante já registrou seu voto nesta rodada.</p><Button onClick={advance}>{last ? 'Ver pontuação' : 'Próximo participante'} <span>→</span></Button></Card> : <>
      {/* A grade é recriada a cada participante, para as cartas entrarem de novo. */}
      <div className="vote-grid" key={player.id}>{games.map((game, index) =>
        <Card key={game.id} delay={index * 0.06} onClick={() => pick(game.id)}
          className={`vote-card ${picked === game.id ? 'picked' : picked ? 'dimmed' : ''}`}>
          <span>🎮</span>
          <h3>{game.name}</h3>
          <small>Votar neste jogo · {points} {points === 1 ? 'ponto' : 'pontos'}</small>
          {picked === game.id && <motion.div className="vote-stamp" initial={{ scale: 2.4, rotate: -25, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            +{points}
          </motion.div>}
        </Card>)}
      </div>
      {!games.length && <Card><p>O Escolhido ainda não indicou um jogo próprio.</p><Button onClick={advance}>{last ? 'Ver pontuação' : 'Próximo participante'} <span>→</span></Button></Card>}
    </>}
    <small>Voto {round.currentIndex + 1} de {round.participantIds.length}</small>
  </div>;
}
