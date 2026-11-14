# The Takedown Memo

I was sent to get Hindsight Terminal pulled. It crashes on CONTINUE, hides its own save buttons and lets me murder a doctor for the price of a taxi.
It also killed me with one stray tap four minutes in, and I laughed out loud, which I am not paid to do.
Verdict: a mess with a hit buried inside it. Fix the list below, in order, and I will deny ever writing this.

How this was tested: build "v21 · PLAYTEST FIXES", served locally and driven in Chromium through Playwright at 390x844 (touch) and 1280x800 (keyboard and mouse). Screenshots are in the session's `scratchpad/playtest/` folder; filenames are given in brackets. The game itself was not edited. Where I skipped a grind with `window.HS`, I say so. This was cut short: see "Not reached yet" at the end, and do not read silence about a system as a clean bill of health.

## Playthrough

1. **Title, phone.** A man under a bridge, a barrel fire, a skyline. Moody, readable, and the tagline does real work. I hate that I wanted to press NEW LIFE. The fix it still needs: nothing moves and nothing is at stake for the first five seconds. Put a ticking price on that screen. [m_01_first.png]
2. **Title, desktop.** Same scene in a big left pane, menu on the right. The keyboard hint line along the bottom is printed straight through the SOUND / UNMAKE / RESET buttons. Move the hint up one row. [d_01_first.png]
3. **Pick a character.** Four slots. Three say LOCKED. Tapping one says "Locked. The Gambler goes first." I died twice and they were still locked. Three dead buttons on your second screen is not mystery, it is a shop with the shutters down. Unlock one per death, and say so on the button. [m_02_pick.png]
4. **Builder.** FACE / BODY / EXTRA / TRAITS, colour swatches, ROLL THE DICE, a traits page where bad traits pay for good ones. This is good and streamers will spend ten minutes here making something hideous. Let them: add a "share this face" code. [m_03_builder.png]
5. **Intro under the bridge.** "The city glitters across the river like it owes you money." Inner voices labelled NERVE and GUT argue with you. The writing is the best thing in the building. [m_09_intro_1.png]
6. **The house in the field.** Three skill checks: 97%, 100%, 100%. That is not a check, that is a formality. Make one of the three a real coin-flip with a funny failure, because the first fail is the first clip. [m_09_intro_3.png]
7. **The terminal.** Five group tabs, four sub-tabs, an ability box, a slider, a jump button, four assets, and the BUY buttons below the fold. The two-line tutorial at the bottom is cut off mid-sentence with an ellipsis, on phone and on desktop. I worked it out because I read the code. Your viewer will not. One instruction at a time, with the right button glowing. [m_12_desk.png, d_06_desk.png]
8. **First trade.** Slid back to the low, JUMP, BUY ALL, slid to the present, JUMP, SELL ALL. $1,000 became $15,035 in under a minute. That is your hook and it works. Then a bottle called EVERCLEAR appears on a crate and starts talking to me, with its speech box laid over the dimmed buy buttons. Lovely idea, clumsy staging. [m_15_sold.png]
9. **The dud coin.** On my desktop life OBOL was worth $0.28 at the present and showing -32%. Reading `genMarket`, about one new life in eight gets a dud main coin. So one viewer in eight opens the game and the famous trade does nothing. Never roll a dud on generation one. [d_06_desk.png]
10. **RAKE (mines).** Bet 10%, hit a mine on the first tile, lost $1.5K. Then the game offered "REWIND 60s · 25 flux · same board". I went back, the mines were marked, I took four gems and cashed out at 2.53x. Cheating a casino with a time machine while a "SECURITY IS WATCHING" bar creeps up is the single most clippable thing I saw. The EVERCLEAR sprite sits on top of the RESET button the whole time. [m_18_rake.png, m_23_rake_play.png, m_26_rake_rewound.png, m_27_rake_gems.png]
11. **THE BOARD.** Eight yes/no contracts, build a slip, LOOK forward for the result. I paid for a LOOK, was told "IT DOES NOT", bet the other way, got paid. Smart. But the contract names are in the smallest type on the page, and one board listed "Bad Idea wins the 3.40" twice. [m_19_board.png, m_28_board_result.png]
12. **Where the upgrades live.** TETHER, COIL, CLOAK, MEMORY and DARK POOL, the things you spend money on, are under POWER, then LAB. I found them by accident. Put a shop button next to the cash. [m_29_lab.png]
13. **Getting up.** The house: fridge, coffee, mirror, dog, pipe, cellar. Half the phone screen below the room is empty, and a button reading "GOD MODE · OFF / nothing can hurt you" is sitting there for every player. That is a developer tool wearing a contradictory label. [m_31_getup.png]
14. **Death number one.** I tapped the floor to walk. The tap landed on the pipe. A tap on an object walks over and uses it, and the third hit of the blue kills you. No confirm. "Found under the Carrow Bridge by a jogger. The city did not slow down." Four minutes, dead, and it is the funniest thing in the game. Keep the death. Signpost the gamble: make the pipe pulse red on the third hit so the streamer chooses it on camera. [m_38_dead_reload.png]
15. **Rebirth.** BE BORN AGAIN. 2044, a new name, a shorter intro: "You grew up hearing that someone, once, got out from under the bridge." The presidency target went from $1B to $4B. This is a proper loop and the short second intro is exactly right. The grave on the monitor is a lovely touch. [m_39_reborn.png]
16. **The field.** One stray tap on the gnome later in the run buried half my cash ("The gnome is now the richest thing in the county"). Funny line, same problem: one tap, no warning. [m_34_outside.png]
17. **The street, phone.** Full-screen, dark, handsome. Then: no visible way to move. The top row offers FISTS, MENU, ZOOM, MUSIC, GOD and BODY, two of which are dev tools. The strip at the bottom reads "H G B C R P W K D" with no key. I found out by reading the code that you tap the ground and tap the strip. Label the strip with icons and show a ghost finger once. [m_37_world_5s.png]
18. **MENU.** The help text describes a left thumb stick, a right thumb stick, jumping off walls and Space to jump. None of those exist any more. The close button, BACK TO THE STREET, is below the bottom of a 390x844 screen. While the menu is open the camera shows sky and a rooftop, not you. [m_43_menu.png]
19. **TAXI.** $15 anywhere, fifteen destinations. Good. After the ride the menu is still open over the scene and you have to scroll to close it. [m_44_taxi.png]
20. **The crash.** I reloaded the page with the taxi list open. CONTINUE did nothing, a red bar said "BUG: Cannot read properties of null (reading 'me')", and the save was stuck until I edited local storage by hand. It happened again after talking to a bystander. The game autosaves every five seconds, so any phone that drops the tab mid-conversation loses the run. This is the bug that gets you a refund thread. [m_48_cont_bug.png]
21. **The wheel.** Tap a person and twelve round buttons fan out: TALK, CHAT, ASK, give cash, PUNCH, BEAT, NEEDLE, ROB, SNAP, CHOKE, HOSTAGE, LEAVE. It looks superb and it is a thumbnail on its own. People pile up on the same spot as you, though, so the wheel and the name box land on top of a speech bubble and three bodies. [m_47_pie.png]
22. **Talking.** A bookmaker took $25 and told me about a chest in a cave. Nice. But the conversation sheet covers the bottom half of the screen and the top half shows ceiling lamps. I could not see who I was talking to. [m_49_talk.png]
23. **PUNCH.** Picked PUNCH on someone who was walking. My man trailed behind them for three seconds, never swung, walked into a flat door and got a "A FRONT DOOR" dialogue instead. Twice. [m_51_punch.png, m_60_punch.png]
24. **BEAT DOWN.** Picked BEAT on the clinic doctor, who stands still. Dead in two seconds. "The doctor is dead. Nobody in this city can stitch a wound any more." A kill card: "INTO THE DOOR · it did not open in time." A stranger posts about it. That lands, hard. Then the wanted star went out about ten seconds later, which does not. [m_61_beat.png]
25. **Shops.** IRON & SONS, THE LAST CALL, the RAKE floor, PRECINCT 9, THE RESIDENCE, THE DOCKS all open as text menus with good one-liners. Prices are printed twice: "A beer. $20 $20". [m_71_IRON_dlg.png, m_71_LASTCALL_dlg.png, m_71_RAKE_dlg.png, m_71_PRECINCT_dlg.png, m_71_RESIDENCE_dlg.png, m_71_DOCKS_dlg.png]
26. **The lock.** A locked flat gave me a five-pin lock-pick game. Tense, quick, and when the pick snapped a witness stopped walking and I picked up a star. Good. It is a small drawing floating in a black screen with no hint which pin is binding. [m_71_CEMETERY_dlg.png, m_72_lock_mid.png]
27. **SHOOT.** Bought a pistol for $600. Picked SHOOT on a gang lookout standing about fifteen pixels away. Ten rounds later the lookout had full health and was running, and a bystander was dead on the floor. Somebody shouted "NO. THAT IS ILYA. THAT IS ILYA." and a stranger posted about a candle outside the gun shop. As a moment it is the best in the game. As a shooting system it is broken: I did not choose that. [m_74_armed.png, m_75_gun_1.png]
28. **Police.** An officer with a portrait and a gun. I chose "Run." twice. "SHOTS AUTHORISED. You are already moving." I did not move, nobody fired, and he asked again twenty seconds later. I was inside a flat with the door shut and he was questioning me through it. [m_78_cop_dlg_0.png]
29. **Arrest.** Two people dead. I put my hands out. "Cuffs, a van, a night in a cell. They keep every gun and $200. In the morning you walk." Two hundred dollars. I have paid more for parking. [m_82_search_1.png]
30. **Agent Okoye.** Walking home with high heat, a financial crimes agent turned up at the field: "Your timing is remarkable. I collect remarkable things." More of her, please.
31. **Fast-forward (cheat).** I set cash to $6B and fans to 2M through `window.HS` to reach the presidency gate. Everything from here to entry 36 rests on that. [m_84_rich_desk.png]
32. **Running.** The owner of the house types at you in capitals: "YOU NEEDED A MIRACLE TO BE AVERAGE AT IT." Excellent villain. [m_85_run.png]
33. **Election night.** Two bars, one button: BUY ADS, 2% of your cash per tap. Idle, the rival wins. About thirty taps wins it. Fine as a thirty-second mash, thin as a climax. I also reloaded on election night once: I came back at the trading desk, $2B lighter, with no election. [m_87_election_mid.png, m_88_machine.png]
34. **The machine question.** COME CLEAN, HIDE IT or DESTROY IT. A real choice with stated costs. Then a cut to the Oval Office: "Smaller than on television." That is how you do a title card. [m_88_machine.png, m_89_office.png]
35. **The desk.** Crises as conversations: a photograph of me under the bridge, the owner on the private line. Good. A large gold EMPIRE button is wedged into the middle of every conversation, between the text and the choices, pushing choices two and three off the screen. [m_92_desk.png]
36. **The map.** Fourteen regions on a map the size of a matchbox with five-pixel troop numbers. I signed a pact with a neighbour, attacked them in the same minute and took the land. After END YEAR you are thrown out of the map and have to walk back through the building, about seven seconds a room. My script walked past the cabinet on the way and fired nine press secretaries in a row at no cost. Approval hit zero. In year four: "A single shot at a rally." The death screen listed both my dead: "Mara Reyes · 4 yrs in power · ASSASSINATED" above "Boba Glober · never ruled · THE BLUE". That list is the thing people will screenshot. [m_94_map_act.png, m_96_call.png, m_97_attack.png, m_98_year2.png, m_99_year_0.png, m_a1_dead_president.png]
37. **Generation three.** 2065. "You grew up on stories about Mara Reyes." The president is now owned by THE REYES ESTATE, my own dead ruler's family. The world remembered me. That is the pitch, working. [m_a2_gen3_desk.png]
38. **Desktop street.** Wide view, readable skyline, a famous thirteenth-century conqueror standing in my field as a history lesson, and I appear to have hit him with F. A/D and the arrows walk here. They do nothing at all inside the house or the field, where the same hint line is on screen. Holding SHIFT, which the hint calls "run", covered less ground than walking. Space and Esc did nothing. [d_09_jester.png, d_12_world_esc.png]
39. **SAVES.** A paste box and nothing else. No export button, no import button, no back button, on a fresh device and on one with a save. The buttons exist in `pSaves`; they are not on the screen. [m_t2_saves.png, m_t5_saves_withsave.png]
40. **More…** The title menu links three side pages: travel and theatre, the back room, and a statue boss. The boss page has "Wealth £100,000" test buttons and a "Hitboxes" tick box on it, in pounds, in a game priced in dollars. Those pages also ask for a font file that is not in the pack. [m_t3_more.png, m_t4_xtravel.png, m_t4_xgames.png, m_t4_xboss.png]
41. **Frame rate.** 60 frames a second, worst frame 17 ms, at the desk and in the street, on both sizes, including just after the shooting. That is headless desktop Chromium, not a real phone, so treat it as "no obvious problem", not as proof.

