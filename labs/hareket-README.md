# AYT Fizik 2018 — Vektörler, Bağıl Hareket ve Newton Laboratuvarları

## İçerik ve girişler
- /labs/vektorler-bagil-hareket.html: vektör bileşenleri ve 2B bileşke, hareketli gözlemci, karşılaşma/yetişme, akıntılı nehir, rüzgârlı uçak ve 13 özgün TYT/AYT hazırlık sorusu (AYT 2018 kazanımı).
- /labs/newton-hareket-yasalari.html: yatay net kuvvet ve F = ma, yatay statik/kinetik sürtünme, eğik düzlem bileşenleri, düşey duvarda sürtünme, asansör normal kuvveti, etki–tepki ve 13 özgün soru.

Bu sayfalar 2018 MEB **11. sınıf fizik ünitesi**nin şu kazanımlarına dayanır; mezun YKS adayı için AYT olarak kategorilenmiştir:
- 11.1.1.1–11.1.1.4: vektör özellikleri, bileşenler, vektörel bileşke, uç uca ve paralelkenar yöntemi, kosinüs.
- 11.1.2.1: sabit hızlı cisimlerin birbirine göre hareketi.
- 11.1.2.2: hareketli ortamdaki sabit hızlı cisimlerin farklı referans çerçeveleri.
- 11.1.2.3: bağıl hareket hesaplamaları ve günlük yaşam uygulamaları.
- 11.1.3.1: net kuvvet, serbest cisim diyagramı; yatay, düşey ve eğik düzlemde sürtünme.
- 11.1.3.2: net kuvvet etkisindeki cismin hareketi, sürtünmeli ve sürtünmesiz hesaplamalar.

**Kapsam dışı:** yeni Türkiye Yüzyılı Maarif Modeli, görelilik teorisi, dönen gözlemci ve Coriolis kuvveti, aşırı ayrıntılı diferansiyel hareket denklemleri, üç boyutlu birim vektör (i,j,k) cebiri.

## 1) Vektörler ve Bağıl Hareket
1. Vektör uçları tablet ve telefon ekranında sürüklenebilir; üç vektörün toplamı ve x/y bileşenleri; paralelkenar farkı.
2. 2B gözlemci A/B/Yer; seçili referansın hızı gerçekten çıkarılır, yalnız kamera yer değiştirilmez.
3. Sabit hızlı karşılaşma/yetişme; negatif buluşma zamanı = gelecekte kavuşmazlar.
4. Akıntılı nehir: suya göre hız + akıntı = yere göre hız; kıyıya dik hız bileşeninden süre; x yönündeki sapma; tam karşıya hedefleme açısı.
5. Rüzgârlı uçak: havaya göre hız + rüzgâr = yere göre hız; hem yan hem arka/ön rüzgâr; kuzey mesafesi/yer hızı.
6. 13 özgün soru, 5 seçenek, çözüm gerekçesi. Nehir ve uçakta 37°/53° için gerçek sin/cos veya 3–4–5 YKS yaklaşımı ayrı seçilebilir.

**İşaret ve açı konvansiyonu:** +x doğu/sağ, +y kuzey/karşı kıyı; yön açısı +x ekseninden ölçülür (kıyıya dik 90°). Uçakta km/h ve km kullanılır; nehirde m/s ve m kullanılır.
**Fiziksel sınır:** |akıntı| = kayık sürati ise teorik sıfır yatay sapmada karşıya doğru bileşen sıfırdır, dolayısıyla geçiş gerçekleşmez. Tam karşıya çıkmak için |akıntı| < kayık sürati.

## 2) Newton'un Hareket Yasaları
1. Net kuvvet: iki yatay dış kuvvet; durgun veya sabit hızlı başlangıç; Fnet = m a.
2. Yatay sürtünme: durgun blokta statik sürtünme gereken büyüklükte uyum sağlar; yalnız en büyük değer μs N; eşik aşılınca kayma ve μk N. Bu model cisim ilk anda **durgun** varsayımıyla çalışır.
3. Eğik düzlem: mg sinθ ve mg cosθ, normal, eğim boyunca uygulanan kuvvet ve sürtünmenin yönü, kayma veya statik denge.
4. Düşey duvar: blok duvara yatay kuvvetle bastırılır; N=Fbasma ve statik sürtünme mg kadar olabilir. Yetersiz basma kuvvetinde aşağı kayma başlar.
5. Asansör: a yukarı pozitif, N = m(g + a); sabit hızda N=mg.
6. Etki–tepki: aynı büyüklük, ters yön, **farklı cisimler**; kütleleri eşit olmasa kuvvetler eşittir.
7. 13 özgün AYT konusu sorusu.

**Fiziksel varsayımlar:** ideal rijit cisim, düzgün yatay/eğik yüzey, m>0, g>0, cismin ilk anda durgun olması; hava direnci yok. Tipik μk≤μs koşulu kullanıcı arayüzünde korunur. Net kuvvet hesabında diğer fiziksel kuvvetlerin gösterilmesi için ilgili FBD şeması kullanılır. Sabit hızlı hareketin ivmesi sıfırdır; kuvvet olmaması değil net kuvvetin sıfır olması gerekir.

## Teknik
Tümü statik HTML/CSS/JS, Firebase veya API anahtarı gerekmez. `hareket-math.js` fizik hesaplarının tek kaynağıdır; sayfalar için ayrı kullanıcı arayüzleri `bagil-lab.js` ve `newton-lab.js`. Slider hareketinde DOM paneli yıkılmaz, hareket animasyonu yalnız Oynat seçildiğinde yürür. Sayfa görünmez olduğunda durdurulur.

Test: `node --test labs/hareket.test.cjs`.

## Resmî kaynak
2018 MEB Fizik Dersi Öğretim Programı:
https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf

2027 YKS nihai konu/kazanım sınırları ÖSYM duyurularına bağlıdır.