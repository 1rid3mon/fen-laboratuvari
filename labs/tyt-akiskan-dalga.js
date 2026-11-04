(function(d,M){'use strict';const $=id=>d.getElementById(id),clamp=M.clamp,fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2});
const modes=[['flow','Daralan boruda akış'],['torricelli','Torricelli / atmosfer'],['waves','Düz engelde yansıma'],['parabola','Parabolik engelde odaklanma'],['earthquake','Deprem ve güvenlik'],['research','Fizik ve araştırma']];
const s={tab:'flow',constriction:.65,flowSpeed:2,altitude:0,angleDeg:90,impactOffset:0,focal:110,sourceX:175,sourceY:280,tremor:20,anchored:false,phase:0,playing:true,research:'particle'};
let pointer=null,prev=0;
const rect=(x,y,w,h,fill,other='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" '+other+'/>';
const txt=(x,y,t,size=18,color='#ecf8fe')=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-family="system-ui" fill="'+color+'">'+t+'</text>';
const circle=(x,y,r,fill,other='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" '+other+'/>';
const line=(x,y,X,Y,color='#9adede',w=3,other='')=>'<line x1="'+x+'" y1="'+y+'" x2="'+X+'" y2="'+Y+'" stroke="'+color+'" stroke-width="'+w+'" '+other+'/>';
const area=(points,fill,other='')=>'<polygon points="'+points.map(q=>q[0]+','+q[1]).join(' ')+'" fill="'+fill+'" '+other+'/>';
const slider=(key,label,min,max,step,unit='')=>'<label>'+label+' <strong>'+fmt(s[key])+'</strong> '+unit+'<input type="range" data-key="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[key]+'"></label>';
const button=(action,label)=>'<button type="button" data-action="'+action+'">'+label+'</button>';
const sel=(key,label,items)=>'<label>'+label+'<select data-key="'+key+'">'+items.map(([k,t])=>'<option value="'+k+'" '+(s[key]===k?'selected':'')+'>'+t+'</option>').join('')+'</select></label>';
const arrowHeads='<defs><marker id="forward" markerWidth="7" markerHeight="7" refX="7" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6" fill="none" stroke="#f7c88b" stroke-width="2"/></marker></defs>';
function controls(){
 $('tabs').innerHTML=modes.map(([key,name])=>'<button type="button" data-tab="'+key+'" aria-pressed="'+(s.tab===key)+'">'+name+'</button>').join('');
 let out='';
 if(s.tab==='flow')out=slider('constriction','Dar bölüm kesit oranı',.3,1,.05)+slider('flowSpeed','Akış hızı (şematik)',.5,4,.5)+button('reset-flow','Boruyu yeniden genişlet');
 if(s.tab==='torricelli')out=slider('altitude','Yükseklik (göreli etki)',0,3000,250,'m');
 if(s.tab==='waves')out=slider('angleDeg','Düz engelin açısı',50,130,5,'°')+slider('impactOffset','Temas noktası (engelde)',-110,110,10)+button('reset-wave','Engeli ve kaynağı sıfırla');
 if(s.tab==='parabola')out=slider('focal','Parabolik engelin odak uzaklığı (çizim)',70,155,5,'görsel birim')+button('reset-parabola','Parabolik engeli sıfırla');
 if(s.tab==='earthquake')out=slider('tremor','Şematik sallanma düzeyi',0,40,5)+button('anchor',s.anchored?'Dolabın sabitlemesini kaldır':'Dolabı duvara sabitle');
 if(s.tab==='research')out=sel('research','Araştırma örneği',[['particle','Parçacık fiziği / CERN'],['space','Uzay araştırmaları / NASA ve ESA'],['national','Türkiye / TÜBİTAK']]);
 $('controls').innerHTML=out;
}
function flowScene(){
 const v=M.venturi({speed:s.flowSpeed,constriction:s.constriction}),narrow=60*s.constriction;
 let b=arrowHeads+area([[130,125],[375,125],[450,245-narrow],[630,245-narrow],[710,125],[815,125],[815,365],[710,365],[630,245+narrow],[450,245+narrow],[375,365],[130,365]],'#1b6785','stroke="#a9e3eb" stroke-width="4"');
 b+=txt(165,92,'Geniş bölüm')+txt(445,88,'Dar bölüm')+txt(630,460,'Geniş bölüm');
 for(let row=-2;row<=2;row++){const ly=245+row*27;for(let k=0;k<4;k++){const x=150+((k*180+s.phase*s.flowSpeed*65)%610),mid=x>440&&x<640;
 const stretch=mid?s.constriction:1,cy=245+(ly-245)*stretch;
 b+=circle(x,cy,5,'#92f1e4');}}
 b+=circle(535,245-narrow,14,'#ffcf9a','data-drag="neck"')+line(275,380,275,418,'#f4cf96',4)+line(535,245+narrow+15,535,428,'#f4cf96',4);
 return{b,stats:v.direction==='throat lower'?'Dar kesitte akış hızı daha yüksek; durgun/statik basınç daha düşük.':'Kesitler eşit: hız ve basınç farkı oluşmaz.',
 note:'2018 MEB 10.2.1.2: Akış sürekliliği ve Bernoulli ilkesinin nitel gösterimi. Aynı seviyede, sabit debili, sıkıştırılamaz ve sürtünmesiz ideal akış varsayılır. Parmakla boğaz genişliğini değiştir. Dışarıdaki havanın akımı, basınç farkları ve gerçek girdaplar modellenmez; matematiksel hesap sorusu sunulmaz.'};
}
function torricelliScene(){
 const v=M.barometer(s.altitude),hgHeight=clamp(v.heightM/.76,0,1)*260,top=415-hgHeight;
 let b=rect(180,370,540,84,'#866a64','rx="10" stroke="#d3b3a3" stroke-width="3"')+rect(190,386,520,67,'#b6b9bf','opacity=".75"');
 b+=rect(385,65,130,356,'#182d46','rx="13" stroke="#afd8ec" stroke-width="5"')+rect(392,top,116,415-top,'#c4c9d5','opacity=".8"')+line(392,top,508,top,'#f6deb2',4);
 b+=txt(399,95,'Üstte')+txt(399,121,'vakum')+txt(117,140,'Barometre sütunu')+txt(142,470,'Cıva haznesi (yalnız kuramsal gösterim)');
 b+=line(590,125,590,420,'#e8d19e',3)+circle(590,top,13,'#ffe4a9');
 return{b,stats:'Yükseğe çıkıldıkça atmosfer basıncı azalır; barometrede cıva sütunu kısalır.',
 note:'2018 MEB 10.2.1.1: Torricelli deneyinde kapalı ucu yukarıda olan cıva tüpünün üzerindeki boşluk idealde vakumdur. Dış atmosfer, haznedeki cıvaya basınç uygular; sütun bu basınçla dengelenir. Kılcallıktan farklı olarak bu olay borunun darlığından değil atmosfer basıncından kaynaklanır. Cıva zehirlidir; bu yalnız sanal deneydir. Gerçek atmosferin sıcaklık/nem profili modellenmez.'};
}
function reflectionScene(){
 const reflect=M.reflect({source:{x:s.sourceX,y:s.sourceY},center:{x:585,y:252},angleDeg:s.angleDeg,impactOffset:s.impactOffset}),p=reflect.impact,t=reflect.tangent;
 const begin={x:585-130*t.x,y:252-130*t.y},end={x:585+130*t.x,y:252+130*t.y};
 const target={x:p.x+reflect.reflected.x*275,y:p.y+reflect.reflected.y*275};
 let b=arrowHeads+line(begin.x,begin.y,end.x,end.y,'#fed4a2',12)+line(reflect.source.x,reflect.source.y,p.x,p.y,'#9aebdb',5)+line(p.x,p.y,target.x,target.y,'#f8b9a3',5);
 b+=line(p.x-65*reflect.normal.x,p.y-65*reflect.normal.y,p.x+65*reflect.normal.x,p.y+65*reflect.normal.y,'#8dbccf',2,'stroke-dasharray="8 6"');
 for(const [origin,dir,color] of [[p,reflect.incident,'#81cced'],[p,reflect.reflected,'#efbe86']]){const perp={x:-dir.y,y:dir.x};for(let k=1;k<=3;k++){const cx=origin.x-dir.x*k*53,cy=origin.y-dir.y*k*53;if(origin===p&&dir===reflect.reflected){const x=origin.x+dir.x*k*53,y=origin.y+dir.y*k*53;b+=line(x-perp.x*35,y-perp.y*35,x+perp.x*35,y+perp.y*35,color,2);}else b+=line(cx-perp.x*35,cy-perp.y*35,cx+perp.x*35,cy+perp.y*35,color,2);}}
 b+=circle(s.sourceX,s.sourceY,19,'#a7f6d5','data-drag="source"')+circle(p.x,p.y,17,'#ffe4af','data-drag="impact"')+circle(end.x,end.y,15,'#ffc89b','data-drag="barrier"');
 b+=txt(110,72,'Yeşil: gelen dalga · turuncu: yansıyan dalga');
 return{b,stats:'Geliş açısı ve yansıma açısı, engele dik çizilen normale göre birbirine eşittir.',
 note:'2018 MEB 10.3.3.2: Doğrusal su dalgasının düz engelden yansıması. Kaynağı, çarpma noktasını veya engelin ucunu parmakla taşı. İdeal düzgün engelde normal doğrultusuna göre geliş ve yansıma açıları eşittir; dalganın bulunduğu ortamdaki yayılma hızı değişmez. Kaynak/engel boyutları ve yaygın yüzey dağılması modellenmez.'};
}
function parabolicScene(){
 const vertex={x:650,y:250},f=s.focal;
 let b=arrowHeads+'<path d="';
 const points=[];for(let y=100;y<=400;y+=5)points.push([650-(y-250)*(y-250)/(4*f),y]);
 b+='M'+points.map(p=>p.join(' ')).join(' L')+'" fill="none" stroke="#ffe1ae" stroke-width="9"/>';
 for(const offsetY of [-105,-50,0,50,105]){
 const r=M.parabolicReflection({vertexX:vertex.x,vertexY:vertex.y,focal:f,offsetY});
 const q=r.impact,to={x:q.x+260*r.reflected.x,y:q.y+260*r.reflected.y};
 b+=line(105,q.y,q.x,q.y,'#92e7d9',4)+line(q.x,q.y,to.x,to.y,'#ffb58c',4);
 }
 const focus={x:650-f,y:250};b+=circle(focus.x,focus.y,16,'#aaf6db','data-drag="focus"')+txt(focus.x-52,220,'Odak',17);
 b+=circle(650,250,13,'#ffe4b9','data-drag="vertex"')+txt(110,73,'Doğrusal dalgalar parabolik engelden yansıyıp odakta birleşir.');
 return{b,stats:'Parabolik engel gelen doğrusal dalgaları yansıtır; yansıyan dalgalar odakta toplanır.',
 note:'2018 MEB 10.3.3.2: Bu ideal 2B parabolik engelde gelen doğrusal dalga cephesi eş yönlü ışınlarla temsil edilir. Her noktadaki yansıma açısı yerel normale göre geliş açısına eşittir. Engelin odak konumunu parmağınla değiştir. Gerçek su dalgasında kırınım, kayıplar, sonlu dalga boyu ve dalga cephesinin odakta yayılması modellenmemiştir.'};
}
function quakeScene(){
 const waveX=Math.sin(s.phase*7)*s.tremor*.9,baseX=230+waveX;
 const angle=s.anchored?0:Math.sin(s.phase*4)*s.tremor*.43;
 let b=rect(90,374,720,26,'#6c899e')+rect(baseX,143,385,231,'#27475e','stroke="#c3dbea" stroke-width="4" rx="6"');
 b+=rect(baseX+24,175,100,175,'#d6a878','transform="rotate('+angle+' '+(baseX+75)+' 350)" stroke="#ffe2ba" stroke-width="3"')+rect(baseX+225,240,128,80,'#9ab5c4','stroke="#dff5ff" stroke-width="3"');
 b+=txt(baseX+27,164,s.anchored?'Dolap sabit':'Dolap sabit değil',14)+txt(250,96,'Eşyayı sabitlemek devrilme riskini azaltır');
 return{b,stats:s.anchored?'Dolap duvara sabit: devrilmeye karşı koruyucu önlem gösteriliyor.':'Dolap sabit değil: devrilme tehlikesini azaltmak için sabitle.',note:'2018 MEB 10.3.5: Depremin büyüklüğü, kaynaktaki olayın ölçüsüdür; hissedilen şiddet yer, zemin ve yapıya göre değişebilir. Buradaki sallanma temsili olup bina mühendisliği ve deprem tehlike tahmini değildir. Gerçek deprem sırasında Çök–Kapan–Tutun gibi resmî güvenlik yönergelerini izle; ağır eşyaları önceden sabitle.'};
}
function researchScene(){
 const items={particle:['Parçacık fiziği','CERN','Yüksek enerjili parçacık çarpışmalarında temel maddeyi araştırır.'],space:['Uzay ve astrofizik','NASA / ESA','Uzay görevleri, uzaktan gözlem ve bilimsel ölçüm yapar.'],national:['Bilim ve teknoloji','TÜBİTAK','Türkiye’de bilimsel araştırma ve araştırma ekosistemini destekler.']};
 const q=items[s.research];let b=rect(165,122,570,240,'#255070','rx="18" stroke="#76cbd4" stroke-width="4"')+txt(210,193,q[0],27)+txt(210,254,q[1],31,'#f6d19c')+txt(210,325,'Araştırma + etik + doğrulanabilir kanıt',18);
 return{b,stats:q[2],note:'2018 MEB 9.1.1–9.1.4: Fiziğin alt dalları ve araştırma merkezleri örneklerle tanıtılır; bilimsel etik, araştırmanın tekrarlanabilirliği ve güvenilir ölçüm önemlidir. Araştırma merkezi seçim alanı bir kavram keşfi etkinliğidir, fiziksel hareket simülasyonu değildir.'};
}
function scene(){
 const scenes={flow:flowScene,torricelli:torricelliScene,waves:reflectionScene,parabola:parabolicScene,earthquake:quakeScene,research:researchScene};
 const q=scenes[s.tab]();$('scene').innerHTML=rect(0,0,900,500,'#0c273a')+q.b;$('stats').textContent=q.stats;$('explain').textContent=q.note;
}
function render(){controls();scene();}
$('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t){s.tab=t.dataset.tab;render();}});
$('controls').addEventListener('input',e=>{const key=e.target.dataset.key;if(!Object.hasOwn(s,key))return;const v=e.target.type==='range'?Number(e.target.value):e.target.value;s[key]=v;const label=e.target.parentNode?.querySelector('strong');if(label)label.textContent=fmt(v);scene();});
$('controls').addEventListener('change',e=>{if(e.target.dataset.key==='research'){s.research=e.target.value;scene();}});
$('controls').addEventListener('click',e=>{const a=e.target.dataset.action;if(a==='anchor'){s.anchored=!s.anchored;render();}if(a==='reset-wave'){s.sourceX=175;s.sourceY=280;s.angleDeg=90;s.impactOffset=0;render();}if(a==='reset-flow'){s.constriction=1;render();}if(a==='reset-parabola'){s.focal=110;render();}});
function pos(e){const r=$('scene').getBoundingClientRect();return{x:(e.clientX-r.left)*900/r.width,y:(e.clientY-r.top)*500/r.height};}
$('scene').addEventListener('pointerdown',e=>{const t=e.target.closest('[data-drag]');if(!t)return;pointer={name:t.dataset.drag,id:e.pointerId};$('scene').setPointerCapture?.(e.pointerId);e.preventDefault();});
$('scene').addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const p=pos(e);
 if(pointer.name==='neck')s.constriction=clamp(Math.round((245-p.y)/60*20)/20,.3,1);
 if(pointer.name==='source'){s.sourceX=clamp(p.x,100,380);s.sourceY=clamp(p.y,110,420);}
 if(pointer.name==='impact'){const a=s.angleDeg*Math.PI/180;s.impactOffset=clamp(Math.round(((p.x-585)*Math.cos(a)+(p.y-252)*Math.sin(a))/10)*10,-110,110);}
 if(pointer.name==='focus')s.focal=clamp(Math.round((650-p.x)/5)*5,70,155);
 if(pointer.name==='barrier'){const a=Math.atan2(p.y-252,p.x-585)*180/Math.PI;s.angleDeg=clamp(Math.round(a/5)*5,50,130);}
 scene();e.preventDefault();});
for(const e of ['pointerup','pointercancel','lostpointercapture'])$('scene').addEventListener(e,v=>{if(pointer&&pointer.id===v.pointerId){pointer=null;render();}});
function tick(t){const dt=prev?Math.min((t-prev)/1000,.05):0;prev=t;if(s.playing&&(['flow','earthquake'].includes(s.tab))){s.phase+=dt;scene();}requestAnimationFrame(tick);}
render();requestAnimationFrame(tick);
})(document,window.TYTFluidWaveModel);