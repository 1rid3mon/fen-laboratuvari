/* Shared UI for 2018-MEB mechanics labs. No dependencies or idle animation loops. */
(function(root,doc){'use strict';
const el=id=>doc.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(x,d=2)=>Number.isFinite(x)?Number(x.toFixed(d)).toLocaleString('tr-TR',{maximumFractionDigits:d}):'—';
function svg(body,label='Fizik deneyi'){return '<svg viewBox="0 0 800 360" role="img" aria-label="'+esc(label)+'" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="360" fill="#0a1b2e"/>'+body+'</svg>';}
function line(x1,y1,x2,y2,color='#58809b',width=2){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+width+'"/>';}
function text(x,y,s,color='#d5e9f6',size=17){return '<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+size+'" font-family="system-ui">'+esc(s)+'</text>';}
function arrow(x,y,dx,dy,color,label){const dist=Math.hypot(dx,dy);if(dist<1e-7)return '';const ex=x+dx,ey=y+dy,a=Math.atan2(dy,dx),wing=11;return '<path d="M'+x+' '+y+' L'+ex+' '+ey+' M'+(ex-wing*Math.cos(a-.5))+' '+(ey-wing*Math.sin(a-.5))+' L'+ex+' '+ey+' L'+(ex-wing*Math.cos(a+.5))+' '+(ey-wing*Math.sin(a+.5))+'" fill="none" stroke="'+color+'" stroke-width="4"/>'+text(ex+7,ey-7,label,color,15);}
function cart(x,y,color,label){return '<rect x="'+(x-32)+'" y="'+(y-43)+'" width="64" height="40" rx="8" stroke="#d0eaf3" stroke-width="2" fill="'+color+'"/><circle cx="'+(x-19)+'" cy="'+(y+4)+'" r="9" fill="#293949" stroke="#c5e0ef"/><circle cx="'+(x+19)+'" cy="'+(y+4)+'" r="9" fill="#293949" stroke="#c5e0ef"/>'+text(x-25,y-53,label,'#e9f8ff',17);}
function graph({points,xLabel='x',yLabel='F',shade=false}){
 const xmin=Math.min(0,...points.map(p=>p[0])),xmax=Math.max(1,...points.map(p=>p[0])),ymin=Math.min(0,...points.map(p=>p[1])),ymax=Math.max(0,...points.map(p=>p[1]));
 const rx=xmax-xmin||1,ry=ymax-ymin||1,l=75,b=292,w=650,h=240,xx=x=>l+(x-xmin)/rx*w,yy=y=>b-(y-ymin)/ry*h,y0=yy(0);
 let body='';for(let i=0;i<=5;i++)body+=line(l+i*w/5,35,l+i*w/5,b+5,'#203c53',1)+line(l,35+i*h/5,l+w,35+i*h/5,'#203c53',1);
 body+=line(l,35,l,b,'#b1cfe1',2)+line(l,y0,l+w,y0,'#a5d6df',2);
 if(shade)for(let i=0;i<points.length-1;i++){
  const a=points[i],c=points[i+1],segments=(a[1]*c[1]<0)?[[a,[a[0]+(c[0]-a[0])*(-a[1])/(c[1]-a[1]),0]],[ [a[0]+(c[0]-a[0])*(-a[1])/(c[1]-a[1]),0],c ]]:[[a,c]];
  for(const seg of segments){const [u,v]=seg;const up=(u[1]+v[1])/2>=0;body+='<path d="M'+xx(u[0])+' '+y0+' L'+xx(u[0])+' '+yy(u[1])+' L'+xx(v[0])+' '+yy(v[1])+' L'+xx(v[0])+' '+y0+' Z" fill="'+(up?'#35b99c55':'#ef808055')+'"/>';}
 }
 const poly=points.map((p,i)=>(i?'L':'M')+xx(p[0]).toFixed(2)+' '+yy(p[1]).toFixed(2)).join(' ');
 body+='<path d="'+poly+'" stroke="#6debd0" stroke-width="4" fill="none"/>';
 body+=text(l-40,27,yLabel,'#c9e5ec',18)+text(l+w-10,333,xLabel,'#c9e5ec',17)+text(l+3,40,fmt(ymax),'#bdd4e4',13)+text(l+3,b+24,fmt(xmin),'#bdd4e4',13)+text(l+w-48,b+24,fmt(xmax),'#bdd4e4',13);
 if(ymin<0)body+=text(l+3,b-6,fmt(ymin),'#bdd4e4',13);
 return svg(body,yLabel+' - '+xLabel+' grafiği');
}
function energyBars(items){
 const max=Math.max(1,...items.map(x=>x.value));return '<div class="mbars">'+items.map(x=>{const pct=Math.max(0,x.value/max)*100;return '<div class="mbar"><div class="mbar-head">'+esc(x.label)+' <b>'+fmt(x.value)+' '+esc(x.unit||'J')+'</b></div><div class="mbar-track"><div style="width:'+pct+'%;background:'+esc(x.color||'#6debd0')+'"></div></div></div>';}).join('')+'</div>';
}
const U={el,esc,fmt,svg,line,text,arrow,cart,graph,energyBars};
function create(config){
 const byId=new Map(config.sections.map(s=>[s.id,s])),values={},Q=config.questions||[];
 for(const s of config.sections)values[s.id]={...s.defaults};
 const state={tab:config.sections[0].id,quizIndex:0,choice:null,checked:false,score:0,playing:false,last:0};
 function stop(){state.playing=false;state.last=0;}
 function tabs(){el('tabs').innerHTML=config.sections.map(s=>'<button type="button" class="'+(state.tab===s.id?'active':'')+'" data-tab="'+esc(s.id)+'" aria-current="'+(state.tab===s.id?'page':'false')+'">'+esc(s.tab)+'</button>').join('')+(Q.length?'<button type="button" data-tab="quiz" class="'+(state.tab==='quiz'?'active':'')+'" aria-current="'+(state.tab==='quiz'?'page':'false')+'">🧠 AYT mini test</button>':'');}
 function controlHTML(){const s=byId.get(state.tab);if(!s){el('controls').innerHTML='';return;}let h='';for(const c of s.controls){const val=values[state.tab][c.id];h+='<div class="mcontrol"><label for="ctl-'+esc(c.id)+'">'+esc(c.label)+' <output id="out-'+esc(c.id)+'">'+fmt(val)+' '+esc(c.unit||'')+'</output></label><input id="ctl-'+esc(c.id)+'" type="range" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+val+'" data-control="'+esc(c.id)+'"></div>';}el('controls').innerHTML=h;}
 function quiz(){
  const q=Q[state.quizIndex];if(!q){el('quiz').textContent='Soru yok.';return;}
  el('quiz').innerHTML='<h3>Soru '+(state.quizIndex+1)+' / '+Q.length+'</h3><p class="mquiz-question">'+esc(q.q)+'</p>'+q.options.map((v,i)=>'<button type="button" data-choice="'+i+'" class="mchoice'+(state.choice===i?' selected':'')+'" aria-pressed="'+(state.choice===i)+'">'+String.fromCharCode(65+i)+') '+esc(v)+'</button>').join('')+(state.checked?'<div class="mnote '+(state.choice===q.answer?'good':'bad')+'">'+(state.choice===q.answer?'✅ Doğru.':'❌ Doğru cevap: '+String.fromCharCode(65+q.answer)+'.')+' '+esc(q.why)+'</div>':'')+'<p class="msmall">Doğru sayısı: '+state.score+' / '+Q.length+'</p>';
 }
 function render(){
  if(state.tab==='quiz'){
   el('heading').textContent='Özgün AYT soruları';el('intro').textContent='Önce kendin çöz. Açıklama yalnız cevap kontrolünden sonra açılır.';
   el('scene').innerHTML='';el('diagram-title').textContent='';el('interpret').textContent='';el('measurements').innerHTML='';el('formula').textContent='';
   el('actions').innerHTML='<button class="mbtn primary" data-action="check">Cevabı kontrol et</button><button class="mbtn" data-action="next">Sonraki soru</button><button class="mbtn" data-action="restart">Baştan başla</button>';el('note').textContent='Yanıt vermeden kontrol edemezsin.';quiz();return;
  }
  const s=byId.get(state.tab),p=values[state.tab],o=s.model(p);
  el('heading').textContent=s.title;el('intro').textContent=s.intro;
  el('scene').innerHTML=s.scene(p,o,U);el('diagram-title').textContent=s.sceneTitle||'Deneyi gözlemle';
  el('interpret').textContent=s.interpret(p,o,U);el('formula').textContent=s.formula(p,o);
  el('measurements').innerHTML=s.metrics(p,o).map(m=>'<div class="mmetric"><small>'+esc(m[0])+'</small><strong>'+esc(m[1])+'</strong></div>').join('');
  el('note').textContent=s.note;el('quiz').innerHTML='';
  el('actions').innerHTML='<button type="button" class="mbtn" data-action="reset">↺ Varsayılana dön</button>'+(s.animate?'<button type="button" class="mbtn primary" data-action="play">'+(state.playing?'Ⅱ Duraklat':'▶ Oynat')+'</button><button type="button" class="mbtn" data-action="step">+0,2 s</button>':'')+(s.motion?'<button type="button" class="mbtn primary" data-action="motion-play">'+(state.playing?'Ⅱ Duraklat':'▶ Hareket ettir')+'</button><button type="button" class="mbtn" data-action="motion-step">+ Adım</button><button type="button" class="mbtn" data-action="motion-home">↶ Hareketi başa al</button>':'');
 }
 function change(tab){
  if((tab==='quiz'&&!Q.length)||(tab!=='quiz'&&!byId.has(tab)))return;stop();state.tab=tab;state.choice=null;state.checked=false;tabs();controlHTML();render();
 }
 function animateFrame(now){
  if(!state.playing)return;
  const s=byId.get(state.tab);if(!s||(!s.animate&&!s.motion)){stop();return;}
  if(s.motion){const m=s.motion,p=values[state.tab],key=m.key;
   if(!state.last)state.last=now;
   const dt=Math.min(.08,Math.max(0,(now-state.last)/1000));state.last=now;
   const next=Math.min(m.max,p[key]+dt*m.speed);p[key]=Number(next.toFixed(5));
   const slider=el('ctl-'+key),out=el('out-'+key);
   if(slider)slider.value=String(p[key]);if(out)out.textContent=fmt(p[key])+' '+(s.controls.find(c=>c.id===key)?.unit||'');
   render();if(next>=m.max-1e-8){stop();render();return;}root.requestAnimationFrame(animateFrame);return;
  }
  if(!state.last)state.last=now;
  const p=values[state.tab],key=s.animate.key,max=s.animate.max(p),dt=Math.min(.08,Math.max(0,(now-state.last)/1000)),next=Math.min(max,p[key]+dt);
  state.last=now;p[key]=next;
  const slider=el('ctl-'+key),out=el('out-'+key);if(slider)slider.value=String(next);if(out)out.textContent=fmt(next)+' '+(s.controls.find(c=>c.id===key)?.unit||'');
  render();if(next>=max-1e-9){stop();render();return;}
  root.requestAnimationFrame(animateFrame);
 }
 function click(a){
  if(state.tab==='quiz'){
   if(a==='check'&&state.choice!==null&&!state.checked){state.checked=true;if(state.choice===Q[state.quizIndex].answer)state.score++;quiz();}
   if(a==='next'){state.quizIndex=(state.quizIndex+1)%Q.length;state.choice=null;state.checked=false;quiz();}
   if(a==='restart'){state.quizIndex=0;state.choice=null;state.checked=false;state.score=0;quiz();}
   return;
  }
  const s=byId.get(state.tab),p=values[state.tab];
  if(a==='reset'){stop();values[state.tab]={...s.defaults};controlHTML();render();}
  if(s.motion&&a==='motion-home'){stop();p[s.motion.key]=s.motion.min;const x=el('ctl-'+s.motion.key);if(x)x.value=String(p[s.motion.key]);const out=el('out-'+s.motion.key);if(out)out.textContent=fmt(p[s.motion.key])+' '+(s.controls.find(c=>c.id===s.motion.key)?.unit||'');render();}
  if(s.motion&&a==='motion-step'){stop();p[s.motion.key]=Number(Math.min(s.motion.max,p[s.motion.key]+s.motion.step).toFixed(5));const x=el('ctl-'+s.motion.key);if(x)x.value=String(p[s.motion.key]);const out=el('out-'+s.motion.key);if(out)out.textContent=fmt(p[s.motion.key])+' '+(s.controls.find(c=>c.id===s.motion.key)?.unit||'');render();}
  if(s.motion&&a==='motion-play'){if(state.playing){stop();render();return;}if(p[s.motion.key]>=s.motion.max-1e-8)p[s.motion.key]=s.motion.min;state.playing=true;state.last=0;render();root.requestAnimationFrame(animateFrame);}
  if(a==='step'&&s.animate){stop();p[s.animate.key]=Math.min(s.animate.max(p),p[s.animate.key]+.2);const slider=el('ctl-'+s.animate.key),out=el('out-'+s.animate.key);if(slider)slider.value=String(p[s.animate.key]);if(out)out.textContent=fmt(p[s.animate.key])+' s';render();}
  if(a==='play'&&s.animate){if(state.playing){stop();render();return;}if(p[s.animate.key]>=s.animate.max(p))p[s.animate.key]=0;state.playing=true;state.last=0;render();root.requestAnimationFrame(animateFrame);}
 }
 function init(){
  el('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t)change(t.dataset.tab);});
  el('controls').addEventListener('input',e=>{const input=e.target.closest('input[data-control]');if(!input||state.tab==='quiz')return;const s=byId.get(state.tab),c=s.controls.find(c=>c.id===input.dataset.control);if(!c)return;stop();values[state.tab][c.id]=Number(input.value);if(s.animate&&c.id!==s.animate.key){values[state.tab][s.animate.key]=0;const x=el('ctl-'+s.animate.key);if(x)x.value='0';const out=el('out-'+s.animate.key);if(out)out.textContent='0 s';}
    const out=el('out-'+c.id);if(out)out.textContent=fmt(values[state.tab][c.id])+' '+(c.unit||'');render();});
  el('actions').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)click(b.dataset.action);});
  el('quiz').addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(b&&!state.checked){state.choice=Number(b.dataset.choice);quiz();}});
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden){stop();render();}});
  change(state.tab);
 }
 if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',init);else init();
 return {snapshot:()=>JSON.parse(JSON.stringify({state,values,questions:Q.length})),UI:U};
}
root.MekanikUI=Object.freeze({create,U});
})(window,document);
