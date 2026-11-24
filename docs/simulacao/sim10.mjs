// Simulação de 10 anos (120 rodadas, de 15/12/2026 a 15/11/2036) do Clube do Jogo.
// Uso: node sim10.mjs [nSims=2000] [seed=2026]  -> grava result10.json
import { writeFileSync } from 'node:fs';
const N_SIMS = +(process.argv[2] ?? 2000), SEED = +(process.argv[3] ?? 2026), MONTHS = 120;
let s = SEED >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() || 1e-12)) * Math.cos(2 * Math.PI * rnd());

const PLAYERS = [
  { name: 'Fernando', f2p: .05, sv: .15, emu: .7, own: 2.5, pres: .9 },
  { name: 'Jeff', f2p: .05, sv: .2, emu: .6, own: 1.5, pres: .9 },
  { name: 'Baluno', f2p: .05, sv: .25, emu: .55, own: 1.8, pres: .9 },
  { name: 'Cristal', f2p: .7, sv: .1, emu: .05, own: .5, pres: .9 },
  { name: 'Felipe', f2p: .1, sv: .6, emu: .1, own: 2.0, pres: .9 },
  { name: 'Thiago', f2p: .1, sv: .6, emu: .1, own: 1.0, pres: .9 },
  { name: 'Cogu', f2p: .1, sv: .6, emu: .1, own: 1.0, pres: .9 },
  { name: 'Arthur', f2p: .1, sv: .6, emu: .05, own: 1.0, pres: .9 },
  { name: 'Smite', f2p: .05, sv: .75, emu: .05, own: .3, pres: .9 },
  { name: 'Markinhos', f2p: .05, sv: .75, emu: .05, own: .3, pres: .9 },
  { name: 'Max', f2p: .15, sv: .4, emu: .15, own: .8, pres: .5 },
];
const NP = PLAYERS.length;
const typeB = g => (g.f2p ? 2 : 0) + (g.sv ? 1 : 0) + (g.emu ? 1 : 0);
const RULES = {
  nova: { name: 'Regra nova (2 + tipo + donos ≤1 + 2×voto)', w: g => Math.max(1, 2 + typeB(g) + Math.min(1, .5 * g.owners) + 2 * g.votePts) },
  antiga: { name: 'Regra antiga (1 + tipo + 0,5×donos + voto)', w: g => Math.max(1, 1 + typeB(g) + .5 * g.owners + g.votePts) },
};
const KEYS = Object.keys(RULES);
const dateOf = m => { const d = new Date(Date.UTC(2026, 11 + m, 15)); return d.toISOString().slice(0, 10); };
const typeName = g => g.f2p ? 'F2P' : g.emu ? 'Emulador' : g.sv ? 'Steam Verde' : 'Pago';

const mkAgg = () => ({
  rounds: 0, zeroVoteWin: 0, topWin: 0, chosenWin: 0, nominatorWasChosenWin: 0,
  wins: Array(NP).fill(0), noms: Array(NP).fill(0), chosen: Array(NP).fill(0), zeroWinsRuns: Array(NP).fill(0),
  longestDrought: Array(NP).fill(0), byType: { F2P: 0, Emulador: 0, 'Steam Verde': 0, Pago: 0 },
  byTypeNoms: { F2P: 0, Emulador: 0, 'Steam Verde': 0, Pago: 0 }, zeroVotePerYearHist: {}, winsSpread: [],
  winnerVoters: Array(8).fill(0), winnerProb: 0,
});
const agg = Object.fromEntries(KEYS.map(k => [k, mkAgg()]));
let timeline = null;

