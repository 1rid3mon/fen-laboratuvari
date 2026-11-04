/* AYT photosynthesis & chemosynthesis lab — zero external dependencies */
(function(w){
'use strict';
var experiments={}, order=['exp1','exp2','exp3','exp4','exp5','exp6','exp7','exp8','exp9'];
var names={LIGHT:'☀️ Foton',H2O:'💧 H₂O',CO2:'🌫️ CO₂',O2:'🫧 O₂',ATP:'⚡ ATP',ADP:'🔋 ADP + Pi',NADPH:'🟣 NADPH',NADP:'🟣 NADP⁺',NH3:'NH₃',NO2:'NO₂⁻',NO3:'NO₃⁻',H2S:'H₂S',S:'S',SO4:'SO₄²⁻',FE2:'Fe²⁺',H2:'H₂',CHLA:'Klorofil a',CHLB:'Klorofil b',CAR:'Karotenoit',PLANT:'🌿 Bitki',BACT:'🦠 Bakteri',RUBP:'RuBP',PGA:'3-PGA',PGAL:'PGAL'};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function zone(id,title,desc,done,active){return '<button type="button" class="drop'+(done?' done':'')+(active?' active':'')+'" data-zone="'+esc(id)+'"><b>'+esc(title)+'</b><span>'+esc(desc)+'</span></button>';}
function card(title,body){return '<div class="node"><h4>'+esc(title)+'</h4><p>'+body+'</p></div>';}
function progress(p){var n=Math.max(0,Math.min(100,Number(p)||0));return '<div class="progress" role="progressbar" aria-valuenow="'+Math.round(n)+'" aria-valuemin="0" aria-valuemax="100"><div style="width:'+n+'%"></div></div>';}
function plot(series,min,max,title,marker){var W=680,H=270,l=53,r=22,t=24,b=43,iw=W-l-r,ih=H-t-b;function X(v){return l+(v-min)/(max-min)*iw;}function Y(v){return t+ih-Math.max(0,Math.min(100,v))/100*ih;}var out='<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(title)+'"><text x="18" y="16" fill="#cfe8f2" font-size="11">'+esc(title)+'</text>';for(var k=0;k<=4;k++){var y=Y(k*25);out+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+y+'" y2="'+y+'" stroke="#315066" stroke-dasharray="3,5"/><text x="'+(l-8)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" fill="#bad5e4">'+(k*25)+'</text>';}for(var j=0;j<=4;j++){var v=min+(max-min)*j/4;out+='<text x="'+X(v)+'" y="'+(H-16)+'" text-anchor="middle" font-size="11" fill="#bad5e4">'+Math.round(v)+'</text>';}series.forEach(function(s){var pts=s.points.map(function(p){return X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1);}).join(' ');out+='<polyline points="'+pts+'" fill="none" stroke="'+esc(s.color)+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';});if(Number.isFinite(marker)){out+='<line x1="'+X(marker)+'" x2="'+X(marker)+'" y1="'+t+'" y2="'+(H-b)+'" stroke="#fff" stroke-dasharray="5,5" opacity=".85"/>';}return out+'</svg><div class="legend">'+series.map(function(s){return '<span><i style="background:'+esc(s.color)+'"></i>'+esc(s.label)+'</span>';}).join('')+'</div>';}
function option(id,label){return {value:id,label:label};}
var U={esc:esc,zone:zone,card:card,progress:progress,plot:plot,names:names,option:option,clamp:function(x,a,b){return Math.max(a,Math.min(b,x));},gauss:function(x,mu,sigma){return Math.exp(-Math.pow((x-mu)/sigma,2)/2);}};
function registerExperiment(id,config){if(!/^exp[1-9]$/.test(id)||experiments[id])throw Error('Duplicate/invalid experiment: '+id);['createState','render','interact','next'].forEach(function(k){if(typeof config[k]!=='function')throw Error(id+' missing '+k);});experiments[id]=config;if(waitingForExperiments&&Object.keys(experiments).length===order.length){waitingForExperiments=false;w.setTimeout(bootstrap,0);}}
w.EnerjiLab={registerExperiment:registerExperiment,U:U,registry:experiments};
var active=null,state=null,selected=null,timer=null,navRenderedFor=null,rangeFrame=null,bootstrapped=false,waitingForExperiments=false,touchDrag=null,stageDrag=null,suppressPaletteClickUntil=0;
function el(id){return document.getElementById(id);}
function feedback(msg,level){var box=el('feedback');if(!box)return;box.className='feedback '+(level||'info');box.textContent=msg||'Deneyi sürdür.';}
function stop(){if(timer!==null){w.clearInterval(timer);timer=null;}}
function perform(result,options){if(result&&result.message)feedback(result.message,result.level|| (result.ok?'success':'warning'));render(options);if(result&&result.complete)stop();}
function act(zoneId,mol){if(!active)return;var out=experiments[active].interact(state,zoneId,mol,U);if(out&&out.ok)selected=null;perform(out);}
function next(){if(!active)return;perform(experiments[active].next(state,U));}
function change(id,value,live){var exp=experiments[active];if(!exp||!exp.change)return;var result=exp.change(state,id,value,U);if(live){render({skipControls:true});return;}perform(result||{message:'Değişken güncellendi.',level:'info'});}
function showNav(){if(navRenderedFor===active)return;var box=el('experiment-nav');box.innerHTML='';navRenderedFor=active;order.forEach(function(id,i){var x=experiments[id];if(!x)return;if(i===0||i===5){var h=document.createElement('h4');h.textContent=i===0?'☀️ FOTOSENTEZ':'🦠 KEMOSENTEZ';box.appendChild(h);}var b=document.createElement('button');b.type='button';b.textContent=(i+1)+'. '+x.title;b.dataset.exp=id;b.className=id===active?'active':'';box.appendChild(b);});}
function controlsHTML(list){return (list||[]).map(function(c){var h='<div class="control"><label for="ctl-'+esc(c.id)+'">'+esc(c.label)+'</label>';if(c.type==='range'){h+='<input type="range" id="ctl-'+esc(c.id)+'" data-control="'+esc(c.id)+'" min="'+Number(c.min)+'" max="'+Number(c.max)+'" step="'+Number(c.step||1)+'" value="'+Number(c.value)+'" data-unit="'+esc(c.unit||'')+'"><span class="value">'+esc(c.value)+' '+esc(c.unit||'')+'</span>';}else if(c.type==='select'){h+='<select id="ctl-'+esc(c.id)+'" data-control="'+esc(c.id)+'">'+(c.options||[]).map(function(o){return '<option value="'+esc(o.value)+'"'+(String(o.value)===String(c.value)?' selected':'')+'>'+esc(o.label)+'</option>';}).join('')+'</select>';}else if(c.type==='buttons'){h+='<div class="options">'+(c.options||[]).map(function(o){return '<button type="button" data-opt-control="'+esc(c.id)+'" data-opt-value="'+esc(o.value)+'" class="'+(String(c.value)===String(o.value)?'selected':'')+'">'+esc(o.label)+'</button>';}).join('')+'</div>';}return h+'</div>';}).join('');}
function render(options){if(!active)return;options=options||{};var exp=experiments[active],view=exp.render(state,U);el('current-group').textContent=exp.group||'AYT BİYOLOJİ';el('experiment-title').textContent=exp.title;el('experiment-subtitle').textContent=exp.subtitle||'';el('step-badge').textContent=(view.step||1)+' / '+(view.steps||1);el('scene').innerHTML=(w.EnerjiVisual&&typeof w.EnerjiVisual.render==='function'?w.EnerjiVisual.render(active,state,view):'')+(view.scene||'');el('guidance').textContent=view.guidance||'Molekül seçerek etkileşime geç.';if(!options.skipControls)el('controls').innerHTML=controlsHTML(view.controls);el('insight').textContent=view.insight||'';el('palette').innerHTML=(view.molecules||[]).map(function(id){return '<button type="button" draggable="true" data-molecule="'+esc(id)+'" class="molecule'+(id===selected?' selected':'')+'" aria-pressed="'+(id===selected)+'">'+esc(names[id]||id)+'</button>';}).join('');el('metrics').innerHTML=(view.metrics||[]).map(function(m){return '<div class="metric"><span>'+esc(m.label)+'</span><strong>'+esc(m.value)+'</strong><small>'+esc(m.note||'')+'</small></div>';}).join('');showNav();}
function load(id){if(!experiments[id])return;stop();clearTouchDrag();stageDrag=null;if(rangeFrame!==null){if(w.cancelAnimationFrame)w.cancelAnimationFrame(rangeFrame);else w.clearTimeout(rangeFrame);rangeFrame=null;}active=id;state=experiments[id].createState();selected=null;feedback('Deney hazır. Değişkenleri değiştir veya molekülleri eşleştir.','info');render();if(w.location&&w.history&&w.location.hash!=='#'+id){try{w.history.replaceState(null,'','#'+id);}catch(ignore){/* local file preview may forbid history edits */}}}
function pickMolecule(molecule){if(!active)return;selected=selected===molecule?null:molecule;render();feedback(selected?'Seçildi: '+(names[selected]||selected)+'. Şimdi molekülü bir hedefe bırak veya sahnedeki hedefe dokun.':'Molekül seçimi kaldırıldı.','info');}
function clearTouchDrag(){if(touchDrag&&touchDrag.ghost&&touchDrag.ghost.parentNode)touchDrag.ghost.parentNode.removeChild(touchDrag.ghost);touchDrag=null;var panel=el('scene');if(panel){panel.querySelectorAll?.('.bio-drop-hover').forEach(function(x){x.classList.remove('bio-drop-hover');});}}
function targetAtPoint(x,y){var target=document.elementFromPoint?document.elementFromPoint(x,y):null;var found=target&&target.closest&&target.closest('[data-zone]');if(found)return found;
 // Safari may return the captured palette target. Fall back to geometric hit testing.
 var scene=el('scene');if(!scene||!scene.querySelectorAll)return null;
 var nodes=scene.querySelectorAll('[data-zone]');for(var i=0;i<nodes.length;i++){var r=nodes[i].getBoundingClientRect?.();if(r&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return nodes[i];}return null;}
function visualControlValue(name,x){var stage=el('scene').querySelector('.bio-stage-svg');if(!stage)return null;var r=stage.getBoundingClientRect();if(!r.width)return null;var px=(x-r.left)*760/r.width;
 if(name==='light')return Math.round(Math.max(0,Math.min(100,(px-115)/535*100))/5)*5;
 if(name==='wavelength')return Math.round(Math.max(400,Math.min(700,400+(px-95)/581*300))/5)*5;
 return null;}
function setVisualControl(name,value){if(value===null||!active)return;var input=el('controls').querySelector('[data-control="'+name+'"]');if(input){input.value=String(value);if(input.nextElementSibling)input.nextElementSibling.textContent=value+' '+(input.dataset.unit||'');}
 change(name,String(value),true);}
function enableTouchStage(){
 var palette=el('palette'),scene=el('scene');
 palette.addEventListener('pointerdown',function(e){
  var b=e.target.closest?.('[data-molecule]');if(!b||!active||e.pointerType==='mouse')return;
  touchDrag={id:e.pointerId,molecule:b.dataset.molecule,startX:e.clientX,startY:e.clientY,moved:false,ghost:null};
  palette.setPointerCapture?.(e.pointerId);e.preventDefault?.();
 });
 palette.addEventListener('pointermove',function(e){
  if(!touchDrag||touchDrag.id!==e.pointerId)return;
  var dx=e.clientX-touchDrag.startX,dy=e.clientY-touchDrag.startY;
  if(!touchDrag.moved&&Math.hypot(dx,dy)>9){touchDrag.moved=true;var g=document.createElement('div');g.className='molecule-drag-ghost';g.setAttribute('aria-hidden','true');g.textContent=names[touchDrag.molecule]||touchDrag.molecule;document.body.appendChild(g);touchDrag.ghost=g;}
  if(touchDrag.moved){if(touchDrag.ghost){touchDrag.ghost.style.left=e.clientX+'px';touchDrag.ghost.style.top=e.clientY+'px';}
   scene.querySelectorAll?.('.bio-drop-hover').forEach(function(b){b.classList.remove('bio-drop-hover');});
   var target=targetAtPoint(e.clientX,e.clientY);if(target)target.classList?.add('bio-drop-hover');
  }e.preventDefault?.();
 });
 function endPalette(e,cancel){if(!touchDrag||touchDrag.id!==e.pointerId)return;
  var molecule=touchDrag.molecule,moved=touchDrag.moved;
  var zone=!cancel&&moved?targetAtPoint(e.clientX,e.clientY):null;
  clearTouchDrag();suppressPaletteClickUntil=Date.now()+500;
  if(cancel)return;
  if(zone)act(zone.dataset.zone,molecule);
  else if(moved){selected=molecule;render();feedback('Molekül seçildi. Hedefin üzerine sürükleyip bırak veya hedefe dokun.','info');}
  else pickMolecule(molecule);
 }
 palette.addEventListener('pointerup',function(e){endPalette(e,false);});
 palette.addEventListener('pointercancel',function(e){endPalette(e,true);});
 palette.addEventListener('lostpointercapture',function(e){if(touchDrag&&touchDrag.id===e.pointerId)endPalette(e,true);});
 scene.addEventListener('pointerdown',function(e){
  var ctrl=e.target.closest?.('[data-vcontrol]');if(!ctrl)return;
  stageDrag={id:e.pointerId,key:ctrl.dataset.vcontrol};
  scene.setPointerCapture?.(e.pointerId);
  var value=visualControlValue(stageDrag.key,e.clientX);setVisualControl(stageDrag.key,value);
  e.preventDefault?.();
 });
 scene.addEventListener('pointermove',function(e){if(!stageDrag||stageDrag.id!==e.pointerId)return;setVisualControl(stageDrag.key,visualControlValue(stageDrag.key,e.clientX));e.preventDefault?.();});
 function endStage(e){if(stageDrag&&stageDrag.id===e.pointerId){stageDrag=null;}}
 ['pointerup','pointercancel','lostpointercapture'].forEach(function(name){scene.addEventListener(name,endStage);});
 scene.addEventListener('keydown',function(e){
  var node=e.target.closest?.('[data-zone],[data-vtoggle],[data-vcontrol]');if(!node)return;
  if(node.dataset.zone&&(e.key==='Enter'||e.key===' ')){act(node.dataset.zone,selected);e.preventDefault();}
  else if(node.dataset.vtoggle&&(e.key==='Enter'||e.key===' ')){change(node.dataset.vtoggle,node.dataset.value);e.preventDefault();}
  else if(node.dataset.vcontrol&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){var name=node.dataset.vcontrol,delta=e.key==='ArrowLeft'?-1:1,input=el('controls').querySelector('[data-control="'+name+'"]'),step=Number(input?.step||5),current=Number(input?.value||0);setVisualControl(name,Math.max(Number(input?.min||0),Math.min(Number(input?.max||100),current+delta*step)));e.preventDefault();}
 });
}
function bootstrap(){if(bootstrapped)return;var required=['experiment-nav','scene','feedback','palette','controls','metrics','insight'];if(!required.every(function(id){return !!el(id);}))return;
var missing=order.filter(function(id){return !experiments[id];});
if(missing.length){waitingForExperiments=true;feedback('Deney modülleri henüz yüklenemedi ('+missing.length+' / '+order.length+' eksik). Sayfayı yeniden yükle; sorun sürerse bağlantını kontrol et.','error');el('scene').innerHTML='<div class="lab-load-error" role="alert"><h3>Deneyler yüklenemedi</h3><p>Modül kayıtları tamamlanmadı. Boş ekran yerine bu uyarıyı görüyorsun.</p><button type="button" data-retry-lab="true">Yeniden dene</button></div>';el('scene').querySelector('[data-retry-lab]')?.addEventListener('click',function(){bootstrap();});return;}
waitingForExperiments=false;bootstrapped=true;el('scene').innerHTML='';enableTouchStage();el('experiment-nav').addEventListener('click',function(e){var b=e.target.closest('[data-exp]');if(b)load(b.dataset.exp);});el('palette').addEventListener('click',function(e){if(Date.now()<suppressPaletteClickUntil)return;var b=e.target.closest('[data-molecule]');if(!b)return;pickMolecule(b.dataset.molecule);});el('palette').addEventListener('dragstart',function(e){var b=e.target.closest('[data-molecule]');if(!b)return;selected=b.dataset.molecule;if(e.dataTransfer){e.dataTransfer.setData('text/plain',selected);e.dataTransfer.effectAllowed='copy';}});el('scene').addEventListener('click',function(e){var toggle=e.target.closest('[data-vtoggle]');if(toggle){change(toggle.dataset.vtoggle,toggle.dataset.value);return;}var b=e.target.closest('[data-zone]');if(b)act(b.dataset.zone,selected);});el('scene').addEventListener('dragover',function(e){if(e.target.closest('[data-zone]'))e.preventDefault();});el('scene').addEventListener('drop',function(e){var b=e.target.closest('[data-zone]');if(!b)return;e.preventDefault();act(b.dataset.zone,e.dataTransfer&&e.dataTransfer.getData('text/plain')||selected);});el('controls').addEventListener('change',function(e){var c=e.target.closest('[data-control]');if(!c)return;if(rangeFrame!==null){if(w.cancelAnimationFrame)w.cancelAnimationFrame(rangeFrame);else w.clearTimeout(rangeFrame);rangeFrame=null;}change(c.dataset.control,c.value);});
el('controls').addEventListener('input',function(e){var c=e.target.closest('input[type="range"][data-control]');if(!c)return;var id=c.dataset.control,v=c.value;if(c.nextElementSibling)c.nextElementSibling.textContent=v+' '+(c.dataset.unit||'');if(rangeFrame!==null){if(w.cancelAnimationFrame)w.cancelAnimationFrame(rangeFrame);else w.clearTimeout(rangeFrame);}var callback=function(){rangeFrame=null;change(id,v,true);};rangeFrame=w.requestAnimationFrame?w.requestAnimationFrame(callback):w.setTimeout(callback,16);});el('controls').addEventListener('click',function(e){var b=e.target.closest('[data-opt-control]');if(b)change(b.dataset.optControl,b.dataset.optValue);});el('next-btn').addEventListener('click',next);el('reset-btn').addEventListener('click',function(){if(active)load(active);});el('pause-btn').addEventListener('click',function(){stop();feedback('Otomatik gösterim duraklatıldı.','info');});el('start-btn').addEventListener('click',function(){if(!active){feedback('Deney modülleri henüz yüklenmedi. Otomatik gösterim başlatılamadı.','error');return;}stop();feedback('Otomatik gösterim aktif. Her adımda duraklatabilirsin.','info');timer=w.setInterval(next,1650);});var hash=(w.location.hash||'').slice(1);load(experiments[hash]?hash:'exp1');}
// Deferred scripts can execute with document.readyState === 'interactive'. A zero-delay timer
// at that point may run *before* later deferred experiment bundles finish downloading.
// DOMContentLoaded fires only after the deferred bundles have executed, including in Safari.
if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',bootstrap,{once:true});else w.setTimeout(bootstrap,0);
})(window);