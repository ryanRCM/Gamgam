# How Hindsight works

A plain list of what the game is, how you play it, and how a world gets built.

## What Hindsight is
- A small browser game: one page, one file, drawn on a canvas.
- You are a crowned chicken walking a road through time.
- Every update is a house, every bug is a beetle, every investor note is a market stall.
- They sit along the road in date order, with a signpost at each new date.
- Hindsight Hall stands at the start of the road and holds framed docs. This text is one of them.
- A lighthouse called The Final Update stands at the far end.
- The aim is simple: walk the road and look at everything.

## Controls
- Walk: arrow keys or W A S D. Hold Shift to run.
- Look at the nearest thing: E, Space or Enter. A gold dashed ring shows what is nearest.
- Journal: J opens and closes it.
- Escape closes the open picture and the journal.
- Tap or click the ground to walk there.
- Tap a thing to walk to it and open it. If you are already close, it opens at once.
- Tap the prompt at the bottom of the screen to open what it names.
- Inside a picture: "Back in time" and "Forward" step through everything in order and move you there. "Close" shuts it.

## What you see on the road
- Houses (updates) stand above the road in two rows. The label under a house is its tag. Roof colour follows the tag.
- Beetles (bugs) wander below the road. A bug that reached the phone is drawn bigger.
- Stalls (investor notes) line the market strip at the top.
- Open one and you get its date, its tag and its details: the why for an update, the cause and fix for a bug, a source link where one exists.
- Once looked at, a house flag turns green, a beetle goes pale and settles with a tick, a stall shows a tick.
- The strip along the bottom is a map of the whole road: one mark per thing, green when seen, and a dot for you.

## The journal and the count
- The chip at the top reads "Looked at N/M". M is every house, beetle, stall, frame and the lighthouse.
- The journal lists all of them with a date and a tick once seen.
- Tabs filter the list: All, Updates, Bugs, Investors, Frames, Not seen.
- Tap a row to jump straight there and open it.
- What you have seen is saved in the browser, so it survives a reload when storage works.
- When the last one is ticked a message says nothing was missed.

## A living world
- A full day lasts three minutes. The chip at the top shows Day or Night.
- After dark the sky dims, stars come out, house windows glow and the lighthouse beam grows brighter.
- Butterflies fly by day and fireflies by night. Clouds drift and the grass sways.
- Hens wander, peck and sometimes follow you. There are at least ten, more in a big world.
- Hens gossip in speech bubbles about things near them, such as "In hindsight…" followed by an update's name, or "Bug over there!" for a bug you have not looked at.
- The world is laid out from a fixed seed, so it looks the same on every visit.

## Hindsight Hall and the lighthouse
- The hall is the purple-roofed building left of the start. Its frames are numbered and hang five to a row.
- Each frame is one section of a markdown doc: the section heading is the title, the rest is the text.
- An empty hall shows a note saying the frames arrive with the cheat sheet.
- The lighthouse is the last stop on the road. Opening it shows the closing words, how many updates, bugs, investor notes and frames are on the road, and how many you have looked at.

## The world data block
- The page holds one block of JSON in a script tag with the id world-data.
- The game reads it once at start-up and builds everything from it.
- It holds a title, a subtitle, the final text for the lighthouse, and four lists: updates, bugs, investors, frames.
- Swap the block and you get a different world. No other part of the page changes.
- The page in the repo carries a small demo world about the game's own history.

## How the builder makes a world
- tools/build-world.mjs is a Node script. It takes index.html as the template and writes a new page with the data block replaced.
- Given a LAIFE checkout it reads three files. Any that are missing are skipped.
- CHANGELOG.md: each starred line that starts with a date, with parts split by a middle dot, becomes an update (date, tag, what, why).
- brain/dev/Bug log.md: each table row that starts with a date becomes a bug (date, app, bug, reached the phone, cause and fix).
- apps/life/invest-seed.json: the rule, the split note, the growth note, the ANT status and news, and the how-to and guard notes each become an investor note.
- It prints how many of each it found.

## How markdown becomes frames
- Pass --frames followed by a markdown file. You can pass it more than once; frames keep that order.
- The file is cut at every line that starts with two hashes and a space.
- Each cut is one frame. Its first line is the title and everything after is the body.
- Anything before the first such heading, like the main title and intro line, is left out.
- Bold marks and backticks are removed. The body is shown as plain text with its line breaks kept.
- So each section should be short and make sense on its own.

## Public demo and private build
- The public repo holds the game, the builder and these docs. Its world is the demo, with nothing private in it.
- A demo build (the --demo flag) keeps the demo world from index.html and only swaps in the frames you pass.
- A private build points the builder at a LAIFE checkout and fills the road with the real history. Its title becomes "Hindsight · LAIFE".
- The private page is still one self-contained file, so it can be opened anywhere.
- That page must stay private. It is never committed to the public repo.
