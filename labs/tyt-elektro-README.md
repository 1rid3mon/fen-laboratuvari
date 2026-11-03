# TYT Fizik 9.6 — Elektrostatik (2018 MEB)

**TYT kategorisi** · 2018 MEB 9.6.1.1–9.6.1.4. Maarif Modeli kullanılmaz.

Resmî kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf — s. 21.

## Kazanım – etkileşim eşleştirmesi

| Deney | Kazanım | Fiziksel etkileşim |
| --- | --- | --- |
| Sürtünme | 9.6.1.1(a,b) | Çubuğu yüne sürükle, elektron transferi ve toplam yük korunumu |
| Dokunma | 9.6.1.1(a,b) | Özdeş metal küreleri temas ettir, yükler eşit paylaşılsın |
| Etki ile yükleme | 9.6.1.1, 9.6.1.2(c) | Çubuk yaklaşır → toprak bağlanır → toprak kesilir → çubuk uzaklaşır |
| Elektroskop | 9.6.1.1(c) | Ön yüklü elektroskoba çubuk yaklaştır, yaprak açısını izle |
| İletken–yalıtkan | 9.6.1.2(a) | Yüzeyde yük dağılması ve yalıtkanda yerel yük |
| Topraklama | 9.6.1.2(c) | Bağla, nötrle, ayır; elektron akışını gör |
| Faraday kafesi | 9.6.1.2(b) | Kafesi aç/kapat, dış yükü sürükle, içerideki korumayı gözlemle |
| Coulomb | 9.6.1.3 | Yükleri tutup sürükle, 1B kuvvetin yön ve büyüklüğünü karşılaştır |
| Elektrik alan | 9.6.1.4 | Pozitif/negatif kaynak, deneme yükü; E ve F yönü, sayısal hesap yok |
| Nötr kâğıt | 9.6.1.1 ve 9.6.1.3 | Yüklü çubuk yaklaşır, polarizasyon ve çekimi gösterir |

## Önemli fiziksel sınırlamalar

- Sürtünmede elektronlar aktarılır, proton aktarılmaz. Toplam yük korunur. İşaret sayıları kavramsal temsildir.
- Özdeş ve çevreden yalıtılmış metal kürelerde yük **fiziksel temas halinde** eşit paylaşılır. Uzaktan yaklaşma net yük transferi olarak gösterilmez.
- Etkiyle yüklemede yalnız yaklaştırmak net yük oluşturmaz. Çubuk yakındayken toprak bağlantısını kes, sonra çubuğu uzaklaştır. Toprak ile birlikte sistem yükü korunur.
- Ön yükü bilinmeyen nötr bir elektroskop, yaklaşan yükün işaretini tek başına belirleyemez.
- Faraday kafesi ideal kapalı iletken ve dış **elektrostatik alan** için modellenir. Açık kafeste veya zamana bağlı elektromanyetik alanlarda aynı garanti verilmez.
- **Coulomb sayısal hesabı serbesttir:** 1 boyut, noktasal yükler, k≈9×10⁹ N·m²/C², q mikroCoulomb, r metre, F Newton. F=k|q1q2|/r².
- **Elektrik alan sayısal hesaplaması yasaktır:** E=F/q0 kavramsal matematiksel model; N/C veya V/m sayısal ölçüm/hesap verilmez.
- Nötr kâğıt polarize olur ama yük transferi olmadan toplam yükü sıfır kalır.
- Çizimler eğitim için 2B temsillerdir; gerçek 3B Maxwell çözümü, gerçek elektrostatik güvenlik testi veya gerçek iPad Safari kabul testi değildir.

## Teknik

Dosyalar: labs/tyt-elektro-math.js, labs/tyt-elektro-lab.js, labs/tyt-elektro-pointer.js, labs/tyt-elektrostatik.html, labs/tyt-elektro.test.cjs ve .github/workflows/tyt-elektro-ci.yml.

Test: node --test labs/tyt-elektro.test.cjs

Bütün hareketler yalnız kullanıcı eylemiyle başlar; sekme değişikliği ve görünürlük kaybında durur. Nesne sürükleme sabit sahne kapsayıcısında pointer capture ile korunur. Dokunmatik alternatifleri sürgülerdir.

PR #9 taslak dalda tutulur. Açık toplu yayın izni olmadan main veya Vercel production'a alınmaz.
