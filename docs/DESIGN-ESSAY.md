# Hindsight Terminal: the loop, the money, and why it never plays the same twice

A design essay for v22. What the game is for, how each layer feeds the next, and why trading needs a plan rather than a lookup table.

## 1. The promise

You start under a bridge with a thousand dollars and a machine that lets you see tomorrow. The fantasy is not "get rich". Anyone with tomorrow's prices gets rich. The fantasy is **getting away with it**: bending markets, people and countries while the world notices, reacts, remembers, and pushes back. Every system in the game exists to make the world notice.

## 2. The loop, at four speeds

**The minute.** Read the chart, read the news, decide. Jump, buy, jump, sell. Or don't: pump first, rumour a rival, spoof the price you'll fill at. Every action has a visible cost (flux, cash, heat, SEC suspicion, scars on the chart) and a visible reaction (chat, CHIRP, headlines, people in the street). A minute that ends without the world reacting is a wasted minute, and the design treats it as a bug.

**The session.** Money opens doors: the street, the RAKE floor, the BOARD, the SET or the ARENA, the presidency, EMPIRE. Each door is a different game with the same currency and the same consequences. The session's question is "what do I spend my power on?", and every answer changes what the next session looks like.

**The life.** You age. You get famous, wanted, owned, elected, shot. Something kills you: a bullet, a regulator, datura, paradox, your own nukes, old age. The death card tells the story in one screen.

**The dynasty.** The world survives you. The dead stay dead, irradiated countries stay green, TV shows about you become reruns about your ancestor, your family may own the next president. Generation three finding THE REYES ESTATE in charge is the "one more life" hook. The legacy is the save file.

## 3. Trading that needs a strategy

Perfect information makes a dull game: if you know the future, the optimal move is obvious and the decision disappears. v22 keeps the time machine and takes the certainty away, in five layers.

1. **Your size moves the market.** Every order fills against depth. A big buy fills above the quote and leaves a spike in history; a big sell fills below it. The bigger you get, the less any single trade pays, so you have to spread across assets, time and DARK POOL depth. This was already in the game. v22 builds on it.
2. **Your trades echo forward.** Large orders ripple into the next quarters. The future you memorised was the future *before* you traded, so trading big now bends the very prices you were planning to sell into.
3. **The news never stops.** Every 7 to 15 seconds a headline lands on one asset and moves its future from where you stand in time: a CEO at an airport with three passports, a buyback, a raid with not enough boxes. Remembered prices drift. The skill is deciding which memories still hold, which is a judgement call, not a lookup.
4. **You can cheat, loudly.** PUMP spends cash on bots and a man in a suit to lift the next quarters (stronger with fame). RUMOUR does the reverse, perfect before a short. SPOOF spends flux to move the price you can fill at right now, and it snaps back. GLITCH tears the chart through the machine: huge, visible, dangerous, and every fourth tear makes the market correct violently somewhere else.
5. **Someone is watching.** Every trick raises SEC suspicion, which falls slowly while you behave. At 100 the grey suits arrive: settle for a quarter of everything, blame an intern (CHARM), or bribe the worse suit (NERVE). Fail the bribe and you die in prison.

So the strategic questions are real ones. *How big can I go before I eat my own edge? Do I trust the future I saw, or the headline I just read? Do I pump now and sell into my own hype before the SEC arrives? Is one glitch worth the scars?* The meters that answer them (heat, SEC, flux, paradox, scars, viewers) all sit on the screen, so the player can always see the cost before they pay it.

## 4. Controls: never stupid

The rule: anything you can do with a tap, you can do with a key, and the key is the obvious letter.

- **Everywhere:** 1-9 picks an option, ENTER continues, ESC closes or backs out, TAB cycles desk tabs.
- **Desk (MARKET):** ←/→ move through time, J jump, B buy all, V buy half, S sell, H short, C cover, Q/E switch asset, P pump, U rumour, O spoof, G glitch. The legend sits under the MANIPULATE panel on desktop.
- **House and field:** A/D or arrows walk, E uses what is in front of you.
- **Street:** A/D or arrows walk, E acts, F hits or shoots, SHIFT slow motion, tap or click anyone for the wheel (tap again to cycle through a crowd).
- **The other side (salvia):** arrows or WASD, or tap where to go. ESC wakes you, at a cost.

Dangerous one-tap actions (the third hit of the blue, burying half your cash, launching a nuke) need a second press, and the first press says exactly what the second one costs.

## 5. Hyper-reactive: the world reads the present

This is the principle the rest of the game hangs on: **every line is about now.** R22 notes what just happened: a death, a wanted star, a bomb, a leak, a show, a war, a purchase, a fortune made or lost, the presidency, going live. The next person you talk to opens with it, in their own voice. KLIK chat, the press and the TV draw from the same memory, and from your character and how they look: the white suit, the shaved head, the purple t-shirt, the cigarette. A line that could be said at any time is filler. The test for any new dialogue: *would this line be wrong five minutes ago?* If not, rewrite it.

