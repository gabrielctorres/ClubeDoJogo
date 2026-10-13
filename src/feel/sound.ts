import { useSyncExternalStore } from 'react';

/**
 * Efeitos sonoros sintetizados com Web Audio: não há arquivos de áudio no projeto.
 * A preferência de som fica só neste navegador.
 */
const STORAGE_KEY = 'clube-do-jogo:som';

const readEnabled = () => {
  try { return localStorage.getItem(STORAGE_KEY) !== 'off'; } catch { return true; }
};

let enabled = typeof window === 'undefined' ? false : readEnabled();
const listeners = new Set<() => void>();

export function setSoundEnabled(value: boolean) {
  enabled = value;
  try { localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off'); } catch { /* sem armazenamento: vale só nesta sessão */ }
  listeners.forEach(listener => listener());
}

export const useSoundEnabled = () => useSyncExternalStore(
  listener => { listeners.add(listener); return () => listeners.delete(listener); },
  () => enabled,
  () => false,
);

let ctx: AudioContext | undefined;
function audio() {
  if (!enabled || typeof AudioContext === 'undefined') return undefined;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface Tone { freq: number; to?: number; duration: number; type?: OscillatorType; volume?: number; delay?: number }

function play(...tones: Tone[]) {
  const ac = audio();
  if (!ac) return;
  for (const { freq, to, duration, type = 'sine', volume = 0.12, delay = 0 } of tones) {
    const start = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }
}

const notes = (freqs: number[], step: number, tone: Omit<Tone, 'freq' | 'delay'>) =>
  freqs.map((freq, i) => ({ ...tone, freq, delay: i * step }));

export const sfx = {
  click: () => play({ freq: 520, to: 380, duration: 0.07, type: 'square', volume: 0.05 }),
  select: () => play({ freq: 660, to: 990, duration: 0.1, type: 'triangle' }),
  deselect: () => play({ freq: 520, to: 330, duration: 0.1, type: 'triangle', volume: 0.09 }),
  tick: () => play({ freq: 1500, duration: 0.025, type: 'square', volume: 0.035 }),
  whoosh: () => play({ freq: 200, to: 900, duration: 0.25, type: 'sawtooth', volume: 0.04 }),
  plus: () => play(...notes([784, 1175], 0.07, { duration: 0.12, type: 'triangle' })),
  minus: () => play({ freq: 330, to: 140, duration: 0.3, type: 'sawtooth', volume: 0.07 }),
  coin: () => play(...notes([1320, 1760], 0.06, { duration: 0.12, type: 'square', volume: 0.05 })),
  reveal: () => play(...notes([523, 659, 784, 1047], 0.08, { duration: 0.22, type: 'triangle' })),
  win: () => play(
    ...notes([523, 659, 784], 0.11, { duration: 0.18, type: 'square', volume: 0.06 }),
    { freq: 1047, duration: 0.55, type: 'square', volume: 0.07, delay: 0.36 },
    { freq: 1319, duration: 0.55, type: 'triangle', volume: 0.06, delay: 0.36 },
  ),
};
