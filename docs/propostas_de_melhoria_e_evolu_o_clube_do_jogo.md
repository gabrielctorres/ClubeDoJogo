# Propostas de Melhoria e Evolução — Clube do Jogo

> **Contexto:** Este documento consolida o diagnóstico cruzado entre o regulamento oficial (*Livro Oficial*), os estudos de balanceamento (`balanceamento-acessibilidade.md` e `balanceamento-votos.md`) e novas propostas de fórmulas e mecânicas de votação para o sistema.

---

## 1. Sincronização entre Documentação e Aplicativo

A análise revelou que o código do aplicativo (`src/services/scoring.ts`) já possui regras mais avançadas do que o texto do *Livro Oficial*. Antes de qualquer mudança matemática, recomenda-se alinhar a documentação:

* **Ponto base e peso mínimo:** Formalizar no regulamento oficial que todo jogo começa com **$+1,0$ ponto base** e possui **peso mínimo $1$** na roleta, evitando que jogos pagos sem donos e sem votos fiquem com $0\%$ de chance.
* **Mecânicas ocultas do app:** Documentar explicitamente no regulamento principal o funcionamento de **efeitos de cartas**, **tema aleatório** e o **bloqueio de quem indicou o jogo vencedor** na rodada seguinte.
* **Remoção de regra obsoleta:** Excluir a cláusula de desempate por "Cara ou Coroa" (Seção 7 do *Livro Oficial*), já que a roleta ponderada e os sorteios do app resolvem empates naturalmente por fatias proporcionais.
* **Consolidação histórica:** Unificar as regras vigentes em um único documento mestre (`CLUBE-DO-JOGO.md`) e marcar debates antigos (como o teto revogado de $2,0$ em `balanceamento-acessibilidade.md`) como `[ARQUIVADO]`.

---

## 2. Regras de Borda (*Edge Cases*) a Formalizar

Para evitar atritos em rodadas atípicas, o regulamento deve cobrir explicitamente os seguintes cenários:

| Situação | Problema Atual | Regra Sugerida |
| :--- | :--- | :--- |
| **Voto na própria indicação** | Assumido na simulação, mas não proibido no regulamento. Com votos valendo mais, votar em si mesmo distorce o peso. | Proibir formalmente o voto no próprio jogo indicado. |
| **Indicações repetidas** | O jogo vira opção única, mas não há regra clara sobre quem sofre o bloqueio da rodada seguinte em caso de vitória. | Se um jogo indicado por $2$ ou mais membros vencer, **todos** os autores entram no bloqueio do mês seguinte. |
| **Faltas no ciclo do Escolhido** | O ciclo só zera quando *todos* forem sorteados. Membros com baixa assiduidade travam a rotação. | Apenas membros **presentes na rodada** entram no sorteio; o ciclo reinicia quando todos os membros ativos (presentes em ao menos $1$ das últimas $3$ rodadas) tiverem sido sorteados. |
| **Cartas negativas e piso** | Não está claro se penalidades podem zerar um jogo. | Garantir que nenhum modificador negativo reduza o peso de um jogo abaixo de $1$. |

---

## 3. Refinamentos na Fórmula Atual (Evolução Incremental)

Partindo da recomendação de `balanceamento-votos.md` — onde o voto dobra de valor para equilibrar o peso da acessibilidade — três ajustes refinam o modelo sem alterar a dinâmica atual do clube:

$$\text{Pontuação Final} = 1\text{ (base)} + \text{Acessibilidade} + (2 \times \text{Pontos de Voto}) + \text{Cartas}$$

