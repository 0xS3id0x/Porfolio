
const CFG = {
  github:'https://github.com/0xS3id0x',
  linkedin:'https://www.linkedin.com/in/mohamed-said-958b60294/',
};
const M_STEP = 4; 
/* ═══════════════════════════════════════ */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const go = sel => { const el=$(sel); if(el) el.scrollIntoView({behavior:'smooth'}); };

const rootEl = document.documentElement;
function setTheme(t){
  rootEl.dataset.theme = t;
  try{ localStorage.setItem('0x-theme',t); }catch(e){}
}
 $('#themeBtn').addEventListener('click',()=>setTheme(rootEl.dataset.theme==='dark'?'light':'dark'));

let toastT;
function toast(msg){
  $('#toastMsg').textContent = msg;
  const el=$('#toast'); el.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2400);
}
function copyText(t){
  const done=()=>toast('copied to clipboard');
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done).catch(done); }
  else{ const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select();
        try{document.execCommand('copy');}catch(e){} ta.remove(); done(); }
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-copy]'); if(c) copyText(c.dataset.copy);
});

if(matchMedia('(pointer:fine)').matches && !REDUCED){
  document.body.classList.add('has-cursor');
  const dot=$('#cdot'), ring=$('#cring');
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.transform=`translate(${mx-3}px,${my-3}px)`;
    const t=e.target.closest('a,button,input,[data-tilt],.chip,.tag');
    ring.classList.toggle('on',!!t);
  });
  (function loop(){
    rx+=(mx-rx)*0.16; ry+=(my-ry)*0.16;
    const s=ring.classList.contains('on')?27:16;
    ring.style.transform=`translate(${rx-s}px,${ry-s}px)`;
    requestAnimationFrame(loop);
  })();
}

const cv=$('#rain'), cx=cv.getContext('2d'), hero=$('.hero');
const GLYPHS='アカサタナハマヤラワ0123456789ABCDEF<>/{}$#*+=';
let drops=[], cols=0, mRun=false, mBoost=0, mFrame=0;
function sizeRain(){
  cv.width=hero.offsetWidth; cv.height=hero.offsetHeight;
  cols=Math.ceil(cv.width/16);
  drops=Array.from({length:cols},()=>Math.floor(Math.random()*-60));
}
function mDraw(){
  if(!mRun) return;
  mFrame++;
  if(mBoost || mFrame % M_STEP === 0){
    cx.fillStyle='rgba(6,10,8,0.08)'; cx.fillRect(0,0,cv.width,cv.height);
    cx.font='13px "JetBrains Mono",monospace';
    cx.fillStyle = mBoost ? '#5cffa8' : '#1f7a4a';
    for(let i=0;i<cols;i++){
      cx.fillText(GLYPHS[Math.floor(Math.random()*GLYPHS.length)], i*16, drops[i]*16);
      if(drops[i]*16>cv.height && Math.random()>0.975) drops[i]=0;
      drops[i]++;
    }
  }
  requestAnimationFrame(mDraw);
}
if(!REDUCED){
  sizeRain(); addEventListener('resize',sizeRain);
  new IntersectionObserver(([e])=>{
    const should = e.isIntersecting && rootEl.dataset.theme==='dark';
    if(should && !mRun){ mRun=true; mDraw(); } else if(!should){ mRun=false; }
  }).observe(hero);
  new MutationObserver(()=>{
    if(rootEl.dataset.theme!=='dark') mRun=false;
    else if(hero.getBoundingClientRect().bottom>0 && !mRun){ mRun=true; mDraw(); }
  }).observe(rootEl,{attributes:true,attributeFilter:['data-theme']});
}
function boostRain(){ if(REDUCED||!mRun) return; mBoost=1; setTimeout(()=>mBoost=0,5000); }

 $('#ghBtn').addEventListener('click',()=>open(CFG.github,'_blank'));
const mmenu=$('#mmenu');
 $('#burger').addEventListener('click',()=>{mmenu.classList.add('open');document.body.style.overflow='hidden';});
function closeMenu(){mmenu.classList.remove('open');document.body.style.overflow='';}
 $('#mclose').addEventListener('click',closeMenu);
 $$('#mmenu a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('scroll',()=>{
  const h=document.documentElement;
  $('#pbar').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
},{passive:true});
const secIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    $$('.nlinks a').forEach(a=>a.classList.toggle('active',a.dataset.sec===e.target.id));
  }
}),{rootMargin:'-45% 0px -50% 0px'});
 $$('main section').forEach(s=>secIO.observe(s));

 $$('.grid').forEach(g=>[...g.children].forEach((c,i)=>{
  if(c.classList.contains('rv')) c.style.setProperty('--rd',(i*70)+'ms');
}));
const rvIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in'); rvIO.unobserve(e.target); }
}),{threshold:.12});
 $$('.rv').forEach(el=>rvIO.observe(el));


