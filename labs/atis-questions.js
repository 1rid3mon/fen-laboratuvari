/* Original five-choice YKS-style review, 2018 MEB Physics 11.1.5.
   Answer indices are 0-based. Do not use third-party copyrighted exams. */
(function(root){
'use strict';
const questions=[
 {q:'80 m yüksekten 20 m/s yatay atılan cisim g=10 ise kaç saniye havada kalır?',cs:['2 s','3 s','4 s','5 s','8 s'],a:2,why:'t=√(2h/g)=√(160/10)=4 s. Yatay ilk hız uçuş süresini değiştirmez.'},
 {q:'Önceki 20 m/s yatay atışta 4 saniyede yatay uzaklık kaç metredir?',cs:['20 m','40 m','60 m','80 m','160 m'],a:3,why:'x=vₓt=20×4=80 m.'},
 {q:'Hava direnci olmayan yatay atışta aₓ ve aᵧ sırasıyla nedir? (+y yukarı)',cs:['g ve 0','0 ve −g','−g ve 0','g ve g','0 ve 0'],a:1,why:'Yatay net kuvvet sıfır olduğu için aₓ=0; düşeyde aᵧ=−g.'},
 {q:'45 m yükseklikten yatay 10 m/s ile atılan cismin menzili nedir? g=10',cs:['15 m','20 m','30 m','40 m','45 m'],a:2,why:'t=√(2×45/10)=3 s; x=10×3=30 m.'},
 {q:'Aynı ilk hızla, aynı seviyeden 30° ve 60° ile atılan cisimlerin menzilleri?',cs:['30° iki kat','60° iki kat','Eşittir','Kütleye bağlı','Daima sıfır'],a:2,why:'Aynı yükseklik koşulunda R=v₀²sin(2θ)/g ve sin60°=sin120°.'},
 {q:'İlk sürat aynı, yerden atılıp aynı seviyeye düşen eğik atışta en büyük menzil hangi açıda?',cs:['0°','30°','45°','60°','90°'],a:2,why:'sin(2θ) en büyük 1 değerine 2θ=90° yani θ=45° iken ulaşır.'},
 {q:'20 m/s hızla 30° eğik atışta vᵧ₀ kaçtır? sin30=0,5',cs:['5 m/s','10 m/s','15 m/s','17,3 m/s','20 m/s'],a:1,why:'vᵧ₀=v₀sinθ=20×0,5=10 m/s.'},
 {q:'20 m/s ile yerden 30° atışta g=10 için havada kalma süresi?',cs:['1 s','2 s','3 s','4 s','5 s'],a:1,why:'vᵧ₀=10; aynı seviyeye dönüş t=2×10/10=2 s.'},
 {q:'20 m/s, 30° yerden atış (g=10): En büyük yükselme yüksekliği?',cs:['2,5 m','5 m','10 m','15 m','20 m'],a:1,why:'H=vᵧ₀²/(2g)=100/20=5 m.'},
 {q:'20 m/s, 30° yerden atışta (g=10; sin60≈0,866) menzil yaklaşık?',cs:['20 m','28,3 m','34,6 m','40 m','80 m'],a:2,why:'R=400×sin60/10≈34,6 m.'},
 {q:'Tepe noktasında (hava direnci yok) hangi hız bileşeni sıfırdır?',cs:['Yatay bileşen vₓ','Düşey bileşen vᵧ','Toplam hız daima','Düşey ivme','İki bileşen birlikte'],a:1,why:'Tepe noktasında vᵧ=0; vₓ değişmez. Toplam hız çoğunlukla sıfır değildir.'},
 {q:'Atışın tepe noktasında ivmenin yönü nasıldır?',cs:['İvme sıfır','Yukarı g','Aşağı g','Yatay','Yörüngeye teğet'],a:2,why:'Tek kuvvet yerçekimidir; (aₓ,aᵧ)=(0,−g).'},
 {q:'Aynı v₀ ve açıyla başlangıç yüksekliği arttırılırsa (+vₓ), havada kalma ve menzil?',cs:['İkisi azalır','İkisi değişmez','İkisi artar','vₓ azalır','Yerçekimi azalır'],a:2,why:'Yere varış gecikir; yatay hız sabit pozitifken menzil büyür.'},
 {q:'20 m yüksekten yatay 10 m/s atılan cisim, g=10. Süre ve menzil?',cs:['1 s;10 m','2 s;20 m','2 s;40 m','4 s;20 m','4 s;40 m'],a:1,why:'t=√(40/10)=2 s; R=10×2=20 m.'},
 {q:'Yatay atışta uçuş boyunca vₓ nasıl değişir (hava direnci yok)?',cs:['Artar','Azalır','Sıfır olur','Sabit kalır','Önce artar'],a:3,why:'aₓ=0 olduğundan vₓ sabittir.'},
 {q:'25 m/s ile 37° (sin≈3/5, cos≈4/5) atışta vₓ ve vᵧ?',cs:['15;20','20;15','25;0','20;20','10;15'],a:1,why:'vₓ=25×4/5=20 m/s, vᵧ=25×3/5=15 m/s.'},
 {q:'Aynı yükseklikten bırakılan ve yatay fırlatılan cisimlerin düşey hareketleri (vᵧ₀=0)?',cs:['Fırlatılan daha hızlı düşer','Bırakılan önce düşer','Özdeştir','Kütleye bağlı','Yatay hız g’yi değiştirir'],a:2,why:'Düşey ilk hız ve ivme eşittir; hava direnci yokken düşey hareket aynıdır.'},
 {q:'Yüksekten eğik atışa R=v₀²sin(2θ)/g neden doğrudan uygulanamaz?',cs:['Yerçekimi yok','Yatay hız sabit değil','Atış/iniş yükseklikleri farklı','Hızın bileşeni yok','Açı tanımsız'],a:2,why:'Bu formül yalnız aynı atış ve iniş seviyesinde geçerlidir. Genel durumda y(t)=0 çözülür.'},
 {q:'Yerden 10 m/s ile 45° atılıp aynı seviyeye düşen cismin menzili? g=10',cs:['5 m','10 m','15 m','20 m','25 m'],a:1,why:'R=v₀²sin90°/g=100/10=10 m.'},
 {q:'Aynı atış-düşüş seviyesinde, açı sabitken ilk sürat iki katına çıkarılırsa menzil?',cs:['2 kat','3 kat','4 kat','6 kat','8 kat'],a:2,why:'R∝v₀²; ilk hız iki kat olduğunda menzil 4 kat olur.'}
];
root.AtisQuestions=Object.freeze(questions.map(q=>Object.freeze({...q,cs:Object.freeze(q.cs)})));
})(window);