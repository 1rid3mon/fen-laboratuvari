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

Envanter PR #15, bütün HEAD kontrolleri başarılı ve clean durumda doğrulanıp main'e birleştirildi. HEAD: fa7799b70b86806053b45a2f6fba65d8cdacbd43; merge: bcea32904f35001e17575d3770557e690d37dd8e. Özkütle PR #16 bütün kod kontrolleri ve Chromium/WebKit testleri başarılı, çakışmasız durumda main'e alındı. HEAD f9d263be1b9ac8e295db49150e98663d6f8c28c2; merge dddf8141db9dd9a82f5329e82a6bf48a6f202058. 419/419 test geçti. CI: https://github.com/1rid3mon/fen-laboratuvari/actions/runs/41917472473. Vercel otomatik dağıtımı api-deployments-free-per-day (>100) sınırında; bu bir kod testi hatası değildir. Canlı/gerçek iPad doğrulanmadı. 9.2.1.1(c)/(ç) bu pakette main'e alındı, bütün kazanım değil.

Güncel paket: feature/volume-shapes-20261105, güncel main dddf814 üzerinden. Küp/prizma/silindir/küre boyut uçlarını sürükleme; tek boyut ile benzer büyütme farkı; hipotez, ölçüm defteri, oran/grafik, hacim birimleri, açıklama ve özgün soru. 424 yerel test geçti; PR ve tarayıcı kontrolleri henüz bekliyor. Bilimsel kayıt VOLUME-REVIEW.md.

## Devam sırası

1. Hacim paketini ayrı PR'da Chromium/WebKit ve regresyon CI ile doğrula; başarılıysa main'e birleştir. Yeni HEAD/merge SHA'yı kaydet.
2. Özkütle PR #16 tamam; gerekirse regresyon için: `node --test labs/ozkutle-olcum.test.cjs` ve bütün 407 eski testi çalıştır; Chromium ve WebKit için gerçek tarayıcı senaryolarını CI'da çalıştır. Dokunma/çoklu pointer/iptal/yön değişimi/taşma/yanlış ölçüm/CSV kontrol et. Modelin bağımsız fizik denetimini kaydet.
3. Aynı kazanımın kalan b alt başlıklarını (küp, silindir, küre, düzensiz cisim), a/d/e/f ve günlük yaşam 9.2.1.2 kapsamını tek tek karşılaştır. Var olan tamamlayıcı sayfayı otomatik kabul etme.
4. Sonra `tyt-physics.md` sırasıyla alt kazanım denetimi; ardından AYT Fizik, TYT Kimya, AYT Kimya, TYT Biyoloji, AYT Biyoloji. Önceden bitmiş varsayma. 431 satırın tümünü ve alt kavramlarını ayrı kanıtlarla kapat.

Her pakette bu kaydı PR numarası, commit ve testlerin gözlenen sonuçlarıyla güncelle. Vercel'e elle ayrı üretim dağıtımı tetikleme. Canlı ve gerçek cihaz kabulünü ayrıca bekleyen olarak tut.
