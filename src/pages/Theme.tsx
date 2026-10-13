import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, StageEyebrow } from '../components/UI';
import { useAdvanceStage } from '../hooks/useAdvanceStage';
import { fallbackCategories, fetchRandomGameCategory, getFallbackCategory, getRerollLimit, isAllowedCategory } from '../services/randomCategory';
import { sfx } from '../feel/sound';

/** Tempo mínimo de "roleta" do tema, mesmo quando a API responde na hora. */
const MIN_DRAW_MS = 900;
import { useClubStore } from '../store/clubStore';

export default function Theme() {
  const { round, setRandomCategory } = useClubStore();
  const advance = useAdvanceStage(); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const drawing = useRef(false);
  const draw = async (reroll = false) => {
    const current = useClubStore.getState().round;
    if (drawing.current || !current?.optionalRules.randomCategory.enabled) return;
    const rule = current.optionalRules.randomCategory;
    const limit = getRerollLimit(current);
    if (reroll && rule.rerollsUsed >= limit) return;
    const excluded = [...(rule.drawnCategories ?? []), ...(rule.category ? [rule.category] : [])];
    drawing.current = true;
    setLoading(true); setError('');
    const minimum = new Promise(resolve => setTimeout(resolve, MIN_DRAW_MS));
    try {
      let category: string;
      let fallback = false;
      try { category = await fetchRandomGameCategory(excluded); }
      catch { category = getFallbackCategory(excluded); fallback = true; }
      await minimum;
      const latest = useClubStore.getState().round;
      if (latest?.id !== current.id || !latest.optionalRules.randomCategory.enabled || latest.optionalRules.randomCategory !== rule) return;
      setRandomCategory({ category, drawnCategories: [...new Set([...excluded, category])], rerollsUsed: rule.rerollsUsed + (reroll ? 1 : 0) });
      if (fallback) setError('Usamos um tema local porque a API não forneceu um novo tema válido.');
    } catch { setError('Não foi possível sortear um novo tema. Tente novamente.'); }
    finally { drawing.current = false; setLoading(false); }
  };
  useEffect(() => { const category = round?.optionalRules.randomCategory.category; if(round?.optionalRules.randomCategory.enabled&&(!category||!isAllowedCategory(category)))void draw(); }, [round]);
  const [rolling, setRolling] = useState(fallbackCategories[0]);
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const timer = setInterval(() => { setRolling(fallbackCategories[i++ % fallbackCategories.length]); sfx.tick(); }, 75);
    return () => clearInterval(timer);
  }, [loading]);
  if (!round) return null;
  const rule = round.optionalRules.randomCategory;
  const limit = getRerollLimit(round);
  const category = rule.category && isAllowedCategory(rule.category) ? rule.category : null;
  return <div className="center-step">
    <StageEyebrow stage="theme">TEMA DA RODADA</StageEyebrow>
    <h2>Qual é o tema?</h2>
    <p>O grupo pode usar o tema como inspiração. A validação dos jogos é manual.</p>
    <Card className="category-result">
      <span className="category-label">Tema da rodada</span>
      {loading
        ? <strong className="rolling">{rolling}</strong>
        : <motion.strong key={category ?? 'vazio'} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 360, damping: 13 }}
          onAnimationStart={() => { if (category) sfx.reveal(); }}>
          {category ?? 'Aguardando sorteio…'}
        </motion.strong>}
      <small>{rule.rerollsUsed}/{limit} rerolls usados</small>
      <Button variant="secondary" sound="whoosh" disabled={loading || rule.rerollsUsed >= limit} onClick={() => void draw(Boolean(category))}><RefreshCw size={17}/> Sortear novamente</Button>
      {error && <p className="rule-error">{error}</p>}
    </Card>
    <Button disabled={loading || !category} onClick={advance}>Ir para escolha de jogos <span>→</span></Button>
  </div>;
}
