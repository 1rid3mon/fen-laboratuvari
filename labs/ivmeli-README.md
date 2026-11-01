# AYT Fizik 2018 MEB — Newton'un Yasaları ve Bir Boyutta Sabit İvmeli Hareket

Bu geliştirme mezun öğrencinin **AYT Fizik** kapsamına göre 2018 MEB öğretim programını esas alır. Türkiye Yüzyılı Maarif Modeli içerikleri bu çalışma için **kullanılmamıştır**.

## 2018 MEB kazanım–uygulama kontrolü

| Kazanım | Etkileşimli öğrenme karşılığı | Doğruluk sınırı |
| --- | --- | --- |
| **11.1.3.1** Net kuvvetin yönü/büyüklüğü; yatay, düşey, eğik düzlem ve sürtünmeli/sürtünmesiz serbest cisim diyagramları | Newton: eylemsizlik, net kuvvet, yatay sürtünme, eğik düzlem, düşey duvara basma, açılı kuvvet, asansör; göster/gizle kuvvet okları | Statik sürtünme her zaman maksimum değildir. FBD kuvvetleri sadece **aynı cisimde** toplanır. |
| **11.1.3.2** Net kuvvet altında hareket hesabı ve günlük hayat uygulamaları | Newton: F=ma, bağlı bloklar, ideal makara, yön işaretleri, 19 özgün çoktan seçmeli soru | Birden çok cisimde ortak ivme ve ipte gerilme; makara dönme ataleti **kapsam dışı** |
| **11.1.4.1** Bir boyutta sabit ivmeli hareket ve x–t/v–t/a–t grafikleri ile dönüşümü | Bir Boyutta Sabit İvmeli Hareket: üç grafiği eşzamanlı incele, v(t), x(t), a(t), grafik eğimi, işaretli alan, yön değişimi | x–t eğimi v; v–t eğimi a; v–t alanı yer değiştirme; a–t alanı hız değişimi |
| **11.1.4.2** Bir boyutta sabit ivme hesapları | v=v₀+at; Δx=v₀t+½at²; v²−v₀²=2aΔx; fren süresi/mesafesi | Yer değiştirme ile alınan toplam yol **farklıdır**; hızla ivmenin işaretleri ayrı yorumlanır |
| **11.1.4.3** Hava direnci ihmal edilen serbest düşme | Düşey aşağı pozitif serbest düşme; konum, hız ve ivme grafikleri; çarpma süresi/hızı | Serbest düşme ivmesi kütleden bağımsız; çarpma sonrası ideal olarak durdurulur |
| **11.1.4.4** Hava direncinin bağlı olduğu değişkenler | Hava direnci karşılaştırması: temel k, kesit alanı, gövde şekli, hava yoğunluğu, kütle ve düşülen yol; dirençli/dirençsiz cismin aynı anda görünmesi | Hava direnci v, şekil, alan ve ortam yoğunluğuna bağlıdır; deneyde k bunları temsil eder |
| **11.1.4.5** Limit hız kavramı | Drag bölümünde direnç büyür, net kuvvet azalır ve limit hıza yaklaşma grafiği | MEB limit hızın matematiksel modelini tanıtır, **sayısal limit hız hesapları** yaptırmaz |
| **11.1.4.6** Düşey doğrultuda ilk hızı olan cisimlerin hareketi | Yukarı/aşağı yönlü ilk hız, tepe nokta, düşey atış, x–t/v–t/a–t grafikleri, düşme süresi | Yukarı (+) seçilirse a=−g; tepe noktada v=0 ama a=−g. Yatay/eğik atış **11.1.5'in ayrı konusu** |

### Laboratuvarlar

- **Newton:** [newton-hareket-yasalari.html](newton-hareket-yasalari.html)
- **Bir Boyutta Sabit İvmeli Hareket:** [bir-boyutta-sabit-ivmeli-hareket.html](bir-boyutta-sabit-ivmeli-hareket.html)
- **Önceki konu (Vektörler ve Bağıl Hareket):** [vektorler-bagil-hareket.html](vektorler-bagil-hareket.html)

## Deney tasarımı

