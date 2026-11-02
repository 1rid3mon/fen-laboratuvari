# AYT Fizik · İki Boyutta Hareket (2018 MEB)

**Kazanımlar:** 11.1.5.1 Atış hareketlerini yatay ve düşey boyutta analiz eder; 11.1.5.2 İki boyutta sabit ivmeli hareket ile ilgili hesaplamalar yapar.

**Bu yıl için kullanılan program:** 2018 MEB Fizik öğretim programı. Türkiye Yüzyılı Maarif Modeli bu laboratuvarın kapsamı değildir.

## Deneyler

1. **Yatay atış:** yatay hız sabit, düşey başlangıç hızı sıfır; yüksekliğe göre düşme süresi ve menzil.
2. **Eğik atış:** ilk hızın sinüs/kosinüs bileşenleri; tepe yüksekliği, uçuş süresi, menzil.
3. **Hız bileşenleri:** vₓ ve vᵧ okları, yerçekimi vektörü, toplam sürat.
4. **Açı–menzil karşılaştırması:** θ ile 90°−θ, **yalnız aynı fırlatma ve iniş yüksekliğinde** eşit menzil.
5. **Hedef vurma:** hız, açı ve başlangıç yüksekliği değiştirerek sabit hedefin konumuna ulaşma.
6. **Dört grafik:** x(t), y(t), vₓ(t), vᵧ(t) aynı zaman parametresinden hesaplanır.
7. **20 özgün AYT sorusu** ve açıklamalı değerlendirme.

**Varsayımlar:** hava direnci ihmal edilir; x sağa, y yukarı pozitiftir; aₓ=0, aᵧ=−g; y=0 yer düzlemidir. Çarpma süresi ve zemin tepkisi hesaplanmaz; cisim y=0'da durdurulur ve çarpma sürati ayrıca raporlanır. Yatay ve düşey hareket bağımsızdır ancak zamanları aynıdır. Kısa menzil formülü yalnız fırlatma ve iniş yükseklikleri eşitse kullanılır. Grafikler ve çizim saf `atis-math.js` motorunu paylaşır.

**Mobil:** sürgü kaydırırken kontroller yeniden oluşturulmaz; animasyon yalnız Oynat düğmesiyle başlar; arka planda durur. iPad Safari üzerinde gerçek manuel test henüz yapılmadı.

**Test:** `node --test labs/hareket.test.cjs labs/ivmeli.test.cjs labs/atis.test.cjs`

**MEB kaynak:** https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf

**OGM uygulama örneği:** https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/beceri_temelli/11/fizik/files/basic-html/page65.html
