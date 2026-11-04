# Özkütle ölçüm atölyesi — bilimsel ve öğrenme denetimi

Kapsam: MEB 2018 Fizik 9.2.1.1 b/c/ç'nin ölçüm ve grafik alt kavramları. Ana kazanımın tamamlandığı iddia edilmez. Program sınırları için SOURCES.md ve resmî Fizik programı s. 16.

## Modelin bağımsız fizik kontrolü

- Aynı saf, homojen malzeme, sabit sıcaklık ve basınç: `m = ρ V`. Numune büyütülünce m ve V birlikte değişir. Alüminyum/demir/bakır sayıları yuvarlatılmış ideal ders örnekleridir, hassas gerçek malzeme ölçümü değildir.
- Numune dik prizma: taban `2,5 × 4 = 10 cm²`, yükseklik `V/10 cm`. Kap kesiti `20 cm²`; 500 mL yüksekliği 25 cm. Düşey ölçek 10 çizim birimi/cm olduğundan 1 mL, 0,5 çizim birimi seviye oluşturur. Numune genişliği kap genişliğinin yarısıdır; ortak 4 cm derinlik varsayımıyla kesit alanları ve çizimler tutarlıdır.
- Sıvının hacmi korunur: toplam kap okuması `Vsu + Vbatmış`; yüzey bu eşitliği sağlayan yüksekliktir. Tam batmada hacim artışı V, yarım batmada V/2 olur. Seviye ve batmış kesit birlikte çözüldüğü için yarım batırılmış cismin yükselttiği su tam hacim diye sunulmaz.
- En büyük 150 cm³ numune, 250 mL başlangıç suyuyla toplam 400 mL okuma verir; 500 mL kapta taşma yoktur. Su yetersizken numune tabana dayansa da tam batmış sayılmaz; öğrenciye suyu artırması/küçük numune seçmesi söylenir.
- Tartım su dışında ideal terazidedir. Su içindeki görünür ağırlık kütle ölçüsü diye kullanılmaz. ρ=m/(Vson−Vilk) yalnız pozitif/geçerli ölçümlerde hesaplanır.
- Ölçülen kütle–hacim noktaları aynı malzeme için orijinden geçen doğruyu; özkütle–kütle ve özkütle–hacim noktaları sabit oranı gösterir. Farklı malzemeler ayrı renklerle çizilir. Malzeme değiştirerek yalnız hacim etkisi test edilemez; karşılaştırma bunu reddeder.
- Serbest yüzme/batma dinamiği, menisküs, ölçüm belirsizliği ve sıcaklık değişimi bu deneyde yoktur. El ile tutulan, çözünmeyen/emmeyen katı modeli ekranda açıklanır. Karışım özkütlesi hesabı, kum–su ve eşit kollu terazi hesapları yoktur.

## Öğrenme döngüsü ve yanlış çıkarım önlemleri

1. Öğrenci saf numune ve boyutunu seçer; numuneyi ve köşedeki boyut kontrolünü sürükleyebilir.
2. “Hacim iki katına çıkınca özkütle” hipotezini ölçümden önce kaydeder.
3. Terazide kütle, suya tam batırınca hacim ölçer. Sahnede taşımayla aynı işi yapan klavye erişilebilir düğmeler bulunur.
4. Kısmi batırma tam hacim olarak kaydedilemez. Ölçülmemiş numune ve eski numuneye ait ölçümler kullanılamaz.
5. İki farklı hacim deftere kaydedilir; grafikler yalnız kaydedilen verilerle oluşur. CSV indirilebilir.
6. Son iki ölçümde malzeme sabitliği ve hacim farkı aranır; oranlar ve önceki hipotez karşılaştırılır.
7. Açıklama öğrenci tarafından yazılır; araç serbest metni otomatik bilimsel olarak onaylamaz. Ölçümlere dayanan öz değerlendirme verir.
8. Özgün YKS tarzı soruda yanlış seçeneklere özel oran gerekçesi sunulur. Günlük hayatta özkütlenin kullanımının tek başına kesin malzeme teşhisi olmadığı belirtilir.

## Kabul kanıtları ve sınırlar

- `labs/ozkutle-olcum.test.cjs`: 9 model testi; hacim ve su sınırları, kısmi/tam batma, her derinlikte korunma, duvar taşması, orantı, geçersiz değerler, ölçüm/karşılaştırma kontrolü.
- Yerel tüm testler: 419/419 geçti (407 eski + 3 envanter + 9 yeni).
- `tests/ozkutle-browser.cjs`: gerçek tarayıcı sürüklemesi, kütle/hacim koşulları, hipotez, defter, grafikler, su değişimi, yetersiz su, pointer iptali, Chromium gerçek touch protokolüyle iki parmak, özgün soru, CSV ve iki ekran yönü. Çalışma sonucu CI'da ayrıca kaydedilecek; senaryo dosyasının bulunması başarılı çalışma sayılmaz.
- Yerel Chromium socket izni nedeniyle başlayamadı. Gerçek iPad Safari, Apple Pencil, gerçek cihazdaki kaydırma ve animasyon/etkileşim akıcılığı **doğrulanmadı**.

Kalan 9.2.1.1: a birimler; b diğer şekiller ve düzensiz cisimler; d terazi sınırı; e nitel karışımlar; f tarihçe. Mevcut sayfalardaki karşılıkları ayrıca denetlenecek. `9.2.1.2`, dayanıklılık ve yüzey olayları ayrı paketlerdir.
