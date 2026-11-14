# Hindsight loop log

One line per run, newest at the bottom: date · item · fix · 4x feature · check · result.

- 14 Nov 2026 · setup · game copied into `terminal/`, `terminal/check.mjs` reproduces both blockers (4 ❌: SAVES buttons hidden, CONTINUE crash after a mid-conversation save) · next run: Blocker 1 + four save slots · ❌ waiting for the first run
- 14 Nov 2026 · Blockers 1+2 · SAVES/ROADMAP buttons were folded into "More…" by the v21/v23 render wrappers (now fold only the main menu); CONTINUE crashed because load() dropped the street but kept loc=world and the open conversation (now closes dlg/wmenu and rebuilds the street) · 4x features (four save slots, share-a-life postcard) not started · checks: SAVES, ROADMAP BACK, CONTINUE · ✅ 8/8
- 14 Nov 2026 · Bug sweep · 28 of 33 playtest bugs fixed at the root (bugs 1-22, 24, 25, 27, 28, 31, 33), Fix-first list 1-11 done · 4x features started: recount on election reload, one character unlock per life, second press on deadly actions · checks: 12 per size · ✅ 25/25. Still open: 23 (tutorial line clamp), 26 (presidency bar cut off), 29 (top buttons wrap with a gun), 30 (wheel opens on whoever stands on you), 32 (lock game tell). Not yet played: everything in "Not reached yet".
