import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { calculatePlayerVotePoints } from '../services/scoring';
import { Button, Card } from '../components/UI';

export default function Voting() {
  const { round, players, vote, setStage, setCurrentIndex } = useClubStore();
  const nav = useNavigate();
  if (!round) return null;

  const player = players.find(item => item.id === round.participantIds[round.currentIndex]);
  if (!player) return null;
  const chosen = player.id === round.chosenPlayerId;
  const points = calculatePlayerVotePoints(round, player.id);
  const humility = round.optionalRules.cards.enabled && round.optionalRules.cards.selected === 'humility';
  const games = humility && chosen ? round.games.filter(game => game.nominatedBy.includes(player.id)) : round.games;
  const alreadyVoted = round.games.some(game => game.votes.some(item => item.playerId === player.id));
  const finish = () => { setStage('score'); nav('/score'); };
  const advance = () => {
    if (round.currentIndex + 1 >= round.participantIds.length) finish();
    else setCurrentIndex(round.currentIndex + 1);
  };

  return <div>
    <p className="eyebrow">FASE 8 · VOTAÇÃO</p>
    <h2>{player.name}, escolha seu favorito</h2>
    {chosen && <div className="chosen-badge"><Crown size={20}/> Você é o Escolhido {humility ? '· vote no seu próprio jogo' : points === 2 ? '· seu voto vale 2 pontos' : '· poder especial: apenas a carta escolhida'}</div>}
    {alreadyVoted ? <Card><p>Este participante já registrou seu voto nesta rodada.</p><Button onClick={advance}>{round.currentIndex + 1 >= round.participantIds.length ? 'Ver pontuação' : 'Próximo participante'} <span>→</span></Button></Card> : <>
      <div className="vote-grid">{games.map(game => <Card key={game.id} className="vote-card" onClick={() => { vote({ playerId: player.id, gameId: game.id, points }); advance(); }}><span>🎮</span><h3>{game.name}</h3><small>Votar neste jogo · {points} {points === 1 ? 'ponto' : 'pontos'}</small></Card>)}</div>
      {!games.length && <Card><p>O Escolhido ainda não indicou um jogo próprio.</p><Button onClick={advance}>{round.currentIndex + 1 >= round.participantIds.length ? 'Ver pontuação' : 'Próximo participante'} <span>→</span></Button></Card>}
    </>}
    <small>Voto {round.currentIndex + 1} de {round.participantIds.length}</small>
  </div>;
}
