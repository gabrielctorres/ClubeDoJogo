# Simulação de 10 anos do Clube do Jogo

> Gerado em 24/11/2026. São 2.000 simulações independentes de 120 rodadas, comparando a **regra nova**, implementada em novembro de 2026 (ver [consenso-jogos-sem-voto.md](consenso-jogos-sem-voto.md)), com a **regra antiga**. Os números mostram tendências das regras, não previsões sobre as pessoas.

## Calendário

- O jogo do mês é decidido no **dia 15** e jogado até o dia 15 do mês seguinte.
- A primeira rodada simulada é a de **15/12/2026**, logo depois da última rodada real (23/11/2026). A última é a de **15/11/2036**, e esse jogo é jogado até 15/12/2036.
- São **120 rodadas**, ou seja, 120 jogos do mês em 10 anos.
- Cada "Ano N" vai de 15 de dezembro a 15 de novembro do ano seguinte.

## Como foi simulado

As rodadas seguem as regras do app: sorteio do Escolhido com ciclo, sem repetir o Escolhido do mês anterior; bloqueio de quem indicou o vencedor do mês anterior; ninguém vota no próprio jogo; e roleta com peso `máx(1; pontuação)`. Cartas e tema aleatório ficaram desligados.

| Regra | Fórmula |
|---|---|
| **Nova** | 2 + tipo (F2P +2, Steam Verde +1, Emulador +1) + donos (+0,5 cada, até +1) + 2 × pontos de voto (comum 2, Escolhido 4) |
| Antiga | 1 + tipo + 0,5 por dono, sem teto + pontos de voto (comum 1, Escolhido 2) |

O comportamento do grupo vem dos perfis calibrados pela rodada real de novembro de 2026:

- **Presença:** cerca de 90% por rodada. Max, 50%.
- **Indicação:** cada jogador tem uma chance própria de indicar F2P, Steam Verde ou Emulador, e uma média própria de donos.
  - Fernando, Jeff e Baluno puxam para emulador com vários donos.
  - Cristal, para F2P.
  - Smite e Markinhos, para Steam Verde sem donos.
- **Voto:** cada pessoa vota no jogo que mais quer. Pesam um apelo aleatório do jogo, um pouco da acessibilidade, já ter o jogo e o gosto pessoal.

As duas regras viveram exatamente as mesmas presenças, indicações e preferências. A diferença entre elas vem só da regra.

## Resultado em 10 anos (média das simulações)

| | Regra antiga | **Regra nova** | Diferença |
|---|---|---|---|
| Vence um jogo sem nenhum voto | 33,7% | **29,9%** | -3,8 pp |
| Vence o jogo mais votado | 28,4% | **31,6%** | +3,1 pp |
| Vence o jogo em que o Escolhido votou | 22,7% | **25,1%** | +2,4 pp |
| Jogos sem voto que vencem, em 10 anos | 40,5 | **35,9** | -4,5 |
| Jogos sem voto que vencem, por ano | 4,0 | **3,6** | -0,4 |
| Votantes do vencedor (média) | 1,92 | **2,10** | +0,17 |
| Chance média do vencedor na roleta | 15,5% | **16,6%** | +1,2 pp |
| Jogador que mais vence ÷ o que menos vence (por indicação) | 1,58× | **1,42×** | -0,16 |

Em 10 anos, a regra nova troca cerca de **4,5 vitórias de jogos sem voto** por vitórias de jogos votados. É a redução moderada que foi pedida: jogo sem voto continua podendo vencer, só que com menos frequência.

## Por jogador (média de 10 anos)

| Jogador | Vitórias (antiga) | **Vitórias (nova)** | Vence por indicação (nova) | Vezes Escolhido | Maior seca, em meses (nova) | Chance de 0 vitórias |
|---|---|---|---|---|---|---|
| Fernando | 14,0 | **13,3** | 13,8% | 11,1 | 24,3 | 0,00% |
| Felipe | 13,0 | **12,6** | 13,0% | 11,1 | 25,5 | 0,00% |
| Baluno | 12,6 | **12,4** | 12,7% | 11,1 | 25,9 | 0,00% |
| Cristal | 12,1 | **12,1** | 12,4% | 11,1 | 26,6 | 0,00% |
| Jeff | 11,9 | **11,7** | 12,0% | 11,1 | 27,0 | 0,00% |
| Cogu | 10,8 | **11,0** | 11,2% | 11,1 | 28,4 | 0,00% |
| Thiago | 10,9 | **10,9** | 11,1% | 11,1 | 28,7 | 0,00% |
| Arthur | 10,6 | **10,8** | 11,0% | 11,1 | 29,0 | 0,00% |
| Smite | 9,3 | **9,7** | 9,8% | 11,1 | 31,7 | 0,00% |
| Markinhos | 9,2 | **9,7** | 9,7% | 11,1 | 31,5 | 0,00% |
| Max | 5,7 | **5,8** | 10,2% | 9,3 | 45,4 | 0,40% |

