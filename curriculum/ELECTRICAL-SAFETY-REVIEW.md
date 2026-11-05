# Elektrik güvenliği — 10.1.2.4

5 Kasım2026; başlangıç mainf4d8a7a7882c54186cd6ab5e6c6ee83789ce8586 (#38). MEB2018 basılı s.22,10.1.2.4 sağlık/güvenlik önlemleri. Kapsam https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf . Gerçek tesisat/insan üzerinde deneme yönergesi veya güvenlik/tıbbi hesap değildir.

## Yetkili kaynaklarla bilimsel kontrol

HSE https://www.hse.gov.uk/electricity/electricequip.htm hasarlı ekipmanın kullanımını durdurma ve yetkin kontrol; https://www.hse.gov.uk/electricity/introduction.htm uygun donanım/koruma ve ıslak ortam; https://www.hse.gov.uk/electricity/faq.htm temas koşullarının riskte önemi; https://www.hse.gov.uk/construction/safetytopics/systems.htm kaçak korumasının bütün arızaları algılamaması; https://www.hse.gov.uk/pUbns/priced/hsr25.pdf topraklama/arıza çevrimi/aşırı akım ayırması. Bunlar fiziksel işlev kontrolü içindir; Türkiye'de tesisat mevzuatı veya uygulama sertifikası olarak sunulmaz.

## Model

Metal gövdeli Sınıf I cihaz, referanslı230V RMS direnç şeması. İç parametreler: yük başına6A, faz–gövde arızası1Ω, düşük empedanslı PE örneği.5Ω; örnek temas yolları kuru5000Ω/ıslak1000Ω. Bunlar kişiye özgü vücut dirençleri değildir ve öğrenciye insan akımı/tehlikesiz süre hesabı olarak gösterilmez. Gövde akımı/gerilimi basit paralel iletkenlikten çözülür; ıslaklık kaynak gerilimi veya kendiliğinden akım üretmez. Arıza yoksa yalıtılmış gövdeye temas yolundan sıfır akım; arızalı/topraktan yalıtılmış gövde temas yokken gerilimli olabilir.

Kaçak algısı örnek.03A; aşırı akım korumasının hızlı bölümü>80A örneği. Düşük empedanslı PE arızasında yüksek hata akımı ayırmaya yol açar. Topraklama tek başına gövdeyi sihirli biçimde sıfır yapmaz; uygun koruma/çevrim koşulu gerekir. Dengeli iki iletken temasında kaçak farkı oluşmayabilir ve temas akımı aşırı akım açmasına yetmeyebilir. Orta aşırı yükte model risk/ısıl gecikme uyarısı verir; gerçek olmayan anlık termik açma oynatılmaz. Isıl zaman eğrisi, AC dalga biçimi, kapasitans, topraklama sistemleri ve korumanın gerçek açma süresi bu işlev modelinde çözülmez. Fiziksel varsayımlar bu sınırlarla tutarlı tutulur; uyarı altında hatalı güvenli durum çizilmez.

Koruma açınca aktif kaynak akımı/gövde gerilimi sıfırlanır; arıza bayrağı kalır. Açma kilitlidir; tekrar enerji verme arızayı onarmış sayılmaz. Yeni koşul UI'da kaynağı ayırarak yeni sanal deneme başlatır. Ekran 'güvenli' sertifikası vermez; seçili modelde arıza görülmemesini gerçek güvenlik onayından ayırır. Çift yalıtımlı cihaz ile metal gövdeli Sınıf I örneğinin farklılığı belirtilir.

## Öğrenme döngüsü ve kabul

Koruma kartlarını hatta, PE'yi gövdeye, yük kartlarını cihaz bölgesine sürükleyerek öğrenci önlem/yük düzenini kurar; yükü kaldırabilir. Yalıtım, ortam, yük ve yalnız sanal temas yolunu bağımsız değiştirir. Ön tahmin, enerji verme, gözlenen canlı gövde/temas yolu/koruma, kayıt, bir koşullu karşılaştırma, açıklama ve özgün YKS sorusu vardır. Kaynağı ayırma ve arıza giderme aynı şey değildir. Islak/hasarlı ekipmanı kullanım dışı bırakma, bantla onarma/korumayı iptal/daha büyük sigorta ile geçiştirmeme, yetkin kontrol ve enerji kesilmeden kazazedeye temas etmeme vurgulanır. Serbest yazı otomatik bilimsel doğru sayılmaz.

10 yeni model testi: floating gövde/kaçak yokluğu, PE+aşırı akım, tek PE gerilimi, gövde temasında farklı korumalar, dengeli iki iletken yolu, ıslaklığın doğru rolü, gecikmeli aşırı yük, açmanın kilitlenmesi/arıza kalıcılığı, kayıt/tek değişken, ayrılmış–enerjilenmiş farklı başlangıç kapısı. Önceki526 ile536/536 yerel test. Browser senaryosu gerçek kart/yük sürükleme, kaynak/koruma durumları, yanlış tahminler, arızanın sürmesi, defter/karşılaştırma/soru ve iki ekran yönünü sınar. Son HEAD CI/Chromium/WebKit yeşil olmadan merge yok. Gerçek iPad Safari/Apple Pencil/çoklu dokunma/cihaz akıcılığı ve bütün canlı kabulü bekliyor; elle Vercel üretim deploy yok.
