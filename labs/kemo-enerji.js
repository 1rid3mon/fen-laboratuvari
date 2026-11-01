/*
 * AYT Kemosentez — beş aerobik örnek, enerji ve karbon kaynağı ayrımı.
 * MEB 2018 12.2.3.1: Kemosentez, örnek canlılar ve madde döngüleri.
 * Oksijen her kemoototrof için evrensel zorunluluk değildir.
 */
(function (w) {
  'use strict';
  const E=w.EnerjiLab;
  if(!E)return;
  const keys=['nitrit','nitrat','kukurt','demir','hidrojen'];
  const organisms={
    nitrit:{
      name:'Nitrit bakterisi (Nitrosomonas örneği)',mol:'NH3',formula:'NH₃ / NH₄⁺',
      product:'NO₂⁻ (nitrit)',habitat:'Toprak ve su',
      note:'Amonyak oksitlenir, nitrit oluşur. Nitrifikasyonun birinci basamağıdır.'
    },
    nitrat:{
      name:'Nitrat bakterisi (Nitrobacter örneği)',mol:'NO2',formula:'NO₂⁻',
      product:'NO₃⁻ (nitrat)',habitat:'Toprak ve su',
      note:'Nitrit oksitlenir, nitrat oluşur. Nitrifikasyonun ikinci basamağıdır.'
    },
    kukurt:{
      name:'Kükürt oksitleyen kemosentetik bakteri',mol:'H2S',formula:'H₂S',
      product:'S veya SO₄²⁻',habitat:'Kükürtlü sular ve hidrotermal bacalar',
      note:'H₂S oksitlenerek enerji sağlanır; oluşan kükürtlü ürün koşullara bağlıdır.'
    },
    demir:{
      name:'Demir oksitleyen kemosentetik bakteri',mol:'FE2',formula:'Fe²⁺',
      product:'Fe³⁺',habitat:'Demirce zengin sular',
      note:'Fe²⁺ iyonu Fe³⁺ iyonuna oksitlenebilir.'
    },
    hidrojen:{
      name:'Hidrojen oksitleyen kemosentetik bakteri',mol:'H2',formula:'H₂',
      product:'H₂O',habitat:'Toprak ve bazı kaynak suları',
      note:'Moleküler hidrojen oksitlenerek kimyasal enerji elde edilebilir.'
    }
  };
  function org(s){return organisms[s.org];}
  function finished(s){return s.step===3;}
  function allFinished(s){return s.visited.length===keys.length;}

  E.registerExperiment('exp6',{
    title:'Kemosentezde enerji kaynağını seç',
    subtitle:'İnorganik madde oksidasyonu, O₂ ve CO₂ ayrımını beş canlıda dene.',
    group:'KEMOSENTEZ • ENERJİ / KARBON',

    createState:function(){
      return {org:'nitrit',light:'dark',step:0,oxidations:0,food:0,visited:[]};
    },

    render:function(s,U){
      const o=org(s);
      return {
        step:Math.min(s.step+1,3),steps:3,
        scene:'<h3>'+U.esc(o.name)+'</h3>'
          +'<p class="summaryline">Habitat: '+U.esc(o.habitat)+' • Ortam: '+(s.light==='dark'?'karanlık':'aydınlık')
          +'. Bu örnekte kimyasal enerji kaynağı ışık değil, inorganik maddenin oksidasyonudur.</p>'
          +'<div class="scene-grid">'
          +U.zone('energy','1. Enerji kaynağı','Bu canlı için doğru inorganik madde: '+U.esc(o.formula),s.step>=1,s.step===0)
          +U.zone('oxidizer','2. Oksitleyici','Seçilen aerobik örnekte O₂ kullanılır',s.step>=2,s.step===1)
          +U.zone('carbon','3. Karbon kaynağı','Organik maddenin karbonu CO₂’den gelir',s.step>=3,s.step===2)
          +'</div>'
          +'<p class="math">'+U.esc(o.formula)+' —(oksidasyon)→ '+U.esc(o.product)+' + kullanılabilir enerji (şematik)</p>'
          +'<p class="summaryline">'+U.esc(o.note)+'</p>'
          +U.progress(s.step/3*100)
          +'<p class="summaryline">'+s.visited.length+' / 5 farklı kemosentetik canlı tamamlandı. '+(allFinished(s)?'✓ Beşinin tümü tamamlandı.':'Tamamlanınca “Sonraki adım” ile diğer canlıya geç.')+'</p>',
        molecules:['NH3','NO2','H2S','FE2','H2','O2','CO2','LIGHT'],
        controls:[
          {id:'organism',label:'Kemosentetik canlı',type:'select',value:s.org,options:keys.map(function(k){return U.option(k,organisms[k].name);})},
          {id:'light',label:'Ortam aydınlık mı?',type:'buttons',value:s.light,options:[U.option('dark','Karanlık'),U.option('light','Aydınlık')]}
        ],
        metrics:[
          {label:'Toplam oksidasyon deneyi',value:s.oxidations,note:'Tek tepkime tekrar sayılmaz'},
          {label:'Organik besin sentezi olayları',value:s.food,note:'Glikoz molekülü adedi değildir'},
          {label:'Bu canlıda enerji kaynağı',value:o.formula},
          {label:'Karbon kaynağı',value:'CO₂'},
          {label:'Tamamlanan farklı canlı',value:s.visited.length+' / 5'}
        ],
        guidance:allFinished(s)&&finished(s)
          ?'Beş canlı tamamlandı. Deneyi sıfırlayıp yeniden başlayabilirsin.'
          :s.step===3?'Bu canlı tamamlandı. Sonraki adıma basıp diğerine geç.'
            :s.step===0?'İnorganik enerji kaynağını birinci yuvaya yerleştir: '+o.formula
              :s.step===1?'O₂’yi ikinci yuvaya yerleştir.':'CO₂’yi üçüncü yuvaya yerleştir.',
        insight:'MEB 2018 12.2.3.1: Kemosentez, bazı prokaryotların inorganik maddeleri oksitleyerek elde ettiği enerjiyle CO₂’den organik madde sentezlemesidir. Bu deneyde yalnızca O₂ kullanan örnekler vardır; tüm kemoototrofların oksijene mecbur olduğu sonucunu çıkarma. Kemosentez ışık olmadan gerçekleşebilir, fakat uygun kimyasal substrat ve koşullar gerekir.'
      };
    },

    interact:function(s,zone,mol,U){
      if(finished(s))return {message:'Bu canlının deneyi tamamlandı. Sonraki adıma geç.',complete:allFinished(s)};
      const o=org(s);
      const expected=[['energy',o.mol],['oxidizer','O2'],['carbon','CO2']];
      const [target,correctMol]=expected[s.step];
      if(!mol)return {message:'Sıradaki molekül '+(U.names[correctMol]||correctMol)+'; uygun bölgeye bırak.',level:'info'};
      if(mol==='LIGHT')return {message:'Kemosentezde ışık kimyasal enerji kaynağı değildir.',level:'error'};
      if(zone!==target||mol!==correctMol){
        if(mol==='CO2'&&zone==='energy')return {message:'CO₂ enerji değil, karbon kaynağıdır; üçüncü yuvada kullanılır.',level:'error'};
        return {message:'Sıradaki doğru eşleştirme: '+(U.names[correctMol]||correctMol)+' → '+target+'. Önce enerji kaynağı, sonra O₂, en son CO₂.',level:'error'};
      }
      s.step++;
      if(s.step===2)s.oxidations++;
      if(s.step===3){
        s.food++;
        if(!s.visited.includes(s.org))s.visited.push(s.org);
      }
      return {
        ok:true,
        message:s.step===1
          ?'Doğru inorganik enerji kaynağı seçildi. Şimdi O₂.'
          :s.step===2?'Oksidasyon gerçekleşti ve kimyasal enerji elde edildi. Şimdi CO₂.'
          :'Doğru: CO₂ organik besinin karbon kaynağıdır. Bu canlı tamamlandı.',
        complete:allFinished(s)&&finished(s)
      };
    },

    next:function(s,U){
      if(finished(s)){
        if(allFinished(s))return {message:'Beş farklı canlı tamamlandı.',complete:true};
        const nextId=keys.find(function(id){return !s.visited.includes(id);});
        s.org=nextId;s.step=0;
        return {ok:true,message:'Yeni canlı: '+org(s).name+'. Yeni inorganik enerji kaynağını bul.'};
      }
      const o=org(s),targets=[['energy',o.mol],['oxidizer','O2'],['carbon','CO2']];
      return this.interact(s,targets[s.step][0],targets[s.step][1],U);
    },

    change:function(s,id,v){
      if(id==='organism'){
        if(!Object.prototype.hasOwnProperty.call(organisms,v))return {message:'Geçersiz canlı.',level:'error'};
        s.org=v;s.step=0;
        return {message:'Canlı değişti. Yeni kaynak ve oksidasyon yolu seç.',level:'info'};
      }
      if(id==='light'&&(v==='dark'||v==='light'))s.light=v;
      return {message:'Işık kemosentezde doğrudan enerji kaynağı değildir; diğer koşullar yeterliyse karanlıkta da mümkündür.',level:'info'};
    }
  });
})(window);