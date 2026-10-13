const COLORS = ['#7357e8', '#ffc84a', '#3fcda1', '#ff7190', '#5bb8ef'];

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Explosão de partículas no ponto (x, y) da tela, sem passar pelo React. */
export function burst(x: number, y: number, amount = 10) {
  if (typeof document === 'undefined' || prefersReducedMotion()) return;
  const root = document.createElement('div');
  root.className = 'burst';
  root.style.left = `${x}px`;
  root.style.top = `${y}px`;
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('i');
    const angle = (i / amount) * Math.PI * 2 + Math.random() * 0.6;
    const distance = 28 + Math.random() * 34;
    piece.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    piece.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    piece.style.background = COLORS[i % COLORS.length];
    root.appendChild(piece);
  }
  document.body.appendChild(root);
  setTimeout(() => root.remove(), 650);
}

/** Explosão a partir do centro de um elemento (para cliques via teclado, sem coordenadas). */
export function burstFrom(event: { clientX: number; clientY: number; currentTarget: Element }, amount?: number) {
  if (event.clientX || event.clientY) return burst(event.clientX, event.clientY, amount);
  const rect = event.currentTarget.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, amount);
}
