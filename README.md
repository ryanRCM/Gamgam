# Hindsight 🐔

A living chicken world where a road runs through time. **Every update is a house, every bug is a beetle, every investor note is a market stall.** Walk the road, look at everything, and the journal ticks off what you've seen. At the end stands the lighthouse: **The Final Update**.

- **Play:** open `index.html` in a browser. Arrows/WASD or tap to walk, `E`/tap to look, `J` for the journal, `Shift` to run.
- **Alive:** day and night, lit windows, clouds, butterflies and fireflies, hens that wander, peck and gossip about what's near them, bugs that settle once you've looked at them.
- **Hindsight Hall:** the framed guide and the Opus cheat sheet (`docs/`), one frame per section.

## Build a world

`index.html` is the public demo (the game's own history). Build a real world from a LAIFE checkout:

```
node tools/build-world.mjs <laife-dir> build/hindsight.html --frames docs/HOW-IT-WORKS.md --frames docs/OPUS-CHEATSHEET.md
node tests/check.mjs build/hindsight.html
```

It reads `CHANGELOG.md` (updates), `brain/dev/Bug log.md` (bugs) and `apps/life/invest-seed.json` (investor notes).

> **Privacy:** this repo is public. A world built from LAIFE is private: `build/` is git-ignored, and the real build lives in the private LAIFE repo. Never commit it here.

## Check

`node tests/check.mjs [page.html]`: 14 checks at phone (390px) and laptop width.

## Hindsight Terminal (`terminal/`)

The main game: start under a bridge with a thousand dollars and a machine that sees tomorrow. Trade, stream, fight, act, run for president, buy countries, nuke them, leave the planet, and see what the world does about it. Every copy ends up different. Design: `docs/DESIGN-ESSAY.md`.

- **Play:** open `terminal/index.html` (serve the folder so `pack/` loads), or the live artifact.
- **Check:** `node terminal/check.mjs` (27 checks at phone and laptop size), `node tools/syntax.cjs`, and the smoke runs `node tools/smoke-run.cjs 1 200 phone` and `node tools/smoke-street.cjs 1 0 laptop`.
