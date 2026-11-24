// Gera o relatório .md a partir de result10.json. Uso: node report10.mjs <saida.md>
import { readFileSync, writeFileSync } from 'node:fs';
const r = JSON.parse(readFileSync(new URL('./result10.json', import.meta.url)));
const N = r.nSims, P = r.players, NEW = r.agg.nova, OLD = r.agg.antiga;
const pct = (x, d = 1) => (100 * x).toFixed(d).replace('.', ',') + '%';
const num = (x, d = 1) => x.toFixed(d).replace('.', ',');
const br = iso => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
const next = iso => { const dt = new Date(iso + 'T00:00:00Z'); dt.setUTCMonth(dt.getUTCMonth() + 1); return dt.toISOString().slice(0, 10); };
const L = [];
const tl = r.timeline.nova;
const tlOld = r.timeline.antiga;

// ---------- Cabeçalho
L.push('# Simulação de 10 anos do Clube do Jogo', '');
L.push(`> Gerado em 24/11/2026. São ${N.toLocaleString('pt-BR')} simulações independentes de 120 rodadas, comparando a **regra nova**, implementada em novembro de 2026 (ver [consenso-jogos-sem-voto.md](consenso-jogos-sem-voto.md)), com a **regra antiga**. Os números mostram tendências das regras, não previsões sobre as pessoas.`, '');

// ---------- Calendário
L.push('## Calendário', '');
L.push('- O jogo do mês é decidido no **dia 15** e jogado até o dia 15 do mês seguinte.');
L.push(`- A primeira rodada simulada é a de **${br(tl[0].date)}**, logo depois da última rodada real (23/11/2026). A última é a de **${br(tl.at(-1).date)}**, e esse jogo é jogado até ${br(next(tl.at(-1).date))}.`);
L.push('- São **120 rodadas**, ou seja, 120 jogos do mês em 10 anos.');
L.push('- Cada "Ano N" vai de 15 de dezembro a 15 de novembro do ano seguinte.', '');

// ---------- Premissas
L.push('## Como foi simulado', '');
L.push('As rodadas seguem as regras do app: sorteio do Escolhido com ciclo, sem repetir o Escolhido do mês anterior; bloqueio de quem indicou o vencedor do mês anterior; ninguém vota no próprio jogo; e roleta com peso `máx(1; pontuação)`. Cartas e tema aleatório ficaram desligados.', '');
L.push('| Regra | Fórmula |', '|---|---|');
L.push('| **Nova** | 2 + tipo (F2P +2, Steam Verde +1, Emulador +1) + donos (+0,5 cada, até +1) + 2 × pontos de voto (comum 2, Escolhido 4) |');
L.push('| Antiga | 1 + tipo + 0,5 por dono, sem teto + pontos de voto (comum 1, Escolhido 2) |', '');
L.push('O comportamento do grupo vem dos perfis calibrados pela rodada real de novembro de 2026:', '');
L.push('- **Presença:** cerca de 90% por rodada. Max, 50%.');
L.push('- **Indicação:** cada jogador tem uma chance própria de indicar F2P, Steam Verde ou Emulador, e uma média própria de donos.');
L.push('  - Fernando, Jeff e Baluno puxam para emulador com vários donos.');
L.push('  - Cristal, para F2P.');
L.push('  - Smite e Markinhos, para Steam Verde sem donos.');
L.push('- **Voto:** cada pessoa vota no jogo que mais quer. Pesam um apelo aleatório do jogo, um pouco da acessibilidade, já ter o jogo e o gosto pessoal.', '');
L.push('As duas regras viveram exatamente as mesmas presenças, indicações e preferências. A diferença entre elas vem só da regra.', '');

