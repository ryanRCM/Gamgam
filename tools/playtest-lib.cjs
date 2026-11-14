const { chromium } = require('playwright');
const path=require('path');
const fs=require('fs');
const DIR=process.env.PLAYTEST_DIR||require('os').tmpdir();
exports.start=async(mode,opts={})=>{
  const mob=mode==='m';
  const ud=path.join(DIR,'profile_'+mode+(opts.prof||''));
  if(opts.fresh)fs.rmSync(ud,{recursive:true,force:true});
  const ctx=await chromium.launchPersistentContext(ud,mob?{viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'}:{viewport:{width:1280,height:800},deviceScaleFactor:1});
  const page=ctx.pages()[0]||await ctx.newPage();
  const errs=[];
  page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push('['+m.type()+'] '+m.text().slice(0,300))});
  page.on('pageerror',e=>errs.push('[pageerror] '+String(e.message).slice(0,300)+' @ '+String(e.stack||'').split('\n')[1]));
  page.on('requestfailed',r=>errs.push('[reqfail] '+r.url().slice(0,120)));
  page.on('response',r=>{if(r.status()>=400)errs.push('['+r.status()+'] '+r.url().slice(0,120))});
  page.on('dialog',d=>{errs.push('[dialog] '+d.message().slice(0,200));d.accept().catch(()=>{})});
  await page.goto(''+(process.env.GAME_URL||'http://localhost:8765/')+'',{waitUntil:'load'});
  await page.waitForTimeout(opts.wait||1500);
  const h={ctx,page,errs,mob,
    shot:async name=>{const f=(mob?'m_':'d_')+name+'.png';await page.screenshot({path:path.join(DIR,f)});return 'SHOT '+f},
    ui:async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
      const S=window.HS&&HS.S;return {phase:S&&S.phase,loc:S&&S.loc,tab:S&&S.tab,cash:S&&S.cash,hud:(document.getElementById('hud')||{}).innerText,
      panel:(document.getElementById('panel').innerText||''),
      btns:[...document.querySelectorAll('button')].filter(vis).map(b=>(b.dataset.a||b.id||'?')+(b.disabled?'[X]':'')+':'+b.innerText.replace(/\n/g,' / ').slice(0,40)),
      log:document.getElementById('lines').innerText,bug:(document.getElementById('hsbug')||{}).innerText}}),
    click:async(sel)=>{const l=page.locator(sel).first();if(mob)await l.tap({timeout:3000});else await l.click({timeout:3000})},
    act:async(a,i=0)=>{const l=page.locator(`[data-a="${a}"]`).nth(i);if(mob)await l.tap({timeout:3000});else await l.click({timeout:3000});await page.waitForTimeout(250)},
    txt:async(t)=>{const l=page.locator('button:visible',{hasText:t}).first();if(mob)await l.tap({timeout:3000});else await l.click({timeout:3000});await page.waitForTimeout(250)},
    ev:(f,a)=>page.evaluate(f,a),
    save:()=>page.evaluate(()=>{try{localStorage.setItem('hindsight-v2',JSON.stringify(HS.S))}catch(e){}}),
    fps:async(ms=2000)=>page.evaluate(ms=>new Promise(res=>{let n=0,t0=performance.now(),last=t0,worst=0;function f(t){n++;worst=Math.max(worst,t-last);last=t;if(t-t0<ms)requestAnimationFrame(f);else res({fps:Math.round(n*1000/(t-t0)),worstFrameMs:Math.round(worst)})}requestAnimationFrame(f)}),ms),
    wait:ms=>page.waitForTimeout(ms),
    end:async()=>{console.log('ERRS',JSON.stringify([...new Set(errs)],null,1));await ctx.close()}};
  return h;
};
exports.brief=async(h,n=500)=>{const u=await h.ui();return `[${u.phase}/${u.loc}/${u.tab}] $${Math.round(u.cash)} | ${u.btns.filter(b=>!/^(snd|unm|reset):/.test(b)).join(' | ').slice(0,900)}\n  LOG: ${(u.log||'').replace(/\n/g,' // ')}\n  PANEL: ${u.panel.replace(/\n/g,' / ').slice(0,n)}${u.bug?'\n  HSBUG: '+u.bug:''}`};
// walk dialogue: choose(opts[],i)->index or -1 to stop
exports.walk=async(h,choose,max=30)=>{for(let i=0;i<max;i++){const o=await h.page.evaluate(()=>({d:[...document.querySelectorAll('[data-a="dopt"]')].map(b=>(b.disabled?'[X]':'')+b.innerText.replace(/\n/g,' / ')),p:document.getElementById('panel').innerText.replace(/\n/g,' / ').slice(0,900)}));
  if(!o.d.length){console.log('  (no dopt) '+o.p.slice(0,200));return}
  console.log('  NODE: '+o.p);const ix=choose?choose(o.d,i):0;if(ix<0)return;console.log('   -> '+o.d[ix]);await h.act('dopt',ix);await h.wait(450)}};
