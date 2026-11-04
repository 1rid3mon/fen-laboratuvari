# TYT Fizik — 2018 MEB kazanım ve etkileşim denetimi

**Kapsam:** 2027 YKS'ye mezun olarak hazırlanan kullanıcı; 2018 MEB öğretim programı. Maarif Modeli veya sınıf seviyesi temelli yeni program **eklenmez**. Bu dosya bir **denetim kuyruğudur**, resmî kazanım eşleştirmesi tamamlanmış bir sertifika değildir.

## Kabul ölçütü

Her konu için ayrı ayrı: (1) resmî 2018 MEB kazanım kodu ve metni, (2) ilgili laboratuvarın bire bir sahnesi, (3) gerçek hareket ve sürükleme/parametre tepkisi, (4) bağımsız fizik hesabı ve uç durum testi, (5) eksik/fazla bilgi ve YKS düzeyi, (6) iPad Safari/Apple Pencil manuel kontrolü. Her madde kanıt olmadan 'tamamlandı' olamaz. Kodun varlığı ve CI yeşili, fizik doğruluğu veya gerçek cihaz onayı değildir.

| Sıra | TYT konu | Mevcut kaynak | Kritik kontrol | Durum |
|---|---|---|---|---|
| 1 | Fizik Bilimine Giriş | `tyt-fizige-giris.html` | SI temel/türetilmiş, skaler-vektörel, ölçme, alt alanlar ve fiziksel model sınırları | İlk 3 deney eklendi; **tam kazanım eşleştirmesi bekliyor** |
| 2 | Madde ve Özellikleri | `tyt-madde-ozellikleri.html` (6 ilk sürüm sahne) | Özkütle, dayanıklılık, adezyon-kohezyon, yüzey gerilimi, kılcallık; hangi kazanımların dahil olduğunun resmî kontrolü | İlk sürüm eklendi; kazanım, nicel model ve gerçek iPad doğrulaması bekliyor |
| 3 | Hareket ve Kuvvet | `newton-hareket-yasalari.html`, hareket sayfaları | TYT–AYT kazanım ayrımı; yol–yer değiştirme, sürat–hız, grafikler, net kuvvet | Ayrıntılı denetim bekliyor |
| 4 | İş, Güç ve Enerji | `is-guc-enerji.html`, `enerji-lab.html` | Enerji korunumu, işaretler, sürtünme, verim ve TYT–AYT ayrımı | Ayrıntılı denetim bekliyor |
| 5 | Isı ve Sıcaklık | `isi-sicaklik.html` | Isı–sıcaklık ayrımı, termometre, hâl değişimi, suyun 4 °C özelliği ve genleşme | 15 deney mevcut; bağımsız fizik denetimi bekliyor |
| 6 | Elektrostatik | `tyt-elektrostatik.html` | Yük korunumu, iletken/yalıtkan, etki, dokunma, topraklama, elektroskop | 10 deney mevcut; fizik denetimi bekliyor |
| 7 | Elektrik ve Manyetizma | `tyt-devre.html` | Gerçek devre topolojisi, kısa devre, ampul parlaklığı, ölçü aletleri, alan yönü | 10 deney mevcut; fizik denetimi bekliyor |
| 8 | Basınç ve Kaldırma Kuvveti | `tyt-basinc-dalgalar.html` | Basınç birimi, açık/kapalı kap, gaz basıncı, batan hacim, taban tepkisi | Katı/sıvı/kaldırma mevcut; **gaz ve atmosfer basıncı eksik** |
| 9 | Dalgalar | `tyt-basinc-dalgalar.html` | Yay/su/ses, frekans–periyot, dalga hızı, yansıma, girişim ve kapsam sınırı | Üç dalga modeli mevcut; kazanım kapsamı eksik |
| 10 | Optik | `optik-*.html` | Gerçek/sanal görüntü, işaret, ışın yolları, renk karışımı, mercek, kırılma | Birden çok deney mevcut; tam fizik denetimi bekliyor |

## Yanıltıcılığı önleme kuralları

