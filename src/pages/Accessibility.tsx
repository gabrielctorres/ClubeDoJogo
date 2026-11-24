import { useState } from 'react';
import { Check, Gamepad2, Pencil, X } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { ACCESSIBILITY_BONUS, MAX_OWNER_BONUS } from '../services/scoring';
import { Button, Card, StageEyebrow } from '../components/UI';
import { CountUp, ScoreDelta } from '../components/Feel';
import { sfx } from '../feel/sound';
import type { GameEntry } from '../types';

const formatPoints = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

type AccessFlag = 'freeToPlay' | 'steamGreen' | 'emulator';

const ACCESS_OPTIONS: { flag: AccessFlag; icon: string; title: string; hint: string }[] = [
  { flag: 'freeToPlay', icon: '💸', title: 'Free-to-Play', hint: 'Gratuito para jogar' },
  { flag: 'steamGreen', icon: '🌱', title: 'Steam Verde', hint: 'Roda em mais máquinas' },
  { flag: 'emulator', icon: '🕹️', title: 'Jogo de Emulador', hint: 'Retrô ou de console, roda no emulador' },
];

/** Título do jogo com edição do nome no lugar, para corrigir uma indicação digitada errado. */
function GameName({ game }: { game: GameEntry }) {
  const renameGame = useClubStore(s => s.renameGame);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState('');

  const cancel = () => { setDraft(null); setError(''); };
  const save = () => {
    if (draft === null) return;
    if (draft.trim() === game.name) return cancel();
    if (!renameGame(game.id, draft)) {
      sfx.minus();
      setError(draft.trim() ? 'Já existe outro jogo com esse nome na rodada.' : 'O nome não pode ficar vazio.');
      return;
    }
    sfx.select();
    cancel();
  };

  if (draft === null) return <>
    <h3>{game.name}</h3>
    <button className="icon-btn edit-name" aria-label={`Editar ${game.name}`} title="Editar nome" onClick={() => setDraft(game.name)}>
      <Pencil size={15}/>
    </button>
  </>;

  return <div className="rename">
    <div className="rename-row">
      <input autoFocus value={draft} aria-label="Nome do jogo" onChange={e => { setDraft(e.target.value); setError(''); }}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}/>
      <button className="icon-btn" aria-label="Salvar nome" onClick={save}><Check size={16}/></button>
      <button className="icon-btn" aria-label="Cancelar edição" onClick={cancel}><X size={16}/></button>
    </div>
    {error && <small className="rename-error">{error}</small>}
  </div>;
}

export default function Accessibility() {
  const { round, players, updateGame } = useClubStore();
  const advance = useAdvanceStage();
  if (!round) return null;
  const participants = players.filter(p => round.participantIds.includes(p.id));
  /** Toca o som de marcar ou desmarcar e aplica a mudança. */
  const toggle = (on: boolean, apply: () => void) => { (on ? sfx.deselect : sfx.select)(); apply(); };

  return <div>
    <StageEyebrow stage="accessibility">ACESSIBILIDADE</StageEyebrow>
    <h2>Deixem os jogos mais acessíveis</h2>
    <p>Toque nas opções para somar pontos a cada jogo. Errou o nome? Toque no lápis para corrigir.</p>
    <div className="games-grid">{round.games.map((game, index) => <Card key={game.id} delay={index * 0.08} className="access-card">
      <div className="game-title">
        <Gamepad2/>
        <GameName game={game}/>
        <span className="score-pill"><CountUp value={game.accessibilityScore} duration={0.4}/> pts<ScoreDelta value={game.accessibilityScore}/></span>
      </div>
      <div className="access-options">{ACCESS_OPTIONS.map(option => {
        const on = game[option.flag];
        return <button key={option.flag} className={`access-option ${on ? 'selected' : ''}`}
          onClick={() => toggle(on, () => updateGame(game.id, { [option.flag]: !on }))}>
          <span className="option-icon">{option.icon}</span>
          <span><strong>{option.title}</strong><small>{option.hint}</small></span>
          <b>+{ACCESSIBILITY_BONUS[option.flag]}</b><Check className="option-check" size={18}/>
        </button>;
      })}</div>
      <div className="owned">
        <strong>Quem já possui? <small>(+{formatPoints(ACCESSIBILITY_BONUS.perOwner)} cada, no máximo +{formatPoints(MAX_OWNER_BONUS)})</small></strong>
        <div className="owned-grid">{participants.map(player => {
          const owns = game.ownedBy.includes(player.id);
          return <button key={player.id} className={`owner-chip ${owns ? 'selected' : ''}`}
            onClick={() => toggle(owns, () => updateGame(game.id, { ownedBy: owns ? game.ownedBy.filter(id => id !== player.id) : [...game.ownedBy, player.id] }))}>
            <span>{player.name.slice(0, 1).toUpperCase()}</span>{player.name}<b>+{formatPoints(ACCESSIBILITY_BONUS.perOwner)}</b>
          </button>;
        })}</div>
      </div>
    </Card>)}</div>
    <Button onClick={advance}>Ir para votação <span>→</span></Button>
  </div>;
}
