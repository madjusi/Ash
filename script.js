/* Portfolio d'Isaac Ashuza : animations et interactions */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const raf=requestAnimationFrame;

/* Bandeau */
const words=['Identité visuelle','Affiches','Réseaux sociaux','UI / UX','Branding','Retouche photo','Créativité'];
$('#mq').innerHTML=[...words,...words].map(w=>`<span>${w}</span>`).join('');

/* Préchargement */
const pct=$('#pct'),ldb=$('#ldb');
function start(){
  document.body.classList.add('ready');document.documentElement.classList.add('ready');
  $('#loader').classList.add('done');typer();
}
if(reduce){pct.textContent=100;start()}
else{
  const t0=performance.now(),D=1100;
  (function tick(t){
    const p=Math.min(1,(t-t0)/D);
    pct.textContent=Math.round(p*100);ldb.style.setProperty('--p',p);
    p<1?raf(tick):setTimeout(start,250);
  })(t0);
}

/* Texte qui s'écrit */
const roles=['Designer graphique','Créatif visuel','Passionné de technologie','Designer UI / UX'];
function typer(){
  const el=$('#typed');
  if(reduce){el.textContent=roles[0];return}
  let r=0,i=0,del=false;
  (function step(){
    const txt=roles[r];
    el.textContent=txt.slice(0,i);
    if(!del&&i===txt.length){del=true;return setTimeout(step,1600)}
    if(del&&i===0){del=false;r=(r+1)%roles.length}
    i+=del?-1:1;
    setTimeout(step,del?35:80);
  })();
}
if(reduce)$('#typed').textContent=roles[0];

/* Révélation + compteurs + barres */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  $$('[data-count]',e.target).forEach(count);
  if(e.target.dataset.count)count(e.target);
  io.unobserve(e.target);
}),{threshold:.15});
$$('[data-r]').forEach(n=>io.observe(n));
function count(el){
  if(el.done)return;el.done=1;
  const end=+el.dataset.count,suf=el.dataset.suf||'';
  if(reduce){el.textContent=end+suf;return}
  const t0=performance.now(),D=1600;
  (function f(t){
    const p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,4);
    el.textContent=Math.round(end*e)+suf;
    if(p<1)raf(f);
  })(t0);
}

/* Barre de progression, en-tête, lien actif, retour en haut */
const bar=$('#bar'),hd=$('#hd'),top=$('#top');let tick=false;
function onScroll(){
  const h=document.documentElement,max=h.scrollHeight-innerHeight,y=scrollY;
  bar.style.transform=`scaleX(${max>0?y/max:0})`;
  hd.classList.toggle('solid',y>30);
  top.classList.toggle('show',y>700);
  tick=false;
}
addEventListener('scroll',()=>{if(!tick){tick=true;raf(onScroll)}},{passive:true});onScroll();
top.onclick=()=>scrollTo({top:0});
const nav=$$('.links a'),secs=nav.map(a=>$(a.getAttribute('href')));
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){nav.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}
}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>s&&so.observe(s));

/* Menu mobile */
const bg=$('#burger'),links=$('#links');
function menu(o){bg.setAttribute('aria-expanded',o);links.classList.toggle('open',o);bg.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu')}
bg.onclick=()=>menu(bg.getAttribute('aria-expanded')!=='true');
nav.forEach(a=>a.addEventListener('click',()=>menu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});

/* Filtres de projets */
$$('.fb').forEach(b=>b.onclick=()=>{
  $$('.fb').forEach(x=>x.classList.toggle('on',x===b));
  const f=b.dataset.f;let n=0;
  $$('.proj').forEach(p=>{
    const show=f==='tous'||p.dataset.c===f;
    p.classList.toggle('off',!show);
    if(show){p.style.animation='none';p.offsetWidth;p.style.animation='';p.style.animationDelay=(n++*.06)+'s'}
  });
});

/* Formulaire vers WhatsApp */
$('#form').addEventListener('submit',e=>{
  e.preventDefault();
  const n=$('#fn').value.trim(),m=$('#fm').value.trim(),t=$('#ft').value;
  if(!n||!m){$('#err').textContent='Merci de renseigner votre nom et votre message.';return}
  $('#err').textContent='';
  const txt=`Bonjour Isaac, je m'appelle ${n}.\nProjet : ${t}.\n${m}`;
  window.open('https://wa.me/243971981127?text='+encodeURIComponent(txt),'_blank','noopener');
});

if(reduce||!fine)return;

/* Curseur personnalisé */
document.body.classList.add('mouse');
const cur=$('.cur'),ring=$('.ring');let mx=0,my=0,rx=0,ry=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx}px,${my}px)`},{passive:true});
(function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`;raf(loop)})();
$$('a,button,.card,.proj,input,select,textarea').forEach(n=>{
  n.addEventListener('pointerenter',()=>ring.classList.add('big'));
  n.addEventListener('pointerleave',()=>ring.classList.remove('big'));
});

/* Boutons magnétiques */
$$('.mag').forEach(b=>{
  b.addEventListener('pointermove',e=>{
    const r=b.getBoundingClientRect();
    b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;
  });
  b.addEventListener('pointerleave',()=>b.style.transform='');
});

/* Cartes : inclinaison 3D + halo lumineux */
$$('.tilt').forEach(c=>{
  c.addEventListener('pointermove',e=>{
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');
    c.style.transform=`perspective(800px) rotateX(${(.5-y)*10}deg) rotateY(${(x-.5)*12}deg) translateY(-4px)`;
  });
  c.addEventListener('pointerleave',()=>c.style.transform='');
});

/* Parallaxe du fond */
const au=$$('.aurora i');
addEventListener('pointermove',e=>{
  const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
  au.forEach((a,i)=>a.style.translate=`${x*(i?-60:60)}px ${y*(i?-60:60)}px`);
},{passive:true});
})();
