#!/usr/bin/env node
// Hindsight checks. Run before every push:  node tests/check.mjs [page.html] [screenshot-dir]
// Defaults to the public demo (index.html). Pass a built page to check a real world.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const page = path.resolve(process.argv[2] || path.join(root, "index.html"));
const shots = process.argv[3];
let pass = 0, fail = 0;
const ok = (name, cond) => { console.log((cond ? "✅ " : "❌ ") + name); cond ? pass++ : fail++; };

const browser = await chromium.launch();
for (const vp of [{ name: "phone", width: 390, height: 844 }, { name: "laptop", width: 1280, height: 800 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", e => errors.push(e.message));
  p.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await p.goto("file://" + page);
  await p.waitForTimeout(600);
  const t = `[${vp.name}]`;
  const info = await p.evaluate(() => { const h = window.__hindsight; return h && { n: h.all.length, u: h.W.updates.length, b: h.W.bugs.length, i: h.W.investors.length, f: h.W.frames.length, items: h.items.length, x: h.hero.x }; });
  ok(`${t} page loads with no errors`, !!info && errors.length === 0);
  if (!info) { console.log(errors); continue; }
  ok(`${t} every update, bug and investor note is in the world (${info.items})`, info.items === info.u + info.b + info.i);
  ok(`${t} every thing has its own place`, await p.evaluate(() => { const s = new Set(window.__hindsight.items.map(o => o.x + "," + o.y)); return s.size === window.__hindsight.items.length; }));
  ok(`${t} the counter shows every thing (frames + items + the lighthouse)`, (await p.textContent("#allN")) === String(info.f + info.items + 1));
  await p.keyboard.down("ArrowRight"); await p.waitForTimeout(500); await p.keyboard.up("ArrowRight");
  ok(`${t} the chicken walks`, (await p.evaluate(() => window.__hindsight.hero.x)) > info.x + 40);
  await p.evaluate(() => window.__hindsight.openFrame(window.__hindsight.items[0]));
  ok(`${t} a frame opens with the thing's title`, (await p.isVisible("#frame")) && (await p.textContent("#fTitle")) === (await p.evaluate(() => window.__hindsight.items[0].title)));
  ok(`${t} looking at it ticks it seen`, (await p.textContent("#seenN")) === "1");
  if (shots) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: path.join(shots, `${vp.name}-frame.png`) }); }
  await p.click("#fNext");
  ok(`${t} Forward › moves to the next thing`, (await p.textContent("#seenN")) === "2");
  await p.click("#fClose");
  ok(`${t} the frame closes`, !(await p.isVisible("#frame")));
  await p.click("#jbtn");
  ok(`${t} the journal lists everything`, (await p.locator("#jList .it").count()) === info.f + info.items + 1);
  await p.click('.tab[data-f="unseen"]');
  ok(`${t} "Not seen" leaves out what you've seen`, (await p.locator("#jList .it").count()) === info.f + info.items + 1 - 2);
  await p.click("#jClose");
  await p.reload(); await p.waitForTimeout(400);
  ok(`${t} what you've seen is remembered after a reload`, (await p.textContent("#seenN")) === "2");
  ok(`${t} no horizontal page scroll`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (shots) { await p.evaluate(() => { const h = window.__hindsight; const o = h.items[Math.floor(h.items.length / 2)]; h.hero.x = o.x; h.hero.y = o.y + 80; }); await p.waitForTimeout(900); await p.screenshot({ path: path.join(shots, `${vp.name}-world.png`) }); }
  ok(`${t} still no errors at the end`, errors.length === 0);
  if (errors.length) console.log(errors);
  await ctx.close();
}
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
