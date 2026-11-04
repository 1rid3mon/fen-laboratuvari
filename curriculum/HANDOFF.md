# Devam kaydı · 5 Kasım 2026

**Proje tamamlanmadı.** Altı alanın 431 ana kazanımı / 872 alt açıklaması başlangıç envanteri; eski sayfa varlığı kabul değildir. Tüm alanların öğrenme/doğruluk denetimi tamamlanana kadar bitmiş deme.

## Main'deki paketler

| PR | Konu | HEAD | Merge | Gözlenen doğrulama |
|---|---|---|---|---|
| #15 | MEB envanter/kapsam/kabul kuralları | fa7799b70b86806053b45a2f6fba65d8cdacbd43 | bcea32904f35001e17575d3770557e690d37dd8e | 3 envanter testi/CI |
| #16 | Özkütle ölçüm/grafik; c/ç | f9d263be1b9ac8e295db49150e98663d6f8c28c2 | dddf8141db9dd9a82f5329e82a6bf48a6f202058 | 419 model/regresyon + Chromium/WebKit; run 41917472473 |
| #17 | Geometrik hacimler; b | 2e26e5c0e86a80758a3198b1ea67e6e65b4e1cb2 | 155aa6d8f169971f34006da96112794a54af0df9 | 424 model/regresyon + Chromium/WebKit; run 41919512287 |
| #18 | Düzensiz hacim; b | 6c054c00cb670c3fa44de677e4936ebaa3fc7f9a | 245a14b57ce5fee09ff491445ac748a2c24f0e2f | Birleşik 429 model/regresyon + Chromium/WebKit; run 41920126437 |
| #19 | Kütle/hacim birimleri; a | 124e5b38f18b23959b09e814ddb17865378efc4e | feff0c8278a01e4027fc0e8f7713f535bb8a0148 | 436 model/regresyon + birim ve özkütle Chromium/WebKit; run 41921788586 / 41921788473 |

Main son okunan feff0c8278a01e4027fc0e8f7713f535bb8a0148. 9.2.1.1 a/b/c/ç main. (d) eşit kollu terazi matematiğine girmeme sınırı ilgili sayfalarda denetlendi. e/f henüz tamamlanmadı; ana kazanımı yükseltme.

## Açık paketler

- PR #20 `feature/qualitative-mixtures-20261105`, son bilinen HEAD 1e30e4044c327ae6aa6ffc571ed4fb3ebe3b50f9. Nitel karışım (e): tarifi baştan hazırlama, karıştırıcı/örnek ucu, homojenleşme, oran/miktar ayrımı, tabakalı örnekleme, defter/hipotez/soru. 443 yerel test; Chromium başarılı. Son okunuşta WebKit bağımlılık kurulumu sürüyordu. Run 41923480737; geometrik hacim regresyonu 41923480852. Son HEAD'in bütün sonuçlarını oku; eksik testle merge etme.
- `feature/density-history-20261105`, main #19 üzerinde bağımsız tarihçe (f) paketi. Özkütle atölyesine Arşimet esinli eşit-kütle/farklı-hacim ve el-Hazinî bağlantılı aynı-madde/farklı-büyüklük araştırmaları eklendi. Hazırlama düğmeleri ölçmez/kaydetmez; öğrenci mevcut terazi/suyla ölçüm akışını tamamlamalı. 2 yeni model testi, browser senaryosu genişletildi. Yerel 438 test (PR #20 henüz bu dalda yok). Bilimsel kayıt HISTORY-REVIEW.md. PR/HEAD aktarımı bu ilk kaydın yazıldığı anda sıradaki iş; güncel durumu GitHub'dan oku.

## Ortam, yayın ve kaynak sınırları

- Gerçek iPad Safari/Apple Pencil ve cihaz akıcılığı yapılmadı. CI masaüstü WebKit/touch bunun yerine geçmez. Yerel Chromium socket izniyle başlayamıyor; gerçek browser işleri GitHub Actions'ta çalıştı.
- Browser işleri Ubuntu 24.04 / Playwright 1.62.1, 15 dk sınırı. Kurulum uzarsa testi atlama; ayrı PR'da tut, sebebi kaydet, bağımsız pakete güncel main üzerinden geç. Kaynak/kanıt belgelerini birleştirirken yeni kayıtları eski belgeyle ezme.
- Vercel proje ID prj_IGbHMZd4pfzBH1X3t2auBqbUMe17, takım keremmert137-9933s-projects, proje fen-laboratuvari-github. Bazı otomatik dağıtımlar api-deployments-free-per-day limitinde başarısız. Son listelemede en yeni production bcea329 (#15) idi; sonraki deneyler main'de olmakla birlikte üretimde doğrulanmadı. #17 ve #19 preview READY kayıtları vardı. Preview promotion'ın production değişkenleriyle yeniden build yapabileceğini unutma; kotayı aşmak için kör promotion deneme. Elle ayrı dağıtımlar zorlanmadı.
- ÖSYM 2027 ayrıntılı kapsam kılavuzu doğrulanmadı; MEB 2018 programları ve 2028 geçiş dayanakları SOURCES.md'de. Resmî kaynaklardaki sadeleştirmeleri bilimsel gerçek diye koşulsuz kopyalama. Nitel karışımda hacim toplama varsayımı sınırlı; ebruda çok etkenlilik özellikle denetlenecek.

## Devam

1. #20'nin son HEAD CI'ını oku, bütün kod/regresyon/tarayıcı kontrolleri başarılı/çakışmasızsa merge et. Sonra tarihçe dalını o güncel main ile birleştir; her iki paket öğrenme/kapsam kanıtlarını koruyarak tekrar test et. Birleşik beklenen toplam 445 (443 + 2 tarihçe).
2. Tarihçe PR'sinin son HEAD Chromium/WebKit ölçüm akışları başarılıysa merge et. a/b/c/ç/d/e/f kanıtları main'e girdikten sonra 9.2.1.1 üst kazanımını yeniden denetle ve uygun statüye yükselt; gerçek cihaz/canlı ayrı bekler.
3. 9.2.1.2 kuyumculuk/porselen/ebru. Tek başına özkütlenin saflık/kalite/ebru desenini kesin belirlediğini söyleme. Porselende bileşim/gözenek/işlem; ebruda yüzey/viskozite/kitre/öd etkileri ayrılmalı. Kaynak yetersizse ölçülmüş veri uydurma; açık sınırlı doğru model veya kontrollü bilimsel çıkarım etkinliği tasarla.
4. 9.2.2 dayanıklılık, 9.2.3 adezyon/kohezyon/kılcallık/yüzey gerilimi; sonra bütün TYT Fizik, AYT Fizik, TYT Kimya, AYT Kimya, TYT Biyoloji, AYT Biyoloji tablolarının her satırı. Sonunda altı alanı yeniden taramadan nihai bitiş deme.

Komutlar: node --test labs/*.test.cjs tests/*.test.js; node curriculum/render.cjs; node tests/ozkutle-browser.cjs chromium / webkit; karisim-browser.cjs, hacim-browser.cjs, birim-browser.cjs regresyonları.
