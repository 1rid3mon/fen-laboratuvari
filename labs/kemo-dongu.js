(function(w){'use strict';var E=w.EnerjiLab;if(!E)return;
/* Three separate experiments in this module: CO2 source, nitrification, ecosystems. */
var U=E.U;
/* Oxygenic and anoxygenic photosynthesis versus aerobic chemoautotrophy.
   This is an exam-relevant distinction in MEB 2018 OGM 12th-grade material. */
var subjects={
 photo:{
  name:'🌿 Yeşil bitki (oksijenli fotosentez)',energy:'LIGHT',carbon:'CO2',donor:'H2O',
  oxygen:'O₂ açığa çıkar',product:'O₂',note:'Işık enerji kaynağıdır; su elektron/hidrojen kaynağıdır. Ökaryotlarda fotosentez kloroplastta gerçekleşir.'
 },
 cyan:{
  name:'🦠 Siyanobakteri (oksijenli fotosentez)',energy:'LIGHT',carbon:'CO2',donor:'H2O',
  oxygen:'O₂ açığa çıkar',product:'O₂',note:'Siyanobakteriler prokaryottur; kloroplastları yoktur. Fotosentezde su kullanıldığı için oksijen açığa çıkabilir.'
 },
 purple:{
  name:'🟣 Mor kükürt bakterisi (oksijensiz fotosentez)',energy:'LIGHT',carbon:'CO2',donor:'H2S',
  oxygen:'O₂ açığa çıkmaz',product:'Kükürt (S)',note:'Bu canlı H₂S’yi ışık enerjisi kaynağı olarak değil, elektron/hidrojen kaynağı olarak kullanır. O₂ yerine kükürt oluşabilir.'
 },
 chemo:{
  name:'🦠 Aerobik kükürt oksitleyen kemoototrof',energy:'H2S',carbon:'CO2',donor:'H2S',
  oxygen:'Seçilen aerobik örnekte O₂ kullanılır',product:'S / SO₄²⁻',
  note:'Kemosentetik bakteri H₂S’yi oksitleyerek enerji kazanır. Işık gerekmez; karbon kaynağı yine CO₂’dir.'
 }
};
var subjectOrder=['photo','cyan','purple','chemo'];
function subject(s){return subjects[s.mode];}
function exp7Done(s){return !!(s.slots.energy&&s.slots.carbon&&s.slots.donor);}

E.registerExperiment('exp7',{
 title:'Fotosentez mi, kemosentez mi?',
 subtitle:'Bitki, siyanobakteri, mor kükürt bakterisi ve kemoototrofu karşılaştır.',
 group:'FOTOSENTEZ ↔ KEMOSENTEZ',
 createState:function(){return {mode:'photo',slots:{},visited:[]};},

 render:function(s,u){
  var c=subject(s),count=Number(!!s.slots.energy)+Number(!!s.slots.carbon)+Number(!!s.slots.donor);
  return {
   step:Math.min(count+1,3),steps:3,
   scene:'<h3>'+u.esc(c.name)+'</h3>'
    +'<p class="summaryline">Üç kavramı ayır: <strong>enerji kaynağı</strong>, <strong>organik maddenin karbon kaynağı</strong> ve <strong>elektron/hidrojen kaynağı</strong>.</p>'
    +'<div class="scene-grid">'
    +u.zone('energy','⚡ Enerji kaynağı',s.slots.energy?(u.names[c.energy]||c.energy):'Enerjiyi veren ışık mı kimyasal oksidasyon mu?',!!s.slots.energy,!s.slots.energy)
    +u.zone('carbon','🌱 Karbon kaynağı',s.slots.carbon?'CO₂ ✓':'Organik karbon nereden gelir?',!!s.slots.carbon,!s.slots.carbon)
    +u.zone('donor','💧 Elektron/hidrojen kaynağı',s.slots.donor?(u.names[c.donor]||c.donor):'Su mu, H₂S mi?',!!s.slots.donor,!s.slots.donor)
    +'</div>'+u.progress(count/3*100)
    +u.card('Oksijen ve yan ürün',u.esc(c.oxygen)+'; örnek ürün: '+u.esc(c.product))
    +'<p class="summaryline">'+u.esc(c.note)+'</p>'
    +'<p class="fine">'+s.visited.length+'/4 canlı türü doğru karşılaştırıldı.</p>',
   molecules:['LIGHT','CO2','H2O','H2S','O2','NH3'],
   controls:[{id:'mode',label:'Karşılaştırılan üretici',type:'buttons',value:s.mode,options:[
    u.option('photo','Yeşil bitki'),
    u.option('cyan','Siyanobakteri'),
    u.option('purple','Mor kükürt bakterisi'),
    u.option('chemo','Kemosentetik kükürt bakterisi')
   ]}],
   metrics:[
    {label:'Enerji kaynağı',value:c.energy==='LIGHT'?'Işık':'H₂S oksidasyonu'},
    {label:'Karbon kaynağı',value:'CO₂'},
    {label:'Elektron / hidrojen kaynağı',value:u.names[c.donor]||c.donor},
    {label:'Oksijen',value:c.oxygen},
    {label:'Karşılaştırılan canlı sayısı',value:s.visited.length+' / 4'}
   ],
   guidance:count===3?'Bu canlı tamamlandı. Sonraki adımla başka üretici seç.':!s.slots.energy?'Önce enerji kaynağını eşleştir.':!s.slots.carbon?'Şimdi CO₂’yi karbon kaynağına bırak.':'Elektron/hidrojen kaynağını eşleştir.',
   insight:'YKS: Bitki ve siyanobakteri H₂O kullandığı için oksijenli fotosentez yapabilir. Mor kükürt bakterisinde ışık enerjisi kullanılır ama H₂S elektron kaynağı olabilir; O₂ oluşmaz. Kemosentetik kükürt bakterisi H₂S’yi oksitleyerek enerji sağlar. Karbon kaynağı bu ototrof örneklerin hepsinde CO₂’dir.'
  };
 },

 interact:function(s,zone,mol,u){
  var c=subject(s),expected={energy:c.energy,carbon:c.carbon,donor:c.donor};
  if(!Object.prototype.hasOwnProperty.call(expected,zone))return {message:'Enerji, karbon veya elektron kaynağı yuvası seç.',level:'info'};
  if(!mol)return {message:'Bu yuvada hangi molekül gerekir?',level:'info'};
  if(mol!==expected[zone]){
   return {message:mol==='H2S'&&s.mode==='purple'&&zone==='energy'
     ?'Mor kükürt bakterisinde enerji ışıkla sağlanır; H₂S ise elektron/hidrojen kaynağıdır.'
     :'Enerji, karbon ve elektron kaynağını birbirinden ayır. Yanlış eşleştirme.',level:'error'};
  }
  if(s.slots[zone])return {message:'Bu bölge zaten doğru eşleştirildi.',level:'info'};
  s.slots[zone]=true;
  if(exp7Done(s)&&!s.visited.includes(s.mode))s.visited.push(s.mode);
  return {ok:true,message:exp7Done(s)?c.name+' için üç kaynak doğru eşleştirildi.':(u.names[mol]||mol)+' doğru yerde.',
    complete:s.visited.length===4&&exp7Done(s)};
 },

 next:function(s,u){
  if(exp7Done(s)){
   if(s.visited.length===4)return {message:'Dört farklı üreticinin karşılaştırması tamamlandı.',complete:true};
   s.mode=subjectOrder.find(function(k){return !s.visited.includes(k);});
   s.slots={};
   return {ok:true,message:'Sonraki üretici: '+subject(s).name};
  }
  var c=subject(s),fields=['energy','carbon','donor'];
  var zone=fields.find(function(k){return !s.slots[k];});
  return this.interact(s,zone,c[zone],u);
 },

 change:function(s,id,val){
  if(id==='mode'&&Object.prototype.hasOwnProperty.call(subjects,val)){
   s.mode=val;s.slots={};
  }
  return {message:'Yeni canlı seçildi. Enerji, karbon ve elektron kaynaklarını eşleştir.',level:'info'};
 }
});
var nitroSteps=[{mol:'NH3',zone:'nitrit',name:'Nitrit bakterisi',product:'NO₂⁻',text:'Amonyak oksitlenir; nitrit oluşur.'},{mol:'NO2',zone:'nitrat',name:'Nitrat bakterisi',product:'NO₃⁻',text:'Nitrit oksitlenir; nitrat oluşur.'},{mol:'NO3',zone:'plant',name:'Bitki',product:'Organik azotlu bileşikler',text:'Bitkiler nitratı alabilir ve azotlu organik bileşikleri oluşturur. Bu basamak kemosentez değildir.'}];
E.registerExperiment('exp8',{title:'Azot döngüsü ve nitrifikasyon',subtitle:'NH₃ → NO₂⁻ → NO₃⁻; nitrit ve nitrat bakterilerinin sırası.',group:'KEMOSENTEZ • MADDE DÖNGÜSÜ',createState:function(){return {step:0};},
render:function(s,u){var st=nitroSteps[Math.min(2,s.step)];return {step:Math.min(s.step+1,3),steps:3,scene:'<h3>Azot döngüsünde sırayı kur</h3><p class="math">NH₃ / NH₄⁺ → NO₂⁻ → NO₃⁻ → bitkide organik azotlu bileşikler</p><div class="scene-grid">'+u.zone('nitrit','1. Nitrit bakterisi','Amonyağı oksitleyerek nitrit oluşturur.',s.step>0,s.step===0)+u.zone('nitrat','2. Nitrat bakterisi','Nitriti oksitleyerek nitrat oluşturur.',s.step>1,s.step===1)+u.zone('plant','3. Bitki kökü','Topraktaki nitratı alır; kemosentez yapmaz.',s.step>2,s.step===2)+'</div>'+u.progress(s.step/3*100)+'<p class="summaryline">'+(s.step===3?'✓ Nitrifikasyon ve bitki alımı ayrımı tamamlandı.':u.esc(st.text))+'</p>',molecules:['NH3','NO2','NO3','CO2','O2'],controls:[],metrics:[{label:'Sıra',value:s.step+' / 3'},{label:'1. oksidasyon',value:'NH₃ → NO₂⁻'},{label:'2. oksidasyon',value:'NO₂⁻ → NO₃⁻'},{label:'Bitkinin aldığı azot',value:'NO₃⁻ / NH₄⁺',note:'Bitki azotu organik bileşiklerde kullanabilir'}],guidance:s.step===3?'Tamamlandı; sıfırlayabilirsin.':(u.names[st.mol]||st.mol)+' → '+st.name,insight:'Nitrifikasyon: amonyağın nitrite, nitritin nitrata oksitlenmesi. Bu dönüşümler azot döngüsüne katkı sağlar. Bitkinin nitrat alması kemosentez değildir. Nitrifikasyon aerobik ortamda gerçekleşir. Atık su arıtımında nitrifikasyon amonyumu nitrata dönüştürür; azotun sudan uzaklaştırılması için sonraki denitrifikasyon gibi süreçler gerekebilir.'};},
interact:function(s,zone,mol){if(s.step===3)return {message:'Döngü basamakları tamamlandı.',complete:true};var st=nitroSteps[s.step];if(!mol)return {message:'Buraya hangi azotlu madde girmeli?',level:'info'};if(zone!==st.zone||mol!==st.mol)return {message:'Sıra veya madde yanlış. Önce NH₃ → NO₂⁻, sonra NO₂⁻ → NO₃⁻.',level:'error'};s.step++;return {ok:true,message:st.name+': '+st.text,complete:s.step===3};},
next:function(s,u){if(s.step>=3)return {message:'Bitti.',complete:true};var st=nitroSteps[s.step];return this.interact(s,st.zone,st.mol,u);}
});
function viable(s){return s.oxygen==='yes'&&s.carbon==='yes'&&s.substrate===(s.site==='vent'?'H2S':'NH3');}
var industrialNotes={
water:'Atık su arıtımında nitrifikasyon bakterileri amonyumu önce nitrite, ardından nitrata dönüştürür. Bu, azot gideriminin tek başına tamamlandığı anlamına gelmez: denitrifikasyon gibi sonraki basamaklar gerekebilir.',
mining:'Biyomadencilikte bazı demir/kükürt oksitleyen mikroorganizmaların tepkimeleri metallerin cevherden çözünmesine katkı sağlar. Kullanılan türler ve çevre koşulları önemlidir.',
nature:'Derin deniz hidrotermal bacaları yakınında bazı kemosentetik üreticiler besin ağının temelini oluşturur; güneş ışığı zorunlu değildir.'
};
E.registerExperiment('exp9',{title:'Kemosentetik ekosistem',subtitle:'Işık olmadan üretim mümkün mü? Kontrollü bir çevre deneyi.',group:'KEMOSENTEZ • EKOSİSTEM',createState:function(){return {site:'vent',oxygen:'yes',carbon:'yes',substrate:'H2S',light:'dark',trials:0,last:null,industry:'water'};},
render:function(s,u){var ok=viable(s);return {step:1,steps:1,scene:'<h3>'+(s.site==='vent'?'🌊 Hidrotermal baca modeli':'🌱 Toprak bakterisi modeli')+'</h3><p class="summaryline">Bu simülasyonda <strong>oksijen kullanan bir kemoototrof örnek</strong> inceleniyor. Karbondioksit ve uygun inorganik madde sağlanırsa ışık gerekmeksizin üretim olabilir.</p><div class="scene-grid">'+u.card('Ortam koşulları','Işık: '+(s.light==='dark'?'Yok':'Var')+' • O₂: '+(s.oxygen==='yes'?'Var':'Yok')+' • CO₂: '+(s.carbon==='yes'?'Var':'Yok'))+u.zone('test','🔬 Deneyi çalıştır','Model koşullarını değerlendir ve gözlemi kaydet.',false,true)+'</div><p class="math">Bu seçilmiş aerobik örnekte: uygun substrat + O₂ → kimyasal enerji; CO₂ → organik besin</p><p class="summaryline">'+(s.last===null?'Henüz deney yapılmadı.':s.last?'✓ Koşullar uygun: kemosentetik üretim mümkün.':'✕ Eksik/yanlış madde nedeniyle bu modelde üretim yok.')+'</p>'+u.card('🏭 Endüstri ve ekosistem örneği',u.esc(industrialNotes[s.industry]||industrialNotes.water)),molecules:['BACT','H2S','NH3','CO2','LIGHT'],controls:[{id:'site',label:'Canlı ve habitat',type:'buttons',value:s.site,options:[u.option('vent','Kükürt bakterisi'),u.option('soil','Nitrit bakterisi')]},{id:'substrate',label:'İnorganik enerji kaynağı',type:'select',value:s.substrate,options:[u.option('H2S','H₂S'),u.option('NH3','NH₃'),u.option('NO2','NO₂⁻')]},{id:'oxygen',label:'O₂ bulunuyor mu?',type:'buttons',value:s.oxygen,options:[u.option('yes','Var'),u.option('no','Yok')]},{id:'carbon',label:'CO₂ bulunuyor mu?',type:'buttons',value:s.carbon,options:[u.option('yes','Var'),u.option('no','Yok')]},{id:'light',label:'Işık',type:'buttons',value:s.light,options:[u.option('dark','Karanlık'),u.option('light','Aydınlık')]},{id:'industry',label:'Kemosentezin kullanım ve ekosistem örnekleri',type:'select',value:s.industry,options:[u.option('water','Atık su arıtımında nitrifikasyon'),u.option('mining','Biyomadencilikte oksidasyon'),u.option('nature','Derin denizde üretici canlılar')]}],metrics:[{label:'Deney sayısı',value:s.trials},{label:'Uygun inorganik substrat',value:s.site==='vent'?'H₂S':'NH₃'},{label:'Son gözlem',value:s.last===null?'Bekleniyor':s.last?'Üretim mümkün':'Üretim yok'},{label:'Işığa bağımlılık',value:'Yok',note:'Kimyasal enerji kullanılıyor'}],guidance:'Işığı açıp kapat. Ardından O₂, CO₂ ve enerji kaynağını değiştirip deney çalıştır.',insight:'Derin deniz bacalarında kemosentetik üreticiler besin ağının temelini oluşturabilir. Bu bir aerobik örnek modelidir: anaerobik kemoototroflar da bulunur. MEB 2018: Kemosentezin madde döngülerine katkısı ve endüstriyel kullanım örnekleri bilinmelidir. Nitrifikasyonla denitrifikasyon farklı süreçlerdir. Model “her koşulda sürekli kemosentez olur” anlamına gelmez.'};},
interact:function(s,zone,mol){if(zone!=='test')return {message:'Deney alanına dokun.'};if(mol&&mol!=='BACT')return {message:'Simülasyonu çalıştırmak için alana dokun veya bakteri kartını bırak.',level:'info'};s.trials++;s.last=viable(s);return {ok:true,message:s.last?'Kimyasal enerji kaynağı, O₂ ve CO₂ uygun. Işık olmasa bile kemosentez mümkün.':'Bu seçilmiş aerobik modelde uygun enerji substratı, O₂ veya CO₂ eksik.',level:s.last?'success':'warning'};},
next:function(s,u){s.light=s.light==='dark'?'light':'dark';return this.interact(s,'test',null,u);},
change:function(s,id,v){if(id==='industry'){if(industrialNotes[v])s.industry=v;return {message:'Kemosentezin kullanım örneği değiştirildi.',level:'info'};}if(id==='site'){s.site=v;s.substrate=v==='vent'?'H2S':'NH3';}else if(['oxygen','carbon','substrate','light'].includes(id))s[id]=v;s.last=null;return {message:'Deney koşulları değişti. Yeniden ölçerek sonucu karşılaştır.',level:'info'};}
});
})(window);