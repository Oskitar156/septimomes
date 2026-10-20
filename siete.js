/* 7 MESES — versión mejorada. No toca script.js / mbl.js / menu.js */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const IMG='images/7m/', KEY='felices7m_progreso_v6', KSON='felices7m_sonido';
const menu=$('#pantalla-menu'), s7=$('#pantalla-7m'), vista=$('#g7-vista'), cuerpo=$('#g7-cuerpo');
let hecho={}; try{ hecho=JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){}
let sonido=true; try{ sonido=localStorage.getItem(KSON)!=='0'; }catch(e){}
let token=0, desbloqueoAvisado=!!hecho.__aviso;
const el=(t,c,h)=>{ const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; };
const mezclar=a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const esperar=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- sonido suave (WebAudio, sin archivos) ---------- */
let AC=null;
function tono(f,d=.22,tipo='sine',v=.07){
  if(!sonido) return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state==='suspended') AC.resume();
    const o=AC.createOscillator(), g=AC.createGain(); o.type=tipo; o.frequency.value=f;
    g.gain.setValueAtTime(0,AC.currentTime); g.gain.linearRampToValueAtTime(v,AC.currentTime+.02); g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+d+.05);
  }catch(e){}
}
const NOTAS=[523,587,659,784,880,988,1047];
const brillito=()=>{ tono(1047,.18); setTimeout(()=>tono(1319,.28),90); };
const acorde=()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tono(f,.5),i*110));

function chispas(x,y,n=16){
  for(let i=0;i<n;i++){
    const p=el('span','g7-chispa',['♥','✦','★'][i%3]);
    const a=Math.random()*6.28, d=40+Math.random()*70;
    p.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-20}px;color:${i%2?'#ff7fa8':'#ffd05a'}`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),1000);
  }
}
function fuego(x,y,n=22){
  const cols=['#ffd05a','#ff7fa8','#fff3b0','#c9a0ff','#8fe08a','#8fc9ff'];
  for(let i=0;i<n;i++){
    const p=el('i','g7-fw'); const a=i/n*6.283+Math.random()*.2, d=50+Math.random()*80;
    p.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;background:${cols[i%cols.length]};color:${cols[i%cols.length]}`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),1200);
  }
}
const chispasEl=e=>{ const r=e.getBoundingClientRect(); chispas(r.left+r.width/2,r.top+r.height/2); brillito(); };

/* ---------- entrada / salida ---------- */
const mostrar=e=>{ e.classList.add('activa'); requestAnimationFrame(()=>e.classList.add('visible')); };
const ocultar=e=>{ e.classList.remove('visible'); setTimeout(()=>e.classList.remove('activa'),400); };
function entrar(){ ocultar(menu); setTimeout(()=>{ mostrar(s7); s7.scrollTop=0; maquina(); },380); }
const t7=$('#tarjeta-7m');
t7.addEventListener('click',entrar);
t7.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); entrar(); } });
$('#g7-volver').addEventListener('click',()=>{ cerrar(); ocultar(s7); setTimeout(()=>mostrar(menu),380); });
$('#g7-descubrir').addEventListener('click',()=>{ tono(784,.2); $('#g7-hub-sec').scrollIntoView({behavior:'smooth'}); });
$('#g7-cerrar').addEventListener('click',cerrar);
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&vista.classList.contains('on')) cerrar(); });
const bs=$('#g7-sonido');
if(bs){ const pS=()=>{ bs.textContent=sonido?'🔊':'🔇'; bs.setAttribute('aria-pressed',sonido); }; pS();
  bs.onclick=()=>{ sonido=!sonido; try{ localStorage.setItem(KSON,sonido?'1':'0'); }catch(e){} pS(); tono(880,.15); }; }

/* frase que se escribe sola en la portada */
const FRASES=['Siete meses contigo, mi Odette :3','Cada día a tu lado es mi favorito ♥','Hice esto con todo mi cariño para ti ✦','Juega, sonríe y abre tu sorpresa mua'];
let mq=0;
async function maquina(){
  if(mq) return; mq=1; const f=$('#g7-frase'); if(!f){ mq=0; return; } let i=0;
  while(s7.classList.contains('activa')){
    const t=FRASES[i++%FRASES.length]; f.textContent='';
    for(const ch of t){ f.textContent+=ch; await esperar(55); }
    await esperar(2600);
    while(f.textContent.length){ f.textContent=f.textContent.slice(0,-1); await esperar(18); }
  }
  mq=0;
}

/* fondo: estrellas, corazones, huellitas */
for(let i=0;i<22;i++){ const e=el('i','g7-estrella','✦'); e.style.cssText=`left:${Math.random()*96}%;top:${Math.random()*96}%;font-size:${8+Math.random()*10}px;animation-delay:${-Math.random()*3}s;animation-duration:${2+Math.random()*3}s`; $('#g7-fondo').appendChild(e); }
const fondo=$('#g7-fondo');
for(let i=0;i<12;i++){ const h=el('i',null,i%4===3?'🐾':i%4===1?'✿':'♥'); h.style.cssText=`left:${4+i*8}%;font-size:${12+(i%3)*5}px;animation-duration:${9+(i*7%8)}s;animation-delay:${-i*1.7}s`; fondo.appendChild(h); }
s7.addEventListener('pointerdown',e=>{
  if(e.target.closest('button,.g7-card')) return;
  const h=el('span','g7-huella','🐾'); h.style.left=e.clientX-10+'px'; h.style.top=e.clientY-10+'px'; document.body.appendChild(h); setTimeout(()=>h.remove(),1300);
});
s7.addEventListener('pointermove',e=>{ const p=$('.g7-pib'); if(!p||e.pointerType==='touch') return; const x=(e.clientX/innerWidth-.5)*10, y=(e.clientY/innerHeight-.5)*8; p.style.translate=`${x}px ${y}px`; });

/* ---------- progreso ---------- */
function guardar(id){
  const ya=hecho[id]; hecho[id]=1; try{ localStorage.setItem(KEY,JSON.stringify(hecho)); }catch(e){}
  pintarHub();
  if(!ya && id!=='carta' && todosListos() && !desbloqueoAvisado){ desbloqueoAvisado=true; hecho.__aviso=1; try{ localStorage.setItem(KEY,JSON.stringify(hecho)); }catch(e){} setTimeout(avisoCarta,1800); }
}
const todosListos=()=>JUEGOS.every(g=>hecho[g.id]);
function avisoCarta(){
  if(!vista.classList.contains('on')) return;
  const a=el('div','g7-aviso','<div class="g7-aviso-in"><div class="g7-aviso-ic">💌</div><h3>¡LA CARTITA SE DESBLOQUEÓ!</h3><p>Completaste todo lo que preparé para ti. Ya puedes abrirla ♥</p></div>');
  const b=el('button','btn-pixel','ABRIR MI CARTITA'); b.onclick=()=>{ a.remove(); abrir(CARTA); };
  const c=el('button','btn-pixel','LUEGO'); c.onclick=()=>a.remove();
  $('.g7-aviso-in',a).append(b,c); document.body.appendChild(a); acorde(); confeti();
}
function confeti(){
  for(let i=0;i<44;i++){ const p=el('span','g7-conf',['♥','✦','★','🌸','🐾'][i%5]);
    p.style.cssText=`left:${Math.random()*100}vw;--dx:${(Math.random()-.5)*80}px;animation-duration:${2.2+Math.random()*2}s;animation-delay:${Math.random()*.6}s;color:${i%2?'#ff7fa8':'#ffd05a'}`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),5000); }
}
function fin(c,tit,txt,id,otra){ confeti(); acorde();
  const f=el('div','g7-fin',`<h3>${tit}</h3><p>${txt}</p>`);
  if(otra){ const b=el('button','btn-pixel','JUGAR OTRA VEZ'); b.onclick=otra; f.appendChild(b); }
  const v=el('button','btn-pixel','VOLVER A LOS 7 MESES'); v.onclick=cerrar; f.appendChild(v);
  c.appendChild(f); guardar(id);
  setTimeout(()=>{ f.scrollIntoView({behavior:'smooth',block:'center'}); const r=f.getBoundingClientRect(); chispas(r.left+r.width/2,r.top+30,26); },150);
}
const reiniciar=(fn)=>()=>{ cuerpo.innerHTML=''; fn(cuerpo); vista.scrollTop=0; };
async function escribir(node,txt,vel=26,saltar){
  node.textContent=''; for(const ch of txt){ if(saltar&&saltar()){ node.textContent=txt; return; } node.textContent+=ch; await esperar(vel); }
}