// ---------- Resumo
const R = A => A.rounds;
const avgVotersWinner = A => A.winnerVoters.reduce((s, n, i) => s + n * i, 0) / A.rounds;
const zeroYear = A => Object.entries(A.zeroVotePerYearHist).reduce((s, [k, n]) => s + k * n, 0) / (N * 10);
L.push('## Resultado em 10 anos (média das simulações)', '');
L.push('| | Regra antiga | **Regra nova** | Diferença |', '|---|---|---|---|');
const row = (label, a, b, f = pct, diff = (x, y) => (y - x >= 0 ? '+' : '') + num(100 * (y - x)) + ' pp') => L.push(`| ${label} | ${f(a)} | **${f(b)}** | ${diff(a, b)} |`);
row('Vence um jogo sem nenhum voto', OLD.zeroVoteWin / R(OLD), NEW.zeroVoteWin / R(NEW));
row('Vence o jogo mais votado', OLD.topWin / R(OLD), NEW.topWin / R(NEW));
row('Vence o jogo em que o Escolhido votou', OLD.chosenWin / R(OLD), NEW.chosenWin / R(NEW));
const plain = (a, b) => (b - a >= 0 ? '+' : '') + num(b - a);
row('Jogos sem voto que vencem, em 10 anos', 120 * OLD.zeroVoteWin / R(OLD), 120 * NEW.zeroVoteWin / R(NEW), x => num(x), plain);
row('Jogos sem voto que vencem, por ano', zeroYear(OLD), zeroYear(NEW), x => num(x), plain);
row('Votantes do vencedor (média)', avgVotersWinner(OLD), avgVotersWinner(NEW), x => num(x, 2), (a, b) => (b - a >= 0 ? '+' : '') + num(b - a, 2));
row('Chance média do vencedor na roleta', OLD.winnerProb / R(OLD), NEW.winnerProb / R(NEW));
const perNom = A => A.wins.map((w, i) => w / A.noms[i]);
const ratio = A => { const v = perNom(A); return Math.max(...v) / Math.min(...v); };
row('Jogador que mais vence ÷ o que menos vence (por indicação)', ratio(OLD), ratio(NEW), x => num(x, 2) + '×', (a, b) => (b - a >= 0 ? '+' : '') + num(b - a, 2));
L.push('');
L.push('Em 10 anos, a regra nova troca cerca de **' + num(120 * (OLD.zeroVoteWin - NEW.zeroVoteWin) / R(NEW)) + ' vitórias de jogos sem voto** por vitórias de jogos votados. É a redução moderada que foi pedida: jogo sem voto continua podendo vencer, só que com menos frequência.', '');

// ---------- Por jogador
L.push('## Por jogador (média de 10 anos)', '');
L.push('| Jogador | Vitórias (antiga) | **Vitórias (nova)** | Vence por indicação (nova) | Vezes Escolhido | Maior seca, em meses (nova) | Chance de 0 vitórias |');
L.push('|---|---|---|---|---|---|---|');
const order = P.map((_, i) => i).sort((a, b) => NEW.wins[b] - NEW.wins[a]);
for (const i of order) L.push(`| ${P[i].name} | ${num(OLD.wins[i] / N)} | **${num(NEW.wins[i] / N)}** | ${pct(NEW.wins[i] / NEW.noms[i])} | ${num(NEW.chosen[i] / N)} | ${num(NEW.longestDrought[i] / N)} | ${pct(NEW.zeroWinsRuns[i] / N, 2)} |`);
L.push('');
const gain = P.map((_, i) => ({ n: P[i].name, d: (NEW.wins[i] - OLD.wins[i]) / N })).sort((a, b) => b.d - a.d);
L.push(`- **Quem mais ganha com a regra nova:** ${gain.slice(0, 3).map(g => `${g.n} (${plain(0, g.d)})`).join(', ')}. São os que indicam jogos com poucos donos.`);
L.push(`- **Quem mais perde:** ${gain.slice(-3).reverse().map(g => `${g.n} (${plain(0, g.d)})`).join(', ')}. São os que indicam jogos que muita gente já tem; o teto de donos corta essa vantagem.`);
L.push('- **Max** vence menos só porque falta metade das rodadas. Por indicação, está perto da média.');
L.push(`- Praticamente ninguém passa 10 anos sem vencer: só Max, em ${pct(NEW.zeroWinsRuns[10] / N, 1)} das simulações. "Maior seca" é o maior intervalo, em meses, sem ganhar o jogo do mês.`, '');

