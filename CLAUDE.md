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

There is no linter configured. There is no separate Vitest config either, so tests run in the default Node environment. Component tests render with `react-dom/server`'s `renderToStaticMarkup` rather than a DOM (see [src/pages/Roulette.test.tsx](src/pages/Roulette.test.tsx)).

## Architecture

**Single store.** All state lives in [src/store/clubStore.ts](src/store/clubStore.ts): one zustand store persisted to localStorage under the key `clube-do-jogo`. It holds:
- `players`
- `chosenHistory`: player IDs that were Escolhido in the current cycle.
- `history`: finished `RoundResult`s.
- `round`: the optional in-progress `Round`.

Every game-rule mutation is a store action. Pages are mostly thin views that call those actions.

**Round as a stage machine.** `Round.stage` (the `Stage` union in [src/types/index.ts](src/types/index.ts)) drives the flow. Each stage has its own page in `src/pages/` and its own route. The `/round` route (`ContinueRound` in [src/App.tsx](src/App.tsx)) redirects to the page for the current stage, so a reload resumes the round. Pages advance the round with `setStage(...)`. The actual order is:

optionalRules → players → chosen → abilities (only if cards are on) → theme (only if random category is on) → nominations → accessibility → voting → score → roulette → winner

`choosePlayer` decides whether to skip abilities and theme. The stage→path map and stage order are duplicated in `App.tsx` and [src/components/Layout.tsx](src/components/Layout.tsx). Layout also uses them for the progress bar and back button. When you add a stage, update the `Stage` type and both maps.

**Pure rule logic lives in `src/services/`.** This code is unit-tested:
- `scoring.ts`: the accessibility bonus (+2 F2P, +1.5 "Steam Verde", +0.5 per owner) and vote points. The Escolhido's vote is worth 2, unless the cards rule is on and the drawn card isn't `democracy`.
- `weightedRandom.ts`: draws the roulette winner using `crypto.getRandomValues`, weighted by `max(0, finalScore)`.
- `chosenPlayer.ts`: computes cooldown eligibility. The store's `choosePlayer` resets the cycle once nobody is eligible.
- `abilities.ts`: defines the optional "cards" abilities (`AbilityId`).
- `randomCategory.ts`: fetches a theme from the freetogame.com API, falls back to a local list, and filters out multiplayer-type categories.

**Score invariants.** `updateGameScores` recomputes `accessibilityScore`, `voteScore` and `finalScore` from scratch. `updateGame` and `vote` both call it. Ability effects instead change `finalScore` directly through `adjustGameScore`, `transferPoint` and `markEffect`. Each effect is tracked in `round.usedEffects` so it can only apply once.

**Persistence migrations.** The store's `merge` runs `normalizeRound` so that older persisted rounds (for example the legacy `rerollUsed` boolean) gain any new fields. Make new `Round` or `OptionalRules` fields backward compatible there.

**Backup.** [src/pages/History.tsx](src/pages/History.tsx) exports and imports JSON backups `{version:1, exportedAt, players, chosenHistory, history}`. `importBackup` validates the file with the `isBackup` guard and clears any in-progress round.

**Styling.** The app uses plain CSS files in `src/styles/`, all imported in [src/main.tsx](src/main.tsx). There are no CSS modules or framework. Shared primitives (`Button`, `Card`, `Confetti`) are in [src/components/UI.tsx](src/components/UI.tsx).

## Code style

Much of the existing code is written in a dense, mostly single-line style: many imports per line and one-line components and store actions. Newer code (for example `randomCategory.ts` and parts of the store) is formatted normally. When editing a file, match its local style.
