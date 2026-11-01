/* 2018 MEB AYT 11.1.4.1–11.1.4.6 · one-dimensional motion lab.
   Each graph, diagram and metric is driven by the SAME pure physics model.
   No Firebase, external scripts, local data, or continuously running idle RAF. */
(function(w,d){
'use strict';
const M=w.IvmeliMath,P=w.HareketMath;if(!M||!P)return;
const $=id=>d.getElementById(id),H=P.escapeHtml,F=P.f;
const tabs=[
 ['motion','1B hız / ivme'],['graphs','Üç grafik · dönüşüm'],
 ['brake','Frenleme / yön değiştirme'],['fall','Serbest düşme'],
 ['throw','Düşey atış'],['drag','Hava direnci / limit hız'],['quiz','YKS mini test']
];
const base={
 motion:{x0:0,v0:3,a:2,t:0},
 graphs:{x0:5,v0:12,a:-3,t:0},
 brake:{v0:22,decel:4,t:0},
 fall:{h:80,g:10,t:0},
 throw:{h:0,v0:20,g:10,t:0},
 drag:{h:100,mass:1,k:.05,area:.1,shape:'flat',rho:1.2,g:10,t:0},
 quiz:{index:0,choice:null,checked:false,score:0,attempts:0}
};
const S={tab:'motion',playing:false,raf:null,last:0,chartMode:'all'};
for(const id of Object.keys(base))S[id]=JSON.parse(JSON.stringify(base[id]));
const Q=[
 {q:'x₀=2 m, v₀=4 m/s, a=2 m/s². 3 saniye sonra yer değiştirme?',cs:['6 m','12 m','18 m','21 m','24 m'],a:3,why:'Δx = v₀t+½at² = 4×3+½×2×9 = 21 m.'},
 {q:'v₀=5 m/s, a=3 m/s², t=4 s. Son hız?',cs:['8','12','15','17','20'],a:3,why:'v = v₀+at = 5+3×4 = 17 m/s.'},
 {q:'İvme negatif olan bir cismin hızı mutlaka azalır mı?',cs:['Evet','Hayır, hız negatifse sürat artabilir','Daima durur','Sadece ilk hız sıfırsa','Daima ileri gider'],a:1,why:'İvme ve hız aynı işaretliyse sürat artar; ikisi de negatifse cisim hızlanır.'},
 {q:'Hız-zaman grafiğinin eğimi hangi büyüklüktür?',cs:['Konum','Yer değiştirme','İvme','Alınan yol','Sürat'],a:2,why:'v–t eğimi Δv/Δt = a (sabit ivmede).'},
 {q:'Hız-zaman grafiğinin işaretli alanı hangi büyüklüğü verir?',cs:['İvme','Yer değiştirme','Alınan yol daima','Kütle','Net kuvvet'],a:1,why:'İşaretli alan Δx verir. Negatif bölüm çıkarılır; toplam yol mutlak alan toplamıdır.'},
 {q:'a=0 iken v=6 m/s olan cismin konum–zaman grafiği?',cs:['Yatay doğru','Eğimi 6 olan doğru','Parabol','Düşey doğru','Zikzak'],a:1,why:'Sabit pozitif hızda x–t doğrusal artar; eğimi hızdır.'},
 {q:'v₀=20 m/s, sabit yavaşlama büyüklüğü 5 m/s². Durma süresi?',cs:['2 s','3 s','4 s','5 s','10 s'],a:2,why:'t_dur = v₀ / |a| = 20/5 = 4 s.'},
 {q:'Aynı araç için durma mesafesi?',cs:['20 m','30 m','40 m','50 m','80 m'],a:2,why:'d = v₀²/(2|a|) = 400/10 = 40 m.'},
 {q:'v₀=10 m/s, a=−5 m/s². 4 saniye sonunda yer değiştirme?',cs:['0 m','10 m','20 m','30 m','40 m'],a:0,why:'Δx=10×4+½×(−5)×16=0 m; araç ileri gidip geriye dönmüştür. Alınan yol sıfır değildir.'},
 {q:'Hava direnci yok, g=10 m/s². Serbest bırakılan cisim 3 s sonra kaç m düşer?',cs:['15','30','45','60','90'],a:2,why:'h=½gt²=½×10×9=45 m.'},
 {q:'Hava direnci yok, iki farklı kütle aynı yükseklikten aynı anda bırakılıyor. Hangisi önce düşer?',cs:['Ağır olan','Hafif olan','Aynı anda','Yoğun olan','Hacmi büyük olan'],a:2,why:'Hava direnci ihmal edilirse düşme ivmesi kütleden bağımsızdır.'},
 {q:'20 m/s ile yukarı atılan cisim, g=10 m/s². Tepe noktasına kaç saniyede çıkar?',cs:['1','2','3','4','5'],a:1,why:'Yukarı pozitifken v=20−10t; v=0 için t=2 s.'},
 {q:'Düşey yukarı atışta en üst noktada (hava direnci yok) ivme?',cs:['0','+10 m/s² yukarı','−10 m/s² aşağı','Hızla aynı','Kütleye bağlı'],a:2,why:'En yüksek noktada hız anlık 0 olur, fakat ivme hâlâ g kadar aşağı yönlüdür.'},
 {q:'Hava direnci etkisindeki düşen bir cisim limit hıza ulaşınca ne olur?',cs:['Ağırlığı sıfır','İvmesi sıfıra yaklaşır','Hızı sıfır','Kütlesi artar','Yerçekimi durur'],a:1,why:'Hava direnci ağırlığı dengeler; net kuvvet ve ivme sıfıra yaklaşır, hız yaklaşık sabit kalır.'},
 {q:'Hava sürtünmesi hangi faktörlerden etkilenebilir?',cs:['Yalnız renk','Yalnız kütle','Yalnız konum','Hız, şekil ve kesit alanı','Sadece sıcaklık'],a:3,why:'Hava direnci hız, şekil, kesit alanı ve ortam yoğunluğu gibi etkenlerle değişir.'},
 {q:'x–t grafiğinde eğim negatif olduğunda cismin hareket yönü?',cs:['Pozitif yönde','Durgun','Negatif yönde','Kesin hızlanıyor','Kesin yavaşlıyor'],a:2,why:'x–t eğimi işaretli hızdır. Negatif eğim → v<0, negatif yönde hareket.'}
];
const name={motion:'Sabit İvmeli Hareket',graphs:'Grafiklerin dönüşümü',brake:'Frenleme ve yön değiştirme',fall:'Serbest düşme',throw:'Düşey yukarı/aşağı atış',drag:'Hava direnci ve limit hız',quiz:'AYT mini soru bankası'};
const desc={
 motion:'Bir doğrultuda x₀, v₀, ivme ve zamanı değiştir. İvmenin işareti ile süratin artması aynı şey değildir.',
 graphs:'x–t eğimi hız; v–t eğimi ivme; v–t altındaki işaretli alan yer değiştirmedir. Üç grafiği yan yana izle.',
 brake:'Yere göre pozitif giden araç frenlenir; durma anından sonra iki farklı durumu karşılaştır.',
 fall:'Düşey aşağı pozitif. Hava direnci yoksa serbest bırakılan cisim g ile ivmelenir; kütle ivmeyi değiştirmez.',
 throw:'Düşey yukarı pozitif. İlk hız pozitifse yukarı atış, negatifse başlangıçta aşağı atış; tepede v=0 ama a=−g.',
 drag:'Cisim serbest bırakılır. Hava direncinin hızla artması ivmeyi azaltır; limit hıza yaklaşma nitel olarak gösterilir.',
 quiz:'Özgün beş seçenekli YKS çalışması. Grafik eğimi, alan, yön değişimi, serbest düşme, düşey atış, limit hız.'
};
function setTxt(id,t){$(id).textContent=t;}
function metric(rows){$('results').innerHTML=rows.map(([k,v,ex])=>'<div class="metric"><small>'+H(k)+'</small><strong>'+H(v)+'</strong>'+(ex?'<em>'+H(ex)+'</em>':'')+'</div>').join('');}
function explain(formula,body,warn){
 $('lesson').innerHTML='<div class="formula">'+H(formula)+'</div><p>'+H(body)+'</p>'+(warn?'<aside>'+H(warn)+'</aside>':'');
}
function slider(k,title,min,max,step,val,unit){
 return '<div class="control"><div class="control-top"><label for="in-'+k+'">'+H(title)+'</label><output id="out-'+k+'">'+H(F(val,unit))+'</output></div>'
 +'<input type="range" id="in-'+k+'" data-range="'+H(k)+'" data-unit="'+H(unit||'')+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"></div>';
}
function combo(k,title,values,val){
 return '<div class="control"><label for="in-'+k+'">'+H(title)+'</label><select id="in-'+k+'" data-select="'+k+'">'
 +values.map(([v,t])=>'<option value="'+H(v)+'"'+(v===val?' selected':'')+'>'+H(t)+'</option>').join('')+'</select></div>';
}
function button(title,action){
 return '<button class="btn" type="button" data-action="'+action+'">'+H(title)+'</button>';
}
function activeParams(){return S[S.tab];}
const shapeFactor={round:.55,flat:1,parachute:1.6};
function effectiveDrag(s){return s.k*(s.area/.1)*(s.rho/1.2)*shapeFactor[s.shape];}
function maxTime(mode){
 if(mode==='motion'||mode==='graphs')return 12;
 if(mode==='brake')return 12;
 if(mode==='fall'){const q=M.freeFall({height:S.fall.h,g:S.fall.g,t:0});return Math.max(3,Math.min(14,Math.ceil(q.impactTime)+2));}
 if(mode==='throw'){const q=M.verticalThrow({height:S.throw.h,v0:S.throw.v0,g:S.throw.g,t:0});return Math.max(3,Math.min(14,Math.ceil(q.impactTime)+2));}
 if(mode==='drag'){const q=M.resistance({mass:S.drag.mass,k:effectiveDrag(S.drag),g:S.drag.g,t:0,height:S.drag.h});return Math.max(4,Math.min(22,Math.ceil(q.impactTime)+2));}
 return 12;
}
function sample(mode,t){
 const s=S[mode];
 if(mode==='motion'||mode==='graphs'){
  const r=M.motion({x0:s.x0,v0:s.v0,a:s.a,t});
  return {x:r.x,v:r.v,a:r.a,t,result:r,axis:'x',positionLabel:'x konumu'};
 }
 if(mode==='brake'){
  const b=M.braking({speed:s.v0,brakingAcceleration:s.decel});
  const real=Math.min(t,b.time);
  const r=M.motion({x0:0,v0:s.v0,a:-s.decel,t:real});
  return {x:r.x,v:t>=b.time?0:r.v,a:t>=b.time?0:-s.decel,t,
   result:Object.assign({},r,{stopped:t>=b.time,stopTime:b.time,stopDistance:b.distance}),
   axis:'x',positionLabel:'x konumu'};
 }
 if(mode==='fall'){
  const r=M.freeFall({height:s.h,g:s.g,t});
  return {x:r.fallen,v:r.v,a:r.acceleration,t,result:r,axis:'down',positionLabel:'düşülen yol'};
 }
 if(mode==='throw'){
  const r=M.verticalThrow({height:s.h,v0:s.v0,g:s.g,t});
  return {x:r.y,v:r.v,a:r.acceleration,t,result:r,axis:'up',positionLabel:'yerden yükseklik'};
 }
 if(mode==='drag'){
  const r=M.resistance({mass:s.mass,k:effectiveDrag(s),g:s.g,t,height:s.h});
  return {x:r.fallen,v:r.v,a:r.acceleration,t,result:r,axis:'down',positionLabel:'düşülen yol'};
 }
 return null;
}
function formatRows(p){
 const arr=[
 ['Zaman',F(p.t,'s')],['Konum / düşülen yol',F(p.x,'m')],
 ['İşaretli hız',F(p.v,'m/s')],['İvme',F(p.a,'m/s²')]
 ];
 const r=p.result;
 if(S.tab==='motion'||S.tab==='graphs'){
  arr.push(['Yer değiştirme',F(r.displacement,'m')],['Toplam alınan yol',F(r.distance,'m')]);
  if(r.turnTime!==null)arr.push(['Yön değiştirme',F(r.turnTime,'s')]);
 }
 if(S.tab==='brake')arr.push(['Durma süresi',F(r.stopTime,'s')],['Durma mesafesi',F(r.stopDistance,'m')]);
 if(S.tab==='fall'||S.tab==='throw'||S.tab==='drag'){
  arr.push(['Yere çarpma süresi',F(r.impactTime,'s')]);
  arr.push(['Çarpma anındaki sürat',F(Math.abs(r.impactSpeed??r.impactVelocity),'m/s')]);
 }
 if(S.tab==='throw')arr.push(['En yüksek nokta',F(r.peakHeight,'m')],['Tepe zamanı',F(r.peakTime,'s')]);
 if(S.tab==='drag')arr.push(['Hava direnci',F(r.drag,'N')],['Ağırlık',F(r.weight,'N')],
   ['Kesit alanı',F(S.drag.area,'m²')],['Hava yoğunluğu',F(S.drag.rho,'kg/m³')],
   ['Etkin direnç katsayısı',F(effectiveDrag(S.drag),'N/(m/s)²')],
   ['Limit hıza yakınlık',r.impacted?'Zemine ulaştı':r.terminalSpeed===null?'Direnç yok':F(100*(r.ratio??0),'%'),'Bu bir limit hız hesaplama sorusu değildir.']);
 metric(arr);
}
function lessonFor(mode,p){
 if(mode==='motion')explain('v = v₀ + at   •   Δx = v₀t + ½at²',
  'Konum x = x₀ + Δx; sürat = |v|. Başlangıç hızı ve ivmenin işaretleri aynıysa sürat artar. Zıt işaretliyse önce yavaşlama, sonra gerekirse yön değiştirme görülür.',
  'x–t grafiği parabol olabilir; v–t doğrusu eğiminden ivme okunur. İvme eksi olsa da cisim negatif yönde hızlanabilir.');
 else if(mode==='graphs')explain('x–t eğimi = v  •  v–t eğimi = a  •  v–t alanı = Δx',
  'Hız-zaman grafiğinin zaman ekseni üstü pozitif, altı negatif yer değiştirme oluşturur. Toplam yol için mutlak alanlar toplanır. İvme-zaman grafiğinin işaretli alanı Δv verir.',
  'v=0 olduğu an her zaman a=0 değildir. Konum–zaman grafiği tepe/dip noktasında yatay teğete sahip olabilir.');
 else if(mode==='brake')explain('t_dur = v₀ / |a|   •   d_dur = v₀² / (2|a|)',
  'Başlangıç hızı pozitif ve ivme negatiftir. Araç durduğu anda frenleme modelini kesiyoruz; böylece aracın kendiliğinden geri gitmesini göstermiyoruz.',
  'Bir araç sabit negatif ivmeyle duruncaya kadar yavaşlayabilir. İvme hareket yönüne zıt olduğunda sürat azalır.');
 else if(mode==='fall')explain('v = gt   •   h_düşüş = ½gt²   •   v² = 2gh',
  'Başlangıç hızı sıfır ve hava direnci yok. Her saniye aşağı yönlü hız g kadar artar. Bu ideal durumda kütle düşüş süresini değiştirmez.',
  'Düşey aşağıyı pozitif seçtik; serbest düşme boyunca ivme +g. Zemine çarptıktan sonrası simülasyonda durma olarak modellenir.');
 else if(mode==='throw')explain('v = v₀ − gt   •   y = h₀ + v₀t − ½gt²',
  'Yukarı pozitif. Yukarı çıkışta hız azalır, tepe noktada sıfır olur, ardından negatif hızla aşağı iner. Aşağı atış için ilk hızı negatif seç.',
  'En üst noktada ivme hâlâ −g’dir. Hava direnci olmayan modelde aynı yüksekliğe dönüşte sürat büyüklüğü ilk çıkış süratine eşittir.');
 else if(mode==='drag')explain('F_net(aşağı) = mg − F_direnç   •   F_direnç ∝ v²',
  'Küçük hızlarda direnç küçüktür. Hız arttıkça hava direnci artar; ağırlığa yaklaşınca net kuvvet ve ivme sıfıra yaklaşır. Böylece hız limit değerine yaklaşır.',
  '2018 MEB: Hava direncinin değişkenleri analiz edilir ve limit hızın matematiksel modeli tanıtılır; limit hız üzerinde matematiksel hesaplama soruları hedeflenmez. Grafik k·v² örnek modeline dayanır.');
}
function sceneBase(contents){$('scene').innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 510" role="img" aria-label="Anlık bir boyutlu hareket simülasyonu">'+contents+'</svg>';}
function drawScene(p){
 const mode=S.tab,lim=maxTime(mode),t=p.t;
 if(mode==='fall'||mode==='throw'||mode==='drag'){
  const s=S[mode],h0=s.h;
  const height=mode==='throw'?Math.max(h0,p.result.peakHeight):h0;
  const heightScale=Math.max(35,height*1.12),top=40,bottom=447,scale=(bottom-top)/heightScale;
  const y=mode==='throw'?p.x:p.result.height;
  let content='<rect width="860" height="510" fill="#091c31"/><path d="M0 '+bottom+'H860" stroke="#8eaaac" stroke-width="5"/>';
  for(let i=0;i<=5;i++){const z=heightScale*i/5,yp=bottom-z*scale;
   content+='<path d="M60 '+yp+'H825" stroke="#2b4559" stroke-width="1" stroke-dasharray="4 6"/>'
    +'<text x="20" y="'+(yp-4)+'" fill="#a4c1d4" font-size="12">'+F(z)+' m</text>';
  }
  const bodyY=bottom-y*scale;
  content+='<circle cx="470" cy="'+bodyY+'" r="19" fill="#f6cb7d" stroke="#e9edee" stroke-width="2"/>'
   +'<text x="503" y="'+(bodyY+6)+'" fill="#efffff" font-size="17">'+(mode==='drag'?'Sürtünmeli':'Cisim')+'</text>';
  if(mode==='drag'){
   const vacuum=M.freeFall({height:h0,g:s.g,t});
   const vacY=bottom-vacuum.height*scale;
   content+='<circle cx="650" cy="'+vacY+'" r="14" fill="#65b9fc" stroke="#b7e6ff" stroke-width="2"/>'
    +'<text x="674" y="'+(vacY+5)+'" fill="#daebfb" font-size="14">Direnç yok</text>';
   content+='<path d="M470 '+bodyY+'L470 '+(bodyY-60)+'" stroke="#50e2c2" stroke-width="3" stroke-dasharray="5 5"/>'
    +'<text x="16" y="34" fill="#96d9d3" font-size="15">Hava direnci artınca düşme yavaşlar; limit hıza yaklaşılır.</text>';
  }else{
   content+='<text x="18" y="32" fill="#d4f4ff" font-size="15">'+(mode==='fall'?'Aşağı (+) yön  •  Serbest düşüş':'Yukarı (+) yön  •  Düşey atış')+'</text>';
  }
  content+='<text x="15" y="490" fill="#ffd89a" font-size="15">t = '+F(t,'s')+'  •  v = '+F(p.v,'m/s')+'</text>';
  sceneBase(content);return;
 }
 const s=S[mode],x=p.x,range=Math.max(60,Math.abs(x),Math.abs(s.x0||0),Math.abs(s.v0*lim||0));
 const x0=430;let coord=x0+300*x/range;
 coord=Math.max(45,Math.min(816,coord));
 let content='<rect width="860" height="510" fill="#081a2e"/><path d="M0 308H860" stroke="#bed3e3" stroke-width="4"/>';
 for(let xx=0;xx<860;xx+=45)content+='<path d="M'+xx+' 323l-17 15" stroke="#547289" stroke-width="1.4"/>';
 content+='<rect x="'+(coord-33)+'" y="254" width="66" height="50" rx="10" fill="#69b8ec" stroke="#d8f2ff" stroke-width="2"/>';
 content+='<circle cx="'+(coord-19)+'" cy="304" r="9" fill="#d4dfeb"/><circle cx="'+(coord+19)+'" cy="304" r="9" fill="#d4dfeb"/>';
 if(Math.abs(p.v)>.01)content+='<path d="M'+coord+' 245l'+(p.v>0?85:-85)+' 0" stroke="#50e2c2" stroke-width="4"/>'
  +'<text x="'+(coord+ (p.v>0?90:-160))+'" y="235" fill="#a5f4da" font-size="15">v</text>';
 if(Math.abs(p.a)>.01)content+='<path d="M'+coord+' 218l'+(p.a>0?70:-70)+' 0" stroke="#ff8c9f" stroke-width="4"/>'
  +'<text x="'+(coord+(p.a>0?73:-95))+'" y="208" fill="#ffb8c5" font-size="15">a</text>';
 content+='<text x="21" y="34" fill="#c9eafa" font-size="16">Yer: +x sağa → · Hız (yeşil) ve ivme (pembe) farklı yönlerde olabilir</text>';
 content+='<text x="21" y="472" fill="#f6cb7d" font-size="17">x = '+F(x,'m')+'  •  v = '+F(p.v,'m/s')+'  •  a = '+F(p.a,'m/s²')+'</text>';
 sceneBase(content);
}
function makePlots(mode){
 const el=$('graphs'),T=maxTime(mode),pts=[];
 for(let i=0;i<=72;i++){const t=T*i/72;pts.push(sample(mode,t));}
 const current=sample(mode,S[mode].t),types=[
 {key:'x',title:mode==='throw'?'Yerden yükseklik – zaman':mode==='fall'||mode==='drag'?'Düşülen yol – zaman':'Konum – zaman',unit:'m',color:'#64bcff',why:'Eğim = anlık hız'},
 {key:'v',title:'Hız – zaman',unit:'m/s',color:'#50e2c2',why:'Eğim = ivme · İşaretli alan = Δx'},
 {key:'a',title:'İvme – zaman',unit:'m/s²',color:'#f5c978',why:'İşaretli alan = Δv'}
 ];
 el.innerHTML=types.map(o=>plot(pts,current,T,o)).join('');
 const p=current,r=p.result;
 let summary='Grafikleri okurken: x–t eğimi anlık hızı, v–t eğimi ivmeyi; v–t alanı işaretli yer değiştirmeyi verir.';
 if(mode==='motion'||mode==='graphs')summary+=' Bu ana kadar Δx = '+F(r.displacement,'m')+' ve toplam alınan yol = '+F(r.distance,'m')+'.';
 if(mode==='brake')summary+=' Durma: '+F(r.stopTime,'s')+'; fren mesafesi '+F(r.stopDistance,'m')+'.';
 if(mode==='throw')summary+=' Tepe nokta: '+F(r.peakHeight,'m')+' ve v=0 iken a=−g.';
 if(mode==='drag')summary+=' Hava direnci yalnız hareket ederken etkili. Limit hıza yaklaşınca a≈0 ve Fdirenç≈mg.';
 setTxt('graph-summary',summary);
}
function plot(pts,current,T,o){
 const padL=48,padR=12,padTop=18,padBottom=33,W=320,Ht=203,wp=W-padL-padR,hp=Ht-padTop-padBottom;
 const raw=pts.map(p=>p[o.key]);let lo=Math.min(0,...raw),hi=Math.max(0,...raw);
 if(Math.abs(hi-lo)<1e-7){hi+=1;lo-=1;}else{const extra=(hi-lo)*.085;hi+=extra;lo-=extra;}
 const X=t=>padL+wp*t/T,Y=v=>padTop+hp*(hi-v)/(hi-lo);
 const px=pts.map(p=>X(p.t).toFixed(1)+','+Y(p[o.key]).toFixed(1)).join(' ');
 const zero=Y(0);
 const plotY=current[o.key],cy=Y(plotY),cx=X(current.t);
 const isVel=o.key==='v';
 const areaFill=isVel?'<path d="M'+X(0)+','+zero+' L'+pts.map(p=>X(p.t).toFixed(1)+','+Y(p.v).toFixed(1)).join(' ')+' L'+X(T)+','+zero+' Z" fill="#46daba" fill-opacity=".10"/>':'';
 let ticks='';
 for(let i=0;i<=4;i++){
  const t=T*i/4,val=lo+(hi-lo)*i/4;
  ticks+='<line x1="'+padL+'" y1="'+Y(val).toFixed(1)+'" x2="'+(W-padR)+'" y2="'+Y(val).toFixed(1)+'" stroke="#34536a" stroke-dasharray="3 4"/>'
   +'<text x="'+(padL-5)+'" y="'+(Y(val)+4).toFixed(1)+'" text-anchor="end" font-size="11" fill="#a5c4d2">'+H(F(val,'',1))+'</text>'
   +'<text x="'+X(t).toFixed(1)+'" y="'+(Ht-11)+'" text-anchor="middle" font-size="11" fill="#9fbbcb">'+H(F(t,'',1))+'</text>';
 }
 const body=areaFill+ticks
  +'<line x1="'+padL+'" y1="'+zero+'" x2="'+(W-padR)+'" y2="'+zero+'" stroke="#a2bdca" stroke-width="1.3"/>'
  +'<polyline points="'+px+'" fill="none" stroke="'+o.color+'" stroke-width="3" stroke-linejoin="round"/>'
  +'<line x1="'+cx.toFixed(1)+'" y1="'+padTop+'" x2="'+cx.toFixed(1)+'" y2="'+(Ht-padBottom)+'" stroke="#e9c57b" stroke-width="1.5" stroke-dasharray="5 4"/>'
  +'<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="4.4" fill="#f7d89c" stroke="#142335"/>'
  +'<text x="'+(W-10)+'" y="13" text-anchor="end" fill="#d8e7f1" font-size="11">t (s)</text>';
 return '<div class="plot"><h3>'+H(o.title)+'</h3><svg viewBox="0 0 '+W+' '+Ht+'" role="img" aria-label="'+H(o.title)+' grafiği">'+body+'</svg>'
  +'<p>'+H(o.why)+' · anlık '+H(F(plotY,o.unit))+'</p></div>';
}
function update(){
 if(S.tab==='quiz'){drawQuiz();return;}
 const p=sample(S.tab,S[S.tab].t);drawScene(p);formatRows(p);lessonFor(S.tab,p);makePlots(S.tab);
 $('quiz').innerHTML='';buttons();
}
function drawQuiz(){
 const q=Q[S.quiz.index%Q.length],s=S.quiz;
 $('scene').innerHTML='<svg viewBox="0 0 860 510" role="img" aria-label="AYT örnek soru"><rect width="860" height="510" fill="#0a2136"/>'
  +'<rect x="65" y="82" width="730" height="350" rx="25" fill="#123047" stroke="#4c6b7e"/>'
  +'<text x="92" y="148" fill="#50e2c2" font-size="22">AYT · BİR BOYUTTA İVMELİ HAREKET</text>'
  +'<text x="92" y="232" fill="#e3f6fd" font-size="23">Önce işaretleri seç, ardından hesapla.</text>'
  +'<text x="92" y="296" fill="#c1d7e7" font-size="17">Grafikte eğim ve alanı ayrı yorumla.</text></svg>';
 $('graphs-section').classList.add('hidden');
 $('quiz').innerHTML='<div class="quiz-prompt">'+H(q.q)+'</div>'+q.cs.map((answer,i)=>
  '<button class="answer '+(s.checked?(i===q.a?'correct':i===s.choice?'wrong':''):'')+'" data-answer="'+i+'" '+(s.checked?'disabled':'')+' type="button">'
  +'<span>'+('ABCDE'[i])+'</span>'+H(answer)+'</button>').join('')
  +(s.checked?'<div class="feedback '+(s.choice===q.a?'success':'error')+'">'+H(q.why)+'</div>':'<div class="feedback info">Bir seçeneği işaretle, sonra cevabı kontrol et.</div>');
 metric([['Soru',String(s.index+1)+' / '+Q.length],['Doğru',String(s.score)],['Çözülen',String(s.attempts)]]);
 $('lesson').innerHTML='<p>2018 MEB 11.1.4.1–11.1.4.6 kapsamından seçilmiş <strong>özgün</strong> örnekler.</p>'
  +'<aside>Hava direnci ve limit hız soruları kavramsal düzeydedir; limit hız hesabı sorulmaz.</aside>';
 setTxt('hint','Çözümleri her soruda açıkla. Matematiksel işaret ile fiziksel yön tutarlı mı kontrol et.');
 buttons();
}
function makeControls(){
 const t=S.tab,s=S[t],T=maxTime(t);let h='';
 if(t==='motion'||t==='graphs')h=slider('x0','İlk konum',-30,30,1,s.x0,'m')+
  slider('v0','İlk hız (+sağ)',-20,20,1,s.v0,'m/s')+
  slider('a','Sabit ivme',-8,8,.5,s.a,'m/s²');
 if(t==='brake')h=slider('v0','İlk sürat',0,35,1,s.v0,'m/s')+
  slider('decel','Fren ivmesi büyüklüğü',.5,10,.5,s.decel,'m/s²');
 if(t==='fall')h=slider('h','Başlangıç yüksekliği',10,160,5,s.h,'m')+slider('g','Yerçekimi ivmesi',8,10,.2,s.g,'m/s²');
 if(t==='throw')h=slider('h','Atış yüksekliği',0,80,5,s.h,'m')+
  slider('v0','İlk hız (+yukarı)',-20,40,1,s.v0,'m/s')+slider('g','Yerçekimi',8,10,.2,s.g,'m/s²');
 if(t==='drag')h=slider('h','Bırakma yüksekliği',10,120,5,s.h,'m')+slider('mass','Cismin kütlesi',.5,4,.5,s.mass,'kg')
  +slider('area','Havayla karşılaşan kesit alanı',.02,.3,.01,s.area,'m²')
  +combo('shape','Cismin şekli',[['round','Yuvarlak — az direnç'],['flat','Düz yüzey'],['parachute','Paraşüt — çok direnç']],s.shape)
  +slider('rho','Hava yoğunluğu',.6,1.6,.1,s.rho,'kg/m³')
  +slider('k','Temel direnç katsayısı',0,.2,.01,s.k,'N/(m/s)²')+slider('g','Yerçekimi',8,10,.2,s.g,'m/s²');
 if(t!=='quiz')h+=slider('t','Zamanı elle ilerlet',0,T,.1,Math.min(T,s.t),'s');
 $('controls').innerHTML=h||'<p class="muted">Soruyu seçip yanıtını kontrol et.</p>';
}
function buttons(){
 let h='';
 if(S.tab==='quiz')h='<button class="btn primary" data-action="check" type="button" '+(S.quiz.choice===null||S.quiz.checked?'disabled':'')+'>Cevabı kontrol et</button>'
  +button('Sonraki soru →','next')+button('Testi sıfırla','reset');
 else h=button(S.playing?'Ⅱ Duraklat':'▶ Oynat','play')+button('+0,5 saniye','step')
  +button('↺ Deneyi sıfırla','reset');
 $('buttons').innerHTML=h;
}
function setMode(id){
 if(!tabs.some(t=>t[0]===id))return;
 S.tab=id;S.playing=false;S.last=0;
 d.querySelectorAll('[data-tab]').forEach(b=>{const act=b.dataset.tab===id;b.classList.toggle('active',act);b.setAttribute('aria-pressed',String(act));});
 setTxt('heading',name[id]);setTxt('intro',desc[id]);
 setTxt('tagline',id==='quiz'?'ÖZGÜN AYT SORULARI':'MEB 2018 · 11.1.4');
 $('graphs-section').classList.toggle('hidden',id==='quiz');
 makeControls();update();
}
function onChange(key,value){
 const s=S[S.tab];
 if(!s||!(key in s)||S.tab==='quiz')return;
 S.playing=false;S.last=0;s[key]=key==='shape'?value:Number(value);
 if(key!=='t'){
  s.t=0;
  // Never recreate range inputs during input events: preserve iPad/phone dragging.
  const timeInput=$('in-t'),timeOutput=$('out-t');
  if(timeInput){timeInput.value='0';timeInput.max=String(maxTime(S.tab));}
  if(timeOutput)timeOutput.textContent=F(0,'s');
 }
 s.t=Math.max(0,Math.min(s.t,maxTime(S.tab)));
 update();
}
function action(id){
 const t=S.tab,s=S[t];
 if(id==='play'&&t!=='quiz'){
  if(s.t>=maxTime(t)-.001){s.t=0;const sliderEl=$('in-t');if(sliderEl)sliderEl.value=0;}
  S.playing=!S.playing;S.last=0;
  buttons();if(S.playing)schedule();return;
 }
 if(id==='step'&&t!=='quiz'){
  S.playing=false;s.t=Math.min(maxTime(t),s.t+.5);const sliderEl=$('in-t');if(sliderEl)sliderEl.value=s.t;
  const out=$('out-t');if(out)out.textContent=F(s.t,'s');
  update();return;
 }
 if(id==='reset'){
  S.playing=false;S[t]=JSON.parse(JSON.stringify(base[t]));makeControls();update();return;
 }
 if(id==='check'&&t==='quiz'&&s.choice!==null&&!s.checked){
  s.checked=true;s.attempts++;if(s.choice===Q[s.index%Q.length].a)s.score++;
  update();return;
 }
 if(id==='next'&&t==='quiz'){s.index=(s.index+1)%Q.length;s.choice=null;s.checked=false;update();}
}
function schedule(){if(S.playing&&S.raf===null)S.raf=w.requestAnimationFrame(frame);}
function frame(now){
 S.raf=null;
 if(S.playing){
  const dt=Math.min(.06,S.last?(now-S.last)/1000:0);const s=S[S.tab];s.t=Math.min(maxTime(S.tab),s.t+dt);
  const inp=$('in-t'),out=$('out-t');if(inp)inp.value=s.t;if(out)out.textContent=F(s.t,'s');
  if(s.t>=maxTime(S.tab))S.playing=false;
  update();
 }
 S.last=now;if(S.playing)schedule();
}
function init(){
 if(!$('scene')||!$('tabs')||!$('graphs'))return;
 $('tabs').innerHTML=tabs.map(([id,title])=>'<button type="button" data-tab="'+id+'" aria-pressed="false">'+H(title)+'</button>').join('');
 $('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)setMode(b.dataset.tab);});
 $('controls').addEventListener('input',e=>{const b=e.target.closest('[data-range]');if(!b)return;onChange(b.dataset.range,b.value);});
 $('controls').addEventListener('change',e=>{const b=e.target.closest('select[data-select]');if(b)onChange(b.dataset.select,b.value);});
 $('buttons').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)action(b.dataset.action);});
 $('quiz').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b&&S.tab==='quiz'&&!S.quiz.checked){S.quiz.choice=Number(b.dataset.answer);update();}});
 d.addEventListener('visibilitychange',()=>{if(d.hidden){S.playing=false;S.last=0;buttons();}});
 setMode('motion');
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
w.IvmeliLabDebug=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({tab:S.tab,playing:S.playing,motion:S.motion,graphs:S.graphs,brake:S.brake,fall:S.fall,throw:S.throw,drag:S.drag,quiz:S.quiz}))});
})(window,document);