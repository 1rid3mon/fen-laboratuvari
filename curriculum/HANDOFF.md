# Fen Laboratuvarı devam kaydı · 5 Kasım 2026

**Proje tamamlanmadı.** Hedef altı alanın bütün ilgili kazanımları. 431 ana kazanım / 872 alt açıklama satırı başlangıç envanteri var; her alt açıklama gerektiğinde daha küçük kavramlara bölünmelidir. Eski bir sayfanın varlığı kabul değildir.

## Main'e alınan paketler

| PR | İçerik ve kapsam | Son doğrulanmış HEAD | Main merge | Test |
|---|---|---|---|---|
| #15 | Altı kapsam tablosu, MEB kaynakları, kanıt kapısı, AGENTS | fa7799b70b86806053b45a2f6fba65d8cdacbd43 | bcea32904f35001e17575d3770557e690d37dd8e | 3 yeni envanter testi / CI başarılı |
| #16 | Özkütle ölçümü, hipotez, defter, grafikler; 9.2.1.1 c/ç | f9d263be1b9ac8e295db49150e98663d6f8c28c2 | dddf8141db9dd9a82f5329e82a6bf48a6f202058 | 419 model/regresyon; Chromium/WebKit başarılı; run 41917472473 |
| #17 | Küp/prizma/silindir/küre, bağımsız ölçü uçları, ölçek hipotezleri; b düzgün şekiller | 2e26e5c0e86a80758a3198b1ea67e6e65b4e1cb2 | 155aa6d8f169971f34006da96112794a54af0df9 | 424 model/regresyon; Chromium/WebKit başarılı; run 41919512287 |
| #18 | Düzensiz cismin gerçek batmış profili, su korunumu ve ölçümü; b düzensiz şekiller | 6c054c00cb670c3fa44de677e4936ebaa3fc7f9a | 245a14b57ce5fee09ff491445ac748a2c24f0e2f | Birleşik 429 model/regresyon; Chromium/WebKit başarılı; run 41920126437 |

Main son gözlenen: 245a14b57ce5fee09ff491445ac748a2c24f0e2f. b/c/ç alt açıklamalarının kanıtları JSON'a işlendi. Ana 9.2.1.1 henüz tamamlanmadı. Bilimsel kayıtlar DENSITY-REVIEW.md, VOLUME-REVIEW.md, IRREGULAR-REVIEW.md.

PR #19 da tamamlandı: HEAD `124e5b38f18b23959b09e814ddb17865378efc4e`, merge `feff0c8278a01e4027fc0e8f7713f535bb8a0148`. Birim ve özkütle Chromium/WebKit senaryoları başarılı; 436 test geçti. 9.2.1.1(a) main olarak kaydedildi.

## Güncel paket

Dal `feature/qualitative-mixtures-20261105`, güncel main feff0c8 üzerinden. Nitel karışım (e): A/B tarifini değiştirip yeni numune hazırlama; doğrudan kaynak/karıştırıcı/örnek ucu sürükleme, bekleyerek/karıştırarak homojenleşme, erken kaydı engelleme, sabit oran ile toplam miktarı ayırma, yağ–su tabakaları, hipotez ve gözlem defteri. Sayısal karışım özkütlesi hesabı yok; hacmi yaklaşık toplanan tam karışabilir ideal sıvı koşulu açık. Model gerçek çözelti nicel tahmini değildir.

7 yeni model testi; birleşik 443/443 yerel test geçti. Chromium/WebKit senaryosu hazırlanmış durumda; PR açılıp son HEAD CI sonuçları alınacak. Bilimsel kayıt MIXTURE-REVIEW.md. (d) eşit kollu terazi matematiği sınırı ilgili TYT sayfalarında denetlendi; AYT tork kapsamıyla karıştırılmadı.

## Açık sınırlar

- Gerçek iPad Safari/Apple Pencil, cihazda kaydırma ve akıcılık yapılmadı. Masaüstü WebKit veya touch emülasyonu gerçek cihaz kabulü değildir.
- Yerel Chromium OS `socket() failed: Operation not permitted` nedeniyle başlayamıyor; gerçek browser testleri GitHub Actions üzerinde çalıştı.
- Vercel otomatik dağıtımları bazı HEAD'lerde `api-deployments-free-per-day` (>100) limitine takıldı. Main merge üretimin güncellendiğini kanıtlamaz. Elle tekrar dağıtım tetikleme; yeni bir uygun toplu yayın aşamasında mevcut deployment SHA'sını kontrol et. Şu paketlerin canlı kabulü verilmedi.
- Ubuntu latest üzerindeki bir WebKit kurulumu uzadığı için browser işleri desteklenen Ubuntu 24.04'e sabitlendi; 15 dakika sınırı var. Kurulum hatasını test atlayarak geçme. Bazı kurulumlar uzun sürebiliyor.
- MEB geçiş açıklamaları 2028 yeni modele geçişi gösterir. ÖSYM 2027 ayrıntılı kapsam kılavuzu doğrulanmadı; SOURCES.md'yi güncel resmî kaynaklarla tekrar kontrol et.

## Sıradaki iş

1. Nitel karışım paketinin PR/son HEAD/CI'ını oku. 443 model/regresyon ve yeni karışım Chromium/WebKit, parent sayfayı etkilediği için geometrik hacim tarayıcı regresyonları başarılı olmalı. Başarılı/çakışmasızsa merge et. e ve d durumlarını son kanıtlarla kaydet; ana kazanımın f kısmı hâlâ bekler.
2. 9.2.1.1(f): Arşimet ve el-Hazinî'nin çalışmalarını resmî tarihçe kaynaklarıyla öğrenilmiş ölçüm yöntemine bağla. Kaynaklar: OGM Defterim Fizik 9 page51 (El-Hazinî), OGM Fizik10 Kavram Öğretimi page67 (Arşimet'in taç öyküsünde eş kütle/su yer değiştirme). Öykü öğretim bağlamıdır; özkütle tek başına malzeme saflığını kesin kanıtlar diye genelleme. Eşit kollu terazi denge hesabı ekleme.
3. 9.2.1.2 kuyumculuk/porselen/ebru kullanımını çok etkenli doğru model veya kontrollü çıkarım etkinliğiyle işle. Mevcut statik metni tamamlandı sayma. Ebru için OGM yanıtlarındaki yüzey gerilimi yönünü kör kopyalama; bilimsel doğrulama gerekir. Kitre/öd/boya/viskozite etkileşimini tek özkütle parametresine indirgeme.
4. Ardından 9.2.2 dayanıklılık, 9.2.3 yüzey olayları ve TYT Fizik tablosunun tüm kalan kazanımları; AYT Fizik, TYT Kimya, AYT Kimya, TYT Biyoloji, AYT Biyoloji. Birkaç deney, konu veya ders bitince durma. Altı alanın bütün kazanımlarını sonunda yeniden tara.

Komutlar: `node --test labs/*.test.cjs tests/*.test.js`, `node curriculum/render.cjs`, `node tests/karisim-browser.cjs chromium` / `webkit`; regresyonlar `tests/hacim-browser.cjs`, `tests/ozkutle-browser.cjs`, `tests/birim-browser.cjs`. Playwright 1.62.1 + ilgili browser/deps gerekir. Her paket güncel main üzerinden küçük PR olur.