- **Quem mais ganha com a regra nova:** Markinhos (+0,4), Smite (+0,4), Cogu (+0,3). São os que indicam jogos com poucos donos.
- **Quem mais perde:** Fernando (-0,7), Felipe (-0,4), Baluno (-0,3). São os que indicam jogos que muita gente já tem; o teto de donos corta essa vantagem.
- **Max** vence menos só porque falta metade das rodadas. Por indicação, está perto da média.
- Praticamente ninguém passa 10 anos sem vencer: só Max, em 0,4% das simulações. "Maior seca" é o maior intervalo, em meses, sem ganhar o jogo do mês.

## Que tipo de jogo vence

| Tipo | Indicações | Vitórias (antiga) | **Vitórias (nova)** | Vence por indicação (nova) |
|---|---|---|---|---|
| Steam Verde | 45,9% | 44,9% | **45,1%** | 11,4% |
| Emulador | 22,9% | 25,8% | **25,1%** | 12,7% |
| F2P | 13,6% | 17,3% | **16,6%** | 14,2% |
| Pago | 17,7% | 12,1% | **13,3%** | 8,7% |

O jogo pago sem nenhum bônus é o que mais ganha espaço: com o voto pesando mais, um jogo pago bem votado compete melhor.

## Quantos votos o vencedor costuma ter

| Votantes do vencedor | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |
|---|---|---|---|---|---|---|---|---|
| Regra antiga | 33,7% | 19,9% | 14,2% | 10,7% | 7,9% | 5,7% | 3,8% | 4,1% |
| **Regra nova** | 30,0% | 19,6% | 14,9% | 11,5% | 8,7% | 6,4% | 4,4% | 4,7% |

### Jogos sem voto que vencem em um ano

Em quantos anos (de todos os anos simulados) houve 0, 1, 2… vitórias de jogos sem voto:

| Vitórias sem voto no ano | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| Regra antiga | 0,7% | 4,5% | 12,4% | 20,8% | 23,9% | 19,4% | 11,4% | 4,8% | 1,6% |
| **Regra nova** | 1,4% | 7,1% | 16,8% | 23,5% | 23,8% | 16,0% | 7,5% | 2,9% | 0,8% |

O mais comum, nas duas regras, é ter 3 ou 4 meses por ano em que o jogo sem voto vence. A regra nova desloca a distribuição para baixo.

## Uma linha do tempo de exemplo (regra nova)

Esta é **uma** das simulações, mês a mês, com a regra nova. Mostra como seria viver 10 anos de clube: a sorte pesa bastante em qualquer linha do tempo isolada. "E" marca o voto do Escolhido. "Posição" é a colocação do vencedor no placar da rodada.

