# AYT Biyoloji — Fotosentez ve Kemosentez Laboratuvarı

**Bağımsız adres:** `/labs/enerji-lab.html`

**Kapsam:** 2018 MEB Biyoloji Öğretim Programı, AYT Fotosentez / Kemosentez. 2026–2027 öğretim yılında 12. sınıfta eski program yürürlüktedir. 2027 YKS'nin nihai konu-kazanım sınırlarında ilgili yılın ÖSYM açıklaması önceliklidir.

## Kazanım denetim matrisi

| Resmî kazanım | Bu laboratuvardaki karşılığı | Gerekli sınır |
| --- | --- | --- |
| 12.2.2.1 Fotosentezin önemi ve gelişiminde bilim insanları | Deney 1: Fotosentezin önemi, van Helmont, Priestley, Ingenhousz, Engelmann, Calvin | Araştırmacıların katkıları kısaca verilir. |
| 12.2.2.2 Fotosentezi şemada açıklar | Deney 1-3: Kloroplast, ışığa bağımlı ve ışıktan bağımsız evrelerin girdileri ve ürünleri | Suyun fotolizi belirtilir. Reaksiyon basamakları, matematiksel hesaplar, CAM/C4, pigment kimyasal yapısı işlenmez. |
| 12.2.2.3 Fotosentez hızına etki eden faktörler | Deney 4-5: Işık şiddeti, dalga boyu, sıcaklık, klorofil, CO₂; kontrollü deney ve sera LED uygulaması | Kontrol edilen/bağımsız/bağımlı değişkenler ayrılır; grafikler temsili modeldir. |
| 12.2.3.1 Kemosentez olayı | Deney 6-9: İnorganik enerji kaynağı vs CO₂, aerobik kemosentetik örnekler, nitrifikasyon, kemosentetik ekosistem ve endüstriyel kullanım | Tüm kemosentez yapanların O₂ gerektirdiği iddia edilmez. |

## Dokuz etkileşimli deney

1. Kloroplast; yapılar, molekül eşleştirme ve bilim insanları
2. Işığa bağımlı evre: ışık/H₂O/ADP + Pi/NADP⁺ girdileri; O₂, ATP, NADPH ürünleri; oksijen izotopunun kaynağı
3. Calvin döngüsü: stromada CO₂/ATP/NADPH girdileri, organik madde sentezi; **hesaplama yapılmaz**
4. Fotosentez hızı: bağımsız değişkenle grafik, kontrollü ölçüm kaydı, sera LED uygulaması
5. Pigmentler: değiştirilebilir soğurma eğrileri, **ayrı etki spektrumu** ve Engelmann modeli
6. Kemosentetik enerji kaynağı: beş aerobik örnek, doğru sıra ve çift sayımı önleme
7. Yeşil bitki, siyanobakteri, mor kükürt bakterisi ve kemoototrof: enerji/karbon/elektron kaynağı karşılaştırması
8. Nitrifikasyon: NH₃ / NH₄⁺ → NO₂⁻ → NO₃⁻; bitkilerin mineral azotu kullanması; denitrifikasyondan farkı
9. Kemosentetik ekosistem ve uygulamalar: karanlık, CO₂, O₂, inorganik substrat, arıtma ve biyomadencilik

## Bilimsel sınırlar ve modellenen varsayımlar

- Grafikler **temsilî bağıl eğilim** gösterir; deneysel kesin yüzde değildir.
- Pigmentin ışığı soğurması ile fotosentez etkinliği **farklı** kavramlardır. Engelmann'da aerob bakteriler algin ürettiği O₂'ye tepki verir. Klorofil a bulunmayan yalnız-karotenoit örneğinde oksijenli fotosentez modellenmez.
- Hız modelindeki örnek 28°C optimumu evrensel değildir. O₂ kabarcığı, hız ölçümünde bir vekil olabilir; tür ve koşullar önemlidir.
- Calvin deneyinde 1 CO₂ = 1 glikoz gibi yanlış çıkarıma yer verilmez. ATP/NADPH'nin tüketilmesi öğretilir; **18 ATP/12 NADPH gibi ezberler zorunlu sınav içeriği olarak verilmez**.
- Kemosentez yalnızca **bazı prokaryotlarda** görülür. Modellerden bazıları **aerobik** seçilmiştir; anaerobik kemoototroflar da olabilir.
- Nitrifikasyon, amonyumun nitrata dönüştürülmesidir; arıtımda azotun sudan **tamamen uzaklaştırılmasıyla özdeş değildir**. Denitrifikasyon farklıdır.
- Veri ve sayaçlar gerçek deneysel molekül sayıları değildir; kavramsal etkileşimi ve kayıtları gösterir.

## Kontrol ve test

- `node --check labs/enerji-core.js`
- `node --test labs/enerji-*.test.cjs`
- GitHub Actions: `.github/workflows/ayt-biyoloji-ci.yml` üzerinden otomatik kontrol.
- Testler: dokuz modülün kaydı, giriş/ürün ayrımı, kontrollü ölçüm, grafikte seçilen pigmentin etkisi, aerobik kemosentez sıra/sayaç doğruluğu, mobil dokun-seç mantığı ve canlı kaydırıcı DOM simülasyonu.
- **Sınır:** Node/DOM taklit testleri gerçek Safari/iPad veya Chrome'da manuel son kullanım testinin yerini almaz.

## Güvenlik ve dağıtım

Bağımsız HTML/CSS/JS'dir; dış CDN, Firebase, API anahtarı veya kullanıcı hesabı gerektirmez. GitHub ana sayfasından yeni rota bağlantısı vardır. Vercel'in build-rate-limit engeli varsa GitHub birleşimi canlı yayın anlamına gelmez.

## Resmî kaynaklar

- MEB Fen Lisesi 2018 Biyoloji Öğretim Programı:
  https://mufredat.meb.gov.tr/Dosyalar/20182215556798-Fen%20Lisesi%20B%C4%B0YOLOJ%C4%B0%20D%C3%96P.pdf
- MEB 2026–2027 program uygulaması:
  https://ogm.meb.gov.tr/www/2026-2027-egitim-ogretim-yili-turkiye-yuzyili-maarif-modeli-taslak-cerceve-planlar-yayimlandi/icerik/2633/tr
- MEB örnek fotosentez soruları:
  https://odsgm.meb.gov.tr/destekmateryal/pdf/mezunkt/biyo/25.pdf
