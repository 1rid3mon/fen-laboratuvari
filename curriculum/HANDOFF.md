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