### Ano 1 (15/12/2026 a 15/12/2027)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2026 | 15/01/2027 | Max | Cristal | F2P | 0 | Jeff, Smite | 8,0 | 12,9% | 4º | 11 |
| 15/01/2027 | 15/02/2027 | Cristal | ⚠️ Thiago | Pago | 1 | **nenhum** | 2,5 | 5,0% | 8º | 8 |
| 15/02/2027 | 15/03/2027 | Fernando | Baluno | Emulador | 3 | Cristal, Felipe, Arthur, Smite | 12,0 | 24,7% | 1º | 8 |
| 15/03/2027 | 15/04/2027 | Baluno | ⚠️ Jeff | Emulador | 1 | **nenhum** | 3,5 | 6,9% | 5º | 9 |
| 15/04/2027 | 15/05/2027 | Markinhos | Baluno | Steam Verde | 2 | Fernando, Cristal, Arthur, Smite | 12,0 | 21,6% | 2º | 9 |
| 15/05/2027 | 15/06/2027 | Thiago | Smite | Steam Verde | 0 | Felipe, Thiago (E) | 9,0 | 17,5% | 2º | 9 |
| 15/06/2027 | 15/07/2027 | Felipe | Cristal | F2P | 1 | Fernando, Baluno, Felipe (E), Thiago, Cogu, Smite, Markinhos, Max | 22,5 | 47,4% | 1º | 8 |
| 15/07/2027 | 15/08/2027 | Jeff | ⚠️ Arthur | Steam Verde | 1 | **nenhum** | 3,5 | 5,9% | 7º | 10 |
| 15/08/2027 | 15/09/2027 | Smite | ⚠️ Baluno | Emulador | 1 | **nenhum** | 3,5 | 7,4% | 6º | 8 |
| 15/09/2027 | 15/10/2027 | Arthur | Smite | Steam Verde | 0 | Thiago, Arthur (E) | 9,0 | 17,6% | 2º | 9 |
| 15/10/2027 | 15/11/2027 | Cogu | Jeff | Emulador | 3 | Baluno, Thiago, Cogu (E), Arthur, Smite, Markinhos, Max | 20,0 | 40,4% | 1º | 9 |
| 15/11/2027 | 15/12/2027 | Baluno | Fernando | Emulador | 4 | Jeff, Felipe | 8,0 | 18,4% | 1º | 7 |

Destaque do ano: **Baluno** (3 vitórias). Vitórias sem voto: 4. Mais votado venceu: 4 de 12.

### Ano 2 (15/12/2027 a 15/12/2028)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2027 | 15/01/2028 | Cristal | Thiago | Emulador | 0 | Jeff, Baluno, Arthur | 9,0 | 17,5% | 2º | 9 |
| 15/01/2028 | 15/02/2028 | Cogu | Baluno | Emulador | 3 | Cogu (E), Smite, Markinhos | 12,0 | 23,5% | 1º | 9 |
| 15/02/2028 | 15/03/2028 | Markinhos | Felipe | F2P | 3 | Baluno, Cristal, Arthur, Markinhos (E), Max | 17,0 | 31,5% | 1º | 9 |
| 15/03/2028 | 15/04/2028 | Jeff | ⚠️ Arthur | Steam Verde | 2 | **nenhum** | 4,0 | 7,8% | 4º | 9 |
| 15/04/2028 | 15/05/2028 | Fernando | Thiago | Steam Verde | 0 | Fernando (E), Arthur | 9,0 | 15,7% | 2º | 10 |
| 15/05/2028 | 15/06/2028 | Max | ⚠️ Arthur | Steam Verde | 1 | **nenhum** | 3,5 | 6,7% | 5º | 9 |
| 15/06/2028 | 15/07/2028 | Thiago | ⚠️ Cristal | F2P | 0 | **nenhum** | 4,0 | 9,3% | 4º | 7 |
| 15/07/2028 | 15/08/2028 | Felipe | Baluno | Emulador | 1 | Arthur | 5,5 | 11,5% | 3º | 8 |
| 15/08/2028 | 15/09/2028 | Arthur | ⚠️ Felipe | Steam Verde | 2 | **nenhum** | 4,0 | 8,9% | 3º | 8 |
| 15/09/2028 | 15/10/2028 | Smite | Smite | Steam Verde | 0 | Felipe, Cogu, Max | 9,0 | 22,2% | 2º | 7 |
| 15/10/2028 | 15/11/2028 | Cogu | Fernando | Emulador | 2 | Smite | 6,0 | 10,7% | 4º | 9 |
| 15/11/2028 | 15/12/2028 | Arthur | Felipe | Steam Verde | 2 | Fernando, Jeff | 8,0 | 14,2% | 3º | 10 |

Destaque do ano: **Felipe** (3 vitórias). Vitórias sem voto: 4. Mais votado venceu: 4 de 12.