/* ---------- 1. MEMORIA ---------- */
const NOTAS_PAR=['Cómo me gusta mirarte ♥','Tu sonrisa me arregla el día','Contigo todo es más bonito','Eres mi lugar favorito','Gracias por quedarte conmigo','Mis pibbles favoritos: tú y yo'];
function memoria(c){
  const t=++token;
  c.innerHTML='<p class="g7-ayuda">Toca las cartas y encuentra las parejas. Cada una guarda un mensajito ♥</p><div class="g7-stats">MOVIMIENTOS <b id="m-mov">0</b> PAREJAS <b id="m-par">0/6</b></div><div class="mem-hearts" id="m-h"><i>♥</i><i>♥</i><i>♥</i><i>♥</i><i>♥</i><i>♥</i></div><div class="mem"></div><div class="mem-nota" id="m-nota">&nbsp;</div>';
  const g=$('.mem',c), nota=$('#m-nota',c); let mov=0,par=0,a=null,bloq=false;
  mezclar(['c1.jpg','c2.jpg','c3.jpg','c4.jpg','c5.jpg','pibbles.png'].flatMap(x=>[x,x])).forEach(src=>{
    const k=el('div','mc',`<div class="mc-in"><div class="mc-f mc-back"><span>♥</span></div><div class="mc-f mc-front"><img class="${src.includes('pib')?'pib':''}" src="${IMG}${src}" alt=""></div></div>`);
    k.dataset.s=src;
    k.onclick=()=>{
      if(bloq||k.classList.contains('vol')||k.classList.contains('par')) return;
      k.classList.add('vol'); tono(440+Math.random()*200,.12,'triangle');
      if(!a){ a=k; return; }
      mov++; $('#m-mov',c).textContent=mov; bloq=true;
      if(a.dataset.s===k.dataset.s){
        a.classList.add('par'); k.classList.add('par'); par++; $('#m-par',c).textContent=par+'/6'; $('#m-h',c).children[par-1].classList.add('on'); chispasEl(k);
        nota.classList.remove('on'); void nota.offsetWidth; nota.textContent='♥ '+NOTAS_PAR[par-1]+' ♥'; nota.classList.add('on'); a=null; bloq=false;
        if(par===6) setTimeout(()=>fin(c,'♥ ¡LAS ENCONTRASTE TODAS! ♥',`En ${mov} movimientos. Así de fácil me resulta encontrarte entre todos: eres lo mejor que me pasó. Felices 7 meses, mi Odette :3`,'memoria',reiniciar(memoria)),600);
      } else setTimeout(()=>{ if(t!==token)return; a.classList.remove('vol'); k.classList.remove('vol'); a=null; bloq=false; },800);
    };
    g.appendChild(k);
  });
}

/* ---------- 2. ROMPECABEZAS ---------- */
function puzzle(c,n=3){
  c.innerHTML=`<p class="g7-ayuda">Toca una pieza y luego otra para cambiarlas de lugar hasta armar la foto.</p>
  <div class="pz-niv"><button class="btn-pixel ${n===3?'sel':''}" data-n="3">FÁCIL 3×3</button><button class="btn-pixel ${n===4?'sel':''}" data-n="4">NORMAL 4×4</button></div>
  <div class="g7-stats">MOVIMIENTOS <b id="p-mov">0</b> BIEN PUESTAS <b id="p-ok">0</b></div><div class="pz-barra"><i id="p-bar"></i></div><div class="pz-marco"><div class="pz"></div></div><figure class="pz-guia"><img class="pz-ver" src="${IMG}puzzle.jpg" alt="Imagen guía"><figcaption>imagen guía</figcaption></figure>`;
  c.querySelectorAll('.pz-niv button').forEach(b=>b.onclick=()=>puzzle(c,+b.dataset.n));
  const g=$('.pz',c); g.style.gridTemplate=`repeat(${n},1fr)/repeat(${n},1fr)`;
  const N=n*n; let o=[...Array(N).keys()];
  do{ mezclar(o); }while(o.every((v,i)=>v===i));
  let sel=null,mov=0,listo=false;
  const pintar=()=>{
    g.innerHTML='';
    const bien=o.filter((v,i)=>v===i).length; $('#p-ok',c).textContent=bien+'/'+N; $('#p-bar',c).style.width=(bien/N*100)+'%';
    o.forEach((v,i)=>{
      const d=el('div'); const col=v%n,fila=Math.floor(v/n);
      d.style.backgroundSize=`${n*100}% ${n*100}%`; d.style.backgroundPosition=`${n>1?col/(n-1)*100:0}% ${n>1?fila/(n-1)*100:0}%`;
      if(v===i) d.className='ok'; if(sel===i) d.classList.add('sel');
      d.onclick=()=>{
        if(listo) return;
        if(sel===null){ sel=i; tono(520,.1,'triangle'); pintar(); return; }
        if(sel!==i){ [o[sel],o[i]]=[o[i],o[sel]]; mov++; $('#p-mov',c).textContent=mov; tono(660,.12,'triangle'); }
        sel=null; pintar();
        if(o.every((x,k)=>x===k)){
          listo=true; g.classList.add('listo'); g.parentNode.classList.add('listo'); g.querySelectorAll('div').forEach(x=>x.className=''); chispasEl(g);
          setTimeout(()=>fin(c,'♥ ¡LO ARMASTE! ♥',`Quedó completito, igual que me siento contigo: completo. (${mov} movimientos). Cada pieza de nosotros encaja, mi amor :3`,'puzzle',()=>puzzle(c,n)),500);
        }
      };
      g.appendChild(d);
    });
  };
  pintar();
}

/* ---------- 3. CORAZONES ESCONDIDOS ---------- */
function corazones(c){
  c.innerHTML='<p class="g7-ayuda">Hay 7 corazones escondidos en la escena. Tócalos para descubrir lo que guardan ♥</p><div class="g7-stats">ENCONTRADOS <b id="h-n">0/7</b></div>';
  const tr=el('div','hh-track','<i>♡</i><i>♡</i><i>♡</i><i>♡</i><i>♡</i><i>♡</i><i>♡</i>'); c.appendChild(tr);
  const esc=el('div','esc'); c.appendChild(esc);
  esc.appendChild(el('div','colina c1')); esc.appendChild(el('div','colina c2'));
  [['☁️',6,5,34],['☁️',62,10,40],['☁️',36,2,26],['🌷',4,60,30],['🌼',26,70,26],['🌻',84,58,34],['🌸',70,76,26],['🍃',46,56,22],['🌷',92,80,26],['🌼',55,84,22],['🌻',14,82,28],['🦋',20,30,24],['🐝',72,38,22],['🦋',50,24,20]].forEach(([e,x,y,s],k)=>{ const d=el('span',/☁/.test(e)?'nube':/[🦋🐝]/u.test(e)?'vuela':'bal',e); d.style.cssText=`left:${x}%;top:${y}%;font-size:${s}px;animation-delay:${-k*.7}s`; esc.appendChild(d); });
  esc.appendChild(el('img','pibs')).src=IMG+'pibbles.png';
  const pal=el('div','palabras'); c.appendChild(pal);
  const msg=el('div','hh-msg','Toca un corazón…'); c.appendChild(msg);
  const palabras=[['Cariño','Me encanta cómo me cuidas, incluso en los detalles más chiquitos.'],
    ['Confianza','Que me cuentes tus cosas es uno de los regalos más grandes que tengo.'],
    ['Apoyo','Tu apoyo me sostiene en los días en que yo solo no puedo.'],
    ['Gracias','Gracias por quedarte, por insistir y por creer en nosotros.'],
    ['Juntos','Contigo hasta los días difíciles se sienten más livianos.'],
    ['Aprender','Contigo he aprendido a ser más paciente, más atento y más humano.'],
    ['7 meses','Siete meses y mi corazón sigue eligiéndote cada mañana.']];
  let n=0;
  [[10,14],[78,24],[44,8],[7,64],[88,70],[34,56],[60,50]].forEach(([x,y],i)=>{
    const h=el('button','hh','♥'); h.style.left=x+'%'; h.style.top=y+'%'; h.setAttribute('aria-label','corazón escondido');
    h.onclick=()=>{
      h.classList.add('f'); chispasEl(h); tono(NOTAS[i],.4,'triangle'); pal.appendChild(el('span',null,palabras[i][0])); n++; tr.children[n-1].textContent='♥'; tr.children[n-1].classList.add('on'); $('#h-n',c).textContent=n+'/7';
      msg.classList.remove('on'); void msg.offsetWidth; msg.textContent='“'+palabras[i][1]+'”'; msg.classList.add('on');
      if(n===7) setTimeout(()=>fin(c,'♥ FELICES 7 MESES ♥','Los encontraste todos. Gracias por estar conmigo, por cada abrazo y cada palabra bonita. Te quiero muchísimo :3','corazones',reiniciar(corazones)),900);
    };
    esc.appendChild(h);
  });
}

