# TYT / AYT Fen Laboratuvarları — Etkileşim Denetimi

Denetim: 4 Kasım 2026 · Kaynak: `feature/physical-interaction-v2-20261103` · PR #9.

## Envanter ve gerçek durum

**33 HTML giriş sayfası** bulundu. Bunlar 32 deney/uygulama sayfası ve 1 biyoloji öğrenme rotası olarak ayrılır. Bazı deneyler aynı konunun eski ve yeni alternatif sürümleridir; 33 sayfa, 33 farklı MEB ünitesi anlamına gelmez.

| Kategori | Sayfa sayısı | Koddaki mevcut etkileşim |
| --- | ---: | --- |
| TYT Fizik | 9 | 6 optik Canvas laboratuvarı; Isı–Sıcaklık (15 deney); Elektrostatik (10); Elektrik Devreleri (10) |
| AYT Fizik | 15 | Newton, vektör/bağıl hareket, ivmeli ve atış, enerji, momentum, tork, basit makineler, elektrik alan, sığa, manyetizma, alternatif akım ve 3 çembersel hareket sürümü |
| AYT Biyoloji | 8 | Genden proteine, DNA, transkripsiyon, translasyon, fotosentez/kemosentez; 1 sayfa yalnız yönlendirme/öğrenme rotası |
| TYT Coğrafya | 1 | Etkileşimli harita ve soru uygulaması |
| **Toplam** | **33** | Her aktif deney sayfasında script/çizim/olay altyapısı doğrulanır |

## Kodda yapılan iyileştirmeler

**Bu geliştirme dalında:**
- Basit Makineler 8 fiziksel SVG kinematik düzenek ve iPad parmak/kalemle sürükleme.
- Sığa 6, Manyetizma 11, Alternatif Akım 5 sekmeye fiziksel parametreye duyarlı SVG şekilleri; bazılarına doğrudan dokunma ve oynatma.
- Elektrik Alan kaynak yük ve prob sürükleme.
- Optik aydınlanma, gölge ve kırılma sayfalarında ışık kaynağı/engel/su altı cismi sürükleme.
- TYT Isı–Sıcaklık 15 yeni deney, TYT Elektrostatik 10 yeni deney, TYT Elektrik Devreleri ve Manyetizma 10 yeni deney.
- Tüm laboratuvar sayfaları için JavaScript kaynaklarının varlığı, etkileşim işleyicileri, çizim yüzeyleri, HTML satır içi kod sözdizimi ve kritik dokunma dosyaları üstünde her committe çalışan otomatik denetim: `labs/tum-laboratuvar-etkilesim.test.cjs`.

**Zaten etkileşimli olduğu için baştan yazılmadan korunanlar:**
- Çembersel Hareket sürümleri: Canvas animasyonları.
- Newton/İvmeli/Atış/Vektör/Bağıl Hareket: mevcut hareket, çizim ve olay işleyicileri.
- Tork/Denge: önceden mevcut SVG sürükleme.
- İş–Güç–Enerji ve Momentum: mevcut oynatma + tepki veren grafik/şemalar.
- TYT Optik Mercek/Ayna/Renkler: mevcut Canvas çizim, sürükleme veya renk/filtre butonları.
- AYT biyoloji, DNA, transkripsiyon, translasyon, fotosentez/kemosentez, TYT coğrafya: kendi DOM/SVG/Canvas kontrol sistemleri.

## Kanıtın sınırı ve açık maddeler

Bu tarama **bir kaynak kodu ve otomatik test denetimidir**. Görsel bir etkileşimin pedagojik olarak doğru, iPad'de akıcı veya gerçek fizik hareketi kadar anlaşılır olduğunu tek başına kanıtlamaz. 33 HTML girişinin tümünün script/olay/çizim altyapısı bulunması, her alt sekmenin gerçekten animasyonlu olduğu anlamına gelmez.

**Hâlâ kabul testi gerektiren alanlar:** 3 çembersel hareket sürümünün birleştirilmesi; biyolojinin tüm deneylerinde iPad dokunma/geri bildirim kontrolü; eski optik ve hareket sahnelerinin hepsinde sürüklemenin yeniden çizimde kopup kopmadığı; telefon portre ekranları; gerçek Safari/Apple Pencil ile ölçü ve menü tutarlılığı. Bu alanları otomatik testleri başarılı diye tamamlandı olarak işaretlemiyoruz.

**Müfredat kapsama uyarısı:** Mevcut giriş sayfaları 2018 MEB TYT ve AYT konularının tamamını temsil etmez. Örneğin TYT basınç–kaldırma kuvveti ve dalga ünitesi için bu envanterde bağımsız laboratuvar sayfası bulunmamaktadır. Bu, etkileşim kalitesi denetiminden ayrı bir eksik konudur.

**Yayın güvenliği:** PR #9 taslakta kalır; `main` ve Vercel üretim sürümü, kullanıcı açık toplu yayın izni vermedikçe değiştirilmez.

## Doğrulama komutları

`node --test labs/tum-laboratuvar-etkilesim.test.cjs`

`node --test labs/tyt-devre.test.cjs`

`node --test labs/isi-sicaklik.test.cjs`

`node --test labs/tyt-elektro.test.cjs`

Diğer mevcut fizik regresyonları `.github/workflows/ayt-fizik-hareket-ci.yml` ile çalışır. Denetim testlerinin geçmişte başarılı olması, daha sonraki commitler için yeniden koşma gereğini kaldırmaz.


## 4 Kasım ek fizik doğruluk düzeltmeleri

- TYT Basınç ve Dalgalar ile AYT Dalga Mekaniği ve Modern Fizik sayfaları eklendi. Önceki envanterdeki 33 sayfa sayısı artık **güncel değildir**; otomatik testler en az 33 sayfa bulunduğunu denetler, tüm yeni kazanımların tamamlandığını değil.
- TYT Arşimet kaldırma kuvveti artık **batan hacim** üzerinden hesaplanır. Yüzen, askıda ve batan durumların sahne konumları ayrıldı. Basınçta temsili alan birimi açıkça belirtildi.
- AYT elektromanyetik dalgada E/B salınımlarının faz uyumu düzeltildi. Çift yarık maksimumları ve tek yarık minimumları ayırt edildi. Fotoelektrik eşik enerjisi için sıfır kinetik enerji durumu belirtildi. Siyah cisim çizimi, Wien tepe konumu ile normalize Planck eğrisi üzerinden hesaplanır.
- **Sınır:** Çift/tek yarık, Doppler ve Compton sahneleri nitel ve şematiktir; tam dalga alanı veya nicel saçılma deney düzeneği değildir. Özel görelilik ve yarı iletkenler de öğretici idealizasyon kullanır. Tüm 2018 MEB TYT/AYT kazanımlarının satır satır karşılandığına ilişkin kanıt hâlâ oluşturulmamıştır. Kullanıcıya %100 müfredat uyumu iddiasında bulunulamaz.
- **Yayın:** PR #9 draft; main ve Vercel üretimi değiştirilmez.