## Bugs

Thirty-three found. Line numbers refer to `index.html` in the upload.

### Blockers

1. ✅ fixed (14 Nov 2026) · **CONTINUE is dead after a reload during any street conversation.** Steps: enter the street, MENU, TAXI (or TALK to anyone), wait five seconds for the autosave, reload, press CONTINUE. Result: stays on the title, red "BUG: Cannot read properties of null (reading 'me')" bar, error thrown every frame from `DLG.wtaxi`. The save holds `S.dlg` and `loc:'world'` but `WR` is not rebuilt before the node is drawn. Likely place: `load()` / the continue handler; clear `S.dlg` and `S.wmenu` on load, or call `enterWorld()` first.
2. ✅ fixed (14 Nov 2026) · **SAVES shows no buttons.** Steps: title, SAVES. Result: explanation text, a paste box, and "More…". No EXPORT THIS SAVE, IMPORT FROM THE BOX or BACK, with or without a save. `pSaves()` (line 2189) does emit them, so a later style is hiding them; suspect the title skin rules on `#panel.t21` (around line 5171). The ROADMAP screen showed the same symptom: no visible way back.

### Major

3. ✅ fixed (14 Nov 2026) · **Reload on election night eats the campaign fee.** Steps: RUN FOR PRESIDENT, reach the BUY ADS screen, reload, CONTINUE. Result: back at the desk in the trade phase, fee gone, no election. Likely place: `startElection()` saves with `phase:'election'`; `load()` does not restore `S.el`.
4. ✅ fixed (14 Nov 2026) · **Three of four characters can never be picked.** Steps: NEW LIFE, tap any LOCKED slot, at any generation. Likely place: the pick row (line 5802) and the `pick` handler (line 5971) hard-code `id==='gamb'`.
5. ✅ fixed (14 Nov 2026) · **Keyboard walking does not work in the house or the field.** Steps: desktop, STREET, hold D, hold right arrow, press E. Result: nothing, while the hint line says "A/D or ←/→ walk · E use". Likely place: the keydown handler at line 6060 returns unless `S.loc==='world'`.
6. ✅ fixed (14 Nov 2026) · **SHIFT does not run.** Steps: desktop street, hold D for 2.5 s (about 92 px), then SHIFT+D for 2.5 s (about 50 px). The hint says "SHIFT run"; the old menu text says "Shift focus". Likely place: `KMAP` and the hold handler near line 6059.
7. ✅ fixed (14 Nov 2026) · **SHOOT from the wheel misses the chosen target and kills a bystander.** Steps: buy a pistol, tap a person about 15 px away, SHOOT. Result: 10 rounds fired, target at full health, another person dead. Likely place: `simStep` `killT` branch (sets `KH.F=true` without aiming at `q.e`).
8. ✅ fixed (14 Nov 2026) · **PUNCH never lands on a walking target, then a door hijacks you.** Steps: tap someone who is walking, PUNCH. Result: you follow, never swing, and if you cross a flat door a "A FRONT DOOR" dialogue opens and the action is cancelled. Likely place: `simStep` `todo` branch (needs within 18 px, same speed as target) and the door check at line 3834 (`m.todo=null; openD('aptdoor')`).
9. ✅ fixed (14 Nov 2026) · **"Run." in a police stop does nothing.** Steps: get wanted, stand in a flat, wait for the stop, choose Run. Result: "You are already moving", no movement, no shots, same dialogue again about twenty seconds later. The stop also happens through a shut door. Likely place: `DLG.wstop` and `threatStep`.
10. ✅ fixed (14 Nov 2026) · **The camera does not reframe for the bottom sheet.** Steps: phone, open any street conversation or MENU. Result: the sheet covers the lower half and the upper half shows sky, roofs or ceiling; you and the speaker are hidden. Likely place: `viewSync()` and the `body.wm.dlg #panel` rule; offset `WR.cam.y` by the sheet height.
11. ✅ fixed (14 Nov 2026) · **BACK TO THE STREET is off-screen and the menu survives a taxi ride.** Steps: phone, MENU. The close button sits at about y=871 on an 844-tall screen. Take a TAXI: the menu is still open on arrival. Likely place: `pWorldMenu()` and the `taxi` option's `ok()`.
12. ✅ fixed (14 Nov 2026) · **The street menu documents controls that no longer exist.** "Left thumb moves: push up to jump… Right thumb aims and shoots… Space… X spin, C kick". Likely place: the help string in `pWorldMenu()`.
13. ✅ fixed (14 Nov 2026) · **Developer tools are shown to players.** GOD MODE in the house and field panels (labelled "OFF / nothing can hurt you"), GOD and BODY on the street's top row, GOD MODE in the street menu. The code comments say "Not for players". Likely place: `bGod`, `bBody`, the `god` button in the walk panel.
14. ✅ fixed (14 Nov 2026) · **One tap can end the run or halve your cash.** Steps: in the house, with two hits of the blue active, tap the pipe; or in the field, tap the gnome. Result: death, or half your cash buried, with no confirm. Likely place: the scene `pointerdown` at line 3573 (`S.autoAct`) plus `HOT.in` pipe and `HOT.out` gnome.
15. ✅ fixed (14 Nov 2026) · **About one life in eight starts with a worthless main coin.** Seen once (OBOL at $0.28) and matches `const dud=r()<.12` in `genMarket()`. On generation one this removes the first-minute payoff.
16. ✅ fixed (14 Nov 2026) · **Sacking the press secretary is free and unlimited.** Steps: Cabinet Room, "Fire … Hire a new press secretary", repeat. Nine in a row with no cost or cooldown, re-rolling skill each time. Likely place: `DLG.cab`.

