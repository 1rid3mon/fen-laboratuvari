# AYT Fizik: İş–Güç–Enerji & İtme–Çizgisel Momentum

## Yayımlama / Vercel

**Toplu yayına kadar main'e birleştirme!** Bu değişiklikler `feature/ayt-2018-work-energy-impulse-momentum-batch` dalındadır. Dal kökündeki geçici `vercel.json` dosyası, `git.deploymentEnabled` üzerinden bu dala ait otomatik Vercel deployment'larını engellemek için eklenmiştir. Toplu yayın zamanı bu geçici dosya **PR'dan kaldırılıp** kalan değişiklikler test edildikten sonra `main` dalına alınmalıdır. Preview Vercel yayınlanmadığı için iPad Safari üzerinde son kabul testi yapılmadı.

## Resmî 2018 MEB fizik programı

https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf

**Eski 2018 programı (YKS mezun öğrencisi), Türkiye Yüzyılı Maarif Modeli eklenmemiştir.** ÖSYM'nin ilgili sınav yılı için ilan edeceği kapsamda değişiklik olursa esas alınacak kaynak o duyurudur.

| Kazanım | Karşılık |
|---|---|
| **11.1.6.1** İş–enerji ilişkisi, F–x alanı, Hooke Yasası, kinetik / yer çekimi / yay enerjileri | F–x, açılı kuvvet/güç, Hooke, üç enerji grafiği, yay-enerji, yükseklik |
| **11.1.6.2** Mekanik enerjinin korunumu; düşme, atış, yay; Canan Dağdeviren | Yükseklik dönüşümü, eğik atışta enerji, yay/blok değişimi; kısa bilim insanı notu |
| **11.1.6.3** Sürtünmeli yüzeylerde enerji korunumu ve dönüşümü | Yatay sürtünme, gerçek durma mesafesi, Eₖ → termal enerji |
| **11.1.7.1** Momentum ve itme kavramları | Vektörel momentum, imzalı hız ve itme |
| **11.1.7.2** F–t alanı, J=Δp, hesaplama | Doğrusal değişen kuvvet–zaman grafiği, işaretli alan ve anlık hız |
| **11.1.7.3** 1/2 boyutta momentum korunumu | 1B çarpışma/patlama; 2B vektörel çarpışma/patlama |
| **11.1.7.4** 1/2 boyutta esnek/esnek olmayan çarpışmalar, patlamalar ve hesaplama | Kütle/hız/esneklik sürgüleri, pₓ ve pᵧ korunumu, Eₖ farkı |

Güç, iş ve süre ilişkisinde **ortalama güç** düzeyinde tutuldu; yüksek seviye dinamik veya grafik türevleri eklenmedi.

### İş–Güç–Enerji: 8 deney + 18 özgün soru

1. **F–x grafiği**: pozitif ve negatif işaretli alanlar. Doğrusal değişen kuvvet için tam trapez hesabı.
2. **Açılı kuvvet, net iş ve ortalama güç**: Fcosθ bileşeni, başlangıç/son kinetik enerji, **süre sabit ivmeli hareketten türetilir**, bağımsız seçilmez. Net iş enerjiyi sıfırın altına indirecekse belirtilen yol **ulaşılamaz** diye gösterilir; hayalî hız hesaplanmaz.
3. **Hooke**: F=−kx; esneklik potansiyeli ½kx²; dış ve yay işaretleri ayrılır.
4. **Yer çekimi**: 40 m'den düşme, Eₖ + Eₚ sabit ve yükseklik sürgüsü; Canan Dağdeviren'in piezoelektrik mekanik→elektrik enerji dönüşümü çalışmaları için kısa not.
5. **Eğik atışta enerji**: x/y ve aynı matematiksel modelden Eₖ/Eₚ; zemin temasında hareket durur.
6. **Enerji grafikleri**: Eₖ–v², Eₚ–h ve E_yay–x² doğruları; eğimleri m/2, mg, k/2.
7. **Sürtünme**: μₖmg, kinetik→termal dönüşüm; durduktan sonra ısı miktarı artmaz; μₖ=0 durma mesafesi ∞.
8. **Yay + blok**: sürtünmesiz sistemde E_yay ↔ Eₖ; seçilen konum anlıktır, zaman veya yön simüle edilmez.

**Fizik varsayımları:** kütle sabit, enerji hesapları ideal koşullara göre. Yer çekimi sabit g. Sürtünme deneyinde yalnız yatay kinetik sürtünme vardır. Yay esneklik sınırları içinde idealdir. Atışta hava direnci yoktur. Güç deneyinde hareket +x yönünde ve uygulanan kuvvet tek net iş yapan kuvvettir.

### İtme–Çizgisel Momentum: 6 deney + 20 özgün soru

1. Momentum vektörü ve kinetik enerji (işaret ayrımı).
2. F–t alanı, doğrusal kuvvet, imzalı itme; p(t)=p₀+J(t); uygulama süresi bitince itme sabit.
3. 1B çarpışma: e=1 esnek, e=0 ortak son hız, aradaki değerlerde enerji kaybı. Yaklaşmayan hızlarda hayalî çarpışma yok.
4. 1B patlama: iki parça zıt iç itmeler alır; toplam p sabit, artan Eₖ iç enerjiden.
5. **2B çarpışma**: temas normalinde sürtünmesiz dürtü aktarılır; px,py ayrı ayrı korunur. e=0, 2B'de yapışma demek değildir (teğetsel hız kalabilir).
6. **2B patlama**: iki parçanın x/y momentum toplamı korunur; iç enerji kinetiğe dönüşebilir.

**Fizik varsayımları:** çarpışma/patlama boyunca dış itme yok; noktasal sürtünmesiz temas ve dönmesiz cisimler; bir ve iki boyutta ideal modeller; sürtünme/kayıp kinetik enerji mekanik olmayan enerjiye dönüştürülür. Esneklik katsayısı (e) 0–1, başlangıçta temas normalinde yaklaşma zorunlu. Gösterimler ölçekte olmayan şemalardır, gerçek çarpma anı animasyonu değildir.

### Kullanım

- `/labs/is-guc-enerji.html`
- `/labs/itme-cizgisel-momentum.html`
- `index.html` üzerindeki yeni AYT Fizik kartları bu iki sayfaya gider.
- Kontroller mobilde yeniden yaratılmaz; sürgü kaydırma kesilmez. Animasyon yalnız `Oynat` tıklanınca çalışır, sayfa gizlendiğinde durur.

### Doğrulama

```bash
node --check labs/fizik-enerji-math.js
node --check labs/momentum-math.js
node --check labs/mekanik-ui.js
node --check labs/fizik-enerji-lab.js
node --check labs/momentum-lab.js
node --test labs/fizik-enerji.test.cjs labs/momentum.test.cjs labs/mekanik-dom.test.cjs
```

Ayrıca ilgili GitHub Actions iş akışı önceki fizik modülleriyle beraber regresyon testlerini çalıştırır.

### Kaynaklar

- [MEB Fizik Dersi Öğretim Programı, 2018, s. 30–31](https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf)
- [MEB OGM kazanım listesi](https://ogmmateryal.eba.gov.tr/v1/soru-bankasi-kazanim/fizik?d=34&k=0&s=8&u=0)
- [Canan Dağdeviren, piezoelektrik enerji toplama araştırması](https://pubmed.ncbi.nlm.nih.gov/24449853/)

**Sınırlama:** Otomatik matematik/DOM testleri gerçek iPad Safari testinin yerini tutmaz. Şu aşamada production'a dağıtım yapılmadı.
