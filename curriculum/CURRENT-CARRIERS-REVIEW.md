# Akım, gerilim, direnç ve taşıyıcı ortamları —10.1.1.1

5 Kasım2026; başlangıç mainc93af2282d24f26068a753a8a936fe87d1dbd5bc (#39). MEB2018 basılı s.21,10.1.1.1(a,b): yük hareketi ve katı/sıvı/gaz/plazmada iletim. https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf . Tanımlar, V'nin akımı tek başına garanti etmemesi ve aynı örnekte direnç/gerilim etkileri, önceki doğrulanmış devre/Ohm tezgâhıyla ilişkilendirilir. Bu yeni deney önceki ölçüm görevini yeniden saymaz.

Birincil ders kaynakları: https://openstax.org/books/college-physics-2e/pages/20-1-current (taşıyıcı yük/hareket yönü/geleneksel akım); https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes (metalde elektronlar, çözeltide hareketli iyonlar). Makro akım/taşıyıcı ilişkisinin ileri drift hızı/yoğunluk hesabı öğrenciye eklenmedi.

## Bilimsel model

Metal: sabit12 pozitif örgü paketi +12 hareketli elektron paketi. Su örneğinde her çözünmüş tuz paketi12 pozitif/12 negatif hareketli iyon temsilidir; bunlar tuzun suda ayrılan mevcut iyonlarıdır. Gaz iyonlaşması8 pozitif iyon/8 elektron çifti, plazma örneği baştan aynı tür taşıyıcılardır. Nötr başlangıçtan net yük oluşmaz. Örnek saf su ve yağda çok zayıf arka plan iletimi bu çizim ölçeğinde çözülmez; mutlak sıfır iletkenlik veya bütün sıvılar iletir genellemesi yapılmaz. Gazın gerçek iyonlaşma eşiği hesaplanmaz; iyonlaşma koşulu ayrı bir sanal örnek seçimidir.

Her pakette yönlü sürüklenme dx=q·gerilimDüzeyi·hareketlilik·Δt/(10·engel). Pozitif taşıyıcı pozitif akım yönüne, negatif taşıyıcı tersine ilerler; q·yön çarpımı iki zıt iyon hareketinin aynı akıma katkısını verir. İç sabitler yalnız göreli örnek ölçeği; gerçek elektron hızı/Amper veya ortamlar arası iletkenlik sıralaması değildir. Sıfır gerilim veya açık yolda düzenli drift sıfır; rastgele ısıl hareketin durduğu iddia edilmez. Aynı örnekte engelin artması etkin direnci büyüten eğilimi yalıtır, yükleri tüketmez.

Ölçüm kesitinden geçen imzalı yük sayısı, her parçacığın periyodik konum aralığındaki kesit geçiş sayısı×q olarak hesaplanır. Negatif yükün sola geçişi sağa geleneksel akıma katkıdır. Periyodik sınır, homojen kesite eşdeğer taşıyıcı girişi için sayısal modeldir; iyonların metal telde dolaşması diye yorumlanmaz. Elektrot/elektroliz/sınır birikimi ve uzun süreli kimyasal değişim bu yerel kararlı kesitte çözülmez. Az pakette kısa pencere geçişi basamaklı olabilir; akım yönü göstergesi sürekli ortalamayı anlatır. Sayılar gerçek elektron sayısı değildir.

Kaynak yönü/engel/ölçüm kesiti değişince pencere sıfırlanır ama yük konumları/toplamı korunur. Ortam/iyonlaşma/çözünmüş tuz değişimi yeni örnek dağılımını hazırlar; grafik sıçraması devam eden tek numunenin fiziksel yolculuğu diye sunulmaz. Sıfır drifti hesaplar taşımadan bırakır; ilk testte sıfır harekette gereksiz modulo küçük yuvarlama kaymasına yol açtı, modelde dx=0 için konum korunarak düzeltildi.

## Öğrenci eylemleri ve test

Tuzu su örneğine sürükleyerek iyon ekleme; kesit ölçerini taşıma; kapalı yol, kaynak yönü/düzeyi, engel ve iyonlaşmayı bağımsız değiştirme; zaman adımı/animasyonla taşıyıcı hareketi; ön tahmin, ortam/koşul/ölçüm defteri, aynı süre/tek değişken kapısı, açıklama ve özgün iyon yönü YKS sorusu. Ortamlar arası sayısal sıralama kapısı reddeder. Önceki A/V Ohm devresiyle gerilim ve direnç açıklaması ayrıca bağlanır. Serbest açıklama otomatik doğru değerlendirilmez.

8 yeni model testi: elektron/geleneksel yön ve örgü, zıt iyonlar, zayıf örnek/gaz iyonlaşması, ters kaynak/engel, açık yol/sıfır gerilim, imzalı kesit ortalaması, ölçer taşımada yük korunumu, kayıt/karşılaştırma kapıları. Önceki536 ile544 model/regresyon. Gerçek browser senaryosu tuz/kesit sürükleme, polarite/iyonlaşma, yanlış tahmin, net yük/defter/soru ve iki ekran yönünü Chromium/WebKit'te sınar. Son HEAD gerekli CI yeşil olmadan merge yok. Gerçek iPad Safari/Apple Pencil/çoklu dokunma/cihaz akıcılığı ve bütün canlı kabulü ayrıca bekler; elle Vercel deploy yok.
