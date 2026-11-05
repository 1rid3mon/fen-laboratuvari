# 9.2.2.1 — kesit/hacim tarayıcı bilimsel incelemesi

2018 MEB resmi Fizik programı, PDF s.16 (basılı s.15), 9.2.2.1: küp/prizma/silindir/küre için kesit alanı/hacim oranı dışındaki dayanıklılık matematiğine girilmez. Kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf . Bu sınırlama sebebiyle kırılma kuvveti, gerilme veya burkulma hesabı eklenmedi.

Öğrenci numune şeklini seçer; a/b/h/r uzunluklarını doğrudan tutamakla veya erişilebilir sürgüyle değiştirir. Kürede hareketli kesit ile en büyük kesitin farklı olduğu ayrıca keşfedilir. Oranın A'sı küp/prizma/silindirde paralel taban kesiti; kürede en büyük kesit. Kürede rastgele taranan küçük kesiti dayanıklılık referansı sayma hatası modelde engellenir. Çizim 2B kesittir; prizma b derinliği ayrı kontrol edilir. Boyutlar 1–6 cm; kürede r yarıçap, çap değil. Hacim modeli test edilmiş hacim laboratuvarıyla ortak kullanılır.

A/V birimi cm⁻¹; N, maksimum taşınabilir kütle, evrensel dayanıklılık puanı veya yüzey alanı/hacim oranı değildir. Aynı maddeden geometrik benzer cisimler için dersin geometrik dayanıklılık ilişkisi incelenir. Gerçek kırılma/yük taşıma; malzeme, kusur, yükleme, bağlantı ve burkulma gibi koşullara bağlıdır. Daha büyük cismin mutlak taşıma kapasitesi ile kendi ağırlığına göre dayanıklılık birbirinin yerine kullanılmaz. Hayvan veya yapının bütün biyolojik/mühendislik sonucu bu orandan çıkarılmaz.

Öğrenme döngüsü: dört numune türü, bağımsız uzunluklar, kesit tarama, önceden kilitli tahmin, başlangıç/son ölçüm, defter ve A/V bar grafiği, benzerlik kontrolü, öğrenci açıklaması ve özgün YKS sorusu. Serbest yazı otomatik doğru diye değerlendirilmez.

Beş model testi: dört şekilde k²/k³/1/k, sabit yükseklikte prizma genişliği, kürede hareketli kesit ile sabit referans, prizma/silindirde paralel kesit, şekil değişiminde kontrol reddi ve geçersiz tarama. Browser CI gerçek tutamak/ölçüm/kayıt/karşılaştırma/soru ve iki yönü denetleyecek. Son HEAD geçmeden main kabulü yok. Gerçek iPad Safari/çoklu dokunma/akıcılık ve canlı ayrıca bekler.


## Gözlenen kabul sonucu

PR #26 son HEAD 0a9b6dad504813bbe5fa7908ec90d9b29bba3412: 460/460 yerel model/regresyon; son HEAD 15 check başarılı, Chromium/WebKit dahil. Strength run41979606018. İlk başarısız HEADler main alınmadı: tutamak ve sürgü 0,05 cm adımına eşitlendi; kürenin uç kesit testinde piksel yuvarlaması nedeniyle jest tam uca değil çok yakına geliyordu, test sınırın ötesine sürükleyerek clamp sonucunu doğrular. Main merge 339e1614e79a478f049780c4a4a05443c54d6c80. Üst ve dört alt kabul maddesi main; gerçek iPad/canlı ayrı bekler.