/* ---------- 4. JARDÍN DE RECUERDOS ---------- */
const FOTOS=['nota1.jpg','nota2.jpg','nota3.jpg','nota4.jpg','nota5.jpg','nota6.jpg','c5.jpg','pibbles.png'];
const MENSAJES=[
 'Gracias por estar ahí cuando lo necesito, incluso cuando no sé cómo pedirlo. Contigo nunca me siento solo.',
 'Me gusta que me tengas confianza y me cuentes tus cosas: tus alegrías, tus miedos, tus días raros. Eso me hace sentir muy afortunado.',
 'Gracias por tu apoyo, de verdad. Significa muchísimo para mí y muchas veces es lo que me da fuerzas para seguir.',
 'Sé que no soy perfecto ni tengo la mejor actitud del mundo, pero lo estoy haciendo por ti y quiero mejorar cada día.',
 'En estos 7 meses me has enseñado muchas cosas: a escuchar mejor, a tener paciencia y a cuidar lo que quiero.',
 'También hemos pasado momentos difíciles juntos, y los valoro mucho, porque me demostraron que somos un equipo.',
 'Estoy muy agradecido por todo lo que hemos vivido. Te quiero mucho, mi Odette :3',
 'Y quiero que sepas que valoro cada momento, cada carta y cada detalle que tienes conmigo, porque sé que lo haces de corazón y eso me pone muy, muy feliz. Gracias por quererme así, mi Odette ♥'];
const PIES=['Un besito, de esos que paran el tiempo ♥','El dibujito que me hizo mi bebé: lo valoro muchísimo ♥','Tú y yo frente al espejo','Juntitos, como siempre :3','Un paseo en el parque contigo','Nosotros bajo las nubes ✦','Hoy y siempre','Mis pibbles favoritos'];
function jardin(c){
  c.innerHTML='<p class="g7-ayuda">Cada semillita guarda una notita con una foto. Se abren de a una y florecen ♥</p><div class="g7-stats">FLORES <b id="j-n">0/8</b></div><div class="jd-vid"><i id="j-bar"></i></div><div class="jd-bed" id="j-bed"></div><p class="jd-hint" id="j-hint">Toca la semillita que brilla 🌱</p><div class="jd-notes" id="j-notes"></div>';
  const bed=$('#j-bed',c), lista=$('#j-notes',c), hint=$('#j-hint',c); let sig=0;
  const flores=['🌷','🌼','🌸','🌻','🌹','🪻','💐','🌺'];
  const opened=[]; FOTOS.forEach(f=>{ const im=new Image(); im.src=IMG+f; });
  const pots=[], cards=[];
  const ref=()=>{
    pots.forEach((b,i)=>{
      b.className='jd-pot '+(i<sig?'open':i===sig?'next':'lock');
      const em=$('.jd-em',b);
      if(i<sig){ em.textContent=flores[i]; b.setAttribute('aria-label','Ver notita '+(i+1)); b.style.setProperty('--ph','url("'+IMG+FOTOS[i]+'")'); }
      else { em.textContent=i===sig?'🌱':'🌰'; b.setAttribute('aria-label',i===sig?'Abrir notita '+(i+1):'Bloqueada'); }
    });
    $('#j-bar',c).style.width=(sig/8*100)+'%';
  };
  /* visor de foto a pantalla completa */
  function visor(i){
    document.querySelectorAll('.jd-lb').forEach(x=>x.remove());
    let k=i;
    const lb=el('div','jd-lb','<div class="jd-lb-bg"></div><button class="jd-lb-x" type="button" aria-label="Cerrar">✕</button><button class="jd-lb-n prev" type="button" aria-label="Anterior">‹</button><button class="jd-lb-n next" type="button" aria-label="Siguiente">›</button><figure><img alt=""><figcaption></figcaption></figure><span class="jd-lb-c"></span>');
    const im=$('img',lb), cap=$('figcaption',lb), cnt=$('.jd-lb-c',lb);
    const pintar=()=>{ im.classList.remove('in'); void im.offsetWidth; im.src=IMG+FOTOS[k]; im.classList.add('in'); cap.textContent=PIES[k]; cnt.textContent=(k+1)+' / '+sig; $('.prev',lb).style.visibility=k>0?'visible':'hidden'; $('.next',lb).style.visibility=k<sig-1?'visible':'hidden'; };
    const ir=d=>{ const n=k+d; if(n<0||n>=sig) return; k=n; tono(NOTAS[k%7],.2,'triangle'); pintar(); };
    const cerrarV=()=>{ lb.classList.remove('on'); document.removeEventListener('keydown',tecla,true); setTimeout(()=>lb.remove(),250); };
    const tecla=e=>{ if(e.key==='Escape'){ e.stopPropagation(); cerrarV(); } else if(e.key==='ArrowLeft') ir(-1); else if(e.key==='ArrowRight') ir(1); };
    document.addEventListener('keydown',tecla,true);
    $('.jd-lb-x',lb).onclick=cerrarV; $('.jd-lb-bg',lb).onclick=cerrarV; $('.prev',lb).onclick=()=>ir(-1); $('.next',lb).onclick=()=>ir(1);
    let x0=null; lb.addEventListener('pointerdown',e=>{ x0=e.clientX; }); lb.addEventListener('pointerup',e=>{ if(x0==null) return; const d=e.clientX-x0; x0=null; if(Math.abs(d)>50) ir(d<0?1:-1); });
    document.body.appendChild(lb); pintar(); requestAnimationFrame(()=>lb.classList.add('on'));
  }
  MENSAJES.forEach((m,i)=>{
    const b=el('button','jd-pot lock','<span class="jd-ph"></span><span class="jd-em">🌰</span><span class="jd-n">'+(i+1)+'</span>'); b.type='button';
    b.onclick=async()=>{
      if(i<sig){ tono(NOTAS[i%7],.2,'triangle'); const cd=cards[i]; if(cd) cd.scrollIntoView({behavior:'smooth',block:'center'}); return; }
      if(i!==sig){ b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); tono(160,.2,'square',.04); return; }
      const r=b.getBoundingClientRect(); chispas(r.left+r.width/2,r.top+r.height/2,12); tono(NOTAS[i%7],.5,'triangle'); brillito();
      const idx=i;
      const k=el('article','jd-card',`<span class="jd-tape"></span><small>${flores[i]} NOTITA ${i+1}</small><button class="jd-foto${i===7?' pib':''}" type="button" aria-label="Ver foto grande"><i class="jd-bg" style="background-image:url(${IMG}${FOTOS[i]})"></i><img src="${IMG}${FOTOS[i]}" alt="${PIES[i]}"><em>toca para ampliar</em></button><p class="jd-pie">${PIES[i]}</p><div class="jd-txt"></div>`);
      $('.jd-foto',k).onclick=()=>{ tono(660,.15,'triangle'); visor(idx); };
      cards[i]=k; lista.prepend(k);
      sig++; $('#j-n',c).textContent=sig+'/8'; ref(); hint.textContent=sig<8?'Sigue con la próxima semillita 🌱':'¡Todas florecieron! ♥';
      setTimeout(()=>k.scrollIntoView({behavior:'smooth',block:'center'}),120);
      if(sig===8) setTimeout(()=>fin(c,'♥ JARDÍN COMPLETO ♥','Abriste todas. Cada flor es una razón por la que te quiero tanto. Felices 7 meses, mi Odette :3 mua','jardin',reiniciar(jardin)),Math.min(m.length*22,2600)+700);
      await escribir($('.jd-txt',k),m,22);
    };
    pots.push(b); bed.appendChild(b);
  });
  ref();
}

