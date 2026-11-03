# AYT Fizik · Basit Makineler (2018 MEB)

**Toplu yayına kadar taslak:** PR #8 içindedir. `main` dalına alınmaz ve Vercel'e yayınlanmaz. Geçici `vercel.json` feature branch deployment engeli korunur.

## Kazanım eşleştirmesi

- **11.1.10.1:** Günlük hayatta kullanılan basit makinelerin işlevlerini açıklar. **Yalnız** kaldıraç, sabit/hareketli makara ve palanga, eğik düzlem, vida, çıkrık, çark, kasnak. Sekiz bağımsız sekme.
- **11.1.10.2:** Basit makineler ile hesaplamalar. Her deneyde ideal kuvvet/yol oranı, gerçek verim ve işin korunumu. **Üç veya daha fazla makine içeren sistem hesabı yok.**
- **11.1.10.3:** Güvenli sistem tasarımı. Sadece **iki makine** (kaldıraç + hareketli makara) birleştirilir; toplam verim, gereken kuvvet, kuvvet/yük yolları hesaplanır. Gerçek kullanım için yük taşıma kapasitesi doğrulanmalıdır.

## Fiziksel varsayımlar ve sınırlamalar

- Her düzenek **sabit hızlı, yarı-statik** idealize modeldir; kuvvet/yol grafiği animasyonu veya açısal ivme modeli değildir.
- **Verim = yararlı iş / verilen iş**; %50–100 aralığında, enerjiden kazanç yok. Gerçek makinedeki sürtünme, ısı, ses ve deformasyonun ayrıntılı modeli yapılmaz.
- Sabit makara yalnız kuvvetin yönünü değiştirir; yükü taşıyan ip sayısına göre hareketli makara/palanga kuvvet kazancı verir. İp esnemez, makara kütlesizdir. Makara şeması ip dolaşım geometrisini tam temsil etmez.
- Kaldıraç kütlesiz ve ideal rijittir; küçük dönme açısında yol oranı kol oranıdır.
- Eğik düzlemde h ≤ L ve F·L = Yük·h / verim. Kuvvet eğik düzlem boyunca uygulanır.
- Çıkrıkta kuvvet tekerlek çevresinde, yük küçük mil çevresindedir. İp kaymaz.
- Vidada bir turdaki yükselme adım kadar, kol yolu 2πR; vida dişlerinin mekanik ayrıntıları ve kendiliğinden kilitlenme hesaplanmaz.
- Dişliler dıştan temas eder, ters döner; diş sayısı oranı hız ve tork oranını belirler. Kayış kasnaklarda açık kayış aynı, çapraz kayış ters yönde döndürür.
- **Üç veya daha fazla basit makinenin birleşik hesabı yapılmaz**; MEB 2018 11.1.10.2 sınırına uyulur.
- Soru bankası bilinçli olarak yok; 8 canlı deney, formül, yorum ve ölçüm önceliklidir.

## Testler

```bash
node --check labs/basit-makineler-math.js
node --check labs/basit-makineler-lab.js
node --test labs/basit-makineler.test.cjs
```

Matematik testleri kuvvet-yol dengesi, enerji korunumu, gerçek verim, makara ip sayısı, dişli/kasnak yönü ve 400 deterministik örneği denetler. DOM testi sekme geçişlerini, sahneleri, açıklamaları ve boş soru sekmesinin gizlendiğini denetler. **Gerçek iPad Safari testi henüz yapılmamıştır.**

## Resmî kaynaklar

- [2018 MEB Fizik Öğretim Programı](https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf)
- [MEB OGM Fizik 11 (2017–23 müfredatı) ders sunuları](https://ogmmateryal.eba.gov.tr/v1/ders-sunu?d=34&k=0&kod=fizik&s=8&u=0)