### Minor

17. ✅ fixed (14 Nov 2026) · Death screen "Peak fortune $15.6K" while the HUD shows $16.2K. `S.peak` is not updated by THE BOARD payout.
18. ✅ fixed (14 Nov 2026) · The monitor's CHIRP ticker announced a net worth "just passed millions" at $16K. Likely place: `post()` thresholds.
19. ✅ fixed (14 Nov 2026) · The same market can appear twice on one BOARD ("Bad Idea wins the 3.40"). Likely place: the board generator behind `btnew`.
20. ✅ fixed (14 Nov 2026) · Prices print twice in street menus: "A beer. $20 $20", "Buy RAKE… $200M $200M", every DOCKS line. Likely place: option labels that include the price plus the `cost` renderer.
21. ✅ fixed (14 Nov 2026) · Typos: "Mara Sato, your the general, has talked to a paper." and "2 crisises waiting".
22. ✅ fixed (14 Nov 2026) · The EVERCLEAR bottle sprite covers RESET and overlaps the right-hand LOOK buttons on phone. Likely place: `#pal` positioning.
23. Tutorial lines are clamped to two rows and end in "…" on phone and desktop. Likely place: `#lines div` line clamp.
24. ✅ fixed (14 Nov 2026) · Desktop key hint overlaps SOUND / UNMAKE / RESET. Likely place: `#pchelp`.
25. ✅ fixed (14 Nov 2026) · The EMPIRE button is injected mid-dialogue and breaks the war panel grid. Likely place: the `emp21` injection.
26. The presidency bar at the bottom of the desk panel is cut off on desktop.
27. ✅ fixed (14 Nov 2026) · 404 for `pack/09_fonts/dejavu_sans_mono.woff` when any side page opens.
28. ✅ fixed (14 Nov 2026) · Heat was read at 116 after a shooting; the bar tops out at 100. Likely place: `heatAdd()` clamp.
29. With a gun out, the street's top-right buttons wrap to three rows and BODY lands on another icon.
30. The wheel opens on whoever is standing on top of you; while it is open it blocks MENU.
31. ✅ fixed (14 Nov 2026) · The statue page ships with test buttons ("Wealth £100,000"), a Hitboxes tick box and pounds instead of dollars.
32. The lock game gives no visible tell for the binding pin and sits in a mostly empty black screen.
33. ✅ fixed (14 Nov 2026) · A GUT line on the very first desk crisis says "You have a feeling you have sat through this before."