/* ---------- 5. ALIMENTA A LOS PIBBLES ---------- */
function alimentar(c){
  const cosas=[['🦴','¡Ñam!'],['🥕','¡Crunch!'],['🍎','¡Qué rico!'],['🍖','¡Mmm!'],['🎾','¡A jugar!'],['🧸','¡Mi peluche!']];
  c.innerHTML='<p class="g7-ayuda">Arrastra cada cosita hasta los pibbles (o tócala y luego toca a los pibbles).</p><div class="g7-stats">CONSENTIDOS <b id="a-n">0/6</b></div><div class="al-medidor"><i id="a-bar"></i></div>';
  const esc=el('div','al-esc','<div class="al-burbuja"></div><div class="al-ventana"></div><div class="al-cuadro">♥</div><div class="al-piso"></div><div class="al-sombra"></div>'); const img=el('img'); img.src=IMG+'pibbles.png'; img.alt='Los pibbles'; esc.appendChild(img); c.appendChild(esc);
  const band=el('div','bandeja'); c.appendChild(band);
  let sel=null,n=0; const bur=$('.al-burbuja',esc);
  function dar(b,txt){
    b.classList.add('usada'); b.classList.remove('sel'); sel=null; n++; $('#a-n',c).textContent=n+'/6'; $('#a-bar',c).style.width=(n/6*100)+'%';
    bur.textContent=txt; bur.classList.add('on'); setTimeout(()=>bur.classList.remove('on'),900); tono(300+n*80,.25,'square',.04);
    img.classList.remove('feliz'); void img.offsetWidth; img.classList.add('feliz');
    for(let i=0;i<3;i++){ const s=el('span','sube','♥'); s.style.left=(30+Math.random()*40)+'%'; s.style.top='50%'; s.style.animationDelay=i*.12+'s'; esc.appendChild(s); setTimeout(()=>s.remove(),1300); }
    chispasEl(esc);
    if(n===6) setTimeout(()=>fin(c,'♥ ¡QUEDARON FELICES! ♥','Los pibbles están llenitos y muy contentos. Así como yo cuando estoy contigo: lleno de cariño :3','alimentar',reiniciar(alimentar)),700);
  }
  cosas.forEach(([e,t])=>{
    const b=el('button','cosa',e); band.appendChild(b);
    let drag=null,x0=0,y0=0,mov=false;
    b.addEventListener('pointerdown',ev=>{ if(b.classList.contains('usada'))return; x0=ev.clientX;y0=ev.clientY;mov=false; b.setPointerCapture(ev.pointerId);
      drag=el('div','fantasma',e); drag.style.display='none'; document.body.appendChild(drag); });
    b.addEventListener('pointermove',ev=>{ if(!drag)return;
      if(Math.abs(ev.clientX-x0)+Math.abs(ev.clientY-y0)>8){ mov=true; drag.style.display='block'; }
      drag.style.left=ev.clientX+'px'; drag.style.top=ev.clientY+'px';
      const r=esc.getBoundingClientRect(); esc.classList.toggle('diana',mov&&ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom); });
    const soltar=ev=>{ if(!drag)return; drag.remove(); drag=null; esc.classList.remove('diana');
      if(mov){ const r=esc.getBoundingClientRect(); if(ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom) dar(b,t); }
      else { band.querySelectorAll('.cosa').forEach(x=>x.classList.remove('sel')); sel=b; b.classList.add('sel'); } };
    b.addEventListener('pointerup',soltar);
    b.addEventListener('pointercancel',()=>{ if(drag){drag.remove();drag=null;} });
    b._dar=()=>dar(b,t);
  });
  esc.addEventListener('click',()=>{ if(sel&&!sel.classList.contains('usada')) sel._dar(); });
}

/* ---------- 6. SOBRES SORPRESA ---------- */
function sobres(c){
  const datos=[['nota1.jpg','Un besito ♥','Un besito tuyo y el mundo se detiene un segundito. Contigo hasta el silencio se siente bonito, mi amor.'],
    ['nota2.jpg','Tu dibujito ♥','El dibujito que me hizo mi bebé. Lo valoro muchísimo: cada trazo lleva tu cariño y lo guardo como un tesoro. Gracias por hacerlo con tanto amor.'],
    ['nota3.jpg','Juntitos :3','Esta foto me recuerda lo bien que se siente tenerte cerca. Contigo todo es calma, todo es hogar, y mis días tienen otro color desde que llegaste.'],
    ['nota4.jpg','Esa sonrisa','Tu sonrisa es mi parte favorita de cualquier día, aunque haya sido un día difícil. Si pudiera, la guardaría en un frasquito para abrirlo cuando te extraño.'],
    ['nota5.jpg','Nosotros','Aquí estamos, tal cual somos: sin perfección, pero con mucho cariño y ganas de seguir. Así te quiero: real, hermosa y mía :3']];
  c.innerHTML='<p class="g7-ayuda">Abre los sobres en orden, voltea cada foto y lee lo que guarda. Al final hay uno muy especial ♥</p><div class="g7-stats">SOBRES <b id="s-n">0/5</b> CORAZONES <b id="s-h">0</b></div><div class="sobres"></div><div class="sv"></div>';
  const g=$('.sobres',c), sv=$('.sv',c); let sig=0, lec=0, cor=0;
  const btns=datos.map((d,i)=>{ const b=el('button','sob',i+1); g.appendChild(b); return b; });
  const fb=el('button','sob fin7','SOBRE DE LOS 7 MESES'); g.appendChild(fb);
  const ref=()=>{ btns.forEach((b,i)=>b.className='sob'+(i>sig?' bloq':i===sig?' sig':' abierto')); fb.className='sob fin7'+(sig<5?' bloq':' sig'); };
  function tarjeta(img,tit,etq,txt,pib,cb){
    const mi=++lec;
    sv.innerHTML=`<div class="tl-card sob-card entra"><div class="tl-flip"><div class="tl-cara tl-fr"><img class="${pib?'pib':''}" src="${IMG}${img}" alt=""><span class="tl-mes">${tit}</span><small class="tl-hint">toca para voltear ↻</small></div><div class="tl-cara tl-bk"><h4>${etq}</h4><p></p><button class="tl-cor" aria-label="enviar corazón">♥</button></div></div></div>`;
    const flip=$('.tl-flip',sv), card=$('.tl-card',sv), p=$('.tl-bk p',sv); let esc=false;
    sv.scrollIntoView({behavior:'smooth',block:'nearest'});
    card.addEventListener('pointermove',e=>{ if(e.pointerType==='touch'||flip.classList.contains('v')) return; const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; flip.style.transform=`rotateY(${x*14}deg) rotateX(${-y*10}deg)`; });
    card.addEventListener('pointerleave',()=>{ if(!flip.classList.contains('v')) flip.style.transform=''; });
    flip.addEventListener('click',async e=>{
      if(e.target.closest('.tl-cor')) return;
      const v=flip.classList.toggle('v'); flip.style.transform=''; tono(v?700:500,.2,'triangle');
      if(v&&!esc){ esc=true; await escribir(p,txt,22,()=>mi!==lec); if(mi===lec&&cb) cb(); }
    });
    $('.tl-cor',sv).onclick=e=>{ cor++; $('#s-h',c).textContent=cor; chispas(e.clientX,e.clientY,7); tono(NOTAS[cor%7]*1.2,.15,'triangle'); };
  }
  btns.forEach((b,i)=>b.onclick=()=>{
    if(i!==sig){ if(i>sig){ b.classList.remove('tiembla'); void b.offsetWidth; b.classList.add('tiembla'); tono(160,.2,'square',.04); } return; }
    chispasEl(b); sig++; $('#s-n',c).textContent=sig+'/5'; ref();
    tarjeta(datos[i][0],datos[i][1],'SOBRE '+(i+1)+' · '+datos[i][1],datos[i][2],false);
  });
  fb.onclick=()=>{ if(sig<5||fb.dataset.f) return; fb.dataset.f=1; chispasEl(fb);
    const m='Felices 7 meses, mi Odette. Gracias por cada risa, por cada abrazo y por quedarte en los días difíciles. Todo lo que hemos vivido juntos es lo más bonito que tengo, y quiero seguir sumando recuerdos contigo todos los días de mi vida :3 mua';
    tarjeta('nota6.jpg','Felices 7 meses ♥','SOBRE ESPECIAL · 7 MESES',m,false,()=>setTimeout(()=>fin(c,'♥ LOS ABRISTE TODOS ♥','Ya viste todas las sorpresas. Pero la mejor sorpresa eres tú.','sobres',reiniciar(sobres)),500)); };
  ref();
}

