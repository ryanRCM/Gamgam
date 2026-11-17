#!/usr/bin/env node
// Hindsight Terminal regression checks. Run before every commit to terminal/:
//   node terminal/check.mjs
// Serves terminal/ on a free port, loads it at phone and laptop size, and checks
// the bugs the loop has fixed so they never come back. Each fixed bug adds a check here.
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const dir = path.dirname(fileURLToPath(import.meta.url));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff": "font/woff", ".woff2": "font/woff2", ".css": "text/css", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav" };
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(dir, u.endsWith("/") ? u + "index.html" : u);
  if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r);
});
await new Promise(ok => srv.listen(0, ok));
const url = `http://localhost:${srv.address().port}/`;
let pass = 0, fail = 0;
const ok = (n, c, extra = "") => { console.log((c ? "✅ " : "❌ ") + n + (c || !extra ? "" : "  → " + extra)); c ? pass++ : fail++; };

const browser = await chromium.launch();
for (const vp of [{ n: "phone", width: 390, height: 844, isMobile: true, hasTouch: true }, { n: "laptop", width: 1280, height: 800 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
  await ctx.addInitScript(() => { const o = Math.random; Math.random = () => (window.__rnd != null ? window.__rnd : o()); });
  const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", e => errs.push(e.message));
  await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(1500);
  const t = `[${vp.n}]`;
  ok(`${t} title loads with no errors`, errs.length === 0 && await p.evaluate(() => !!(window.HS && HS.S)), errs[0]);

  // Blocker 2: SAVES must show EXPORT, IMPORT and BACK.
  await p.evaluate(() => { const b = document.querySelector('[data-a="saves"]'); b && b.click(); }); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => ["sexp", "simp", "sback"].map(a => { const b = document.querySelector(`[data-a="${a}"]`); if (!b) return false; const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(b).display !== "none"; }));
  ok(`${t} SAVES shows EXPORT, IMPORT and BACK`, vis.every(Boolean), "visible: " + JSON.stringify(vis));

  // Blocker 1: a save made with a conversation open must load clean (no open conversation, no errors).
  // Real repro: new life → intro → street → open the taxi → save → reload → CONTINUE.
  await p.evaluate(() => localStorage.removeItem("hindsight-v2")); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(1200);
  const act = async a => { await p.evaluate(a => { const x = document.querySelector(`[data-a="${a}"]`); x && x.click(); }, a); await p.waitForTimeout(400); };
  for (const a of ["new", "be", "cusgo"]) await act(a);
  await p.evaluate(() => { for (let i = 0; i < 40 && HS.S.phase === "intro"; i++) { const x = document.querySelector("[data-a]"); x && x.click(); } }); await p.waitForTimeout(400);
  await p.evaluate(() => { HS.enterWorld(); }); await p.waitForTimeout(600);
  await p.evaluate(() => { HS.openD("wtaxi"); localStorage.setItem("hindsight-v2", JSON.stringify(HS.S)); });
  errs.length = 0; await p.reload({ waitUntil: "load" }); await p.waitForTimeout(1200);
  await act("continue"); await p.waitForTimeout(1200);
  ok(`${t} CONTINUE works after saving mid-conversation in the street`, errs.length === 0 && await p.evaluate(() => HS.S.dlg == null), errs[0] || "conversation kept open after load");
  // v24 · DROP DAY: the title says what build this is, the desk help does not send you to a street that is gone,
  // and the door is a real gamble whose dice you can see.
  await p.evaluate(() => localStorage.removeItem("hindsight-v2")); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(1000);
  const vtag = await p.evaluate(() => (document.querySelector("#panel .vtag") || {}).textContent || "");
  ok(`${t} title shows the current build (v24+)`, /v2[4-9]/.test(vtag), "tag: " + vtag);
  const helpStreet = await p.evaluate(() => /STREET takes you outside/.test(document.documentElement.innerHTML));
  ok(`${t} desk help no longer points at the removed street`, !helpStreet);
  for (const a of ["new", "be"]) await act(a);
  const door = await p.evaluate(async () => { for (let i = 0; i < 30; i++) { const o = [...document.querySelectorAll('#panel [data-a="dopt"]')]; if (o.some(b => /gnome/.test(b.innerText))) return o.map(b => b.innerText); const x = document.querySelector('#panel [data-a="dcont"]') || o[0]; if (!x) return null; x.click(); await new Promise(r => setTimeout(r, 120)); } return null; });
  const pcts = (door || []).map(s => +((s.match(/(\d+)%/) || [])[1])).filter(n => !isNaN(n));
  ok(`${t} the door is a real gamble (no option over 90%, one between 35% and 65%)`, pcts.length === 3 && pcts.every(n => n <= 90) && pcts.some(n => n >= 35 && n <= 65), JSON.stringify(door));
  await p.evaluate(() => { window.__rnd = 0; const b = [...document.querySelectorAll('#panel [data-a="dopt"]')].find(b => /gnome/.test(b.innerText)); b && b.click(); window.__rnd = null; }); await p.waitForTimeout(300);
  const dice = await p.evaluate(() => { const d = document.querySelector("#panel .dice24"); return d ? d.innerText : ""; });
  ok(`${t} a failed check shows its dice`, /FAILURE/.test(await p.evaluate(() => document.getElementById("panel").innerText)) && /2/.test(dice), "dice: " + dice);
  // v24 · DEATH CARD: dying gives you a square image to post, with the face, cause line and the family list.
  await p.evaluate(() => { for (let i = 0; i < 20 && HS.S.dlg; i++) { const x = document.querySelector('#panel [data-a="dcont"]') || document.querySelector('#panel [data-a="dopt"]'); x && x.click(); } });
  await p.evaluate(() => HS.die("pipe")); await p.waitForTimeout(500);
  const card = await p.evaluate(async () => { const b = document.querySelector('#panel [data-a="card24"]'); if (!b) return { err: "no card button" }; b.click(); await new Promise(r => setTimeout(r, 400)); const im = document.querySelector("#panel img.card24"); if (!im) return { err: "no preview" }; await im.decode().catch(() => {}); return { w: im.naturalWidth, h: im.naturalHeight, alt: im.alt }; });
  ok(`${t} death screen makes a 1080px death card with the cause`, card.w === 1080 && card.h === 1080 && /BLUE/.test(card.alt || ""), JSON.stringify(card));
  // v24 · DAILY: TODAY'S MARKET gives everyone the same market today, and it shows on the HUD.
  const dailyRun = async () => { await p.evaluate(() => localStorage.removeItem("hindsight-v2")); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(900);
    const has = await p.evaluate(() => { const b = document.querySelector('#panel [data-a="daily24"]'); return !!b && b.getBoundingClientRect().height > 0; }); if (!has) return { err: "no visible TODAY'S MARKET button" };
    await act("daily24"); await act("be"); await p.waitForTimeout(300);
    return await p.evaluate(() => ({ d: HS.S.daily24, mk: HS.S.mk.map(a => Math.round(a[59] * 100)).join(","), hud: document.getElementById("hud").innerText })); };
  const d1 = await dailyRun(), d2 = await dailyRun();
  ok(`${t} TODAY'S MARKET is the same market on every run today`, !d1.err && d1.d && d1.mk === d2.mk && /DAILY/.test(d1.hud), JSON.stringify([d1.err || d1.d, d1.mk, d2.mk]));
  // v24 · ELECTION NIGHT: a debate and a scandal come before the count, and the choices move the race.
  const elErr = await p.evaluate(() => { try { HS.S.phase = "trade"; HS.S.dead = null; HS.S.dlg = null; HS24.startElection(0); return ""; } catch (e) { return e.message; } }); await p.waitForTimeout(300);
  const el0 = await p.evaluate(() => ({ who: (document.querySelector("#panel .who2") || {}).innerText || "", live: HS.S.el && HS.S.el.live, n: document.querySelectorAll('#panel [data-a="dopt"]').length }));
  const steps = await p.evaluate(async () => { const seen = []; for (let i = 0; i < 12 && HS.S.dlg; i++) { seen.push((document.querySelector("#panel .who2") || {}).innerText || ""); const x = document.querySelector('#panel [data-a="dcont"]') || document.querySelector('#panel [data-a="dopt"]:not([disabled])'); if (!x) break; x.click(); await new Promise(r => setTimeout(r, 60)); } return { seen, live: HS.S.el && HS.S.el.live, phase: HS.S.phase }; });
  ok(`${t} election night opens with a debate and a scandal, then the count`, /DEBATE/.test(el0.who) && el0.live === false && el0.n === 3 && steps.seen.some(w => /SCANDAL/.test(w)) && steps.live === true && steps.phase === "election", elErr || JSON.stringify([el0, steps]));
  // v24 · THE FAMILY: the title shows every life lived in this world, with faces, newest first.
  await p.evaluate(() => { const S = HS.S; S.dlg = null; S.el = null; S.phase = "trade"; HS.die("pipe"); });
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem("hindsight-v2")); s.world.rulers.push({ name: "Mara Reyes", years: 4, cause: "ASSASSINATED", peak: 9, look: s.world.rulers[0].look, g: 2 }); localStorage.setItem("hindsight-v2", JSON.stringify(s)); });
  await p.reload({ waitUntil: "load" }); await p.waitForTimeout(1000);
  const fam = await p.evaluate(() => { const f = document.querySelector("#panel .fam24"); if (!f) return null; const r = f.getBoundingClientRect(); return { n: f.querySelectorAll(".f24").length, faces: f.querySelectorAll("canvas").length, h: r.height, txt: f.innerText.slice(0, 200) }; });
  ok(`${t} title shows the family tree with faces`, fam && fam.n >= 2 && fam.faces >= 2 && fam.h > 0 && /Mara Reyes/.test(fam.txt) && /ASSASSINATED/.test(fam.txt), JSON.stringify(fam));
  // v24 · REWIND AS A SHOW: rewinding a lost RAKE board stamps "60 SECONDS AGO" on screen, and beating the
  // rewound board builds a streak that shows in the RAKE header.
  await p.evaluate(() => { localStorage.removeItem("hindsight-v2"); }); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(900);
  for (const a of ["new", "be"]) await act(a);
  await p.evaluate(async () => { for (let i = 0; i < 30 && HS.S.phase === "intro"; i++) { const x = document.querySelector('#panel [data-a="dcont"]') || document.querySelector('#panel [data-a="dopt"]'); x && x.click(); await new Promise(r => setTimeout(r, 60)); } });
  const rw = await p.evaluate(async () => { const S = HS.S, w = ms => new Promise(r => setTimeout(r, ms)), c = (a, v) => { const b = [...document.querySelectorAll(`#panel [data-a="${a}"]`)].find(b => v == null || b.dataset.v == v); if (b && !b.disabled) { b.click(); return true; } return false; };
    S.dlg = null; S.cash = 1e5; S.flux = 100; S.tab = "rake"; S.rake.banned = false; S.rake.b = null; S.rake.sus = 0; HS.render(); await w(50);
    for (let tries = 0; tries < 6 && !(S.rake.b && S.rake.b.bust >= 0); tries++) { S.rake.b = null; S.rake.round++; HS.render(); c("rbet", ".1"); for (let i = 0; i < 25 && S.rake.b && S.rake.b.live; i++) c("rpick", String(i)); }
    if (!(S.rake.b && S.rake.b.bust >= 0)) return { err: "never busted" };
    c("rrew"); await w(150); const o = document.getElementById("rw24"), stamp = !!o && getComputedStyle(o).display !== "none" && /60 SECONDS AGO/.test(o.innerText);
    c("rbet", ".1"); const safe = [...document.querySelectorAll('#panel [data-a="rpick"]')].find(b => !b.disabled && !/✕/.test(b.innerText)); safe && safe.click(); await w(50); c("rcash"); await w(80);
    return { stamp, streak: S.rake.streak24, head: (document.querySelector("#panel .rs24") || {}).innerText || "" }; });
  ok(`${t} RAKE rewind stamps the screen and builds a streak`, rw.stamp && rw.streak === 1 && /STREAK/.test(rw.head), JSON.stringify(rw));
  // v24 · STREAMER MODE: a title switch for big type and a face-cam corner that survives reloads, and chat names
  // pasted in become the names of the people born from now on.
  await p.evaluate(() => { localStorage.removeItem("hindsight-v2"); localStorage.removeItem("hindsight-streamer"); }); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(900);
  const sm = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const mb = document.querySelector("#panel .mbtn21"); mb && mb.click(); await w(50);
    const b = document.querySelector('#panel [data-a="str24"]'); if (!b) return { err: "no STREAMER button" }; b.click(); await w(50);
    const tg = document.querySelector('#panel [data-a="str24on"]'); if (!tg) return { err: "no toggle" }; tg.click(); await w(50);
    const ta = document.querySelector("#panel textarea.names24"); if (!ta) return { err: "no names box" }; ta.value = "pixelqueen, lordofchat\nmodbot"; document.querySelector('#panel [data-a="str24names"]').click(); await w(50);
    const fs0 = parseFloat(getComputedStyle(document.getElementById("lines")).fontSize);
    return { on: document.body.classList.contains("streamer24"), cam: !!document.getElementById("cam24") && getComputedStyle(document.getElementById("cam24")).display !== "none", names: (HS24.first ? HS24.first() : []).includes("lordofchat"), fs0 }; });
  await p.reload({ waitUntil: "load" }); await p.waitForTimeout(800);
  const sm2 = await p.evaluate(() => ({ on: document.body.classList.contains("streamer24"), names: (HS24.first ? HS24.first() : []).includes("pixelqueen") }));
  ok(`${t} streamer mode: big type, face-cam corner and chat names survive a reload`, !sm.err && sm.on && sm.cam && sm.names && sm.fs0 >= 19.5 && sm2.on && sm2.names, JSON.stringify([sm, sm2]));
  await p.evaluate(() => localStorage.removeItem("hindsight-streamer"));
  // v24 · THE FIRST TRADE, GUIDED: one glowing control at a time, six steps, then the multiple on screen.
  // It replaces the two clipped text lines that used to explain the trade.
  await p.evaluate(() => { localStorage.clear(); }); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(900);
  await act("new"); await p.evaluate(() => { window.__rnd = 0.37; }); await act("be"); await p.evaluate(() => { window.__rnd = null; }); // a fixed market where the low pays
  const gd = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), q = s => document.querySelector(s);
    for (let i = 0; i < 30 && HS.S.phase === "intro"; i++) { const x = q('#panel [data-a="dcont"]') || q('#panel [data-a="dopt"]'); x && x.click(); await w(60); }
    await w(150); const lines0 = document.getElementById("lines").innerText;
    const log = []; const step = () => { const g = q("#panel .g24"), gl = q(".glow24"); return (g ? (g.innerText.match(/(\d)\/6/) || [, "?"])[1] : "-") + ":" + (gl ? (gl.id || gl.dataset.a) : "none"); };
    log.push(step()); const c = s => { const b = q(s); b && !b.disabled && b.click(); };
    c('[data-a="g24low"]'); await w(80); log.push(step()); c("#jb"); await w(80); log.push(step()); c('#panel [data-a="buy"][data-v="1"]'); await w(80); log.push(step());
    const sl = q("#sl"); sl.value = 59; sl.dispatchEvent(new Event("input", { bubbles: true })); await w(80); log.push(step()); c("#jb"); await w(80); log.push(step()); c('#panel [data-a="sell"]'); await w(120);
    return { log, done: (q("#panel .g24") || {}).innerText || "", old: /SEEK: memorise|Slide to a low/.test(lines0) }; });
  ok(`${t} first trade is guided step by step and ends on the multiple`, gd.log.join(" ") === "1:sl 2:jb 3:buy 4:sl 5:jb 6:sell" && /×/.test(gd.done) && !gd.old, JSON.stringify(gd));
  // Help card: "Tap anywhere to close" must mean anywhere, not only on the card.
  await p.keyboard.press("?"); await p.waitForTimeout(150);
  const hc0 = await p.evaluate(() => { const c = document.getElementById("ctrl22"); return !!c && c.style.display === "block"; });
  await p.mouse.click(8, 790); await p.waitForTimeout(150);
  const hc1 = await p.evaluate(() => { const c = document.getElementById("ctrl22"); return !!c && c.style.display === "block"; });
  ok(`${t} the help card closes on a tap anywhere`, hc0 && !hc1, JSON.stringify({ shown: hc0, stillShown: hc1 }));
  // v25 · KLIK: going live puts a chat overlay on screen; a ballsy bet floods it, opens a prediction, and the
  // character talks to chat in their own voice (spoken through speechSynthesis); chat dares pay off and make clips.
  await p.evaluate(() => { localStorage.clear(); }); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(900);
  await act("new"); await act("be");
  const kl = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), q = s => document.querySelector(s);
    for (let i = 0; i < 30 && HS.S.phase === "intro"; i++) { const x = q('#panel [data-a="dcont"]') || q('#panel [data-a="dopt"]'); x && x.click(); await w(60); }
    const said = []; try { Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speak: u => said.push({ t: u.text, p: u.pitch, r: u.rate }), cancel() {}, getVoices: () => [], pending: false, speaking: false } }); } catch (e) {}
    if (!window.HS24 || !HS24.klik) return { err: "no KLIK24" };
    const S = HS.S; S.flags.g24 = { c0: 1, t0: 0 }; try { localStorage.setItem("hindsight-guided", "1"); } catch (e) {}
    S.cash = 2e5; S.fame = 5e4; S.kk = { peak: 0, earned: 0, deals: {}, off: { volt: 1, rake: 1, krane: 1 } }; S.tab = "rake"; S.rake.b = null; S.rake.banned = false; HS.render(); await w(50);
    const goLive = q('#panel [data-a="live"]'); if (!goLive) return { err: "no GO LIVE on the RAKE tab" }; goLive.click(); await w(1800);
    const ov = q("#kc24"), vis = !!ov && getComputedStyle(ov).display !== "none", amb = ov ? ov.querySelectorAll(".m24").length : 0;
    const n0 = HS24.klik().n; q('#panel [data-a="rbet"][data-v="1"]').click(); await w(700);
    const n1 = HS24.klik().n, pred = !!q("#kc24 .pr24"), me = [...document.querySelectorAll("#kc24 .me24")].map(e => e.innerText);
    const first = S.name.split(" ")[0].toUpperCase();
    // a dare: chat dares a max bet; doing it pays and makes a clip
    S.rake.b = null; S.rake.round++; S.cash = 2e5; HS.render(); HS24.klik().dare("max"); await w(50); const hype0 = S.hype || 0;
    q('#panel [data-a="rbet"][data-v="1"]').click(); await w(300);
    return { vis, amb, storm: n1 - n0, pred, me: me.slice(-2), meOk: me.some(t => t.startsWith(first)), said: said.length, dare: HS24.klik().last, hypeUp: (S.hype || 0) > hype0, clips: (S.kk.clips24 || []).length }; });
  ok(`${t} KLIK: live chat overlay on screen, a max bet floods it, opens a prediction and the character talks to chat`, !kl.err && kl.vis && kl.amb >= 2 && kl.storm >= 6 && kl.pred && kl.meOk && kl.said >= 1, JSON.stringify(kl));
  ok(`${t} KLIK: a chat dare pays off and becomes a clip`, !kl.err && kl.dare === "done" && kl.hypeUp && kl.clips >= 1, JSON.stringify(kl));
  await ctx.close();
}
await browser.close(); srv.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