- Gösterim yalnız **temsili** ise ölçek ve fiziksel varsayım açıkça yazılır; birimsiz sayıya Pa/N denmez.
- Bir kontrol değiştiğinde **görsel ve hesap birlikte** güncellenir; yalnız metin değişmesi deney kabul edilmez.
- Sıfır, negatif, sınır, eşitlik ve ters yön durumları ayrı test edilir.
- TYT'de AYT'ye ait hesaplama ve kazanımlar soru diye sunulmaz.
- Fiziksel olarak yanlış bir gösterim, eksik bir gösterimden daha öncelikli hatadır.
- Gerçek iPad Safari testini cihaz olmadan **başarılı** işaretleme.
- PR #9, 4 Kasım 2026'da main'e aktarıldı (cf2ea96f617be406f15df47d5e595fa81ec4b383). Devam çalışması PR #10 taslak dalında; CI ve denetimler doğrulanmadan main'e alma veya Vercel yayını yapma.

## Aşama 2 — Madde ve Özellikleri

Altı yeni sahne: özkütle, yoğunluk karşılaştırmasıyla yüzme/batma, benzer şekillerde kendi ağırlığına karşı dayanıklılık, adezyon/kohezyon, kılcallık ve yüzey gerilimi. Bunlar **slider tabanlı görsel tepkiler** sunar; henüz doğrudan sahne sürüklemesi yoktur. Özellikle dayanıklılık ve yüzey gerilimi nitel modellerdir. Öğrencinin doğru öğrenmesi için resmî kazanım kodu, formül sınırı ve cihaz testi doğrulanmadan 'tamam' işaretlenmeyecek.

## CI olay kaydı — 4 Kasım

GitHub Actions 41788276375 (commit 371242e) başarısız: `tyt-basinc-dalgalar.test.cjs` eski ve fiziksel olarak yanlış `s.density*G*s.volume/1000` ifadesini bekliyordu. Üretim kodunda yer değiştiren hacim hesabı `s.density*G*immersedVolume/1000` olarak düzeltilmişti; test beklentisi geride kalmış. Test yeni doğru ifadeye güncellendi (commit 110317e). **Yeni commitin CI sonucu doğrulanmadan yeşil kabul edilmez.** Ayrıca testin geçmesi, görselin gerçek iPad'de doğrulandığı anlamına gelmez.

## Madde ve Özellikleri — sahne düzeltmeleri

- Yüzen cismin su yüzeyinin altında kalan kısmı özkütle oranına göre çizilir; batan cisim kabın tabanına iner.
- Islatmayan sıvıda kılcal borudaki sıvı seviyesi haznenin altına çekilir (önceki çizimde boru içinde seviye aynı kalıyordu).
- Islatan yüzeyde sıvı ince tabaka halinde gösterilir (önceki kalın dikdörtgen ıslanmayı yanlış temsil ediyordu).
- Yüzey gerilimi hâlâ **nitel**, sıcaklık kontrolünde eşik temsili mevcut: kesintisiz fiziksel nicel değişim olarak **kabul edilmedi**. Dayanıklılık da benzer cisimler dışında sayısal çıkarım için **kabul edilmedi**. Resmî MEB kazanım metni ve gerçek iPad testi bekliyor.

## Aşama 2 devam — nitel model güvenliği

- Yüzey gerilimi görselindeki 50 °C eşiği kaldırıldı; sıcaklıkla sürekli değişen **temsili** görsel gösterge kullanılıyor. Sayısal gösterge fiziksel yüzey gerilimi ölçümü **değildir** ve öğrenciye böyle belirtiliyor. Sabun etkisi de nicel fizik verisi değildir.
- Dayanıklılık sahnesinde silindir geometrisinin kesit alanı πr², hacmi πr²L ve oranı 1/L açıkça gösteriliyor; evrensel kopma dayanıklılığı iddiası kaldırıldı. Bu hâlâ fiziksel kırılma/çökme simülasyonu değildir.
- Her iki sahne için regresyon testleri eklendi. Resmî MEB kazanım kodu ve gerçek Safari testi hâlâ beklemede.

## Resmî kaynakla ilk kazanım eşleştirmesi (2018 MEB PDF, s. 15–16)

Kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf

