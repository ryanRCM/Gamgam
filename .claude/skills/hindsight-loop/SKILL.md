---
name: hindsight-loop
description: One turn of the Hindsight Terminal improvement loop. Play the game as the investor sent to take it down, fix the top bug, ship the feature that turns it into four times the impact the other way round, guard it with a check, log it and push. Use when asked to improve Hindsight Terminal, run the loop, or when the scheduled loop fires.
---

# The Hindsight loop

One run = **one item**, finished properly. Never batch. A half-done item is committed as WIP and never published.

## Where things are
- `terminal/index.html` + `terminal/pack/`: the game (about 7 MB, one page; read its header comment first). Some lines are over a million characters long: use Grep with `-o` and a short context, and make precise Edit calls. Never rewrite the whole file.
- `terminal/check.mjs`: regression checks at phone (390px) and laptop size. Run `node terminal/check.mjs`. It must end with **0 failed** before any commit that touches the game.
- `tools/playtest-lib.cjs`: Playwright helper for playing (`start('m'|'d')`, `act`, `txt`, `ui`, `shot`, `save`). Serve the game first with `python3 -m http.server 8765 --directory terminal` (in the background), and set `PLAYTEST_DIR` to a scratch folder for screenshots.
- `docs/INVESTOR-PLAYTEST.md`: the backlog. It has Bugs, The Locked List, **Bugs into features (4x)** and Not reached yet.
- `docs/LOOP-LOG.md`: one line per run. Read the last 10 lines first, so you don't redo or undo a past run.
- Live game: https://claude.ai/code/artifact/d0eeebeb-1383-499a-b2d6-59ba857d5af7

## The run
1. **Sync first.** Read the live artifact (Artifact `read`). If its HTML differs from `terminal/index.html`, live is newer: copy it over, commit "sync from live", and only then start. Never overwrite a newer live version.
2. **Pick the item**, in this order:
   - any failing check in `terminal/check.mjs`;
   - the next unfixed bug in "Fix first", then Major, then Minor;
   - the next Locked List item;
   - an item from "Not reached yet": play that system first and log what you find.
3. **Fix the bug at its root cause.** Find the actual line; don't just hide the symptom.
4. **Ship its 4x feature**, from the "Bugs into features" section: the thing the bug broke becomes four times as strong, the other way round. Keep it small enough to finish in this run. If it's too big, ship the smallest playable version and log what's left.
5. **Guard it.** Add a check to `terminal/check.mjs` that fails without your change and passes with it. Run the check before and after your change, and show both results.
6. **Play it as the investor.** Stay in character: the investor was sent to take the game down, can't help giving brilliant advice, and is harsh but always concrete. Play the area you touched at both sizes, plus five minutes of whatever comes next. Append every new bug to `docs/INVESTOR-PLAYTEST.md`, each paired with its own 4x feature line. Tick off fixed items with "✅ fixed (date)"; never delete them.
7. **Log and push.**
   - Add one line to `docs/LOOP-LOG.md`: date · item · fix · 4x feature · check name · ✅/❌.
   - Commit with a message saying what and why, then push to branch `claude/hindsight-loop`.
   - Open a draft PR against the default branch if none is open, or add to the open one.
8. **Don't publish to the live artifact.** Live changes only when Ryan says "publish". Then: read live, check it matches what you built on, publish, and re-run the checks against the published page.

## Rules
- One item per run. Stop after it, even if there's time left. Credits are real money.
- Never skip, delete or weaken a check to get to green.
- Never remove a feature to fix a bug; that's the opposite of 4x.
- When inserting code with a Node script, use a function replacement in `String.replace` (`$` in code breaks string replacements). Syntax-check the page after every edit: the check's "title loads with no errors" catches it.
- Public repo: no personal details about real people in docs, commits or the game's text.
- If something blocks the run (a missing tool, an unclear design call), log it in LOOP-LOG as ❌ with the one question for Ryan, and stop.
