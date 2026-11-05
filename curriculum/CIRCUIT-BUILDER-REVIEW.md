# Elektrik devre tahtası ilk paket — 10.1.2.1(a,b), c kısmi

Kullanıcı adezyon/kohezyon sonrası elektrik devrelerini önceliklendirdi. #28 kılcallık ve #29 yüzey gerilimi main sonrası yeni dal açıldı. Eski elektrik laboratuvarının fizik motoru yeniden kullanılır; eski sayfa değiştirilmez. Başlangıçta eski devre23 testi de geçti.

2018 MEB resmi Fizik s.21: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf . 10.1.2.1(a) ölçü aletlerinin direnç/görevleri, (b) öğrenci deneyinden Ohm modeli, (c) eşdeğer direnç dahil hesaplar. Bu ilk paket a/b ve bağlantı altyapısıdır; tüm c veya bütün elektrik kabulü verilmez. 10.1.2.2 üreteçlerin seri/paralel gerekçeleri/ömür/ters bağlama/iç direnç/Galvani-Volta ve 10.1.2.3 güç/enerji/parlaklık,10.1.2.4 güvenlik ayrı inceleme bekler. Öğrenciye Kirchhoff yasaları öğretilmez.

## Fizik ve etkileşim

- Öğrenci boş tahtaya pil/S/R/L1/L2/A/V yerleştirir. Gövdeyi taşır,90° döndürür, kaldırır; kaldırılan elemanın kabloları gerçek ağdan çıkar. Terminal koordinatları dönüşümle güncellenir, topoloji değişmez. Kablo bağlamak fiziksel ağ kenarı ekler; kesişen çizgiler kendiliğinden düğüm olmaz.
- Tek ideal kaynak, ideal bağlantı, sabit sıcaklıkta ohmik R ve sabit dirençli6Ω model lambalar. Gerçek akkor telin sıcaklıkla direnci çözülmez. Eski solver A=.002Ω,V=1GΩ kullanır; tam ideal meter eşitliğindeki küçük fark öğretim hassasiyetinde ihmal edilir. Fark saklanıp tam ideal çözüm iddiası yapılmaz. V/A tablo değerleri büyüklüktür; cihaz kutupları ters bağlandığında işaret görülebilir.
- Kısa devre/aşırı akımda bu yeni tahtanın sanal kaynağı ayrılır ve sıfır enerjili ağ yeniden çözülür; lamba/akım çalışıyor gibi gösterilmez. Eski motorun koruma öncesi teorik çok büyük akımları yeni arayüzün gerçek ölçümü olarak sunulmaz. Bu sigortanın sıcaklık/zaman davranışı değildir.
- Ohm kaydı gerçek A/V bağlantısı ister. V iki R ucuna paralel; A ile R ortak düğümünde başka akım dalı bulunmamalı. Ölçüm kapısı, yanlış daldaki A akımıyla R gerilimini bölüp sahte Ohm kanıtı üretmez. Bu ilk görev A-R doğrudan seri komşuluğuyla sınırlıdır; araya ek eleman konmuş doğru genel devreler bu özel görevde kabul edilmeyebilir, fizik motorunda çalışmaya devam eder.
- Defter V,I,R, kaynak ve topoloji/tahminini dondurur. Grafik yatayI,düşeyV, veriye göre ölçeklenir; farklıR noktaları aynı doğrunun kanıtı sayılmaz. Karşılaştırmada bağlantı ve R sabit, kaynak gerilimi farklı olmalıdır. Kayıtların serbest öğrenci açıklaması otomatik doğru diye değerlendirilmez.
- İsteğe bağlı hareketli işaretler geleneksel akım yönünü gösterir; metalde elektron yönü ters, işaret hızı gerçek elektron hızı değildir. İdeal kablo halkalarında motorun seçtiği deterministik ağaç akışı tekil fiziksel akım dağılımı iddiası taşımaz. Animasyon kapalıyken sürekli DOM yenileme yapılmaz; yeniden başlatma eski döngüyü sürdürmez.

## Test ve kapsam sınırı

Yedi yeni model testi: eksik elemanla kablo engeli/kaldırma; taşıma-döndürme topoloji değişmezliği; gerçek Ohm ölçümü/defter anlık görüntüsü; seri V reddi; paralel A koruma; kaynak kaldırma/açık anahtar; A-R düğümünde dalın ölçüm kapısını kapatması. Eski devre23 test ve tüm mevcut laboratuvar testleri regresyon kapsamındadır. Gerçek Chromium/WebKit ekleme/taşıma/döndürme/kablo kurma/Ohm/yanlış A/çıkarma ve yönler CI'da çalışmalı. Son HEAD geçmeden main kabulü yok. Gerçek iPad ve canlı ayrıca bekler.

Devreler bu paketten sonra da devam eder: seri/paralel eşdeğer direnç için öğrencinin kurduğu topolojilerin ölçüm görevleri; üreteçler, güç/enerji ve güvenlik. Tüm alt kazanımları tek devre örneğiyle tamamlandı sayma.