function attachTilt(el){
  if(REDUCED) return;
  const k = el.dataset.tilt==='soft' ? .45 : 1;
  el.addEventListener('mouseenter',()=>el.classList.add('tilting'));
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
    el.style.setProperty('--gx',(e.clientX-r.left)+'px');
    el.style.setProperty('--gy',(e.clientY-r.top)+'px');
    el.style.transform=`perspective(850px) rotateX(${(-py*6*k).toFixed(2)}deg) rotateY(${(px*8*k).toFixed(2)}deg) translateZ(${(16*k).toFixed(0)}px) scale(${(1+.015*k).toFixed(3)})`;
    el.style.zIndex=8;
  });
  el.addEventListener('mouseleave',()=>{
    el.classList.remove('tilting');   
    el.style.transform='';            
    setTimeout(()=>{ if(!el.classList.contains('tilting')) el.style.zIndex=''; },560);
  });
}
 $$('[data-tilt]').forEach(attachTilt);


const tbody=$('#tbody'), tout=$('#tout'), cmdIn=$('#cmd'), tmirror=$('#tmirror'), iline=$('#iline');
let booted=false, skipBoot=false, hist=[], hIdx=0, busy=false;

function tprint(html,cls=''){
  const d=document.createElement('div');
  d.className='tline '+cls; d.innerHTML=html+'\n';
  tout.appendChild(d); tbody.scrollTop=tbody.scrollHeight; return d;
}
async function typeLine(prefix,rest){
  const d=tprint(prefix);
  for(const ch of rest){ d.innerHTML=prefix+esc(d.dataset.t=(d.dataset.t||'')+ch); tbody.scrollTop=tbody.scrollHeight; await sleep(9); }
}
function echoCmd(v){
  tprint(`<span class="p-user">0xS3id0x@kali</span><span class="p-dim">:~$</span> ${esc(v)}`);
}
const BOOT=[
  ['<span class="t-ok">[ OK ]</span> ','core.modules ........ loaded'],
  ['<span class="t-ok">[ OK ]</span> ','uplink .............. established — session granted'],
  ['<span class="t-ok">[ OK ]</span> ','identity ............ Mohamed Said'],
  ['<span class="t-ok">[ OK ]</span> ','focus ............... Offensive Security · Bug Bounty Hunting · Web Application Security'],
  ['<span class="t-ok">[ OK ]</span> ','playground .......... HTB · YesWeHack · HackerOne · Intigriti'],
];
async function boot(){
  if(booted) return; booted=true;
  for(const [p,r] of BOOT){ skipBoot ? tprint(p+r) : await typeLine(p,r); if(!skipBoot) await sleep(90); }
  if(!skipBoot) await sleep(150);
  tprint('');
  tprint(`<span class="t-ok">»</span> all systems operational.`);
  tprint(`type <b>help</b> to see available commands.`);
  tprint(`<span class="p-dim">hint: try 'whoami', 'cat flag.txt'</span>`);
  iline.classList.add('ready');
  if(matchMedia('(pointer:fine)').matches && !skipBoot) cmdIn.focus();
}
hero.addEventListener('click',()=>{ if(!booted) skipBoot=true; });
addEventListener('keydown',()=>{ if(!booted) skipBoot=true; });
if(REDUCED){ skipBoot=true; boot(); } else boot();

 $('.terminal').addEventListener('click',()=>{ if(booted) cmdIn.focus(); });
cmdIn.addEventListener('input',()=>{ tmirror.textContent=cmdIn.value; });
cmdIn.addEventListener('keydown',e=>{
  if(e.key==='Enter'){ const v=cmdIn.value; cmdIn.value=''; tmirror.textContent=''; exec(v); }
  else if(e.key==='ArrowUp'){
    e.preventDefault();
    if(hist.length){ hIdx=Math.max(0,hIdx-1); cmdIn.value=hist[hIdx]||''; tmirror.textContent=cmdIn.value; }
  }else if(e.key==='ArrowDown'){
    e.preventDefault();
    if(hist.length){ hIdx=Math.min(hist.length,hIdx+1); cmdIn.value=hist[hIdx]||''; tmirror.textContent=cmdIn.value; }
  }else if(e.key==='Tab'){ e.preventDefault(); complete(); }
});
function complete(){
  const v=cmdIn.value.trim().toLowerCase(); if(!v) return;
  const m=Object.keys(CMDS).filter(k=>k.startsWith(v));
  if(m.length===1){ cmdIn.value=m[0]+' '; tmirror.textContent=cmdIn.value; }
  else if(m.length>1){ tprint(`<span class="p-dim">${m.map(esc).join('   ')}</span>`); }
}
const NAVMAP={about:'#about',skills:'#skills',projects:'#projects',certs:'#certs',writeups:'#writeups',contact:'#contact'};
function navCmd(name,msg){ tprint(msg); setTimeout(()=>go(NAVMAP[name]),420); }

