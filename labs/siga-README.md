# AYT Fizik — Sığa ve Kondansatörler

**2018 MEB (Maarif Modeli değil).** Toplu yayın PR #8 taslağında, üretimde değildir.

Altı etkileşimli gözlem: paralel levhalar (C=εA/d), pil bağlı (V sabit), pil ayrılmış (Q sabit), seri bağlama, paralel bağlama ve aynı kondansatörlerin iki bağlama türünde karşılaştırılması.

Önemli fizik ayrımı: pil bağlıysa sığa arttığında pil yük sağlayabilir; pil ayrılmışsa Q sabitken sığa artınca V ve depolanan enerji azalır. Bu enerji değişimi mekanik iş/elektrostatik kuvvetle ilişkilidir; bu modül mekanik iş hesabını çözmez.

SI dönüşümleri: arayüzde µF, µC, µJ, cm², mm, V; modelde ε₀=8.8541878128×10⁻¹² F/m. Paralel levhalarda kenar/saçak etkileri ihmal edilir; yalıtkan lineer, εᵣ≥1; yük kaçağı yoktur. Seri/paralel iki ideal, başlangıçta yüksüz kondansatör ile ideal pil kabul edilir. 3+ kondansatörlü karmaşık ağlar, RC devresi, dielektrik delinmesi ve gerçek devre güvenliği dahil değildir. Görseller öğretim şemasıdır, ölçekli değildir. Soru bankası zorunlu değil.

Testler: `node --check labs/siga-math.js && node --check labs/siga-lab.js && node --test labs/siga.test.cjs`. Enerji/yük tutarlılığı, 300 deterministik örnek ve 6 DOM sekmesi kontrol edilir. Gerçek iPad Safari testi henüz yapılmamıştır.

Kaynak: [2018 MEB Fizik Öğretim Programı](https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf).
