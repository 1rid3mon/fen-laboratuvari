# Fiziksel jeneratör–motor–ampul tezgâhı —10.1.2.3(a,c) ek etkileşim kabulü

5 Kasım2026. Main517e5cc033c44e3a491a9d791e5b53b9257b0346 (#40) üzerinden bağımsız dal. Kullanıcının somut etkileşim isteğiyle yeniden açılan motor/jeneratör fiziksel sahne gereğini karşılamak üzere geliştirildi; #38 nitel akış şeması yalnız yardımcıdır. MEB2018 basılı s.21,10.1.2.3(a,c) mekanik/elektriksel güç benzerliği ve enerji dönüşümleri. Nicel direnç hesabı/özdeş lamba karşılaştırması #37'de kalır. Kapsam https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf .

İç model doğruluğu için birincil ders kaynakları: https://openstax.org/books/college-physics-2e/pages/23-5-electric-generators ; https://openstax.org/books/college-physics-2e/pages/10-4-rotational-kinetic-energy-work-and-energy-revisited ; https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy . Bu ileri denklemler öğrenci TYT arayüzüne taşınmadı; arka plan bilimsel tutarlılığı içindir.

## Doğrudan fiziksel etkileşim

Öğrenci motor ve ampulü ekler/kaldırır/taşır; terminal kablolarını dokunarak veya sürükleyerek kurar/çıkarır. Kuvvet tutamağı sürüklendiğinde uygulanan çevirme etkisi büyür/küçülür; rotor bu girdiden hızlanır. Elektriksel ağ, ampul gücü/parlaklığı, motor milinin dönüşü ve yükün yükselmesi aynı modelden oluşur. Paralel ampul eklemek gerçek yükü değiştirir; jeneratörün mekanik yüklenmesi de değişir. Kesişen yalıtılmış hatlar kendiliğinden birleşmez, yalnız bağlı uçlar düğümdür. Gövdeyi görsel taşımak düğümleri değiştirmez.

Kaynak pil seçilirse mekanik jeneratör girdisi olmadan motor/ampul çalışabilir. Çevirme etkisini kaldırmak rotor enerjisini anında silmez; atalet enerjisinden bir süre aktarım sürer ve sürtünmeyle azalır. Ampul rengi/gücü monoton ilişkilidir, gerçek lümen/ışık verimi değildir. Kısa devrede sanal çıkış ayrılır; yanlış çalışan ampul veya sahte enerji aktarımı oynatılmaz. Yeni deney aynı düzeni sıfır enerji başlangıcına getirir; kayıtlar korunur. Ön tahmin, süre/enerji gözlemi, koşullu defter, karşılaştırma, açıklama ve özgün YKS girdi/depo sorusu vardır.

## Fizik modeli ve bilanço

DC jeneratörün sabit katsayılı örneği: E=kω, yükün iç çözücüdeki birim kaynak akımı I₁ ile elektromekanik direnç etkisi k²I₁ω. J=.2,d=.02,k=.5, uygulanan etkiτ=.8·kontrol(0–1). Denklem J·dω/dt=τ−(d+k²I₁)ω. Sabit koşullu her aralık analitik çözülür: ω,∫ωdt ve∫ω²dt aynı çözümden gelir. τ∫ωdt mekanik girdi işi; elektriksel yükler k²∫ω²dt ile ölçeklenen gerçek ağ güçlerinden beslenir. Açık devrede I₁=0, rotor yine hızlanabilir fakat yük enerjisi oluşmaz. Seçili sınırlar boşta E≤20V tutar; yüksek güçte sessiz sayısal kırpma yoktur.

Ağ mevcut TytDevreMath motoruyla çözülür; iç kaynak direnci1Ω, motorun eşdeğer elektriksel işletme direnci12Ω, ampul6Ω. Kullanıcıya bu iç dirençten hesap görevi verilmez. İç EMK ile kaynak uç gerilimi ayrı etiketlenir; kayıplı kaynakta yüklenme gerilimi daha düşüktür. Motor sabit bir işletme noktası ve ideal ayarlanan aktarma örneğidir: elektriksel girişinin.6 payı mekanik aktarım, kalanı iç kayıp. Bu tüm motor yük-hız eğrisinin çözümü değildir. Pozitif yönlü kaldırmada m=1,g=10 ile yükün potansiyel enerjisi bu mekanik iş kadar artar. Motor mili açısı aynı birim dal akımından gelir.

Motor uçları ters bağlanınca işaretli akım ve mil yönü ters döner. Bu seçili yük tutucu tek yönlü kavramada yük yükselmez; modelin ters yön mekanik payı fren/ısıl kayba gider. Bu özel işletme/aktarma mekanizması arayüzde açık; bütün motorların davranışı olarak öğretilmez. Böylece ters bağlantıda yanlış yükselen yük veya bilançoda yoktan potansiyel enerji oluşmaz.

Her adımda toplam girdi=rotorun kalan hareket enerjisi+motorun yük işi+ampulün çıktısı+ısıl pay. Isıl pay rotor sürtünmesi, kaynak iç kaybı ve motor iç/fren kaybını içerir. Ampul çıktısının ışık/ısı oranı çözülmez. Gerçek manyetik ayrıntı, motor ataleti, sıcaklık eğrisi, gerçek verim veya koruma zamanı modellenmez. Öğrenci bunlara ilişkin sayısal soru çözmez. Grafik çubukları aynı toplam girdinin paylarıdır; ara mekanik işi bir kez daha ısıya ekleyerek enerji çift sayılmaz. Süre sınırı30s model gözlem penceresidir, cihaz tükenmesi değildir.

## Testler ve kabul

11 yeni model testi: durgun/kuvvetsiz kaynak, kuvvetle rotor/motor/yük hareketi, tüm düzenlerde analitik enerji korunumu, paralel ampulde gerçek mekanik yüklenme, kuvvet bırakılınca depodan aktarım, pille motor, kısa devre çıkış ayırma, parça çıkarma/taşımada geçmişin korunması, yeni deney/kayıt ve koşul kapısı, zaman alt adımlarının aynı çözümü vermesi, ters kutuplu motor ve yük tutma/ısı bilançosu. Önceki544 ile555 yerel model/regresyon.

Gerçek browser senaryosu kuvvet tutamağını sürükler, motor/ampul ekleyip terminalleri touch ile bağlar, rotor/mil/yük hareketini, ek ampulü, kuvvet kaldırmada devam eden hareketi, kısa devreyi, parça çıkarmayı, ters motoru, taşımayı ve iki yönü gözler. Son HEAD CI/Chromium/WebKit yeşil olmadan ek kabul kapanmaz. Gerçek iPad Safari/Apple Pencil/çoklu dokunma/cihaz akıcılığı ve bütün canlı kabulü ayrıca bekler. Elle Vercel üretim deploy yok.
