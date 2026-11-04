# TYT Fizik — Elektrik Devreleri / 2018 MEB 10.1

Resmî 2018 MEB Fizik programı, **10.1 Elektrik ve Manyetizma (s. 22–23)**: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf

## Gerçek devre bağlantısı

Devre tahtası `labs/tyt-devre.html` üzerinden açılır. Öğrenci pilden çıkan kabloyu **terminalden terminale dokunarak/sürükleyerek** bağlayabilir; kablo gerçek devre topolojisine katılır. Seri, paralel, Ohm, ampermetre–voltmetre ve tehlikeli kısa bağlantı örnekleri hazır gelir. Ayrıca kullanıcı tamamen boş devreden başlayabilir, kabloları tek tek silebilir, anahtarı doğrudan çizimden veya düğmeden açıp kapatabilir.

Devre modeli ideal gerilim kaynağı, ideal bağlantı kabloları, ampullerde sabit direnç yaklaşımı ve yaklaşık ideal ampermetre (0,002 Ω)/voltmetre (1 GΩ) kullanır. Düğüm potansiyelleri **arka plandaki fizik motorunda** çözülür. Kullanıcıya Kirchhoff denklemleri öğretilmez. Kapalı devrede **I, V, R, P**, ampullerin güçleri ve parlaklıkları hesaplanan fiziksel ağdan gelir; ışık efekti rastgele değildir. Bağlantısı olmayan/anahtarı açık ampul sönük kalır. Kaynak doğrudan kısa devre olursa veya toplam akım 8 A'ı aşarsa **sanal koruma** devreye girer. Bu, gerçek elektrik sigortasının fiziksel simülasyonu değildir; riskli devrenin güvenli eğitim gösterimidir.

Hareketli yük parçacıkları, kablo grafındaki elektrik akımına bağlı olarak yalnız oynatma açıkken görünür. İdeal paralel kablo çevrimlerinin akımı tekil belirlenemediği için animasyon için **deterministik bir iletken ağaç akışı** seçilir; matematiksel olarak tüm ideal kablo halkalarında tekil yük hareketi iddiasında bulunulmaz.

## 10 etkileşimli sekme

| Sekme | Kazanım | Eylem |
| --- | --- | --- |
| Kabloyla devre kur | 10.1.2.1, 10.1.2.3 | Pil, anahtar, R, iki ampul, A, V gerçek terminal bağlantısı |
| İletken direnci | 10.1.1.2 | Tel uzar/kalınlaşır, direnç eğilimi değişir |
| Üreteçler | 10.1.2.2 | Özdeş 1,5 V piller seri/paralel/seri ters, gerilim ve tükenme karşılaştırması |
| Güç ve parlaklık | 10.1.2.3 | Direncin harcadığı güç ve lamba parlaklığı fiziksel olarak ilişkilidir |
| İletim ortamları | 10.1.1.1 | Katı, sıvı, gaz, plazma yük taşıyıcıları; elektron yönü geleneksel akıma ters |
| Mıknatıs / pusula | 10.1.3.1, 10.1.4.2 | Çubuk mıknatısı döndür, dipol alan yönleri ve pusula cevap versin |
| Mıknatıs kutupları | 10.1.3.1 | Zıt kutup çeker, aynı kutup iter; kuvvet okları değişir |
| Elektromıknatıs | 10.1.4.1 | Sarım, akım işareti, demir çekirdek ile alan tepkisi |
| Akımın manyetik alanı | 10.1.4.1 | Düz telde sağ el kuralı, uzaklık, akım yönü |
| Elektrik güvenliği | 10.1.2.4 | Islak ortam, hasarlı kablo, sigorta ve topraklama etkileri |

### Müfredat sınırları

- **10.1.1.2**: `R ∝ ρL/A` matematiksel ilişkisi var, **sayısal direnç malzeme/kesit/uzunluk hesabı yok**. Sıcaklıkla özdirenç değişimi ve renk kodu öğretilmez.
- **10.1.2.1**: Ohm yasası, seri/paralel eşdeğer direnç, devre akımı ve potansiyel farkı hesaplanabilir. A ve V gerçek konumlarında okunur.
- **10.1.2.2**: Yalnız özdeş piller paralel; farklı elektromotor kuvvetli üreteçler paralel bağlanmaz. Pil iç direnci örnekle açıklanır ama **hesabı yok**. Kirchhoff kanunları **öğretilmez**. Galvani–Volta bakış farkı belirtilir.
- **10.1.2.3**: Direncin birim zamanda harcadığı enerji/güç hesaplanabilir; kapsam dışı güç/enerji problemleri verilmez.
- **10.1.3–10.1.4**: Mıknatısların itme/çekme kuvvetlerinin sayısal hesabı, manyetik alan şiddeti ve yönünün matematiksel sayısal çözümü **yoktur**.
- **10.1.2.4**: Elektrik tehlikeleri yalnız sanal olarak gösterilir. **Gerçek priz veya şehir şebekesi ile deney yapılmamalıdır.**

## Doğrulama sınırı

`node --test labs/tyt-devre.test.cjs` devre topolojisi, kısa devre, A/V ölçümleri, güç, seri/paralel, Ohm ve sentetik iPad pointer olaylarını test eder. `node --test labs/tum-laboratuvar-etkilesim.test.cjs` tüm laboratuvarların giriş dosyalarını, script bağlantılarını, çizim ve olay altyapısını tarar.

**Önemli:** Kod ve DOM testleri, gerçek iPad Safari'deki dokunma, renk/kontrast, performans ve her bir kazınımın anlaşılmasını garanti etmez. Bu paket, PR #9 geliştirme dalında bekler ve kullanıcı açıkça yayın istemedikçe canlı Vercel'e aktarılmaz.
