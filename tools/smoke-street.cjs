// Smoke test for Hindsight Terminal: node tools/smoke-street.cjs [seed] [steps] [phone|laptop]. Prints every error it hits.
// usage: node smoke.cjs [seed] [steps] [phone|laptop]
const http = require('http'), fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const dir = path.join(__dirname, '..', 'terminal');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff2': 'font/woff2' };
const miss = new Set();
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(dir, u.endsWith('/') ? u + 'index.html' : u); if (!f.startsWith(dir) || !fs.existsSync(f)) { miss.add(u); r.writeHead(404); return r.end() } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r) });
const [, , seedA = '1', stepsA = '250', vpA = 'phone'] = process.argv;
let seed = +seedA; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const SKIP = new Set(['reset', 'unm', 'sexp', 'dl', 'download', 'xtravel', 'xgames', 'xboss', 'devtap', 'voice']);
(async () => {
  await new Promise(ok => srv.listen(0, ok)); const url = 'http://localhost:' + srv.address().port + '/';
  const b = await chromium.launch();
  const ctx = await b.newContext(vpA === 'phone' ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage(); const errs = []; let last = '';
  p.on('pageerror', e => errs.push(last + ' :: ' + e.message.split('\n')[0]));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(last + ' :: console ' + m.text().split('\n')[0].slice(0, 160)) });
  p.on('dialog', d => d.dismiss());
  await p.goto(url); await p.waitForTimeout(1200);
  const press = async () => p.evaluate(r => {
    const vis = el => { const q = el.getBoundingClientRect(); return q.width > 0 && q.height > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.disabled };
    const pool = [...document.querySelectorAll('#panel [data-a], #pie [data-k], #tc button, #emp21.on button, .mbtn21')].filter(vis);
    if (!pool.length) return 'none';
    const el = pool[Math.floor(r * pool.length)]; const a = el.dataset.a || el.dataset.k || el.id || el.className;
    if (['reset', 'unm', 'sexp', 'xtravel', 'xgames', 'xboss', 'devtap', 'voice'].includes(a)) return 'skip:' + a;
    el.click(); return a + (el.dataset.v ? '=' + el.dataset.v : '');
  }, rnd());
  const tapWorld = async () => p.evaluate(r => { if (!(HS.S.loc === 'world' && !HS.S.dlg)) return; const c = document.getElementById('scr').getBoundingClientRect(); const x = c.left + c.width * r, y = c.top + c.height * (.45 + .3 * ((r * 7) % 1));
    document.getElementById('scr').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'touch' })); }, rnd());
  const seen = {};
  // side pages, each opened on its own and clicked through
  for (const pg of ['pack/14_travel/travel.html', 'pack/15_minigames/minigames.html', 'pack/17_hollow_truth/boss.html']) {
    const q = await ctx.newPage(); q.on('pageerror', e => errs.push(pg + ' :: ' + e.message.split('\n')[0])); await q.goto(url + pg); await q.waitForTimeout(700);
    for (let k = 0; k < 40; k++) { last = pg; await q.evaluate(r => { const bs = [...document.querySelectorAll('button,a[href^="#"]')].filter(b => b.offsetHeight && !b.disabled); if (bs.length) bs[Math.floor(r * bs.length)].click() }, rnd()); await q.waitForTimeout(80) }
    await q.close() }
  // a life, then every street action on a person, with each character
  for (const a of ['new', 'be', 'cusgo']) { await p.evaluate(a => { const x = document.querySelector(`[data-a="${a}"]`); x && x.click() }, a); await p.waitForTimeout(300) }
  await p.evaluate(() => { for (let i = 0; i < 40 && HS.S.phase === 'intro'; i++) { const x = document.querySelector('[data-a]'); x && x.click() } });
  for (const ch of ['gamb', 'narc', 'para', 'insom']) {
    last = 'ability ' + ch; await p.evaluate(ch => { const S = HS.S; S.ch = ch; S.abT = 0; S.dlg = null; S.loc = 'desk'; S.phase = 'trade'; HS.render(); const b = document.querySelector('[data-a="abil"]'); b && b.click() }, ch); await p.waitForTimeout(200) }
  await p.evaluate(() => { HS.S.cash = 1e6; HS.enterWorld() }); await p.waitForTimeout(800);
  const acts = ['talk','chat','ask','give','punch','beat','sed','rob','snap','chk','host','kill'];
  for (const k of acts) {
    last = 'street ' + k;
    await p.evaluate(k => { const W = HS.WR, m = W.me; HS.S.dlg = null; const e = W.ents.find(e => !e.dead && e.p && Math.abs(e.x - m.x) < 600); if (!e) return; e.x = m.x + 12; e.vx = 0; m.todo = { e, a: k, t: 9 } }, k);
    await p.waitForTimeout(2500);
    await p.evaluate(() => { for (let i = 0; i < 6 && HS.S.dlg; i++) { const b = document.querySelector('#panel [data-a="dopt"]:not([disabled]), #panel [data-a="dcont"]'); if (!b) break; b.click() } HS.S.dlg = null });
  }
  // dying in the street
  last = 'street death'; await p.evaluate(() => { HS.hurtMe ? HS.hurtMe(500, null, 'pistol', true) : 0 }); await p.waitForTimeout(2500);
  seen.end = await p.evaluate(() => HS.S.phase);
  const red = await p.evaluate(() => { const e = [...document.querySelectorAll('div')].find(d => /^BUG:/.test(d.textContent || '') && d.offsetHeight); return e ? e.textContent.slice(0, 200) : '' });
  console.log(JSON.stringify({ seed: +seedA, vp: vpA, phases: seen, errors: [...new Set(errs)].slice(0, 15), red, missing: [...miss] }, null, 1));
  await b.close(); srv.close();
})();
