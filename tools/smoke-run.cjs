// Smoke test for Hindsight Terminal: node tools/smoke-run.cjs [seed] [steps] [phone|laptop]. Prints every error it hits.
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
  const seen = {}; const steps = +stepsA;
  const btn = async re => p.evaluate(re => { const el = [...document.querySelectorAll('#panel button, #panel [data-a]')].find(b => new RegExp(re).test(b.textContent) && !b.disabled && b.offsetHeight); if (el) { el.click(); return el.textContent.slice(0, 30) } return '' }, re);
  const mash = async (n, label, keep) => { for (let i = 0; i < n; i++) { if (keep) await p.evaluate(k => { if (HS.S.phase === 'trade' && HS.S.loc !== k && !HS.S.dlg) { HS.S.loc = k; HS.render() } }, keep);
      const ph = await p.evaluate(() => HS.S.phase + '/' + (HS.S.loc || '') + (HS.S.dlg ? '/dlg' : '') + (HS.S.tab ? '/' + HS.S.tab : '')); seen[ph] = (seen[ph] || 0) + 1; last = label + ' ' + ph + ' ' + await press(); await p.waitForTimeout(90) } };
  // a new life
  for (const a of ['new', 'be', 'cusgo']) { await p.evaluate(a => { const x = document.querySelector(`[data-a="${a}"]`); x && x.click() }, a); await p.waitForTimeout(300) }
  await mash(25, 'intro');
  // every desk tab
  const tabs = await p.evaluate(() => [...document.querySelectorAll('[data-a="tab"]')].map(b => b.dataset.v));
  for (const tb of tabs) { await p.evaluate(v => { HS.S.loc = 'desk'; HS.S.dlg = null; HS.S.tab = v; HS.render() }, tb); await mash(Math.round(steps / 20), 'tab:' + tb, 'desk') }
  // rich, then the election
  await p.evaluate(() => { HS.S.cash = 6e9; HS.S.fame = 2e6; HS.S.loc = 'desk'; HS.S.dlg = null; HS.render() });
  let ran = ''; for (let i = 0; i < 30 && !ran; i++) { ran = await btn('PRESIDEN|RUN FOR|CAMPAIGN'); if (!ran) await mash(1, 'seek-run', 'desk') }
  for (let i = 0; i < 40; i++) { await mash(1, 'run:' + ran); if (await p.evaluate(() => HS.S.phase === 'election')) break }
  for (let i = 0; i < 60 && await p.evaluate(() => HS.S.phase === 'election'); i++) { last = 'election'; await btn('ADS'); await p.waitForTimeout(60) }
  await mash(Math.round(steps / 2), 'late');
  // death, rebirth, another character
  await p.evaluate(() => { if (HS.S.phase !== 'dead') HS.die('shot') }); await p.waitForTimeout(300); await mash(5, 'dead');
  await btn('BE BORN AGAIN'); await p.waitForTimeout(300); await mash(Math.round(steps / 4), 'life2');
  console.error('ran=' + ran);
  const red = await p.evaluate(() => { const e = [...document.querySelectorAll('div')].find(d => /^BUG:/.test(d.textContent || '') && d.offsetHeight); return e ? e.textContent.slice(0, 200) : '' });
  console.log(JSON.stringify({ seed: +seedA, vp: vpA, phases: seen, errors: [...new Set(errs)].slice(0, 15), red, missing: [...miss] }, null, 1));
  await b.close(); srv.close();
})();
