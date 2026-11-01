/*
 * AYT Fotosentez hızı — kontrollü deney ve sera ışıklandırması.
 * Veriler gerçek ölçüm değil: grafik öğretim amaçlı analitik bir modeldir.
 */
(function(w){
  'use strict';
  const E=w.EnerjiLab;
  if(!E)return;
  const colorEffect={white:1,blue:.98,red:.94,green:.24};
  const colorOrder=['white','blue','green','red'];
  const colorNames={white:'Beyaz',blue:'Mor-mavi',green:'Yeşil',red:'Kırmızı'};
  const axis={
    light:{min:0,max:100,step:5,label:'Işık şiddeti',unit:'bağıl'},
    co2:{min:50,max:1000,step:50,label:'CO₂ derişimi',unit:'ppm'},
    temp:{min:0,max:55,step:1,label:'Sıcaklık',unit:'°C'},
    pigment:{min:10,max:100,step:5,label:'Klorofil miktarı',unit:'bağıl'},
    color:{min:1,max:4,step:1,label:'Işığın rengi',unit:'renk kodu'}
  };
  const factors=['light','co2','temp','pigment','color'];

  function components(s){
    return {
      light:s.light/(s.light+32),
      co2:s.co2/(s.co2+230),
      temperature:Math.exp(-Math.pow((s.temp-28)/15,2)/2),
      pigment:s.pigment/100,
      color:colorEffect[s.color]||.24
    };
  }
  function rate(s){
    const c=components(s);
    return Math.max(0,Math.min(100,100*c.light*c.co2*c.temperature*c.pigment*c.color*1.65));
  }
  function value(s,k){return k==='color'?(colorNames[s.color]||s.color):s[k]+(axis[k]?' '+axis[k].unit:'');}
  function observations(s,U){
    if(!s.records.length)return '<p class="summaryline">Henüz ölçüm yapılmadı. Önce başlangıç ölçümü, sonra sadece tek değişkeni değiştirerek yeni ölçüm yap.</p>';
    return '<div class="scene-grid">'+s.records.slice(-4).reverse().map(function(r){
      return U.card(r.good?'✓ Kontrollü karşılaştırma':r.initial?'Başlangıç ölçümü':'⚠ Kontrolsüz karşılaştırma',
        U.esc(r.variable)+' = '+U.esc(r.x)+'; bağıl model hızı = '+U.esc(r.y)+'/100. '+U.esc(r.note));
    }).join('')+'</div>';
  }

  E.registerExperiment('exp4',{
    title:'Fotosentez hızı ve kontrollü deney',
    subtitle:'Bağımsız/bağımlı değişkenleri ayır, ölçüm kaydet ve ışıklandırmayı yorumla.',
    group:'FOTOSENTEZ • HIZ',

    createState:function(){
      return {light:50,co2:400,temp:28,pigment:85,color:'white',scan:'light',records:[],trialChanges:[]};
    },

    render:function(s,U){
      const c=components(s),r=rate(s),a=axis[s.scan]||axis.light;
      const points=[];
      for(let x=a.min;x<=a.max+0.0001;x+=(a.max-a.min)/32){
        const copy=Object.assign({},s);
        if(s.scan==='color')copy.color=colorOrder[Math.max(0,Math.min(3,Math.round(x)-1))];
        else copy[s.scan]=x;
        points.push([x,rate(copy)]);
      }
      points.push([a.max,rate(Object.assign({},s,s.scan==='color'?{color:'red'}:{[s.scan]:a.max}))]);
      points.sort(function(x,y){return x[0]-y[0];});
      const limiting=[
        ['Işık',c.light],['CO₂',c.co2],['Sıcaklık',c.temperature],
        ['Klorofil',c.pigment],['Işık rengi',c.color]
      ].sort(function(x,y){return x[1]-y[1];})[0][0];

      return {
        step:1,steps:1,
        scene:'<h3>Bilimsel yöntem: bir değişkeni değiştir</h3>'
          +'<p class="summaryline"><strong>Bağımsız değişken:</strong> '+U.esc(a.label)
          +'. <strong>Bağımlı değişken:</strong> fotosentez hızı. <strong>Kontrol edilenler:</strong> grafikteki diğer ortam değişkenleri.</p>'
          +U.plot([{label:'Bağıl hız (temsili model)',color:'#59e3b6',points:points}],a.min,a.max,a.label+' ('+a.unit+') → bağıl fotosentez hızı',s.scan==='color'?colorOrder.indexOf(s.color)+1:s[s.scan])
          +(s.scan==='color'?'<p class="fine">Renk kodları: 1 Beyaz • 2 Mor-mavi • 3 Yeşil • 4 Kırmızı. Sadece renk farklı olsun; şiddet ve diğer değişkenler aynı kalmalı.</p>':'')
          +'<div class="scene-grid">'
          +U.zone('measure','🔬 Ölçümü kaydet','Bir ölçüm kaydet, seçili bağımsız değişkeni değiştir ve yeni ölçümle karşılaştır.',false,true)
          +U.card('Serada yapay ışıklandırma','LED aydınlatmada ışık şiddeti, rengi ve süre ayarlanabilir. Daha fazla ışık her koşulda daha fazla ürün anlamına gelmez; diğer sınırlayıcı etmenler ve enerji maliyeti de değerlendirilir.')
          +'</div>'
          +'<h3>Deney gözlemleri</h3>'+observations(s,U),
        molecules:[],
        controls:[
          {id:'scan',label:'Grafikte değiştirilen bağımsız değişken',type:'select',value:s.scan,options:[
            U.option('light','Işık şiddeti'),U.option('co2','CO₂'),U.option('temp','Sıcaklık'),U.option('pigment','Klorofil miktarı'),U.option('color','Işık rengi')
          ]},
          {id:'light',label:'Işık şiddeti',type:'range',min:0,max:100,step:5,value:s.light,unit:'bağıl'},
          {id:'co2',label:'CO₂ derişimi',type:'range',min:50,max:1000,step:50,value:s.co2,unit:'ppm'},
          {id:'temp',label:'Sıcaklık',type:'range',min:0,max:55,step:1,value:s.temp,unit:'°C'},
          {id:'pigment',label:'Klorofil miktarı',type:'range',min:10,max:100,step:5,value:s.pigment,unit:'bağıl'},
          {id:'color',label:'Işığın rengi (dalga boyu)',type:'select',value:s.color,options:[
            U.option('white','Beyaz (karışık)'),U.option('blue','Mor-mavi'),U.option('red','Kırmızı'),U.option('green','Yeşil')
          ]}
        ],
        metrics:[
          {label:'Modelin bağıl hızı',value:Math.round(r)+' / 100',note:'Deneysel ölçüm birimi değildir'},
          {label:'Kaydedilen ölçümler',value:s.records.length},
          {label:'Bu modelde en düşük göreli katsayı',value:limiting,note:'Evrensel sınırlayıcı etmen değildir'},
          {label:'Bağımsız değişken',value:a.label,note:'Diğerleri sabit tutulmalı'}
        ],
        guidance:'Önce başlangıç ölçümünü kaydet. Sonra sadece grafikte seçtiğin tek değişkeni değiştirip yeniden ölç. İki değişkeni değiştirirsen uyarı alırsın.',
        insight:'2018 MEB 12.2.2.3: Işık şiddeti, dalga boyu, sıcaklık, klorofil miktarı ve CO₂ yoğunluğu fotosentez hızını etkiler. Kontrollü deneyde bağımsız/bağımlı/kontrol edilen değişkenleri ayır. Sera LED ışıklandırması uygulamalarını araştır. Grafik matematiksel eğitim modelidir; burada 28°C örnek optimumdur ve bütün bitkiler için geçerli değildir.'
      };
    },

    interact:function(s,zone,mol,U){
      if(zone!=='measure')return {message:'Ölçümü kaydet alanını seç.',level:'info'};
      if(mol)return {message:'Ölçüm yapmak için molekül seçimine gerek yok; seçimi kaldırıp ölçüm alanına dokun.',level:'info'};
      const old=s.records.length?s.records[s.records.length-1]:null;
      const changes=old?factors.filter(function(k){return old.settings[k]!==s[k];}):[];
      const good=!old||(changes.length===1&&changes[0]===s.scan);
      const note=!old?'İlk kontrol ölçümü.':good?'Yalnız seçilen değişken değişti.':changes.length===0?'Koşullar aynı; karşılaştırma yapılmadı.':'Birden fazla veya yanlış değişken değişti: kontrollü deney değil.';
      s.records.push({
        variable:axis[s.scan].label,
        x:value(s,s.scan),
        y:Math.round(rate(s)),
        initial:!old,
        good:good,
        note:note,
        settings:{light:s.light,co2:s.co2,temp:s.temp,pigment:s.pigment,color:s.color}
      });
      if(s.records.length>12)s.records.shift();
      s.trialChanges=[];
      return {ok:true,level:good?'success':'warning',message:'Ölçüm #'+s.records.length+': '+note};
    },

    next:function(s,U){
      const a=axis[s.scan]||axis.light;
      if(s.scan==='color'){
        const i=colorOrder.indexOf(s.color);
        s.color=colorOrder[(i+1)%colorOrder.length];
        return {ok:true,message:'Işığın rengi: '+colorNames[s.color]+'. Diğer koşulları sabit tutup ölçüm kaydet.'};
      }
      const v=s[s.scan],next=v+a.step>a.max?a.min:v+a.step;
      this.change(s,s.scan,String(next),U);
      return {ok:true,message:a.label+' = '+next+' '+a.unit+'. Diğer koşulları değiştirmeden ölçüm kaydet.'};
    },

    change:function(s,id,v){
      if(id==='scan'&&axis[v]){
        s.scan=v;
        return {message:'Yeni bağımsız değişken: '+axis[v].label+'. Kontrollü karşılaştırma için ilk ölçümü kaydet.'};
      }
      if(id==='color'&&Object.prototype.hasOwnProperty.call(colorEffect,v))s.color=v;
      else if(Object.prototype.hasOwnProperty.call(axis,id)){
        const a=axis[id],n=Number(v);
        if(Number.isFinite(n))s[id]=Math.max(a.min,Math.min(a.max,n));
      }
      return {message:'Koşul güncellendi. Bağımlı değişken olan bağıl hız grafiği yeniden hesaplandı.',level:'info'};
    }
  });
})(window);