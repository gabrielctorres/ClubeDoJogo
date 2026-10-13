import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClubStore } from '../store/clubStore';
import { canGoBack, getActiveStages, getPreviousStage, stageLabel } from '../services/stageFlow';
import { setSoundEnabled, sfx, useSoundEnabled } from '../feel/sound';

export function Layout({ children }: { children: React.ReactNode }) {
  const round = useClubStore(s => s.round);
  const reset = useClubStore(s => s.resetRound);
  const setStage = useClubStore(s => s.setStage);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const soundOn = useSoundEnabled();
  const stages = round ? getActiveStages(round) : [];
  const index = round ? stages.indexOf(round.stage) : 0;
  const previous = round && canGoBack(round) ? getPreviousStage(round) : undefined;
  const goBack = () => { if (previous) { sfx.deselect(); setStage(previous); } };
  const leave = () => { if (confirm('Sair da rodada atual? Os dados desta rodada serão descartados.')) { reset(); navigate('/'); } };
  const toggleSound = () => { setSoundEnabled(!soundOn); if (!soundOn) sfx.select(); };
  return <main>
    <header>
      <div className="brand">
        <motion.span className="logo" whileHover={{ rotate: [0, -14, 14, 0], scale: 1.1 }} transition={{ duration: 0.45 }}><Trophy size={22}/></motion.span>
        <span>Clube do Jogo</span>
      </div>
      <div className="header-actions">
        {round && previous && <button className="back-stage" onClick={goBack}><ArrowLeft size={17}/> Voltar</button>}
        {round && <button className="exit-stage" onClick={leave}>Sair da rodada</button>}
        <button className="back-stage" onClick={toggleSound} aria-label={soundOn ? 'Desligar sons' : 'Ligar sons'} aria-pressed={soundOn} title={soundOn ? 'Desligar sons' : 'Ligar sons'}>
          {soundOn ? <Volume2 size={18}/> : <VolumeX size={18}/>}
        </button>
      </div>
    </header>
    {round && <div className="progress-wrap">
      <div className="progress-label">
        <AnimatePresence mode="wait">
          <motion.span key={round.stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            {stageLabel(round.stage)}
          </motion.span>
        </AnimatePresence>
        <span>{index + 1}/{stages.length}</span>
      </div>
      <div className="progress"><motion.div animate={{ width: `${((index + 1) / stages.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}/></div>
    </div>}
    {/* Cada troca de rota entra com um leve deslize. */}
    <motion.section key={pathname} className="page" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
      {children}
    </motion.section>
  </main>;
}