## The Locked List

Format: number · name · what to change · why it goes viral · size.

### Fix first (bugs and blockers)

1 · ✅ fixed (14 Nov 2026) · **Unbreakable CONTINUE** · On load, clear `S.dlg` and `S.wmenu`, rebuild the street before drawing, and restore `S.el`. Add a "last good save" slot and offer it when the red bar fires. · Nobody clips a game that ate a streamer's run off camera; they clip themselves uninstalling it. · S

2 · ✅ fixed (14 Nov 2026) · **SAVES that saves** · Make EXPORT, IMPORT and BACK visible again and add COPY CODE. Give ROADMAP a BACK. · Save codes are how a streamer hands chat their world. · S

3 · ✅ fixed (14 Nov 2026) · **Guns that hit what you chose** · In `killT`, aim at the chosen person before firing; bystanders only get hit when they are genuinely in the line. Keep the "THAT IS ILYA" reaction for those cases. · The accident is only a great clip if the viewer believes it was fair. · M

4 · ✅ fixed (14 Nov 2026) · **Punches that land** · Let a queued PUNCH close the gap with a short lunge, and stop flat doors cancelling an action in progress. · A wheel with dead options is a wheel streamers stop opening. · S

5 · ✅ fixed (14 Nov 2026) · **Police that follow through** · "Run." must start a chase with shots; no stops through shut doors. · A chase is content; a repeated text box is a skip. · M

