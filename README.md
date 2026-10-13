# 🎲 Clube do Jogo

App web para a votação mensal do nosso clube do jogo: sorteia o **Escolhido**, coleta as indicações, soma os pontos de acessibilidade e de votos e gira uma **roleta ponderada** para decidir o **Jogo do Mês**.

As regras oficiais estão em [CLUBE-DO-JOGO.md](CLUBE-DO-JOGO.md).

## Como funciona uma rodada

1. **Regras opcionais**: liga ou desliga as *Cartas do Escolhido* e a *Categoria aleatória*.
2. **Jogadores**: cadastra a turma e marca quem participa.
3. **Escolhido**: sorteio com cooldown. Quem já foi Escolhido no ciclo fica de fora, e quem foi no mês anterior não repete nem na virada do ciclo.
4. **Habilidades** e **Tema**: só aparecem se a regra opcional estiver ligada.
5. **Indicações**: cada participante indica 1 jogo. Indicações repetidas viram uma opção só.
6. **Acessibilidade**: Free-to-Play +2, Steam Verde +1,5, +0,5 por membro que já tem o jogo.
7. **Votação**: voto comum vale 1 ponto e o voto do Escolhido vale 2.
8. **Placar** e **Roleta**: a pontuação vira o peso de cada jogo na roleta.

## Rodando localmente

Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Roda os testes (Vitest) |
| `npm run build` | Checa os tipos e gera o build em `dist/` |
| `npm run preview` | Serve o build gerado |

## Dados e backup

Não há servidor: tudo fica no `localStorage` do navegador onde o app foi usado. Cada navegador e cada aparelho tem os seus próprios dados.

Para guardar ou levar os dados para outro lugar, use **Histórico → Exportar JSON** e depois **Importar JSON** no outro navegador. A importação substitui os dados atuais.

## Tecnologias

React 19, TypeScript, Vite, Zustand, Framer Motion e Vitest. Os efeitos sonoros são gerados no navegador com Web Audio, sem arquivos de áudio. O deploy é feito na Vercel.
