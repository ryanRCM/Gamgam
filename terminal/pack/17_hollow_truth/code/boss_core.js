/* Engine-independent, deterministic combat model. Coordinates: feet at (x, groundY). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HollowBoss=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const CONFIG={wealthThresholds:[100000,500000,1000000],arena:[24,616],groundY:184,player:{maxHP:100,maxStamina:100,speed:110,damage:14,range:68,attackDuration:.48,attackContact:.18,attackCost:12,dodgeCost:25,dodgeDuration:.32,dodgeSpeed:245},boss:{maxHP:168,speed:27,phaseTwoAt:.5,slam:{windup:.9,active:.12,recovery:.95,reach:80,damage:22},sweep:{windup:1.15,active:.16,recovery:1.1,reach:118,damage:16}},ending:{id:'hollow_truth_unofficial_capitalism',title:'The Hollow Truth',subtitle:'Unofficial Capitalism Ending'}};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function create(){return {mode:'statue',wealth:0,peakWealth:0,cracks:0,player:{x:180,hp:100,stamina:100,facing:1,action:'idle',time:0,contact:false,invul:0},boss:{x:448,hp:168,facing:-1,action:'idle',time:0,turn:0,contact:false,phase:1},revealTime:0,events:[],elapsed:0,ending:null}}
function setWealth(s,value){if(!Number.isFinite(value)||value<0)throw Error('wealth must be nonnegative');s.wealth=value;s.peakWealth=Math.max(s.peakWealth,value);const next=CONFIG.wealthThresholds.filter(v=>s.peakWealth>=v).length;if(next>s.cracks)s.events.push({type:'statue_crack',stage:next});s.cracks=next;return s}
function awaken(s){if(s.mode!=='statue'||s.cracks<3)return false;s.mode='reveal';s.revealTime=0;s.events.push({type:'mask_release'});return true}
function attack(s){const p=s.player;if(s.mode!=='combat'||p.action==='attack'||p.action==='dodge'||p.stamina<CONFIG.player.attackCost)return false;p.action='attack';p.time=0;p.contact=false;p.stamina-=CONFIG.player.attackCost;return true}
function dodge(s,direction){const p=s.player;if(s.mode!=='combat'||p.action==='dodge'||p.action==='attack'||p.stamina<CONFIG.player.dodgeCost)return false;p.action='dodge';p.time=0;p.facing=direction<0?-1:1;p.invul=CONFIG.player.dodgeDuration;p.stamina-=CONFIG.player.dodgeCost;return true}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function hurtbox(s,who){const c=s[who];return {x:c.x-(who==='boss'?24:8),y:CONFIG.groundY-(who==='boss'?90:38),w:who==='boss'?48:16,h:who==='boss'?90:38}}
function attackbox(x,facing,reach){return {x:facing>0?x:x-reach,y:CONFIG.groundY-45,w:reach,h:45}}
function tick(s,dt,input={}){if(!Number.isFinite(dt)||dt<0)throw Error('dt must be nonnegative');let remaining=Math.min(dt,.25);while(remaining>0){const step=Math.min(remaining,1/60);advance(s,step,input);remaining-=step}return s}
function advance(s,dt,input){s.elapsed+=dt;const p=s.player,b=s.boss;p.invul=Math.max(0,p.invul-dt);
if(s.mode==='reveal'){s.revealTime+=dt;if(s.revealTime>=3.2){s.mode='combat';b.action='approach';b.time=0;s.events.push({type:'boss_fight_started'})}return}
if(s.mode!=='combat')return;
p.time+=dt;const moving=clamp(Number(input.move)||0,-1,1);
if(p.action==='dodge'){p.x+=p.facing*CONFIG.player.dodgeSpeed*dt;if(p.time>=CONFIG.player.dodgeDuration){p.action='idle';p.time=0}}
else if(p.action==='attack'){
 if(!p.contact&&p.time>=CONFIG.player.attackContact){p.contact=true;if(overlap(attackbox(p.x,p.facing,CONFIG.player.range),hurtbox(s,'boss'))){b.hp=Math.max(0,b.hp-CONFIG.player.damage);s.events.push({type:'boss_hit',damage:CONFIG.player.damage,hitStopMs:45,cameraKickPx:2});if(b.hp<=0){s.mode='victory';s.defeatedAt=s.elapsed;b.action='collapse';b.time=0;s.events.push({type:'boss_defeated'});return}}}
 if(p.time>=CONFIG.player.attackDuration){p.action='idle';p.time=0}
}else{p.action=input.block?'block':moving?'walk':'idle';if(moving&&!input.block){p.x+=moving*CONFIG.player.speed*dt;p.facing=moving<0?-1:1}p.stamina=Math.min(100,p.stamina+(input.block?8:22)*dt)}
p.x=clamp(p.x,...CONFIG.arena);const distance=Math.abs(p.x-b.x);b.phase=b.hp<=CONFIG.boss.maxHP*CONFIG.boss.phaseTwoAt?2:1;b.time+=dt;
if(b.action==='idle'||b.action==='approach'){b.facing=p.x<b.x?-1:1;if(distance>72){b.action='approach';b.x+=b.facing*CONFIG.boss.speed*(b.phase===2?1.35:1)*dt}else{b.action=(b.turn++%2===0?'slam':'sweep')+'_windup';b.time=0;b.contact=false;s.events.push({type:'telegraph',attack:b.action.split('_')[0]})}}
else{const [name,stage]=b.action.split('_');const a=CONFIG.boss[name];if(a){const speed=b.phase===2?.82:1;
 if(stage==='windup'&&b.time>=a.windup*speed){b.action=name+'_active';b.time=0;s.events.push({type:'boss_contact',attack:name,cameraKickPx:name==='slam'?3:1});}
 else if(stage==='active'){
  if(!b.contact){b.contact=true;if(p.invul<=0&&overlap(attackbox(b.x,b.facing,a.reach),hurtbox(s,'player'))){const blocking=p.action==='block'&&p.stamina>=18&&p.facing===(b.x>p.x?1:-1);const damage=blocking?Math.ceil(a.damage*.25):a.damage;p.hp=Math.max(0,p.hp-damage);p.invul=.4;if(blocking)p.stamina-=18;s.events.push({type:'player_hit',damage,blocked:blocking});if(p.hp<=0){s.mode='defeat';s.events.push({type:'player_defeated'});return}}}
  if(b.time>=a.active){b.action=name+'_recovery';b.time=0}
 }else if(stage==='recovery'&&b.time>=a.recovery*speed){b.action='approach';b.time=0}
}}
b.x=clamp(b.x,48,592);
}
function claimEnding(s,choice){if(s.mode!=='victory')return false;if(choice==='release'){s.wealth=0;s.mode='ending';s.ending=CONFIG.ending;s.events.push({type:'ending_unlocked',id:CONFIG.ending.id});return true}if(choice==='keep'){s.mode='aftermath';s.events.push({type:'fortune_kept'});return true}return false}
function sprite(s){const b=s.boss;if(s.mode==='statue')return ['suspended_sealed','suspended_hairline','suspended_fractured','suspended_fractured'][s.cracks];if(s.mode==='reveal')return s.revealTime<.45?'pipe_break':s.revealTime<.95?'fall':s.revealTime<1.6?'landing':s.revealTime<2.25?'mask_split':s.revealTime<2.8?'mask_fall':'unmasked_idle';if(['victory','ending','aftermath'].includes(s.mode)){const t=s.elapsed-(s.defeatedAt||0);return t<.35?'rupture':t<.9?'collapse_a':t<1.5?'collapse_b':'hollow_shell'};if(b.action==='approach')return Math.floor(s.elapsed*4)%2?'walk_a':'walk_b';return {idle:'unmasked_idle',slam_windup:b.time<.4?'windup_a':'windup_b',slam_active:'slam',slam_recovery:'recovery',sweep_windup:'sweep_windup',sweep_active:'sweep_active',sweep_recovery:'sweep_recovery'}[b.action]||'unmasked_idle'}
function drainEvents(s){return s.events.splice(0)}
return {CONFIG,create,setWealth,awaken,attack,dodge,tick,claimEnding,sprite,hurtbox,attackbox,overlap,drainEvents};
});
