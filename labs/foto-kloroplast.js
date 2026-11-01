/*
 * AYT Fotosentez: Kloroplast şeması, fotosentezin önemi ve bilim insanları.
 * 2018 MEB: 12.2.2.1 ve 12.2.2.2
 */
(function (w) {
  'use strict';
  const E=w.EnerjiLab;
  if (!E) return;
  const placements={LIGHT:'tilakoit',H2O:'tilakoit',CO2:'stroma',ATP:'stroma',NADPH:'stroma'};
  const order=['LIGHT','H2O','CO2','ATP','NADPH'];
  const scientists={
    vanhelmont:{
      name:'Jan Baptist van Helmont',
      text:'Söğüt fidanının büyümesini toprak ve su miktarlarıyla karşılaştırdı. Bitki kütlesindeki artışı açıklama çabası fotosentez tarihinin bir adımıydı; bu deney tek başına bitkilerin yalnızca sudan kütle kazandığını kanıtlamaz.'
    },
    priestley:{
      name:'Joseph Priestley',
      text:'Yeşil bitkilerin havanın özelliklerini değiştirdiğine ilişkin kapalı kap deneyleriyle fotosentez araştırmalarına katkı sundu. Oksijenin rolü sonraki araştırmalarla açıklığa kavuştu.'
    },
    ingenhousz:{
      name:'Jan Ingenhousz',
      text:'Bitkilerin yeşil kısımlarının ışık altında oksijen çıkışıyla ilişkisini gösterdi. Işığın fotosentez açısından neden önemli olduğunun anlaşılmasına katkı sağladı.'
    },
    engelmann:{
      name:'Theodor Engelmann',
      text:'Algleri farklı dalga boylarında aydınlattı; oksijen bulunan yerlere yönelen aerob bakterilerin dağılımını gözledi. Böylece ışığın rengi ile fotosentez etkinliği ilişkilendirildi.'
    },
    calvin:{
      name:'Melvin Calvin',
      text:'Karbonun fotosentez sırasında organik maddelere nasıl katıldığını araştırdı. Işıktan bağımsız tepkimelerin anlaşılmasına katkı sağladı; ara basamakların ezberi bu laboratuvarın hedefi değildir.'
    }
  };

  E.registerExperiment('exp1',{
    title:'Kloroplast ve fotosentezin önemi',
    subtitle:'Tilakoit/stroma eşleştirmesi ve fotosentez tarihindeki bilim insanları.',
    group:'FOTOSENTEZ • YAPI VE ÖNEM',
    createState:function(){return {items:{},labels:'on',scientist:'ingenhousz'};},
    render:function(s,U){
      const n=Object.keys(s.items).length;
      const showLabels=s.labels==='on';
      const scientist=scientists[s.scientist]||scientists.ingenhousz;
      let svg='<svg class="diagram" viewBox="0 0 680 310" role="img" aria-label="Kloroplast çift zarı, stroma, granum ve tilakoit yığınları"><defs><linearGradient id="chlbg"><stop stop-color="#1c7d60"/><stop offset="1" stop-color="#0b3b3b"/></linearGradient></defs><ellipse cx="340" cy="153" rx="310" ry="131" fill="#0e392f" stroke="#61d99f" stroke-width="8"/><ellipse cx="340" cy="153" rx="291" ry="114" fill="url(#chlbg)" stroke="#b8f7ad" stroke-width="3"/>';
      [150,245,340,435,530].forEach(function(x){
        [100,116,132,148,164,180].forEach(function(y){
          svg+='<rect x="'+(x-27)+'" y="'+y+'" width="62" height="12" rx="6" fill="#2faa7b" stroke="#85f0b9" stroke-width="1.5"/>';
        });
      });
      svg+='<path d="M185,155 C235,208 275,206 330,160 M365,170 C410,215 465,207 505,160" stroke="#61eab8" stroke-width="8" fill="none" opacity=".6"/>';
      if(showLabels){
        svg+='<g fill="#e9fff6" font-size="13" font-weight="700"><text x="340" y="37" text-anchor="middle">Dış ve iç zar</text><text x="340" y="273" text-anchor="middle">Stroma (sıvı bölüm)</text><text x="155" y="218" text-anchor="middle">Grana = tilakoit yığınları</text><text x="475" y="75" text-anchor="middle">Tilakoit</text></g>';
      }
      svg+='</svg>';
      return {
        step:Math.min(n+1,5),steps:5,
        scene:'<h3>Fotosentez nerede ve neden gerçekleşir?</h3>'
          +'<p class="summaryline">Fotosentez, ışık enerjisinin organik maddelerin kimyasal bağlarında depolanmasını sağlar. Üreticiler besin ağlarının temelini oluşturur; oksijenli fotosentez atmosfere O₂ katkısı sağlar.</p>'
          +svg
          +'<div class="scene-grid">'
          +U.zone('tilakoit','☀️ Tilakoit zarı','Işığın soğurulması, suyun fotolizi; ATP ve NADPH sentezi',!!(s.items.LIGHT&&s.items.H2O),n<2)
          +U.zone('stroma','🌿 Stroma','CO₂ bağlanır; ATP ve NADPH burada kullanılır',!!(s.items.CO2&&s.items.ATP&&s.items.NADPH),n>=2)
          +'</div>'
          +U.progress(n/5*100)
          +'<p class="summaryline">'+n+'/5 molekül doğru bölgeyle ilişkilendirildi.</p>'
          +U.card('🔬 '+U.esc(scientist.name),U.esc(scientist.text)),
        molecules:order,
        controls:[
          {id:'labels',label:'Şemadaki açıklamalar',type:'buttons',value:s.labels,options:[U.option('on','Göster'),U.option('off','Gizle')]},
          {id:'scientist',label:'Fotosentez tarihinden bir araştırmacı',type:'select',value:s.scientist,options:[
            U.option('vanhelmont','Van Helmont'),U.option('priestley','Priestley'),U.option('ingenhousz','Ingenhousz'),U.option('engelmann','Engelmann'),U.option('calvin','Calvin')
          ]}
        ],
        metrics:[
          {label:'Doğru yerleştirme',value:n+' / 5'},
          {label:'Işığa bağımlı evre',value:'Tilakoit',note:'Su kullanılır; O₂, ATP, NADPH oluşur'},
          {label:'Işıktan bağımsız evre',value:'Stroma',note:'CO₂ ve ATP/NADPH kullanılır'}
        ],
        guidance:'Işık ve H₂O → tilakoit; CO₂, ATP ve NADPH → stroma. Bilim insanı seçerek buluşların önemini oku.',
        insight:'2018 MEB kazanımı 12.2.2.1: Fotosentezin canlılar açısından önemini ve bilimsel gelişimini açıkla. 12.2.2.2: Kloroplastı şema üzerinde yorumla, suyun fotolizini ve iki evrenin giren/çıkan maddelerini karşılaştır. Klorofil a/b kimyasal yapısı, CAM/C4 ve ayrıntılı reaksiyon basamakları gerekmez.'
      };
    },
    interact:function(s,zone,mol,U){
      if(!mol)return {message:zone==='tilakoit'?'Tilakoit zarı: ışık, su ve ürün oluşumu.':'Stroma: CO₂ bağlanır, ATP ve NADPH kullanılır.',level:'info'};
      if(!Object.prototype.hasOwnProperty.call(placements,mol))return {message:'Bu etkinliğin molekül havuzundan seçim yap.',level:'warning'};
      if(placements[mol]!==zone)return {message:(U.names[mol]||mol)+' için doğru bölge: '+(placements[mol]==='tilakoit'?'tilakoit zarı':'stroma')+'.',level:'error'};
      if(s.items[mol])return {message:'Bu molekül zaten eşleştirildi.',level:'info'};
      s.items[mol]=true;
      return {ok:true,message:'Doğru: '+(U.names[mol]||mol)+' → '+(zone==='stroma'?'stroma':'tilakoit')+'.',complete:Object.keys(s.items).length===5};
    },
    next:function(s,U){
      const mol=order.find(function(m){return !s.items[m];});
      return mol?this.interact(s,placements[mol],mol,U):{message:'Beş molekül yerleştirildi.',complete:true};
    },
    change:function(s,id,value){
      if(id==='labels')s.labels=value;
      if(id==='scientist'&&scientists[value])s.scientist=value;
      return {message:'Şema / bilim insanı bilgisi yenilendi.',level:'info'};
    }
  });
})(window);