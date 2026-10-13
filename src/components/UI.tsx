import { motion } from 'framer-motion';
import type { MouseEvent, ReactNode } from 'react';
import { useClubStore } from '../store/clubStore';
import { stageNumber } from '../services/stageFlow';
import { sfx } from '../feel/sound';
import { burstFrom } from '../feel/burst';
import type { Stage } from '../types';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Sound = keyof typeof sfx;

const press = { y: 4, scale: 0.98 };
const hover = { y: -2 };
const spring = { type: 'spring', stiffness: 500, damping: 22 } as const;

/** Botão "físico": afunda ao clicar, toca um som e solta partículas (só o primário). */
export function Button({ children, onClick, variant = 'primary', disabled = false, type = 'button', sound = 'click' }: {
  children: ReactNode; onClick?: () => void; variant?: Variant; disabled?: boolean; type?: 'button' | 'submit'; sound?: Sound | null;
}) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (sound) sfx[sound]();
    if (variant === 'primary') burstFrom(event);
    onClick?.();
  };
  return <motion.button whileHover={disabled ? undefined : hover} whileTap={disabled ? undefined : press} transition={spring}
    className={`btn ${variant}`} onClick={handleClick} disabled={disabled} type={type}>
    {children}
  </motion.button>;
}

/** Card com entrada animada. Quando clicável, levanta no hover e afunda no clique. */
export function Card({ children, className = '', onClick, delay = 0, layout = false }: { children: ReactNode; className?: string; onClick?: () => void; delay?: number; layout?: boolean }) {
  const clickable = Boolean(onClick);
  return <motion.div layout={layout}
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, ...spring }}
    whileHover={clickable ? { y: -5, rotate: -0.6 } : undefined} whileTap={clickable ? { scale: 0.96, y: 0 } : undefined}
    className={`card ${className}`} onClick={onClick} role={clickable ? 'button' : undefined} tabIndex={clickable ? 0 : undefined}
    onKeyDown={onClick ? event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick(); } } : undefined}>
    {children}
  </motion.div>;
}

/** Valores por peça, determinísticos pelo índice: espalha pela largura e cai em ângulos diferentes. */
const confettiPieces = Array.from({ length: 36 }, (_, i) => ({
  '--i': i, '--x': `${(i * 37) % 100}%`, '--drift': `${((i * 71) % 320) - 160}px`,
  '--rot': `${(i * 47) % 360}deg`, '--duration': `${2.4 + ((i * 13) % 10) / 10}s`,
} as React.CSSProperties));

export function Confetti() {
  return <div className="confetti" aria-hidden>{confettiPieces.map((style, i) => <i key={i} style={style}/>)}</div>;
}

/** "FASE N · TÍTULO", numerado conforme as etapas ativas da rodada. */
export function StageEyebrow({ stage, children }: { stage: Stage; children: ReactNode }) {
  const round = useClubStore(s => s.round);
  const n = round ? stageNumber(round, stage) : 0;
  return <p className="eyebrow">{n > 0 ? `FASE ${n} · ` : ''}{children}</p>;
}