6 · ✅ fixed (14 Nov 2026) · **Hide the dev tools** · GOD and BODY only after the five-tap unlock the code already has. · Stops the first comment being "just turn on god mode". · S

7 · ✅ fixed (14 Nov 2026) · **Keys that match the hint** · A/D, arrows and E in the house and field; SHIFT actually runs; Esc opens and closes MENU; delete the twin-stick paragraph. · Desktop is where it will be streamed. · S

8 · ✅ fixed (14 Nov 2026) · **Frame the speaker** · Lift the camera by the sheet height whenever a street conversation or MENU opens; keep you and them in the top half. · A phone recording of ceiling lamps is not a clip. · S

9 · ✅ fixed (14 Nov 2026) · **Menu that closes** · Pin BACK TO THE STREET to the bottom of the sheet and close the menu after a taxi. · Removes ten seconds of dead air from every ride. · S

10 · ✅ fixed (14 Nov 2026) · **No dud coin on life one** · Skip the dud roll when `S.gen===1` (from the code). · Guarantees the 15x moment in every first video. · S

11 · ✅ fixed (14 Nov 2026) · **Unlock the other three** · One new character per death, announced on the death screen with their perk. · "I died to unlock the Paranoid" is a video title. · S

### The first 60 seconds

12 · **Cold open on the trade** · First launch skips the menu: bridge, one line, the pipe choice, then straight to a guided slide, JUMP, BUY, JUMP, SELL with one glowing button at a time and the cash counter rolling up. Target: a 15x inside forty seconds. · The hook exists; today it is behind two menus and a clipped tutorial. · M

