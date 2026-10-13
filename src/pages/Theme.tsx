import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { fetchRandomGameCategory, getFallbackCategory, isAllowedCategory } from '../services/randomCategory';
import { useClubStore } from '../store/clubStore';

export default function Theme() {
  const { round, setRandomCategory, setStage } = useClubStore();
  const navigate = useNavigate(); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const drawing = useRef(false);
  const draw = async (reroll = false) => {
    const current = useClubStore.getState().round;
    if (drawing.current || !current?.optionalRules.randomCategory.enabled) return;
    const rule = current.optionalRules.randomCategory;
    const limit = 3 + (current.optionalRules.cards.enabled && current.optionalRules.cards.selected === 'bad-rule' ? 1 : 0);
    if (reroll && rule.rerollsUsed >= limit) return;
    const excluded = [...(rule.drawnCategories ?? []), ...(rule.category ? [rule.category] : [])];
    drawing.current = true;
    setLoading(true); setError('');
    try {
      let category: string;
      let fallback = false;
      try { category = await fetchRandomGameCategory(excluded); }
      catch { category = getFallbackCategory(excluded); fallback = true; }
      const latest = useClubStore.getState().round;
      if (latest?.id !== current.id || !latest.optionalRules.randomCategory.enabled || latest.optionalRules.randomCategory !== rule) return;
      setRandomCategory({ category, drawnCategories: [...new Set([...excluded, category])], rerollsUsed: rule.rerollsUsed + (reroll ? 1 : 0) });
      if (fallback) setError('Usamos um tema local porque a API não forneceu um novo tema válido.');
    } catch { setError('Não foi possível sortear um novo tema. Tente novamente.'); }
    finally { drawing.current = false; setLoading(false); }
  };
  useEffect(() => { const category = round?.optionalRules.randomCategory.category; if(round?.optionalRules.randomCategory.enabled&&(!category||!isAllowedCategory(category)))void draw(); }, [round]);
  if(!round)return null; const rule=round.optionalRules.randomCategory; const extra=round.optionalRules.cards.enabled&&round.optionalRules.cards.selected==='bad-rule'?1:0; const limit=3+extra;
  const continueRound=()=>{setStage('nominations');navigate('/nominations');};
  return <div className="center-step"><p className="eyebrow">FASE 5 · TEMA DA RODADA</p><h2>Qual é o tema?</h2><p>O grupo pode usar o tema como inspiração. A validação dos jogos é manual.</p><Card className="category-result"><span className="category-label">Tema da rodada</span><strong>{loading?'Sorteando…':rule.category&&isAllowedCategory(rule.category)?rule.category:'Aguardando sorteio…'}</strong><small>{rule.rerollsUsed}/{limit} rerolls usados</small><Button variant="secondary" disabled={loading||rule.rerollsUsed>=limit} onClick={()=>void draw(Boolean(rule.category&&isAllowedCategory(rule.category)))}><RefreshCw size={17}/> Sortear novamente</Button>{error&&<p className="rule-error">{error}</p>}</Card><Button disabled={loading||!rule.category||!isAllowedCategory(rule.category)} onClick={continueRound}>Ir para escolha de jogos <span>→</span></Button></div>;
}
