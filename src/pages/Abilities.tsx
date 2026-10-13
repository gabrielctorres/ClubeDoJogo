import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { getAbility, randomAbilities } from '../services/abilities';
import type { AbilityId } from '../types';
import { useClubStore } from '../store/clubStore';

export default function Abilities() {
  const { round, setAbilityOptions, selectAbility, setStage } = useClubStore();
  const navigate = useNavigate();
  const [replacement, setReplacement] = useState<AbilityId | null>(null);
  useEffect(() => { if (round?.optionalRules.cards.enabled && round.optionalRules.cards.options.length === 0) setAbilityOptions(randomAbilities(3).map(a => a.id)); }, [round, setAbilityOptions]);
  if (!round) return null;
  const options = round.optionalRules.cards.options;
  const selected = round.optionalRules.cards.selected;
  const ids = replacement ? [selected, replacement].filter((id): id is AbilityId => Boolean(id)) : options;
  const next = () => { selectAbility(selected!); const stage = round.optionalRules.randomCategory.enabled ? 'theme' : 'nominations'; setStage(stage); navigate(`/${stage}`); };
  const choose = (id: AbilityId) => { if (selected === 'pretend' && !replacement) { setReplacement(randomAbilities(1, options)[0]?.id ?? null); return; } selectAbility(id); };
  return <div className="center-step"><p className="eyebrow">FASE 4 · CARTAS DO ESCOLHIDO</p><h2>Escolha uma habilidade</h2><p>Três cartas foram sorteadas. O Escolhido decide qual usar.</p><div className="ability-grid">{ids.map(id => { const ability=getAbility(id); if(!ability)return null; return <Card key={id} className={`ability-card ${selected===id?'selected':''}`} onClick={() => choose(id)}><span className="ability-icon">🃏</span><h3>{ability.name}</h3><p>{ability.description}</p>{selected===id&&<small>Selecionada</small>}</Card>; })}</div>{replacement&&<p className="rule-error">Finge Que Não Viu: escolha entre as duas habilidades exibidas.</p>}<Button disabled={!selected} onClick={next}>Confirmar habilidade <span>→</span></Button></div>;
}
