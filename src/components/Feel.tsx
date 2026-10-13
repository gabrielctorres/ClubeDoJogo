import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';

const format = (value: number) => String(Math.round(value * 10) / 10);

/** Número que "conta" até o valor novo sempre que ele muda. */
export function CountUp({ value, from = 0, duration = 0.8 }: { value: number; from?: number; duration?: number }) {
  const motionValue = useMotionValue(from);
  const text = useTransform(motionValue, format);
  useEffect(() => {
    const controls = animate(motionValue, value, { duration, ease: 'easeOut' });
    return () => controls.stop();
  }, [motionValue, value, duration]);
  return <motion.span>{text}</motion.span>;
}

/** Mostra "+2", "-3"… flutuando para cima quando `value` muda. */
export function ScoreDelta({ value }: { value: number }) {
  const previous = useRef(value);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [deltas, setDeltas] = useState<{ id: number; delta: number }[]>([]);
  useEffect(() => {
    const delta = Math.round((value - previous.current) * 10) / 10;
    previous.current = value;
    if (!delta) return;
    const id = Date.now() + Math.random();
    setDeltas(current => [...current, { id, delta }]);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setDeltas(current => current.filter(item => item.id !== id));
    }, 900);
    timers.current.add(timer);
  }, [value]);
  useEffect(() => { const pending = timers.current; return () => pending.forEach(clearTimeout); }, []);
  return <span className="score-delta-anchor" aria-hidden>
    <AnimatePresence>{deltas.map(({ id, delta }) =>
      <motion.b key={id} className={`score-delta ${delta > 0 ? 'up' : 'down'}`}
        initial={{ opacity: 0, y: 4, scale: 0.6 }} animate={{ opacity: 1, y: -26, scale: 1.15 }} exit={{ opacity: 0, y: -40 }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
        {delta > 0 ? '+' : ''}{delta}
      </motion.b>)}
    </AnimatePresence>
  </span>;
}
