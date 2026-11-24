# Balanceamento dos bônus de acessibilidade

> **Atualização:** o grupo decidiu **remover o teto de 2,0**. Os valores de cada opção da tabela de consenso continuam valendo, mas os bônus agora se somam sem limite. As simulações abaixo consideram o teto e não refletem mais a regra atual. A simulação de 67 meses com a regra atual, e o debate sobre a força dos votos, estão em [balanceamento-votos.md](balanceamento-votos.md).

Debate entre dois agentes (A, Designer de Regras, e B, Crítico) feito em outubro de 2026 para decidir se os bônus de acessibilidade estavam equilibrados e quanto vale a nova opção **Jogo de Emulador**. Todos os números já consideram o **ponto base** de 1 por jogo e o **peso mínimo 1** na roleta.

## Problema encontrado

Com os valores antigos (F2P +2, Steam Verde +1,5, +0,5 por dono, sem teto), a acessibilidade pesava mais que os votos:

- Grupo de 6: um F2P com 5 donos e **1 voto** ficava com 6,5 pts (31%), acima de um lançamento com **4 votos**, incluindo o do Escolhido (6,0 pts, 29%).
- Um jogo pago com 6 donos (+3) valia mais que um jogo gratuito (+2).
- Grupo de 8: a acessibilidade somada da rodada chegava a 13 pontos, contra 9 pontos de votos.

## Proposta do Agente A

F2P +1,5 sem somar donos, Steam Verde +1, Emulador +1, donos com teto de +1,5 e acessibilidade máxima de 2,5.

## Crítica do Agente B

- Concordou com o diagnóstico, com Steam Verde e Emulador em +1 (riscos equivalentes: crack/online quebrado contra configuração/multiplayer limitado) e com donos não somarem ao F2P.
- Discordou do F2P em 1,5: assim, um jogo crackeado com 3 donos (2,5) passaria à frente de um jogo gratuito. A acessibilidade deve medir a barreira de entrada; a qualidade do jogo, os votos já medem.
- Pediu **uma regra só** em vez de três, porque o grupo só marca caixas.

## Consenso (aceito pelos dois)

| Condição | Bônus |
|---|---|
| Ponto base (todo jogo) | +1,0 |
| Free-to-Play | +2,0 |
| Steam Verde | +1,0 |
| Jogo de Emulador | +1,0 |
| Por membro que possui | +0,5 |
| **Teto da acessibilidade somada** | **2,0** |

Consequências: o F2P sozinho já chega ao teto (donos não somam); Steam Verde ou Emulador chegam ao teto com 2 donos; um jogo pago chega ao teto com 4 donos. Efeitos de cartas não contam para o teto.

## Resultado nas simulações

| Cenário | Antes | Depois |
|---|---|---|
| Grupo de 6: lançamento com 4 votos incluindo o Escolhido | 6,0 pts / 29% | 6,0 pts / 34% |
| Grupo de 6: F2P com 5 donos e 1 voto | 6,5 pts / 31% | 4,0 pts / 23% |
| Grupo de 8 sem votos: F2P sem donos contra Steam Verde com 3 donos | 29% contra 38% | 32% contra 32% |
| Fatia da acessibilidade no peso total (grupo de 8) | 39% | 32% |

Os votos voltam a decidir, a acessibilidade continua relevante (cerca de 1/3 do peso) e a ordem fica coerente: gratuito ≥ quase todos já têm > Steam Verde/Emulador > ninguém tem.

Alternativa descartada por complexidade: um valor por dono proporcional ao tamanho do grupo (2,0 ÷ número de membros).