### Ano 3 (15/12/2028 a 15/12/2029)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2028 | 15/01/2029 | Felipe | Baluno | Pago | 4 | Arthur | 5,0 | 11,1% | 3º | 8 |
| 15/01/2029 | 15/02/2029 | Baluno | Cogu | F2P | 0 | Baluno (E), Cristal, Felipe, Arthur, Smite | 16,0 | 32,7% | 1º | 8 |
| 15/02/2029 | 15/03/2029 | Max | Jeff | F2P | 0 | Fernando | 6,0 | 11,0% | 4º | 10 |
| 15/03/2029 | 15/04/2029 | Markinhos | Smite | Steam Verde | 0 | Fernando, Jeff, Felipe, Thiago, Cogu, Arthur | 15,0 | 31,9% | 1º | 8 |
| 15/04/2029 | 15/05/2029 | Cristal | Fernando | Emulador | 3 | Cristal (E), Cogu | 10,0 | 19,6% | 2º | 9 |
| 15/05/2029 | 15/06/2029 | Jeff | Baluno | Emulador | 2 | Fernando, Jeff (E), Felipe, Thiago, Smite | 16,0 | 27,1% | 1º | 10 |
| 15/06/2029 | 15/07/2029 | Smite | Smite | Steam Verde | 0 | Fernando | 5,0 | 9,6% | 4º | 9 |
| 15/07/2029 | 15/08/2029 | Fernando | Felipe | F2P | 3 | Jeff | 7,0 | 12,4% | 4º | 9 |
| 15/08/2029 | 15/09/2029 | Thiago | ⚠️ Markinhos | Steam Verde | 0 | **nenhum** | 3,0 | 5,8% | 5º | 9 |
| 15/09/2029 | 15/10/2029 | Felipe | ⚠️ Jeff | Emulador | 2 | **nenhum** | 4,0 | 7,8% | 5º | 8 |
| 15/10/2029 | 15/11/2029 | Smite | Markinhos | Steam Verde | 0 | Jeff | 5,0 | 9,4% | 4º | 9 |
| 15/11/2029 | 15/12/2029 | Cogu | ⚠️ Thiago | Emulador | 1 | **nenhum** | 3,5 | 7,0% | 7º | 8 |

Destaque do ano: **Baluno** (2 vitórias). Vitórias sem voto: 3. Mais votado venceu: 3 de 12.

### Ano 4 (15/12/2029 a 15/12/2030)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2029 | 15/01/2030 | Arthur | Max | Pago | 3 | Felipe | 5,0 | 9,0% | 6º | 9 |
| 15/01/2030 | 15/02/2030 | Max | ⚠️ Cristal | Emulador | 1 | **nenhum** | 3,5 | 5,9% | 6º | 10 |
| 15/02/2030 | 15/03/2030 | Fernando | Jeff | Pago | 1 | Fernando (E), Arthur, Markinhos, Max | 12,5 | 22,7% | 1º | 9 |
| 15/03/2030 | 15/04/2030 | Cristal | Felipe | Steam Verde | 4 | Arthur, Smite, Markinhos | 10,0 | 21,3% | 1º | 8 |
| 15/04/2030 | 15/05/2030 | Thiago | Arthur | Steam Verde | 0 | Cogu | 5,0 | 10,2% | 3º | 9 |
| 15/05/2030 | 15/06/2030 | Baluno | Thiago | Steam Verde | 1 | Fernando, Jeff, Cogu, Smite, Markinhos | 13,5 | 27,3% | 1º | 8 |
| 15/06/2030 | 15/07/2030 | Markinhos | Jeff | Steam Verde | 1 | Cogu | 5,5 | 12,0% | 5º | 8 |
| 15/07/2030 | 15/08/2030 | Jeff | Thiago | Steam Verde | 0 | Cristal, Cogu, Arthur, Smite | 11,0 | 21,2% | 1º | 9 |
| 15/08/2030 | 15/09/2030 | Baluno | Arthur | Steam Verde | 0 | Fernando, Felipe | 7,0 | 16,3% | 3º | 7 |
| 15/09/2030 | 15/10/2030 | Jeff | Max | Steam Verde | 0 | Fernando, Jeff (E), Baluno, Cristal, Cogu, Smite, Markinhos | 19,0 | 39,6% | 1º | 8 |
| 15/10/2030 | 15/11/2030 | Markinhos | ⚠️ Fernando | Emulador | 2 | **nenhum** | 4,0 | 9,3% | 5º | 7 |
| 15/11/2030 | 15/12/2030 | Cogu | ⚠️ Smite | Steam Verde | 1 | **nenhum** | 3,5 | 6,6% | 7º | 9 |

Destaque do ano: **Max** (2 vitórias). Vitórias sem voto: 3. Mais votado venceu: 5 de 12.

