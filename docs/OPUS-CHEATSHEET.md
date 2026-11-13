# Opus cheat sheet for Hindsight

Everything a future Claude Opus session needs to maintain or extend this game without re-reading it all.

## File map
- index.html: the whole game. Styles, markup, the world-data JSON block and one script. No libraries, no network calls. It is also the builder's template.
- tools/build-world.mjs: Node script that writes a page with a new world in it. It reads index.html from the repo root, wherever you run it from.
- docs/HOW-IT-WORKS.md and docs/OPUS-CHEATSHEET.md: these docs. Each "## " section becomes one frame in Hindsight Hall.
- tests/check.mjs: the checks. Run them after every change.
- Script order in index.html: world build, seen store, living things, input, frame panel, journal, gossip, time and update, drawing, loop.

## World data schema
- Top level: title, subtitle, final, updates, bugs, investors, frames.
- title is also part of the seen-store key. subtitle is stored but the game never shows it.
- final: title and body, shown at the lighthouse.
- updates: d (date as YYYY-MM-DD), tag (label under the house, also picks the roof colour), t (title), why. An optional src is shown as a link if present.
- bugs: d, app (shown as the tag), t (title), reached (starts with "yes" means a big beetle), fix.
- investors: d, t (title), src (link, may be empty), kind (shown as the tag).
- frames: title, body. No date.
- Missing lists are treated as empty.

## Where things are placed
- All layout is in the block headed "build the world" near the top of the script.
- items = updates, bugs and investors, sorted by date, then update, invest, bug, then original order.
- x starts at 200. Each item moves on 74.4 (SLOT times 0.62). A new date adds a gap of 60 and a signpost.
- y by kind, with ROAD at 0: updates alternate 130 and 250 above the road, bugs alternate 130 and 230 below, investors all sit 390 above.
- HALL_X is -420. Frames hang on two rows of COLS (at least 5), 75 apart, centred on the hall; HALL_W grows to fit them.
- END_X is the last x plus 260. The lighthouse stands there.
- all = frames, items, lighthouse. Each gets an id of kind, colon, index.

## Where things are drawn
- draw() runs every frame: sky, clouds, stars, grass, market strip, road, signposts, hall, frames, lighthouse, then items and chickens sorted by y, then flies, the near ring, night tint and the bottom timeline.
- house(o, L) draws an update, beetle(o) a bug, stall(o) an investor note. The switch between them is the "draws" list inside draw().
- chicken() draws both hens and the hero. label() and bubble() draw text.
- The hall, the frames and the lighthouse are drawn inline in draw(), not in their own functions.
- update(dt) moves the hero, hens, bugs and clouds, finds the nearest thing and sets the Day or Night chip.
- openFrame(o) fills the detail panel. drawJournal() fills the journal.

## Adding a new kind of thing
- Add its list to the world data and a parser to the builder, then add the list to the world object there.
- Push it into items in the world-build block with a new kind name.
- Add the kind to the order and lane maps, and give it a y in the placement loop.
- Add it to KIND (label and CSS class) and add a k- colour class in the styles.
- Write a draw function and add it to the switch in draw().
- Show its fields in openFrame().
- Add a journal tab button with data-f set to the kind.
- Add a colour for it in the timeline strip and a line in gossip().
- Add its count to the lighthouse summary and to the builder's log line.
- Extend tests/check.mjs.

## How seen is stored and counted
- seen is a Set of ids such as update:3, bug:0, invest:2, frame:5 and final:N.
- It is saved to localStorage under the key hindsight.seen. plus the world title, a dot, and the number of things in all.
- So ticks reset when the title changes or anything is added or removed. That is on purpose: ids are indexes, and old ticks would point at the wrong things.
- Reordering without changing the count would still mis-tick. Avoid it, or change the title.
- An id is added in openFrame(), then saveSeen() and updCount() run.
- The count covers frames, items and the lighthouse. The hall itself is not lookable.
- Storage reads and writes sit in try/catch, so the game still runs without storage.

## Rebuild and test commands
- Run from the repo root, because --frames paths are resolved from the current folder.
- Public demo with both docs as frames:
  node tools/build-world.mjs --demo index.html --frames docs/HOW-IT-WORKS.md --frames docs/OPUS-CHEATSHEET.md
- Writing the demo over index.html is safe: only the data block is replaced, so it still works as the template.
- Private build, written outside this repo:
  node tools/build-world.mjs LAIFE-DIR OUT.html --frames docs/HOW-IT-WORKS.md --frames docs/OPUS-CHEATSHEET.md
- Read the log line it prints: updates, bugs, investor notes, frames. A zero usually means a wrong path.
- Test after every change and every rebuild:
  node tests/check.mjs

## Gotchas in the builder
- The data block is swapped in with a function passed to String.replace. A plain string would read a dollar sign and digit in the data as a pattern and corrupt it. Keep the function.
- Every "<" in the JSON is written as \u003c so data can never close the script tag early. Keep that too.
- A missing source file or frames file is skipped silently. Check the counts.
- Dates must look like 24 Oct 2026. Lines and rows without one are dropped.
- The private lighthouse text is hard-coded in the builder, not read from LAIFE.
- Frames lose bold marks and backticks. Links, tables and code fences show as raw text.
- The parsers are exported, but importing the file also runs a build. With no output path it exits with code 1.

## Gotchas in the game
- Keep it one self-contained file: no imports, no fonts, no fetches.
- Text goes in with textContent, never innerHTML. Keep it that way, as the data is not trusted markup.
- src is used as a link target as it stands, so only build from data you trust.
- Frames hang on two rows; the hall grows wider (COLS, HALL_W) as frames are added, never taller, so they never climb the roof.
- The lighthouse label is drawn from final.title, in capitals.
- For poking at a running world, window.__hindsight holds W, items, frames, all, seen, hero and openFrame.
- rnd() is seeded and also used at run time. The order of calls during set-up decides how the world looks.
- Items with no date sort to the start of the road.

## Before you ship
- Public repo: no LAIFE content anywhere. No real names, money, health, appointments or plans in index.html, docs, tests or commit messages.
- Never commit a page built from LAIFE to the public repo.
- Each doc starts with one "# " title and a one-line intro. Every "## " section is plain, short and makes sense on its own.
- Rebuild the demo so the frames match the docs, and check the frame count in the log.
- Run node tests/check.mjs and see it pass.
- Open the page: walk, tap, open one of each kind, open the journal, reach the lighthouse.
- Check a narrow phone-sized window as well.
- Confirm the "Looked at" count reaches its total.