/* ---------- 7. UN DETALLE PARA DESBLOQUEAR (secuencia) ---------- */
function detalle(c){
  const t=++token;
  c.innerHTML='<p class="g7-ayuda">Mira la secuencia y repítela. Pasa 5 rondas para desbloquear un detalle ♥</p><div class="g7-stats">RONDA <b id="d-r">0/5</b></div><div class="pips"><i></i><i></i><i></i><i></i><i></i></div><div class="sim"></div><div class="g7-ayuda" id="d-msg">Toca EMPEZAR</div><button class="btn-pixel" id="d-go" style="font-size:10px">EMPEZAR</button>';
  const defs=[['♥','#e0709c'],['★','#e0b84a'],['◆','#6fbf6a'],['✿','#6aa8e0']];
  const g=$('.sim',c), msg=$('#d-msg',c), go=$('#d-go',c);
  const bs=defs.map(([s,col])=>{ const b=el('button',null,s); b.style.background=col; b.disabled=true; g.appendChild(b); return b; });
  const fr=[523,659,784,988];
  const luz=async(i)=>{ bs[i].classList.add('on'); tono(fr[i],.3,'triangle'); await esperar(380); bs[i].classList.remove('on'); await esperar(150); };
  let sec=[],pos=0,turno=false;
  async function ronda(){
    turno=false; msg.textContent='Mira bien...'; bs.forEach(b=>b.disabled=true);
    sec.push(Math.floor(Math.random()*4)); $('#d-r',c).textContent=sec.length+'/5'; [...$('.pips',c).children].forEach((p,k)=>p.classList.toggle('on',k<sec.length-1)); await esperar(600);
    for(const i of sec){ if(t!==token)return; await luz(i); }
    pos=0; turno=true; msg.textContent='¡Tu turno!'; bs.forEach(b=>b.disabled=false);
  }
  bs.forEach((b,i)=>b.onclick=async()=>{
    if(!turno) return; b.classList.add('on'); tono(fr[i],.25,'triangle'); setTimeout(()=>b.classList.remove('on'),200);
    if(sec[pos]!==i){ turno=false; msg.textContent='Ups, otra vez :3'; tono(180,.4,'sawtooth',.04); bs.forEach(x=>x.disabled=true); sec=[]; await esperar(900); if(t===token) ronda(); return; }
    pos++;
    if(pos===sec.length){
      turno=false; bs.forEach(x=>x.disabled=true); chispasEl(g);
      if(sec.length===5){ [...$('.pips',c).children].forEach(p=>p.classList.add('on')); msg.textContent=''; go.remove(); fin(c,'♥ DETALLE DESBLOQUEADO ♥','Lo lograste :3 Gracias por estos 7 meses, por tu paciencia conmigo y por todo lo que hemos vivido. Te quiero mucho, mi Odette. mua','detalle',reiniciar(detalle)); }
      else { msg.textContent='¡Bien!'; await esperar(700); if(t===token) ronda(); }
    }
  });
  go.onclick=()=>{ go.style.display='none'; sec=[]; ronda(); };
}

/* ---------- 8. ATRAPA LOS CORAZONES (nuevo) ---------- */
function atrapa(c){
  const t=++token, META=15;
  c.innerHTML=`<p class="g7-ayuda">Mueve a los pibbles (dedo, mouse o flechas) y atrapa ${META} corazones ♥</p><div class="g7-stats">ATRAPADOS <b id="at-n">0/${META}</b></div><div class="at-wrap"><canvas id="at" width="320" height="420"></canvas><div class="at-msg" id="at-msg"></div></div>`;
  const cv=$('#at',c), x=cv.getContext('2d'), msg=$('#at-msg',c), pib=new Image(); pib.src=IMG+'pibbles.png';
  const dichos=['Contigo todo es más bonito','Gracias por tu paciencia','Eres mi persona favorita','Me haces muy feliz','Cada día te quiero más'];
  let px=160,n=0,hs=[],ult=0,sp=0,fin_=false,izq=false,der=false,pop=[],parts=[];
  const mover=e=>{ const r=cv.getBoundingClientRect(); px=Math.max(46,Math.min(274,(e.clientX-r.left)*320/r.width)); };
  cv.addEventListener('pointermove',mover); cv.addEventListener('pointerdown',mover);
  const kd=e=>{ if(e.key==='ArrowLeft')izq=true; if(e.key==='ArrowRight')der=true; }, ku=e=>{ if(e.key==='ArrowLeft')izq=false; if(e.key==='ArrowRight')der=false; };
  document.addEventListener('keydown',kd); document.addEventListener('keyup',ku);
  const estrellas=[...Array(26)].map(()=>[Math.random()*320,Math.random()*420,Math.random()*1.6+.4]);
  function bucle(ts){
    if(t!==token||!document.body.contains(cv)){ document.removeEventListener('keydown',kd); document.removeEventListener('keyup',ku); return; }
    const dt=Math.min(.05,(ts-ult)/1000||0); ult=ts;
    if(izq) px=Math.max(46,px-300*dt); if(der) px=Math.min(274,px+300*dt);
    if(!fin_){ sp-=dt; if(sp<=0){ sp=.55+Math.random()*.35; const oro=Math.random()<.18; hs.push({x:24+Math.random()*272,y:-20,v:95+Math.random()*70,s:oro?24:20+Math.random()*12,k:oro?'★':'♥',c:oro?'#ffd05a':['#ff7fa8','#ff5f90','#ffb3cb'][Math.floor(Math.random()*3)]}); } }
    const g=x.createLinearGradient(0,0,0,420); g.addColorStop(0,'#150a38'); g.addColorStop(.55,'#4a1f5c'); g.addColorStop(1,'#8a3a62'); x.fillStyle=g; x.fillRect(0,0,320,420);
    const lg=x.createRadialGradient(252,78,4,252,78,64); lg.addColorStop(0,'rgba(255,243,176,.9)'); lg.addColorStop(.25,'rgba(255,243,176,.28)'); lg.addColorStop(1,'rgba(255,243,176,0)'); x.fillStyle=lg; x.fillRect(176,6,144,144);
    x.fillStyle='#fff6c8'; x.beginPath(); x.arc(252,78,17,0,6.283); x.fill();
    x.fillStyle='rgba(214,176,110,.55)'; [[246,72,4],[259,85,3],[257,70,2.2]].forEach(([a,b,r])=>{ x.beginPath(); x.arc(a,b,r,0,6.283); x.fill(); });
    x.fillStyle='#fff3b0'; estrellas.forEach(([a,b,r],i)=>{ x.globalAlpha=.4+.5*Math.abs(Math.sin(ts/700+i)); x.fillRect(a,b,r,r); }); x.globalAlpha=1;
    x.fillStyle='#2f1450'; x.beginPath(); x.moveTo(0,420); for(let k=0;k<=320;k+=8) x.lineTo(k,352+Math.sin(k/38)*14+Math.sin(k/13)*3); x.lineTo(320,420); x.closePath(); x.fill();
    x.fillStyle='#1c0b30'; x.beginPath(); x.moveTo(0,420); for(let k=0;k<=320;k+=8) x.lineTo(k,384+Math.sin(k/27+1)*9); x.lineTo(320,420); x.closePath(); x.fill();
    x.fillStyle='rgba(255,179,203,.55)'; for(let k=0;k<16;k++){ const yy=(ts/16+k*53)%440-10, xx=(k*67+Math.sin(ts/900+k)*20)%320; x.beginPath(); x.ellipse(xx,yy,3.2,1.7,ts/500+k,0,6.283); x.fill(); }
    x.textAlign='center'; x.textBaseline='middle';
    hs=hs.filter(h=>{
      h.y+=h.v*dt;
      x.save(); x.shadowColor=h.c; x.shadowBlur=14; x.font=h.s+'px sans-serif'; x.fillStyle=h.c; x.globalAlpha=.22; x.fillText(h.k,h.x,h.y-13); x.globalAlpha=1; x.fillText(h.k,h.x,h.y); x.restore();
      if(!fin_&&h.y>330&&h.y<390&&Math.abs(h.x-px)<54){
        n++; $('#at-n',c).textContent=n+'/'+META; pop.push({x:h.x,y:h.y,t:0}); tono(NOTAS[n%7],.2,'triangle');
        for(let k=0;k<9;k++){ const a=k/9*6.283; parts.push({x:h.x,y:h.y,vx:Math.cos(a)*(50+Math.random()*60),vy:Math.sin(a)*(50+Math.random()*60)-30,t:0,c:h.c}); }
        if(n%3===0&&n<META){ msg.classList.remove('on'); void msg.offsetWidth; msg.textContent='♥ '+dichos[(n/3-1)|0]+' ♥'; msg.classList.add('on'); }
        if(n>=META){ fin_=true; hs=[]; chispasEl(cv); setTimeout(()=>fin(c,'♥ ¡ATRAPASTE MI CORAZÓN! ♥','Y eso que no hacía falta: ya era tuyo desde hace 7 meses. Te quiero muchísimo, mi Odette :3','atrapa',reiniciar(atrapa)),500); }
        return false; }
      return h.y<450;
    });
    parts=parts.filter(q=>{ q.t+=dt; q.x+=q.vx*dt; q.y+=q.vy*dt; q.vy+=160*dt; x.globalAlpha=Math.max(0,1-q.t*2.4); x.fillStyle=q.c; x.fillRect(q.x-2,q.y-2,4,4); x.globalAlpha=1; return q.t<.42; });
    pop=pop.filter(p=>{ p.t+=dt; x.globalAlpha=Math.max(0,1-p.t*2.2); x.font='bold 16px sans-serif'; x.fillStyle='#fff'; x.fillText('+1',p.x,p.y-p.t*50); x.globalAlpha=1; return p.t<.45; });
    const bob=Math.sin(ts/260)*1.6;
    const pg=x.createRadialGradient(px,392,4,px,392,66); pg.addColorStop(0,'rgba(255,127,168,.42)'); pg.addColorStop(1,'rgba(255,127,168,0)'); x.fillStyle=pg; x.fillRect(px-70,330,140,90);
    x.fillStyle='rgba(0,0,0,.32)'; x.beginPath(); x.ellipse(px,414,44,6,0,0,6.283); x.fill();
    if(pib.complete&&pib.naturalWidth){ x.drawImage(pib,px-52,420-84+bob,104,78); }
    x.fillStyle='rgba(0,0,0,.4)'; x.fillRect(10,8,300,9); x.fillStyle='#ff7fa8'; x.fillRect(12,10,296*Math.min(1,n/META),5); x.fillStyle='#ffd05a'; x.fillRect(12,10,296*Math.min(1,n/META),2);
    requestAnimationFrame(bucle);
  }
  requestAnimationFrame(bucle);
}

