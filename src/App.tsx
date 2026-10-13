import type { ComponentType, ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useClubStore } from './store/clubStore';
import { STAGES, stagePath } from './services/stageFlow';
import type { Stage } from './types';
import Home from './pages/Home';
import History from './pages/History';
import OptionalRules from './pages/OptionalRules';
import Players from './pages/Players';
import Chosen from './pages/Chosen';
import Abilities from './pages/Abilities';
import Theme from './pages/Theme';
import Nominations from './pages/Nominations';
import Accessibility from './pages/Accessibility';
import Voting from './pages/Voting';
import Score from './pages/Score';
import Roulette from './pages/Roulette';
import Winner from './pages/Winner';

const pages: Record<Stage, ComponentType> = {
  optionalRules: OptionalRules, players: Players, chosen: Chosen, abilities: Abilities, theme: Theme,
  nominations: Nominations, accessibility: Accessibility, voting: Voting, score: Score, roulette: Roulette, winner: Winner,
};

/** Etapas que podem ser abertas sem uma rodada em andamento. */
const entryStages: Stage[] = ['optionalRules', 'players'];

/** Mantém a URL sincronizada com `round.stage`: as páginas só mudam a etapa na store. */
function StageRoute({ stage, children }: { stage: Stage; children: ReactNode }) {
  const round = useClubStore(s => s.round);
  if (round && round.stage !== stage) return <Navigate to={stagePath(round.stage)} replace/>;
  if (!round && !entryStages.includes(stage)) return <Navigate to="/" replace/>;
  return children;
}

function ContinueRound() {
  const stage = useClubStore(s => s.round?.stage);
  return <Navigate to={stage ? stagePath(stage) : '/'} replace/>;
}

export default function App() {
  return <BrowserRouter>
    <MotionConfig reducedMotion="user">
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/round" element={<ContinueRound/>}/>
        {STAGES.map(({ stage, path }) => {
          const Page = pages[stage];
          return <Route key={stage} path={path} element={<StageRoute stage={stage}><Page/></StageRoute>}/>;
        })}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </Layout>
    </MotionConfig>
  </BrowserRouter>;
}
