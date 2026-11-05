# Güncel geliştirme — dirençte güç/enerji

Kullanıcı TYT Fizik'in tamamına devam istedi. Maina409ad250fcfdb8d8031a6e3c0522d3b19f4760c kontrol edildi; açık PR yoktu. feature/resistor-power-energy-20261105 bu main'den açıldı. 10.1.2.3(b,ç): mevcut öğrenci kablolama tahtasına P·Δt enerji birikimi, E-t grafiği, süre, kaynak/alet/yük enerji bilançosu, özdeş lamba dal gücü, hipotez/defter/tek değişken kapısı/açıklama/YKS eklendi. Geçmiş enerji yeni güçle yeniden yazılmaz.9 yeni model testiyle520/520 yerel test geçti; son HEAD eski Ohm+eşdeğer ve yeni enerji Chromium/WebKit CI kabulü bekliyor. POWER-ENERGY-REVIEW.md.

Üst10.1.2.3 tamamlanmadı: (a,c) mekanik güç benzerliği/enerji dönüşümleri ayrıca geliştirilmelidir. Sonra10.1.2.4 güvenlik,10.1.1.1 iletim ve TYT83 kazanımın kalanları. Gerçek iPad ve bütün canlı kabulü bekler; elle Vercel deploy yok. Aşağıdaki toplu kayıt önceki paketlerin kanıtlarını korur.

---

# Güncel kayıt — public CI ve elektrik paketleri doğrulandı

