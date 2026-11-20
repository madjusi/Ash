/* Portfolio d'Isaac Ashuza : animations et interactions */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const raf=requestAnimationFrame;

/* Préchargement */
const pct=$('#pct'),ldb=$('#ldb');
function start(){
  document.body.classList.add('ready');document.documentElement.classList.add('ready');
  $('#loader').classList.add('done');typer();
}
let seen=false;try{seen=sessionStorage.getItem('ia-seen')==='1';sessionStorage.setItem('ia-seen','1')}catch(e){}
if(reduce||seen){pct.textContent=100;if(seen)$('#loader').style.display='none';start()}
else{
  const t0=performance.now(),D=700;
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
const bar=$('#bar'),hd=$('#hd'),top=$('#top'),dock=$('#dock');let tick=false;
function onScroll(){
  const h=document.documentElement,max=h.scrollHeight-innerHeight,y=scrollY;
  bar.style.transform=`scaleX(${max>0?y/max:0})`;
  hd.classList.toggle('solid',y>30);
  top.classList.toggle('show',y>700);dock.classList.toggle('show',y>500);
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

/* Thème clair / sombre */
const root=document.documentElement,tg=$('#theme');
const setTheme=t=>{root.dataset.theme=t;tg.setAttribute('aria-pressed',t==='light');try{localStorage.setItem('ia-theme',t)}catch(e){}};
tg.setAttribute('aria-pressed',root.dataset.theme==='light');
tg.onclick=()=>setTheme(root.dataset.theme==='light'?'dark':'light');

/* Message rapide vers WhatsApp (carte d'accueil) */
$('#quick').addEventListener('submit',e=>{
  e.preventDefault();
  const k=$('input[name=q]:checked',e.target).value,t=$('#qt').value.trim();
  window.open('https://wa.me/243971981127?text='+encodeURIComponent(`Bonjour Isaac, je cherche : ${k}.${t?'\n'+t:''}`),'_blank','noopener');
});

/* Formulaire vers WhatsApp */
const err=$('#err'),fields=[$('#fn'),$('#fm')];
fields.forEach(f=>f.addEventListener('input',()=>{f.removeAttribute('aria-invalid');err.textContent='';err.classList.remove('ok')}));
$('#form').addEventListener('submit',e=>{
  e.preventDefault();
  const n=$('#fn').value.trim(),m=$('#fm').value.trim(),t=$('#ft').value;
  err.classList.remove('ok');
  const bad=fields.filter(f=>!f.value.trim());
  fields.forEach(f=>bad.includes(f)?f.setAttribute('aria-invalid','true'):f.removeAttribute('aria-invalid'));
  if(bad.length){
    err.textContent=bad.length>1?'Indiquez votre nom et votre message pour continuer.':bad[0]===fields[0]?'Indiquez votre nom pour continuer.':'Écrivez votre message pour continuer.';
    bad[0].focus();return;
  }
  const btn=$('#form .btn');btn.disabled=true;
  err.textContent="Ouverture de WhatsApp… Si rien ne s'ouvre, autorisez les fenêtres pop-up.";err.classList.add('ok');
  const txt=`Bonjour Isaac, je m'appelle ${n}.\nProjet : ${t}.\n${m}`;
  window.open('https://wa.me/243971981127?text='+encodeURIComponent(txt),'_blank','noopener');
  setTimeout(()=>{btn.disabled=false},2500);
});

/* Fiche projet (fenêtre modale) */
const dlg=$('#dlg'),dth=$('#dth'),cats={identite:'Identité visuelle',affiche:'Affiches et flyers',social:'Réseaux sociaux',ui:'UI / UX'};
/* À adapter : une fiche par projet, dans l'ordre de la page */
const cases=[
  {d:"Création d'un logo et de sa charte graphique : couleurs, typographies et déclinaisons pour une image cohérente.",t:['Illustrator','Photoshop']},
  {d:"Affiche conçue pour l'impression et le partage en ligne, avec une hiérarchie claire qui attire l'œil.",t:['Photoshop','Illustrator']},
  {d:"Série de publications et de couvertures au style homogène, adaptée au format de chaque réseau.",t:['Photoshop','Canva']},
  {d:"Maquettes d'écrans pour une application mobile : parcours simple, composants réutilisables, rendu moderne.",t:['Figma']},
  {d:"Campagne de promotion déclinée en flyers et bannières, pour l'impression et le web.",t:['Photoshop','Canva']},
  {d:"Refonte d'un logo existant pour moderniser l'image de la marque tout en gardant ses repères.",t:['Illustrator']}
];
let openP=null;
function openCase(p){const i=$$('.proj').indexOf(p);openP=p;
  const th=$('.thumb',p),ic=$('i',th),im=$('img',th),c=cases[i]||{d:'',t:[]},t=$('h3',p).textContent;
  dth.style.cssText=th.getAttribute('style')||'';
  if(im)dth.style.background=`center/cover url("${im.getAttribute('src')}")`;
  $('#dic').className=ic?ic.className:'';
  $('#dc').textContent=cats[p.dataset.c]||'';
  $('#dt').textContent=t;
  $('#dd').textContent=c.d;
  $('#dtools').innerHTML=c.t.map(x=>`<span class="tag">${x}</span>`).join('');
  $('#dcta').href='https://wa.me/243971981127?text='+encodeURIComponent(`Bonjour Isaac, la fiche « ${t} » m'a plu. J'aimerais un projet similaire.`);
  if(!dlg.open)dlg.showModal();dlg.scrollTop=0;document.body.classList.add('lock');
}
$$('.proj').forEach((p,i)=>{
  p.tabIndex=0;p.setAttribute('role','button');p.setAttribute('aria-haspopup','dialog');
  p.addEventListener('click',()=>openCase(p,i));
  p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCase(p,i)}});
});
$('#dx').onclick=()=>dlg.close();
const step=d=>{const v=$$('.proj:not(.off)'),k=v.indexOf(openP);if(v.length>1)openCase(v[(k+d+v.length)%v.length])};
$('#dprev').onclick=()=>step(-1);$('#dnext').onclick=()=>step(1);
dlg.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',()=>document.body.classList.remove('lock'));

/* Barre d'action mobile : masquée pendant que le formulaire est visible */
new IntersectionObserver(([e])=>dock.classList.toggle('away',e.isIntersecting),{threshold:.2}).observe($('#contact'));

if(reduce||!fine)return;

/* Curseur personnalisé */
document.body.classList.add('mouse');
const cur=$('.cur'),ring=$('.ring');let mx=0,my=0,rx=0,ry=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx}px,${my}px)`},{passive:true});
(function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`;raf(loop)})();
$$('a,button,summary,.card,.proj,input,select,textarea').forEach(n=>{
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
