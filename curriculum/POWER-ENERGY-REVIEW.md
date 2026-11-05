# Dirençte güç, enerji ve özdeş lambalar — 10.1.2.3(b,ç)

5 Kasım2026. Başlangıç maina409ad250fcfdb8d8031a6e3c0522d3b19f4760c. Mevcut doğrulanmış boş devre tahtasına enerji ölçümü eklenir; hazır devre veya sadece animasyon değildir. Öğrenci bileşen/bağlantı/gerilim/R/anahtar ve geçen zamanı kontrol eder. Üst10.1.2.3 henüz tamamlandı değildir: (a) mekanik güç benzerliği ve (c) bütün enerji dönüşümleri ayrıca kabul bekler.

MEB2018 basılı s.21,10.1.2.3(b) dirençte birim zamandaki enerji hesabıyla, (ç) lamba karşılaştırmasıyla sınırlı. Kaynak https://mufredat.meb.gov.tr/Dosyalar/201812103112910-orta%C3%B6%C4%9Fretim_fizik_son.pdf . Model doğruluğu https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy . İleri kapsam veya kWh/fatura/dönüşüm verimi hesap görevleri eklenmez.

## Model ve bilimsel denetim

Tek ideal kaynak, ideal teller, ohmik/sabit R; L1/L2 özdeş sabit6Ω model lambaları. Kaynak, kablo ve yüklerden oluşan gerçek ağ eski doğrulanmış motorla çözülür. Her adımda E_i += P_i·Δt; koşul değişikliği geçmişe uygulanmaz. Anlık P ile toplam süreyi çarpmak, değişken güçte yanlış olur. Anahtar açık veya sanal kaynak koruması etkinse yük gücü/enerji aktarımı sıfır; süre ilerleyebilir. A=.002Ω,V=1GΩ,S=.0001Ω model kayıpları ayrı gösterilir. P_kaynak=V_kaynak·I_kaynak; kaynak enerjisi yükler+alet/anahtar enerjileriyle sayısal tolerans içinde korunur. Pilin kapasite tükenmesi bu tahtada yok; üreteç tezgâhı ayrı kalır.

Sabit güçte E=P·t ve P=VI=I²R=V²/R. Grafik her yük için E-t, eğimi güç; tablo toplam üç yük enerjisi ve süre boyunca ortalama gücü açıkça ayırır. Ortalama güç değişken deneyde son andaki güçle aynı olmak zorunda değildir. Metin birimlerini W güç / J enerji olarak ayırır. Lamba karşılaştırmasında aynı model lambaların kendi dal güçleri kullanılır; toplam devre gücü parlaklık kanıtı sayılmaz. Gösterge ve renk gerçek ışık şiddeti/verim ölçümü değildir; değişen akkor tel direnci, ışık/ısı oranı ve sıcaklık hesaplanmaz. Dirençte elektrik enerjisi iç enerjiye dönüşebilir, çevreye ısı aktarılabilir; enerji tüketilerek yok olmuş sayılmaz.

Enerji modülü, tahtanın her çiziminde derin değer kopyası alır; tahta durumunu mutasyona uğratamaz. Önceki Ohm/eşdeğer görevleri korunur. Yeni süre deneyi devreyi korur; ayrı enerji tahmini, adımlı/gerçek zamanlı süre, enerji defteri, grafik, açıklama ve özgün12W·20s sorusu var. Başlat/durdur eski animasyon döngülerinin çoğalmasına karşı sürüm anahtarı kullanır. Sekme gizliyken zaman yürütülmez; UI120s oturum sınırıdır, fiziksel tükenme değildir.

Koşul imzası kaynak gerilimi/R/bağlama düzenini saklar, görsel taşıma/döndürme elektriksel değişken sayılmaz. Deney içinde koşul değişmişse kontrollü karşılaştırma kapısı reddeder. Süre karşılaştırması aynı devre/gerilimde; gerilim/R/bağlama karşılaştırması aynı sürede ve yalnız bir değişkenle yapılır. Kayıtlar önceki enerji/koşulları kopyalar. Serbest açıklama otomatik bilimsel doğru sayılmaz.

## Testler

9 yeni model testi: sabit güç integrali, koşul değişiminde geçmiş enerjinin korunması, açık anahtarda düz E eğrisi, kısa devre kaynak ayrılması, seri/paralel özdeş dallar, kaynak/alet enerji bilançosu, aynı güç/farklı süre, tek gerilim etkisi ve karışmış koşulların reddi. İlk ideal60J/120J beklentisi modeldeki sonlu anahtar kaybını yok sayıyordu; bağımsız analitik6V/6Ω+.0001Ω değeriyle düzeltildi, tolerans gevşetilmedi. Yerel toplam520/520.

Yeni gerçek browser senaryosu touch terminal dokunuşuyla kablolar, iki süreyi karşılaştırır, gerilimi deney sırasında değiştirir, eski enerjinin korunmasını ve açık anahtar/özdeş paralel lambaları ölçer; yanlış tahmin/defter/soru/ekran yönlerini sınar. Eski Ohm ve eşdeğer browser testleri aynı Chromium/WebKit işlerinde korunur. Son HEAD CI yeşil olmadan merge yok. Gerçek iPad Safari/Apple Pencil/çoklu dokunma/cihaz akıcılığı ve canlı kabulü ayrıca bekler; elle Vercel deploy tetiklenmez.