for (let sim = 0; sim < N_SIMS; sim++) {
  const st = Object.fromEntries(KEYS.map(k => [k, { chosenHist: [], lastChosen: -1, lastWinnerNoms: [], wins: Array(NP).fill(0), lastWin: Array(NP).fill(-1), drought: Array(NP).fill(0), zeroPerYear: Array(10).fill(0) }]));
  const tl = sim === 0 ? { nova: [], antiga: [] } : null;
  for (let m = 0; m < MONTHS; m++) {
    let present = PLAYERS.map((p, i) => (rnd() < p.pres ? i : -1)).filter(i => i >= 0);
    if (present.length < 3) present = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const taste = PLAYERS.map(() => Array.from({ length: NP }, gauss));
    const appeal = Array.from({ length: NP }, gauss);
    const chosenDraw = rnd(), sampleU = rnd();
    const baseGames = present.map(i => {
      const p = PLAYERS[i], u = rnd();
      const f2p = u < p.f2p, emu = !f2p && u < p.f2p + p.emu, sv = !f2p && !emu && u < p.f2p + p.emu + p.sv;
      const ownersSet = present.filter(j => j !== i && rnd() < Math.min(.95, p.own / Math.max(1, present.length - 1)));
      return { nom: i, f2p, sv, emu, ownersSet };
    });
    for (const key of KEYS) {
      const S = st[key], A = agg[key];
      // Escolhido: ciclo; quem foi no mês anterior não repete nem na virada
      let elig = present.filter(i => !S.chosenHist.includes(i));
      if (!elig.length) { S.chosenHist = []; elig = present.filter(i => i !== S.lastChosen); }
      if (!elig.length) elig = present;
      const chosen = elig[Math.floor(chosenDraw * elig.length)];
      S.chosenHist.push(chosen); S.lastChosen = chosen; A.chosen[chosen]++;
      let blocked = S.lastWinnerNoms.filter(i => present.includes(i));
      if (blocked.length >= present.length) blocked = [];
      const games = baseGames.filter(g => !blocked.includes(g.nom))
        .map(g => ({ ...g, owners: g.ownersSet.length, voters: 0, votePts: 0, chosenVoted: false, voterNames: [] }));
      for (const v of present) {
        let best = null, bu = -1e9;
        for (const g of games) {
          if (g.nom === v) continue;
          const u = appeal[g.nom] + 0.25 * typeB(g) + (g.ownersSet.includes(v) ? 0.5 : 0) + 0.15 * g.owners + taste[v][g.nom];
          if (u > bu) { bu = u; best = g; }
        }
        if (!best) continue;
        best.voters++; best.voterNames.push(PLAYERS[v].name + (v === chosen ? ' (E)' : ''));
        if (v === chosen) { best.chosenVoted = true; best.votePts += 2; } else best.votePts += 1;
      }
      const w = games.map(RULES[key].w), W = w.reduce((a, b) => a + b, 0);
      let cur = sampleU * W, wi = games.length - 1;
      for (let k = 0; k < games.length; k++) { cur -= w[k]; if (cur < 0) { wi = k; break; } }
      const winner = games[wi], maxV = Math.max(...games.map(g => g.votePts));
      A.rounds++;
      games.forEach((g, k) => {
        const p = w[k] / W;
        A.noms[g.nom]++; A.byTypeNoms[typeName(g)]++;
        if (g.voters === 0) A.zeroVoteWin += p;
        if (g.votePts === maxV) A.topWin += p;
        if (g.chosenVoted) A.chosenWin += p;
      });
      A.wins[winner.nom]++; A.byType[typeName(winner)]++; A.winnerVoters[Math.min(7, winner.voters)]++; A.winnerProb += w[wi] / W;
      if (winner.voters === 0) S.zeroPerYear[Math.floor(m / 12)]++;
      S.wins[winner.nom]++;
      for (const i of present.concat(PLAYERS.map((_, j) => j).filter(j => !present.includes(j)))) {
        if (i === winner.nom) S.drought[i] = 0; else { S.drought[i]++; A.longestDrought[i] = Math.max(A.longestDrought[i], 0); }
        S.lastWin[i] = Math.max(S.lastWin[i], 0);
      }
      S.maxDrought ??= Array(NP).fill(0);
      PLAYERS.forEach((_, i) => { S.maxDrought[i] = Math.max(S.maxDrought[i], S.drought[i]); });
      S.lastWinnerNoms = [winner.nom];
      if (tl) tl[key].push({
        date: dateOf(m), year: Math.floor(m / 12) + 1, present: present.length, games: games.length,
        chosen: PLAYERS[chosen].name, blocked: blocked.map(i => PLAYERS[i].name),
        winner: PLAYERS[winner.nom].name, type: typeName(winner), owners: winner.owners, voters: winner.voterNames,
        chance: w[wi] / W, score: w[wi], rank: [...w].sort((a, b) => b - a).indexOf(w[wi]) + 1,
        topVoted: games.filter(g => g.votePts === maxV).map(g => PLAYERS[g.nom].name),
      });
    }
  }
  for (const key of KEYS) {
    const S = st[key], A = agg[key];
    S.wins.forEach((n, i) => { if (n === 0) A.zeroWinsRuns[i]++; });
    PLAYERS.forEach((_, i) => { A.longestDrought[i] += S.maxDrought[i]; });
    A.winsSpread.push(Math.max(...S.wins) - Math.min(...S.wins.filter((_, i) => PLAYERS[i].pres > .6)));
    S.zeroPerYear.forEach(n => { A.zeroVotePerYearHist[n] = (A.zeroVotePerYearHist[n] ?? 0) + 1; });
  }
  if (tl) timeline = tl;
}
const out = { nSims: N_SIMS, seed: SEED, months: MONTHS, players: PLAYERS, rules: Object.fromEntries(KEYS.map(k => [k, RULES[k].name])), agg, timeline };
writeFileSync(new URL('./result10.json', import.meta.url), JSON.stringify(out));
for (const k of KEYS) {
  const A = agg[k];
  console.log(k, 'semVoto', (A.zeroVoteWin / A.rounds).toFixed(3), 'top', (A.topWin / A.rounds).toFixed(3), 'escolhido', (A.chosenWin / A.rounds).toFixed(3));
}
