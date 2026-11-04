(function(document){
'use strict';
const el=id=>document.getElementById(id),fmt=n=>(Object.is(Number(n),-0)?0:Number(n)).toLocaleString('tr-TR',{maximumFractionDigits:2});
const s={tab:'journey',out:50,back:20,tOut:10,tBack:10,velocity:3,time:10};
const tabs=[['journey','Yol, yer değiştirme ve ortalamalar'],['uniform','Sabit hızlı hareket ve grafikler']];
const controls={out:['Doğu yönüne gidilen yol (m)',0,80,5],back:['Batıya gidilen yol (m)',0,80,5],tOut:['İlk bölüm süresi (s)',5,30,5],tBack:['Dönüş süresi (s)',5,30,5],velocity:['Sabit hız (+ doğu, − batı) (m/s)',-6,6,1],time:['Geçen süre (s)',0,20,1]};
const names={journey:['out','back','tOut','tBack'],uniform:['velocity','time']};
function arrow(x1,x2,y,color){const d=Math.sign(x2-x1),back=x2-12*d;return '<line x1="'+x1+'" y1="'+y+'" x2="'+x2+'" y2="'+y+'" stroke="'+color+'" stroke-width="5"/>'+(d===0?'<circle cx="'+x2+'" cy="'+y+'" r="6" fill="'+color+'"/>':'<polygon points="'+x2+','+y+' '+back+','+(y-9)+' '+back+','+(y+9)+'" fill="'+color+'"/>');}
function label(x,y,v){return '<text x="'+x+'" y="'+y+'" fill="#edf9fc" font-family="system-ui" font-size="18">'+v+'</text>';}
function journey(){
const path=s.out+s.back,dx=s.out-s.back,duration=s.tOut+s.tBack,avgSpeed=path/duration,avgVelocity=dx/duration;
const x0=390,xEast=x0+3*s.out,xFinal=xEast-3*s.back;
let svg='<rect width="850" height="390" fill="#0a2435"/><line x1="90" y1="250" x2="770" y2="250" stroke="#b7cfdb" stroke-width="3"/><line x1="390" y1="245" x2="390" y2="260" stroke="#ffdc9d" stroke-width="3"/>';
svg+=arrow(x0,xEast,105,'#89eadb')+arrow(xEast,xFinal,163,'#ffc082')+'<circle cx="'+xFinal+'" cy="250" r="12" fill="#f28cb6"/>';
svg+=label(80,80,'1. Hareket: doğuya '+fmt(s.out)+' m')+label(80,140,'2. Hareket: batıya '+fmt(s.back)+' m')+label(100,310,'Başlangıç = 0 m')+label(100,344,'Bitiş = '+fmt(dx)+' m')+label(615,285,'Doğu (+) →');
return {scene:svg,result:'Alınan yol = '+fmt(path)+' m · Yer değiştirme = '+fmt(dx)+' m · Ortalama sürat = '+fmt(avgSpeed)+' m/s · Ortalama hız = '+fmt(avgVelocity)+' m/s',note:'Alınan yol = gidilen parçaların uzunlukları toplamı; yer değiştirme = son konum − ilk konum. Ortalama sürat toplam yol / toplam zaman; ortalama hız yer değiştirme / toplam zaman. Burada doğu yönü pozitiftir. Ortalama hızın işareti yönü belirtir; sürat işaret taşımaz. İki bölümün ayrı hızları sabittir, tüm yolculuk tek bir sabit hızlı hareket değildir.'};
}
function uniform(){
const x=s.velocity*s.time,x0=90,y0=194,xv=490,tx=x0+s.time*15,xy=y0-x*1.08,vy=y0-s.velocity*22;
let svg='<rect width="850" height="390" fill="#0a2435"/>';
svg+='<line x1="90" y1="40" x2="90" y2="350" stroke="#ccdee6" stroke-width="3"/><line x1="90" y1="194" x2="415" y2="194" stroke="#ccdee6" stroke-width="3"/>';
svg+='<line x1="490" y1="40" x2="490" y2="350" stroke="#ccdee6" stroke-width="3"/><line x1="490" y1="194" x2="815" y2="194" stroke="#ccdee6" stroke-width="3"/>';
svg+=label(106,60,'Konum–zaman')+label(506,60,'Hız–zaman')+label(108,90,'x (m)')+label(508,90,'v (m/s)')+label(345,245,'t (s)')+label(755,245,'t (s)');
svg+='<line x1="'+x0+'" y1="'+y0+'" x2="'+tx+'" y2="'+xy+'" stroke="#8ce4dd" stroke-width="5"/><circle cx="'+tx+'" cy="'+xy+'" r="8" fill="#ffd183"/>';
svg+='<line x1="490" y1="'+vy+'" x2="790" y2="'+vy+'" stroke="#f79bbf" stroke-width="5"/><circle cx="'+(490+s.time*15)+'" cy="'+vy+'" r="8" fill="#ffd183"/>';
return {scene:svg,result:'v = '+fmt(s.velocity)+' m/s · t = '+fmt(s.time)+' s · Konum x = '+fmt(x)+' m (başlangıç x₀ = 0 m)',note:'Düzgün doğrusal harekette hız (ve yön) sabittir. Başlangıç konumu sıfır seçildiğinde x = v·t olur. Konum–zaman grafiğinin eğimi işaretli hızı verir; hız–zaman grafiği yatay doğrudur. Hız–zaman grafiğindeki işaretli alan yer değiştirmeyi gösterir. Negatif hız batıya hareket ve azalan konum anlamına gelir; sürat ise |v| büyüklüğüdür. İvme burada sıfırdır.'};
}
function draw(){const out=s.tab==='journey'?journey():uniform();el('scene').innerHTML=out.scene;el('result').textContent=out.result;el('note').textContent=out.note;}
function render(){el('tabs').innerHTML=tabs.map(([id,title])=>'<button type="button" data-tab="'+id+'" aria-pressed="'+(id===s.tab)+'">'+title+'</button>').join('');
el('controls').innerHTML=names[s.tab].map(k=>{const [name,min,max,step]=controls[k];return '<label>'+name+': <strong id="'+k+'-out">'+fmt(s[k])+'</strong><input type="range" data-key="'+k+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[k]+'"></label>';}).join('');draw();}
el('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(!t)return;const next=t.dataset.tab;if(!tabs.some(([id])=>id===next))return;s.tab=next;render();});
el('controls').addEventListener('input',e=>{const k=e.target.dataset.key;if(!names[s.tab].includes(k))return;const v=Number(e.target.value),[name,min,max]=controls[k];if(!Number.isFinite(v))return;s[k]=Math.max(min,Math.min(max,v));el(k+'-out').textContent=fmt(s[k]);draw();});
render();
})(document);