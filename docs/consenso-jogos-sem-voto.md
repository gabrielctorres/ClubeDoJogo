# Consenso: reduzir um pouco a vitória de jogos sem voto

> **Status:** **implementada** em novembro de 2026, no app (`src/services/scoring.ts`) e no [CLUBE-DO-JOGO.md](../CLUBE-DO-JOGO.md). Consenso dos três agentes, com confiança final de 87% cada. Este documento continua o debate de [balanceamento-votos.md](balanceamento-votos.md) e as ideias de [propostas_de_melhoria_e_evolu_o_clube_do_jogo.md](propostas_de_melhoria_e_evolu_o_clube_do_jogo.md).

**Pedido:** equilibrar o sistema e diminuir **pouco** a vitória de jogos que não recebem votos. Em novembro de 2026, Mass Effect venceu sem nenhum voto. A regra só seria aceita se os agentes chegassem a pelo menos 85% de confiança.

## Regra recomendada

```
Pontuação Final = 2 (base)
                + Tipo (F2P +2, Steam Verde +1, Emulador +1)
                + Donos (+0,5 por membro que possui, no máximo +1)
                + 2 × Pontos de voto (voto comum 2, voto do Escolhido 4)
                + Efeitos de cartas
Peso na roleta  = máx(1; Pontuação Final)
```

São três mudanças de número na regra atual: a base passa de 1 para 2, o voto passa a valer o dobro, e os donos contam no máximo +1 (o que equivale a 2 donos).

## Como foi feito

- **Simulador.** Um modelo do grupo com 11 jogadores, perfis de indicação calibrados pela rodada de novembro e presença de cerca de 90% (Max com 50%). Ele aplica o Escolhido com ciclo, o bloqueio de quem indicou o vencedor, a regra de não votar no próprio jogo e a roleta. Cada regra rodou 67 meses, repetidos 1.000 a 2.000 vezes. Todas as regras foram comparadas sobre as mesmas rodadas sorteadas (comparação pareada) e confirmadas com mais de uma seed.
- **Calibração.** O simulador dá 33,7% de vitória sem voto para a regra atual; o modelo de [balanceamento-votos.md](balanceamento-votos.md) dava 27%. Por isso os cortes devem ser lidos em termos relativos.
- **Agentes.** Três agentes debateram em 3 rodadas:
  - **Equilíbrio:** defendia manter a roleta como roleta.
  - **Força do Voto:** defendia que o voto pesasse mais.
  - **Justiça/Simplicidade:** defendia o equilíbrio entre jogadores e uma conta feita à mão.

## Resultados (simulação pareada, 2.000 × 67 meses)

| Regra | Vence sem voto | Mais votado vence | Jogo do Escolhido vence | Melhor ÷ pior jogador | Peso base / acess. / votos |
|---|---|---|---|---|---|
| Atual: 1 + acess. + votos | 33,7% | 28,4% | 22,6% | 1,59× | 27 / 41 / 33 |
| **A: base 2 + 2×voto + donos ≤ +1** | **30,0%** | **31,5%** | **25,0%** | **1,42×** | **34 / 24 / 42** |
| B: base 1 + 2×voto + donos ≤ +1 | 25,3% | 35,1% | 27,7% | 1,53× | 21 / 29 / 50 |
| C: base 2 + 2×voto + donos ≤ +2 | 30,1% | 31,4% | 24,9% | 1,49× | 34 / 26 / 41 |
| D: base 2 + 3×voto + donos ≤ +1 | 24,8% | 35,6% | 28,1% | 1,47× | 28 / 20 / 52 |
| E: A com o Escolhido valendo 3 | 30,6% | 30,8% | 23,5% | 1,42× | 35 / 25 / 40 |
| F: B com o Escolhido valendo 3 | 25,9% | 34,3% | 26,0% | 1,53× | 21 / 30 / 49 |
| G: base 2 + 2×voto + "+1 se tiver dono" | 30,6% | 31,0% | 24,7% | 1,41× | 33 / 26 / 41 |

Outras regras testadas na rodada 1 (mesmo modelo, 1.000 simulações):

| Regra | Vence sem voto | Melhor ÷ pior | Por que saiu |
|---|---|---|---|
| Voto ×2 (sem mexer em base e donos) | 25,5% | 1,63× | Corta mais que "pouco" e piora a justiça. |
| −1 ponto para jogo sem voto | 24,7% | 1,76× | Pior justiça de todas: pune quem indica Steam Verde sem donos. |
| Metade da acessibilidade sem voto | 26,8% | 1,61× | O 1º voto dobra o peso (degrau) e não melhora a justiça. |
| Acessibilidade só com voto | 17,9% | 1,62× | Corta demais e cria um degrau de 5,5×, que convida ao voto de favor. |
| √donos | 34,8% | 1,62× | Não reduz nada e não dá para calcular de cabeça. |
| Teto de donos em +2 (sozinho) | 33,8% | 1,59× | Quase sem efeito: jogo com 5 ou mais donos é raro. |

**Degrau do 1º voto** (F2P com 3 donos): hoje 4,5 → 5,5 (+22%); na A, 5 → 7 (+40%), ou 5 → 9 com o voto do Escolhido; na D, 5 → 8 (+60%); com acessibilidade só com voto, 1 → 5,5 (5,5×).

### A rodada real de novembro com a regra A

