# Balanceamento da força dos votos

> **Status:** em discussão. Nenhuma regra foi alterada no app nem no [CLUBE-DO-JOGO.md](../CLUBE-DO-JOGO.md). Este documento registra a simulação de 67 meses, as alternativas testadas e o debate entre dois agentes, feito em novembro de 2026. **Continuação:** o debate seguinte, com três agentes e consenso de 87%, está em [consenso-jogos-sem-voto.md](consenso-jogos-sem-voto.md).

## 1. Simulação de 67 meses

**Como foi feita.** O ponto de partida foi o backup de 23/11/2026 (11 jogadores, 3 meses reais). O próprio código do app (store e serviços) rodou mais 67 meses: sorteio do Escolhido, bloqueio de quem indicou o vencedor, bônus de acessibilidade, votos e roleta. Cartas e tema aleatório ficaram desligados. A simulação completa foi repetida 2.000 vezes para separar tendência de sorte.

O comportamento das pessoas foi modelado a partir da rodada real de novembro:

- **Perfil de indicação.** Cada jogador tem uma chance própria de indicar F2P, Steam Verde ou Emulador, e uma média própria de donos. Fernando, Jeff e Baluno puxam para emulador com vários donos; Cristal para F2P; Smite e Markinhos para Steam Verde sem donos.
- **Presença.** Cerca de 90% por mês; Max, que faltou em novembro, 50%.
- **Voto.** Ninguém vota no próprio jogo, como aconteceu em novembro. O voto vai para o jogo que a pessoa mais quer: um "apelo" aleatório do jogo, um pouco de peso para acessibilidade e para jogo que ela já tem, mais gosto pessoal.
- **Repetição.** 4% das indicações repetem um jogo já indicado na rodada.

Os números mostram tendências das regras, não previsões sobre as pessoas.

### Resultado com a regra atual

**Entre jogadores, o sistema é justo.** Cada indicação vence de 10,4% a 14,6% das vezes; a média é 12,1%.

| Jogador | Vitórias em 67 meses (média) | Vence por indicação | Vezes Escolhido | Chance de 0 vitórias |
|---|---|---|---|---|
| Fernando | 8,2 | 14,6% | 5,5 | 0% |
| Felipe | 7,5 | 13,9% | 6,4 | 0% |
| Baluno | 7,2 | 12,6% | 6,5 | 0% |
| Cogu | 6,7 | 11,7% | 6,5 | 0,05% |
| Cristal | 6,7 | 12,3% | 6,5 | 0% |
| Thiago | 6,3 | 11,6% | 6,5 | 0,1% |
| Jeff | 6,2 | 11,3% | 6,5 | 0% |
| Arthur | 6,1 | 11,9% | 6,4 | 0,15% |
| Smite | 5,8 | 10,4% | 5,5 | 0% |
| Markinhos | 5,5 | 10,5% | 5,4 | 0,25% |
| Max | 3,6 | 11,3% | 5,3 | 1,7% |

- Max tem menos vitórias só porque falta mais; por indicação, está na média.
- O Escolhido roda de forma justa, e o bloqueio impede que alguém vença dois meses seguidos.
- Em uma única linha do tempo, a sorte pesa muito. Em uma das simulações, Jeff venceu 11 vezes e Baluno só 2, com médias parecidas.

**O que decide a roleta.**

- **Composição do peso:** 27% ponto base, 39% acessibilidade, 34% votos.
- **Em 27% dos meses, vence um jogo sem nenhum voto.**
- O jogo mais votado vence 28% das rodadas. O jogo em que o Escolhido votou vence 21%.

| Chance de vencer por… | | | | | | |
|---|---|---|---|---|---|---|
| Tipo | F2P 15,4% | Emulador 13,3% | Steam Verde 11,9% | Pago sem bônus 8,7% | | |
| Donos | 0: 9,9% | 1: 11,7% | 2: 13,8% | 3: 15,5% | 4+: 18,7% | |
| Pontos de voto | 0: 7,5% | 1: 11,0% | 2: 14,6% | 3: 18,3% | 4: 21,7% | 5+: 28,2% |

Fernando e Felipe lideram por indicação porque indicam jogos que muita gente já tem. O bônus de donos sem limite é o que mais separa os jogadores.

## 2. Alternativas simuladas

Mesma simulação, calculando para cada rodada a chance de cada jogo sob cada regra.

| Regra | Vence sem voto | Mais votado vence | Jogo do Escolhido vence | Melhor ÷ pior jogador |
|---|---|---|---|---|
| Atual: 1 + acessibilidade + votos | 27% | 28% | 21% | 1,42× |
| Acessibilidade pela metade | 24% | 31% | 23% | 1,34× |
| Voto vale 2 | 20% | 34% | 25% | 1,41× |
| Bônus de acessibilidade só para jogo com voto | 14% | 34% | 25% | 1,42× |
| Voto vale 2 + bônus só com voto | 10% | 38% | 29% | 1,41× |
| Jogo sem voto fica fora da roleta | 0% | 39% | 30% | 1,54× |

Nenhuma dessas regras resolve o viés de donos: jogo com 4 ou mais donos continua vencendo cerca de 19%, contra 10% sem donos.

## 3. Ideia dos "sacos de bilhetes" (não simulada)

Para cada critério ter um peso fixo, a roleta vira 3 sacos de bilhetes:

- **Sorte:** dividido igualmente entre todos os jogos.
- **Acessibilidade:** dividido na proporção do bônus.
- **Votos:** dividido na proporção dos votos.

```
Chance = s × (1 ÷ nº de jogos) + a × (acessibilidade do jogo ÷ acessibilidade total) + v × (votos do jogo ÷ votos totais)
```

