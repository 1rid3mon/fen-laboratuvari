# Fen Laboratuvarı — zorunlu kabul koşulları

Hedef: 2027 YKS için TYT/AYT Fizik, Kimya ve Biyolojinin altı alanının tamamı. Bir paket veya ders bitince sıradaki eksik kazanıma geç. Bütün alanlar doğrulanmadan projeyi tamamlandı diye raporlama. Kullanıcının kapsam ve doğruluk talimatları bu dosyanın temelidir.

## Bilim ve kapsam

- `curriculum/SOURCES.md`, `curriculum/outcomes.json` ve altı kapsam tablosunu incele. 2018 MEB kazanımları, alt açıklamaları ve kapsam dışı sınırlamalarını kaynakla doğrula; 2027 ÖSYM belgelerini güncel resmî kaynaklardan ayrıca kontrol et. 2028 Maarif Modeli çıktıları ekleme.
- Her alt kavram için modelin varsayımları, formüllerin sınırları, sayılar/grafikler/hareketin tutarlılığı, muhtemel yanlış çıkarımlar, günlük yaşam ve YKS kavrayışı kontrol edilir. Yanlış modeli bir uyarıyla örtme; düzelt.
- Mevcut deney sayfası, yeşil CI veya güzel görsel tek başına bilimsel kabul değildir. Kazanımın bir bölümünü yapmak kazanımın tümünü bitirmez.

## Etkileşim ve öğrenme

- Optik laboratuvarlarını etkileşim açısından incele; hatalarını kopyalama. Öğrenci değişkenleri ve düzeneği kontrol ederek sonucu üretmelidir.
- Konuya uygun doğrudan dokunma/sürükleme/döndürme, parça ekleme/çıkarma, bağımsız değişkenler, ölçüm araçları, veri kayıtları, anlık grafikler, fiziksel süreçler ve bilimsel geri bildirim tasarla. Anlamsız özellikleri mekanik biçimde her deneye ekleme.
- Keşfet → Değiştir → Tahmin et → Deney yap → Ölç → Karşılaştır → Açıkla → özgün YKS sorusu döngüsünü destekle. Sadece metin değişimi veya otomatik animasyon tamamlanmış deney sayılmaz.
- Her konuya kendi doğasına uygun tasarım yap. Serbest öğrenci açıklamasını gerçekten değerlendirmeyen bir araç otomatik bilimsel onay vermesin.

## Paketler ve doğrulama

1. Güncel `main` ve açık PR'ları oku; konu/alt kazanım için yeni dal aç.
2. Küçük bağımsız paketi geliştir ve bilimsel incelemesini kaydet.
3. Anlamlı birim/entegrasyon, gerçek tarayıcı etkileşimi ve mevcut deneylerin regresyonlarını çalıştır.
4. iPad Safari öncelikli: dokunma, sürükleme, kaydırma, çoklu dokunma, yön değiştirme, akıcılık ve okunabilirlik. Chromium veya masaüstü WebKit gerçek iPad değildir. Gerçek cihaz yoksa açıkça yaz; “iPad doğrulandı” deme.
5. PR aç. Son HEAD için gerekli testler yeşil, bilimsel doğruluk belgeli ve çakışma yoksa kullanıcıdan her seferinde onay istemeden main'e birleştir. Başarısız/belirsiz paket ayrı PR'da kalır; nedenini kaydet.
6. Vercel günlük limitini gözet; her PR için elle üretim dağıtımı tetikleme. Dağıtım ve canlı test ayrı kanıtlardır.
7. Her paketten sonra PR, HEAD ve merge SHA, alt kazanımlar, etkileşimler, test sonuçları ve sınırlamalarla `curriculum/HANDOFF.md` ve kapsam kaydını güncelle. Sonraki pakete güncel main'den başla.

Durumlar: Eksik; Geliştiriliyor; Etkileşimli fakat doğruluk denetimi bekliyor; Test edildi; maine birleştirildi; Canlıda doğrulandı. `Eksik` bu katı kabule göre kanıtın eksik olduğunu da kapsar. Kod varlığını ayrı aday alanında göster. Üst kazanımı alt maddeleri bitmeden yükseltme.

## Kesinti

Araç, süre veya kullanım limiti devamı engellerse iş bitti deme. Açık PR'lar, son commit, testlerin gerçekten gözlenen sonuçları, tamamlanan/kalan alt kavramlar, sıradaki somut iş ve yeniden çalıştırılacak komutları GitHub'da kalıcı `curriculum/HANDOFF.md` kaydına yaz. Arka planda devam edilmediği halde devam ediliyor izlenimi verme. Altı alanın bütün kazanımlarını son kez yeniden taramadan nihai tamamlanma raporu verme.
