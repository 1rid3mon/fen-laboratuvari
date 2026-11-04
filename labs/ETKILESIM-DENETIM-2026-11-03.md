# Fen Laboratuvarı — Fiziksel Etkileşim Denetimi (3 Kasım 2026)

## Neden bu değişiklik?

Önceki Basit Makineler sayfasında matematik motoru dişli/kasnak dönme oranlarını doğru hesaplasa da `scene` yalnız statik SVG üretiyordu. Slider hareketi görsel hareketle eşleşmiyordu. Bu durumu fiziksel model parametrelerinin **doğrudan SVG pozisyonuna ve dönüş açısına** bağlanmasıyla düzelttik.

## Yeni kodla değiştirilen deneyler

| Sayfa | Sekme | Fiziksel davranış | Doğrudan dokunma |
|---|---:|---|---|
| Basit Makineler | 8 | Kaldıraç açısı, makara-yük yolu, rampada cisim konumu, çıkrık ip sarma, vida ilerleme, dişli hız/yön oranı, açık/çapraz kasnak, iki aşamalı yük | Evet: döndür / sürükle + oynat / duraklat / adım / sıfırla |
| Sığa | 6 | Levha aralığı/alanı/dielektrik, bağlı-ayrılmış yük eğilimi, seri-paralel devre, günlük enerji depolama | Plaka aralığı sürüklenebilir; diğerlerinde slider |
| Manyetizma | 11 | Alan yönü ve şiddet eğilimi; halka/bobin; tel kuvveti; yük yörüngesi; akı; Faraday; iletken çubuk; transformatör; tel çerçeve; öz-indüksiyon; motor/dinamo | Yörünge/çubuk/akı sürüklemesi; 5 bölümde oynatma, diğerlerinde slider |
| Alternatif akım | 5 | AC/DC hareket yönü, R/L/C devre davranışı, rezonans tepkisi | Akım taşıyıcıları sürüklenebilir, 4 bölümde oynatma; RLC grafik yasağı korundu |
| Elektriksel Alan | 8 | Kaynak elektrik alan vektörleri, bileşke, deneme yükü ve eş potansiyel | Uygun sekmelerde kaynak yük ve ölçüm noktası sürüklenebilir |
| TYT Optik — Gölge | 1 sayfa | Kaynak, engel çapı, ekran uzaklığı hareketi | Yeni kaynak/engel/perde sürüklemesi |
| TYT Optik — Aydınlanma | 1 sayfa | Yükseklik arttığında kaynak zeminden gerçekten uzaklaşır; aydınlanma azalır | Yeni lamba sürüklemesi; ayna ışını önceden sürüklenebiliyordu |
| TYT Optik — Kırılma | 1 sayfa | Suda gerçek ve görünür derinlik birbirine bağlı değişir | Yeni su altı cismi sürüklemesi; gelen ışın önceden sürüklenebiliyordu |

## Mevcut, kontrol edilmiş fakat baştan yazılmamış etkileşimler

- **Tork/Denge (8 sekme):** önceden mevcut `tork-denge-pointer.js` doğrudan SVG kontrolü.
- **İş/Güç/Enerji ve Momentum:** her birinde mevcut `animate` hareket paneli; yeni hareket altyapısı bunları bozmadan korur.
- **Newton, Sabit İvmeli, Atışlar, Vektör/Bağıl Hareket:** mevcut `requestAnimationFrame`/olay tabanlı motorlar incelendi; fizik modelleri bu pakette değiştirilmedi.
- **Çembersel Hareket (3 HTML sayfası):** mevcut canvas ve animasyon olayları korunur. Çift sürüm/kalite birleştirmesi bu paket kapsamında yapılmadı.
- **TYT Optik diğer sayfalar:** mercek ve ayna cisim sürükleme önce de vardı; renk ve soruların düğme tabanlı etkileşimi sürüyor.
- **Biyoloji, fotosentez, DNA ve coğrafya:** mevcut etkileşimli arayüzler korunur. Bu paket bunların her birini fiziksel sürükle–hareket animasyonuna dönüştürmez.

## Fiziksel ve test sınırları

- Gerçek dişli çarklarda diş sayısına göre **zıt dönüş**; açık kayışta aynı, çapraz kayışta ters; kayma yok varsayımı. Hareket oranları `BasitMakineMath` üzerinden gelir.
- Enerji/yük yolu ve mekanik kazanç için mevcut model korunur; şema konumları eğitim amaçlı ölçeklenmiştir. Makara ip sarımı ve diş temas geometrisi mühendislik düzeyinde bir rijit-cisim çözücüsü değildir.
- MEB 2018 kapsamı korunur; matematiksel hesabın yasaklandığı bölümlerde sayısal çözüm gösterilmez. Alternatif akım için akım-zaman grafiği oluşturulmaz.
- **CI doğrulaması**: 141/141 Node.js birim, DOM ve sentetik pointer testi geçti. Bu, gerçek Safari/iPad/Pencil gecikmesi, görsel okunabilirlik veya bütün müfredat kazanımlarının pedagojik yeterliliği için kabul testi yerine geçmez.
- Kullanıcı istemedikçe yeni geliştirme `main` ve production Vercel'e alınmaz. Vercel preview rate limitini korumak için geçici `vercel.json` branch dağıtımını kapatır; yayın öncesi kaldırılmalıdır.
