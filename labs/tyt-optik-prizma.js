(function(d,M){'use strict';const $=id=>d.getElementById(id),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const s={sourceY:225,prismX:485,prismAngle:58,spectrum:'white'};let drag=null;
const rect=(x,y,w,h,fill,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" '+extra+'/>';
const line=(x,y,X,Y,color='#e0e7fc',width=3)=>'<line x1="'+x+'" y1="'+y+'" x2="'+X+'" y2="'+Y+'" stroke="'+color+'" stroke-width="'+width+'"/>';
const circle=(x,y,r,fill,extra='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" '+extra+'/>';
function controls(){
 $('controls').innerHTML='<label>Kaynağın yüksekliği <strong>'+s.sourceY+'</strong><input type="range" data-key="sourceY" min="170" max="295" step="5" value="'+s.sourceY+'"></label>'+
 '<label>Prizmanın tepe açısı <strong>'+s.prismAngle+'°</strong><input type="range" data-key="prismAngle" min="40" max="70" step="2" value="'+s.prismAngle+'"></label>'+
 '<label>Işık türü<select data-key="spectrum"><option value="white" '+(s.spectrum==='white'?'selected':'')+'>Beyaz ışık</option>'+
 M.colors.map(([name],i)=>'<option value="'+i+'" '+(String(i)===s.spectrum?'selected':'')+'>'+name+'</option>').join('')+'</select></label>'+
 '<button type="button" data-action="reset">Sıfırla</button>';
}
function draw(){
 const beams=s.spectrum==='white'?M.colors:[M.colors[Number(s.spectrum)]];
 let svg=rect(0,0,900,500,'#0e2437'),valid=[],last=null;
 const base=M.prism({centerX:s.prismX,sourceY:s.sourceY,angleDeg:s.prismAngle,glassN:1.52});
 svg+='<polygon points="'+base.apex.x+','+base.apex.y+' '+base.left.x+','+base.left.y+' '+base.right.x+','+base.right.y+'" fill="#2b7999" fill-opacity=".55" stroke="#aee7ed" stroke-width="5" data-drag="prism"/>';
 for(const [name,color,n] of beams){
 const model=M.prism({centerX:s.prismX,sourceY:s.sourceY,angleDeg:s.prismAngle,glassN:n});
 if(model.miss)continue;
 last=model;valid.push(name);
 svg+=line(model.source.x,model.source.y,model.entry.x,model.entry.y,'#fff6c5',s.spectrum==='white'?3:5);
 svg+=line(model.entry.x,model.entry.y,model.exit.x,model.exit.y,color,3.5);
 const end={x:model.exit.x+model.outside.x*200,y:model.exit.y+model.outside.y*200};
 svg+=line(model.exit.x,model.exit.y,end.x,end.y,color,4);
 }
 svg+=circle(120,s.sourceY,20,'#ffe5ad','data-drag="source"')+'<text x="83" y="'+(s.sourceY-33)+'" fill="#ecf8fb" font-size="18">Kaynak</text>';
 svg+='<text x="110" y="72" fill="#d5f5f1" font-size="18">'+(s.spectrum==='white'?'Beyaz ışık, cam prizmada renklerine ayrılır.':'Tek renkli ışık prizmada yön değiştirir.')+'</text>';
 svg+='<text x="110" y="441" fill="#b4d4db" font-size="17">Kaynağı ve prizmayı parmağınla sürükle; tepe açısını değiştir.</text>';
 $('scene').innerHTML=svg;
 $('stats').textContent=last? s.spectrum==='white'?'Beyaz ışık ayrıştı: kırmızı en az, mor en çok sapar.':valid[0]+' ışık prizmadan geçerken kırılır.':'Bu konumda ışın prizmanın içinde istenen yönden çıkmıyor; kaynağı veya prizmayı değiştir.';
 $('explain').textContent='2018 MEB 10.4.8.1: Prizmada ışığın yolu geometrik olarak gösterilir; beyaz ışık dispersiyon nedeniyle farklı renklerine ayrılır. Modelde camın farklı renklere uyguladığı kırılma etkisi temsili sabitlerle ayarlanmıştır. Sayısal prizma hesabı yapılmaz, ışınlar için ideal yüzeyler varsayılır. Gerçek optikte prizma açısı ve cam türü sonuçları etkiler.';
}
function render(){controls();draw();}
$('controls').addEventListener('input',e=>{const key=e.target.dataset.key;if(!['sourceY','prismAngle','spectrum'].includes(key))return;s[key]=key==='spectrum'?e.target.value:Number(e.target.value);render();});
$('controls').addEventListener('change',e=>{if(e.target.dataset.key==='spectrum'){s.spectrum=e.target.value;render();}});
$('controls').addEventListener('click',e=>{if(e.target.dataset.action==='reset'){s.sourceY=225;s.prismX=485;s.prismAngle=58;s.spectrum='white';render();}});
function pos(e){const box=$('scene').getBoundingClientRect();return{x:(e.clientX-box.left)*900/box.width,y:(e.clientY-box.top)*500/box.height};}
$('scene').addEventListener('pointerdown',e=>{const t=e.target.closest('[data-drag]');if(!t)return;drag={kind:t.dataset.drag,id:e.pointerId,originX:pos(e).x,startX:s.prismX};$('scene').setPointerCapture?.(e.pointerId);e.preventDefault();});
$('scene').addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=pos(e);
 if(drag.kind==='source')s.sourceY=clamp(Math.round(p.y/5)*5,170,295);
 if(drag.kind==='prism')s.prismX=clamp(drag.startX+p.x-drag.originX,390,570);
 draw();e.preventDefault();});
for(const type of ['pointerup','pointercancel','lostpointercapture'])$('scene').addEventListener(type,e=>{if(drag&&drag.id===e.pointerId){drag=null;render();}});
render();
})(document,window.TYTPrismModel);