13 · **One real gamble at the door** · Make "Check under the gnome" a true 50% with a funny fail. · First failure on camera inside a minute. · S

14 · **Show the walk** · On first entry to the house and street, a ghost finger taps the floor once, and the bottom strip gets icons (gun, glass, cross, dice, badge) instead of letters. · Viewers copy what they see; nobody decodes "H G B C R P W K D". · S

15 · **Dangerous things look dangerous** · Third hit of the blue pulses red and reads "THIS ONE KILLS YOU"; the gnome asks "bury half?". · Turns an accident into a dare the streamer takes on purpose. · S

16 · **A shop button by the money** · Move the LAB upgrades next to the cash on the MONEY tab. · The first purchase is the first goal. · S

### Clip machines

17 · **REWIND as a show** · When you rewind RAKE, replay the last ten seconds backwards on the monitor, stamp "60 SECONDS AGO", and let the security bar visibly twitch. Add a streak counter. · It is already your best mechanic; give it a look people recognise in a thumbnail. · M

18 · **Death card you can post** · One tap makes a square image: face, name, years, cause line ("Found under the Carrow Bridge by a jogger"), the family list beneath. · Free marketing every time someone dies, and they die a lot. · M

19 · **Kill cards and street reactions, louder** · Keep "INTO THE DOOR" and the stranger posts; add a half-second freeze and hold the card long enough to read on a phone recording. · These are the moments that already land. · S

20 · **"The dead stay dead" ledger** · A running board in the street menu: who is gone, what the city lost ("no doctor"), and who did it. · Gives every rampage a visible price and a title for the video. · M

21 · **The wheel as a still** · Spread the crowd when the wheel opens, put the name box clear of speech bubbles, and enlarge the icons. · That wheel is your thumbnail. · S

22 · **Instant replay** · Keep the last fifteen seconds in memory and add a REPLAY button after any death, kill card or cash-out over 5x. · Does the editor's job for small channels. · L

### Streamer and chat features

23 · **Streamer mode** · One switch: bigger type everywhere (BOARD names, map numbers, street log), a safe margin for a face-cam corner, and no menus under the camera. · Readable on a phone filming a monitor, which is how half of clips are made. · M

24 · **Chat picks** · Optional: dialogue choices and BOARD slips wait fifteen seconds for chat votes typed as 1 to 4; on-screen tally. KLIK already imagines an audience (from the code); make it a real one. · Turns every skill check into a poll. · L

25 · **World codes** · A short code for the whole world: who is dead, who owns the president, the family list. "Play my ruined city." · Viewer worlds are a series, not a video. · M

26 · **Daily seed** · One market, one street, same for everyone that day, with a posted best time to the presidency. · Gives channels a reason to come back tomorrow. · M

27 · **Name the bystanders** · Let a streamer paste a list of chat names for the people in the street. · People will watch for an hour to see themselves get a candle outside the gun shop. · M

### Depth and replay

28 · **Crime that costs** · Wanted should hold for minutes, not seconds; arrest for a killing should cost a real share of cash, time off the clock and a line on the death screen. · Stakes are what make a getaway worth watching. · M

29 · **An election with moves** · Replace the mash with three beats: a debate check, a scandal you can bury or leak, and the final count. Keep one mash at the end. · A climax needs a decision, not a thumb cramp. · M

30 · **A presidency that stays in the room** · END YEAR keeps you at the map; room travel is instant on tap; EMPIRE gets its own tab; sacking staff costs approval and has a limit. · Cuts the dead walking out of the late game. · M

31 · **A map you can read** · Full-width map, large numbers, tap to zoom a region. · The conquest is invisible at phone size today. · M

32 · **Make the inheritance loud** · Generation three finding "THE REYES ESTATE" owns the president is the best idea here. Put the family tree on the title screen and let old rulers' choices change the street. · This is the "one more life" reason. · M

33 · **Skill checks with teeth** · Fewer 97% rolls, more 40 to 70% with consequences that change the scene. · Dice only matter when they can go wrong. · S

### Polish and performance

34 · **Finish or hide the side pages** · The travel, back room and statue pages are prototypes with test buttons. Fold them in or take them off the title menu. · A reviewer will open the worst page first. · M

35 · **Tidy the type** · Fix the doubled prices, the two typos, the clipped tutorial lines, the overlapping key hint and the bottle over RESET. · Small text errors read as "abandoned" on stream. · S

36 · **Fill the phone** · In the house and field the lower half of the screen is empty; scale the room up or move the stats there. · Dead space is dead air. · S

37 · **Lock game with a tell** · Wobble the binding pin, enlarge the drawing, add a pick-tension sound cue. · A fair minigame gets attempted on camera; an opaque one gets skipped. · S

