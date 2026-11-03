# AYT Fizik · Tork ve Denge (2018 MEB)

**Yayım durumu:** Kodlar toplu yayın için taslak PR #8'in mevcut `feature/ayt-2018-work-energy-impulse-momentum-batch` dalında tutulur. `main` dalına aktarılmamıştır. Bu dalın Vercel otomatik dağıtımını engelleyen geçici `vercel.json` dosyası tutulmalıdır; toplu yayın sırasında önce devre dışı ayar kontrollü biçimde kaldırılmalı, sonrasında topluca merge edilmelidir. iPad Safari'de gerçek cihaz testi henüz gerçekleştirilmedi.

## Tam kazanım eşleştirmesi — 2018 MEB

| Kazanım | Etkileşimli gözlem |
| --- | --- |
| **11.1.8.1 Tork kavramını açıklar** | Torku keşfet: seçilen kuvvet, uzaklık, açı, yön; saat yönü/tersi, sağ el kuralı ve ekrana dik vektör |
| **11.1.8.2 Torkun bağlı olduğu değişkenleri analiz eder** | Kuvvet ve kolu deneysel değiştir, kapıyı menteşeden uzak ve dik itme örneği |
| **11.1.8.3 Tork ile ilgili hesaplamalar yapar** | rFsinθ, negatif/pozitif tork, toplam moment ve günlük yaşam |
| **11.1.9.1 Cisimlerin denge şartlarını açıklar** | Tahterevallide ΣF = Στ = 0, iki destekli kiriş ve halatlı raf (iki bileşenli kuvvet dengesi) |
| **11.1.9.2 Kütle ve ağırlık merkezini açıklar** | Üç kütlenin 2B merkezi, farklı yerçekimi büyüklüklerinde merkezlerin ayrılabileceği düşünce deneyi |
| **11.1.9.3 Kütle ve ağırlık merkeziyle ilgili hesaplamalar yapar** | 2B ağırlıklı koordinat hesabı, iki kütlede ağırlık merkezi ve destek alanı deneyi |

### 8 gerçek zamanlı deney

1. **Torku keşfet:** kuvvet, açısı, dönme eksenine göre işaretli uygulama noktası. Sağ el kuralı: ekrana dışarı (+) / içeri (−).
2. **Kapı / menteşe:** kapıyı aynı kuvvetle farklı uzaklık ve yönlerden it; sonuç tork.
3. **Tahterevalli:** sol ve sağ kuvvet/kolları + destek tepkisi. Net torkun sıfır olması tek başına tam denge demek değildir.
4. **İki serbest destekli kiriş:** düzgün kirişin öz ağırlığı, değişen yük, sol/sağ destek yerleri. Cebirsel çözüm negatif destek kuvveti isterse gerçek iki destek dengesi **mümkün değil** uyarısı verir.
5. **Halatlı raf:** yatay raf, kuvvetin düşey bileşeninden tork, halat gerilmesi, menteşede yatay/düşey tepkiler.
6. **Üç noktanın 2B kütle merkezi:** her kütle ve her x/y pozisyon değiştirilebilir; merkez anında güncellenir.
7. **Kütle merkezi / ağırlık merkezi:** paralel ama değişken şiddetli yerçekimi için kavramsal ayrım. *Uniform g* kullanılırsa merkezler çakışır. Bu değişken g, sınavda ileri hesap zorunluluğu gibi sunulmaz.
8. **Destek ve devrilme sınırı:** ağırlık doğrusunun taban içinde kalmasının fiziksel önemi; gerçek dönme animasyonu değil, bir denge uygulaması.

**Doğrudan dokun–sürükle:** Tork ve kapı deneyinde kuvvet noktası, tahterevallide iki yükün kolu, kirişte yük/destekler, rafta ek yük, kütle merkezi deneyinde üç kütle, ağırlık merkezi deneyinde iki nokta, taban deneyinde ağırlık doğrusunun x konumu SVG üzerinde sürüklenebilir. Parmağını kaldırınca sürükleme biter; iPad için pointer capture sabit sahne kapsayıcısında tutulur. Kaydırıcılar tüm değişkenler için kullanılabilir ve klavye erişimini sağlar.

