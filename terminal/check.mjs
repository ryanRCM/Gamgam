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
  ok(`${t} title shows the current build (v24)`, /v24/.test(vtag), "tag: " + vtag);
  const helpStreet = await p.evaluate(() => /STREET takes you outside/.test(document.documentElement.innerHTML));
  ok(`${t} desk help no longer points at the removed street`, !helpStreet);
  for (const a of ["new", "be"]) await act(a);
  const door = await p.evaluate(async () => { for (let i = 0; i < 30; i++) { const o = [...document.querySelectorAll('#panel [data-a="dopt"]')]; if (o.some(b => /gnome/.test(b.innerText))) return o.map(b => b.innerText); const x = document.querySelector('#panel [data-a="dcont"]') || o[0]; if (!x) return null; x.click(); await new Promise(r => setTimeout(r, 120)); } return null; });
  const pcts = (door || []).map(s => +((s.match(/(\d+)%/) || [])[1])).filter(n => !isNaN(n));
  ok(`${t} the door is a real gamble (no option over 90%, one between 35% and 65%)`, pcts.length === 3 && pcts.every(n => n <= 90) && pcts.some(n => n >= 35 && n <= 65), JSON.stringify(door));
  await p.evaluate(() => { window.__rnd = 0; const b = [...document.querySelectorAll('#panel [data-a="dopt"]')].find(b => /gnome/.test(b.innerText)); b && b.click(); window.__rnd = null; }); await p.waitForTimeout(300);
  const dice = await p.evaluate(() => { const d = document.querySelector("#panel .dice24"); return d ? d.innerText : ""; });
  ok(`${t} a failed check shows its dice`, /FAILURE/.test(await p.evaluate(() => document.getElementById("panel").innerText)) && /2/.test(dice), "dice: " + dice);
  await ctx.close();
}
await browser.close(); srv.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
