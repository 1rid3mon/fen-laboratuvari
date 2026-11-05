# Elektroskop — 9.6.1.1(c), temassız yük dağılımı

2018 MEB Fizik 9.6.1.1(c) elektroskopun kullanım amacına yönelik deneydir. Kaynak: SOURCES.md ve resmî https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf . Bu paket bütün elektriklenme kazanımını kapatmaz; sürtünme, kalıcı temas ve serbest etki/topraklama sırası ayrıca bekler.

## Bulunan hata ve düzeltme

Önceki model, ters işaretli çubuk yaklaşınca açıklığı sıfırda kesiyordu. Metindeki güçlü etkiyle yeniden açılma görsel/modelde yoktu. Şimdi işaretli yaprak yükü sıfırı geçer; yaprak işareti tersine döner ve açıklık yeniden artar. Yalıtılmış elektroskopun net yükü sabittir. Topuz ve her iki yaprak işareti aynı modelden çizilir. Kapalı yaprakların çizgileri gerçekten birleşir. Yaklaştırılan çubuk en yakın konumda bile topuza değmez; önceki görsel örtüşme kaldırıldı.

## Bilimsel temsil ve sınırlar

Yavaş temassız yaklaşma, yalıtılmış elektroskop, yük kaçağı/korona/ark olmayan elektrostatik denge kabulüdür. İç hesapta toplam yaprak bölgesi l=0.35Q+0.58s·a; topuz/üst iletken bölgesi h=Q−l, her yaprak l/2. Dolayısıyla h+2(l/2)=Q tam korunur. Açıklık |l| ile monoton nitel gösterilir. Katsayılar ve yakınlık gerçek sığa, metre, Coulomb veya açı ölçümü değildir; TYT'ye sığa/ileri alan hesabı eklenmez. Çubuk kuvvetinin yapraklara doğrudan etkisi ve gerçek cihaz geometrisi çözülmez. Sıfır geçişin belirli bir gerçek uzaklıkta olacağı iddia edilmez. İşaretler net elektron fazlalığı/eksikliğidir; proton hareketi gösterilmez.

Nötr başlangıçta iki çubuk işareti de aynı açıklığı verebilir. Başlangıç yükü bilinen cihazda, sıfır yakınlıktaki ilk durumdan yaklaşma izlenmeden yalnız bir açık konumla çubuk işareti belirlenmez. Kapanma bütün elektroskopun nötrleşmesi değildir. Çubuk çekilince temassız cihaz ilk durumuna döner. Ön yük seçimi başlangıç hazırlığıdır; çubuktan cihaza yük aktarımı değildir.

Bilimsel dayanaklar (5 Kasım 2026 okundu): University of Maryland Physics Demonstration J1-12 https://lecdem.physics.umd.edu/j/j1/1125-j1-12.html (temassız yaklaşma ve etki); University of North Texas Physics Gold Leaf Electroscope https://sites.physics.unt.edu/~klittler/demo_room/e%26m_demos/5a22_30.html ; OpenStax University Physics2, 5.2 Conductors/Insulators https://openstax.org/books/university-physics-volume-2/pages/5-2-conductors-insulators-and-charging-by-induction . Bu kaynaklar kapasitif katsayıları doğrulamaz; katsayılar açıkça nitel model seçimidir.

## Öğrenme ve kabul

Öğrenci çubuğu doğrudan yaklaştırır/uzaklaştırır; ön yük ve çubuk işaretini bağımsız değiştirir. Yaprak hareketi, yük işaretleri ve nitel yakınlık–açıklık eğrisi birlikte güncellenir. Tahmin kilidi, gözlem defteri, son iki kayıt karşılaştırması, birden çok koşul değişikliğinde çıkarım kapısı, oturumluk öğrenci açıklaması ve özgün I/II/III YKS sorusu vardır. Serbest açıklamaya bilimsel otomatik onay yoktur. Kayıtlar oturumluk, kalıcı kullanıcı depolaması değildir.

Dört model testi: tüm işaret/yakınlık boyunca korunum, sıfır geçiş ve yeniden açılma, nötr işaret belirsizliği/geri dönüş, aynı işaret monotonluğu ve yük tersleme simetrisi. Eski 10 sahne/drag ve bütün model testleri korunur. Yeni gerçek tarayıcı senaryosu doğrudan çubuk sürükleme, kapanma/yeniden açılma, geri çekme, nötr simetrisi, defter/karşılaştırma/hipotez/soru, iki ekran yönü ve JS hatası denetler. Chromium/WebKit son HEAD kabulü beklenir. Bunlar gerçek iPad Safari/çoklu dokunma/Apple Pencil/cihaz akıcılığı kanıtı değildir.
