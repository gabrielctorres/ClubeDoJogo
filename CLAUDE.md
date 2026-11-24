# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Clube do Jogo" is a client-only React SPA that runs a gaming group's monthly game-of-the-month vote. The official rules (in Portuguese) are in [CLUBE-DO-JOGO.md](CLUBE-DO-JOGO.md). That file is the source of truth for scoring, Escolhido (chosen player) cooldown and the weighted roulette. All UI text, test names and error messages are in Brazilian Portuguese, so keep new strings in Portuguese.

Stack: Vite + React 19 + TypeScript (strict), react-router-dom, zustand (with `persist`), framer-motion, lucide-react, and Vitest. It is deployed on Vercel; [vercel.json](vercel.json) rewrites every path to `index.html` so BrowserRouter routes work. There is no backend.

## Commands

- `npm run dev`: start the Vite dev server.
- `npm run build`: run `tsc -b` (type check), then `vite build` into `dist/`.
- `npm test`: run `vitest run` once over all `*.test.ts(x)` files.
- `npx vitest run src/services/scoring.test.ts`: run a single test file. Add `-t "<test name>"` to run one test.
- `npm run preview`: serve the built `dist/`.

There is no linter configured. There is no separate Vitest config either, so tests run in the default Node environment. Store tests ([src/store/clubStore.test.ts](src/store/clubStore.test.ts)) opt into jsdom with a `// @vitest-environment jsdom` comment so `persist` has `localStorage`, and reset the store with `useClubStore.setState` in `beforeEach`. Component tests render with `react-dom/server`'s `renderToStaticMarkup` rather than a DOM (see [src/pages/Roulette.test.tsx](src/pages/Roulette.test.tsx)).

## Architecture

**Single store.** All state lives in [src/store/clubStore.ts](src/store/clubStore.ts): one zustand store persisted to localStorage under the key `clube-do-jogo`. It holds:
- `players`
- `chosenHistory`: player IDs that were Escolhido in the current cycle.
- `history`: finished `RoundResult`s.
- `round`: the optional in-progress `Round`.

Every game-rule mutation is a store action. Pages are mostly thin views that call those actions.

**Round as a stage machine.** `Round.stage` (the `Stage` union in [src/types/index.ts](src/types/index.ts)) drives the flow. The order is:

optionalRules → players → chosen → abilities (only if cards are on) → theme (only if random category is on) → nominations → accessibility → voting → score → roulette → winner

- [src/services/stageFlow.ts](src/services/stageFlow.ts) is the single source of the order, paths and labels (`STAGES`), and of `getNextStage`/`getPreviousStage` (which skip inactive stages), `canGoBack` and `stageNumber`.
- **The URL follows the store, not the other way round.** In [src/App.tsx](src/App.tsx) every stage route is wrapped in `StageRoute`, which redirects to `round.stage`'s path when they differ. Pages therefore never call `navigate` to move through the round. They call `useAdvanceStage()` ([src/hooks/useAdvanceStage.ts](src/hooks/useAdvanceStage.ts)) or `setStage`, and the guard navigates.
- Because of that, actions that animate before moving on (`choosePlayer`, `spinWinner`) do **not** change the stage. The page advances when its animation ends.
- "Voltar" in [src/components/Layout.tsx](src/components/Layout.tsx) only goes back to the stages listed in `REVISITABLE`. Other stages (draw, nominations, votes, roulette) are one-way so they can't be redone.
- To add a stage, update the `Stage` type, `STAGES`, the `pages` map in `App.tsx` and, if it is optional, `isStageActive`.
- Page headings use `<StageEyebrow stage>` so "FASE N" counts only active stages.

