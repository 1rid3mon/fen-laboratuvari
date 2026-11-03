/* Live electrostatic experiments, no misleading field-line animation. */
(function(w){'use strict';
const M=w.ElektrikAlanMath,U=w.MekanikUI;if(!M||!U)return;
const f=(v,d=2)=>U.U.fmt(v,d),c=(id,label,min,max,step,unit)=>({id,label,min,max,step,unit});
const q=(id,label)=>c(id,label,-8,8,1,'nC'),coord=(id,label)=>c(id,label,-6,6,.5,'cm');
const cx=x=>400+x*42,cy=y=>178-y*23;
const particle=(x,y,charge,label)=>'<circle cx="'+cx(x)+'" cy="'+cy(y)+'" r="17" fill="'+(charge>=0?'#bd5e58':'#487cb5')+'" stroke="#f1e5d2" stroke-width="2"/>'+U.U.text(cx(x)-7,cy(y)+6,charge>0?'+':charge<0?'−':'0','#fff',20)+U.U.text(cx(x)+22,cy(y)-20,label,'#cde4f2',14);
const point=(x,y)=>'<circle cx="'+cx(x)+'" cy="'+cy(y)+'" r="7" fill="#e8d29b" stroke="#fff"/>';
function arrows(charges){
 let s='';for(let x=-6;x<=6;x+=2)for(let y=-6;y<=6;y+=2){
 const e=M.field(charges,x,y);if(!e.valid||e.mag<1e-10)continue;
 const len=13,dx=e.x/e.mag*len,dy=-e.y/e.mag*len;
 s+=U.U.arrow(cx(x),cy(y),dx,dy,'#547e91','');
 }
 return s;
}
const grid=()=>{let s='';for(let x=-6;x<=6;x+=2)s+=U.U.line(cx(x),37,cx(x),322,'#21374b',1);
 for(let y=-6;y<=6;y+=2)s+=U.U.line(130,cy(y),670,cy(y),'#21374b',1);
 return s+U.U.line(130,cy(0),670,cy(0),'#8aa5b4',2)+U.U.line(cx(0),37,cx(0),322,'#8aa5b4',2);
};
function scene(charges,probe,vector){
 let s=grid()+arrows(charges);
 for(let i=0;i<charges.length;i++){const p=charges[i];s+=particle(p.x,p.y,p.q,'q'+(i+1));}
 if(probe){s+=point(probe.x,probe.y);if(vector?.valid&&vector.mag>0){
 const len=65,dx=vector.x/vector.mag*len,dy=-vector.y/vector.mag*len;
 s+=U.U.arrow(cx(probe.x),cy(probe.y),dx,dy,'#f8d486','E');
 }}
 return U.U.svg(s,'Yükler, örneklenmiş elektrik alan yön okları ve ölçüm noktası');
}
const desc=e=>e.valid?'Alan büyüklüğü '+f(e.mag)+' N/C; yönü +x ekseninden '+f(e.angle)+'°. Elektrik alan pozitif deneme yükünün kuvvet yönüdür.':e.reason;
const fields=p=>[{q:p.q1,x:p.x1,y:p.y1},{q:p.q2,x:p.x2,y:p.y2}];
const controls=[q('q1','Birinci yük'),coord('x1','Birinci yük x'),coord('y1','Birinci yük y'),q('q2','İkinci yük'),coord('x2','İkinci yük x'),coord('y2','İkinci yük y'),coord('px','Ölçüm noktası x'),coord('py','Ölçüm noktası y')];
const defaults={q1:4,x1:-3,y1:0,q2:-4,x2:3,y2:0,px:0,py:2};
const sections=[
{id:'single',tab:'Tek yükün alanı',title:'Elektrik alanı hangi yük oluşturur?',
intro:'Yükün işaretini ve uzaklığı değiştir. Alanın yönünün yük işaretine bağlı olduğunu gözlemle.',
defaults:{q1:4,x1:0,y1:0,px:3,py:0},
controls:[q('q1','Kaynak yük'),coord('x1','Kaynak x'),coord('y1','Kaynak y'),coord('px','Ölçüm x'),coord('py','Ölçüm y')],
model:p=>M.field([{q:p.q1,x:p.x1,y:p.y1}],p.px,p.py),
scene:(p,e)=>scene([{q:p.q1,x:p.x1,y:p.y1}],{x:p.px,y:p.py},e),
interpret:(p,e)=>desc(e),
formula:()=> 'E = k·|q|/r² (büyüklük)\nPozitif yükten dışarı, negatif yüke doğru.',
metrics:(p,e)=>[['Alan büyüklüğü',e.valid?f(e.mag)+' N/C':'Tanımsız'],['Alan yönü',e.valid?f(e.angle)+'°':'—']],
note:'Noktasal yük; hava/vakum kabulü. Yükün tam bulunduğu noktada alan tanımsızdır. Görsel oklar yalnız yön örnekleridir, alan çizgileri değildir.'},
{id:'superposition',tab:'Bileşke alan',title:'İki yükün elektrik alanını topla',
intro:'İki kaynağı sürgülerle değiştir. Alanlar vektörel toplanır; toplam alanın yönünü gör.',
defaults:{...defaults},
controls,model:p=>M.field(fields(p),p.px,p.py),
scene:(p,e)=>scene(fields(p),{x:p.px,y:p.py},e),
interpret:(p,e)=>desc(e)+' Bir yükü ters işaretli yapınca yalnız o yükün alan vektörü ters döner.',
formula:()=> 'E_toplam = E₁ + E₂ (vektörel)\nHer yükün katkısı kendi işaretine ve uzaklığına bağlıdır.',
metrics:(p,e)=>[['Eₓ',e.valid?f(e.x)+' N/C':'—'],['Eᵧ',e.valid?f(e.y)+' N/C':'—'],['|E|',e.valid?f(e.mag)+' N/C':'Tanımsız']],
note:'İki noktasal kaynak; alanlar yalnız tanımlı noktalarda hesaplanır. Alan oklarının uzunluğu çizimde normalize edilmiştir.'},
{id:'coulomb',tab:'Coulomb kuvveti',title:'Deneme yükünün işaretini ters çevir',
intro:'Aynı elektrik alan içinde pozitif ve negatif deneme yüklerinin neden zıt yönlerde kuvvet gördüğünü incele.',
defaults:{q1:5,x1:-2,y1:0,qt:2,px:2,py:0},
controls:[q('q1','Kaynak yük'),coord('x1','Kaynak x'),coord('y1','Kaynak y'),q('qt','Deneme yükü'),coord('px','Deneme x'),coord('py','Deneme y')],
model:p=>M.force(p.qt,[{q:p.q1,x:p.x1,y:p.y1}],p.px,p.py),
scene:(p,o)=>{const E=M.field([{q:p.q1,x:p.x1,y:p.y1}],p.px,p.py);let s=grid()+arrows([{q:p.q1,x:p.x1,y:p.y1}])+particle(p.x1,p.y1,p.q1,'kaynak')+particle(p.px,p.py,p.qt,'deneme');if(o.valid&&o.mag>0)s+=U.U.arrow(cx(p.px),cy(p.py),o.x/o.mag*80,-o.y/o.mag*80,'#f9ce85','F');return U.U.svg(s,'Coulomb kuvvetinin yönü');},
interpret:(p,o)=>o.valid?'Kuvvet '+f(o.mag)+' N. '+(p.qt*p.q1>0?'Aynı işaretler iter.':p.qt*p.q1<0?'Zıt işaretler çeker.':'Yüklerden biri sıfırsa kuvvet sıfırdır.'):'Yükler çakıştı: noktasal yük modeli burada tanımsız.',
formula:()=> 'F = k·|q₁q₂|/r²\nF_deneme = q_deneme·E (işaret yönü belirler).',
metrics:(p,o)=>[['Kuvvet',o.valid?f(o.mag,5)+' N':'Tanımsız'],['Kuvvet yönü',o.valid?f(o.angle)+'°':'—'],['Elektrik alan',o.valid?f(o.field.mag)+' N/C':'—']],
note:'Noktasal ve durağan yükler, hava/vakum kabulü. Kuvvet N, alan N/C. Yük çakışmasında bölme sıfıra yapılmaz.'},
{id:'potential',tab:'Potansiyel',title:'Potansiyel skaler toplanır',
intro:'İki yükün oluşturduğu potansiyeli ölç; sıfır potansiyel ile sıfır elektrik alanın aynı şey olmadığını keşfet.',
defaults:{...defaults},
controls,model:p=>({E:M.field(fields(p),p.px,p.py),V:M.potential(fields(p),p.px,p.py)}),
scene:(p,o)=>scene(fields(p),{x:p.px,y:p.py},o.E),
interpret:(p,o)=>o.V.valid?'V = '+f(o.V.value)+' V. '+(Math.abs(o.V.value)<1e-8?'Potansiyel sıfır olsa bile alan sıfır olmak zorunda değildir.':'Potansiyel, kaynak yüklerin işaretli skaler katkılarının toplamıdır.'):'Noktasal yük konumunda potansiyel tanımsız.',
formula:()=> 'V = Σ(kq/r) (işaretli, skaler)\nE = Σ Eᵢ (vektörel)\nV = 0 ⇏ E = 0.',
metrics:(p,o)=>[['Potansiyel',o.V.valid?f(o.V.value)+' V':'Tanımsız'],['Elektrik alan',o.E.valid?f(o.E.mag)+' N/C':'Tanımsız']],
note:'Potansiyel sıfırı sonsuzdadır. Alan ve potansiyel farklı niceliklerdir; çizilen oklar alan yönü gösterir.'},
{id:'uniform',tab:'Düzgün alan',title:'Düzgün alanda kuvvet, iş ve potansiyel',
intro:'Elektrik alanın büyüklüğünü, deneme yükünü ve yer değiştirmeyi değiştir.',
defaults:{q:2,ex:300,ey:0,dx:3,dy:0},
controls:[q('q','Deneme yükü'),c('ex','Alan Eₓ',-500,500,50,'N/C'),c('ey','Alan Eᵧ',-500,500,50,'N/C'),coord('dx','Yer değiştirme Δx'),coord('dy','Yer değiştirme Δy')],
model:p=>M.uniform(p.q,p.ex,p.ey,p.dx,p.dy),
scene:(p,o)=>{let s=grid();for(let x=150;x<=650;x+=100)for(let y=80;y<=280;y+=65){if(o.field.mag>0)s+=U.U.arrow(x,y,o.field.x/o.field.mag*32,-o.field.y/o.field.mag*32,'#67d9ca','');}s+=U.U.arrow(400,180,p.dx*28,-p.dy*17,'#ffce85','Δr');return U.U.svg(s,'Düzgün elektrik alan ve yer değiştirme');},
interpret:(p,o)=>'Alan kaynakları bu deneyde belirtilmeyen, sabit yönlü ve büyüklüklü kabul edilir. ΔV = '+f(o.dV)+' V; alanın yaptığı iş '+f(o.workByField,7)+' J.',
formula:()=> 'ΔV = −E·Δr (skaler çarpım)\nW_alan = −qΔV\nΔU = qΔV.',
metrics:(p,o)=>[['Alan',f(o.field.mag)+' N/C'],['Kuvvet',f(o.force.mag,7)+' N'],['ΔV',f(o.dV)+' V'],['W_alan',f(o.workByField,7)+' J'],['ΔU',f(o.dU,7)+' J']],
note:'Düzgün ve zamandan bağımsız alan. Alanın yönü ile yükün kuvvet yönü negatif yükte farklıdır. Δx ve Δy cm cinsindendir.'},
{id:'compare',tab:'Alan mı, kuvvet mi?',title:'Elektrik alanı oluşturan yük ile deneme yükünü ayır',
intro:'Kaynak yük aynı kalırken deneme yükünü değiştir. Alan değişmez, deneme yükünün gördüğü kuvvet değişir.',
defaults:{source:4,probe:1,distance:3},
controls:[q('source','Kaynak yük'),q('probe','Deneme yükü'),c('distance','İki yük arası uzaklık',1,6,.5,'cm')],
model:p=>({E:M.field([{q:p.source,x:0,y:0}],p.distance,0),F:M.force(p.probe,[{q:p.source,x:0,y:0}],p.distance,0)}),
scene:(p,o)=>scene([{q:p.source,x:0,y:0}],{x:p.distance,y:0},o.E),
interpret:(p,o)=>'Kaynak yük '+f(p.source)+' nC iken elektrik alan '+f(o.E.mag)+' N/C. Deneme yükü '+f(p.probe)+' nC için kuvvet '+f(o.F.mag,6)+' N. Deneme yükünü değiştirince kaynak alanı aynı kalır.',
formula:()=> 'E = F/q_deneme (q ≠ 0)\nKaynak yükün alanı, deneme yükünden bağımsızdır.',
metrics:(p,o)=>[['Alan',f(o.E.mag)+' N/C'],['Kuvvet',f(o.F.mag,6)+' N'],['Kuvvet yönü',f(o.F.angle)+'°']],
note:'Kaynak yük sabit ve deneme yükü, kaynağın konumunu değiştirmeyecek kadar küçük kabul edilir. q=0 için F/q yazılmaz; kaynak alanı yine tanımlıdır.'},
{id:'equipotential',tab:'Eş potansiyel',title:'Eş potansiyel çizgiler ve alan yönü',intro:'Bir noktasal yükün çevresindeki eş potansiyel halkaları incele. Ölçüm noktasını sürgülerle değiştir.',defaults:{q1:4,x1:0,y1:0,px:3,py:0},controls:[q('q1','Kaynak yük'),coord('px','Ölçüm x'),coord('py','Ölçüm y')],model:p=>({E:M.field([{q:p.q1,x:0,y:0}],p.px,p.py),V:M.potential([{q:p.q1,x:0,y:0}],p.px,p.py)}),scene:(p,o)=>{let s=grid();for(const radius of [42,84,126])s+='<circle cx="400" cy="178" r="'+radius+'" stroke="#5e9cb2" stroke-width="2" stroke-dasharray="8 6" fill="none"/>';s+=particle(0,0,p.q1,'kaynak')+point(p.px,p.py);if(o.E.valid&&o.E.mag>0)s+=U.U.arrow(cx(p.px),cy(p.py),o.E.x/o.E.mag*45,-o.E.y/o.E.mag*45,'#ffd18a','E');return U.U.svg(s,'Noktasal yük çevresinde eş potansiyel çemberler ve alan yönü');},interpret:()=> 'Bir noktasal yükün eş potansiyel çizgileri eş merkezli çemberlerdir; elektrik alan bu çizgilere diktir. Aynı çizgi üzerinde potansiyel farkı ve elektriksel iş sıfırdır.',formula:()=> 'Eş potansiyel: ΔV = 0; W = −qΔV = 0.',metrics:(p,o)=>[['Potansiyel',o.V.valid?f(o.V.value)+' V':'Tanımsız'],['Alan',o.E.valid?f(o.E.mag)+' N/C':'Tanımsız']],note:'11.2.2: noktasal yük için 2B kesit; 3B eş potansiyel yüzeyler küreseldir. Halkalar sabit geometrik yarıçapı temsil eder.'},
{id:'potential-uses',tab:'Potansiyel ve hayat',title:'Elektriksel potansiyelin günlük kullanım alanları',intro:'Elektrostatik boya, yıldırımdan korunma ve elektrik alanla hızlandırma gibi örnekleri incele.',defaults:{mode:0},controls:[c('mode','0 boya / 1 ekran / 2 yıldırım',0,2,1,'')],model:p=>({name:['Elektrostatik boyama','Yüklü parçacık yönlendirme','Yıldırım ve potansiyel farkı'][p.mode]}),scene:(p,o)=>U.U.svg(U.U.text(75,80,o.name,'#8de0ce',26)+U.U.text(75,152,['Yüklü boya damlacıkları elektrik alanla yönlendirilir.','Elektrik alan yüklü parçacıkların hareketini etkiler.','Büyük potansiyel farkı havada elektrik boşalması oluşturabilir.'][p.mode],'#dcecf2',16),'Elektriksel potansiyelin kullanım alanları'),interpret:(p,o)=>o.name+' örneğinde elektriksel kuvvet ve potansiyel farkı önemlidir.',formula:()=> 'Potansiyel farkı, elektriksel enerji aktarımıyla ilişkilidir.',metrics:(p,o)=>[['Örnek',o.name]],note:'Günlük hayat örnekleri nitel olarak açıklanır; gerçek cihaz ve yıldırım güvenliği simülasyonu değildir.'}

];
w.ElektrikAlanLab=U.create({sections,questions:[]});
})(window);