### Ano 5 (15/12/2030 a 15/12/2031)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2030 | 15/01/2031 | Thiago | Felipe | Emulador | 2 | Fernando, Cristal, Smite, Markinhos | 12,0 | 23,5% | 1º | 9 |
| 15/01/2031 | 15/02/2031 | Fernando | ⚠️ Arthur | F2P | 1 | **nenhum** | 4,5 | 8,7% | 4º | 9 |
| 15/02/2031 | 15/03/2031 | Cristal | Cristal | F2P | 0 | Fernando, Jeff, Baluno, Thiago, Cogu, Arthur, Markinhos | 18,0 | 33,6% | 1º | 9 |
| 15/03/2031 | 15/04/2031 | Smite | Baluno | Emulador | 2 | Smite (E), Markinhos | 10,0 | 18,9% | 2º | 9 |
| 15/04/2031 | 15/05/2031 | Arthur | Jeff | Emulador | 2 | Fernando, Baluno, Cristal, Thiago, Markinhos | 14,0 | 29,5% | 1º | 8 |
| 15/05/2031 | 15/06/2031 | Felipe | Markinhos | F2P | 0 | Cogu | 6,0 | 12,9% | 3º | 8 |
| 15/06/2031 | 15/07/2031 | Thiago | Cristal | F2P | 1 | Cogu, Smite | 8,5 | 16,3% | 3º | 9 |
| 15/07/2031 | 15/08/2031 | Cristal | Baluno | Emulador | 4 | Fernando, Cogu, Max | 10,0 | 19,0% | 2º | 9 |
| 15/08/2031 | 15/09/2031 | Markinhos | Cristal | F2P | 3 | Fernando, Cogu, Arthur, Markinhos (E) | 15,0 | 28,6% | 1º | 9 |
| 15/09/2031 | 15/10/2031 | Jeff | Fernando | Emulador | 1 | Markinhos | 5,5 | 14,5% | 3º | 6 |
| 15/10/2031 | 15/11/2031 | Cogu | ⚠️ Cogu | Steam Verde | 1 | **nenhum** | 3,5 | 6,0% | 6º | 10 |
| 15/11/2031 | 15/12/2031 | Max | Baluno | Emulador | 5 | Fernando, Jeff, Cristal, Cogu, Markinhos | 14,0 | 23,5% | 1º | 10 |

Destaque do ano: **Cristal** (3 vitórias). Vitórias sem voto: 2. Mais votado venceu: 5 de 12.

### Ano 6 (15/12/2031 a 15/12/2032)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2031 | 15/01/2032 | Fernando | Cogu | Emulador | 2 | Smite | 6,0 | 12,4% | 3º | 8 |
| 15/01/2032 | 15/02/2032 | Baluno | Fernando | Emulador | 4 | Baluno (E), Cogu | 10,0 | 15,9% | 2º | 10 |
| 15/02/2032 | 15/03/2032 | Felipe | Cogu | Steam Verde | 3 | Thiago | 6,0 | 14,3% | 2º | 7 |
| 15/03/2032 | 15/04/2032 | Arthur | Max | Steam Verde | 2 | Felipe, Thiago, Smite | 10,0 | 17,4% | 2º | 10 |
| 15/04/2032 | 15/05/2032 | Baluno | Jeff | Steam Verde | 1 | Thiago, Cogu | 7,5 | 15,6% | 2º | 8 |
| 15/05/2032 | 15/06/2032 | Felipe | Fernando | Emulador | 3 | Felipe (E), Cogu, Markinhos | 12,0 | 20,2% | 1º | 10 |
| 15/06/2032 | 15/07/2032 | Markinhos | Markinhos | Steam Verde | 0 | Cogu | 5,0 | 11,0% | 3º | 8 |
| 15/07/2032 | 15/08/2032 | Thiago | Thiago | F2P | 1 | Fernando, Jeff, Baluno, Cristal, Felipe, Cogu, Smite, Markinhos | 20,5 | 38,3% | 1º | 9 |
| 15/08/2032 | 15/09/2032 | Max | Felipe | Steam Verde | 1 | Jeff, Cogu, Markinhos | 9,5 | 18,1% | 3º | 9 |
| 15/09/2032 | 15/10/2032 | Jeff | ⚠️ Max | Steam Verde | 1 | **nenhum** | 3,5 | 6,5% | 4º | 9 |
| 15/10/2032 | 15/11/2032 | Fernando | ⚠️ Smite | Steam Verde | 1 | **nenhum** | 3,5 | 6,6% | 6º | 9 |
| 15/11/2032 | 15/12/2032 | Cogu | ⚠️ Cogu | Steam Verde | 3 | **nenhum** | 4,0 | 7,8% | 5º | 9 |

