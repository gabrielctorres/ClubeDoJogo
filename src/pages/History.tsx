import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Crown, Download, Trash2, Trophy, Upload } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { createBackup } from '../services/backup';
import type { Player, RoundResult } from '../types';
import { Button, Card } from '../components/UI';

// Resultados antigos não têm IDs de quem indicou: nesse caso, casa pelo nome gravado.
const nominatedByPlayer = (result: RoundResult, player: Player) =>
  result.nominatedByIds ? result.nominatedByIds.includes(player.id) : result.nominatedBy.includes(player.name);

const topPlayer = (players: Player[], count: (player: Player) => number) =>
  players.map(player => ({ name: player.name, count: count(player) })).filter(entry => entry.count > 0).sort((a, b) => b.count - a.count)[0]?.name;

export default function History() {
  const { history, players, chosenHistory, importBackup, clearHistory } = useClubStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const mostWins = topPlayer(players, player => history.filter(h => nominatedByPlayer(h, player)).length);
  const mostChosen = topPlayer(players, player => history.filter(h => h.chosenPlayerId === player.id).length);
  const bestGame = history.slice().sort((a, b) => b.finalScore - a.finalScore)[0]?.winnerGameName;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(createBackup({ players, chosenHistory, history }), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clube-do-jogo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const clearData = () => {
    if (confirm('Apagar todo o histórico de rodadas e o ciclo do Escolhido? Os jogadores serão mantidos. Essa ação não pode ser desfeita; exporte um backup antes se quiser guardar os dados.')) clearHistory();
  };
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (!importBackup(JSON.parse(String(reader.result)))) alert('Este arquivo não é um backup válido do Clube do Jogo.');
        else alert('Backup importado com sucesso!');
      } catch { alert('Não foi possível ler o arquivo JSON.'); }
    };
    reader.readAsText(file);
  };

  return <div>
    <Link className="back" to="/">← Voltar ao início</Link>
    <div className="section-head"><p className="eyebrow">MEMÓRIAS DA GALERA</p><h2>Histórico</h2><p>Os jogos que já fizeram parte do clube.</p></div>
    <Card className="backup-card">
      <div><h3>Guardar a memória da galera</h3><p>Exporte ou importe jogadores, histórico e sorteios.</p></div>
      <div className="backup-actions">
        <Button onClick={exportData}><Download size={19}/> Exportar JSON</Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload size={19}/> Importar JSON</Button>
        <Button variant="danger" sound="minus" onClick={clearData} disabled={!history.length && !chosenHistory.length}><Trash2 size={19}/> Limpar histórico</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e => { const file = e.target.files?.[0]; if (file) importData(file); e.target.value = ''; }}/>
      </div>
    </Card>
    {history.length === 0
      ? <div className="empty"><Trophy size={42}/><p>Nenhuma rodada finalizada ainda.</p></div>
      : <div className="history-list">{history.map((h, i) => <Card key={h.id} delay={Math.min(i, 8) * 0.06} className="history-card">
        <div className="history-date"><CalendarDays size={16}/> {new Date(h.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
        <h3>{h.winnerGameName}</h3>
        <p>Indicado por {h.nominatedBy.join(', ')}</p>
        <p><Crown size={15}/> Escolhido: {h.chosenPlayerName}</p>
        <strong>{h.finalScore} pontos</strong>
      </Card>)}</div>}
    <Card className="stats-card">
      <h3>Estatísticas</h3>
      <p>Total de rodadas <b>{history.length}</b></p>
      <p>Mais indicações vencedoras <b>{mostWins || '—'}</b></p>
      <p>Mais vezes Escolhido <b>{mostChosen || '—'}</b></p>
      <p>Jogo com maior pontuação <b>{bestGame || '—'}</b></p>
    </Card>
  </div>;
}
