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
  const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", e => errs.push(e.message));
  await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(1500);
  const t = `[${vp.n}]`;
  ok(`${t} title loads with no errors`, errs.length === 0 && await p.evaluate(() => !!(window.HS && HS.S)), errs[0]);

  // Blocker 2: SAVES must show EXPORT, IMPORT and BACK.
  await p.evaluate(() => { const b = document.querySelector('[data-a="saves"]'); b && b.click(); }); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => ["sexp", "simp", "sback"].map(a => { const b = document.querySelector(`[data-a="${a}"]`); if (!b) return false; const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(b).display !== "none"; }));
  ok(`${t} SAVES shows EXPORT, IMPORT and BACK`, vis.every(Boolean), "visible: " + JSON.stringify(vis));

  // Same root cause as Blocker 2: the title's More… fold hid ROADMAP's way back.
  await p.evaluate(() => { const b = document.querySelector('[data-a="sback"]'); b && b.click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => { const b = document.querySelector('[data-a="road"]'); b && b.click(); }); await p.waitForTimeout(300);
  const rb = await p.evaluate(() => { const b = document.querySelector('[data-a="roadback"]'); if (!b) return false; const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  ok(`${t} ROADMAP shows a BACK button`, rb);

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
  // Bugs 11 and 12: the street menu's close button is on screen, the help text is current, and a taxi closes the menu.
  await p.evaluate(() => { HS.S.dlg = null; HS.S.wmenu = true; HS.render(); }); await p.waitForTimeout(400);
  const mn = await p.evaluate(() => { const b = document.querySelector('[data-a="wmclose"]'); const r = b && b.getBoundingClientRect(); const note = [...document.querySelectorAll("#panel .note")].map(n => n.textContent).join(" ");
    return { on: !!b && r.bottom <= innerHeight + 1 && r.height > 0, stale: /thumb|Shift focus/.test(note) }; });
  ok(`${t} street menu: close button on screen, no stale controls`, mn.on && !mn.stale, JSON.stringify(mn));
  await act("taxi");
  ok(`${t} taxi closes the street menu`, await p.evaluate(() => !HS.S.wmenu && !!HS.S.dlg));
  await p.evaluate(() => { HS.S.dlg = null; HS.render(); });

  // Bug 10: with a conversation sheet open on a phone, you stand above the sheet, not under it.
  if (vp.n === "phone") {
    await p.evaluate(() => { HS.S.wmenu = false; HS.openD("wtaxi"); }); await p.waitForTimeout(900);
    const fr = await p.evaluate(() => ({ top: document.getElementById("panel").getBoundingClientRect().top, meY: (HS.WR.me.y - HS.WR.cam.y) / HS.VH * innerHeight }));
    ok(`${t} conversation sheet: you stay above it`, fr.top > 0 && fr.meY < fr.top, JSON.stringify(fr));
    await p.evaluate(() => { HS.S.dlg = null; HS.render(); });
  }

  // Bug 9: choosing "Run." in a police stop makes you run and puts their guns out.
  const rn = await p.evaluate(() => { const S = HS.S; S.dlg = null; S.wmenu = false; S.wanted = 1; const c = HS.WR.ents.find(e => !e.dead && e.p); if (!c) return { skip: 1 };
    HS.openD("wstop", c.p.id); const b = [...document.querySelectorAll('[data-a="dopt"]')].find(x => /^Run\./.test(x.textContent)); b && b.click();
    return { goX: HS.WR.me.goX, wanted: S.wanted }; });
  ok(`${t} police stop: Run. actually runs`, rn.goX != null && rn.wanted >= 2, JSON.stringify(rn));
  await p.evaluate(() => { HS.S.dlg = null; HS.S.wanted = 0; HS.render(); });

  // Bug 3: a reload on election night resumes the election (as a recount) instead of eating the fee.
  await p.evaluate(() => { HS.S.phase = "election"; HS.S.el = { you: 40, riv: 60, live: true, spd: 8, base: 3 }; HS.S.dlg = null; localStorage.setItem("hindsight-v2", JSON.stringify(HS.S)); });
  await p.reload({ waitUntil: "load" }); await p.waitForTimeout(1000); await act("continue");
  const el = await p.evaluate(() => ({ ph: HS.S.phase, riv: HS.S.el && HS.S.el.riv }));
  ok(`${t} reload on election night resumes the election`, el.ph === "election" && el.riv < 60, JSON.stringify(el));

  // Bugs 5 and 14: keyboard walks in the house, and the third hit of the blue needs a second press.
  const kb = await p.evaluate(() => { const S = HS.S; S.phase = "trade"; S.el = null; S.dlg = null; S.loc = "in"; S.cus = false; S.px = S.tx = 100; HS.render();
    dispatchEvent(new KeyboardEvent("keydown", { code: "KeyD", key: "d" })); const moved = S.tx > 100;
    S.px = S.tx = 240; S.fxs.high = 60; S.fxs.hits = 2; dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE", key: "e" }));
    return { moved, alive: S.phase === "trade", armed: S.armed }; });
  ok(`${t} keyboard walks in the house; the deadly pipe asks twice`, kb.moved && kb.alive && kb.armed === "pipe", JSON.stringify(kb));

  // Bug 19: no market twice on one BOARD (40 boards).
  const dup = await p.evaluate(() => { let bad = 0; for (let i = 1; i <= 40; i++) { HS.S.bx = { seed: i * 7919, slip: {}, peek: {}, open: [], done: [], n: 0 }; const q = HS.btBoard().map(m => m.q); if (q.length !== 8 || new Set(q).size !== 8) bad++ } return bad; });
  ok(`${t} BOARD never lists a market twice`, dup === 0, dup + " bad boards");

  // Bug 4: one more character unlocks per life. Bug 13: GOD and BODY hidden from players.
  const lk = await p.evaluate(() => { localStorage.setItem("hindsight-unlock", "2"); HS.S.phase = "pick"; HS.S.pick = 3; HS.S.cus = false; HS.render(); return [...document.querySelectorAll('[data-a="pick"]')].map(b => b.textContent.startsWith("LOCKED")); });
  ok(`${t} a second life unlocks a second character`, lk.filter(Boolean).length === 2, JSON.stringify(lk));
  const dev = await p.evaluate(() => ["bGod", "bBody"].map(id => { const b = document.getElementById(id); return !b || getComputedStyle(b).display === "none"; }));
  ok(`${t} GOD and BODY are hidden from players`, dev.every(Boolean), JSON.stringify(dev));
  await ctx.close();
}
await browser.close(); srv.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
