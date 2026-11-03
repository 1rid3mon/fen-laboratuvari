# AYT Fizik · Elektriksel Kuvvet ve Elektrik Alan

**Durum:** Toplu yayın için taslak PR #8'de bekletilir. `main` ve Vercel üretimine aktarılmaz.

## Etkileşimli gözlemler

1. **Tek noktasal yük:** İşaret, konum ve ölçüm noktası değişince elektrik alan yönü/büyüklüğü.
2. **İki yükün bileşke alanı:** E₁ + E₂ vektörel toplama, x/y bileşenleri, sıfır alan.
3. **Coulomb kuvveti:** Kaynak ve deneme yükünün işareti; itme/çekme, F = qE.
4. **Potansiyel:** V = Σkq/r skaler toplama, V=0 iken E≠0 örneği.
5. **Düzgün alan:** Kuvvet, potansiyel farkı, alanın yaptığı iş ve potansiyel enerji.
6. **Alan–kuvvet ayrımı:** Deneme yükü değişse bile kaynak yükün oluşturduğu E değişmez.

Her deneyde anlık vektör görselleştirme, sayı ve açıklama bulunur. Soru bankası bilerek eklenmedi.

## Fizik ve kapsam

- Hesaplarda SI: yükler arayüzde **nC**, mesafeler **cm**; hesap öncesinde C ve m'ye dönüştürülür.
- Coulomb sabiti k=8,99×10⁹ N·m²/C². Noktasal durağan yükler, hava/vakum yaklaşımı.
- Yükle aynı noktada elektrik alan ve potansiyel **tanımsız** gösterilir, sonsuz/NaN ekrana basılmaz.
- Elektrik alan pozitif deneme yükünün kuvvet yönündedir; negatif deneme yükü ters yönde kuvvet görür.
- Şemadaki alan okları **yön örnekleridir, integral alan çizgileri değildir**. Ok uzunlukları ölçekli değildir; gerçek büyüklük ölçümlerde verilir.
- Potansiyel skaler, alan vektörel toplanır. Potansiyelin sıfırı sonsuz kabul edilir.
- Düzgün alanda ΔV = −E·Δr, W_alan = −qΔV, ΔU=qΔV. Deneme yükü kaynak alanını bozmaz.
- Hareket, hızlanma, devreler, kondansatör, manyetizma ve indüksiyon **bu modülde yoktur**; diğer modüllere ayrılır.
- **2018 MEB fizik müfredatı esas alınır, Maarif Modeli dahil edilmez.** Kazanım numaraları ayrı resmî program kontrolü yapılmadan sayfada belirtilmez.

## Doğrulama

```bash
node --check labs/elektrik-alan-math.js
node --check labs/elektrik-alan-lab.js
node --test labs/elektrik-alan.test.cjs
```

Testler ters-kare yasası, kuvvetin işareti, alan süperpozisyonu, V=0 ama E≠0, düzgün alanda iş/enerji ve 400 deterministik örnek ile altı sekmenin DOM oluşturmasını içerir. Gerçek iPad/Safari kabul testi henüz yapılmadı.

Kaynak: [2018 MEB Fizik Öğretim Programı](https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf).