Destaque do ano: **Cogu** (3 vitórias). Vitórias sem voto: 3. Mais votado venceu: 2 de 12.

### Ano 7 (15/12/2032 a 15/12/2033)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2032 | 15/01/2033 | Cristal | ⚠️ Jeff | Pago | 2 | **nenhum** | 3,0 | 5,3% | 9º | 10 |
| 15/01/2033 | 15/02/2033 | Smite | Thiago | Emulador | 1 | Fernando, Baluno, Cristal, Arthur | 11,5 | 27,4% | 1º | 7 |
| 15/02/2033 | 15/03/2033 | Arthur | Arthur | Pago | 2 | Baluno, Cristal, Felipe, Cogu, Markinhos | 13,0 | 28,6% | 1º | 9 |
| 15/03/2033 | 15/04/2033 | Max | Jeff | Pago | 1 | Max (E) | 6,5 | 16,0% | 2º | 7 |
| 15/04/2033 | 15/05/2033 | Cogu | Baluno | Steam Verde | 1 | Cristal, Cogu (E), Markinhos, Max | 13,5 | 23,3% | 1º | 10 |
| 15/05/2033 | 15/06/2033 | Baluno | ⚠️ Max | Steam Verde | 1 | **nenhum** | 3,5 | 6,0% | 6º | 10 |
| 15/06/2033 | 15/07/2033 | Thiago | ⚠️ Cogu | F2P | 1 | **nenhum** | 4,5 | 7,5% | 5º | 10 |
| 15/07/2033 | 15/08/2033 | Jeff | Felipe | Emulador | 3 | Fernando | 6,0 | 15,4% | 2º | 7 |
| 15/08/2033 | 15/09/2033 | Fernando | ⚠️ Markinhos | Steam Verde | 0 | **nenhum** | 3,0 | 5,9% | 7º | 8 |
| 15/09/2033 | 15/10/2033 | Arthur | Arthur | Steam Verde | 0 | Fernando, Max | 7,0 | 13,2% | 2º | 9 |
| 15/10/2033 | 15/11/2033 | Cristal | Thiago | Steam Verde | 2 | Jeff | 6,0 | 13,2% | 4º | 8 |
| 15/11/2033 | 15/12/2033 | Smite | Fernando | Emulador | 5 | Jeff, Baluno, Cristal, Cogu, Smite (E), Max | 18,0 | 32,1% | 1º | 9 |

Destaque do ano: **Jeff** (2 vitórias). Vitórias sem voto: 4. Mais votado venceu: 4 de 12.

### Ano 8 (15/12/2033 a 15/12/2034)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2033 | 15/01/2034 | Felipe | Markinhos | Steam Verde | 1 | Fernando, Baluno, Felipe (E), Thiago, Arthur | 15,5 | 34,4% | 1º | 8 |
| 15/01/2034 | 15/02/2034 | Markinhos | Thiago | Steam Verde | 2 | Jeff, Baluno, Cristal, Cogu, Arthur, Markinhos (E) | 18,0 | 43,9% | 1º | 7 |
| 15/02/2034 | 15/03/2034 | Felipe | Felipe | Steam Verde | 1 | Jeff, Cristal, Thiago, Arthur, Smite, Markinhos | 15,5 | 27,0% | 1º | 10 |
| 15/03/2034 | 15/04/2034 | Smite | Baluno | Emulador | 3 | Jeff, Cristal, Thiago, Markinhos | 12,0 | 25,3% | 1º | 8 |
| 15/04/2034 | 15/05/2034 | Arthur | Arthur | Steam Verde | 1 | Baluno, Felipe, Cogu | 9,5 | 23,5% | 2º | 7 |
| 15/05/2034 | 15/06/2034 | Cristal | Markinhos | Steam Verde | 2 | Fernando, Felipe, Thiago, Cogu | 12,0 | 24,2% | 1º | 8 |
| 15/06/2034 | 15/07/2034 | Markinhos | Baluno | Emulador | 0 | Thiago, Cogu, Arthur | 9,0 | 18,9% | 2º | 8 |
| 15/07/2034 | 15/08/2034 | Baluno | ⚠️ Fernando | F2P | 2 | **nenhum** | 5,0 | 8,9% | 4º | 9 |
| 15/08/2034 | 15/09/2034 | Thiago | Jeff | Emulador | 3 | Arthur, Smite | 8,0 | 13,8% | 2º | 10 |
| 15/09/2034 | 15/10/2034 | Fernando | ⚠️ Thiago | F2P | 1 | **nenhum** | 4,5 | 8,1% | 5º | 9 |
| 15/10/2034 | 15/11/2034 | Jeff | ⚠️ Arthur | Pago | 0 | **nenhum** | 2,0 | 4,1% | 8º | 8 |
| 15/11/2034 | 15/12/2034 | Max | Markinhos | Steam Verde | 0 | Thiago | 5,0 | 11,4% | 4º | 8 |

