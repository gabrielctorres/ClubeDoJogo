import { Link, Navigate, useParams } from 'react-router-dom';
import { CalendarDays, Crown, Lock, Sparkles, Trophy, Users } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { getAbility } from '../services/abilities';
import { Card } from '../components/UI';
import type { ReportGame, RoundReport } from '../types';

const formatPercent = (value: number) => `${(value * 100).toFixed(1).replace('.', ',')}%`;
const formatPoints = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
/** Base usada na época da rodada (regras antigas tinham base 1), derivada do retrato salvo. */
const baseOf = (game: ReportGame) => game.finalScore - game.accessibilityScore - game.voteScore - game.effectScore;
const names = (list: { name: string }[]) => list.map(item => item.name).join(', ') || '—';

/** Rótulos das opções de acessibilidade marcadas no jogo. */
const accessTags = (game: ReportGame) => [
  game.freeToPlay && '💸 Free-to-Play',
  game.steamGreen && '🌱 Steam Verde',
  game.emulator && '🕹️ Emulador',
].filter((tag): tag is string => Boolean(tag));

function GameReportCard({ game, rank, winner, delay }: { game: ReportGame; rank: number; winner: boolean; delay: number }) {
  const tags = accessTags(game);
  return <Card delay={delay} className={`report-game ${winner ? 'winner' : ''}`}>
    <div className="report-game-head">
      <span className="rank">{rank}</span>
      <h3>{game.name}</h3>
      {winner && <span className="report-winner-tag"><Trophy size={14}/> Jogo do mês</span>}
    </div>
    <p className="report-line"><span>Indicado por</span><b>{names(game.nominatedBy)}</b></p>
    <p className="report-line"><span>Acessibilidade</span><b>{tags.length ? tags.join(' · ') : 'Nenhuma opção'}</b></p>
    <p className="report-line"><span>Quem já possuía</span><b>{names(game.ownedBy)}</b></p>
    <div className="report-votes">
      <span>Votos</span>
      {game.votes.length
        ? <div>{game.votes.map(vote => <span key={vote.player.id} className="report-vote">
          {vote.player.name} <b>+{vote.points}</b>
        </span>)}</div>
        : <em>Nenhum voto</em>}
    </div>
    <div className="score-detail report-score">
      <span>Base {formatPoints(baseOf(game))}</span>
      <span>Acesso {formatPoints(game.accessibilityScore)}</span>
      <span>Votos {formatPoints(game.voteScore)}</span>
      {game.effectScore !== 0 && <span>Habilidade {game.effectScore > 0 ? '+' : ''}{formatPoints(game.effectScore)}</span>}
      <strong>{formatPoints(game.finalScore)} pts · {formatPercent(game.probability)}</strong>
    </div>
  </Card>;
}

/** Quem votou em quê, na ordem dos participantes. */
function VotesTable({ report }: { report: RoundReport }) {
  const voteOf = (playerId: string) => {
    for (const game of report.games) {
      const vote = game.votes.find(item => item.player.id === playerId);
      if (vote) return { game: game.name, points: vote.points };
    }
  };
  return <Card className="report-table-card">
    <h3><Users size={18}/> Quem votou em quê</h3>
    <table className="report-table">
      <thead><tr><th>Participante</th><th>Votou em</th><th>Pontos</th></tr></thead>
      <tbody>{report.participants.map(player => {
        const vote = voteOf(player.id);
        return <tr key={player.id}>
          <td>{player.name}</td>
          <td>{vote?.game ?? '—'}</td>
          <td>{vote ? `+${vote.points}` : '—'}</td>
        </tr>;
      })}</tbody>
    </table>
  </Card>;
}

export default function HistoryDetail() {
  const { id } = useParams();
  const result = useClubStore(s => s.history.find(item => item.id === id));
  if (!result) return <Navigate to="/history" replace/>;
  const report = result.report;
  const month = new Date(result.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const ability = getAbility(report?.ability ?? null);
  const games = report ? [...report.games].sort((a, b) => b.finalScore - a.finalScore) : [];

  return <div className="report">
    <Link className="back" to="/history">← Voltar ao histórico</Link>
    <div className="section-head">
      <p className="eyebrow"><CalendarDays size={13}/> RELATÓRIO DE {month.toUpperCase()}</p>
      <h2>{result.winnerGameName}</h2>
      <p>Jogo do mês com {formatPoints(result.finalScore)} pontos e {formatPercent(result.probability)} de chance na roleta.</p>
    </div>

    <Card className="report-summary">
      <p className="report-line"><span><Crown size={15}/> Escolhido</span><b>{result.chosenPlayerName}</b></p>
      <p className="report-line"><span>Indicado por</span><b>{result.nominatedBy.join(', ') || '—'}</b></p>
      {report && <>
        <p className="report-line"><span>Participantes</span><b>{names(report.participants)}</b></p>
        <p className="report-line"><span>Opções na roleta</span><b>{report.games.length}</b></p>
        {report.category && <p className="report-line"><span><Sparkles size={15}/> Tema</span><b>{report.category}</b></p>}
        {ability && <p className="report-line"><span>Carta de habilidade</span><b>{ability.name}</b></p>}
        {report.blockedNominators.length > 0 && <p className="report-line">
          <span><Lock size={15}/> Só votaram</span><b>{names(report.blockedNominators)}</b>
        </p>}
      </>}
    </Card>

    {report
      ? <>
        <h3 className="report-section-title">Todas as opções do mês</h3>
        <div className="report-games">{games.map((game, index) =>
          <GameReportCard key={game.id} game={game} rank={index + 1} winner={game.id === result.winnerGameId} delay={Math.min(index, 8) * 0.05}/>)}
        </div>
        <VotesTable report={report}/>
      </>
      : <div className="empty"><Trophy size={42}/><p>Esta rodada foi registrada antes dos relatórios completos, então só o vencedor ficou guardado.</p></div>}
  </div>;
}
