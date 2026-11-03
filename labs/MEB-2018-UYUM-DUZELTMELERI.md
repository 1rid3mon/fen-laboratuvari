# 2018 MEB AYT Fizik — Uyum düzeltmeleri (toplu yayın taslağı)

Kaynak: https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf

- **11.2.3.4–6 Sığa:** UI'daki sayısal sığa, enerji, yük ve eşdeğer sığa sonuçları kaldırıldı. C ∝ εᵣ A/d yalnız matematiksel ilişki olarak kalır. Günlük kullanım örnekleri eklendi. Eski matematik yardımcı fonksiyonları geriye dönük testler için depoda durur, kullanıcı arayüzünde gösterilmez.
- **11.2.4.3 Tele manyetik kuvvet:** F=BILsinθ modeli ve sağ el kuralı; sayısal kuvvet hesabı kullanıcıya sunulmaz.
- **11.2.4.5 Hareketli yük:** Yörünge yönü ve türü nitel gösterilir; yarıçap/kuvvet hesapları kaldırıldı.
- **11.2.6 Transformatör:** Sarım oranı üzerinden sayısal gerilim hesabı kullanıcı arayüzünden kaldırıldı. İdeal ve gerçek çalışma prensibi açıklanır.
- **11.2.2 Elektriksel potansiyel:** Noktasal yük için eş potansiyel çizgiler (3B yüzeyin 2B kesiti) ve günlük yaşam örnekleri eklendi.
- **11.2.4.4/9/11 Manyetizma:** Tel çerçevede döndürme etkisi, öz-indüksiyon ve motor–dinamo karşılaştırması eklendi. Bunlar nitel açıklayıcı şemalardır; 3B kuvvet çizimi/animasyonu henüz yapılmadı.
- **11.2.5 AC:** AC/DC, direnç, bobin, kondansatör, rezonans ve empedans için beş kavramsal deney eklendi. AC devre sayısal hesabı, vektörel gösterim ve akım/gerilim zaman grafiği yoktur.

## Kabul sınırları
Mevcut etkileşimler sürgüler ve SVG kavramsal gösterimlerle sınırlıdır; tam 3B alan/kuvvet animasyonu değildir. MEB'in nitel deney gerektiren bölümlerinde fiziksel ilişki ve eğilim sunulur. Gerçek iPad/Safari testi yapılmadı. `main` ve Vercel üretimine yayın yapılmaz; yalnız kullanıcının açık toplu yayın izniyle yapılır.

## Doğrulama
`node --test labs/meb-uyum.test.cjs` ve tüm AYT fizik regresyon testleri GitHub Actions'da koşar. Otomatik testler tüm MEB kazanımlarının pedagojik tamlığını tek başına garanti etmez.
