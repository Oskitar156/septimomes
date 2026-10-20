(function(){
const hub=document.getElementById('g7-hub');
if(hub){
  hub.addEventListener('pointermove',e=>{ const c=e.target.closest('.g7-card'); if(!c) return; const r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px'); });
}
const v=document.getElementById('g7-vista');
if(v){
  const f=document.createElement('div'); f.setAttribute('aria-hidden','true'); f.style.cssText='position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0';
  for(let i=0;i<26;i++){ const s=document.createElement('i'); s.textContent=['✦','♥','♪','♫','✿'][i%5]; s.style.cssText=`position:absolute;left:${Math.random()*100}%;bottom:-20px;font-style:normal;font-size:${8+Math.random()*12}px;color:${i%2?'#ff7fa8':'#ffd05a'};opacity:.5;animation:g7fl ${10+Math.random()*10}s linear ${-Math.random()*12}s infinite`; f.appendChild(s); }
  v.insertBefore(f,v.firstChild);
  const st=document.createElement('style'); st.textContent='@keyframes g7fl{to{transform:translateY(-110vh) translateX(30px) rotate(40deg);opacity:0}}#g7-cuerpo,.g7-vhead{position:relative;z-index:1}'; document.head.appendChild(st);
}
})();
