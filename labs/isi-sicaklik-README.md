# TYT Fizik — Isı, Sıcaklık ve Genleşme (2018 MEB)

**Kapsam:** 2018 MEB Fizik Öğretim Programı 9.5.1–9.5.5, TYT. Yeni Maarif Modeli kullanılmaz. Kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf (s. 19–21).

## 15 etkileşimli deney ve kazanımlar

| Deney | MEB kazanımı | Fiziksel etkileşim |
| --- | --- | --- |
| Metal çubuk | 9.5.5.1 | Isıtınca uzuyor, soğutunca kısalıyor; metal türü ve termometre sürükleniyor |
| Metal küre ve halka | 9.5.5.1 | Küreyi doğrudan halkaya taşıma; küre/halkanın sıcaklıkları ayrı; gerçek malzeme boylarıyla **geçti / takıldı** |
| Delikli levha | 9.5.5.1 | Sıcaklık değişince metal dış çeperi ve deliğin kendisi genişliyor |
| Sıvı termometresi | 9.5.5.1 | Termometrenin haznesinde sıvı seviyesi sıcaklıkla hareket ediyor |
| Suyun 4 °C davranışı | 9.5.5.1(b) | 0–4 °C'de büzülme, 4 °C üzerinde genleşme, buzun yüzmesi; su/buz yoğunluk ve öz ısı karşılaştırması |
| Tren rayı ve köprü | 9.5.5.1(a) | Genleşme boşluğu sıcaklıkla daralıyor veya açılıyor |
| Bimetal termostat | 9.5.5.1(a) | İki metalin farklı genleşmesiyle şerit eğiliyor |
| Isıl denge | 9.5.3.1 | Sıcak ve soğuk sıvı göstergeleri birbirine yaklaşıyor; yalıtılmış sistem |
| Öz ısı ve ısı sığası | 9.5.1.4–5 | Aynı ısı verildiğinde kütle ve madde türüne göre göreli sıcaklık artışları |
| Enerji iletimi | 9.5.4.1–2 | İletim, taşınım, ışıma; kalınlık ve malzeme değişiklikleri |
| Hâl değişimi | 9.5.2.1 | Isıtma sürecinde erime (0 °C) ve kaynama (100 °C) sıcaklık platoları |
| Sıcaklık dönüşümü | 9.5.1.3 | Celsius, Fahrenheit, Kelvin sayısal birim dönüşümü (MEB izin verir) |
| Termometre çeşitleri | 9.5.1.2 | Sıvılı, dijital temaslı, kızılötesi |
| Hissedilen sıcaklık | 9.5.4.4 | Nitel rüzgâr, nem ve hava sıcaklığı ilişkisi |
| Yalıtım tasarımı | 9.5.4.3–5 | Malzeme, kalınlık, enerji kaynağı, temsili bütçe; tasarruf ve iklim önlemleri |

9.5.1.1 kapsamında **ısı** yüksek sıcaklıktan düşük sıcaklığa enerji aktarımı (J), **sıcaklık** termal durumu ifade eden ölçülebilir büyüklük (K/°C), **iç enerji** sistemin mikroskobik enerji toplamıdır (J). Bu tanımlar laboratuvar metninde de yer alır. 9.5.4.5'teki proje geliştirme kazanımı için yalıtım paneli bir tasarım başlangıcıdır; poster/sunum teslim sürecini otomatik oluşturmaz.

## Müfredat sınırları ve dürüst model notları

- 9.5.5.1(c): **Genleşme ile ilgili sayısal hesaplama yoktur.** Metal ve sıvı malzeme katsayıları yalnız görüntünün eğilimini doğru hesaplamak için arka planda kullanılır; kullanıcıya uzama, hacim değişimi veya alfa hesabı gösterilmez.
- 9.5.1.5, 9.5.2.1: Matematiksel ısı ve hâl değişimi modelleri açıklanabilir, **sayısal hesap yapılmaz**.
- 9.5.3.1: Son denge sıcaklığının sayısal hesabı öğrenciye verilmez.
- 9.5.4.2: İletim hızı sayısal hesabı yok.
- 9.5.1.3: Yalnız sıcaklık birimi dönüşümlerinde sayısal hesap yapılabilir.
- Metal genleşmeleri normal boyutlarda çok küçük olduğu için SVG'de **bilinçli abartılır**. Gerçek küre/halkanın geçmesi ise altta yatan gerçek boy karşılaştırmasından gelir; görünüş yalnız temsilidir.
- Su anomalisi yaklaşık 4 °C çevresinde nitel modele dayanır. Buz ve sıvı su ayrı fazlardır.
- Hâl değişimi çizimi 1 atm ve saf suya aittir.
- Termometre seviyeleri idealize edilmiştir; cıva zehirli olduğu için evde gerçek cıva deneyini yapma.
- Bütçe puanları **temsili** olup gerçek TL fiyatı veya enerji faturası değildir. İklim etkileri sayısal olarak tahmin edilmez.
- Apple Pencil / iPad Safari için pointer event ve stabil capture var. Otomatik DOM ve sentetik pointer testleri **gerçek cihaz testi yerine geçmez**.

## Test

`node --check labs/isi-sicaklik-math.js`

`node --check labs/isi-sicaklik-lab.js`

`node --check labs/isi-sicaklik-pointer.js`

`node --test labs/isi-sicaklik.test.cjs`

Bu laboratuvar `feature/physical-interaction-v2-20261103` üzerinde PR #9'a eklenmiştir. Kullanıcı toplu yayın izni verene kadar production'a geçmez.
