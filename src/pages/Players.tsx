import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { Button, Card } from '../components/UI';

export default function Players() {
  const { players, round, addPlayer, removePlayer, updatePlayer, startRound } = useClubStore();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>(players.map(player => player.id));
  const nav = useNavigate();
  const locked = Boolean(round?.chosenPlayerId);
  const add = () => {
    const normalized = name.trim();
    if (!normalized || players.some(player => player.name.toLowerCase() === normalized.toLowerCase())) return;
    addPlayer(normalized);
    setName('');
  };
  const toggle = (playerId: string) => setSelected(current => current.includes(playerId)
    ? current.filter(id => id !== playerId)
    : [...current, playerId]);

  return <div>
    <div className="section-head"><p className="eyebrow">FASE 1 · JOGADORES</p><h2>Quem vai jogar?</h2><p>Cadastre a turma e escolha quem participa desta rodada.</p></div>
    {locked && <p role="status">A lista de jogadores fica bloqueada depois do sorteio do Escolhido.</p>}
    <form className="add-player" onSubmit={event => { event.preventDefault(); add(); }}>
      <input value={name} onChange={event => setName(event.target.value)} placeholder="Nome do jogador" disabled={locked} aria-label="Nome do jogador" />
      <Button type="submit" disabled={locked}><Plus size={20}/> Adicionar</Button>
    </form>
    <div className="list">{players.map(player => <Card key={player.id} className="player-row">
      <label><input type="checkbox" checked={selected.includes(player.id)} onChange={() => toggle(player.id)} disabled={locked}/><span>{player.name}</span></label>
      <div>
        <button className="text-btn" type="button" aria-label={`Editar ${player.name}`} disabled={locked} onClick={() => { const nextName = prompt('Novo nome', player.name)?.trim(); if (nextName && !players.some(item => item.id !== player.id && item.name.toLowerCase() === nextName.toLowerCase())) updatePlayer(player.id, nextName); }}><Pencil size={17}/></button>
        <button className="text-btn danger" type="button" aria-label={`Remover ${player.name}`} disabled={locked} onClick={() => { removePlayer(player.id); setSelected(current => current.filter(id => id !== player.id)); }}><Trash2 size={17}/></button>
      </div>
    </Card>)}</div>
    {!players.length && <div className="empty"><Users size={42}/><p>Adicione pelo menos dois jogadores para começar.</p></div>}
    <Button disabled={!locked && selected.filter(id => players.some(player => player.id === id)).length < 2} onClick={() => { if (!locked) startRound(selected); nav('/chosen'); }}>{locked ? 'Voltar ao escolhido' : 'Definir escolhido'} <span>→</span></Button>
  </div>;
}