1. **Evitar soma dupla em Free-to-Play (F2P):** Jogos gratuitos já possuem barreira financeira zero. O bônus por membro que possui o jogo ($+0,5$ por dono, limitado a $+2,0$) deve ser aplicado **apenas a jogos pagos, Steam Verde ou Emulador**. Assim, jogos F2P ficam naturalmente limitados a $+2,0$ de acessibilidade.
2. **Suavizar vitórias sem voto (sem criar "voto de favor"):** Em vez de zerar a acessibilidade de jogos com $0$ votos (o que cria um salto brusco de até $6,5\times$ com um único voto), aplicar **metade do bônus de acessibilidade** para jogos que não receberam nenhum voto na rodada.
3. **Calibrar o peso do Escolhido:** Com o voto comum valendo $2$, o voto dobrado do Escolhido passa a valer $4$ (elevando sua taxa de vitória para cerca de $25\%$). Caso isso se mostre forte demais em rodadas com poucos jogadores presentes, ajustar o voto do Escolhido para **$3$ pontos** ($1,5\times$ o voto comum).

---

## 4. Novos Algoritmos para o Motor Atual

Caso o grupo queira manter o sistema de pontuação por acessibilidade + voto único + roleta, mas corrigir distorções de longo prazo:

### 4.1. Algoritmo de *Pity Timer* (Compensação de Seca)
Equilibra a sorte dos **jogadores** ao longo dos meses, reduzindo a disparidade entre quem indica jogos populares e quem indica jogos de nicho.
* **Mecânica:** Cada participante acumula $+0,5$ (ou $+1,0$) de bônus pessoal a cada rodada em que participa e sua indicação *não* vence. Quando seu jogo é sorteado, o contador zera.
* **Fórmula:**
  $$\text{Peso} = 1 + \text{Acessibilidade} + (2 \times \text{Votos}) + \text{Seca do Autor}$$

### 4.2. Curva de Retornos Decrescentes ($\sqrt{\text{Donos}}$)
Substitui o teto rígido de donos por uma curva logarítmica/quadrática calculada automaticamente pelo app.
* **Fórmula (para jogos não-F2P):**
  $$\text{Acessibilidade} = \text{Bônus do Tipo} + \sqrt{\text{Donos}}$$
* **Impacto:** $1$ dono $= +1,0$; $2$ donos $\approx +1,41$; $4$ donos $= +2,0$; $9$ donos $= +3,0$. Suaviza a vantagem de jogos que quase todo o grupo já tem sem cortes arbitrários.

### 4.3. Corte de Cauda (Eliminação dos Lanternas)
Resolve o problema de jogos sem apoio vencerem $27\%$ das vezes sem punir jogos acessíveis na pontuação.
* **Mecânica:** Calcula-se a pontuação normalmente, mas os **$25\%$ a $30\%$ piores jogos da rodada são eliminados** antes de girar a roleta (usando o menor número de votos como critério de desempate).

---

## 5. Mecânicas Alternativas (Mudança de Dinâmica Social)

Abordagens que substituem o voto único e o cadastro manual de acessibilidade por dinâmicas que capturam melhor o consenso do grupo, mantendo a roleta ponderada como etapa final.

### 5.1. Voto Ranqueado (Pódio Top 3) + Roleta *(Recomendada)*
Em vez de votar em apenas $1$ jogo, cada participante monta obrigatoriamente um pódio com **3 jogos diferentes** (proibido votar na própria indicação).

* **Pontuação por voto:**
  * **1º lugar:** $+3$ pontos
  * **2º lugar:** $+2$ pontos
  * **3º lugar:** $+1$ ponto
* **Poder do Escolhido:** Pódio com peso dobrado (**$6 / 4 / 2$ pontos**) ou focado na escolha principal (**$6 / 2 / 1$ pontos**).
* **Fórmula da Roleta:**
  $$\text{Pontuação Final} = \max\left(1;\; 1\text{ (base)} + \text{Pontos de Pódio} + \text{Cartas}\right)$$
* **Por que funciona:**
  * **Imune a voto estratégico:** Como o preenchimento das $3$ posições é obrigatório, ninguém consegue dar "voto egoísta" em apenas $1$ jogo para enfraquecer os concorrentes.
  * **Captura intensidade e consenso:** Diferencia o jogo favorito ($3$ pts) de uma boa segunda opção ($2$ pts), reduzindo drasticamente a chance de jogos sem apoio vencerem.
  * **Simplifica o cadastro:** Dispensa o preenchimento manual de Free-to-Play, Steam Verde, Emulador e contagem de donos, pois os próprios jogadores já filtram a acessibilidade ao montar seus pódios.

