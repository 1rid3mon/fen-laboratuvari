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

## Güncel paket

Dal `feature/measurement-units-20261105`, güncel main #18 üzerine hazırlanıyor. Kütle/hacim birimleri için ayrı düzenekler; kütle/su ekleme–çıkarma, su seviyesi sürükleme, birim değişiminde aynı fiziksel miktarı koruma, hipotez, kontrollü defter, kendi sayısal yanıtı, açıklama ve özgün soru. 9.2.1.1(a), mg/g/kg/ton ve mL/L/cm³/dm³/m³. Kütle ile hacim birbirine dönüştürülemez.

7 yeni model testi ve Chromium/WebKit gerçek pointer senaryosu var. Yerel birleşik 436 test geçti. Bu kaydın ilk yazımında PR/HEAD aktarımı sıradaki işlemdir; en güncel PR/HEAD/CI'ı GitHub'dan oku. Bilimsel gerekçe UNITS-REVIEW.md. CI başarılı ve çakışmasız olmadan main'e alma.

## Açık sınırlar

- Gerçek iPad Safari/Apple Pencil, cihazda kaydırma ve akıcılık yapılmadı. Masaüstü WebKit veya touch emülasyonu gerçek cihaz kabulü değildir.
- Yerel Chromium OS `socket() failed: Operation not permitted` nedeniyle başlayamıyor; gerçek browser testleri GitHub Actions üzerinde çalıştı.
- Vercel otomatik dağıtımları bazı HEAD'lerde `api-deployments-free-per-day` (>100) limitine takıldı. Main merge üretimin güncellendiğini kanıtlamaz. Elle tekrar dağıtım tetikleme; yeni bir uygun toplu yayın aşamasında mevcut deployment SHA'sını kontrol et. Şu paketlerin canlı kabulü verilmedi.
- Ubuntu latest üzerindeki bir WebKit kurulumu uzadığı için browser işleri desteklenen Ubuntu 24.04'e sabitlendi; 15 dakika sınırı var. Kurulum hatasını test atlayarak geçme. Bazı kurulumlar uzun sürebiliyor.
- MEB geçiş açıklamaları 2028 yeni modele geçişi gösterir. ÖSYM 2027 ayrıntılı kapsam kılavuzu doğrulanmadı; SOURCES.md'yi güncel resmî kaynaklarla tekrar kontrol et.

## Sıradaki iş

1. Birim paketi PR'sini aç/son HEAD'ini kontrol et. 436 model/regresyon, yeni birim Chromium/WebKit ve parent sayfayı etkilediği için özkütle tarayıcı regresyonlarının hepsi başarılı olmalı. Birleştir; HEAD/merge SHA ve run bağlantılarını buraya kaydet; (a) alt maddesini kanıtla yükselt.
2. 9.2.1.1(d) bir deney kazanımı değil kapsam sınırıdır: eşit kollu terazi matematiği bu konuya sokulmayacak. İlgili TYT sayfalarını denetle, AYT tork/makine matematiğiyle karıştırma.
3. 9.2.1.1(e) nitel karışım özkütlesi; sayısal karışım hesabı yapmadan öğrencinin koşulları değiştirdiği bir deney. Mevcut tamamlayıcı sayfadaki statik metni tamamlandı sayma.
4. 9.2.1.1(f) Arşimet/el-Hazinî tarihçesini resmî kaynakla doğrula; öğrenilmiş ölçüm yöntemiyle ilişkilendir. Sonra 9.2.1.2 kuyumculuk/porselen/ebru kullanımını çok etkenli doğru modeller veya kontrollü çıkarım etkinliğiyle işle.
5. Ardından TYT fizik tablosunun sıradaki tüm kazanımları; AYT Fizik, TYT Kimya, AYT Kimya, TYT Biyoloji, AYT Biyoloji. Birkaç deney, bir konu veya bir ders bitince durma. Altı alanın tüm kazanımlarını sonunda yeniden tara.

Komutlar: `node --test labs/*.test.cjs tests/*.test.js`; `node curriculum/render.cjs`; `node tests/birim-browser.cjs chromium` / `webkit`; regresyon için `tests/ozkutle-browser.cjs` ve `tests/hacim-browser.cjs`. Playwright 1.62.1 + ilgili browser/deps gerekir. Her yeni paket güncel main üzerinden küçük bağımsız PR olur.
