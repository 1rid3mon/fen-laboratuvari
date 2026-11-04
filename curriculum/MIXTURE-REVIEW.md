# Nitel karışım özkütlesi — model denetimi

MEB 2018 Fizik 9.2.1.1(e): karışımların özkütlesine değinme, matematiksel hesaplama yapmama. Öğrenciye sayısal karışım formülü veya sayısal özkütle verilmez. Kap sayıları hazırlanacak bileşimi belirtir; nitel işaret, bileşen uçlarına göre özkütle konumunu gösterir.

## Kaynak ve bilimsel sınır

- Resmî program: SOURCES.md Fizik programı s. 16.
- OGM Defterim Fizik 9, karışımlar: https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/defterim/9/fizik/files/basic-html/page50.html
- Kaynaktaki bileşenler arası özkütle yorumu bu modelde **tam karışabilir, tepkime vermeyen, hacimleri yaklaşık toplanabilen ideal sıvılar** ile sınırlandırıldı. Her gerçek karışımın hacimleri daima toplanır diye genellenmez. Gerçek bir çözeltinin nicel tahmini yapılmaz.
- Hacimce fazla olan bileşenin etkisi, bu açık ideal modelde nitel konum işaretiyle görünür. Bileşim aynı kalıp toplam miktar değişince gösterilen özkütle değişmez. Bu sonucu farklı sıcaklık/basınç veya farklı gerçek çözeltiye koşulsuz taşıma.
- Yağ/su modu dinlenmiş iki karışmayan tabakayı temsil eder; yağ A daha az özkütleli ve üsttedir. Genel homojen tek sıvı özkütlesi gösterilmez; örnek alma ucu hangi tabakadaysa onun yerel özelliği gösterilir. Geçici emülsiyon süreci hesaplanmaz.

## Model tutarlılığı

- A/B miktar değişikliği yeni hazırlanmış bir numunedir: önceki tank boşaltılır, bileşenler baştan ölçülür; numune sayacı artar. Önceden homojen olmuş bir karışımın kendiliğinden tabakalara ayrıldığı yanlış süreç gösterilmez. Bu davranış öğrenciye ana yönergede açıklanır.
- İdeal modun şematik iki bölmeli karıştırma modeli her iki bölgenin derişimini ortak bileşime yaklaştırır; hacimce ağırlıklı toplam bileşim korunur. Karıştırıcı hızlandırır; müdahale edilmese de bekleme sırasında karışma sürer. Gerçek difüzyon süresi veya türbülans çözümü değildir.
- Hazırlama bitmeden yerel örnek bütün homojen karışım diye kaydedilemez. Renkler ve örnek işareti aynı bileşim modelinden gelir. Homojen kabul eşiğinde durum tam ortak bileşime sabitlenir; renkler ve sonuç birlikte tekdüze olur.
- Sadece B payını artırma hipotezi için A pozitif ve sabit, B artmış ve iki numune homojen olmalıdır. Model değiştirmek veya iki miktarı birlikte değiştirmek aynı hipotezi doğrulamaz. Saf B'nin miktarını artırmak “B payı arttı” diye yanlış yorumlanmaz.
- Tank boşsa örnek alınamaz; bir kaynak 0–4 kap sınırını aşamaz. Basınç ve sıcaklık sabittir. Sayılar ve yüzde karışım özkütlesi hesabı öğrenciye verilmez.

## Öğrenme ve test

Hazırla → A sabit/B değişimi için tahmin → yeni numunede doğrudan kaynak/karıştırıcı/örnek ucu sürükleme → homojenleşme ve farklı tabakaları gözleme → deftere kaydet → kontrollü karşılaştır → yazılı öz değerlendirme → bileşim ile toplam miktar farkını özgün soruyla sına.

7 yeni model testi: ideal sınırlar, bileşim/miktar ayrımı, yerel/homojen farkı, bileşim korunumu, karışmayan tabakalar, bekleme/karıştırma ve geçersiz durumlar. Gerçek Chromium/WebKit testinde kaynak, karıştırıcı ve örnek ucu sürüklenir; erken kayıt, hipotez koşulları, yeni numune kimliği, oran korunumu, yağ–su tabakaları, boş tank, pasif ilerleme, soru ve ekran yönü sınanır. Son HEAD CI sonucu beklenir. Gerçek iPad Safari yapılmadı.

Bu paket yalnız (e) alt açıklamasını geliştirir. Günlük kullanım kazanımı 9.2.1.2 ve tarihçe (f) ayrı kanıt bekler. Aynı sayfada örnek bir günlük kullanım cümlesi olması bu kazanımları bitirmez.

## (d) kapsam sınırının denetimi

9.2.1.1(d), eşit kollu terazi matematiğine girilmemesini ister. Bu bir bağımsız deney gerektiren yeni içerik değil sınırdır. İlgili TYT Madde/Özellikleri, tamamlayıcı, özkütle, hacim, birim ve nitel karışım sayfaları incelendi: teraziler ideal kütle okuması içindir; kol uzunlukları veya torkla denge denklemi çözülmez. Sınır kabul edildi. AYT tork/basit makine konularındaki farklı kazanım matematiği bu yasakla karıştırılmadı.

Önceki birim PR #19: HEAD 124e5b38f18b23959b09e814ddb17865378efc4e; merge feff0c8278a01e4027fc0e8f7713f535bb8a0148. 436 model/regresyon, yeni birim Chromium/WebKit ve özkütle Chromium/WebKit regresyonu başarılı. Run 41921788586 ve 41921788473.

## Bütünleşik doğrulama güncellemesi

Tarihçe PR #21 son HEAD 1f529e952b24f381db03e4787692b995bc73ee12, merge 84fe93695603ab365d721d435de47dc4ed5e8ccf. 438 model/regresyon ve özkütle/tarihçe Chromium/WebKit başarılı; run 41924828360. Bu dal şimdi o main ile birleştirildi; birleşik beklenen toplam 445.

İlk karışım HEAD'inde Chromium başarılı, WebKit bağımlılık kurulumu uzadı. Test senaryoları gevşetilmeden karışım browser işi resmî mcr.microsoft.com/playwright:v1.62.1-noble ortamına taşındı; npm Playwright sürümü de 1.62.1. İmaj tarayıcıları ve sistem bağımlılıklarını içerir; ayrı paket kurulumu korunur ve browser dosyasının varlığı denetlenir. Kaynak: https://playwright.dev/docs/docker ; resmî tag listesi https://mcr.microsoft.com/v2/playwright/tags/list . Son HEAD gerçek iki browser sonucunu yeniden doğrula.
