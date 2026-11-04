# Devam kaydı · 5 Kasım 2026

Proje tamamlanmadı. Hedef altı alan ve bütün ilgili kazanımlardır.

## Doğrulanan başlangıç

- Depo: 1rid3mon/fen-laboratuvari; başlangıç main SHA: `44513cc12beca7a4418a5d386272bdf92d3ac795`.
- Başlangıçta açık PR yoktu. 200 mevcut dosya incelenebilir yerel kopyaya alındı.
- `node --test labs/*.test.cjs tests/*.test.js`: **407/407 geçti**, 5 Kasım 2026. Bu sonuç mevcut deneylerin bilimsel/etkileşim kabulü değildir.
- Resmî MEB 2018 kaynaklarından 431 ayrı kazanım ve 872 alt açıklama satırı başlangıç envanterine alındı. Fizik 213, Kimya 127, Biyoloji 91. Her sınıfın toplamı kontrol edildi.
- 2027 kapsamı için MEB geçiş açıklamaları incelendi. ÖSYM 2027 ayrıntılı kapsam kılavuzu doğrulanmadı; takvim duyurusu kapsam kanıtı sayılmadı.
- Gerçek iPad testi yapılmadı. Yerel Chromium işletim sistemi tarafından `socket() failed: Operation not permitted` ile başlayamadı. Bu durum başarılı tarayıcı testi diye raporlanamaz; GitHub CI üzerinde gerçek tarayıcı testi çalıştırılmalı.

## İlk geliştirme paketi

Özkütle ölçüm atölyesi: 9.2.1.1 b/c/ç'nin bir bölümü. Tam kazanım statüsü yükseltilmeyecek. Yeni numuneyi sürükleme, boyut seçimi, tartım, kısmi/tam batırma, su korunumu, hipotez, ölçüm defteri, kütle–hacim ve özkütle grafikleri, kontrollü karşılaştırma, açıklama öz değerlendirmesi, gerekçeli özgün soru ve CSV.

Envanter PR #15, bütün HEAD kontrolleri başarılı ve clean durumda doğrulanıp main'e birleştirildi. HEAD: fa7799b70b86806053b45a2f6fba65d8cdacbd43; merge: bcea32904f35001e17575d3770557e690d37dd8e. Özkütle paketi feature/density-learning-cycle-20261105 dalında ayrı PR olarak doğrulanıyor. Yerel 419/419 test geçti. Chromium/WebKit CI sonucu alınmadan birleştirme yapılmayacak.

## Devam sırası

1. Envanter PR'sinin son HEAD kontrollerini doğrula; başarı halinde main'e birleştir.
2. Güncel main'den özkütle paketini aç. `node --test labs/ozkutle-olcum.test.cjs` ve bütün 407 eski testi çalıştır; Chromium ve WebKit için gerçek tarayıcı senaryolarını CI'da çalıştır. Dokunma/çoklu pointer/iptal/yön değişimi/taşma/yanlış ölçüm/CSV kontrol et. Modelin bağımsız fizik denetimini kaydet.
3. Aynı kazanımın kalan b alt başlıklarını (küp, silindir, küre, düzensiz cisim), a/d/e/f ve günlük yaşam 9.2.1.2 kapsamını tek tek karşılaştır. Var olan tamamlayıcı sayfayı otomatik kabul etme.
4. Sonra `tyt-physics.md` sırasıyla alt kazanım denetimi; ardından AYT Fizik, TYT Kimya, AYT Kimya, TYT Biyoloji, AYT Biyoloji. Önceden bitmiş varsayma. 431 satırın tümünü ve alt kavramlarını ayrı kanıtlarla kapat.

Her pakette bu kaydı PR numarası, commit ve testlerin gözlenen sonuçlarıyla güncelle. Vercel'e elle ayrı üretim dağıtımı tetikleme. Canlı ve gerçek cihaz kabulünü ayrıca bekleyen olarak tut.