KLIK chat is a grammar rather than a list: openers × context-chosen cores (each with its own slots) × tails × emotes, with random caps and stretched vowels. It produces well past ten million distinct lines, and in a test of 3,000 lines none repeated. Chat bursts when something happens on stream. Streaming from the White House leaks things (the codes, the troop map, the real polls, an insult to a named leader), and each leak costs approval, raises tension and a country's anger, makes headlines, and sends viewers through the roof.

## 6. Four people, four games

All four characters are open from the first life, each with a different silhouette and colour, a different opening line, and different reactions from the street.

- **Dax, the Narcissist.** A film star. THE SET: auditions decided by CHARM (wired helps, drunk does not), roles with procedural titles and directors, premieres with review scores. A great one gets a TV show made about it.
- **Ilse, the Paranoid.** Heat builds slower and aides never leak. The world reads her as someone being watched, because she is.
- **Tomo, the Insomniac.** A fighter and a footballer. THE ARENA: three-round cage fights against named opponents with styles you have to read (strike beats grapplers, grapple beats strikers, guard beats wrestlers), football matches with three moments, a belt at five wins, a club that signs you. Performance drugs make you stronger and get tested.
- **Boba, the Gambler.** A yogi of the absurd: calm when he loses, kind when he wins, buying the dip with his eyes closed. Chat calls him the zen gambler.

## 7. Substances: specific, and each with a voice

Every substance changes the rules, and talks while it does, like EVERCLEAR the bottle. Its lines react to what just happened.

- **The blue** (THE BLUE): GUT up, LOGIC down. The third hit kills you.
- **The juice** (COACH): NERVE +2 while it lasts. You get tested after fights and matches; failing costs the purse and a ban.
- **Salvia** (THE GARDENER): a whole other game for 45 seconds, one version per character. The Hall of Mirrors (find your real face), the Watchers (stay out of their sight), the Corridor (take the door that flickers green), the Table (higher or lower against the house). Win and you come back with a permanent stat; lose and a tenth of your money has wandered off. Either way, eleven seconds have passed.
- **Datura** (THE HOST): nightmare fuel. The first trip shows you people who aren't there. The second takes a third of your money for a lamp post. The third trip kills you.

## 8. The world, procedural so it replays forever

EMPIRE's MAP draws the world tile by tile: what you own (gold), war (red), ruin (brown), radiation (green, permanent), your posters. Tap a country to visit, buy, invade, put up propaganda, or nuke it, if you hold a nuclear state or the presidency. A nuke plays out over minutes: ash, closed borders, a market crash, refugees, a number-one song that never mentions you, a memorial you may not attend. A nuclear rival may answer. The radiation is written into the world, so every later life inherits it.

MEDIA lists the TV shows made about you: genre, network, title, the actor who plays you, a review and a rating, each with its own painted pixel poster. It also carries the state broadcasts from countries you own, the headlines, and reruns of shows about who you used to be. Everything is generated from what you did, so two runs never read the same.

## 9. Consequences: accidental storytelling through real people

The strongest stories in the game are the ones nobody wrote. Every big act (a killing, a bomb, a market trick, a leak, a country bought, a war) lands on **one named person**, and their story comes back to you minutes later: the best friend sleeping on the bench where it happened, the 71-year-old selling her piano because of your rumour, the girl who survived the flash in a lift and asks the first reporter your name. Some of them come back for you: a gun, a crowd at the door, a politician whose whole career is you. And some outlive you. A later life opens with the consequences of an earlier one: the witness who now runs the police, the survivor who chairs the commission on machines like yours. The credits list them under PEOPLE YOU CHANGED.

None of it is scripted in sequence. It is assembled from who the person was, what you did, and what has happened since, which is why it can still surprise the people who built it.

## 10. A mark in history: every copy ends up different

Most games are the same game for everyone. This one is built to diverge. Every system here (prices, news, chat, people, shows, propaganda, consequences, eras, planets) is generated from the seed of your world and then **bent by your choices**, and almost everything you bend is kept: the dead stay dead, the green stays green, the shows become reruns, the ties pass down the generations, the machine wears out on your hands and nobody else's. After a few hundred hours, no two copies of Hindsight Terminal on Earth will contain the same history.

That makes each copy a footprint: an honest record of how one person behaved with absolute power and a machine that let them cheat. Who did they pump? Who did they spare? Did they leave the planet, or burn it and stay? The credits at the end are not the developers'. They are the player's, and COPY YOUR RECORD lets them keep it.

Strategic code is what makes this profound rather than random. The rules are small and legible, so the stories they produce feel earned, and the memory is long, so the stories accumulate meaning. Played seriously, the game becomes a mirror held up for a thousand years, and what it shows is the player.

## 11. Controls that know you

The game works out what you are playing on (touch, keyboard and mouse, or gamepad) and switches the moment you do. The first time you reach each place (the desk, the house and field, the street, the presidency) on that device, a card shows exactly what works there. Press ? to see it again.

## 12. What v22 still needs

- A share-a-life code with a postcard image (four save slots shipped in v22).
- A real-device pass: a mid-range phone, a 7 MB first load on mobile data, and audio.
- A second investor playtest focused on markets in depth and dying in the street, now that the blockers are gone.
- Later, if wanted: the same design rebuilt for Roblox. The systems above are data and rules, so they port; the art and the controls would be redone.