const CMDS={
  help(){
    [
    '  about       read ~/about.txt',
    '  skills      list the arsenal categories',
    '  projects    jump to pinned builds',
    '  certs       verify the cert chain',
    '  writeups    medium + htb blog',
    '  contact     open a channel',
    '  socials     dump all the links',
    '  whoami      identity check',
    '  theme       flip light / dark',
    '  clear       wipe the screen',
    '  flag        capture it'].forEach(l=>tprint(esc(l)));
ls  },
  whoami(){ tprint('Mohamed Said · Bug Bounty Hunter · Security Researcher'); },
  about(){ navCmd('about','opening ~/about.txt ...'); },
  skills(){ navCmd('skills','listing skill categories ...'); },
  projects(){ navCmd('projects','opening the arsenal — pinned builds ...'); },
  certs(){ navCmd('certs','verifying chain: 5/5 signatures valid'); },
  writeups(){ navCmd('writeups','tailing writeups.log ...'); },
  contact(){ navCmd('contact','opening channel ...'); },
  socials(){
    const rows=[['github',CFG.github],['linkedin',CFG.linkedin],
                ['medium',$('#mediumLink')?.href],['htb blog',$('#blogLink')?.href]];
    rows.forEach(([k,u])=>{
      if(!u) return;
      tprint(`  ${k.padEnd(9)}→ <a href="${u}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\//,''))}</a>`);
    });
  },
  theme(){ setTheme(rootEl.dataset.theme==='dark'?'light':'dark'); tprint(`theme → <b>${rootEl.dataset.theme}</b>`,'t-ok'); },
  clear(){ tout.innerHTML=''; },
  date(){ tprint(esc(new Date().toString())); },
  echo(a,v){ tprint(esc(v.slice(4))||' '); },
  history(){ hist.forEach((h,i)=>tprint(`<span class="p-dim">${String(i+1).padStart(3)}</span>  ${esc(h)}`)); },
  ls(){ tprint('about.txt   skills/   projects/   certs/   writeups/   contact.sh   flag.txt   '); },
  cat(a){
    const f=(a[0]||'').toLowerCase();
    if(!f) return tprint('cat: missing operand','t-err');
    if(f==='flag.txt'||f==='flag') return CMDS.flag();
    if(f==='about.txt'){ tprint('Bug bounty hunter and security researcher with a focus on web application security and passion for offensive security. <span class="p-dim">(full story in ./about)</span>'); return; }
    tprint(`cat: ${esc(a[0])}: No such file or directory`,'t-err');
  },
  flag(){ tprint('FLAG{H4PPY_H4CKING!}','t-ok'); },
  sudo(a,v){
    const j=a.join(' ').toLowerCase();
    
  },
  rm(){ tprint("rm: it's a portfolio, not a production server. but I admire the ambition.",'t-warn'); },
  hack(){
    if(busy) return; busy=true;
    (async()=>{
      const l=tprint('');
      for(let i=0;i<=20;i++){
        l.textContent=`hacking mainframe [${'█'.repeat(i)}${'░'.repeat(20-i)}] ${i*5}%`;
        tbody.scrollTop=tbody.scrollHeight; await sleep(70);
      }
      tprint('access granted — to my <a href="'+CFG.linkedin+'" target="_blank" rel="noopener">DMs</a>. let\'s talk.','t-ok');
      busy=false;
    })();
  },
  matrix(){ boostRain(); tprint('wake up, guest ... (rain boosted for 5s)','t-ok'); },
};
function exec(raw){
  const v=raw.trim();
  echoCmd(v);
  if(!v) return;
  hist.push(v); hIdx=hist.length;
  const [c,...args]=v.split(/\s+/);
  const name=c.toLowerCase();
  if(CMDS[name]) CMDS[name](args,v);
  else tprint(`zsh: command not found: <b>${esc(c)}</b> — try 'help'`,'t-err');
  tbody.scrollTop=tbody.scrollHeight;
}
 $$('.chip').forEach(ch=>ch.addEventListener('click',e=>{
  e.stopPropagation();
  if(!booted){ skipBoot=true; setTimeout(()=>boot(),0); }
  setTimeout(()=>{ exec(ch.dataset.cmd); if(matchMedia('(pointer:fine)').matches) cmdIn.focus(); },80);
}));


const _m=$('#mediumLink'), _b=$('#blogLink');
if(_m && $('#cbMedium')) $('#cbMedium').href=_m.href;
if(_b && $('#cbBlog'))   $('#cbBlog').href=_b.href;

let baseTitle=document.title;
document.addEventListener('visibilitychange',()=>{
  document.title=document.hidden?'[SIGNAL LOST] — 0xS3id0x':baseTitle;
});
window.lucide&&lucide.createIcons();
