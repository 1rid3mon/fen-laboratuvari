# Yüzey gerilimi — 9.2.3.1 kalan mekanizma/faktörler

MEB 2018 Fizik 9.2.3.1(a,b,c): kohezyon/adezyonla yüzey gerilimi, günlük örnekler ve faktörler; öğrenciye matematiksel hesap yok. İlk kılcallık paketi #28 ile birlikte değerlendirilir. Öğrenci bu sayfada sayısal gerilim/kuvvet hesabı veya denklem görmez. Sıcaklık ve numune türü düzeneğin bağımsız koşullarıdır.

## Kaynak ve iç model

- IAPWS R1-76(2014): https://iapws.org/documents/release/Surf-H2O.download . Saf su için σ=.2358 τ^1.256(1−.625τ) N/m, τ=1−T/647.096K. Model20–60°C ile sınırlı. Formülün doymuş saf su/su buharı arayüzü değerleri, temiz hava-su yüzeyi için bu öğretim aralığında yaklaşık referanstır; basınç/gaz çözünmesi taranmaz.
- IAPWS G14-19 (2019): https://iapws.org/technical-guidance/release/Seawater-Surf.download . Referans bileşimli deniz suyu S=35g/kg; σsw=σw(1+3.766e−4S+2.347e−6St), t°C. Sayfa bunu saf NaCl veya her tuz çözeltisinin evrensel modeli diye sunmaz. IAPWS 25°C/S35 ve saf su kontrol değerleri birim testinde bağımsız tabloya karşı doğrulanır.
- OpenStax College Physics2e §11.8, tablo11.3: sabunlu su .037N/m ve etanol .0223N/m tipik örnekleri. https://openstax.org/books/college-physics-2e/pages/11-8-cohesion-and-adhesion-in-liquids-surface-tension-and-capillary-action . Bu iki örnek20°C'yle sınırlanır; kaynaksız sıcaklık bağımlılığı uydurulmaz. Sabun bileşimi gerçek örnekte değişebilir; UI bunu açıklar.
- Wilhelmy ilk temas geometrisi, ölçüm cihazı üreticisi teknik açıklaması: https://pchk.kruss-scientific.com/en/know-how/glossary/wilhelmy-plate-method . Temiz tamamen ıslanan sabit plaka, θ=0 ve ıslanan çevre .0202m; iç ek çekiş F=σP. Kuru plaka ağırlığı dara alınır. İlk temas derinliğinde kaldırma kuvveti ihmal edilir. Derin batırmada bu ifade tek başına yeterli olmayacağından UI kaydı engeller; derin batırma için sahte sabit okuma verilmez.

## Etkileşim ve bilimsel ayrımlar

Öğrenci plakayı doğrudan sürükler; havada, ilk temasta ve fazla batırılmış konumlar farklıdır. İlk temas yakınında fiziksel hizalama yuvası vardır; boş sahnede veya dara/tahmin olmadan ölçüm oluşmaz. Sıvı veya sıcaklık değişince yeni denge numunesi ve temiz kuru plaka hazırlanır, eski okuma/dara/tahmin sıfırlanır. Sonuçlar defterde koşul/tahminle dondurulur; bağıl gösterge ve kayıt grafiği aynı σ modelinden gelir. Gösterge sayısal fiziksel birim veya yeni bir dayanıklılık puanı değildir; referans saf su20°C.

Sıcaklık, tür ve katkı ilişkileri kontrollü karşılaştırılır. İki değişken birden değişirse tek neden onayı verilmez. Saf su ısıtılınca gerilim azalır; aynı sıcaklıkta örnek sabunlu su düşürür, referans deniz suyu biraz artırır. Böylece 'her katkı azaltır' iddiası deney modelinin kendisinde yanlışlanır. Her tuz/derişim/koşul için aynı sonuç genellenmez. Küçük/büyük damla, deterjan ve su böceği bağlantıları her gerçek olayı tek kuvvetle açıklama iddiası taşımaz.

Menisküs ve gösterge nitel çizimlerdir; tam Young–Laplace yüzey şekli, kirlenme, dinamik adsorpsiyon, film kopma, plaka yüzey değişimi, numune ısınma süresi çözülmez. Bu sınırlamalarda ölçüm yapılmış gibi çıktı üretilmez. Uzman denklemleri iç kayıttadır, öğrenci akışına sokulmaz. Serbest açıklama otomatik bilimsel doğru diye değerlendirilmez.

Yedi model testi: IAPWS su değerleri, deniz suyu tablo değeri/katkı karşı örneği, sıcaklık monotonluğu, sabit plaka çekişi, geçersiz koşullar, ölçüm kapıları, tek değişken kontrolü. Browser CI gerçek plaka sürükleme/ilk temas/aşırı batırma, dara sıfırlanması, sıcaklık/tür ve katkı karşılaştırması, desteklenmeyen sıcaklığın engeli, soru/yönleri denetler. Son HEAD başarılı olmadan merge yok. Gerçek iPad ve canlı ayrıca bekler.

Bu paketten sonra kullanıcı önceliği **elektrik devreleri**: güncel MEB 10.1.1 alt kapsamını ve mevcut devre kodunu oku; eleman/kablo düzeni öğrenci tarafından kurulmalı, akım/gerilim/direnç ve ölçüm cihazları gerçek devre çözümünden gelmelidir.