| Jogo | Votos | Atual | Regra A |
|---|---|---|---|
| Zelda Breath of the Wild | 3 | 18,8% | 18,5% |
| Shadow of the Colossus | 2 (com o Escolhido) | 15,9% | 17,6% |
| Rayman Raving Rabbids | 2 | 13,0% | 13,9% |
| We Were Here | 1 | 11,6% | 11,1% |
| Mad Max | 1 | 10,1% | 10,2% |
| GTA San Andreas | 1 | 8,7% | 9,3% |
| The Last of Us | 0 | 8,7% | 7,4% |
| **Mass Effect (venceu)** | 0 | **7,2%** | **6,5%** |
| Hell Clock | 0 | 5,8% | 5,6% |
| **Soma dos jogos sem voto** | | **21,7%** | **19,4%** |

## O debate

**Rodada 1, propostas.**
- **Equilíbrio:** base 2 + 2×voto, sem teto de donos (30,1%, 1,50×). Confiança: 65%.
- **Força do Voto:** base 1 + 2×voto + donos ≤ +1, a regra B (25,3%, 1,54×). Confiança: 70%.
- **Justiça:** base 2 + 2×voto + donos ≤ +1, a regra A (30,0%, 1,43×). Confiança: 60%.

Pontos em que os três concordaram já de início:
- O voto deve valer 2.
- O teto de donos só funciona em +1.
- "−1 sem voto", "acessibilidade só com voto" e "metade da acessibilidade sem voto" pioram a justiça ou criam degrau.

**Rodada 2, críticas.**
- **Força do Voto** deixou a B: B e D cortam cerca de 25% em termos relativos, o que não é "pouco". Passou a apoiar a A e a sugerir a D como plano B. Confiança: 80%.
- **Equilíbrio** trocou a sua C pela A, que corta o mesmo e é mais justa (1,49× → 1,42×). Confiança: 82%.
- **Justiça** manteve a A e condicionou chegar a 85% a três pontos: o que o pedido quis dizer com "pouco", o recálculo de novembro e o aceite do teto +1 pelos outros dois. Confiança: 78%.
- E e G foram rejeitadas: uma exceção para o Escolhido e o critério novo "tem dono" acrescentam regra sem ganho.

**Rodada 3, fechamento.** Os três pontos foram respondidos:
- A frase do pedido ("diminuir pouco") indica um corte moderado, de 10% a 15% em termos relativos.
- Em novembro, a regra A tira pouco dos jogos sem voto e não mexe no mais votado.
- Todos aceitaram o teto em +1.

**Confiança final: 87% para os três agentes.**

## Por que a regra A

- **Diminui pouco, como pedido.** A vitória sem voto cai cerca de 11% em termos relativos: de 33,7% para 30,0% no simulador, o que equivale a algo como 27% → 24% na escala do doc anterior.
- **Equilibra os jogadores.** A diferença entre quem mais e quem menos vence por indicação cai de 1,59× para 1,42×, o melhor resultado entre as regras que mantêm donos e voto. Quem indica Steam Verde sem donos (Smite, Markinhos) sobe, e Fernando, que indica emulador com muitos donos, desce.
- **O voto passa a ser a maior fatia do peso** (33% → 42%), e o mais votado vence mais (28% → 31,5%).
- **Não cria degrau.** O 1º voto aumenta o peso em 40%; ele não "acende" bônus.
- **Dá para calcular de cabeça.** Só mudam três números.

## Ressalvas

1. **A acessibilidade perde peso**, de 41% para 24%, e o 3º dono em diante não soma nada. É uma troca consciente para ganhar justiça entre jogadores.
2. **Jogo sem voto continua vencendo**, em cerca de 3 de cada 10 meses. Isso é intencional, já que o pedido foi diminuir pouco.
3. **O Escolhido vence um pouco mais** (22,6% → 25,0%). Se incomodar, o ajuste é a regra E, com o voto do Escolhido valendo 3 (23,5%).
4. **Os números são de um modelo.** Os votos simulados não são estratégicos e os perfis são estimados.
5. **A diferença que sobra entre jogadores (1,42×) não vem da regra.** Ela vem de as pessoas votarem nos jogos que já têm, e nenhum bônus elimina isso.

## Plano B e revisão

- **Revisar depois de uns 6 meses** com dados reais, contando quantas vezes um jogo sem voto venceu e quantas vezes venceu o jogo do Escolhido.
- **Trocar para a D** (base 2 + 3×voto + donos ≤ +1: 24,8% sem voto, 1,47×) se os jogos sem voto continuarem vencendo mais de 1 mês em cada 4, ou se o grupo sentir que nada mudou. O custo é um degrau maior no 1º voto: +60% em vez de +40%.

## Implementação

- `src/services/scoring.ts`:
  - `BASE_SCORE = 2`;
  - `calculateAccessibilityScore` com os donos limitados a +1;
  - votos multiplicados por 2 em `calculatePlayerVotePoints`: 2 para o voto comum e 4 para o Escolhido (o Escolhido vota 2 quando as cartas estão ligadas e a carta não é `democracy`).
- `normalizeRound` já recalcula os placares das rodadas salvas.
- Atualizar os testes de `scoring` e da store, e as seções de pontuação do [CLUBE-DO-JOGO.md](../CLUBE-DO-JOGO.md).
- Os textos da tela de votação e de placar que citam os valores de voto e de donos.
