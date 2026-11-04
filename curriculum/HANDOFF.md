# Fen Laboratuvarı devam kaydı · 5 Kasım 2026

**Proje tamamlanmadı.** Hedef altı alanın bütün ilgili kazanımları. 431 ana kazanım / 872 alt açıklama satırı başlangıç envanteri var; her alt açıklama gerektiğinde daha küçük kavramlara bölünmelidir. Eski bir sayfanın varlığı kabul değildir.

## Main'e alınan paketler

| PR | İçerik ve kapsam | Son doğrulanmış HEAD | Main merge | Test |
|---|---|---|---|---|
| #15 | Altı kapsam tablosu, MEB kaynakları, kanıt kapısı, AGENTS | fa7799b70b86806053b45a2f6fba65d8cdacbd43 | bcea32904f35001e17575d3770557e690d37dd8e | 3 yeni envanter testi / CI başarılı |
| #16 | Özkütle ölçümü, hipotez, defter, grafikler; 9.2.1.1 c/ç | f9d263be1b9ac8e295db49150e98663d6f8c28c2 | dddf8141db9dd9a82f5329e82a6bf48a6f202058 | 419 model/regresyon; Chromium/WebKit başarılı; run 41917472473 |
| #17 | Küp/prizma/silindir/küre, bağımsız ölçü uçları, ölçek hipotezleri; b düzgün şekiller | 2e26e5c0e86a80758a3198b1ea67e6e65b4e1cb2 | 155aa6d8f169971f34006da96112794a54af0df9 | 424 model/regresyon; Chromium/WebKit başarılı; run 41919512287 |
| #18 | Düzensiz cismin gerçek batmış profili, su korunumu ve ölçümü; b düzensiz şekiller | 6c054c00cb670c3fa44de677e4936ebaa3fc7f9a | 245a14b57ce5fee09ff491445ac748a2c24f0e2f | Birleşik 429 model/regresyon; Chromium/WebKit başarılı; run 41920126437 |

Main son gözlenen: 84fe93695603ab365d721d435de47dc4ed5e8ccf. a/b/c/ç/d/f alt açıklamalarının main kanıtları JSON'a işlendi. Ana 9.2.1.1 henüz tamamlanmadı. Bilimsel kayıtlar DENSITY-REVIEW.md, VOLUME-REVIEW.md, IRREGULAR-REVIEW.md.

PR #19 da tamamlandı: HEAD `124e5b38f18b23959b09e814ddb17865378efc4e`, merge `feff0c8278a01e4027fc0e8f7713f535bb8a0148`. Birim ve özkütle Chromium/WebKit senaryoları başarılı; 436 test geçti. 9.2.1.1(a) main olarak kaydedildi.

PR #21 tarihçe tamamlandı: HEAD `1f529e952b24f381db03e4787692b995bc73ee12`, merge `84fe93695603ab365d721d435de47dc4ed5e8ccf`. 438 model/regresyon ve Chromium/WebKit başarılı; run 41924828360.

## Güncel paket — PR #20

Dal feature/qualitative-mixtures-20261105, nitel karışım (e). Tarihçe main'i 84fe936 ile birleştirilmiş son HEAD hazırlanıyor; HEAD'i GitHub'dan oku. A/B kaynakları, yeni hazırlama kimliği, karıştırıcı ve örnek ucu doğrudan sürüklenir; aynı oran/farklı miktar, kontrollü hipotez, tabakalı örnekleme, defter ve soru. Bilimsel kayıt MIXTURE-REVIEW.md.

İlk karışım Chromium testi geçti; WebKit bağımlılık kurulumu uzadığı için browser işi resmî Playwright 1.62.1 noble imajına taşındı. Sistem/browser kurulumu hazır gelir; npm paketi aynı sürümdür ve executable varlığı kontrol edilir. Gerçek Chromium/WebKit deney testleri aynen çalışır, atlanmaz. Yeni HEAD için tüm sonuçları bekle. Yerel birleşik 445/445 model/regresyon testi geçti (443 + 2 tarihçe).

## Kabul ve yayın sınırları

Gerçek iPad Safari/Apple Pencil ve cihaz akıcılığı yapılmadı. Yerel Chromium OS socket izniyle başlayamadı; gerçek browser testleri Actions'ta. Masaüstü WebKit/touch gerçek cihaz sayılmaz. 431/872 envanterinin geri kalanı ayrı öğrenme/bilimsel kabul bekler. Üst kazanımı tüm alt açıklamaları main'e girmeden yükseltme.

Vercel proje prj_IGbHMZd4pfzBH1X3t2auBqbUMe17 / fen-laboratuvari-github, takım keremmert137-9933s-projects. Bazı otomatik dağıtımlar günlük sınırda; son gözlenen production bcea329 (#15), #17/#19 preview READY. Main yeni deneylerin üretimde olduğu anlamına gelmez. Uygun toplu yayın aşamasında üretim SHA'sını yeniden oku, tek tek elle yeniden dağıtım zorlama. Preview promotion production değişkenleriyle yeniden build yapabilir.

ÖSYM 2027 ayrıntılı kapsam kılavuzu doğrulanmadı; MEB 2018 ve 2028 geçiş dayanakları SOURCES.md'de. Ebru/karışım kaynaklarını koşulsuz bilimsel genelleme diye kopyalama.

## Sıradaki işler

1. #20 son HEAD'in bütün CI (model, envanter, karışım Chromium/WebKit, gerekli regresyonlar) başarılı ve çakışmasızsa main'e al. e durumunu gerçek HEAD/merge/run kanıtıyla yükselt; 9.2.1.1(a/b/c/ç/d/e/f) bütünlüğünü tekrar incele. Tam ana kazanımı ancak bundan sonra main statüsüne çıkar. Canlı/gerçek cihaz ayrı bekler.
2. 9.2.1.2 kuyumculuk/porselen/ebru: örneği tek özkütle parametresine indirgeme. Kuyumculukta yalnız özkütle saflık kanıtı değildir. Sabit bileşimli kapalı gözenek modeli porselende kütle/dış hacim ilişkisini anlatabilir; gerçek kalite/fırınlama tahmini yapmaz. Ebruda aynı özkütlede yüzey/viskozite farkıyla farklı davranışı kontrollü incele; ölçülmüş veri uydurma.
3. Araştırılmış birincil ek kaynaklar: APS Gallery of Fluid Motion 2023 marbling (https://gfm.aps.org/meetings/dfd-2023/649b3ad8199e4c137897831b), Physical Review Fluids 9,110506 (2024), üniversite PDF https://people.math.wisc.edu/~spagnolie/Papers/sbsr24.pdf ; porselen gözenek/bulk density araştırması https://pmc.ncbi.nlm.nih.gov/articles/PMC9821833/ . Bunlar iç model doğrulaması içindir; öğrenciye müfredat dışı akışkan denklemleri yükleme.
4. 9.2.2 dayanıklılık, 9.2.3 adezyon/kohezyon/kılcallık/yüzey gerilimi; sonra TYT Fizik, AYT Fizik, TYT Kimya, AYT Kimya, TYT Biyoloji, AYT Biyoloji'nin tüm kapsam satırları. Konu veya ders bitince durma; sonunda bütün alanları tekrar tara.

Komutlar: node --test labs/*.test.cjs tests/*.test.js; node curriculum/render.cjs; node tests/karisim-browser.cjs chromium / webkit; ozkutle-browser.cjs, hacim-browser.cjs, birim-browser.cjs regresyonları.
