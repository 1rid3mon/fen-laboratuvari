# İletken direnci — 10.1.1.2

MEB 2018 Fizik10.1.1.2(a,b), resmi program basılı s.21: değişkenleri deneyle araştırıp matematiksel ilişkiyi çıkarma; sayısal direnç hesabına girmeme, sıcaklık bağımlılığı ve renk kodunu öğretmeme. Kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf . Arayüzde sıcaklık kontrolü/renk kodu/sayısalR yok; boy ve kesit sadece numuneyi hazırlar, sonuç nitel karşılaştırmadır. R∝ρL/A sembolik ilişki ölçüm sonrasında tartışılır.

Homojen düzgün iletkenin iç modeli R=ρL/A; L metreye, A m²'ye çevrilir. Örnek özdirençler OpenStax College Physics §20.3 tablo20.1: bakır1.72e−8, demir9.71e−8, nikrom1e−6 Ωm. https://openstax.org/books/college-physics/pages/20-3-resistance-and-resistivity . Bunlar sabit koşullarda örneklerdir; saflık/alaşım değişimini çözmez. Sıcaklık değişkeni öğrenci akışına eklenmez.

Boy20–100cm, kesit.1–1mm². İdeal karşılaştırıcı iç modelde10mA sabit akım kullanır, uç gerilimi I·R'dir; cihaz/temas/kablo direnci ihmal edilir. En yüksek örnekR10Ω, güç1mW; numune koşulları sabit varsayılır. İç sayısalR/gerilim öğrenciye hesap sorusu veya sayısal sonuç olarak sunulmaz. Grafik her kayıt için gerçekR modelinden bağıl çubuklar üretir, nitel eksenlidir. Yan yana karşılaştırılan değerlerin ortak ölçeği vardır; değişkenler karışınca tek neden onayı verilmez.

Tel boyu/kesit/malzeme seçimi her seferinde yeni kesilmiş numune hazırlar. Aynı teli gerip hacmini sabit tutma iddiası yok. Yeni numunede iki prob yeniden bağlanmalıdır; otomatik hazır ölçüm oluşmaz. Problar ters takılabilir; pasif telin direnci aynı kalır. Aynı uca iki prob bağlamak tel direnci kaydı olarak kabul edilmez. Kesit tutamağında çizilen yarıçapın karesiyle alan değişir; yarıçap/çap/alan birbirinin yerine kullanılmaz. Çizim yatay/düşey yönde farklı büyütülür, ekrandan gerçek çap ölçülmez.

Öğrenci tahmini önceden kilitler, numuneyi ve ölçüm uçlarını doğrudan değiştirir, kayıt/bağıl grafik/tek değişken karşılaştırması/açıklama/YKS sorusuyla öğrenir. Elektron hızı tel kalınlığına göre keyfi artırılmaz; bu paket mikroskobik sürüklenme animasyonu iddia etmez. Kablo güvenliği yalnız dirence indirgenmez. Serbest açıklama otomatik bilimsel onay almaz.

Sekiz model testi: SI birimleri, boy/kesit ilişkisi, malzeme sıralaması, yarıçap-alan, karışan değişkenler, yeniden bağlama/kayıt anlık görüntüsü, geçersiz numune, prob yönü/aynıuç. Browser senaryosu gerçek prob/boy/kesit sürükleme, yeniden bağlama kapısı, hipotez/defter/yanlış kontrol koşulu ve yönleri denetlemek için hazırlanır.

GitHub resmi kullanım bildirimi: aylık2000 Actions dakikası bitmiş,1 Aralık2026'da yenilenme. Bu nedenle browser/CI kabulü yok; draft PR'da kalır, maine alınmaz. Yerel model testleri bu eksik kabulün yerine geçmez. Gerçek iPad ve canlı ayrıca bekler. #30 devre tahtasına bağımlı değildir; güncel main7275877a610111a4cdb298f80542bdf67a71c671 üzerinden bağımsız paket.