### 5.2. Voto por Aprovação (*Approval Voting*) + Roleta
Cada participante marca **todos** os jogos da lista que toparia jogar naquele mês ($+1$ ponto por aprovação), sem votar na própria indicação.

* **Poder do Escolhido:** Faz suas aprovações normais ($+1$ cada) e aplica **1 Destaque** ($+2$ pontos extras) no seu jogo favorito, totalizando $+3$ pontos naquela opção.
* **Veto Opcional:** Cada membro recebe $1$ ficha de Veto ($-2$ pontos) para aplicar em um jogo que rejeita (o jogo com Destaque do Escolhido fica imune a vetos).
* **Trava anti-egoísmo:** Exigir na interface que cada jogador aprove um mínimo de opções (ex.: pelo menos $3$ jogos ou $30\%$ da lista) para evitar que alguém aprove apenas $1$ jogo.
* **Fórmula da Roleta:**
  $$\text{Pontuação Final} = \max\left(1;\; 1\text{ (base)} + \text{Aprovações} + \text{Destaque} - \text{Vetos} + \text{Cartas}\right)$$

### 5.3. Economia de Fichas e Aposta Cega (*Blind Bidding*)
Substitui o sorteio do Escolhido e os bônus de acessibilidade por gestão de recursos ao longo dos meses.

* **Mecânica:** Todo membro presente recebe **$10$ fichas** por mês (acumulativas). Na votação, cada um distribui suas fichas secretamente entre os jogos concorrentes (proibido apostar no próprio). O total de fichas apostadas em cada jogo define o tamanho da sua fatia na roleta.
* **Efeito:** O sistema se autoequilibra. Jogadores economizam fichas em meses comuns para despejar um grande volume em lançamentos pagos que realmente querem jogar.

### 5.4. Funil de *Ban & Pick* + Roleta Igualitária
Transforma a escolha em um minigame ao vivo antes da roleta.

* **Mecânica:** Todos os jogos entram na mesa. O Escolhido começa banindo $2$ jogos; em seguida, cada participante bane $1$ jogo em turnos até restarem apenas **$3$ ou $4$ finalistas**. A roleta final é rodada com **chances iguais** (ex.: $25\%$ para cada finalista).

---

## 6. Quadro Comparativo Geral

| Abordagem | Elimina Cadastro de Acessibilidade? | Proteção contra Voto Estratégico | Reduz Vitórias sem Apoio? | Complexidade no App |
| :--- | :---: | :---: | :---: | :---: |
| **Fórmula Atual + Ajustes** | Não | Média | Parcial | Baixa |
| **Fórmula + *Pity Timer*** | Não | Média | Parcial | Baixa |
| **Pódio Top 3 + Roleta** | **Sim** | **Alta** | **Sim (forte)** | **Baixa** |
| ***Approval Voting* + Roleta** | **Sim** | Média (exige trava mínima) | **Sim** | **Baixa** |
| **Aposta de Fichas** | **Sim** | Alta | **Sim** | Média (saldo por usuário) |
| ***Ban & Pick* + Roleta** | **Sim** | Alta | **Sim** | Média (fluxo por turnos) |

---

## 7. Próximos Passos Sugeridos

1. **Escolher a linha de teste:** Decidir se o grupo prefere manter o motor de acessibilidade (testando o teto de donos $+$ *Pity Timer*) ou migrar para uma mecânica baseada puramente em preferência (**Pódio Top 3 + Roleta**).
2. **Rodar simulação de 67 meses:** Adaptar `src/services/scoring.ts` para simular a mecânica escolhida com o histórico do grupo e comparar a taxa de vitórias sem voto e o equilíbrio entre jogadores.
3. **Atualizar `CLUBE-DO-JOGO.md`:** Consolidar as regras aprovadas e as cláusulas de borda da Seção 2 no regulamento oficial.