**Soru sayısı: 0 (bilerek).** Kullanıcının isteği doğrultusunda zorunlu, doğruluğu tartışmalı soru bankası yerine etkileşimli deney ve anlık açıklama önceliklidir. Paylaşılan mekanik arayüzünde test soruları bulunmayan laboratuvarlarda boş test sekmesi gösterilmez; diğer fizik laboratuvarlarının soru bankaları korunur.

## Bilimsel sınırlar

- **Statik kuvvet ve moment dengesi:** ΣF=0 ve Στ=0, bütün ilgili yönlerde gerekli. Torkun sağ el kuralı ekran dışı = + (saatin tersi), ekran içi = − (saat yönü).
- Tork = r × F × sinθ; burada **işaretli** r, dönme eksenine göre sağ/sol yönde konumdur ve θ, +x ile kuvvet doğrultusu arasındaki açıdır.
- Dengeyi aradığımız cisimler ideal rijittir. İp sürtünmesiz/ideal, yerçekimi sabit g (merkez farklılığı düşünce deneyi hariç).
- Kiriş **düzgün** ve destekleri yalnız **yukarı doğru** itebilir. Destek tepkisinin negatif çıkması, gerçekte dengede kalamayacağını gösterir, görünür değer yalnız matematiksel gerekliliktir.
- Duvar rafında menteşe hem yatay hem düşey kuvvet aktarabilir; raf sabit yataydır.
- Küçük cisim ve düzgün yerçekimi alanında kütle ve ağırlık merkezi aynı konumdadır. Yerçekimi büyüklüğü konumla değişip yönleri paralel kaldığında ağırlık merkezi kayabilir (yalnız açıklayıcı düşünce deneyi).
- Tork iş değildir; ikisinin birimleri N·m olsa da tork kuvvetin döndürme etkisidir. Bu laboratuvar gerçek dönme hareketini, açısal ivmeyi veya bir cismin düşme dinamiğini simüle etmez.
- Şekiller öğretim şemasıdır, gerçek geometri ölçeği değildir; kuvvetlerin sayısal büyüklükleri hesap motorunda tam belirlenir.
- **Basit Makineler 11.1.10** bir sonraki başlıktır, bu laboratuvara fazladan katılmamıştır.

## Test

```bash
node --check labs/tork-denge-math.js
node --check labs/tork-denge-lab.js
node --check labs/tork-denge-pointer.js
node --test labs/tork-denge.test.cjs labs/mekanik-dom.test.cjs
```

Testler tork yönü, kuvvetin açısı ve kolu, hem net kuvvet hem net tork şartı, destek tepkisinin fiziksel geçerliliği, 2B kütle merkezi, ağırlık merkezi farkı, raf kuvvetleri, devrilme sınırı ve 500 parametrik denge kontrolü içerir. DOM testleri sekme, sürgü ve anlık açıklamaları denetler. **Gerçek iPad Safari/Android testleri otomatik Node simülasyonuyla doğrulanamaz.**

## Kaynaklar

- [2018 MEB Ortaöğretim Fizik Öğretim Programı (Tork ve Denge)](https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf)
- [MEB Ölçme ve Değerlendirme — 2018 kazanım listesi](https://sakaryaodm.meb.gov.tr/meb_iys_dosyalar/2018_09/07090600_ORTA_YYRETYM_FYZYK_DERSY_KAZANIM_LYSTESY.pdf)
- [MEB OGM 2018 kazanım sırası](https://ogmmateryal.eba.gov.tr/v1/soru-bankasi-kazanim/fizik?d=34&k=0&s=8&u=0)