// ---------- Tipos
L.push('## Que tipo de jogo vence', '');
L.push('| Tipo | Indicações | Vitórias (antiga) | **Vitórias (nova)** | Vence por indicação (nova) |', '|---|---|---|---|---|');
for (const t of ['Steam Verde', 'Emulador', 'F2P', 'Pago']) {
  L.push(`| ${t} | ${pct(NEW.byTypeNoms[t] / Object.values(NEW.byTypeNoms).reduce((a, b) => a + b))} | ${pct(OLD.byType[t] / R(OLD))} | **${pct(NEW.byType[t] / R(NEW))}** | ${pct(NEW.byType[t] / NEW.byTypeNoms[t])} |`);
}
L.push('', 'O jogo pago sem nenhum bônus é o que mais ganha espaço: com o voto pesando mais, um jogo pago bem votado compete melhor.', '');

// ---------- Votos do vencedor
L.push('## Quantos votos o vencedor costuma ter', '');
L.push('| Votantes do vencedor | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |', '|---|---|---|---|---|---|---|---|---|');
L.push(`| Regra antiga | ${OLD.winnerVoters.map(n => pct(n / R(OLD))).join(' | ')} |`);
L.push(`| **Regra nova** | ${NEW.winnerVoters.map(n => pct(n / R(NEW))).join(' | ')} |`, '');

L.push('### Jogos sem voto que vencem em um ano', '');
L.push('Em quantos anos (de todos os anos simulados) houve 0, 1, 2… vitórias de jogos sem voto:', '');
const keys = [...new Set([...Object.keys(OLD.zeroVotePerYearHist), ...Object.keys(NEW.zeroVotePerYearHist)])].map(Number).sort((a, b) => a - b).filter(k => k <= 8);
L.push(`| Vitórias sem voto no ano | ${keys.join(' | ')} |`, `|---|${keys.map(() => '---').join('|')}|`);
for (const [label, A] of [['Regra antiga', OLD], ['**Regra nova**', NEW]]) L.push(`| ${label} | ${keys.map(k => pct((A.zeroVotePerYearHist[k] ?? 0) / (N * 10))).join(' | ')} |`);
L.push('', 'O mais comum, nas duas regras, é ter 3 ou 4 meses por ano em que o jogo sem voto vence. A regra nova desloca a distribuição para baixo.', '');