5 Kasım2026. Güncel uygulama main: c1b38d0aa422a40f305787f282e086143c519c53 (#35). Bu bölüm aşağıdaki eski 'kota engeli / açık PR30–35 / tarihin eksik olması' satırlarının yerine geçer. Depoyu kullanıcı public yaptı; standart public GitHub Actions çalıştı. Ücretli kullanım açılmadı.

| PR | İş ve kapsanan kazanım | Test HEAD | Merge SHA | Kanıt |
|---|---|---|---|---|
| #31 | 17 workflowda çift çalışmayı azaltma, concurrency ve hazır tarayıcı imajı | 46d1bf8d4144f794d109246aa927ef212032fec3 | 534ea29b10c1c40a1b247947f36ae9d2608b2a9e | 30/30 check |
| #30 | 10.1.2.1(a,b): boş tahtaya eleman/kablo/A-V, Ohm, kaynak koruma | d98c402f08c788b3c4e0728cec7bf36f6f0ae6e6 | e98d93b2c8a8fc3c527bbad20b91fadc30318380 | 480 test;7 check; Chromium/WebKit run42001196596 |
| #32 | 10.1.1.2: boy/kesit/malzeme, yeni numune ve gerçek prob bağlantısı | 9516162a3fa2147fbe04b0966e3d4277845a88e5 | 03917059bac7be6a13c88c74fa19f79261bde4c0 | 488 test;7 check; Chromium/WebKit run42002290018 |
| #33 | 10.1.2.1(c): öğrencinin seri/paralel eşdeğer ölçümü; bütün yük A/V kapıları | abecfa3350135e8b01b6ad7d6f46682c58e701cd | 7af9a3bc54e3422d14a11ac492ffca576928dec4 | 496 test;6 check; Chromium/WebKit run42004570036 |
| #34 | 10.1.2.2(a,b,c,d): tek/seri/ters seri/paralel özdeş pil; gözlenen tam tükenme ve nitel iç etki | 6004b8c1610a4084856579ee7568abb1ff837e7e | 94494cc34c3085e9078b90a40029c229dd815592 | 508 test;7 check; Chromium/WebKit run42006043841 |
| #35 | 10.1.2.2(ç): Galvani–Volta kanıt/gözlem kartları, görüş karşılaştırması ve kayıtlı tartışma | 20d966720f8457597fddabcf2cca15a1e9d096c8 | c1b38d0aa422a40f305787f282e086143c519c53 | 511 test;6 check; eski/yeni Chromium/WebKit run42007419556 |

Sonraki kayıt PR'si yalnız #35 kabulünü JSON/tabloya ve bu toplu devre işler; yeni fizik deneyi sayılmaz. Yukarıdaki bütün geliştirme paketleri son HEAD yeşil/çakışmasızken ayrı ayrı main'e alındı; başarısız veya doğrulanmamış HEAD birleştirilmedi. Bilimsel incelemeler: CI-MINUTES, CIRCUIT-BUILDER, WIRE-RESISTANCE, CIRCUIT-EQUIVALENT, GENERATOR ve GENERATOR-HISTORY REVIEW dosyaları.

## Kapsamın gerçek durumu

| Alan | Ana kazanım | Main kabulü | Ayrıntılı kabulü kalan |
|---|---:|---:|---:|
| TYT Fizik |83|7|76|
| AYT Fizik |130|0|130|
| TYT Kimya |61|0|61|
| AYT Kimya |66|0|66|
| TYT Biyoloji |28|0|28|
| AYT Biyoloji |63|0|63|

431 ana kazanım/872 harfli açıklama envanteri korunur. Main kabulündeki fizik kimlikleri:9.2.1.1,9.2.1.2,9.2.2.1,9.2.3.1,10.1.1.2,10.1.2.1,10.1.2.2. Diğer424 kazanımın sıkı kabulü eksik; bu kod veya eski laboratuvar yok demek değildir. Bir örnek tüm konu kabulü sayılmadı. Üst kazanımlar bütün alt açıklama/özel gereklilikler kanıtlanmadan yükseltilmedi. ÖSYM2027 ayrıntılı kapsam kılavuzu bağımsız doğrulanmış değil;2018 MEB ve2028 geçiş resmi dayanakları SOURCES.md'de. Proje veya fizik tamamlandı değildir.

## Canlı ve cihaz sınırları

Vercel Git entegrasyonu otomatik üretim dağıtımı yapıyor. #34 üretim dpl_7qsuEQ1yxQUHLYFmn7zLzxmV9qKx READY; kaynak94494cc ile eşleşti. https://fen-laboratuvari-github.vercel.app/labs/uretec-tezgahi.html bulut Chrome'da açıldı; arayüzden tek pil/yük eklenip uçlar kablolandı, |V|1.490V/|I|.248A ölçümü, defter ve30 model dakika ilerleme görüldü. Bu yalnız canlı temel akış kontrolü; tam canlı kabulü veya gerçek iPad sayılmadı. #35 ve sonraki yayınlar ayrıca SHA ile yeniden doğrulanmalı. Elle deploy tetiklenmedi. Sonraki ajan otomatik yayınların Vercel günlük kota etkisini kontrol etsin; ek manuel yayınlar zorlamasın.

Gerçek iPad Safari, Apple Pencil, çoklu dokunma, cihaz FPS/akıcılık ve tüm canlı akışlar bekliyor. CI Chromium/WebKit ve masaüstü Chrome bunların yerine geçirilmedi. Yerel Chromium OS socket izninden başlayamıyor; gerçek browser kanıtı GitHub CI'dandır. WebKit ekran görüntüleri incelendi; fixture'ın sonunda boş/kısmi tahta testin kaldırma adımıdır, başlangıçtan düğme ekleyerek çalışan düzenek kurulur.

## Sıradaki somut işler

1. Güncel main/açık PR'ları oku ve bu kayıt PR'sinin merge durumunu doğrula.
2. 10.1.2.3 güç/enerji: MEB'in (a,b,c,ç) alt sınırlarını yeniden oku. Öğrenci yük, gerilim, süre ve bağlantıyla sonucu üretmeli; W=P·t, dirençte enerji, lamba parlaklığı, ısı/iş/mekanik/elektrik dönüşümleri ve mekanik güç benzerliği. İzin verilen hesap sınırını aşma; ideal sabit dirençli lamba yaklaşımını doğru uygula. Model/defter/grafik ve kontrollü karşılaştırma tutarlı olmalı.
3. 10.1.2.4 güvenlik: fiziksel olarak tutarlı sanal risk/koruma senaryoları, yanlış çıkarım geri bildirimi. Tek uyarıyla yanlış modeli örtme.
4. 10.1.1.1 iletim ortamları ve kalan TYT giriş/mekanik/ısı/basınç/dalgalar/optik/manyetizma kabul boşluklarını mevcut kodla tek tek karşılaştır. Sonra AYT Fizik ve diğer dört alanın tamamı.
5. Her paket güncel main'den dal; bilim/kapsam incelemesi; node --test labs/*.test.cjs tests/*.test.js; ilgili gerçek Chromium/WebKit etkileşimi; regresyon; PR; son HEAD yeşil/çakışmasızsa merge. Parent kabulü daha sonra merge SHA ile kaydedilir. Hiçbir zaman bütün altı alan taranmadan tamamlandı deme.

Aşağıda önceki bütün paketlerin ayrıntılı tarihsel kaydı korunur.

---

# Güncel devam — üreteç fizik deneyi main, tarih kanıt masası test ediliyor

5 Kasım2026. #34 HEAD6004b8c1610a4084856579ee7568abb1ff837e7e; merge94494cc34c3085e9078b90a40029c229dd815592. 508/508 model/regresyon;7/7 check; Chromium/WebKit run42006043841 gerçek kablolama, taşıma/döndürme, tek/seri/ters seri/paralel, tam tükenme ve hata senaryoları başarılı. WebKit ekran görüntüsü incelendi. 10.1.2.2(a,b,c,d) ve ilgili deney kabul maddeleri main; (ç) tarih tartışması ayrı kaldı.

Güncel main94494cc üzerinden feature/generator-history-evidence-20261105. Galvani–Volta modülü üç kanıt/gözlem kartının sürüklenerek sınıflanması, görüşlerin ayrı karşılaştırılması ve öğrenci açıklamasının kaydıyla fizik tezgâhını tamamlar. Gözlem tek başına kaynak tayini değildir; dokusuz pil biyolojik elektriğin yokluğunu kanıtlamaz; tarihsel metal yorumu modern kimyasal enerji açıklamasıyla eşitlenmez. Kaynaklar ve denetim GENERATOR-HISTORY-REVIEW.md. Yeni3 model testiyle511 toplam; son HEAD browser/CI kabulü bekliyor. Üst kazanım henüz kabul edilmez.

Sonraki iş: tarih modülünün eski pil/tükenme regresyonu ve yeni kart etkileşimini Chromium/WebKit'te doğrula, sorunları çöz ve yalnız yeşilse merge. Sonra10.1.2.2 üst kabulünü kanıtla;10.1.2.3 güç/enerji,10.1.2.4 güvenlik ve TYT83 kazanımın kalanı. Altı alanın tümü tamamlanmadı. Gerçek iPad Safari ve canlı kabulü yok; elle Vercel üretim deploy yapılmadı. Aşağıdaki eski bekliyor/kota satırları tarihsel arşivdir.

---

# Güncel devam — #33 main, üreteç paketi hazırlanıyor

5 Kasım2026. #33 eşdeğer direnç son HEAD abecfa3350135e8b01b6ad7d6f46682c58e701cd; merge7af9a3bc54e3422d14a11ac492ffca576928dec4. 496 model/regresyon,6/6 check; eski Ohm+yeni seri/paralel gerçek kablolama Chromium/WebKit run42004570036 başarılı. Ekran görüntüsü incelendi; araştırma yönergeleri Ohm/eşdeğer görevi için ayrıştırıldı. 10.1.2.1(c) ve üst kazanım main kanıtı kapsam tablosuna işlendi. Gerçek iPad/canlı bekler.

Güncel main7af9a3b üzerinden feature/generator-workbench-20261105 açıldı. URETEC:10.1.2.2(a,b,c,d) özdeş pil/yük yerleştirme/taşıma/döndürme/kaldırma, kutup kablolarını öğrenci kurar; tek/seri/ters seri/paralel, kapasite ve zaman, ölçüm defteri/grafik, iki tamamlanmış tükenme deneyi karşılaştırması, nitel iç etki, hipotez/açıklama/YKS. 12 ek model testi, yerelde508/508. Son HEAD gerçek Chromium/WebKit ve CI yeşil olmadan main kabulü yok. (ç) Galvani–Volta görüşlerini kanıtlarla tartışma eksik; üst10.1.2.2 bu paket başarılı olsa bile tamamlandı sayılmaz. GENERATOR-REVIEW.md varsayımlar/kaynaklar/testleri açıklar.

Sıradaki: üreteç browser/CI sonuçlarını incele ve sorunları çöz; başarılıysa merge. Ardından eksik tarih tartışması,10.1.2.3 güç/enerji,10.1.2.4 güvenlik ve TYT83 kazanımın kalan ayrıntılı kabulü. Altı alan tamamlanmadı. Public standart Actions çalışıyor, ücretli kullanım açılmadı, elle Vercel deploy yok. Aşağıdaki eski kota veya #30–33 bekliyor satırları tarihsel arşivdir.

---

# Güncel devam noktası — public CI doğrulandı, 5 Kasım 2026

Bu bölüm aşağıdaki tarihsel kota/bekleyen PR satırlarının yerine geçer. Proje ve TYT Fizik tamamlanmadı. Depo kullanıcı tarafından public yapıldı; standart public Actions yeniden çalıştı. Ücretli kullanım açılmadı; elle Vercel üretim dağıtımı yapılmadı.

| PR | Son test HEAD | Merge SHA | Kabul |
|---|---|---|---|
| #31 | 46d1bf8d4144f794d109246aa927ef212032fec3 | 534ea29b10c1c40a1b247947f36ae9d2608b2a9e | CI tekrarlarını azaltma;30/30 check geçti |
| #30 | d98c402f08c788b3c4e0728cec7bf36f6f0ae6e6 | e98d93b2c8a8fc3c527bbad20b91fadc30318380 | Boş tahtadan eleman/kablo/A-V/Ohm;480 test ve7 check, Chromium/WebKit run42001196596 |
| #32 | 9516162a3fa2147fbe04b0966e3d4277845a88e5 | 03917059bac7be6a13c88c74fa19f79261bde4c0 | Boy/kesit/malzeme ve öğrenci prob bağlantısı;488 test ve7 check, Chromium/WebKit run42002290018 |

10.1.1.2 #32 kabulü bu pakette kapsam tablosuna işlendi. 10.1.2.1(a,b) #30 main; (c) seri/paralel eşdeğer direnç sıradaki bağımsız pakettir: feature/equivalent-resistance-20261105, başlangıç0391705. Bu dalda öğrenci seri/paralel/karışık kabloları kurar, A bütün akımı/V bütün yük grubunu ölçer; yanlış kısmi ölçümler kayıt olamaz. 8 ek model testiyle yerelde496/496; son HEAD browser/CI geçmeden main kabulü yok. CIRCUIT-EQUIVALENT-REVIEW.md bilimsel sınırları kaydeder. Yeni browser senaryosu eski Ohm senaryosuyla iki motorda çalışacak.

Gerçek iPad Safari, Apple Pencil, çoklu dokunma/akıcılık ve yeni deneylerin canlı kabulü bekliyor. Yerel tarayıcı OS socket engeli sebebiyle çalışmadı; CI browser kanıtı bunun yerine gerçek cihaz diye sunulmadı. ÖSYM2027 ayrıntılı kapsam kılavuzu bağımsız doğrulanmış değil;2018 MEB/2028 geçiş kaynakları SOURCES.md'de.

Sıradaki: eşdeğer paketi CI/testleri → başarılıysa PR/main; ardından10.1.2.2 üreteç,10.1.2.3 enerji/güç,10.1.2.4 güvenlik ve kalan TYT83 kazanımın ayrıntılı denetimi. Altı alan431 kazanım ve872 harfli açıklama envanteri korunur. Önceki paketlerin ayrıntılı SHA/kapsam kaydı aşağıdadır. Fizik bitince diğer alanlar sürer.

---

> GÜNCEL: Kullanıcı depoyu public yaptı; standart runner testleri yeniden başladı. #31 HEAD46d1bf8d4144f794d109246aa927ef212032fec3 30/30 check ile main534ea29b10c1c40a1b247947f36ae9d2608b2a9e. #30 güncel HEADd98c402f08c788b3c4e0728cec7bf36f6f0ae6e6,480 test ve Chromium/WebKit run42001196596 başarılı; maine98d93b2c8a8fc3c527bbad20b91fadc30318380. #32 iletken direnci bu güncel main ile uzlaştırıldı; son HEAD gerçek CI/browser bekliyor. Eski 1Aralık quota bekleme notları tarihsel kaldı. TYT Fizik hedefi devam: sıradaki eşdeğer direnç, üreteçler, güç/enerji/güvenlik. Gerçek iPad ve canlı ayrı bekler.

> GÜNCEL: #29 yüzey gerilimi main7275877a610111a4cdb298f80542bdf67a71c671; 473 test/19 check ve Chromium/WebKit başarılı (run41982513570). 9.2.3.1 alt maddelerinin main kanıtları işlendi. Kullanıcı önceliğiyle ELEKTRİK DEVRELERİNE geçildi: feature/circuit-builder-20261105, boş tahta/eleman ekle-kaldır-taşı-döndür/gerçek kablo/Ohm ölçüm kapısı ve grafik. 480 yerel test; son HEAD browser kabulü bekliyor. İlk paket10.1.2.1(a,b), eşdeğer direnç(c) ve üreteç/güç/güvenlik ayrı eksik. Son HEAD CI geçerse merge; ardından elektrik paketlerini güncel main üstünden sürdür.

> SON DURUM: kılcallık #28 main (d573d4b9a2efc04d10aa6cefbc94a9444e55e740), 466 test/19 check ve Chromium/WebKit başarılı (run41981688230). Kalan yüzey gerilimi tezgâhı feature/surface-tension-20261105 dalında: IAPWS su/deniz suyu, tipik sabunlu su/etanol20°C, gerçek plaka sürükleme/ilk temas/dara, ön tahmin/defter/tek değişken karşılaştırması. 473 yerel test geçti; son HEAD tarayıcı kabulü bekliyor. Bu paket sonrası kullanıcı önceliği ELEKTRİK DEVRELERİ.

> YENİ ÖNCELİK (5 Kasım): 9.2.3.1 sonrası **elektrik devreleri**. Kılcallık/ıslanma ilk paketi feature/capillary-wetting-20261105 dalında; altı model testi, 466 toplam test ve tarayıcı senaryosu hazır, son HEAD CI kabulü bekliyor. Yüzey gerilimi mekanizması ve faktörleri ayrı eksik; bu tek paket tüm 9.2.3.1 kabulü değildir. Yeni başlangıç main 9b81f82f045b3e3adc84068e208557874196c148.

> GÜNCEL DEVAM NOKTASI: [5 Kasım toplu ilerleme kaydı](PROGRESS-2026-11-05.md). #25 ebru ve #26 dayanıklılık main, son uygulama merge 339e1614e79a478f049780c4a4a05443c54d6c80. Aşağıdaki eski bekliyor satırları tarihseldir; güncel tablo ve sonraki iş bağlantıdaki kayıttadır. Proje tamamlanmadı.

# Fen Laboratuvarı devam kaydı · 5 Kasım 2026

**Proje tamamlanmadı.** Hedef altı alanın bütün ilgili kazanımları. 431 ana kazanım / 872 alt açıklama satırı başlangıç envanteri var; her alt açıklama gerektiğinde daha küçük kavramlara bölünmelidir. Eski bir sayfanın varlığı kabul değildir.

## Main'e alınan paketler

| PR | İçerik ve kapsam | Son doğrulanmış HEAD | Main merge | Test |
|---|---|---|---|---|
| #15 | Altı kapsam tablosu, MEB kaynakları, kanıt kapısı, AGENTS | fa7799b70b86806053b45a2f6fba65d8cdacbd43 | bcea32904f35001e17575d3770557e690d37dd8e | 3 yeni envanter testi / CI başarılı |
| #16 | Özkütle ölçümü, hipotez, defter, grafikler; 9.2.1.1 c/ç | f9d263be1b9ac8e295db49150e98663d6f8c28c2 | dddf8141db9dd9a82f5329e82a6bf48a6f202058 | 419 model/regresyon; Chromium/WebKit başarılı; run 41917472473 |
| #17 | Küp/prizma/silindir/küre, bağımsız ölçü uçları, ölçek hipotezleri; b düzgün şekiller | 2e26e5c0e86a80758a3198b1ea67e6e65b4e1cb2 | 155aa6d8f169971f34006da96112794a54af0df9 | 424 model/regresyon; Chromium/WebKit başarılı; run 41919512287 |
| #18 | Düzensiz cismin gerçek batmış profili, su korunumu ve ölçümü; b düzensiz şekiller | 6c054c00cb670c3fa44de677e4936ebaa3fc7f9a | 245a14b57ce5fee09ff491445ac748a2c24f0e2f | Birleşik 429 model/regresyon; Chromium/WebKit başarılı; run 41920126437 |

Main son gözlenen: d15519f727a26c88b2cd5b4a5655fac4c31933ac. a/b/c/ç/d/e/f alt açıklamalarının main kanıtları JSON'a işlendi. 9.2.1.1 main'de; gerçek cihaz/canlı ayrıca bekliyor. Bilimsel kayıtlar DENSITY-REVIEW.md, VOLUME-REVIEW.md, IRREGULAR-REVIEW.md.

PR #19 da tamamlandı: HEAD `124e5b38f18b23959b09e814ddb17865378efc4e`, merge `feff0c8278a01e4027fc0e8f7713f535bb8a0148`. Birim ve özkütle Chromium/WebKit senaryoları başarılı; 436 test geçti. 9.2.1.1(a) main olarak kaydedildi.

PR #21 tarihçe tamamlandı: HEAD `1f529e952b24f381db03e4787692b995bc73ee12`, merge `84fe93695603ab365d721d435de47dc4ed5e8ccf`. 438 model/regresyon ve Chromium/WebKit başarılı; run 41924828360.

PR #20 tamamlandı: HEAD e499bc68ed67a6118fba92716ccee758627bf04f, merge d15519f727a26c88b2cd5b4a5655fac4c31933ac. Birleşik 445 test ve tüm Chromium/WebKit/regresyon kontrolleri başarılı. Run 41925482204. Main son gözlenen d15519f727a26c88b2cd5b4a5655fac4c31933ac. 9.2.1.1 a/b/c/ç/d/e/f denetimleri main'e alındı; üst kazanım main statüsüne yükseltildi. Gerçek cihaz ve canlı ayrı bekler.

## Güncel paket — 9.2.1.2 ilk iki örnek

Dal feature/material-inference-20261105, güncel main d15519f üzerinden. Kuyumculukta bilinmeyen X/Y numunelerini ölç, aynı gövde özkütlesine rağmen farklı malzeme/kapalı boşlukları gör. Porselenle ilişkili sabit bileşimli sanal seramikte kapalı boşluk ve dış hacmi değiştir; kütle/dış hacim, gövde özkütlesi ve kesin kalite çıkarımının sınırını öğren. Numune/boşluk sürükleme, tartım, tam batırma, defter, hipotez, ölçüm sonrası iç yapı ve soru. Bilimsel kayıt MATERIAL-REVIEW.md.

5 yeni model testi, toplam 450 yerel test geçti. Chromium/WebKit gerçek pointer senaryosu hazır; PR/HEAD aktarımı ve CI sıradaki iş. Browser işi sürümü eşleşen resmî Playwright 1.62.1 noble imajını kullanır; gerçek testler atlanmaz.

Kapsamda üç örnek ayrı kabul maddesi: kuyumculuk, porselen, ebru. İlk ikisi geliştirmede; ebru eksik. Üst kazanım bu iki örnekle tamamlanmaz. CI kanıt kapısı ek kabul maddelerinin tümü tamamlanmadan üst statünün yükseltilmesini engeller.

## Kabul ve yayın sınırları

Gerçek iPad Safari/Apple Pencil ve cihaz akıcılığı yapılmadı. Yerel Chromium OS socket izniyle başlayamadı; gerçek browser testleri Actions'ta. Masaüstü WebKit/touch gerçek cihaz sayılmaz. 431/872 envanterinin geri kalanı ayrı öğrenme/bilimsel kabul bekler. Üst kazanımı tüm alt açıklamaları main'e girmeden yükseltme.

Vercel proje prj_IGbHMZd4pfzBH1X3t2auBqbUMe17 / fen-laboratuvari-github, takım keremmert137-9933s-projects. Bazı otomatik dağıtımlar günlük sınırda; son gözlenen production bcea329 (#15), #17/#19 preview READY. Main yeni deneylerin üretimde olduğu anlamına gelmez. Uygun toplu yayın aşamasında üretim SHA'sını yeniden oku, tek tek elle yeniden dağıtım zorlama. Preview promotion production değişkenleriyle yeniden build yapabilir.

ÖSYM 2027 ayrıntılı kapsam kılavuzu doğrulanmadı; MEB 2018 ve 2028 geçiş dayanakları SOURCES.md'de. Ebru/karışım kaynaklarını koşulsuz bilimsel genelleme diye kopyalama.

## Sıradaki işler

1. Malzeme inceleme PR'sini aç/son HEAD CI'ını oku. 450 model/regresyon, yeni material Chromium/WebKit ve gerekli hacim/diğer regresyonlar başarılıysa main'e al. Yalnız kuyumculuk/porselen alt kabul maddelerini yükselt; ebru eksik kalır.
2. Ebru atölyesi: birincil kaynak paint slightly denser than bath but interfacial tensions prevent sinking; yüzey etkin madde boyanın yüzey gerilimini azaltıp yayılmayı artırabilir; alet hareketi yüksek viskoziteli ortamda deseni değiştirir. Yoğunluk tek parametre diye sahte model kurma. Kaynak: https://people.math.wisc.edu/~spagnolie/Papers/sbsr24.pdf ve https://gfm.aps.org/meetings/dfd-2023/649b3ad8199e4c137897831b . Bunlar iç model doğrulaması içindir; TYT dışı akışkan denklemleri öğretilmez. Ebru için kontrollü yüzey taşınma/alet hareketi modeli, sabit özkütlede farklı desen gözlemi anlamlı olabilir; gerçek Navier–Stokes/renk yayılma tahmini diye sunma.
3. Porselen birincil araştırma: https://www.mdpi.com/1996-1944/16/1/171 ve https://www.sciencedirect.com/science/article/pii/S095522191000333X . Katı/gövde özkütlesi, kapalı/açık gözenek ve kalite çok etkenliliği ayrılmalı. Sanal numune verisini gerçek ölçüm diye sunma.
4. Sonra 9.2.2 dayanıklılık, 9.2.3 adezyon/kohezyon/kılcallık/yüzey gerilimi; tüm TYT Fizik ve diğer beş alanın her kapsam satırına devam. Hiçbir alan veya konunun tek sayfayla bittiğini varsayma. Altı alan sonunda yeniden taranır.

Komutlar: node --test labs/*.test.cjs tests/*.test.js; node curriculum/render.cjs; node tests/malzeme-browser.cjs chromium / webkit; hacim-browser.cjs, ozkutle-browser.cjs, birim-browser.cjs, karisim-browser.cjs regresyonları.


## Son kalıcı devir — PR #22 birleşti

Son geliştirme main SHA: `512137cf57023a398a0bdf0f0c046d1e550ac7ca`; PR #22 HEAD `8fbda10d42f8898ef3cc517747cc9692e56860cf`. Merge öncesi son HEAD için tüm 13 check başarılı: material, hacim ve özkütle Chromium/WebKit; model/regresyon, inventory ve kapsam kapısı. Yerelde 450/450 test, sıfır atlanan. Çakışma yoktu. Kuyumculuk/porselen iki alt kabul maddesi main'e yükseltildi, ebru Eksik kaldı. 9.2.1.2 üst durumu Geliştiriliyor. Bu bölüm yukarıdaki PR aktarımı bekliyor ifadesinin yerine geçer.

Bu oturumun çalışma/kullanım bütçesi nedeniyle burada devir bırakılıyor; altı alan tamamlanmadı ve çalışma arka planda sürmüyor. 431 kazanımın yalnız 9.2.1.1'i bütün alt açıklamaları için main kabulüne sahip; 9.2.1.2 iki alt maddesi main, ebru eksik; diğer 429 üst kazanım katı kabul denetiminde Eksik. Bu durum mevcut eski laboratuvarların hiç olmadığı anlamına gelmez. Gerçek iPad ve yeni laboratuvarların canlı kabulü hiçbirinde yapılmadı.

Sonraki oturum önce güncel main ve açık PR'ları yeniden okusun; kapsam kayıt değişikliklerini doğrulasın. Sıradaki geliştirme 9.2.1.2 ebru: yukarıdaki birincil kaynakları okuyup bilimsel olarak dürüst yüzey taşınması/alet hareketi atölyesi tasarla, ölçüm/hipotez/kayıt/karşılaştırma/soru ekle. Ebru için yapay yoğunluk-batma kuralı veya sahte akışkan denklemi kullanma. Ardından 9.2.2, 9.2.3 ve altı alanın geri kalanını konu paketleriyle sürdür. Güncel main üzerinden her pakette ayrı dal/PR/test/merge. ÖSYM 2027 kapsamı bağımsız resmî doğrulama ve gerçek cihaz testi açık sınırlamalardır.


## 5 Kasım devamı — ebru yüzey atölyesi

Kullanıcı ara kayıt istedi; #24 issue tüm #15–#23 paketlerini ve limitleri yeniden topladı. Güncel main başlangıcı 40c08d0903c5d9814f54c0f8447d9dad72f59e6a, açık PR yoktu. Yeni dal feature/ebru-surface-20261105. Ebru model/UI, beş model testi, Chromium/WebKit etkileşim senaryosu ve resmî Playwright imajlı workflow hazırlandı. Kaynak/model sınırları EBRU-REVIEW.md. Tamamlanmış veya canlı kabulü verilmedi.

Sıradaki adım yeni PR son HEAD CI ve tüm regresyonları gözle; başarısızlığı düzelt. Ebru yüzeyde kalma kuvvetlerini çözmüyor, hazırlanmış lekede özkütleler sabitken alet etkisini araştırıyor. Öğrenci çizgi/yön/miktar/genişliği doğrudan jestle değiştirir, tahmin/ölçüm/defter/karşılaştırma/açıklama/YKS döngüsü vardır. Son HEAD başarılı olmadan birleştirme; gerçek iPad ayrıca bekler.


## Ebru #25 main; sıradaki dayanıklılık paketi

#25 HEAD 71d445c9abadc9023f898e63391143c3f447ca0b, merge eb512f605918b23fdc1b8c5324dcf297907ddfb7. Son HEAD 16 check başarılı: beş yeni model testi dahil 455/455 yerel/regresyon ve ebru Chromium/WebKit run41978543369, hacim/malzeme/karışım regresyonları. Çakışma yoktu. 9.2.1.2 üç örneği main kabulüne yükseltildi; gerçek iPad ve canlı ayrıca bekler.

Yeni dal feature/strength-ratio-20261105 güncel ebru main üstünden. Dayanıklılık 9.2.2.1: küp/prizma/silindir/küre için doğrudan boyut tutamakları, kesit düzlemi tarama, önceden tahmin, A/V ölçüm ve defter/bar grafiği, benzerlik koşulu, açıklama ve soru. Kırılma kuvveti veya müfredat dışı hesap yok. Kürede rastgele kesit ile en büyük referans ayrıldı. Beş model testi, toplam 460 yerel test; son HEAD Chromium/WebKit ve regresyon kabulü bekliyor. Bilimsel inceleme STRENGTH-REVIEW.md.

Sonraki adım dayanıklılık PR son HEAD testlerini gözle/düzelt ve geçerse merge; dört alt kabul maddesi/üst kazanımı kanıtla yükselt. Ardından 9.2.3.1 adezyon/kohezyon/kılcallık/yüzey gerilimi ve tüm altı alan. Mevcut kesit paketi henüz main kabulüne sahip değildir. Sıradaki oturum GitHub main ve açık PR durumunu yeniden okumalı.
