# TYT Fizik 2018 MEB — bütün modüller geliştirme ve kabul matrisi

**Tarih:** 4 Kasım 2026 · **YKS 2027 kapsamı:** 2018 MEB Fizik Öğretim Programı 9–10. sınıf kazanımları. **Maarif Modeli dahil değildir.** Bu dosya laboratuvarın öğrenme doğruluğu için doğrulama ve açık-iş kaydıdır; %100 fiziksel veya cihaz kabul belgesi **değildir**.

Resmî 2018 kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf

| TYT kazanım grubu | Gerçekte mevcut kod/deney | Otomatik gözlem veya fizik testi | Kalan manuel kabul |
|---|---|---|---|
| 9.1 Fizik Bilimine Giriş | `tyt-fizige-giris.html`: SI ve tek boyutlu vektör. `tyt-dort-atolye.html?topic=intro`: cetvel ve sürüklenen vektörler. `tyt-akiskan-dalga.html`: CERN, NASA/ESA ve TÜBİTAK örnekleri | `tyt-fizige-giris.test.cjs`, `tyt-dort-atolye-ui.test.cjs`, 10-ünite link testi | Fizik alt dalları/bilimsel etik örnekleriyle tam kazanım bazında öğretmen onayı, iPad ekran kabulü |
| 9.2 Madde ve Özellikleri | `tyt-madde-ozellikleri.html`: özkütle/grafik/dayanıklılık/adezyon/kohezyon/kılcallık/yüzey gerilimi. `tyt-madde-tamamlayici.html`: geometrik hacim/karışım/yaşam uygulamaları. `tyt-dort-atolye.html?topic=matter`: birden çok cismin dereceli silindire atılması | Matematik ve su seviye denetimi, kütle-hacim dönüşümü, `tyt-madde*.test.cjs` ve dört atölye testleri | Yüzey gerilimi ve adezyon görsellerinin bire bir doğruluğu, 3B hacim/menisküs, gerçek iPad kabulü |
| 9.3 Hareket ve Kuvvet | `tyt-hareket-temelleri.html`: yol, yer değiştirme, sürat/hız ve grafikler. **Yeni ayrı TYT** `tyt-mekanik-2018.html`: öteleme/dönme/titreşim, dört temel kuvvet, gözlemci, ivme, Newton, sürtünme, etki–tepki | `tyt-mekanik-2018-model.test.cjs`, `tyt-mekanik-2018-ui.test.cjs`, `tyt-hareket-temelleri.test.cjs` | Animasyonların Safari dokunmatik akıcılığı ve tüm kuvvet-oklarının gerçek sahnede son onayı |
| 9.4 Enerji | **Yeni ayrı TYT** `tyt-mekanik-2018.html`: yatay iş ve güç, enerji dönüşümü (sürtünme ısısı dahil), verim, yenilenebilir/yenilenemez kaynaklar | İşaretli iş, toplam enerji korunumu ve verim testleri | Günlük yaşamda besin ve fiziksel etkinlik örneklerinin kapsamı ve grafiklerin öğretmen kabulü |
| 9.5 Isı ve Sıcaklık | `isi-sicaklik.html`: özgün 15 deney (kürenin halkadan geçmesi, genleşme, termometre, suyun 4 °C özelliği, yalıtım vb.). `tyt-dort-atolye.html?topic=heat`: temas ettirilen iki cismin enerji koruyan ısı alışverişi ve genleşme | `isi-sicaklik.test.cjs` + dört atölye fizik/UI testleri | Eski 15 sahnenin her birinde görsel-fizik öğretmen denetimi ve gerçek iPad/Safari kabulü |
| 9.6 Elektrostatik | `tyt-elektrostatik.html`: yüklenme, etki, dokunma, elektroskop, topraklama ve elektrostatik etkileşim sahneleri | `tyt-elektro.test.cjs` ve ayrı TYT elektrostatik Actions | Eşit/ters yük, sınır durumları için gerçek cihaz ve öğretmen onayı |
| 10.1 Elektrik ve Manyetizma | `tyt-devre.html`: kablolarla kurulan devre, seri-paralel, kısa devre, parlaklık, ölçü aletleri, mıknatıs/pusula/alan, güvenlik | `tyt-devre.test.cjs` ve ayrı devre Actions | Kısa devre ve tüm gerçek dokunmatik bağlantı senaryoları için gerçek cihaz kabulü |
| 10.2 Basınç ve Kaldırma | `tyt-basinc-v3.html`: eğik/farklı kaplar, dört hidrostatik prob, katı bloklar, gaz pistonu (nitel), birden çok cisim, ipli balon ve eriyen buz. `tyt-akiskan-dalga.html`: nitel Bernoulli ve Torricelli | `tyt-basinc-v3*.test.cjs`, `tyt-akiskan-dalga*.test.cjs`, model-sınır testleri | Çoklu cisim çarpışması, taban tepki kuvveti, kapalı gaz termodinamiği gerçek zamanlı **modellenmiyor**; ideal sınırlamalar görünür, gerçek iPad/öğretmen kabulü gerekli |
| 10.3 Dalgalar | `tyt-dort-atolye.html?topic=waves`: yay atması ve serbest/sabit uç, karşılaşma, su derinliğinde kırılma, ses boyuna tanecikler. `tyt-akiskan-dalga.html`: düz engel ve odak kaydırmalı parabolik engelde yansıma, deprem güvenliği | `tyt-dort-atolye*.test.cjs`, `tyt-akiskan-dalga*.test.cjs`, ideal parabol odak doğrulaması | Tam dalga dinamiği, girişim/kırınım ve sönümleme modellenmiyor; çizimle hesap/gerçek cihaz kabulü ayrı |
| 10.4 Optik | `optik-ayna-mercek.html`: dokunmatik ayna ve mercekler; gölge, renk, aydınlanma, kırılma sayfaları. `tyt-optik-prizma.html`: renklerine ayrılan ışık ve parmakla taşınan prizma | `tyt-optik-prizma*.test.cjs` ve optik sayfaları için statik sınırlama testleri | Tüm optik sahnelerin uç değerlerinde doğrulama, gerçek Safari ve öğretmen incelemesi |