Destaque do ano: **Markinhos** (3 vitórias). Vitórias sem voto: 3. Mais votado venceu: 5 de 12.

### Ano 9 (15/12/2034 a 15/12/2035)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2034 | 15/01/2035 | Cogu | Felipe | Steam Verde | 1 | Fernando, Cogu (E) | 9,5 | 17,9% | 1º | 9 |
| 15/01/2035 | 15/02/2035 | Felipe | Fernando | Emulador | 3 | Jeff, Thiago, Cogu, Arthur, Smite | 14,0 | 26,9% | 1º | 9 |
| 15/02/2035 | 15/03/2035 | Thiago | Cogu | Steam Verde | 1 | Baluno | 5,5 | 10,7% | 4º | 9 |
| 15/03/2035 | 15/04/2035 | Fernando | Cristal | F2P | 0 | Fernando (E), Jeff, Baluno, Thiago, Arthur, Markinhos | 18,0 | 36,0% | 1º | 9 |
| 15/04/2035 | 15/05/2035 | Cristal | ⚠️ Baluno | Emulador | 2 | **nenhum** | 4,0 | 8,2% | 6º | 8 |
| 15/05/2035 | 15/06/2035 | Cogu | Fernando | Emulador | 3 | Cogu (E), Smite | 10,0 | 17,9% | 2º | 10 |
| 15/06/2035 | 15/07/2035 | Arthur | Markinhos | Steam Verde | 1 | Cristal | 5,5 | 13,1% | 3º | 8 |
| 15/07/2035 | 15/08/2035 | Jeff | ⚠️ Smite | Steam Verde | 0 | **nenhum** | 3,0 | 6,3% | 8º | 9 |
| 15/08/2035 | 15/09/2035 | Smite | Thiago | F2P | 2 | Baluno, Cristal | 9,0 | 24,0% | 2º | 6 |
| 15/09/2035 | 15/10/2035 | Markinhos | ⚠️ Markinhos | Steam Verde | 2 | **nenhum** | 4,0 | 7,5% | 5º | 9 |
| 15/10/2035 | 15/11/2035 | Cogu | Smite | Steam Verde | 0 | Cogu (E) | 7,0 | 14,9% | 2º | 8 |
| 15/11/2035 | 15/12/2035 | Max | Cogu | Steam Verde | 3 | Fernando, Jeff, Baluno, Cristal, Smite | 14,0 | 30,8% | 1º | 7 |

Destaque do ano: **Fernando** (2 vitórias). Vitórias sem voto: 3. Mais votado venceu: 4 de 12.

### Ano 10 (15/12/2035 a 15/12/2036)

