# Actions dakika engeli ve tekrarlanan çalıştırmaların azaltılması

5 Kasım2026 GitHub'ın 'You have used100% of the Actions minutes included for the1rid3mon account' başlıklı resmi bildirimi incelendi. Dahil olan aylık2000 dakika bitmiş; bildirim yenilenme tarihini1 Aralık2026 olarak veriyor. Bu, #30 işlerinin adım başlamadan durmasının artık doğrulanmış hesap kotası bağlamıdır. Ücretli kullanım/ödeme/limit veya depo görünürlüğü değiştirilmedi.

Bu bağımsız CI paketi güncel main7275877a610111a4cdb298f80542bdf67a71c671 üstünden hazırlanır; #30 devre koduna bağımlı değildir. Kota bitmişken sunucu doğrulaması çalıştırılamadığından test edilmiş/main kabulü verilmez.

## Değişiklikler

-17 mevcut workflowda workflow adı+PR/ref bazlı concurrency grubu: aynı PR'ın eski commit çalıştırmaları iptal edilir; farklı workflow/PR'lar birbirini iptal etmez. Son commit'in bütün işleri yine çalışmalıdır. Kaynak: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency .
- Eski workflowlarda her geliştirme dalı push'u ile PR olayının aynı testleri iki kez başlatması engellenir. PR tetikleyicisi korunur, push doğrulaması main'de devam eder.
- Sadece navigasyon bağlantısı eklenen tyt-madde-tamamlayici.html, hacim/dayanıklılık/malzeme/karışımın ayrı browser tetikleyicilerinden çıkarılır. Bu sayfa bu laboratuvarların çalışma zamanı bağımlılığı değildir. Genel laboratuvar envanter/regresyon workflowu labs/** kapsamıyla yine çalışır. Bu dört laboratuvarın kendi kaynak/test/workflow ve gerçek paylaşılan model/CSS bağımlılıkları korunur.
- Tarayıcıyı her seferinde apt ile indiren mevcut browser işlerinde resmi Playwright1.62.1 noble imajı kullanılır, kurulu executable denetlenir. Aynı npm sürümü ve Chromium/WebKit matrisi korunur; testler atlanmaz. İmaj diğer başarılı paketlerde zaten kullanılmıştır.

## Yerel doğrulama

17 YAML dosyası BaseLoader ile ayrıştırıldı; önce/sonra tüm job kimlikleri ve her node--test/node tests/* komutu birebir karşılaştırıldı. Hiçbir test job'ı veya test komutu kaldırılmadı. Her push ana dal koşulu, concurrency grubu ve hazır tarayıcı imajı denetlendi. Kontrol geçti. Bu statik doğrulama gerçek GitHub CI yerine geçmez.

Öncelik bilimsel uygulamaya devamdır; bu paket sınırlı kota düzeltmesidir, tüm CI'yı baştan yazmaz. Kota/hesap engeli çözülünce önce bu PR'ın değişen workflowlarını, ardından #30 devre son HEAD'ini gerçek koşullarda doğrula. Mevcut gerekli check adları korunmuştur; branch protection veya güvenlik izinleri gevşetilmemiştir. Güvenlik/ödeme ayarı değiştirmeden quota aşılmaz. Sonraki TYT Fizik paketleri de ayrı dallarda doğrulanmayı bekleyebilir; eksik browser kabulü tamamlandı sayılmaz.
