import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button, Card, StageEyebrow } from '../components/UI';
import { useClubStore } from '../store/clubStore';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { sfx } from '../feel/sound';

export default function OptionalRules() {
  const { round, prepareRound, setCardsRule, setRandomCategory } = useClubStore();
  const advance = useAdvanceStage();
  useEffect(() => { if (!round) prepareRound(); }, [round, prepareRound]);
  if (!round) return null;
  const cards = round.optionalRules.cards;
  const category = round.optionalRules.randomCategory;
  const toggleCards = () => {
    (cards.enabled ? sfx.deselect : sfx.select)();
    setCardsRule(cards.enabled ? { enabled: false, options: [], selected: null, replacement: null } : { enabled: true });
  };
  const toggleCategory = () => {
    (category.enabled ? sfx.deselect : sfx.select)();
    setRandomCategory({ enabled: !category.enabled, category: null, rerollsUsed: 0 });
  };
  return <div className="center-step optional-rules">
    <StageEyebrow stage="optionalRules">CONFIGURAÇÃO DA RODADA</StageEyebrow><div className="step-icon"><Sparkles size={38}/></div>
    <h2>Regras opcionais</h2><p>Escolha quais surpresas estarão valendo nesta rodada.</p>
    <Card className="optional-rule-card"><button className={`rule-toggle ${cards.enabled?'selected':''}`} onClick={toggleCards} role="switch" aria-checked={cards.enabled}><span className="rule-toggle-copy"><strong>Cartas do Escolhido</strong><small>O Escolhido recebe 3 habilidades e escolhe uma.</small></span><span className="toggle-indicator">{cards.enabled?'Ativa':'Desligada'}</span></button></Card>
    <Card className="optional-rule-card"><button className={`rule-toggle ${category.enabled?'selected':''}`} onClick={toggleCategory} role="switch" aria-checked={category.enabled}><span className="rule-toggle-copy"><strong>Categoria aleatória</strong><small>Sortear um tema para guiar a conversa do grupo, com até 3 rerolls.</small></span><span className="toggle-indicator">{category.enabled?'Ativa':'Desligada'}</span></button></Card>
    <Button sound="whoosh" onClick={advance}>Continuar para jogadores <span>→</span></Button>
  </div>;
}
