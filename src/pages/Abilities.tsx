import { useEffect } from 'react';
import { Button, Card, StageEyebrow } from '../components/UI';
import { getAbility, randomAbilities } from '../services/abilities';
import type { AbilityId } from '../types';
import { useClubStore } from '../store/clubStore';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { sfx } from '../feel/sound';

export default function Abilities() {
  const { round, setAbilityOptions, selectAbility, drawAbilityReplacement } = useClubStore();
  const advance = useAdvanceStage();
  const cards = round?.optionalRules.cards;
  useEffect(() => {
    if (cards?.enabled && cards.options.length === 0) setAbilityOptions(randomAbilities(3).map(a => a.id));
  }, [cards, setAbilityOptions]);
  if (!round || !cards) return null;
  const { options, selected, replacement } = cards;
  // Depois de "Finge Que Não Viu", a escolha fica entre ela e a carta sorteada.
  const ids: AbilityId[] = replacement ? ['pretend', replacement] : options;
  const choose = (id: AbilityId) => {
    if (id === 'pretend' && !replacement) sfx.whoosh(); else sfx.select();
    selectAbility(id);
    if (id === 'pretend') drawAbilityReplacement();
  };
  return <div className="center-step">
    <StageEyebrow stage="abilities">CARTAS DO ESCOLHIDO</StageEyebrow>
    <h2>Escolha uma habilidade</h2>
    <p>Três cartas foram sorteadas. O Escolhido decide qual usar.</p>
    <div className="ability-grid">{ids.map((id, index) => {
      const ability = getAbility(id);
      if (!ability) return null;
      return <Card key={id} delay={index * 0.12} className={`ability-card ${selected === id ? 'selected' : ''}`} onClick={() => choose(id)}>
        <span className="ability-icon">🃏</span>
        <h3>{ability.name}</h3>
        <p>{ability.description}</p>
        {selected === id && <small>Selecionada</small>}
      </Card>;
    })}</div>
    {replacement && <p className="rule-error">Finge Que Não Viu: escolha entre as duas habilidades exibidas.</p>}
    <Button sound="reveal" disabled={!selected} onClick={advance}>Confirmar habilidade <span>→</span></Button>
  </div>;
}
