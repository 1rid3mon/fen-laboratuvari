# Ebru yüzey hareketi — 9.2.1.2 alt kabul incelemesi

Bu paket özkütlelerin günlük yaşam uygulamasında tek değişkenli yanlış çıkarımı engeller. Öğrenci hazırlanmış yüzey lekesini kendi çekişiyle değiştirir; aynı başlangıç/özkütle altında alet etkisini karşılaştırır. Gerçek ebruda yüzeyde kalma yalnız düşük özkütleye bağlanamaz. Sayfadaki 1,02/1,00 g/cm³ değerleri açıkça atanmış öğretim koşuludur; belirli bir boya markasının ölçümü değildir.

## Birincil dayanaklar

- Sun, Bush, Spagnolie, Rycroft (2024), Hydrodynamics of marbling art, Physical Review Fluids 9,110506, DOI 10.1103/PhysRevFluids.9.110506: https://people.math.wisc.edu/~spagnolie/Papers/sbsr24.pdf . Boya bazı düzeneklerde banyodan biraz yoğundur; yüzeyler arası gerilim desteği, yüzey etkin madde ile boya geriliminin azalması/yayılma ve alet hareketi ayrılır. Bu simülasyon o kuvvet dengesini çözmez.
- Aubrey Jaffer, The Mathematics of Marbling: https://people.csail.mit.edu/jaffer/Marbling/Mathematics . Çizgiye dik uzaklığa üstel azalan paralel yer değiştirme yaklaşımı. Kod özgün yazıldı, görsel veya kaynak kod kopyalanmadı. Jaffer'ın kişisel konuk sayfası MIT kurumsal onayı diye sunulmaz.
- 2018 MEB Fizik 9.2.1.2: resmi PDF ve kapsam dayanakları SOURCES.md'de. 2027 ÖSYM ayrı kapsam teyidi hâlâ açık.

## İç model / geçerlilik

Yatay çekiş: (x,y) → (x + D exp(-|y-y0|/w), y); dikey eşleniği. w>0 model uzunluğu, D sınırlanmış jest yer değiştirmesi. Gerçek viskoziteye nicel kalibrasyon yok. Sonsuz çizgi boyunca ideal düzlem hareketi; sonlu iğne ucu/duvar/serbest yayılma/batma/moleküler karışma çözülmez. Çerçeve gözlem penceresidir; dışarıdaki noktalar veri modelinden silinmez. Sabit renkli izleyici sayısı ve alan koruyan dönüşüm; üstel tepe çizgisinde türev keskin olsa da sürekli tersinir kayma vardır. İki boyutlu alan korunumu, gerçek boya kalınlığı veya Navier–Stokes çözümü iddiası değildir.

Renkler farklı özkütleli iki boya değil, tek hazırlanmış lekenin izleyicileridir. Nokta yarıçapı görsel işarettir; boşluklar boya parçacıklarının gerçek boyutlarını göstermez. Başlangıca göre ortalama izleyici yer değiştirmesi model birimindedir, hız/enerji/viskozite ölçümü diye etiketlenmez. Çekiş yön/hat/miktar/genişlik bağımsız değişir. Yeni başlangıç önceki deneyden ayrı numunedir; eski defter korunur. Farklı yarıçapla tek değişken kontrolü engellenir. Tahmin önceden kilitlenir; yalnız seçilmiş açıklama değiştirme deney sayılmaz.

## Kabul kapıları

Beş anlamlı birim testi: uzaklığa bağlı çekiş, tam ters çekiş, dik çekiş sırasının etkisi, sıfır/geçersiz parametreler, yerel alan korunumu. Chromium/WebKit gerçek pointer sürükleme, tahmin zamanlaması, defter/karşılaştırma, geri al, soru, iki yön ve sayfa hataları CI'da çalıştırılacak. Bunlar gerçek iPad Safari/çoklu dokunma/akıcılık testi değildir. Son HEAD CI başarıyla gözlenmeden main kabulü verilmez. Laboratuvar bu aşamada geliştirmede; tüm 9.2.1.2'yi henüz tamamlandı sayma.