/* ---------- 9. CONSTELACIÓN (nuevo) ---------- */
function constelacion(c){
  c.innerHTML='<p class="g7-ayuda">Une las estrellas en orden, del 1 al 8, y dibuja lo que siento por ti ✦</p><div class="g7-stats">ESTRELLAS <b id="k-n">0/8</b></div><div class="cons"><svg viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div><div class="cons-msg" id="k-msg">&nbsp;</div>';
  const P=[[50,34],[30,16],[14,42],[30,68],[50,88],[70,68],[86,42],[70,16]];
  const box=$('.cons',c), svg=$('svg',box), msg=$('#k-msg',c); let sig=0,listo=false;
  const NS='http://www.w3.org/2000/svg';
  const marcar=()=>box.querySelectorAll('.kst').forEach((k,j)=>k.classList.toggle('sig',j===sig));
  for(let k=0;k<3;k++){ const f=el('i','fugaz'); f.style.cssText=`top:${8+k*22}%;animation-delay:${k*3.3}s`; box.appendChild(f); }
  P.forEach(([px,py],i)=>{
    const b=el('button','kst',i+1); b.style.left=px+'%'; b.style.top=py+'%'; b.setAttribute('aria-label','estrella '+(i+1));
    b.onclick=()=>{
      if(listo) return;
      if(i!==sig){ b.classList.remove('mal'); void b.offsetWidth; b.classList.add('mal'); tono(190,.25,'sawtooth',.04); msg.textContent='Esa todavía no… busca la '+(sig+1)+' ✦'; return; }
      b.classList.add('ok'); tono(NOTAS[i%7],.45,'triangle'); chispasEl(b);
      if(sig>0){ const l=document.createElementNS(NS,'line'); const [a,bb]=P[sig-1]; l.setAttribute('x1',a); l.setAttribute('y1',bb); l.setAttribute('x2',px); l.setAttribute('y2',py); svg.appendChild(l); }
      sig++; $('#k-n',c).textContent=sig+'/8'; msg.textContent=sig<8?'Muy bien, sigue ✦':''; marcar();
      if(sig===8){ listo=true; const l=document.createElementNS(NS,'line'); l.setAttribute('x1',px); l.setAttribute('y1',py); l.setAttribute('x2',P[0][0]); l.setAttribute('y2',P[0][1]); svg.appendChild(l);
        const pg=document.createElementNS(NS,'polygon'); pg.setAttribute('points',P.map(q=>q.join(',')).join(' ')); pg.setAttribute('class','relleno'); svg.insertBefore(pg,svg.firstChild);
        box.classList.add('lleno'); setTimeout(()=>fin(c,'♥ TE DIBUJÉ EN EL CIELO ♥','Si pudiera, pondría una estrella por cada día contigo. Hoy el cielo tiene un corazón con tu nombre, mi Odette :3','constelacion',reiniciar(constelacion)),1100); }
    };
    box.appendChild(b);
  });
  marcar();
  for(let i=0;i<30;i++){ const s=el('i','kfondo','·'); s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${-Math.random()*3}s`; box.appendChild(s); }
}

/* ---------- 10. LÍNEA DEL TIEMPO (interactiva) ---------- */
const MESES=[
 ['mes1.jpg','MES 1','El comienzo','Todo era nuevo y, aun así, contigo se sentía como si ya te conociera de antes. Ahí empezó lo más bonito que me ha pasado, mi amor.'],
 ['mes2.jpg','MES 2','Nuestro dibujito','Mira qué dibujito tan lindo de nosotros, abrazados entre notas y estrellas. Cada trazo guarda lo que siento por ti, y lo conservo como un tesoro, mi bebé.'],
 ['mes3.jpg','MES 3','Confianza','Empezamos a contarnos todo sin miedo. Gracias por confiar en mí; no lo doy por sentado ni un solo día.'],
 ['mes4.jpg','MES 4','Aprender a querernos','Aprendimos a querernos también en los días torpes, cuando no salía todo bien. Y aun así seguíamos aquí, juntos.'],
 ['mes5.jpg','MES 5','Lo difícil','Llegaron momentos difíciles y no soltamos la mano del otro. Ahí entendí lo fuerte que es lo nuestro.'],
 ['mes6.jpg','MES 6','Nuestro laberinto','Seis meses de recuerdos, de crecer y de elegirnos. Por eso te hice un laberinto donde volver a encontrarnos.'],
 ['c5.jpg','MES 7','Hoy y siempre','Y hoy, siete meses después, te agradezco todo y te prometo seguir esforzándome por ti. Quiero muchos meses más contigo, mi Odette… y tengo una pregunta que hacerte ♥']];

/* ---------- LA PREGUNTA (mes 7) ---------- */
function propuesta(cb){
  document.querySelectorAll('.g7-prop').forEach(x=>x.remove());
  const a=el('div','g7-aviso g7-prop',`<div class="prop-in"><div class="prop-lluvia" aria-hidden="true"></div><div class="prop-halo" aria-hidden="true"></div>
    <div class="prop-anillo">💍</div><small class="prop-sub">MES 7 · LA PREGUNTA</small><h3 class="prop-tit">Mi Odette…</h3><p class="prop-txt"></p>
    <div class="prop-btns"><button class="btn-pixel prop-si" type="button">SÍ, TE DEJO ♥</button><button class="btn-pixel prop-no" type="button">NO</button></div><p class="prop-pie">&nbsp;</p></div>`);
  document.body.appendChild(a);
  const L=$('.prop-lluvia',a); for(let i=0;i<16;i++){ const h=el('i',null,['♥','✦','🌸','💗'][i%4]); h.style.cssText=`left:${i*6.4}%;animation-delay:${-i*.8}s;animation-duration:${6+i%5}s;font-size:${12+i%4*5}px`; L.appendChild(h); }
  const inn=$('.prop-in',a), txt=$('.prop-txt',a), btns=$('.prop-btns',a), si=$('.prop-si',a), no=$('.prop-no',a), pie=$('.prop-pie',a);
  const viva=()=>document.body.contains(a);
  const Q='Siete meses y ya sé que quiero todos los que vienen. Eres mi hogar, mi mejor amiga y mi persona favorita. ¿Me dejas pasar el resto de mis días contigo y casarme contigo?';
  acorde();
  (async()=>{ await esperar(500); await escribir(txt,Q,34,()=>!viva()); if(viva()){ btns.classList.add('on'); tono(880,.3,'triangle'); } })();
  const quejas=['¿Segura? :(','Piénsalo bien, mi amor…','Ese botón está roto ✦','No te dejes engañar :3','Los pibbles dicen que SÍ','Casi, pero no ♥'];
  let esq=0;
  const huir=e=>{ if(!btns.classList.contains('on')) return; if(e&&e.preventDefault) e.preventDefault(); esq++;
    const mx=Math.max(24,Math.min(70,inn.clientWidth/2-130));
    no.style.transform=`translate(${(Math.random()*2-1)*mx}px,${(Math.random()*2-1)*34}px) rotate(${(Math.random()*2-1)*14}deg) scale(${Math.max(.45,1-esq*.09)})`;
    si.style.scale=Math.min(1.45,1+esq*.07);
    pie.textContent=esq>=7?'Ya no hay NO. Solo SÍ ♥':quejas[(esq-1)%quejas.length]; tono(200+esq*30,.18,'square',.04);
    if(esq>=7) no.style.display='none'; };
  ['pointerenter','click'].forEach(ev=>no.addEventListener(ev,huir)); no.addEventListener('touchstart',huir,{passive:false});
  si.onclick=async()=>{
    si.onclick=null; btns.remove(); pie.remove(); inn.classList.add('si');
    $('.prop-sub',a).textContent='♥ ELLA DIJO QUE SÍ ♥'; $('.prop-tit',a).textContent='¡SÍ!';
    acorde(); confeti(); let k=0;
    const run=setInterval(()=>{ if(!viva()||++k>12){ clearInterval(run); return; } fuego(innerWidth*(.12+Math.random()*.76),innerHeight*(.1+Math.random()*.5),26); tono(NOTAS[k%7]*1.5,.25,'triangle',.05); },420);
    const R='Prometo cuidarte, escucharte y elegirte cada mañana. Prometo reírme contigo en los días buenos y quedarme en los difíciles. Hoy te lo pido y te lo prometo: quiero pasar el resto de mis días contigo y, un día, casarme contigo. Eres mi para siempre ♥';
    await escribir(txt,R,28,()=>!viva()); if(!viva()) return;
    const cert=el('div','prop-cert','<span>💍</span><b>Alejito &amp; Odette</b><small>7 meses ♥ y para siempre</small>'); inn.appendChild(cert);
    const ok=el('button','btn-pixel prop-ok','GUARDAR ESTE MOMENTO'); ok.onclick=()=>{ a.remove(); if(cb) cb(); }; inn.appendChild(ok);
    chispas(innerWidth/2,innerHeight/2,30); acorde();
  };
}
function tiempo(c){
  const t=++token;
  c.innerHTML=`<p class="g7-ayuda">Recorre nuestros 7 meses. Toca cada mes, voltea la foto y deja tus corazoncitos ♥</p><div class="g7-stats">MESES <b id="t-n">0/7</b> CORAZONES <b id="t-h">0</b></div>
  <div class="tl"><div class="tl-riel"><i class="tl-prog"></i></div><img class="tl-pib" src="${IMG}pibbles.png" alt=""></div>
  <div class="tl-vis"></div><div class="tl-nav"><button class="btn-pixel" id="t-ant">◀</button><span id="t-pos"></span><button class="btn-pixel" id="t-sig">▶</button></div>`;
  const tl=$('.tl',c), vis=$('.tl-vis',c), pib=$('.tl-pib',c), prog=$('.tl-prog',c);
  let sig=0, act=-1, cor=0, lec=0;
  const nodos=MESES.map((m,i)=>{ const b=el('button','tn',`<span>${i+1}</span>`); b.style.left=(6+i*88/6)+'%'; b.setAttribute('aria-label','mes '+(i+1)); tl.appendChild(b); return b; });
  const ref=()=>{ nodos.forEach((b,i)=>b.className='tn'+(i<sig?' ok':i===sig?' sig':' bloq')+(i===act?' act':''));
    const p=act<0?0:act; pib.style.left=(6+p*88/6)+'%'; prog.style.width=(Math.max(0,sig-1)*88/6+(sig>0?0:0))+'%'; $('#t-pos',c).textContent=act<0?'—':(act+1)+' / 7'; };
  async function ver(i){
    if(i<0||i>=MESES.length||i>sig) { if(i>sig) { nodos[i].classList.remove('tiembla'); void nodos[i].offsetWidth; nodos[i].classList.add('tiembla'); tono(160,.2,'square',.04); } return; }
    const mi=++lec; act=i; const nuevo=i===sig; if(nuevo){ sig++; $('#t-n',c).textContent=sig+'/7'; chispasEl(nodos[i]); } else tono(NOTAS[i],.25,'triangle'); ref();
    const [f,mes,tit,txt]=MESES[i];
    vis.innerHTML=`<div class="tl-card"><div class="tl-flip"><div class="tl-cara tl-fr"><img src="${IMG}${f}" alt=""><span class="tl-mes">${mes}</span><small class="tl-hint">toca para voltear ↻</small></div><div class="tl-cara tl-bk"><h4>${mes} · ${tit}</h4><p></p><button class="tl-cor" aria-label="enviar corazón">♥</button>${i===6?'<button class="tl-anillo" aria-label="abrir la pregunta">💍</button>':''}</div></div></div>`;
    const card=$('.tl-card',vis), flip=$('.tl-flip',vis), p=$('.tl-bk p',vis);
    card.classList.add('entra'); vis.scrollIntoView({behavior:'smooth',block:'nearest'});
    card.addEventListener('pointermove',e=>{ if(e.pointerType==='touch'||flip.classList.contains('v')) return; const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; flip.style.transform=`rotateY(${x*14}deg) rotateX(${-y*10}deg)`; });
    card.addEventListener('pointerleave',()=>{ if(!flip.classList.contains('v')) flip.style.transform=''; });
    let esc=false;
    flip.addEventListener('click',async e=>{
      if(e.target.closest('.tl-cor,.tl-anillo')) return;
      const v=flip.classList.toggle('v'); flip.style.transform=''; tono(v?700:500,.2,'triangle');
      if(v&&!esc){ esc=true; await escribir(p,txt,22,()=>mi!==lec); if(mi===lec) finalizar(i); }
    });
    const an=$('.tl-anillo',vis); if(an) an.onclick=e=>{ e.stopPropagation(); propuesta(alSi); };
    $('.tl-cor',vis).onclick=e=>{ cor++; $('#t-h',c).textContent=cor; chispas(e.clientX,e.clientY,7); tono(NOTAS[cor%7]*1.2,.15,'triangle'); };
  }
  const vistos={}; let acepto=!!hecho.propuesta, cerrado=false;
  function revisar(){ if(!cerrado&&acepto&&Object.keys(vistos).length===7){ cerrado=true; setTimeout(()=>{ if(t===token) fin(c,'♥ 7 MESES Y UN PARA SIEMPRE ♥','Mira todo lo que hemos recorrido, y lo mejor es que apenas empieza. Gracias por decir que sí, mi Odette. Te amo :3','tiempo',reiniciar(tiempo)); },600); } }
  function alSi(){ acepto=true; hecho.propuesta=1; try{ localStorage.setItem(KEY,JSON.stringify(hecho)); }catch(e){} revisar(); }
  function finalizar(i){ vistos[i]=1; if(i===6) setTimeout(()=>{ if(t===token&&act===6) propuesta(alSi); },900); else if(i===sig-1&&sig<7){ $('#t-sig',c).classList.add('pide'); } revisar(); }
  nodos.forEach((b,i)=>b.onclick=()=>ver(i));
  $('#t-ant',c).onclick=()=>ver(Math.max(0,act-1));
  $('#t-sig',c).onclick=function(){ this.classList.remove('pide'); ver(act+1<MESES.length?act+1:act); };
  let x0=null; vis.addEventListener('pointerdown',e=>{ x0=e.clientX; }); vis.addEventListener('pointerup',e=>{ if(x0!==null&&Math.abs(e.clientX-x0)>60){ ver(act+(e.clientX<x0?1:-1)); } x0=null; });
  const kk=e=>{ if(t!==token){ document.removeEventListener('keydown',kk); return; } if(e.key==='ArrowRight') ver(act+1); if(e.key==='ArrowLeft') ver(act-1); };
  document.addEventListener('keydown',kk);
  ref(); ver(0);
}

/* ---------- 11. LA CARTA (se desbloquea al completar todo) ---------- */
const CARTA_P=[
 'Para mi Odette ♥',
 'Siete meses. Lo escribo y todavía me sorprende lo bonito que se ha sentido todo contigo. Quise hacerte algo con mis propias manos, algo que te sacara una sonrisa, porque tú me regalas sonrisas todos los días sin darte cuenta.',
 'Gracias por tu apoyo incondicional. Gracias por la confianza que has tenido en mí, por contarme tus cosas, tus miedos, tus días buenos y también los malos. Que me elijas para eso es uno de los regalos más grandes que me han dado.',
 'Yo sé que tampoco tengo la mejor actitud del mundo y sé que no soy perfecto. A veces fallo, a veces me equivoco, y aun así tú sigues aquí. Lo estoy haciendo por ti, estoy dispuesto a todo por ti, y quiero ser mejor cada día, no solo porque lo mereces, sino porque quiero merecerte.',
 'Estos 7 meses me has enseñado muchas cosas: a escuchar mejor, a tener paciencia, a cuidar lo que quiero y a entender que amar también es quedarse cuando algo se pone difícil. Hemos pasado momentos duros como pareja y, en vez de separarnos, me hicieron valorarte todavía más.',
 'Estoy muy agradecido por todo lo que hemos vivido: las risas, las fotos, los pibbles, las cosas pequeñas que nadie más ve. Si tuviera que elegir de nuevo, te elegiría en cada uno de estos 7 meses y en todos los que vienen.',
 'Gracias por ser mi Odette. Te quiero muchísimo :3 Felices 7 meses, mi amor.',
 'Siempre tuyo, Alejito ♥'];
function carta(c){
  const listos=JUEGOS.filter(g=>hecho[g.id]).length;
  if(listos<JUEGOS.length){
    c.innerHTML=`<p class="g7-ayuda">La carta está sellada. Para abrirla, completa todos los juegos y sorpresas ♥</p>
    <div class="car-esc bloqueada"><div class="car-cuerpo"><img src="${IMG}pibbles.png" alt="Los pibbles"></div><div class="car-tapa"></div><div class="car-sello">🔒</div></div>
    <div class="g7-stats">FALTAN <b>${JUEGOS.length-listos}</b></div><div class="car-llaves"></div>`;
    const L=$('.car-llaves',c);
    JUEGOS.forEach(g=>{ const b=el('button','llave'+(hecho[g.id]?' ok':''),`<span>${g.ic}</span><small>${hecho[g.id]?'✔':'ir'}</small>`); b.title=g.t; b.onclick=()=>abrir(g); L.appendChild(b); });
    $('.car-esc',c).onclick=function(){ this.classList.remove('tiembla'); void this.offsetWidth; this.classList.add('tiembla'); tono(160,.25,'square',.04); };
    return;
  }
  c.innerHTML=`<p class="g7-ayuda" id="c-ay">Toca el sello para abrir tu carta ♥</p>
  <div class="car-esc"><div class="car-cuerpo"><img src="${IMG}pibbles.png" alt="Los pibbles"></div><div class="car-tapa"></div><button class="car-sello" aria-label="Romper el sello">💌</button></div>
  <div class="car-papel"><div class="car-txt"></div><img class="car-foto" src="${IMG}foto5.jpg" alt="" style="display:none"></div>
  <div class="car-btns" style="display:none"><button class="btn-pixel" id="c-rel">VOLVER A LEERLA</button><button class="btn-pixel" id="c-cer">CERRAR SOBRE</button></div>`;
  const esc=$('.car-esc',c), pap=$('.car-papel',c), txt=$('.car-txt',c), bt=$('.car-btns',c), foto=$('.car-foto',c);
  let corre=0, saltar=false;
  async function leer(){
    const mi=++corre; saltar=false; txt.innerHTML=''; foto.style.display='none';
    const ps=CARTA_P.map((t,i)=>{ const p=el('p',i===0?'ini':i===CARTA_P.length-1?'fir':''); txt.appendChild(p); return p; });
    for(let i=0;i<CARTA_P.length;i++){
      if(mi!==corre||!document.body.contains(pap)) return;
      ps[i].classList.add('cur'); ps[i].scrollIntoView({behavior:'smooth',block:'center'});
      await escribir(ps[i],CARTA_P[i],i===0?55:24,()=>saltar||mi!==corre);
      ps[i].classList.remove('cur'); if(i===3||i===5){ chispas(innerWidth/2,innerHeight/2,12); tono(NOTAS[i],.6,'triangle'); } await esperar(saltar?0:450);
    }
    foto.style.display='block'; foto.classList.add('on'); acorde(); confeti(); bt.style.display='flex'; foto.scrollIntoView({behavior:'smooth',block:'center'}); guardar('carta');
  }
  pap.onclick=()=>{ saltar=true; };
  const abrir_=()=>{ if(esc.classList.contains('abierto'))return; esc.classList.add('abierto'); acorde(); chispasEl(esc); $('#c-ay',c).style.visibility='hidden';
    setTimeout(()=>{ pap.classList.add('on'); pap.scrollIntoView({behavior:'smooth',block:'start'}); leer(); },900); };
  esc.onclick=abrir_;
  $('#c-cer',c).onclick=()=>{ corre++; pap.classList.remove('on'); bt.style.display='none'; esc.classList.remove('abierto'); $('#c-ay',c).style.visibility=''; vista.scrollTop=0; };
  $('#c-rel',c).onclick=()=>{ pap.scrollIntoView({behavior:'smooth',block:'start'}); leer(); };
}

/* ---------- hub ---------- */
const JUEGOS=[
 {id:'memoria',ic:'🃏',t:'ENCUENTRA LAS PAREJAS',d:'Memoria con mensajitos',f:memoria},
 {id:'puzzle',ic:'🧩',t:'ROMPECABEZAS',d:'Arma nuestra foto',f:puzzle},
 {id:'corazones',ic:'💗',t:'CORAZONES ESCONDIDOS',d:'Busca 7 corazones',f:corazones},
 {id:'jardin',ic:'🌷',t:'JARDÍN DE RECUERDOS',d:'Flores con mensajitos',f:jardin},
 {id:'alimentar',ic:'🦴',t:'ALIMENTA A LOS PIBBLES',d:'Arrastra y consiéntelos',f:alimentar},
 {id:'sobres',ic:'✉️',t:'DESCUBRE LA SORPRESA',d:'Sobres con fotos',f:sobres},
 {id:'detalle',ic:'🔓',t:'UN DETALLE PARA DESBLOQUEAR',d:'Repite la secuencia',f:detalle},
 {id:'atrapa',ic:'🎯',t:'ATRAPA LOS CORAZONES',d:'Mueve a los pibbles',f:atrapa},
 {id:'constelacion',ic:'⭐',t:'NUESTRA CONSTELACIÓN',d:'Une las estrellas',f:constelacion},
 {id:'tiempo',ic:'📸',t:'LÍNEA DEL TIEMPO',d:'Mes por mes, juntos',f:tiempo}];
const CARTA={id:'carta',ic:'💌',t:'CARTA DE LOS 7 MESES',d:'',f:carta};
function pintarHub(){
  const h=$('#g7-hub'); h.innerHTML='';
  JUEGOS.forEach(g=>{ const b=el('button','g7-card'+(hecho[g.id]?' ok':''),`<span class="ic">${g.ic}</span><div><h3>${g.t}</h3><p>${g.d}</p></div>`); b.onclick=()=>{ tono(660,.12,'triangle'); abrir(g); }; h.appendChild(b); });
  const n=JUEGOS.filter(g=>hecho[g.id]).length, ok=n===JUEGOS.length;
  const cb=el('button','g7-card carta'+(ok?' lista':' sellada')+(hecho.carta?' ok':''),`<span class="ic">${ok?'💌':'🔒'}</span><div><h3>${ok?'ABRE TU CARTA DE 7 MESES':'CARTA SELLADA'}</h3><p>${ok?'Está lista, solo para ti ♥':'Completa los '+JUEGOS.length+' juegos ('+n+'/'+JUEGOS.length+')'}</p></div>`);
  cb.onclick=()=>{ if(ok){ acorde(); abrir(CARTA); } else { cb.classList.remove('tiembla'); void cb.offsetWidth; cb.classList.add('tiembla'); tono(160,.25,'square',.04); } };
  h.appendChild(cb);
  $('#g7-prog').textContent=`♥ ${n} / ${JUEGOS.length}`; $('#g7-barra i').style.width=(n/JUEGOS.length*100)+'%';
  $('#g7-todo').style.display=ok?'block':'none';
}
function abrir(g){ token++; $('#g7-vtitulo').textContent='7 MESES · '+g.t; cuerpo.innerHTML=''; vista.classList.add('on'); vista.scrollTop=0; g.f(cuerpo); }
function cerrar(){ token++; document.querySelectorAll('.jd-lb').forEach(x=>x.remove()); vista.classList.remove('on'); cuerpo.innerHTML=''; document.querySelectorAll('.g7-aviso').forEach(x=>x.remove()); }
const rst=$('#g7-reset'); if(rst) rst.onclick=()=>{ if(confirm('¿Borrar el progreso de los 7 meses y empezar de nuevo?')){ hecho={}; desbloqueoAvisado=false; try{ localStorage.removeItem(KEY); }catch(e){} pintarHub(); } };
pintarHub();
})();