| Kazanım | Resmî kapsam/sınır | Kodda durum |
|---|---|---|
| 9.1.1.1 | Fizik biliminin önemi | Eksik |
| 9.1.2.1 | Fiziğin alt dalları ve disiplinlerle ilişkisi | Eksik |
| 9.1.3.1 | Temel/türetilmiş, skaler/vektörel, **tek boyutta** vektör toplama | Kısmi: sınıflandırma var; tek boyutta toplama eksik. 2B vektör çizimi yalnız ek kavram gösterimi olarak etiketlendi |
| 9.1.4.1 | Bilim araştırma merkezleri ve etik | Eksik |
| 9.2.1.1 | Özkütle, kütle/hacim birimleri, geometrik/düzensiz hacim, kütle–hacim ve özkütle grafikleri, nitel karışımlar | Kısmi: yalnız özkütle hesaplama var; grafik, birim, şekil ve karışım eksik |
| 9.2.1.2 | Günlük yaşamda saf madde/karışım özkütlesi | Eksik |
| 9.2.2.1 | Dayanıklılık, yalnız küp/prizma/silindir/küre kesit alanı-hacim oranı hesabı | Kısmi: silindir modeli var; diğer şekiller eksik |
| 9.2.3.1 | Adezyon, kohezyon, yüzey gerilimi, kılcallık; **matematiksel hesaplama yok** | Nitel modeller var; örnekler ve fiziksel sahne doğrulaması eksik |

**Önemli kapsam düzeltmesi:** Yüzme/batma, 9.2 Madde ve Özellikleri kazanımlarından biri değildir; ayrı TYT Basınç ve Kaldırma Kuvveti ünitesinin ön izlemesidir. Öğrenci arayüzüne uyarı eklendi. **2B vektör işlemleri** de 9.1'in tek boyutta toplama sınırını aşar; mevcut 2B sahneye kapsam uyarısı eklendi. Bu tabloda hiçbir 'kısmi' satır tamamlanmış değildir.

## 9.2.1.1 kazanım ilerlemesi — 4 Kasım

Özkütle için **etkileşimli kütle–hacim grafiği** eklendi: sabit özkütle ile orijinden geçen doğru, doğrunun eğimi ρ=m/V, hacim değişince noktanın ve kütlenin değişmesi. Uç değer ve eğim regresyon testleri eklendi. Bu kazanım **henüz tam değil**: düzensiz cisim hacmi, birim dönüşümleri, özkütle-hacim grafiği, karışımların nitel yorumu ve günlük hayat uygulamaları bekliyor. Görsel SVG testleri gerçek Safari etkileşim testi değildir.

## 9.2.1.1 — su yer değiştirme deneyi

Dereceli silindirle **tam batırılmış, çözünmeyen ve su emmeyen** düzensiz katının hacmi için ilk/son su seviyesi farkı gösterimi eklendi. 1 mL = 1 cm³ dönüşümü ve regresyon testi eklendi. Bu model yalnız su seviyesi değişimini öğretir; taşırma kabı, menisküs okuma ve gerçek cihaz Safari doğrulaması henüz yok. Kazanım tam olarak onaylanmadı.

## Fiziksel yanıltıcılık denetimi — Madde ve Özellikleri

- **Yüzey gerilimi:** Önceki yüzde göstergesi ve doğrulanmamış 72,8−0,15(T−20) sayısal yaklaşımı kaldırıldı. Çizim yalnız nitel eğilim gösterir; sabun etkisi ve damla biçimi ölçüm olarak sunulmaz.
- **Dayanıklılık:** Silindirin kesit alanı ve hacmi sonuçları π ortak çarpanı ayrılarak etiketlendi. Kesit/hacim oranı kırılma yükünün evrensel formülü değildir.
- **Kılcallık:** Temsili sıvı seviyesi çizim sınırları içinde tutuldu; gerçek yükseklik hesabı değildir.
- **Özkütle:** Bağımsız m/V kontrolleri aynı maddenin boyut değiştirmesi şeklinde yorumlanamaz; grafik sabit özkütle varsayımıyla ayrıldı.
- **Yüzme-batma:** 9.2 dışı ön izleme olarak kalır.