| Rodada | Jogado até | Escolhido | Vencedor (indicação) | Tipo | Donos | Votos no vencedor | Pontos | Chance | Posição | Jogos |
|---|---|---|---|---|---|---|---|---|---|---|
| 15/12/2035 | 15/01/2036 | Markinhos | Arthur | Steam Verde | 1 | Baluno | 5,5 | 11,1% | 5º | 8 |
| 15/01/2036 | 15/02/2036 | Cristal | ⚠️ Smite | F2P | 1 | **nenhum** | 4,5 | 8,5% | 4º | 9 |
| 15/02/2036 | 15/03/2036 | Arthur | ⚠️ Thiago | Steam Verde | 0 | **nenhum** | 3,0 | 6,9% | 6º | 7 |
| 15/03/2036 | 15/04/2036 | Thiago | Jeff | Emulador | 1 | Baluno, Cristal, Felipe, Cogu, Arthur, Smite, Markinhos | 17,5 | 35,7% | 1º | 8 |
| 15/04/2036 | 15/05/2036 | Baluno | ⚠️ Fernando | Emulador | 3 | **nenhum** | 4,0 | 8,2% | 3º | 9 |
| 15/05/2036 | 15/06/2036 | Felipe | Baluno | Emulador | 1 | Felipe (E), Arthur, Smite | 11,5 | 24,0% | 2º | 8 |
| 15/06/2036 | 15/07/2036 | Jeff | Felipe | Steam Verde | 2 | Jeff (E), Thiago, Max | 12,0 | 25,0% | 1º | 8 |
| 15/07/2036 | 15/08/2036 | Smite | Arthur | Pago | 1 | Cristal, Thiago, Cogu | 8,5 | 17,2% | 2º | 9 |
| 15/08/2036 | 15/09/2036 | Fernando | Fernando | Emulador | 2 | Smite | 6,0 | 12,0% | 3º | 9 |
| 15/09/2036 | 15/10/2036 | Thiago | Arthur | F2P | 0 | Fernando, Baluno, Cristal, Felipe, Smite, Markinhos | 16,0 | 29,4% | 1º | 9 |
| 15/10/2036 | 15/11/2036 | Jeff | Jeff | Emulador | 3 | Baluno, Cristal, Felipe, Thiago, Cogu, Arthur | 16,0 | 30,5% | 1º | 9 |
| 15/11/2036 | 15/12/2036 | Arthur | Fernando | Emulador | 3 | Cogu, Arthur (E) | 10,0 | 20,0% | 1º | 9 |

Destaque do ano: **Arthur** (3 vitórias). Vitórias sem voto: 3. Mais votado venceu: 6 de 12.

### Placar final da linha do tempo de exemplo

| Jogador | Vitórias (nova) | Vitórias com a regra antiga, na mesma linha do tempo |
|---|---|---|
| Baluno | 15 | 13 |
| Fernando | 14 | 15 |
| Jeff | 13 | 13 |
| Thiago | 13 | 14 |
| Arthur | 13 | 10 |
| Felipe | 11 | 10 |
| Smite | 10 | 10 |
| Markinhos | 10 | 10 |
| Cristal | 8 | 11 |
| Cogu | 8 | 9 |
| Max | 5 | 5 |

Nesta linha do tempo, 32 dos 120 jogos do mês venceram sem nenhum voto (com a regra antiga, 33). O mais votado venceu 42 vezes.

A regra antiga, mesmo com o mesmo sorteio, tem outro histórico: um vencedor diferente muda quem fica bloqueado no mês seguinte, e a história se separa daí em diante.

## Conclusões

1. **A regra nova cumpre o objetivo.** A vitória sem voto cai de 33,7% para 29,9%, cerca de 4,5 jogos a menos em 10 anos. A surpresa continua: ainda são uns 3,6 por ano.
2. **O sistema fica mais justo entre jogadores.** A diferença entre quem mais e quem menos vence por indicação cai de 1,58× para 1,42×. Quem indica Steam Verde sem donos ganha espaço; quem indica jogos que muitos já têm perde um pouco.
3. **O voto pesa mais.** O mais votado vence 31,6% das vezes (antes 28,4%), e o vencedor tem em média 2,10 votantes (antes 1,92).
4. **O Escolhido ganha um pouco de força**: o jogo em que ele vota vence 25,1% (antes 22,7%).
5. **A sorte domina qualquer história individual.** Em 10 anos, cada jogador vence em média 10 a 13 vezes, mas uma linha do tempo isolada pode ter alguém com o dobro de outro.
6. **Revisão.** Pelo plano do consenso, se depois de uns 6 meses reais os jogos sem voto continuarem vencendo mais de 1 mês em cada 4, o próximo passo é a regra D (base 2 + 3 × voto + donos até +1).

## Limitações

- Os perfis de indicação e de voto foram estimados a partir de uma única rodada real. O grupo muda com o tempo: gente entra, sai e muda de gosto.
- Os votos simulados não são estratégicos. Ninguém vota "de favor" nem para atrapalhar outro jogo.
- Cartas e tema aleatório ficaram desligados.
- Os números absolutos dependem do modelo. Comparações entre as duas regras são mais confiáveis que os valores isolados.

## Como reproduzir

Os scripts estão em [simulacao/](simulacao/):

```bash
node docs/simulacao/sim10.mjs 2000 2026        # gera docs/simulacao/result10.json
node docs/simulacao/report10.mjs docs/simulacao-10-anos.md
```

Com a mesma seed (2026), o resultado é idêntico.