38 · **Real-device pass** · It held 60 frames a second in headless desktop Chromium. Test a mid-range phone, a 7 MB first load on mobile data, and audio. · A stutter in the first clip is the clip. · M

## The one-paragraph pitch

Fine. Here it is, and I will say it once. Hindsight Terminal is a game where you start under a bridge with a thousand dollars and a time machine you did not earn, rob a casino by rewinding it, buy a president, become one, get shot at a rally, and wake up forty years later as a stranger in a city still run by your own dead family, where the doctor you killed in your first life is still dead and nobody can stitch a wound. Every life ends in one sentence you want to read aloud. It is written better than games with a hundred times its budget, it produces a story worth telling every ten minutes, and it fits in one file. It is also held together with string, and it lost my save twice. Fix the eleven things at the top of the list, put the first trade in the first forty seconds, and give streamers the death card and the rewind. Then ring me. I never said that.

## Not reached yet

The playtest was stopped before these were covered. Nothing above should be taken as a finding about them.

- **Markets in depth:** SEEK (memorise, jump, bet, post a video), shorting, the other three assets, buying any LAB upgrade, market scars, the PARADOX meter, forced jumps, the ALL IN ability, GIVEAWAY, NEW FACE, the long-money projects.
- **Social:** CHIRP posting, REELS, going live on KLIK, sponsors.
- **Street:** NEEDLE, ROB, SNAP, CHOKE, HOSTAGE, a successful gunfight, taking damage, the health and body panel, dying in the street, MAKE IT RAIN, gangs, hired guns, the corner shop, the chemist, the lock-up, the bus, the cemetery, the cave and its chest, flats from the inside, the history echoes beyond one sighting, sailing to another country.
- **Side pages:** the travel map, the theatre, the four back-room games and the statue fight were opened but not played.
- **Presidency:** the EMPIRE panel, the in-tray, the press room beyond one question, the residence, re-election and second terms, COME CLEAN and DESTROY IT, REWIND and TURN IT AROUND, drafting, nuclear powers, uprising, old age, conquering the map.
- **Endings:** New Game Plus (needs the whole map held at death), "SOMEONE IS WAITING", UNMAKE and the cosmos screen, the end-of-the-world sequence, the jester's full conversation.
- **Other characters:** the three locked ones and their abilities cannot be reached in this build.
- **Platform:** sound and music, voice lines, gamepad, landscape phone, real phone performance and load time, photo upload for the face, the 100 questions page, DOWNLOAD THE WHOLE GAME, RESET.
- **Desktop:** only the title, builder, intro, desk layout, the house and field keys, the jester's first line and a short walk in the field were covered. Mouse aiming, hover and the wheel with a mouse were not.

## Opus continues: the blockers, checked in the code

Fable played; Opus read the code behind the two blockers. Both are real, and each one is a single-line fix. Line numbers refer to `index.html` in the upload, which is byte-for-byte the live artifact (13 Nov 2026).

**Blocker 1, CONTINUE dies after a reload mid-conversation: confirmed.**
- Cause: `load()` (line 6088) brings back the saved state as it was, and that includes an open conversation in `S.dlg`. It then sets `WR=null` and rebuilds only the city, not the street. The first frame redraws the open conversation, `DLG.wtaxi` (line 1967) reads `WR.me`, and `WR` is null, so it throws every frame.
- Fix (S): in `load()`, next to `WR=null`, add `S.dlg=null;`. Better still, the autosave should skip saving `S.dlg` at all. Keep a second "last good save" slot that is written only when no conversation is open, and have CONTINUE fall back to it if loading throws.

**Blocker 2, SAVES and ROADMAP have no buttons: confirmed.**
- Cause: the title skin (line 5511) adds the class `more21` to every button on a title-phase screen unless its action is in `KEEP=['new','continue','saves','road']`. `#panel.t21 .more21{display:none}` (line 5173) then hides it. The SAVES screen also runs in the title phase, so its own buttons `sexp`, `simp` and `sback` get hidden. So does `roadback` on ROADMAP.
- Fix (S): add them to the list: `KEEP=['new','continue','saves','road','sexp','simp','sback','roadback']`. Better still, only apply the `more21` fold to the main title menu, so no sub-screen loses its buttons again.

**What to do next, in order**
1. Ship the two fixes above as one small version. Test it by reloading while a taxi conversation is open, then by pressing EXPORT, IMPORT and BACK on SAVES.
2. Then items 3 to 5 of the Locked List (guns, punches, police): they're the first things anyone clips.
3. Then the cold open (the guided first trade inside 40 seconds), the highest-ranked item outside "Fix first".
4. Run a second playtest on the "Not reached yet" list above, starting with markets in depth and dying in the street. It should only start once 1 and 2 are live, so it isn't fighting broken saves.

## Bugs into features: four times the impact, the other way round

