# Gamgam bible

Loaded into every session. Keep it short: every line here costs tokens on every turn.

## What's here
- `terminal/` — **Hindsight Terminal**, the main game (one 7 MB page + `pack/`). Live: https://claude.ai/code/artifact/d0eeebeb-1383-499a-b2d6-59ba857d5af7
- `index.html` — **Hindsight**, the chicken-road world. Its cheat sheet: `docs/OPUS-CHEATSHEET.md`. Read it before touching `index.html` or `tools/build-world.mjs`.
- `docs/INVESTOR-PLAYTEST.md` — the backlog (bugs, each with its 4x feature). `docs/LOOP-LOG.md` — one line per run.
- Improving the game = the `hindsight-loop` skill. Follow it.

## Token-lean rules (locked)
- Never Read `terminal/index.html` whole; lines run to 1.6M chars. Find code with
  `node -e` + `indexOf` and print ~1 KB around the hit. `grep -o` breaks on multi-line template strings.
- Edit the game with a Node script: `s.replace(old, () => new)` (function form, `$` safe), assert the match count is exactly 1.
- Verify with `node terminal/check.mjs` (must end `0 failed`), not screenshots. Screenshots only when a human will look.
- Probe scripts go in the scratchpad and serve the folder themselves (see `terminal/check.mjs`); don't leave background servers.
- Read the last 10 lines of `docs/LOOP-LOG.md`, not the whole playtest doc; jump to the section you need.
- No subagents for anything a few tool calls can do.
- Late patches wrap `render` (search `const r21=render`, `r23=render`): a fix may belong in the wrapper, not the original.

## Hyper-reactive (locked, for game development and for writing in general)
- Every conversation, meeting, chat line, headline and reaction reads the world **as it is right now** and says so: what you just did, who you are, how you look, what you own, where you are, what the world thinks.
- Accuracy to the present moment is the power. A line that could be said at any time is filler; cut it or make it react.
- In the game: record notable events as they happen (`R22.note`), and have people open with the freshest one. Chat, press, TV and NPCs all draw from the same live state.
- In writing: open with what the reader is living through now, name the specifics, never the generic.

## Hard rules
- Public repo: no personal details about real people in code, docs or commits.
- Never publish to the live artifact unless Ryan says "publish".
- Never skip or weaken a check to get green.
