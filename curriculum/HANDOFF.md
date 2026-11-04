# Fen Laboratuvarı devam kaydı · 5 Kasım 2026

**Proje tamamlanmadı.** Hedef altı alanın bütün kazanımlarıdır. 431 ana kazanım ve 872 alt açıklama başlangıç envanteri çıkarıldı. Sadece aşağıdaki alt kavramlar için yeni kanıt vardır; kalan satırları bitmiş varsayma.

## Tamamlanan paketler

| Paket | PR | HEAD | Main merge | Kanıt |
|---|---|---|---|---|
| MEB envanteri, altı kapsam tablosu ve kabul kuralları | #15 | fa7799b70b86806053b45a2f6fba65d8cdacbd43 | bcea32904f35001e17575d3770557e690d37dd8e | 3 envanter testi ve CI coverage-ledger geçti |
| Özkütle ölçüm öğrenme döngüsü | #16 | f9d263be1b9ac8e295db49150e98663d6f8c28c2 | dddf8141db9dd9a82f5329e82a6bf48a6f202058 | 419/419 test, Chromium/WebKit başarılı; actions/runs/41917472473 |

Özkütlede 9.2.1.1(c)/(ç) ölçüm ve grafik alt açıklamaları main'e alındı. Bütün 9.2.1.1 tamamlanmadı. Bilimsel gerekçe DENSITY-REVIEW.md. Gerçek iPad ve canlı doğrulanmadı.

PR #17 son HEAD `2e26e5c0e86a80758a3198b1ea67e6e65b4e1cb2` için tüm CI başarılı oldu; Chromium ve WebKit geçti. Main merge: `155aa6d8f169971f34006da96112794a54af0df9`. CI: https://github.com/1rid3mon/fen-laboratuvari/actions/runs/41919512287.

## Açık paketler ve son durum

- **PR #17 tamamlandı; aşağıdaki ilk deneme kaydı tarihseldir**, `feature/volume-shapes-20261105`: küp/prizma/silindir/küre; a/b/h/r uçlarını sürükleme, tek boyut ile benzer büyütme, hipotez, defter, oran/grafik, hacim birimleri, soru. Son bilinen HEAD `2e26e5c0e86a80758a3198b1ea67e6e65b4e1cb2`; mutlaka yeniden oku. 424 model/regresyon testi geçti. Önceki Chromium geçti; WebKit kurulumu uzadı. Son HEAD browser runner Ubuntu 24.04 ve 15 dakika sınırı kullanır; bu yeni HEAD'in bütün CI sonuçları alınmadan merge yapma. Bir ilk test, üst sınırdaki b boyutunu daha da artırmayı bekliyordu; içeri doğru sürükleme ile düzeltildi, model sınırı gevşetilmedi.
- **PR #18 — düzensiz profil paketi**, `feature/irregular-density-20261105`: güncel main dddf814 üzerinden bağımsız başlandı. Özkütle modelini gerçek çokgenin su altındaki alanını kullanacak biçimde genişletir. 424 yerel test geçti (PR #17 bu dalda yok); 5 yeni model testi ve gerçek tarayıcı senaryosuna düzensiz şekil sürükleme/tartım/kısmi–tam batırma/defter kontrolü eklendi. Bilimsel kayıt IRREGULAR-REVIEW.md. İlk HEAD b122865b5b3fd84c79a5b43cf0a513151e0bcdc7. PR #17 main'e alındıktan sonra güncel main 155aa6d ile birleştirilip bütünleşik CI yeniden çalıştırılıyor; son HEAD'i GitHub'dan oku.

## Ortam ve yayın sınırları

- Başlangıç 200 dosyalı main 44513cc12beca7a4418a5d386272bdf92d3ac795 idi; 407 test geçti.
- Yerel Chromium OS tarafından `socket() failed: Operation not permitted` ile engelleniyor. Yerelde test dosyasının bulunması tarayıcı testi geçti demek değildir. GitHub CI gerçek Chromium ve masaüstü WebKit çalıştırır.
- Gerçek iPad Safari/Apple Pencil, cihazdaki kaydırma ve akıcılık yapılmadı. CI touch ve yön testleri bunun yerine geçmez.
- Vercel otomatik dağıtımı `api-deployments-free-per-day` (>100) sınırına takıldı. Bu kod testi hatası değildir; elle tekrar üretim dağıtımı zorlama. Canlı doğrulama bekler.
- MEB açıklamaları 2028 yeni model geçişini destekliyor; ÖSYM 2027 ayrıntılı kapsam kılavuzu doğrulanmadı. SOURCES.md'yi güncel resmî belgelerle yeniden kontrol et.

## Sıradaki somut işler

1. PR #18'in güncel HEAD'i için bütünleşik 429 model/regresyon ve Chromium/WebKit CI sonuçlarını doğrula. Başarılı/çakışmasız ise main'e birleştir; son HEAD ve merge SHA'yı kaydet. PR #17 artık main'de, tekrar merge etmeye çalışma.
2. Düzensiz profil PR'sini oluştur, 424 test ile Chromium/WebKit sonuçlarını doğrula. Başarılıysa merge et. İki açık paket curriculum kayıtlarına dokunduğundan kapsam/devir kayıtlarını kaybetmeden çakışmayı çöz; yalnız eski belgeyi seçerek yeni kanıtı silme.
3. İkisi de main'e girince 9.2.1.1(b) bütün geometrik/düzensiz cisim karşılıklarını birlikte tekrar denetle. Sonrasında (a) kütle birimleri, (d) kapsam sınırı, (e) nitel karışımlar, (f) tarihçe ve 9.2.1.2 günlük yaşam öğrenmesini gerçek etkileşimle tamamla.
4. TYT fizik tablosunun her kazanımı/alt kavramına devam et; sonra AYT Fizik, TYT Kimya, AYT Kimya, TYT Biyoloji, AYT Biyoloji. Eski sayfaları otomatik kabul etme. En sonda altı alanı tekrar tarayıp hiçbir alt kavramın atlanmadığını kontrol et.

Komutlar: `node --test labs/*.test.cjs tests/*.test.js`, `node curriculum/render.cjs`; tarayıcılar: `node tests/ozkutle-browser.cjs chromium` / `webkit`, PR #17 için `node tests/hacim-browser.cjs chromium` / `webkit`. Playwright 1.62.1 ve ilgili browser/deps kurulmalıdır.