## Zorunlu koruyucular

1. **TYT–AYT ayrımı:** 11. sınıf `newton-hareket-yasalari.html` ve `is-guc-enerji.html` AYT'dir; TYT'ye taşınmaz. TYT 9.3–9.4 için `tyt-mekanik-2018.html` ayrı sayfa.
2. **Sayısal kapsam:** Gaz yasası hesapları; kılcallık yükselme sayısal hesabı; su dalgasının kırılma açıları; TYT genleşme; ayna/mercek görüntü uzaklığı ve büyütme; görünür derinlik hesapları öğrenciye sayısal sorular olarak gösterilmez. Model motorunda gereken fiziksel sayılar çizim tutarlılığı için iç kullanımdadır.
3. **İdeal modeller:** İki boyutlu görselin üç boyutlu fizik motoru olduğu iddia edilmez. Çarpışma, sürtünme, damla, ileri gaz veya deprem tahmini mekanikleri gerçekte modellenmiyorsa buna uygun not gösterilir.
4. **Test kavramı:** Node.js testleri yalnız regresyon ve hesap tutarlılığını denetler. Gerçek iPad yatay/dikey Safari, Apple Pencil, çoklu parmak, okunabilirlik ve gerçek görsel değerlendirme yapılmadığı için **cihaz kabulü açık**.
5. **Yayın:** PR #10 taslak; `main` ve Vercel üretim dağıtımı değişmedi. Son Vercel birleşik kontrolünde `build-rate-limit` hatası görüldü. Limit kalkmadan ve tüm gözlemsel kabul tamamlanmadan birleştirme yapılmaz.

## Yayına çıkmadan önce son kontrol listesi

- [x] On temel TYT kazanım grubuna erişilen modül var; 2018 MEB TYT/AYT navigasyonu ayrılmış.
- [x] Hareket, enerji, su dalgası engelleri, akışkanlar ve prizma gibi önceki boşluklar için yeni etkileşim kodu geliştirildi.
- [x] Yeni fizik modelleri, parmak hareketleri ve eski devre/elektrostatik/ısı regresyonları GitHub Actions'a bağlandı.
- [ ] Öğretmen/tam metin karşılaştırmasıyla **her kazanımın öğrenme çıktısı** manuel onaylandı.
- [ ] Tüm eski ve yeni görseller iPad/Safari/Apple Pencil üzerinde gerçekten denendi.
- [ ] Bazı ideal sınırlamaların üstüne tam dinamik fizik motoru eklendi (özellikle çarpışma, çoklu cisim taban teması).
- [ ] Vercel dağıtım limiti aşıldı; üretim sayfası ve SHA gerçek cihazda doğrulandı.
- [ ] Tüm kabul belgeleri yeşil olduktan sonra PR #10 `main`e alındı.

**Üslup ve ürün kuralı:** “Dosya var” = “tamamlandı” değildir. “CI yeşil” = “fizik kusursuz” değildir. Kullanıcı için yanlış öğretme riski varsa bileşen taslak olarak kalır.
