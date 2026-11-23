import { useEffect, useRef, useState, type RefObject } from 'react';
import { animate, motion, useMotionValue, type AnimationPlaybackControls, type MotionValue } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { calculateWinProbability, rouletteWeight } from '../services/weightedRandom';
import { Button, Card, StageEyebrow } from '../components/UI';
import { sfx } from '../feel/sound';
import type { GameEntry } from '../types';

const colors = ['#7357e8','#ffc84a','#3fcda1','#ff7190','#5bb8ef','#ff9d5c','#b879e8','#42c6d4','#ef6f42','#8bc34a'];
const point=(angle:number,radius:number)=>{const r=(angle-90)*Math.PI/180;return[100+radius*Math.cos(r),100+radius*Math.sin(r)] as const;};
const slicePath=(start:number,end:number)=>{const[x1,y1]=point(start,82);const[x2,y2]=point(end,82);return`M 100 100 L ${x1} ${y1} A 82 82 0 ${end-start>180?1:0} 1 ${x2} ${y2} Z`;};

export interface Slice { id: string; start: number; sweep: number }

/** Fatias da roleta em graus, a partir do topo e no sentido horário, com os pesos de `rouletteWeight`. */
export function getSlices(games: Pick<GameEntry, 'id' | 'finalScore'>[]): Slice[] {
  const total = games.reduce((sum, game) => sum + rouletteWeight(game), 0);
  let start = 0;
  return games.map(game => {
    const sweep = rouletteWeight(game) / total * 360;
    const slice = { id: game.id, start, sweep };
    start += sweep;
    return slice;
  });
}

/**
 * Rotação final (em graus, horária) que deixa o ponteiro do topo sobre a fatia `winnerId`.
 * `jitter` (-0.5 a 0.5) desloca o ponto de parada dentro da fatia para não cair sempre no meio.
 */
export function getWinnerRotation(slices: Slice[], winnerId: string, turns = 6, jitter = 0) {
  const slice = slices.find(item => item.id === winnerId);
  if (!slice) return 0;
  const target = slice.start + slice.sweep * (0.5 + jitter);
  return turns * 360 + (360 - target);
}

/** Fatia sob o ponteiro do topo quando a roda está girada `rotation` graus. */
export function sliceAtPointer(slices: Slice[], rotation: number) {
  const angle = ((360 - rotation) % 360 + 360) % 360;
  return slices.find(slice => slice.sweep > 0 && angle >= slice.start && angle < slice.start + slice.sweep)?.id;
}

export function PieWheel({ games, spinning = false, rotation, winnerId, pointerRef }: {
  games: GameEntry[]; spinning?: boolean; rotation?: MotionValue<number> | number; winnerId?: string; pointerRef?: RefObject<HTMLDivElement | null>;
}) {
  const slices = getSlices(games);
  return <div className={`pie-wheel-wrap ${spinning ? 'spinning' : ''}`}>
    <div className="pointer" ref={pointerRef}>▼</div>
    <motion.svg className="pie-wheel" viewBox="0 0 200 200" role="img" aria-label="Roleta com os nomes dos jogos" style={{ rotate: rotation }}>
      {games.map((game, index) => {
        const { start, sweep } = slices[index];
        if (!sweep) return null;
        const middle = start + sweep / 2;
        const [x, y] = point(middle, 53);
        const rotationText = middle - 90 + (middle > 180 ? 180 : 0);
        const letters = Array.from(game.name);
        const name = letters.length > 10 ? `${letters.slice(0, 9).join('')}…` : game.name;
        const className = `pie-slice ${game.id === winnerId ? 'winner' : ''}`;
        return <g key={game.id}>
          <title>{game.name}</title>
          {sweep >= 359.999
            ? <circle className={className} cx="100" cy="100" r="82" fill={colors[index%colors.length]} stroke="#fff8ed" strokeWidth="1.5"/>
            : <path className={className} d={slicePath(start, start + sweep)} fill={colors[index%colors.length]} stroke="#fff8ed" strokeWidth="1.5"/>}
          {sweep >= 16 && <text x={x} y={y} transform={`rotate(${rotationText} ${x} ${y})`} className="pie-name" fontSize="7" textAnchor="middle" dominantBaseline="middle">{name}</text>}
        </g>;
      })}
      <circle cx="100" cy="100" r="21" fill="#fff"/>
      <text x="100" y="101" textAnchor="middle" dominantBaseline="middle" className="pie-center">🎲</text>
    </motion.svg>
  </div>;
}

const SPIN_SECONDS = 4.8;
const LANDED_PAUSE_MS = 1400;

export default function Roulette() {
  const { round, spinWinner, setStage } = useClubStore();
  const savedWinner = round?.weightedWinnerId;
  // Ao recarregar depois do giro, a roda já aparece parada no vencedor.
  const rotation = useMotionValue(round && savedWinner ? getWinnerRotation(getSlices(round.games), savedWinner, 0) : 0);
  const pointerRef = useRef<HTMLDivElement>(null);
  const controls = useRef<AnimationPlaybackControls>(undefined);
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'landed'>('idle');

  useEffect(() => () => controls.current?.stop(), []);
  useEffect(() => {
    if (phase !== 'landed') return;
    const timer = setTimeout(() => setStage('winner'), LANDED_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [phase, setStage]);

  if (!round) return null;

  const spin = () => {
    spinWinner();
    const winnerId = useClubStore.getState().round?.weightedWinnerId;
    if (!winnerId) return;
    const slices = getSlices(round.games);
    let current = sliceAtPointer(slices, rotation.get());
    setPhase('spinning');
    sfx.whoosh();
    controls.current = animate(rotation, rotation.get() + getWinnerRotation(slices, winnerId, 6, Math.random() * 0.7 - 0.35) - (rotation.get() % 360), {
      duration: SPIN_SECONDS,
      ease: [0.12, 0.75, 0.12, 1],
      onUpdate: value => {
        const next = sliceAtPointer(slices, value);
        if (next === current) return;
        current = next;
        sfx.tick();
        pointerRef.current?.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-24deg)' }, { transform: 'rotate(0)' }], { duration: 140 });
      },
      onComplete: () => { setPhase('landed'); sfx.win(); },
    });
  };

  const landedId = phase === 'landed' || (phase === 'idle' && savedWinner) ? savedWinner : undefined;
  return <div className="center-step">
    <StageEyebrow stage="roulette">ROLETA FINAL</StageEyebrow>
    <h2>Agora a sorte decide</h2>
    <p>Cada fatia representa um jogo. A pontuação define o tamanho dela.</p>
    <Card className={`roulette ${phase === 'landed' ? 'landed' : ''}`}>
      <PieWheel games={round.games} spinning={phase === 'spinning'} rotation={rotation} winnerId={landedId} pointerRef={pointerRef}/>
      <div className="odds">{round.games.map((g, index) => <div key={g.id} className={g.id === landedId ? 'odds-winner' : ''}>
        <span className="legend"><i style={{ background: colors[index % colors.length] }}/>{g.name}</span>
        <b>{Math.round(calculateWinProbability(round.games, g.id) * 100)}%</b>
      </div>)}</div>
    </Card>
    {phase === 'idle' && savedWinner
      ? <Button onClick={() => setStage('winner')}>Ver resultado <span>→</span></Button>
      : <Button sound={null} disabled={phase !== 'idle'} onClick={spin}>
        <RotateCw size={20}/> {phase === 'idle' ? 'GIRAR ROLETA' : phase === 'spinning' ? 'Girando...' : 'Temos um vencedor!'}
      </Button>}
  </div>;
}
