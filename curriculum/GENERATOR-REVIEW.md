# Özdeş pil bağlantıları ve tükenme deneyi — 10.1.2.2(a,b,c,d)

5 Kasım2026; başlangıç main7af9a3bc54e3422d14a11ac492ffca576928dec4 (#33). 2018 MEB Fizik programı, basılı s.21,10.1.2.2: bağlantı/tükenme/ters bağlantı; farklı EMK paraleline girmeme; iç direnç nitel açıklama, hesap yok; Kirchhoff yok. (ç) Galvani–Volta görüş tartışması bu paketle tamamlanmaz; üst kazanım Geliştiriliyor kalır. Kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf .

Bilimsel kontrol: https://openstax.org/books/college-physics-2e/pages/21-2-electromotive-force-terminal-voltage . Kaynağın iç etkisi yük gerilimini azaltır. Aynı koşullu özdeş paralel piller akımı paylaşır ve aynı yük altında daha uzun çalışabilir. Seride gerilim artışı sabit yükün çektiği akımı büyütür; sadece toplam pil sayısından çalışma süresi çıkarılmaz. Bu kaynak TYT kapsamının yerine geçmez; ileri denklemleri öğrenciye eklenmedi.

## Model

İki özdeş pil: aynı1.5V elektromotor kuvvet, başlangıçta3600C kullanılabilir model yük kapasitesi. İç hesapta pil başına r=.04Ω veya .8Ω; öğrenciye r sayısı/hesabı verilmez. Aynı sabit yük3–12Ω; ideal teller ve etkisiz yerleşik V/I algılayıcısı. Düğümler gerçek öğrenci kablolarından birleşir. Tek pil yolu, iki pilli seri/ters seri ve eş yönlü paralel yollar belirlenir. EMK yönüne göre yük V/I işareti hesaplanır, öğrenci büyüklüklerini okur. Paralelde pil başına yük akımının yarısı; seride her pilden aynı akım geçer. Kapasite |I_pil|dt kadar azalır. Adım tükenme anında kesilir, negatif kapasite ve zaman aşımı yoktur. Testte kimyasal enerji azalması=harici yük enerjisi+iç kayıp doğrulanır.

İki özdeş ters seri kaynak sıfır net gerilim/akım verir, model kapasitesi azalmaz; bu kullanılabilir sonsuz enerji değildir. Ters kutuplu paralel veya kısa devre sanal kaynakları ayırır; uyarıyla yüksek akımlı yanlış animasyon oynatılmaz. Bu koruma gerçek sigorta/zaman/ısı modeli değildir. Farklı EMK/kapasite seçeneği yoktur; asimetrik paralel hesapları öğretilmez.

Sabit EMK, sabit r, keskin eşikli kapasite modeli; gerçek kimya, sıcaklık, yaşlanma, doluluk-gerilim eğrisi yok. 'İç etkisi büyük' yalnız r etkisini yalıtır; gerçek yaşlı pilin bütün özelliklerini temsil etmez. Model saati açıkça etiketlidir, gerçek pil ömrü tahmini olarak sunulmaz. Gerçek devrede uygunluk/koruma/üretici koşulları önemlidir.

## Öğrenme ve kabul

Boş tahtaya iki pil/yük ekle-kaldır; gövde taşı/döndür; gerçek kutup uçlarını sürükle veya sırayla dokunarak kablo kur. Döndürme kutupları parça üzerinde taşır, kabloyu kendiliğinden başka kutba takmaz. Bağlantı/yük/iç koşul değişikliği yeni tam dolu deney; yalnız geometrik taşıma elektrik sonucunu değiştirmez. Ön tahmin, gözlenen V/I, ayrı pil dolulukları, zaman grafiği, ölçüm defteri, tamamlanmış iki tükenme deneyi karşılaştırması, açıklama ve özgün YKS yorumu. Kısmi süre kaydı tam tükenme kanıtı sayılmaz. Yük/iç koşul değişmişse tek neden karşılaştırması reddedilir. Serbest açıklama otomatik bilimsel doğru sayılmaz.

12 yeni model testi: topolojiler, r etkili V/I, eş akım paylaşımı, ters seride enerji yokluğu, ters paralel/kısa/yük köprüsü, açık/boşta pil, sonlu tükenme, kimyasal enerji korunumu, iç etki, taşıma/döndürme/çıkarma, değişmez kayıtlar ve tam süre koşulu. Bir test ilk yazımda yük kaldırılınca ona bağlı kabloların da kaldırıldığını hesaba katmıyordu; kaynakların doğrudan ters paralel bağlandığı fiziksel durumla düzeltildi. Son model12/12; önceki496 ile toplam508.

Gerçek browser senaryosu kablo sürükleme/dokunma, parça taşıma/döndürme, tek/seri/paralel/ters seri, tam tükenme ölçümleri, büyük iç etki, kısa devre, kaldırma, soru ve iki ekran yönünü Chromium/WebKit üzerinde sınar. Son HEAD CI yeşil olmadan merge yok. Masaüstü WebKit gerçek iPad Safari değildir; Apple Pencil/çoklu dokunma/akıcılık ve canlı doğrulama ayrıca bekler. Elle Vercel üretim dağıtımı tetiklenmedi.