Aqui `s`, `a` e `v` são o tamanho de cada saco, e `s + a + v = 1`.

- **3 sacos iguais (1/3 cada):** garante terços exatos em todo mês, mas não fortalece o voto, que já está em 34%. Também dá **mais** chance a jogo sem voto que tenha bônus (no exemplo, de 15,8% para 17,9%).
- **20/30/50 + bônus só com voto:** o voto vira metade da roleta, e o jogo sem voto fica só com a fatia de sorte (no exemplo, 5%). Foi abandonado no debate por ser difícil de calcular à mão e por exigir regra extra para saco vazio.
- **Detalhe:** nos sacos, "voto vale 2" não muda nada, porque a proporção é a mesma. A força do voto é o tamanho do saco.

## 4. Debate entre os agentes

Dois agentes receberam os mesmos dados: o **Defensor do Equilíbrio**, para manter a roleta como roleta, e o **Defensor da Força do Voto**, para que o Jogo do Mês reflita o que o grupo quer jogar.

### Rodada 1: propostas

| | Equilíbrio | Força do voto |
|---|---|---|
| Regra | 2 (base) + acessibilidade + 2 × votos | 1 + acessibilidade **só com voto** + 2 × votos |
| Vence sem voto | 24% | 10% |
| Mais votado vence | 31% | 38% |
| Jogo do Escolhido vence | 23% | 29% |
| Melhor ÷ pior jogador | 1,34× | 1,41× |
| Divisão do peso | 34% base / 24% acessibilidade / 42% votos | — |

A regra do equilíbrio tem exatamente as mesmas chances da "acessibilidade pela metade", porque é a mesma regra multiplicada por 2.

### Rodada 2: críticas

**Do Equilíbrio contra o "bônus só com voto": o degrau do primeiro voto.** Pense num F2P com 3 donos (acessibilidade 3,5):

- Hoje ele tem peso 4,5 sem voto e 5,5 com um voto (+22%).
- Com o bônus só com voto, tem peso 1 sem voto e 6,5 com um voto: **6,5 vezes mais**.

Um único voto passa a "acender" o bônus inteiro, o que incentiva o voto de favor. O Escolhido, cujo voto vale 4 e também acende o bônus, sobe para 29%. A acessibilidade deixa de contar justamente nos jogos onde a roleta deveria agir.

**Da Força do Voto contra a regra do Equilíbrio.** Cair de 27% para 24% é pouco: são cerca de 16 meses em 6 anos jogando algo que nenhum dos outros escolheu. Mesmo com o voto dobrado, os jogos sem voto continuam somando cerca de 1/4 da roleta.

**Concessões**

- **Força do Voto:** admitiu que "ninguém votou" não é o mesmo que "ninguém quis", porque quem indicou quer o jogo e não pode votar nele. Abandonou os sacos 20/30/50.
- **Equilíbrio:** abandonou a base 2 e aceitou o voto valendo 2.
- **Os dois:** concordam que o bônus de donos sem limite é um problema e topam um teto.

### Meios-termos finais

| | Meio-termo do Equilíbrio | Meio-termo da Força do Voto |
|---|---|---|
| Regra | 1 + acessibilidade (donos no máximo +2) + 2 × votos | 2 + acessibilidade **só com voto** + 2 × votos |
| Vence sem voto | 20% (simulado, sem o teto) | ~14–18% (estimativa) |
| Mais votado vence | 34% (simulado, sem o teto) | estimado entre 31% e 34% |
| Jogo do Escolhido vence | 25% (simulado, sem o teto) | estimado entre 23% e 25% |
| Melhor ÷ pior jogador | 1,41× sem o teto; com teto, não simulado | ~1,36–1,38× (estimativa) |
| Divisão do peso | 20% base / 29% acessibilidade / 51% votos | não calculada |
| Degrau do 1º voto (F2P, 3 donos) | 4,5 → 6,5 (+44%) | 2 → 7,5 (3,75×) |

- **Posição final do Equilíbrio:** não aceita o "bônus só com voto". Se o grupo quiser mesmo derrubar a vitória sem voto, prefere tirar 1 ponto do jogo sem voto a zerar a acessibilidade dele.
- **Posição final da Força do Voto:** apoia o seu meio-termo se uma simulação confirmar "vence sem voto" até 18% e razão até 1,42×. Se não confirmar, fica com o "bônus só com voto" puro.

## 5. Recomendação

Os dois lados concordam que **o voto deve valer 2** (o do Escolhido, 4). Continua em aberto se um jogo sem voto mantém o bônus de acessibilidade.

O argumento do degrau é o mais forte do debate. Uma regra em que um voto vale mais por "acender" um bônus do que por escolher um jogo muda o comportamento do grupo, e a simulação não captura isso, porque os votos dela não são estratégicos.

Por isso, a recomendação é o **meio-termo do Equilíbrio**:

```
Pontuação Final = 1 (base) + Acessibilidade (donos no máximo +2) + 2 × Pontos de voto + Efeitos de cartas
Peso na roleta = máx(1; Pontuação Final)
```

O voto vira metade do peso da roleta, a conta continua fácil à mão e não há degrau nem voto de favor.

## 6. Pendências

- **Simular o teto de donos.** Ainda não foi testado, e é justamente a parte que ataca a vantagem de quem indica jogos que muitos já têm.
- **Simular o meio-termo da Força do Voto,** para confirmar as estimativas.
- **Decisão do grupo.** Se aprovada, a mudança fica em `src/services/scoring.ts` (`calculatePlayerVotePoints` e `calculateAccessibilityScore`), nos testes e nas seções 3, 4 e 8 do [CLUBE-DO-JOGO.md](../CLUBE-DO-JOGO.md).