The rule: every bug gets fixed, and then the thing it broke becomes a feature four times as strong, pointing the other way. If a bug lost you one thing, the feature gives you four. Format: bug → the 4x feature.

### Blockers
1. CONTINUE dies after a reload → **Four save slots, each with a thumbnail and a timestamp, plus a "rewind the save" button.** Loading a save becomes a time-travel move in its own right: go back to any of your last four saves, in character ("the machine remembers four of you").
2. SAVES shows no buttons → **Share a life.** EXPORT makes a short code, plus a postcard image showing your face, cash, title and cause of death. Anyone can paste the code and play from that moment, so a stream ends with "try my run".
3. Reload on election night eats the fee → **The recount.** If the reload happens on election night, you get a free recount scene with four possible twists. Losing your connection turns into a story.
4. Three characters locked → **All four playable, plus an unlock for each.** The other three characters come back as rivals in your world, and beating one unlocks them. Four characters, four rivals, four reasons to replay.

### Major
5. Keyboard walking dead in the house and field → **Full keyboard and gamepad everywhere, plus four-way dash moves** (dash, slide, vault, roll) wherever you can walk.
6. SHIFT doesn't run → **Four speeds**: sneak, walk, run, sprint. Sneaking lowers heat and sprinting raises it, so speed becomes a choice.
7. SHOOT misses and kills a bystander → **Aim locks onto the person you chose, and DEADEYE can mark four targets at once.** If a bystander does die, the city remembers it: a candle, a news line, a relative who comes looking later.
8. PUNCH never lands → **A lunge, then four-hit combos** (jab, cross, hook, finisher), and the finisher triggers a slow-motion close-up that's easy to clip.
9. "Run." does nothing → **A real chase with four ways out**: rooftops, the sewer, a taxi, or a crowd you blend into. Each escape has its own short cutscene.
10. The camera ignores the bottom sheet → **Cinematic framing.** When a conversation opens, the camera zooms to a two-shot of you and the other person, with four shot types it picks between by mood.
11. BACK TO THE STREET is off-screen → **Quick travel from anywhere**: one button, four favourite spots you pin yourself.
12. The menu lists controls that don't exist → **A live controls card** that shows only what works right now, with a four-second animated demo of each move.
13. Dev tools shown to players → **A real cheat-code system** for streamers: four named codes per character that chat can vote on, clearly marked "CHEATED" on the death screen.
14. One tap can end the run or halve your cash → **HOLD to confirm on anything big, plus a four-second "the machine hesitates" window** where you can rewind the choice for paradox.
15. One life in eight gets a worthless coin → **Make the dud a story.** If your coin is worthless, a stranger offers a trade, and in one life out of four that trade becomes the biggest win of the run.
16. Sacking the press secretary is free → **Four staff with their own lives.** Every firing costs approval, and fired staff come back as leakers, rivals, authors of tell-all books, or allies.

### Minor
17. Peak fortune wrong on the death screen → **A full death recap with four graphs**: cash, fans, heat and paradox over your life, in a share image.
18. CHIRP brags too early → **Chirp milestones that land**: four tiers of fame posts, written by four types of fans (stan, hater, journalist, bot).
19. The same market twice on the BOARD → **Every board unique, plus four "featured" bets a day** shared by every player.
20. Prices print twice → **One clean price, with a colour and an arrow** showing whether it's cheap, normal, pricey or a rip-off for you right now.
21. Typos → **A copy pass, plus four newspapers**, each with its own voice, reporting what you did.
22. The bottle sprite covers RESET → **The bottle becomes a moveable companion** you can park in four corners, and it comments on what you do.
23. Tutorial lines clipped → **Tap to expand any line, and a log that keeps the last four lines on screen.**
24. Desktop key hint overlaps the buttons → **A key-hint bar that fades in when you stop moving for four seconds.**
25. EMPIRE breaks the war grid → **EMPIRE gets its own room** in the White House, with four map views: money, army, loyalty, radiation.
26. The presidency bar is cut off → **A presidency HUD with four live dials**: approval, war, scandal, term clock.
27. The font file is missing → **Ship the font, and four title screen looks** you unlock by playing.
28. Heat goes past 100 → **Turn overflow into a feature.** Past 100, heat becomes "MOST WANTED", with four levels, special forces and a bounty that other players' rivals can claim.
29. Buttons wrap with a gun out → **A radial weapon wheel with four slots**, opened by holding the weapon button.
30. The wheel opens on the wrong person → **Tap to cycle through everyone within reach**, with up to four portraits shown.
31. The statue page has test buttons → **Finish it as a boss fight** with four phases, or fold it into the main game.
32. The lock game has no tell → **Four lock types** (pin, dial, keypad, safe), each with clear sound and shake tells, and a skill that grows with use.
33. A déjà vu line on the first crisis → **Make it intentional.** On your first life it's a teaser; on every life after it, GUT tells you exactly which of four outcomes happened last time.
