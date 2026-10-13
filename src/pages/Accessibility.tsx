import { Check, Gamepad2 } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { ACCESSIBILITY_BONUS } from '../services/scoring';
import { Button, Card, StageEyebrow } from '../components/UI';
import { CountUp, ScoreDelta } from '../components/Feel';
import { sfx } from '../feel/sound';

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
    <p>Toque nas opções para somar pontos a cada jogo.</p>
    <div className="games-grid">{round.games.map((game, index) => <Card key={game.id} delay={index * 0.08} className="access-card">
      <div className="game-title"><Gamepad2/><h3>{game.name}</h3><span className="score-pill"><CountUp value={game.accessibilityScore} duration={0.4}/> pts<ScoreDelta value={game.accessibilityScore}/></span></div>
      <div className="access-options">
        <button className={`access-option ${game.freeToPlay ? 'selected' : ''}`} onClick={() => toggle(game.freeToPlay, () => updateGame(game.id, { freeToPlay: !game.freeToPlay }))}>
          <span className="option-icon">💸</span>
          <span><strong>Free-to-Play</strong><small>Gratuito para jogar</small></span>
          <b>+{ACCESSIBILITY_BONUS.freeToPlay}</b><Check className="option-check" size={18}/>
        </button>
        <button className={`access-option ${game.steamGreen ? 'selected' : ''}`} onClick={() => toggle(game.steamGreen, () => updateGame(game.id, { steamGreen: !game.steamGreen }))}>
          <span className="option-icon">🌱</span>
          <span><strong>Steam Verde</strong><small>Roda em mais máquinas</small></span>
          <b>+{ACCESSIBILITY_BONUS.steamGreen}</b><Check className="option-check" size={18}/>
        </button>
      </div>
      <div className="owned">
        <strong>Quem já possui?</strong>
        <div className="owned-grid">{participants.map(player => {
          const owns = game.ownedBy.includes(player.id);
          return <button key={player.id} className={`owner-chip ${owns ? 'selected' : ''}`}
            onClick={() => toggle(owns, () => updateGame(game.id, { ownedBy: owns ? game.ownedBy.filter(id => id !== player.id) : [...game.ownedBy, player.id] }))}>
            <span>{player.name.slice(0, 1).toUpperCase()}</span>{player.name}<b>+{ACCESSIBILITY_BONUS.perOwner}</b>
          </button>;
        })}</div>
      </div>
    </Card>)}</div>
    <Button onClick={advance}>Ir para votação <span>→</span></Button>
  </div>;
}