**Pure rule logic lives in `src/services/`.** This code is unit-tested:
- `scoring.ts`: `BASE_SCORE` (2 points every game gets), the accessibility bonus (+2 F2P, +1 "Steam Verde", +1 Emulador, +0.5 per owner capped at `MAX_OWNER_BONUS` = +1) and vote points (`VOTE_POINTS` = 2). The Escolhido's vote is worth `CHOSEN_VOTE_POINTS` = 4, unless the cards rule is on and the drawn card isn't `democracy`. The values came out of balance debates in [docs/balanceamento-acessibilidade.md](docs/balanceamento-acessibilidade.md) and [docs/consenso-jogos-sem-voto.md](docs/consenso-jogos-sem-voto.md).
- `weightedRandom.ts`: draws the roulette winner using `crypto.getRandomValues`, weighted by `rouletteWeight` = `max(1, finalScore)`, so every game keeps a chance. `calculateWinProbability` and the roulette's `getSlices` use the same weights; use them for any displayed or stored chance. `secureRandomInt` is the shared random helper.
- `nominations.ts`: whoever nominated last round's winner (`history[0]`) is stored in `round.blockedNominatorIds` at `startRound` and only votes this round (no nomination, no "one-more" extra). Nomination order uses `getNominatorIds(round)`, not `participantIds`.
- `report.ts`: `createRoundReport` snapshots the whole round (games, who nominated/owned/voted, with names of the time) into `RoundResult.report` on `finishRound`. [src/pages/HistoryDetail.tsx](src/pages/HistoryDetail.tsx) (`/history/:id`) renders it; older results have no report.
- `chosenPlayer.ts`: computes cooldown eligibility. The store's `choosePlayer` resets the cycle once nobody is eligible, and it is a no-op once the round has an Escolhido.
- `abilities.ts`: defines the optional "cards" abilities (`AbilityId`).
- `randomCategory.ts`: fetches a theme from the freetogame.com API, falls back to a local list, and filters out multiplayer-type categories. `getRerollLimit` holds the reroll rule.
- `backup.ts`: `createBackup` and the `isBackup` guard.

**Score invariants.** `finalScore = BASE_SCORE + accessibilityScore + voteScore + effectScore`, always recomputed by `updateGameScores`. Ability effects (`adjustGameScore`, `transferPoint`) change `effectScore`, never `finalScore` directly, so they survive later recalculations. Each effect is tracked in `round.usedEffects`, keyed by `AbilityId`, so it can only apply once.

**Persistence migrations.** The store's `merge` runs `normalizeRound` so that older persisted rounds gain any new fields: the legacy `rerollUsed` boolean, the `effectScore` derived from old scores, vote points re-derived with `calculatePlayerVotePoints` (so votes saved on the old 1/2 scale become 2/4), the `emulator` flag, `blockedNominatorIds`, and the `fiscal` → `fun-inspector` effect key. It also reruns `updateGameScores` on every game so saved rounds pick up scoring changes such as the base point. Make new `Round` or `OptionalRules` fields backward compatible there. Ephemeral round state (such as the pending extra nomination or the "Finge Que Não Viu" replacement card) is stored or derived from the round, not kept in `useState`, so a reload never strands the page.

**Backup and history.** [src/pages/History.tsx](src/pages/History.tsx) exports and imports JSON backups `{version:1, exportedAt, players, chosenHistory, history}`; clicking a month opens its report. `RoundResult.report` is optional and lightly validated by `isBackup`. `importBackup` validates the file with the `isBackup` guard and clears any in-progress round. `RoundResult.nominatedByIds` is optional, because older results only stored names. Stats match players by ID and fall back to the name.

**Styling.** The app uses plain CSS files in `src/styles/`, all imported in [src/main.tsx](src/main.tsx). There are no CSS modules or framework. Shared primitives (`Button`, `Card`, `Confetti`, `StageEyebrow`) are in [src/components/UI.tsx](src/components/UI.tsx).

**Game feel.** Interaction feedback is a deliberate part of the app:
- [src/feel/sound.ts](src/feel/sound.ts): `sfx.*` sounds synthesized with Web Audio (there are no audio files). There is a mute toggle in the header, and the preference is kept in `localStorage` under its own key, outside the store.
- [src/feel/burst.ts](src/feel/burst.ts): click particles created directly in the DOM.
- [src/components/Feel.tsx](src/components/Feel.tsx): `CountUp` (animated numbers) and `ScoreDelta` (floating "+2"/"-3").
- [src/styles/feel.css](src/styles/feel.css): the related styles.
- `Button` plays `sound` (default `click`, `null` when the page plays its own) and bursts particles on primary buttons. A clickable `Card` lifts on hover and presses on tap, and `delay` staggers card entrances.
- The roulette lands on the real winner: `getSlices`, `getWinnerRotation` and `sliceAtPointer` in [src/pages/Roulette.tsx](src/pages/Roulette.tsx) are tested.
- framer-motion controls `transform` on animated elements, so don't put CSS `transition`/`transform` on those same properties. `MotionConfig reducedMotion="user"` and the `prefers-reduced-motion` CSS rules turn motion down for users who ask for it.

## Code style

Some files (for example `UI.tsx`, parts of `Theme.tsx`, `Players.tsx` and `Roulette.tsx`) still use a dense, single-line style. The store, services and most pages are formatted normally. When you substantially change a dense file, reformat it to the readable style.