### Newton (11 etkileşim)
1. Eylemsizlik: Fnet=0 iken durgunluk veya sabit hız
2. Net kuvvet: uygulanan kuvvetlerin işaretli toplamı, F=ma
3. Yatay yüzeyde statik/kinetik sürtünme
4. Eğik düzlemde ağırlığın bileşenleri ve sürtünme yönü
5. Düşey duvarda basma kuvveti, normal ve sürtünme
6. Yatay yüzeyde açılı kuvvet: normal, kayma, zeminden ayrılma
7. Bağlı iki blok: ortak ivme ve ipte gerilme (ideal sürtünmesiz)
8. İdeal Atwood makarası: iki kütlede aynı büyüklükte ivme ve ip gerilmesi
9. Asansörde görünür ağırlık ve ivme yönü
10. Newton üçüncü yasa: eşit ve zıt kuvvetlerin **farklı cisimlere** etkimesi
11. **19 özgün soruluk YKS mini testi**

Her fiziki deneyde kuvvet diyagramları açılıp kapatılabilir, zaman kaydırılabilir, kısa adımlarla ilerletilebilir veya oynatılabilir. Hareket çizimi idealize edilmiştir; bazı sahnelerde ekrana sığdırma için konum ölçeği sıkıştırılmıştır. Sürtünme modeli, başlangıçta durgun cisim için kaymanın ilk başlamasını analiz eder. Kinetik sürtünme, bir cisim durana kadar hareketin ters yönünde kalmalıdır; burada sürekli sürükleme simülasyonundan ziyade **ilk ivme** yorumlanır.

### Bir Boyutta Sabit İvmeli Hareket (7 etkileşim)
1. 1B hız/ivme/konum kontrolü
2. x–t/v–t/a–t grafik dönüşümleri
3. Frenleme ve durma mesafesi; yön değiştirme ayrı ilk iki deneyde
4. Serbest düşme (hava direnci olmadan)
5. Düşey yukarı / aşağı atış
6. Hava direnci ve limit hıza yaklaşma
7. **16 özgün soruluk AYT mini testi**

Konum, hız ve ivme grafiklerinin hepsi aynı saf fizik hesap motoruna dayanır. Ölçüm zamanı kaydırılabilir, deney oynatılabilir. Hava direnci bölümünde örnek model \(F_{\rm direnç}=k_{\rm etkin} v^2\) kullanılır; kesit alanı, şekil ve yoğunluk etkileri etkin katsayıya çarpan olarak eklenir. Bu, gerçek hava akışını hesaplayan CFD modeli değildir ve yalnız nitel açıklama içindir; **limit hız hesabı çalıştırılmaz veya sınav sorusu sorulmaz.** Hava direnci yokken formüller tam analitiktir; havalı düşmede analitik hız/yer değiştirme eğrileri aynı varsayımdan hesaplanır.

Serbest düşme, yukarı/aşağı atış ve hava direnci simülasyonunda cisim yere temas edince durur. Model çarpmanın süresini ve etkileşim kuvvetlerini çözmez; **çarpma hızı ayrı bilgi olarak** gösterilir. Zemin altına düşüş veya çarptıktan sonra hızlanma simüle edilmez.

## Mobil ve kalite

- İndirmesiz statik HTML+CSS+JS; Firebase, oturum açma veya ağ API isteği yok.
- Büyük kaydırıcılar ve mod düğmeleri, tablet/telefon ekranına uyumlu düzen.
- İvmeli hareket grafikleri mobilde tek sütuna iner.
- Kullanıcı **Oynat** demedikçe boş yere animasyon döngüsü çalışmaz. Sekme görünmez olduğunda durdurulur.
- Matematik, grafikler ve DOM gezinme Node 22 regresyonlarıyla test edilir.

**Komut:** \`node --test labs/hareket.test.cjs labs/ivmeli.test.cjs\`

**Test edilen sınırlar:** ivme/hız işaretleri, geri dönüşte alınan toplam yol, negatif buluşma zamanı, statik eşik, sürtünme katsayıları, eğik düzlem, düşey duvar, açılı kuvvette temasın kaybı, asansör, bağlı iki blok, ideal Atwood, grafik eğimi/işaretli alan, fren mesafesi, serbest düşmede çarpma, tepe noktasında ivme, hava direnci ve limit hızın nitel davranışı.

**Son kabul sınırı:** Otomatik DOM testleri gerçek iPad Safari dokunma ve tüm tarayıcı çizimlerinin manuel testinin yerini almaz. Vercel'in \`build-rate-limit\` hatası varsa GitHub'da birleştirme **canlı üretim yayını anlamına gelmez**.

## Resmî kaynaklar
- MEB 2018 Fizik programı: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf
- MEB OGM kazanım bazlı Fizik soru bankası: https://ogmmateryal.eba.gov.tr/v1/soru-bankasi-kazanim/fizik?d=34&k=0&s=8&u=0

2027 YKS'nin nihai sınav kapsamı için ilgili yılın ÖSYM konu-kazanım duyuruları önceliklidir.
