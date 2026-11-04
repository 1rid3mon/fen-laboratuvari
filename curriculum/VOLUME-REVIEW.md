# Geometrik hacim atölyesi

2018 MEB Fizik 9.2.1.1 (b): küp, dikdörtgenler prizması, silindir, küre. (a) hacim birimlerine kısmi katkı. Düzensiz cisim ve kütle birimleri ayrı kabul bekler. Kaynak SOURCES.md ve Fizik programı s. 16.

Bilimsel denetim:

- Küp a³, prizma abh, silindir πr²h, küre 4πr³/3. Uzunluklar cm; alan cm² ve hacim cm³. r yarıçaptır, çap değildir. Küreye taban alanı × yükseklik modeli uygulanmaz.
- Bütün uzunluklar k katına çıkarsa hacim k³ kat olur. Prizmada yalnız a iki katına çıkarsa hacim iki; silindirde yalnız r iki katına çıkarsa hacim dört kat olur. Bu iki durum aynı etkileşimde karşılaştırılır.
- Çizimlerde a yatay, h düşey, b perspektifte derinliktir; küpte bütün kenarlar a'ya bağlıdır. Perspektif izdüşüm uzunluğu gerçek bir cetvel ölçeği diye sunulmaz. Çubuk grafiklerde ise uzunluk gerçek hesaplanan hacimle orantılıdır.
- Birim çevirileri: 1 cm³ = 1 mL; 1000 cm³ = 1 dm³ = 1 L; 1 m³ = 10⁶ cm³. İç hesap π duyarlığını korur; ekran yuvarlatması fizik modelini değiştirmez.
- Uzunluk sınırları 1–6 cm. Hazır iki katına büyütme deneylerinin başlangıçları bütün boyutlarda en fazla 3 cm olduğundan son değerler geçerlidir. Negatif, sıfır veya sonlu olmayan boyut reddedilir.
- Geometrik ölçüm hesaplamasıdır; gerçek araç hatası, boşluklu malzeme veya suya batırma fiziği bu sayfaya karıştırılmaz. Kum–su, karışım özkütlesi ve integral hesabı içermez.

Öğrenme: cismi seç → bağımsız boyutları sürükle → hipotez kaydet → başlangıç/değiştirilmiş modeli kur → hacimleri ölç/kaydet → oran ve kontrollü değişkenleri karşılaştır → açıklamanı öz değerlendir → yarıçap/yükseklik ayrımını özgün soruyla sına. Cisim/deney koşulu değişirse hipotez geçersizleşir; kaydedilen çift hipotezin koşullarına uymuyorsa sonuç hipotezi doğruladı diye sunulmaz.

Testler: 5 yeni model testi; dört şeklin formülleri, benzerlik ve tek boyut farkı, bağımsız alan/yükseklik, karşılaştırma ve sınırlar. Gerçek Chromium/WebKit senaryoları dört şekil, a/b/h/r uçlarının sürüklenmesi, hipotez engelleri, defter, birimler, soru ve iki yönü kapsar. Son HEAD'in CI sonucu ayrıca kaydedilmeden geçmiş kabul edilemez. Gerçek iPad Safari yapılmadı.

Önceki özkütle PR #16: HEAD `f9d263be1b9ac8e295db49150e98663d6f8c28c2`, merge `dddf8141db9dd9a82f5329e82a6bf48a6f202058`. 419 birim/regresyon testi; Chromium ve WebKit CI başarılı. Vercel günlük dağıtım limiti nedeniyle canlıya geçiş doğrulanmadı. 9.2.1.1 ana kazanımı hâlâ geliştirme aşamasında.
