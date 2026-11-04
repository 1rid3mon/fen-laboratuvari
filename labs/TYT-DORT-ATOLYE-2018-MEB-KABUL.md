# TYT dört dokunmatik atölye — 2018 MEB kalite ve kabul kaydı

**Durum:** Geliştirme ön izlemesi / taslak PR #10; `main` ve canlı üretim sayfası değiştirilmemeli. Kullanıcı geri bildirimi: Optikteki mercek ve aynalar gibi fiziksel olarak elle müdahale edilebilen, anlık doğru sonuç veren deneyler. Sayı değişen pasif çizimler kabul edilmez. Maarif Modeli YKS 2027 çalışmasına eklenmeyecek.

## Bu geliştirme aşamasında gerçekten eklenenler

| Konu | Dokunmatik deney | Fiziksel model/çıktı | Sınır |
|---|---|---|---|
| Dalgalar | Yay kaynağını sürükle, sabit/serbest uç, yeniden atma gönder | Gelen+yansıyan Gaussian atmalar; sabit uçta sıfır yer değiştirme | İdeal doğrusal yay; sönüm/karmaşık mekanik yok |
| Dalgalar | Karşılaşan iki atmayı ayrı genlikle gönder | İşaretli süperpozisyon; anlık pekişme/sönüm | Sonlu sınırlar/düzenek gerilimi modellenmez |
| Dalgalar | Su dalgası kaynağı ve derinlik sınırını sürükle | Sığ su yaklaşımında derinlik/hız/kırılma; gerektiğinde yansıma koşulu | Tam dispersiyon, gerçek yüzey akışı ve sabit engel yansıma havuzu henüz yok |
| Dalgalar | Ses ortamı, kaynak genliği ve frekans | Boyuna tanecik titreşimi; boşlukta sesin yayılmaması | Nicel ses seviyesi/dB değil |
| Madde ve Özellikleri | Üç cismin her birini dereceli silindire bırak | Su seviyesini kısmi/tam batmış hacimle çözen denklem, kütle/hacimden özkütle | Cisimler elle tutuluyor; otomatik yüzme/batma ve çarpışma yok |
| Madde ve Özellikleri | Kılcal boruların çapını elle ayarla | Islatan/ıslatmayan sıvının yükselme/alçalma eğilimi | Göreli model; gerçek temas açısı/sıvı sabitleri sayısal girilmez |
| Fizik Bilimine Giriş | A, B ve bileşke ok uçlarını sürükle | Tek boyutta işaretli toplama ve skaler büyüklük ayrımı | İki boyutlu vektör işlemi TYT 9.1 kazanımı olarak sunulmaz |
| Fizik Bilimine Giriş | Cetvelin başlangıç/bitiş işaretlerini sürükle | Pozitif uzunluk, cm↔m↔mm dönüşümleri | Alet duyarlılığı ve ölçüm belirsizliği sonraki aşama |
| Isı–Sıcaklık | Sıcak ve soğuk blokları temas ettir | İdeal ısı akışı; sıcaklığa göre renk ve yön değiştiren ok; enerji korunumu | Dış ortamdan yalıtılmış ve sabit öz ısı varsayımı, hâl değişimi yok |
| Isı–Sıcaklık | Malzeme ve sıcaklıkla metal çubuğu genişlet | Termal genleşme eğilimi; çarpan açıkça belirtilen abartılmış görsel | TYT'de sayısal genleşme sorusu sunulmaz |

## Test kapsamı

- `tyt-dort-atolye-model.test.cjs`: ideal dalga sabit/serbest uç, süperpozisyon, kırılma, vektör, cetvel, hacim, özkütle, kılcallık ve enerjinin korunumu.
- `tyt-dort-atolye-ui.test.cjs`: konu açılışları, dalga kaynakları, su sınırı, cismin silindire bırakılması, blok sıcaklığı ve ısı akışı yönü, vektör/cetvel kontrolleri.
- GitHub Actions `All Labs Visual Interaction Audit` adımında her iki dosya zorunlu. Son başarı: https://github.com/1rid3mon/fen-laboratuvari/actions/runs/41823877071.
- Fiziksel model birim testinin geçmesi, Safari/iPad/Pencil dokunma performansı veya 2018 MEB'in tüm kazanımlarının tek tek onaylandığı anlamına **gelmez**.

## Henüz kabul edilmeyenler

1. Gerçek iPad yatay/dikey Safari, Apple Pencil, çoklu parmak ve mobil okunabilirlik testi yapılmadı.
2. Madde ve Özellikleri ana sayfasındaki diğer eski sekmeler (dayanıklılık, adezyon/kohezyon, yüzey gerilimi vb.) ayrı ayrı görsel kalite ve kazanım incelemesinden geçmedi.
3. Fizik Bilimine Giriş'te fiziğin alt dalları/araştırma merkezleri ve diğer kazanımlar için deneysel içerik tamamlanmadı.
4. Isı–Sıcaklık ana sayfasındaki önceki 15 deneyin her birinde sistematik görsel/fiziksel doğrulama yapılmadı.
5. Dalgalar için taşınabilir sert engel yansıması, su havuzu tasarımı ve tüm dalga türlerinin tam kazanım eşleştirmesi hâlâ açık.
6. Yeni ortak ön izlemenin tüm asıl modüllerin yerini alması ya da `main`e alınması için kullanıcı kabulü ve canlı Vercel doğrulaması bekliyor.

**Kural:** Başarılı CI'ı fiziksel kusursuzluk diye pazarlama. Kapsam dışı/ideal varsayımları her deney sahnesinde görünür bırak.