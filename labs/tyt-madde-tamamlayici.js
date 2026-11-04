(function(document){
'use strict';
const el=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:3});
const s={tab:'volume',shape:1,a:2,b:3,c:4,r:2,mixture:1,amount:2,example:1};
const tabs=[['volume','Dört cismin hacmi'],['mixture','Karışımları yorumla'],['examples','Günlük yaşamda özkütle']];
const shapes=['','Küp','Dikdörtgenler prizması','Silindir','Küre'];
const configs={a:['Kenar / en a (cm)',1,6,0.5],b:['Boy b (cm)',1,6,0.5],c:['Yükseklik / derinlik h (cm)',1,6,0.5],r:['Yarıçap r (cm)',1,5,0.5],amount:['Tuz ya da yağ miktarı (göreli düzey)',0,4,1]};
const choiceSets={volume:['Küp','Dikdörtgenler prizması','Silindir','Küre'],mixture:['Suda çözünen tuz','Su ve yağ'],examples:['Kuyumculuk','Porselen yapımı','Ebru sanatı']};
const stateKeys={volume:'shape',mixture:'mixture',examples:'example'};
const rect=(x,y,w,h,color)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+color+'"/>';
const label=(x,y,value,size=20)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="#e9f7fa" font-family="system-ui">'+value+'</text>';
function selectedInputs(){
if(s.tab==='mixture')return ['amount'];
if(s.tab!=='volume')return [];
return s.shape===1?['a']:s.shape===2?['a','b','c']:s.shape===3?['r','c']:['r'];
}
function volume(){
const {a,b,c,r}=s;
if(s.shape===1)return {value:a*a*a,formula:'a³ = '+fmt(a)+'³',description:'Bir kenarı a olan küp.'};
if(s.shape===2)return {value:a*b*c,formula:'a × b × h = '+fmt(a)+' × '+fmt(b)+' × '+fmt(c),description:'Üç boyutu ayrı ölçülen dikdörtgenler prizması.'};
if(s.shape===3)return {value:Math.PI*r*r*c,formula:'πr²h = π × '+fmt(r)+'² × '+fmt(c),description:'Tabanı daire olan dik silindir.'};
return {value:4*Math.PI*r*r*r/3,formula:'4πr³/3 = 4π × '+fmt(r)+'³ / 3',description:'Yarıçapı r olan küre.'};
}
function drawVolume(){
const v=volume(); let scene=rect(0,0,850,350,'#0a2738');
scene+=label(55,60,shapes[s.shape],27);
if(s.shape===1){const z=s.a*26,x=365,y=270-z;scene+=rect(x,y,z,z,'#7abed5')+'<polygon points="'+x+','+y+' '+(x+30)+','+(y-25)+' '+(x+z+30)+','+(y-25)+' '+(x+z)+','+y+'" fill="#b0e4e8"/>'+'<polygon points="'+(x+z)+','+y+' '+(x+z+30)+','+(y-25)+' '+(x+z+30)+','+(y+z-25)+' '+(x+z)+','+(y+z)+'" fill="#397c9a"/>'+label(x,300,'a = '+fmt(s.a)+' cm');}
else if(s.shape===2){const w=s.a*25,h=s.b*24,d=s.c*11,x=300,y=285-h;scene+=rect(x,y,w,h,'#73c9d2')+'<polygon points="'+x+','+y+' '+(x+d)+','+(y-d*0.6)+' '+(x+w+d)+','+(y-d*0.6)+' '+(x+w)+','+y+'" fill="#a3e1d9"/>'+'<polygon points="'+(x+w)+','+y+' '+(x+w+d)+','+(y-d*0.6)+' '+(x+w+d)+','+(y+h-d*0.6)+' '+(x+w)+','+(y+h)+'" fill="#417e9f"/>'+label(260,322,'a = '+fmt(s.a)+'  b = '+fmt(s.b)+'  h = '+fmt(s.c)+' cm');}
else if(s.shape===3){const rx=s.r*26,h=s.c*31,x=430,y=285-h;scene+=rect(x-rx,y,rx*2,h,'#49a8ce')+'<ellipse cx="'+x+'" cy="'+(y+h)+'" rx="'+rx+'" ry="18" fill="#376c8e"/>'+'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="18" fill="#8ee1df"/>'+label(315,320,'r = '+fmt(s.r)+' cm; h = '+fmt(s.c)+' cm');}
else{const rr=s.r*28;scene+='<circle cx="430" cy="180" r="'+rr+'" fill="#60b3d2" stroke="#b2f0ec" stroke-width="3"/>'+'<ellipse cx="430" cy="180" rx="'+rr+'" ry="'+(rr*0.28)+'" fill="none" stroke="#a9e6ed" stroke-dasharray="6 6"/>'+'<line x1="430" y1="180" x2="'+(430+rr)+'" y2="180" stroke="#ffe09b" stroke-width="4"/>'+label(480,190,'r = '+fmt(s.r)+' cm');}
return {scene,result:shapes[s.shape]+' · V = '+v.formula+' = '+fmt(v.value)+' cm³',note:v.description+' Boyutlar cm olarak seçilir, sonuç cm³ çıkar. π ile yapılan sonuç yaklaşık yazılır. Görsel bir 2B çizimdir; matematiksel hacim hesabı ve seçilen ölçüler esastır. Bu sahne kırılma veya kütle deneyi değildir.'};
}
function drawMixture(){
let scene=rect(0,0,850,350,'#0a2738')+rect(260,105,330,210,'none')+'<rect x="300" y="100" width="250" height="220" rx="12" fill="none" stroke="#cce7ed" stroke-width="5"/>';
if(s.mixture===1){const shade=['#4cabc8','#4ca8c6','#48a2c3','#4496bc','#3f8ab3'][s.amount];scene+=rect(305,135,240,180,shade);for(let i=0;i<s.amount*6;i++){const x=330+(i%6)*36,y=165+Math.floor(i/6)*32;scene+='<circle cx="'+x+'" cy="'+y+'" r="4" fill="#e7daac"/>';}scene+=label(325,72,'Homojen çözelti (şematik)',23);return {scene,result:s.amount===0?'Başlangıç: yalnız su':'Tuz çözündükçe özkütle genellikle artar (nitel yorum)',note:'Bu model suda tamamen çözünebilen tuz miktarları içindir. Kütle artarken hacim de değişebilir; karışan hacimleri doğrudan toplayarak özkütle hesaplanmaz. Doygunluk, sıcaklık ve kesin yoğunluk değerleri modellenmez. MEB 9.2.1.1(e): karışım özkütlesiyle ilgili matematiksel hesaplama yapılmaz.'};}
const oilH=s.amount*35;
scene+=rect(305,135,240,180,'#348cb0');
if(oilH)scene+=rect(305,135,240,oilH,'#ebc57a');
scene+=label(330,72,'Karışmayan sıvılar (şematik)',23)+label(600,173,'Üst: yağ')+label(600,290,'Alt: su');
return {scene,result:s.amount===0?'Yalnız su': 'Su ve yağ: özkütlesi daha küçük olan yağ üstte kalır',note:'Burada yağın ve suyun birbirine karışmadığı, kapta beklediği ve yağın özkütlesinin sudan düşük olduğu varsayılır. İki farklı tabaka oluşur; tek bir homojen sıvı gibi özkütle grafiği çıkarılmaz. Çizim oranları göreli gösterir, gerçek bir yağın yoğunluğunu vermez. Karışımlar için sayısal özkütle hesabına girilmez.'};
}
function drawExamples(){
let title='',result='',note='';
if(s.example===1){title='Kuyumculuk';result='Özkütle, metal ve alaşımların incelenmesinde yardımcı bir özelliktir.';note='Bir parçanın kütlesi ve hacmi ölçülerek saf bir metalle karşılaştırma yapılabilir. Ancak özkütle tek başına bir takının gerçek, saf veya değerli olduğunu kesin kanıtlamaz.';}
else if(s.example===2){title='Porselen yapımı';result='Porselen üretiminde özkütle, malzeme yapısı ve üretim kontrolüyle ilişkilidir.';note='Malzemenin bileşimi ve iç boşlukları özkütleyi etkileyebilir. Burada bir fırınlama veya fiziksel mukavemet simülasyonu yapılmaz.';}
else {title='Ebru yapımı';result='Ebruda boyaların sıvı üzerindeki davranışını özkütle de etkileyebilir.';note='Ebru desenlerinin oluşumu yalnız özkütleyle açıklanamaz: yüzey gerilimi, boya bileşimi ve kitrenin kıvamı da etkilidir. Her boya otomatik olarak su üstünde aynı biçimde durmaz.';}
const scene=rect(0,0,850,350,'#0a2738')+label(80,90,title,32)+rect(110,140,630,125,'#24506b')+label(140,190,'2018 MEB 9.2.1.2',26)+label(140,230,'Günlük yaşamda özkütle',24);
return {scene,result:title+' · '+result,note};
}
function draw(){const item=s.tab==='volume'?drawVolume():s.tab==='mixture'?drawMixture():drawExamples();el('scene').innerHTML=item.scene;el('result').textContent=item.result;el('note').textContent=item.note;}
function render(){
el('tabs').innerHTML=tabs.map(([key,name])=>'<button type="button" data-tab="'+key+'" aria-pressed="'+(s.tab===key)+'">'+name+'</button>').join('');
const choices=choiceSets[s.tab],key=stateKeys[s.tab];
el('controls').innerHTML='<div role="group" aria-label="Karşılaştırılacak örnek">'+choices.map((v,i)=>'<button type="button" data-choice="'+(i+1)+'" aria-pressed="'+(s[key]===i+1)+'">'+v+'</button>').join('')+'</div>'+
selectedInputs().map(k=>{const [name,min,max,step]=configs[k];return '<label>'+name+': <strong id="'+k+'-out">'+fmt(s[k])+'</strong><input type="range" data-key="'+k+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[k]+'"></label>'}).join('');
draw();
}
el('tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(!t)return;const next=t.getAttribute('data-tab');if(!tabs.some(([id])=>id===next))return;s.tab=next;render();});
el('controls').addEventListener('click',e=>{const btn=e.target.closest('[data-choice]');if(!btn)return;const key=stateKeys[s.tab],choice=Number(btn.getAttribute('data-choice'));if(!Number.isInteger(choice)||choice<1||choice>choiceSets[s.tab].length)return;s[key]=choice;render();});
el('controls').addEventListener('input',e=>{const k=e.target.dataset.key;if(!selectedInputs().includes(k))return;const [name,min,max]=configs[k],v=Number(e.target.value);if(!Number.isFinite(v))return;s[k]=Math.min(max,Math.max(min,v));el(k+'-out').textContent=fmt(s[k]);draw();});
render();
})(document);
