# Begüm için TYT Coğrafya — Harita Laboratuvarı 🦋

**Bağımsız adres:** /labs/cografya-harita.html

## Müfredat ve tasarım
Yalnızca TYT coğrafya, 2018 MEB 9–10 coğrafya kazanımları. AYT coğrafya veya Maarif Modeli dahil edilmez. 2027 YKS nihai kapsamı ÖSYM duyurusuyla doğrulanmalıdır. Haritalar TYT denemesi gibi sade, gri ve isimsizdir; kelebekler harita dışında kullanılır.

## Üç mod
1. Keşfet: Dünya, Türkiye, izohips; noktaya dokunarak neden-sonuç öğrenme. Yer adlarını gösterme yalnız isteğe bağlı.
2. Hatırla: Beş seçenekli gri haritada cevabı bulma, hemen açıklama.
3. TYT Sınavı: Özgün, beş soruluk mini deneme; sonuca kadar doğru cevap gizli, net hesabı (doğru − yanlış/4).

Yanlışlarım Haritası yalnız tarayıcı localStorage üzerinde tutulur; 1, 3, 7, 14, 30 gün aralıklı tekrar ve kayıt silme sağlanır.

## Konular
Coğrafi konum, enlem-boylam, yarımküre ve mevsimler; izohips/yer şekilleri; iklim, sıcaklık, rüzgâr, yağış, deniz akıntıları; Türkiye'nin yer şekilleri, delta ve gölleri; bitki/toprak; nüfus, göç, yerleşme; tarım/ekonomi; bölge ve uluslararası deniz ulaşımı; deprem, heyelan, yangın ve çevre.

Bu uygulama **harita temelli tekrar/soru** aracıdır. Ölçek hesapları, nüfus piramitleri veya iklim grafikleri gibi bütün harita dışı TYT alt soru türlerini baştan sona öğretme iddiası yoktur. Sorular özgündür, ÖSYM sorusu değildir.

## Haritalar ve lisans
- cografya-dunya.geojson: 180 ülke/bölge, johan/world.geo.json / Natural Earth, kamu malı. İhtilaflı sınırlar veri kaynağının varsayılan gösterimidir, politik tavır değildir.
- cografya-iller.geojson: 81 il, theaiagent/turkiye_iller_geojson, © OpenStreetMap katkıcıları, ODbL 1.0. Orijinal veri dosyası ODbL lisansı ve atıf şartları altındadır. Resmî idari sınır belgesi değildir.
- cografya-veri.js: 78 özgün beş seçenekli soru, 64 gerçek WGS84 konum örneği, izohips şemaları.
- cografya-harita.js + cografya-harita.css: bağımsız statik uygulama, responsive, yerel tekrar.

İzohipsler şematiktir, gerçek yükselti rasterı değildir. Deprem tehlikesi kesin deprem tahmini anlamına gelmez.

## Testler
Node 22: node --test labs/cografya.test.cjs

Doğrulamalar: GeoJSON 180 ülke ve 81 il, 78 soru/5 seçenek, koordinatlar, harita alanı geçişleri, gri sınav haritası, seçenekler, yanlış kaydı, deneme neti.

## Kaynaklar
MEB TYT Coğrafya konu listesi:
https://yenimahalle.meb.gov.tr/meb_iys_dosyalar/2025_11/19151058_2025ykskitapcikkonuvesorudagilimi.pdf

OpenStreetMap: https://www.openstreetmap.org/copyright

İl geometrisi kaynağı: https://github.com/theaiagent/turkiye_iller_geojson

ODbL: https://opendatacommons.org/licenses/odbl/1-0/