**Kalan kritik işler:** su taşırma sahnesinde cisim geometrisi ve ölçek fiziksel olarak doğrulanmalı; kılcallıkta sınır kırpılması gerçek eğri olarak yorumlanmamalı; özkütle-hacim grafiği, birim dönüşümü, karışımlar ve diğer geometrik dayanıklılık örnekleri eksik. Kod testleri gerçek iPad/Safari gözleminin yerini tutmaz.

### Kılcallık ve su yer değiştirme — ek doğruluk düzeltmesi

Önceki kılcallık modelinde dar boru için hesaplanan sıvı seviyesi SVG sınırına kırpılıyordu. Bu, gerçek modelin yarıçapla değişimini bozduğu için kaldırıldı; temsili 100/r ölçeğiyle tüm kontrol aralığında kırpılmadan gösteriliyor. **100/r bir gerçek yükseklik formülü değildir.** Dereceli silindir deneyinde başlangıç seviyesi çizgisi etiketlendi ve cismin geometrisinin şematik olduğu belirtildi. Gerçek cihaz ve MEB kazanım kabulü bekliyor.

## 9.2 — 4 Kasım ek MEB denetimi ve regresyon kapsamı

**Resmî dayanak:** 2018 MEB Fizik Öğretim Programı sayfa 16, `9.2.1.1` ve `9.2.2.1` (https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf).

- `9.2.1.1(a)`: Kütle için mg, g, kg, ton; hacim için mL, L, cm³, dm³, m³ dönüşüm kontrolleri eklendi. Çok küçük ton/m³ değerlerinin 0'a yuvarlanmaması için dönüşümlerde sekiz ondalık basamak hassasiyeti sınırı kullanılıyor. Örnek: 600 g = 0,0006 ton; 1000 mL = 0,001 m³. Birim çubukları aynı tür miktarlardır; kütle ile hacmin bar boyları karşılaştırılmaz.
- `9.2.1.1(ç)`: Sabit sıcaklık ve basınçta **aynı homojen saf madde** için kütle–özkütle ve hacim–özkütle yatay grafiklerinin her ikisi eklendi; yoğunluk ve işaretli x değerleri değişince hesaplar ve SVG değişiyor. Farklı maddeler için yatay grafik genellenemez.
- `9.2.2.1`: Önceki bağımsız yarıçap/uzunluk sliderları benzer şekil kıyasını garanti etmiyordu. Küp, dikdörtgenler prizması, silindir ve küre için benzerlik ölçeği `k` eklendi. Her şeklin uygun kesit alanı-hacim oranı gösteriliyor; şekiller benzer büyütülünce `A→k²A`, `V→k³V`, `A/V→(A/V)/k`. Kürede en büyük kesit alanı kullanılır. Görsel iki boyutlu **siluettir**, 3B mekaniği veya kırılma simülasyonu değildir. MEB'in ötesinde kuvvet/akma gerilimi hesaplarına gidilmedi.

**Henüz eksik veya doğrulanmamış:** 9.2.1.1(b) küp/prizma/silindir/küre hacmini bağımsız kontrollü deney; 9.2.1.1(e) karışımların özkütlesinin **hesapsız nitel yorumu**; 9.2.1.1(f) Archimedes ve el-Hazini'nin çalışmaları; 9.2.1.2 günlük yaşam uygulamaları; 9.2.3.1 günlük yaşam örnekleri ve iPad Safari/Apple Pencil üzerinde manuel doğrulama. Yeşil CI, tek başına öğretim doğruluğu onayı değildir.

### Su seviyesi–cisim kesiti tutarlılık testi

Dereceli silindir SVG'si artık 2B modelde **alan korunumu** sağlar: `A_cisim kesiti = A_kap kesiti × Δh`, ayrıca tam batmış cismin üst noktası son sıvı seviyesinin altında kalır. Örnek sınır değerlerde regresyon testi eklenmiştir. Gerçek 3B düzensiz cismin şekli ve silindir menisküsünün okunması hâlâ modellenmiyor; **bu deney gerçek laboratuvar kalibrasyonu değildir**. 9.2.1.1(b) tümüyle tamamlanmış sayılmaz.