// ---------- Linha do tempo exemplo
L.push('## Uma linha do tempo de exemplo (regra nova)', '');
L.push('Esta é **uma** das simulações, mês a mês, com a regra nova. Mostra como seria viver 10 anos de clube: a sorte pesa bastante em qualquer linha do tempo isolada. "E" marca o voto do Escolhido. "Posição" é a colocação do vencedor no placar da rodada.', '');
const tally = P.map(() => 0);
for (let y = 1; y <= 10; y++) {
  const rows = tl.filter(x => x.year === y);
  L.push(`### Ano ${y} (${br(rows[0].date)} a ${br(next(rows.at(-1).date))})`, '');
  L.push('| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const x of rows) {
    tally[P.findIndex(p => p.name === x.winner)]++;
    L.push(`| ${br(x.date)} | ${br(next(x.date))} | ${x.chosen} | ${x.voters.length ? '' : '⚠️ '}${x.winner} | ${x.type} | ${x.owners} | ${x.voters.length ? x.voters.join(', ') : '**nenhum**'} | ${num(x.score)} | ${pct(x.chance)} | ${x.rank}º | ${x.games} |`);
  }
  const yw = {}; rows.forEach(x => { yw[x.winner] = (yw[x.winner] ?? 0) + 1; });
  const best = Object.entries(yw).sort((a, b) => b[1] - a[1]);
  L.push('', `Destaque do ano: **${best[0][0]}** (${best[0][1]} vitórias). Vitórias sem voto: ${rows.filter(x => !x.voters.length).length}. Mais votado venceu: ${rows.filter(x => x.topVoted.includes(x.winner)).length} de 12.`, '');
}
L.push('### Placar final da linha do tempo de exemplo', '');
L.push('| Jogador | Vitórias (nova) | Vitórias com a regra antiga, na mesma linha do tempo |', '|---|---|---|');
const tallyOld = P.map(p => tlOld.filter(x => x.winner === p.name).length);
P.map((p, i) => ({ p: p.name, n: tally[i], o: tallyOld[i] })).sort((a, b) => b.n - a.n).forEach(x => L.push(`| ${x.p} | ${x.n} | ${x.o} |`));
const zNew = tl.filter(x => !x.voters.length).length, zOld = tlOld.filter(x => !x.voters.length).length;
L.push('', `Nesta linha do tempo, ${zNew} dos 120 jogos do mês venceram sem nenhum voto (com a regra antiga, ${zOld}). O mais votado venceu ${tl.filter(x => x.topVoted.includes(x.winner)).length} vezes.`, '');
L.push('A regra antiga, mesmo com o mesmo sorteio, tem outro histórico: um vencedor diferente muda quem fica bloqueado no mês seguinte, e a história se separa daí em diante.', '');

// ---------- Conclusões
L.push('## Conclusões', '');
L.push(`1. **A regra nova cumpre o objetivo.** A vitória sem voto cai de ${pct(OLD.zeroVoteWin / R(OLD))} para ${pct(NEW.zeroVoteWin / R(NEW))}, cerca de ${num(120 * (OLD.zeroVoteWin - NEW.zeroVoteWin) / R(NEW))} jogos a menos em 10 anos. A surpresa continua: ainda são uns ${num(zeroYear(NEW))} por ano.`);
L.push(`2. **O sistema fica mais justo entre jogadores.** A diferença entre quem mais e quem menos vence por indicação cai de ${num(ratio(OLD), 2)}× para ${num(ratio(NEW), 2)}×. Quem indica Steam Verde sem donos ganha espaço; quem indica jogos que muitos já têm perde um pouco.`);
L.push(`3. **O voto pesa mais.** O mais votado vence ${pct(NEW.topWin / R(NEW))} das vezes (antes ${pct(OLD.topWin / R(OLD))}), e o vencedor tem em média ${num(avgVotersWinner(NEW), 2)} votantes (antes ${num(avgVotersWinner(OLD), 2)}).`);
L.push(`4. **O Escolhido ganha um pouco de força**: o jogo em que ele vota vence ${pct(NEW.chosenWin / R(NEW))} (antes ${pct(OLD.chosenWin / R(OLD))}).`);
L.push('5. **A sorte domina qualquer história individual.** Em 10 anos, cada jogador vence em média 10 a 13 vezes, mas uma linha do tempo isolada pode ter alguém com o dobro de outro.');
L.push('6. **Revisão.** Pelo plano do consenso, se depois de uns 6 meses reais os jogos sem voto continuarem vencendo mais de 1 mês em cada 4, o próximo passo é a regra D (base 2 + 3 × voto + donos até +1).', '');
L.push('## Limitações', '');
L.push('- Os perfis de indicação e de voto foram estimados a partir de uma única rodada real. O grupo muda com o tempo: gente entra, sai e muda de gosto.');
L.push('- Os votos simulados não são estratégicos. Ninguém vota "de favor" nem para atrapalhar outro jogo.');
L.push('- Cartas e tema aleatório ficaram desligados.');
L.push('- Os números absolutos dependem do modelo. Comparações entre as duas regras são mais confiáveis que os valores isolados.');
writeFileSync(process.argv[2], L.join('\n') + '\n');
