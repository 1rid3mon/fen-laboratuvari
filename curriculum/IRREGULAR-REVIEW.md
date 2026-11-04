# Düzensiz cismin hacmi — bilimsel denetim

MEB 2018 Fizik 9.2.1.1 (b): düzgün olmayan cismin su yer değiştirmesiyle hacmi. 9.2.1.1'in tamamı kabul edilmez. Geometrik şekiller PR #17 ile main'e alındı; bu paket güncel main'deki PR #16'nın özkütle atölyesini genişletir.

## Fizik modeli

- Cisim standart küp/prizma/küre/silindir formülleriyle hacmi okunamayan düzensiz bir siluettir; 3B modeli 4 cm sabit derinlikli bir profildir. Her gerçek taşın bütün 3B ayrıntılarını temsil ettiği iddia edilmez.
- Yatay ölçek 40 çizim birimi/cm, düşey ölçek 10 çizim birimi/cm. Ortak 4 cm derinlikle 1 çizim alanı birimi 0,01 cm³ olur. Kap genişliği 200 → 5 cm; tabanı 5×4=20 cm². Prizma genişliği 100 → 2,5 cm ve kesiti 10 cm². Düzensiz siluet genişliği 140 → 3,5 cm, kesiti yüksekliğe göre değişir.
- Profilin normalize alanı 0,6892'dir. Boyu seçilen hacme göre ölçeklenir; tam profilin alanı × 0,01 gerçek seçilen cm³ değerine eşittir. Kutu alanı kullanılamaz.
- Su altında kalan profil, su yüzeyinin altında kırpılır; batmış alan × 4 cm derinlik hacmi verir. Sıvı seviyesi `kap okuması = başlangıç suyu + batmış cisim hacmi` eşitliğiyle çözülür. Çizilen yeşil batmış bölge ve sayısal hacim aynı kırpılmış çokgenden gelir.
- Geometrik alan kırpma hesabı iç modeldir; öğrenciye TYT dışında integral/yüzey integrali öğretilmez. Öğrenci yalnız ilk–son kap okumalarının farkından hacim ölçer.
- Tam batırmada 1 mL artış 1 cm³ cismin hacmidir. Kısmi batırma tam hacim sayılmaz. Yetersiz su, kabın dışı, duvarla çakışma ve destek yüksekliği kontrol edilir. Cisim suyu emmez, suda çözünmez ve elle tutulur; serbest yüzme/batma dinamiği yoktur.

## Test kanıtı

- Önceki 9 test korunur. 5 yeni test: profil alanı–hacim tutarlılığı; bağımsız dikdörtgen/üçgen kırpma örnekleri; bütün izinli derinliklerde sıvı korunumu; gerçek profil ile sınır kutusu ayrımı; tam/yarım yerleştirme ve destek yüksekliği.
- Tüm mevcut model/regresyon testleri yerelde 424/424 geçti (bu dal PR #17'yi henüz içermez).
- Chromium/WebKit senaryosuna düzensiz cismin doğrudan sürüklenerek tartılması, yarım batırmanın reddi, yeşil kesit, tam batmış hacim ve defter kaydı eklendi. Son HEAD CI sonucu beklenir.
- Gerçek iPad Safari yapılmadı. Yerel tarayıcı OS socket engeli sürüyor. Vercel günlük dağıtım sınırı sürerken elle tekrar dağıtım yapılmaz; canlı kabul bekler.

## Diğer paketlerin durumu

- PR #15 envanter main: bcea32904f35001e17575d3770557e690d37dd8e.
- PR #16 özkütle main: dddf8141db9dd9a82f5329e82a6bf48a6f202058; 419 model/regresyon, Chromium ve WebKit başarılı.
- PR #17 geometri: açık; HEAD ve CI sonuçlarını yeniden oku. İlk WebKit kurulumu Ubuntu latest üzerinde uzadığı için browser runner Ubuntu 24.04'e sabitlendi ve 15 dakika sınırı kondu. Testler atlanmadı veya gevşetilmedi. Başarılı olmadan main'e birleştirme.

Güncelleme: PR #17 son HEAD 2e26e5c0e86a80758a3198b1ea67e6e65b4e1cb2 tüm CI başarılı, merge 155aa6d8f169971f34006da96112794a54af0df9. Bu paketin son HEAD'i artık geometri main'i ile birleşik doğrulanıyor; beklenen model/regresyon toplamı 429.
