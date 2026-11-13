#!/usr/bin/env node
// Builds a Hindsight world from a LAIFE checkout and writes a single self-contained page.
//
//   node tools/build-world.mjs <laife-dir> <out.html> [--frames docs/OPUS-CHEATSHEET.md] [--frames docs/HOW-IT-WORKS.md]
//   node tools/build-world.mjs --demo <out.html> --frames docs/OPUS-CHEATSHEET.md   (public demo, no LAIFE data)
//
// Sources read (all optional, missing ones are skipped):
//   CHANGELOG.md              → updates   ("* 24 Oct 2026 · v2 · what · why")
//   brain/dev/Bug log.md      → bugs      (the "| Date | App | Bug | Reached the phone? | Cause → fix |" table)
//   apps/life/invest-seed.json → investors (the rule, ANT news, how-to and guard notes, each with its source)
//   --frames <md>             → frames    (one frame per "## " section; can be given more than once)
//
// The output is private when built from LAIFE. Never commit it to a public repo.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const args = process.argv.slice(2);
const frameFiles = [];
for (let i = 0; i < args.length; i++) if (args[i] === "--frames") { frameFiles.push(args[i + 1]); args.splice(i, 2); i--; }
const demo = args[0] === "--demo";
const [laife, out] = demo ? [null, args[1]] : args;
if (!out) { console.error("usage: node tools/build-world.mjs <laife-dir>|--demo <out.html> [--frames file.md]..."); process.exit(1); }

const MON = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };
export function isoDate(s) {
  const m = String(s).match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  if (!m || !MON[m[2].toLowerCase()]) return "";
  return `${m[3]}-${String(MON[m[2].toLowerCase()]).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}
const strip = s => String(s || "").replace(/\*\*/g, "").replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a).replace(/`/g, "").trim();
const read = p => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };

export function parseChangelog(md) {
  const out = [];
  for (const line of (md || "").split("\n")) {
    if (!/^\*\s+\d/.test(line)) continue;
    const parts = line.replace(/^\*\s+/, "").split(" · ").map(strip);
    const d = isoDate(parts[0]); if (!d) continue;
    if (parts.length >= 4) out.push({ d, tag: parts[1], t: parts[2], why: parts.slice(3).join(" · ").replace(/^why:\s*/i, "") });
    else if (parts.length === 3) out.push({ d, tag: "", t: parts[1], why: parts[2] });
    else out.push({ d, tag: "", t: parts.slice(1).join(" · "), why: "" });
  }
  return out;
}

export function parseBugLog(md) {
  const out = [];
  for (const line of (md || "").split("\n")) {
    if (!line.startsWith("|")) continue;
    const c = line.split("|").slice(1, -1).map(strip);
    if (c.length < 5) continue;
    const d = isoDate(c[0]); if (!d) continue; // skips header and divider rows
    out.push({ d, app: c[1], t: c[2], reached: c[3], fix: c.slice(4).join(" | ") });
  }
  return out;
}

export function parseInvest(json) {
  if (!json) return [];
  let arr; try { arr = JSON.parse(json); } catch { return []; }
  const out = [];
  for (const op of [].concat(arr)) {
    const v = op && op.data; if (!v) continue;
    const d = v.asOf || "";
    if (v.rule) out.push({ d, t: "The rule: " + v.rule, src: "", kind: "rule" });
    if (v.split && v.split.note) out.push({ d, t: v.split.note, src: "", kind: "split" });
    if (v.returnNote) out.push({ d, t: v.returnNote, src: "", kind: "growth" });
    if (v.ant) {
      if (v.ant.status) out.push({ d: v.ant.checked || d, t: `ANT: ${v.ant.status}${v.ant.pricing ? " · " + v.ant.pricing : ""}`, src: "", kind: "ANT" });
      for (const n of v.ant.news || []) out.push({ d: n.d || d, t: n.t, src: n.src || "", kind: "ANT news" });
    }
    for (const h of v.how || []) out.push({ d, t: h.t, src: h.src || "", kind: "how" });
    for (const g of v.guard || []) out.push({ d, t: g.t, src: g.src || "", kind: "guard" });
  }
  return out;
}

export function parseFrames(md) {
  const out = [];
  const secs = (md || "").split(/^## /m).slice(1);
  for (const s of secs) {
    const [title, ...rest] = s.split("\n");
    const body = rest.join("\n").trim();
    if (title.trim()) out.push({ title: strip(title), body: body.replace(/\*\*/g, "").replace(/`/g, "") });
  }
  return out;
}

const tpl = fs.readFileSync(path.join(root, "index.html"), "utf8");
const m = tpl.match(/(<script id="world-data" type="application\/json">)([\s\S]*?)(<\/script>)/);
if (!m) { console.error("index.html has no world-data block"); process.exit(1); }
const base = JSON.parse(m[2]);

let world;
if (demo) world = { ...base, frames: [] };
else {
  world = {
    title: "Hindsight · LAIFE",
    subtitle: "Every update, every bug, every investor note",
    final: { title: "The Final Update", body: "You walked LAIFE's whole road, from the first heart on 24 Oct 2026 to now. Every update, every bug and every investor note is behind you, looked at in hindsight.\n\nThe road keeps going: the next update starts here." },
    updates: parseChangelog(read(path.join(laife, "CHANGELOG.md"))),
    bugs: parseBugLog(read(path.join(laife, "brain/dev/Bug log.md"))),
    investors: parseInvest(read(path.join(laife, "apps/life/invest-seed.json"))),
    frames: [],
  };
}
for (const f of frameFiles) world.frames.push(...parseFrames(read(path.resolve(f))));

const json = JSON.stringify(world).replace(/</g, "\\u003c");
// a function replacement, so "$1" in the data (e.g. "$16.29bn") is never read as a pattern
const html = tpl.replace(m[0], () => m[1] + "\n" + json + "\n" + m[3]);
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Hindsight world → ${out}: ${world.updates.length} updates · ${world.bugs.length} bugs · ${world.investors.length} investor notes · ${world.frames.length} frames`);
