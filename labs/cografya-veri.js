/* Begüm · TYT Coğrafya / 2018 MEB odaklı harita bilgi bankası.
 * Her konum gerçek WGS84 enlem-boylamdır; alıştırmalar özgün, ÖSYM sorusu değildir.
 * 2027 resmi kapsamı ÖSYM'nin ilgili yıl duyurusuyla kesinleşir.
 */
(function(root){
 'use strict';
 const topics=[
  ['all','Bütün harita konuları'],
  ['konum','Coğrafi konum · Dünya hareketleri'],
  ['iklim','İklimler ve iklim tipleri'],
  ['sicaklik','Sıcaklık, enlem ve yükselti'],
  ['yagis','Nem, yağış ve rüzgâr'],
  ['jeomorfoloji','İç ve dış kuvvetler · Yer şekilleri'],
  ['su','Akarsular ve göller'],
  ['bitki','Bitkiler ve toprak'],
  ['nufus','Nüfus, göç ve yerleşme'],
  ['ekonomi','Tarım ve ekonomik faaliyetler'],
  ['afet','Doğal afetler ve çevre'],
  ['ulasim','Bölgeler, boğazlar ve ulaşım'],
  ['izohips','İzohips ve ölçek yorumlama']
 ].map(function(t){return {id:t[0],label:t[1]};});

 const L={};
 function loc(id,area,lat,lon,name,tags,detail,rule){
   if(L[id])throw Error('Yinelenen konum: '+id);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat>90||lat< -90||lon>180||lon< -180)throw Error('Hatalı koordinat: '+id);
   L[id]={id,area,lat,lon,name,tags:tags.split(' '),detail,rule};
 }
 // TÜRKİYE — örnek noktalar, şehir merkezleri veya belirtilmiş jeomorfolojik konumlar.
 loc('rize','turkey',41.02,40.52,'Rize','iklim yagis bitki afet nufus ekonomi','Doğu Karadeniz kıyılarında yıl boyu nemli koşullar ve yüksek orografik yağışlar görülür. Çay bahçeleri, gür bitki örtüsü ve eğimli arazide heyelan riski öne çıkar.','Nemli hava dağ yamacında yükseldiğinde soğur ve yağış oluşturur; sıcaklık/bitki örtüsü ile ilişki kur.');
 loc('antalya','turkey',36.90,30.70,'Antalya','iklim sicaklik jeomorfoloji bitki ekonomi afet','Akdeniz kıyısı: yazlar genellikle sıcak-kurak, kışlar ılık-yağışlı. Toroslar karstik şekiller bakımından yaygındır; kıyı turizmi ve turunçgil tarımı öne çıkar.','Akdeniz iklimini yaz kuraklığı ve kış yağışlarıyla tanı; maki bitki örtüsüyle eşleştir.');
 loc('konya','turkey',37.87,32.49,'Konya','iklim yagis sicaklik bitki ekonomi nufus','İç Anadolu’da karasal iklim, geniş ovalar, bozkır örtüsü ve tahıl tarımı önemli yer tutar. Kuraklık ve sulama gereksinimi dikkat çekicidir.','Denize uzaklık ve dağların uzanışı karasallığı; yağış azlığı bozkırı destekler.');
 loc('erzurum','turkey',39.90,41.27,'Erzurum','sicaklik iklim jeomorfoloji afet nufus ekonomi','Yüksek Doğu Anadolu platosunda sert karasal koşullar, uzun-soğuk kışlar ve büyükbaş hayvancılık öne çıkar. Kar ve yüksek eğimler çığ tehlikesi oluşturabilir.','Yükselti arttıkça sıcaklık genellikle azalır; mutlak enlemle yükseltiyi karıştırma.');
 loc('sanliurfa','turkey',37.16,38.79,'Şanlıurfa','iklim ekonomi yagis nufus','Güneydoğu Anadolu’da uzun-sıcak yazlar ve yağış azlığı görülür. Sulama yatırımlarıyla pamuk ve diğer ürünlerin verimi artırılabilir.','Tarım ürününü sadece sıcaklık değil, suya erişim de belirler.');
 loc('izmir','turkey',38.42,27.14,'İzmir','iklim ekonomi nufus jeomorfoloji ulasim','Ege kıyısında Akdeniz iklimi, kıyıya dik uzanan dağlar arasında deniz etkisini içeri taşıyan graben ovaları ve liman ekonomisi öne çıkar.','Ege’de dağların genel olarak kıyıya dik uzanması kıyı-iç kesim ulaşım ve deniz etkisini kolaylaştırır.');
 loc('aydin','turkey',37.84,27.84,'Aydın','ekonomi jeomorfoloji iklim bitki','Büyük Menderes grabeni çevresinde tarım, zeytin-incir üretimi ve Batı Anadolu’nun jeotermal kaynakları önemlidir.','Çöküntü ovaları tarımı, fay hatları jeotermal kaynakları destekleyebilir.');
 loc('denizli','turkey',37.77,29.08,'Denizli (Pamukkale)','jeomorfoloji ekonomi su','Pamukkale’de kalsiyum karbonatça zengin kaynak sularından çökelmeyle travertenler oluşmuştur. Yakın çevre jeotermal kaynaklarca da zengindir.','Traverten kimyasal çökelme şeklidir; aşınımla oluşan peribacasıyla karıştırma.');
 loc('nevsehir','turkey',38.62,34.71,'Nevşehir (Kapadokya)','jeomorfoloji ekonomi','Volkanik tüf gibi farklı dirençte kayaçların akarsu-sel ve rüzgâr aşındırmasıyla peribacaları gelişmiştir.','Peribacası doğrudan volkan bacası değildir; volkanik malzemenin aşınmasıyla oluşan şekildir.');
 loc('tuzgolu','turkey',38.78,33.50,'Tuz Gölü','su yagis iklim','İç Anadolu’da sığ, tuzlu kapalı havza gölüdür. Buharlaşma ve yağış-yeraltı suyu dengesi su yüzeyini etkiler.','Kapalı havzada dışarı akış yoktur; buharlaşma gölün tuzluluğunu artırabilir.');
 loc('vangolu','turkey',38.50,43.30,'Van Gölü','su jeomorfoloji','Doğu Anadolu’da büyük, sodalı-tuzlu kapalı havza gölüdür; çevresindeki volkanizma havzanın oluşumunda rol oynamıştır.','Gölün su kimyası ve oluşumunu iklim, volkanizma ve kapalı havzayla ilişkilendir.');
 loc('ordu','turkey',40.99,37.88,'Ordu','ekonomi iklim yagis','Karadeniz’in nemli yamaçları fındık yetiştiriciliği için elverişlidir. Kıyıya yakın yükseltilerde yerleşme ve tarım alanları engebelidir.','Fındık nemli Karadeniz koşullarıyla; çay özellikle Rize ve çevresiyle eşleşir.');
 loc('malatya','turkey',38.35,38.30,'Malatya','ekonomi iklim','Kayısı üretimiyle tanınan Doğu Anadolu ili. Dağlarla çevrili havza koşulları, yaz sıcaklığı ve sulama yerel tarımı etkiler.','Yerel mikroklima ve havza koşullarını sadece bölge adından çıkarma.');
 loc('gaziantep','turkey',37.07,37.38,'Gaziantep','ekonomi nufus','Güneydoğu Anadolu’da sanayi, ticaret ve Antep fıstığı üretimiyle öne çıkan merkezlerdendir.','Tarımın yanında sanayi ve ulaşım da nüfus çekebilir.');
 loc('istanbul','turkey',41.01,28.97,'İstanbul','nufus ulasim ekonomi konum','Marmara’da boğaz geçişi, yoğun sanayi-hizmet-ekonomi, iç göç ve yüksek nüfus birikimiyle öne çıkar. İstanbul Boğazı Karadeniz’i Marmara Denizi’ne bağlar.','Nüfus yoğunlaşmasında iş olanakları ve ulaşım bağlantıları etkilidir.');
 loc('kocaeli','turkey',40.77,29.94,'Kocaeli (İzmit)','nufus ekonomi ulasim','Marmara Bölgesi’nde sanayi ve lojistik faaliyetlerin yoğun olduğu, göç alan merkezlerden biridir.','Sanayi iş olanakları göçü ve şehirleşmeyi etkiler.');
 loc('ankara','turkey',39.93,32.86,'Ankara','konum nufus ekonomi','İç Anadolu’daki başkent; yönetim, hizmetler ve ulaşım işlevleriyle nüfus çeker.','Bir yerin gelişmişliği yalnız iklimle değil yönetim/hizmet işlevleriyle de açıklanabilir.');
 loc('bolu','turkey',40.73,31.61,'Bolu','bitki iklim jeomorfoloji','Batı Karadeniz’in ormanları, yüksek ve engebeli arazisi, gölleri ve yaylalarıyla tanınır.','Yükselti, yağış ve orman varlığı arasında bağ kur.');
 loc('edrne','turkey',41.67,26.57,'Edirne','konum ekonomi ulasim','Trakya’da Türkiye’nin batısında yer alır. Ergene Havzası tarım ve yerleşme açısından önemlidir.','Yerel saat doğuya gidildikçe ileri olur; Edirne, Iğdır’dan batıdadır.');
 loc('igdir','turkey',39.92,44.04,'Iğdır','konum sicaklik iklim','Türkiye’nin doğusunda, çevresindeki yüksek arazilere kıyasla alçak havza koşulları nedeniyle daha ılıman ve yazın sıcak olabilen bir mikroklima gösterir.','Aynı enlemde bile yükselti ve havza özellikleri sıcaklığı değiştirir.');
 loc('sinop','turkey',42.03,35.15,'Sinop','konum iklim','Karadeniz kıyısındaki kuzeydeki illerimizden biridir; İnceburun Türkiye’nin en kuzey kara ucudur.','Enlem arttıkça yıllık ortalama güneş ışınlarının geliş açısı genellikle küçülür.');
 loc('erzincan','turkey',39.75,39.49,'Erzincan','afet jeomorfoloji','Kuzey Anadolu Fay Zonu yakınında bulunan Erzincan ve çevresi yıkıcı deprem geçmişiyle bilinir.','Deprem tehlikesi aktif faylar ve yerbilim koşullarıyla ilişkilidir; her sarsıntının büyüklüğü önceden bilinemez.');
 loc('duzce','turkey',40.84,31.16,'Düzce','afet jeomorfoloji nufus','Kuzey Anadolu Fay Zonu çevresinde, geçmişte büyük depremler yaşamış Batı Karadeniz ilidir.','Fay zonu boyunca depremler görülebilir; yapı güvenliği önemlidir.');
 loc('hatay','turkey',36.20,36.16,'Hatay (Antakya)','afet konum','Anadolu, Arap ve Afrika levhalarının etkileştiği tektonik bölgede yer alır; 2023 depremleriyle ağır hasar yaşamıştır.','Deprem tehlikesi levha sınırları ve fay sistemleriyle ilişkilidir.');
 loc('rize_vadi','turkey',40.92,40.95,'Doğu Karadeniz Vadileri','afet yagis jeomorfoloji','Dik yamaç ve yoğun yağışın birlikte görüldüğü Doğu Karadeniz vadilerinde heyelan ve taşkın tehlikesi artabilir.','Şiddetli yağış tek başına yeterli değildir; yamaç eğimi, zemin ve arazi kullanımı da etkilidir.');
 loc('tunceli','turkey',39.11,39.54,'Tunceli','nufus jeomorfoloji','Dağlık ve engebeli araziler yerleşme ve ulaşımı zorlaştırabilir; Türkiye’de nüfus yoğunluğu düşük iller arasında sayılır.','Nüfusun dağılışı yalnız iklim değil yer şekilleri ve ekonomik olanaklarla ilgilidir.');
 loc('kars','turkey',40.60,43.10,'Kars','iklim sicaklik ekonomi bitki','Yüksek platolarda sert kışlar ve yazın çayır bitki örtüsü; büyükbaş hayvancılık ve mera kullanımı dikkat çekicidir.','Yüksek, serin plato çayırları ve hayvancılık ilişkisi.');
 loc('bafra','turkey',41.57,35.90,'Bafra Deltası','su jeomorfoloji ekonomi','Kızılırmak’ın Karadeniz’e döküldüğü kesimde alüvyon birikmesiyle oluşan delta ovası.','Deltalar akarsuyun taşıdığı alüvyonların birikmesiyle oluşur; kıyı akıntıları da şekli etkiler.');
 loc('carsamba','turkey',41.25,36.70,'Çarşamba Deltası','su jeomorfoloji ekonomi','Yeşilırmak’ın Karadeniz’e ulaştığı yerde biriktirdiği alüvyonlarla oluşmuş delta ovası.','Kızılırmak → Bafra; Yeşilırmak → Çarşamba eşleştirmesini karıştırma.');
 loc('zonguldak','turkey',41.45,31.79,'Zonguldak','ekonomi jeomorfoloji','Türkiye’de taş kömürü madenciliğinin tarihsel önemli merkezidir.','Taş kömürü ile linyit farklıdır; Zonguldak taş kömürü ile anılır.');
 loc('adana','turkey',37.00,35.32,'Adana (Çukurova)','ekonomi iklim jeomorfoloji','Seyhan ve Ceyhan akarsularının biriktirdiği alüvyonlarla gelişen Çukurova’da verimli tarım alanları bulunur.','Delta ovaları alüvyon birikimi ile oluşur; Akdeniz iklimi ve sulama tarımı etkiler.');
 loc('marmaris','turkey',36.85,28.27,'Muğla (Güney Ege)','iklim ekonomi afet','Güney Ege kıyısında yaz kuraklığı, maki toplulukları ve sıcak-kurak dönemlerde orman yangını tehlikesi öne çıkar.','Yangın tehlikesi sıcaklık, nem, rüzgâr ve insan etkinliği ile değişir.');

 // DÜNYA — temsil noktaları (konumlar şehir/alan koordinatı), mutlak yükseklik/iklim genellenmez.
 loc('manaus','world',-3.11,-60.02,'Manaus · Amazon','iklim yagis bitki su afet','Ekvator çevresindeki Amazon Havzası sıcak-nemli ormanlar, güçlü buharlaşma ve konveksiyonel yağışlarla tanınır.','Ekvatora yakın sıcak ve yağışlı alanlarda tropikal yağmur ormanları gelişir.');
 loc('kisangani','world',0.52,25.19,'Kisangani · Kongo Havzası','iklim yagis bitki su','Kongo Havzası ekvator çevresinde tropikal orman ve yoğun yağış alanıdır.','Ekvatoral kuşakta yıllık sıcaklık farkı genellikle düşüktür.');
 loc('pontianak','world',-0.02,109.34,'Pontianak · Endonezya','iklim yagis bitki','Ekvatorun yakınında, Güneydoğu Asya’da nemli tropikal koşulların görüldüğü bölgedir.','Ekvatora yakınlık tek başına bitki örtüsünü belirlemez; yağış da önemlidir.');
 loc('tamanrasset','world',22.78,5.52,'Tamanrasset · Sahra','iklim sicaklik yagis nufus','Kuzey Afrika’nın Sahra iç kesimlerinde yılın büyük kısmında çok kurak çöl koşulları hakimdir.','Dönenceler çevresinde alçalıcı hava hareketleri kuraklığı destekleyebilir.');
 loc('atacama','world',-23.65,-70.40,'Antofagasta · Atacama','iklim yagis sicaklik','Güney Amerika’nın batısında çok kurak Atacama kıyısında soğuk Humboldt/Peru akıntısı ve subtropikal yüksek basınç etkili olabilir.','Soğuk okyanus akıntıları kıyıların çölleşmesine katkı sağlayabilir.');
 loc('mumbai','world',19.08,72.88,'Mumbai · Hindistan','iklim yagis nufus','Güney Asya muson rüzgârları yazın denizden nem taşıyarak Hindistan’ın batı kıyısında şiddetli yağışlara yol açar.','Muson ikliminde yaz yağışları belirgindir.');
 loc('london','world',51.50,-0.13,'Londra · Birleşik Krallık','iklim sicaklik yagis','Batı Avrupa’da okyanusal etkiyle nemli ve yıl içine görece dağılmış yağış ile ılıman sıcaklıklar görülür.','Orta kuşak batı rüzgârları ve denizellik etkili olur.');
 loc('rome','world',41.90,12.50,'Roma · İtalya','iklim yagis bitki','Akdeniz Havzası’nda yazları kurak, kışları yağışlı iklim örneklerinden biri.','Akdeniz iklimi kış yağışı ve yaz kuraklığıyla tanınır.');
 loc('moscow','world',55.75,37.62,'Moskova · Rusya','iklim sicaklik','Deniz etkisinin sınırlı kaldığı iç kesimlerde karasallık ve belirgin yıllık sıcaklık farkı görülebilir.','Denize uzaklık sıcaklık farkını artırabilir.');
 loc('yakutsk','world',62.03,129.73,'Yakutsk · Sibirya','sicaklik iklim nufus','Kuzeydoğu Sibirya’da çok sert karasal iklim, uzun dondurucu kışlar ve büyük yıllık sıcaklık farkları görülür.','Yüksek enlem + iç kesim = sert karasallık; yükseltiyle karıştırma.');
 loc('quito','world',-0.18,-78.47,'Quito · Andlar','sicaklik jeomorfoloji konum','Ekvatora yakın olmakla birlikte yüksek rakım nedeniyle yıllık sıcaklığı çevredeki alçak tropikal alanlardan düşüktür.','Yükselti sıcaklığı etkiler; aynı enlemde yerler farklı sıcak olabilir.');
 loc('kathmandu','world',27.71,85.32,'Katmandu · Himalaya','jeomorfoloji afet','Himalaya yakınında Hint ve Avrasya levhalarının çarpışmasıyla yükselen dağ kuşağı ve deprem tehlikesi bulunur.','Dağ oluşumunu levha çarpışması/orojenezle eşleştir.');
 loc('reykjavik','world',64.15,-21.94,'Reykjavik · İzlanda','jeomorfoloji afet konum','İzlanda, Atlas Okyanusu ortası sırtı ve sıcak nokta etkinliğiyle volkanizma açısından önemlidir.','Uzaklaşan levha sınırları ve volkanizma ilişkisi.');
 loc('tokyo','world',35.68,139.69,'Tokyo · Japonya','jeomorfoloji afet nufus','Japonya çevresindeki dalma-batma zonları sık deprem ve volkan etkinliğiyle ilişkilidir.','Pasifik Ateş Çemberi, levha sınırlarının yoğunluğuyla ilgilidir.');
 loc('sanfran','world',37.77,-122.42,'San Francisco · Kaliforniya','jeomorfoloji afet','San Andreas Fay sistemi levhaların yanal kaydığı transform sınır örneklerindendir.','Transform levha sınırında yatay yer değiştirme öne çıkar.');
 loc('nairobi','world',-1.29,36.82,'Nairobi · Doğu Afrika','jeomorfoloji','Doğu Afrika Rift sistemi, kıtasal kabuğun gerilmesi ve faylanmasıyla ilişkili çöküntü alanları oluşturur.','Rift vadileri kırılma/gerilme tektoniği ile açıklanır.');
 loc('yogyakarta','world',-7.80,110.36,'Yogyakarta · Cava','jeomorfoloji afet nufus','Endonezya Cava Adası’nda levha dalma-batması ve etkin volkanlar görülür.','Volkanizma ve deprem, dalma-batma kuşaklarıyla ilişkili olabilir.');
 loc('sydney','world',-33.87,151.21,'Sidney · Avustralya','konum sicaklik nufus','Güney Yarımküre orta enlemlerindedir. Aralık ayında yaz, haziran ayında kış yaşanır.','Mevsimler eksen eğikliği ve Dünya’nın Güneş çevresindeki dolanımıyla ilişkilidir.');
 loc('alice','world',-23.70,133.88,'Alice Springs · Avustralya içleri','iklim yagis nufus','Avustralya içlerindeki kurak/yarı kurak alanlarda nüfus seyrektir.','Kurak iklim ve su kıtlığı yerleşmeyi sınırlayabilir.');
 loc('wellington','world',-41.29,174.78,'Wellington · Yeni Zelanda','iklim yagis afet','Güney yarımküre orta kuşağında denizel ve rüzgârlı koşullar yaygındır; Yeni Zelanda levha sınırında deprem tehlikesi barındırır.','Denizellik sıcaklık farkını genelde azaltır; tektonik risk ayrı bir faktördür.');
 loc('shanghai','world',31.23,121.47,'Şanghay · Çin','nufus ekonomi ulasim','Doğu Asya’da yoğun nüfus ve güçlü liman-sanayi-hizmet faaliyetleriyle öne çıkan büyük şehir.','Nüfus birikiminde üretim, ticaret ve ulaşım önemlidir.');
 loc('cairo','world',30.04,31.24,'Kahire · Nil Vadisi','su nufus iklim','Mısır’da Nil Vadisi ve deltası, çevredeki kurak alanlara rağmen su ve verimli toprakları nedeniyle nüfusun toplandığı alandır.','Çöl ortasında su kaynağı yerleşmeyi yoğunlaştırabilir.');
 loc('panama','world',9.08,-79.68,'Panama Kanalı','ulasim konum','Atlas ve Pasifik okyanuslarını Orta Amerika üzerinden bağlayan kanaldır; gemilerin Güney Amerika’nın güneyini dolaşmasını önler.','Kanal yapaydır; Panama ile Süveyş farklı okyanusları bağlar.');
 loc('suez','world',30.46,32.35,'Süveyş Kanalı','ulasim konum','Akdeniz’i Kızıldeniz’e bağlayan yapay kanal; Avrupa-Asya deniz ulaşımını kısaltır.','Süveyş → Akdeniz/Kızıldeniz; Panama → Atlas/Pasifik.');
 loc('singapore','world',1.29,103.85,'Singapur · Malakka geçişi','ulasim nufus ekonomi','Malakka Boğazı çevresi Hint Okyanusu ile Pasifik’e açılan deniz yolları arasında önemli bir geçiştir.','Deniz ulaşım hatları ticaret merkezlerini etkiler.');
 loc('hormuz','world',27.18,56.28,'Hürmüz Boğazı','ulasim konum','Basra Körfezi’ni Umman Körfezi ve Hint Okyanusu yönündeki denizlerle bağlayan dar geçiştir.','Boğazlarda konum, enerji ve ticaret taşımacılığını etkiler.');
 loc('valparaiso','world',-33.05,-71.62,'Valparaíso · Şili','jeomorfoloji afet','Nazka levhasının Güney Amerika levhası altına dalması And Dağları ve büyük deprem tehlikesiyle ilişkilidir.','Dalma-batma levha sınırında şiddetli depremler görülebilir.');
 loc('lima','world',-12.05,-77.04,'Lima · Peru kıyısı','iklim yagis sicaklik','Peru kıyısında soğuk Humboldt akıntısının da katkısıyla geniş ölçekte kurak çöl koşulları görülebilir.','Soğuk akıntı, atmosferik kararlılığı etkileyip kıyı yağışını sınırlandırabilir.');
 loc('perth','world',-31.95,115.86,'Perth · Batı Avustralya','iklim konum','Güneybatı Avustralya’da Akdeniz benzeri iklim: güney yarımkürede yazlar sıcak-kurak, kışlar yağışlı olabilir.','Akdeniz iklimi sadece Akdeniz Havzası’nda görülmez.');
 loc('vancouver','world',49.28,-123.12,'Vancouver · Kanada batı kıyısı','iklim yagis','Kuzey Amerika’nın Pasifik kıyısında nemli ve denizel iklim etkileri belirgindir.','Deniz etkisi ve yükselici hava yağışı artırabilir.');
 loc('rio','world',-22.91,-43.20,'Rio de Janeiro · Brezilya','iklim nufus','Güney Amerika’nın doğu kıyısında tropikal koşullardan etkilenen büyük kentsel merkezlerden biri.','Aynı kıtada enlem ve denize göre iklim farklılaşır.');
 loc('istanbul_world','world',41.01,28.97,'İstanbul Boğazı','ulasim konum','Karadeniz ile Marmara Denizi’ni birleştiren doğal boğazın kıyısında yer alır.','Doğal boğaz ve yapay kanal ayrımını yap.');

 const contour=[
  {id:'hill',name:'Tepe',detail:'İçe doğru kapalı eğrilerin yükselti değerleri artar. Merkeze yaklaşmak yükselmeyi gösterir.',rule:'Kapalı ve içeriye doğru yükselen eğriler tepeyi temsil eder.'},
  {id:'valley',name:'Vadi',detail:'İzohips eğrileri akarsu vadisini kestiğinde V biçiminin uçları genellikle kaynak/yukarı çığır yönünü gösterir.',rule:'Vadi için V uçları çoğunlukla akışın tersine, yukarı çığır yönüne bakar.'},
  {id:'ridge',name:'Sırt',detail:'Sırtın uzantısı boyunca izohipslerin V biçimindeki çıkıntısı genellikle alçalan yöne bakar.',rule:'Sırt ile vadiyi V biçiminin açıldığı yön ve akarsu varlığıyla ayır.'},
  {id:'steep',name:'Dik yamaç',detail:'Eş yükselti aralığı aynıyken izohipsler birbirine çok yaklaşırsa eğim artar.',rule:'İzohipsler yakın = yamaç dik; uzak = yamaç daha az eğimli.'},
  {id:'saddle',name:'Boyun (geçit)',detail:'İki yükselti arasındaki nispeten alçak geçit görünümündeki alan, boyun/sırt geçidi olarak yorumlanır.',rule:'İki tepe arasındaki alçak geçit boyundur.'}
 ];
 const contourById=Object.fromEntries(contour.map(x=>[x.id,x]));
 const Qs=[];
 function q(id,area,topic,prompt,answer,ids,why){
   const choices=ids.trim().split(/\s+/);
   if(choices.length!==5||new Set(choices).size!==5)throw Error('Beş benzersiz nokta gerek: '+id);
   if(!choices.includes(answer))throw Error('Doğru yer seçeneklerde yok: '+id);
   if(!topics.some(t=>t.id===topic))throw Error('Tanımsız konu: '+id);
   for(const key of choices){if(area==='contour'?!contourById[key]:(!L[key]||L[key].area!==area))throw Error('Yanlış alan/id: '+id+' '+key);}
   const rot=(id.split('').reduce((sum,c)=>sum+c.charCodeAt(0),0)+id.length)%5;
   const pins=choices.map((_,i)=>choices[(i+rot)%5]);
   Qs.push({id,area,topic,prompt,answer,pins,why});
 }
 // TÜRKİYE · dağılış/yorum soruları: beş gri, isimsiz işaret.
 q('tr01','turkey','yagis','Orografik yağışların ve yıl boyunca yüksek nemin belirgin olduğu Doğu Karadeniz kıyısı hangisidir?','rize','rize konya sanliurfa edirne erzurum','Doğu Karadeniz’de denizden gelen nemli hava, kıyıya yakın dağlarda yükselerek sık yağış bırakır.');
 q('tr02','turkey','iklim','Yazın kuraklık ve kışın yağış özellikleriyle Akdeniz iklimini gösteren güney kıyısı hangisidir?','antalya','antalya rize konya kars erzurum','Antalya Akdeniz kıyısındadır; yazları genellikle sıcak-kurak, kışları ılık-yağışlıdır.');
 q('tr03','turkey','bitki','Karasal iklime bağlı bozkır örtüsünün geniş alan kapladığı İç Anadolu havzası hangisidir?','konya','konya rize antalya ordu istanbul','Konya çevresinde yağış azlığı ve karasallık bozkırı destekler.');
 q('tr04','turkey','sicaklik','Deniz seviyesine göre oldukça yüksek bir platoda, sert ve uzun kışların görüldüğü merkez hangisidir?','erzurum','erzurum antalya izmir edrne adana','Erzurum’da yükselti ve karasallık düşük kış sıcaklıklarına katkı sağlar.');
 q('tr05','turkey','ekonomi','GAP sulama projeleriyle yaz sıcaklığı yüksek düzlüklerde pamuk yetiştiriciliği öne çıkan il hangisidir?','sanliurfa','sanliurfa rize ordu bolu sinop','Şanlıurfa çevresinde sulama kurak koşullarda tarımsal üretimi etkiler.');
 q('tr06','turkey','ekonomi','Çay tarımıyla özdeşleşen, bol yağış alan il hangisidir?','rize','rize konya edirne ankara malatya','Çay özellikle Doğu Karadeniz’in nemli ve ılıman kıyı kesimlerinde yetişir.');
 q('tr07','turkey','ekonomi','Karadeniz’in nemli yamaçlarında fındık yetiştiriciliğiyle öne çıkan merkez hangisidir?','ordu','ordu konya adana ankara gaziantep','Ordu ve Giresun çevresi fındık tarımıyla öne çıkar.');
 q('tr08','turkey','ekonomi','Türkiye’de kayısı üretiminin önemli merkezi hangisidir?','malatya','malatya istanbul antalya rize erzurum','Malatya kayısı üretimiyle tanınır; havza koşulları tarım üzerinde etkilidir.');
 q('tr09','turkey','ekonomi','Zeytin ve incirin yaygın olduğu Ege kıyı ardı havzasındaki merkez hangisidir?','aydin','aydin konya erzurum kars sanliurfa','Aydın’ın Ege iklimi ve Büyük Menderes çevresi zeytin-incir tarımına elverişlidir.');
 q('tr10','turkey','jeomorfoloji','Kalsiyum karbonatlı kaynak suyunun çökelmesiyle oluşan Pamukkale travertenleri hangi noktadadır?','denizli','denizli nevsehir rize tuzgolu kars','Traverten, kimyasal çökelme şeklidir. Kapadokya peribacaları ise aşınım şeklidir.');
 q('tr11','turkey','jeomorfoloji','Volkanik tüflerin aşınmasıyla oluşan Kapadokya peribacalarını temsil eden nokta hangisidir?','nevsehir','nevsehir denizli rize istanbul edrne','Peribacaları farklı dirençte kayaçların aşınmasıyla şekillenir.');
 q('tr12','turkey','su','Türkiye’de buharlaşmanın etkili olduğu, sığ ve tuzlu kapalı havza gölü hangisidir?','tuzgolu','tuzgolu vangolu bafra carsamba rize','Tuz Gölü İç Anadolu’da kapalı havza gölüdür; buharlaşma tuzluluğa katkı sağlar.');
 q('tr13','turkey','su','Doğu Anadolu’da sodalı-tuzlu suları ile bilinen büyük kapalı havza gölü hangisidir?','vangolu','vangolu tuzgolu bafra carsamba bolu','Van Gölü, Doğu Anadolu’daki kapalı havza gölüdür; sodalı su kimyası önemlidir.');
 q('tr14','turkey','su','Kızılırmak’ın Karadeniz’e döküldüğü yerde meydana gelen delta ovası hangisidir?','bafra','bafra carsamba vangolu tuzgolu adana','Kızılırmak → Bafra Deltası; Yeşilırmak → Çarşamba Deltası.');
 q('tr15','turkey','su','Yeşilırmak’ın Karadeniz kıyısında oluşturduğu delta ovası hangisidir?','carsamba','carsamba bafra vangolu tuzgolu denizli','Yeşilırmak birikimi Çarşamba Deltası’nı oluşturur.');
 q('tr16','turkey','jeomorfoloji','Seyhan-Ceyhan akarsularının taşıdığı alüvyonların birikmesiyle geniş tarım ovası gelişen yer hangisidir?','adana','adana erzurum kars rize bolu','Çukurova akarsuların taşıdığı alüvyonların biriktiği geniş ovalardandır.');
 q('tr17','turkey','jeomorfoloji','Kıyıya dik uzanan dağlar arasında graben ovaları ve deniz etkisinin içeri sokulmasıyla öne çıkan kıyı hangisidir?','izmir','izmir rize sinop erzurum hatay','Ege’de dağlar genel olarak kıyıya dik uzanır; grabenler ulaşımı ve deniz etkisini kolaylaştırabilir.');
 q('tr18','turkey','afet','Kuzey Anadolu Fay Zonu yakınında geçmişte büyük depremler yaşamış Doğu Anadolu’daki merkez hangisidir?','erzincan','erzincan rize konya antalya edrne','Erzincan Kuzey Anadolu Fay Zonu ve deprem tarihiyle bilinir.');
 q('tr19','turkey','afet','Kuzey Anadolu Fay Zonu yakınında 1999 yılında büyük deprem yaşamış Batı Karadeniz ili hangisidir?','duzce','duzce konya sanliurfa antalya kars','1999 Düzce depremi Kuzey Anadolu Fay sistemiyle ilişkilidir.');
 q('tr20','turkey','afet','Aşırı yağış, dik yamaç ve zemin koşulları nedeniyle heyelan tehlikesinin arttığı bölgeyi gösteren nokta hangisidir?','rize_vadi','rize_vadi tuzgolu konya sanliurfa edrne','Doğu Karadeniz’de eğim ve yoğun yağış heyelan tehlikesini artırabilir.');
 q('tr21','turkey','afet','Sıcak-kurak yazların ve rüzgârın orman yangını tehlikesini artırabildiği Güney Ege kıyısı hangisidir?','marmaris','marmaris rize konya erzurum kars','Güney Ege ve Akdeniz kıyılarında yaz aylarında yangın tehlikesi artabilir.');
 q('tr22','turkey','nufus','Yoğun iş alanları, hizmetler ve ulaşım nedeniyle Türkiye’de yüksek nüfus birikimi gösteren metropol hangisidir?','istanbul','istanbul tunceli kars konya sinop','İstanbul sanayi-hizmet ve ulaşım merkezidir; uzun süre iç göç çekmiştir.');
 q('tr23','turkey','nufus','Dağlık ve engebeli arazisiyle nüfusun görece seyrek dağıldığı il hangisidir?','tunceli','tunceli istanbul kocaeli gaziantep izmir','Tunceli’de engebeli topoğrafya ve sınırlı ekonomik çekim nüfus dağılışında etkili olabilir.');
 q('tr24','turkey','nufus','Marmara’da yoğun sanayi kuruluşlarının göç ve şehirleşmeyi desteklediği merkez hangisidir?','kocaeli','kocaeli tunceli kars rize sinop','Kocaeli sanayi ve lojistik merkezlerinden biridir; ekonomik etkinlik nüfus çeker.');
 q('tr25','turkey','nufus','Doğu Karadeniz’de yamaç ve vadiler boyunca dağınık kırsal yerleşmeye uygun örnek hangisidir?','rize','rize konya tuzgolu sanliurfa edrne','Eğim, su ve tarım alanlarının parçalanması Doğu Karadeniz’de dağınık yerleşmeyi destekler.');
 q('tr26','turkey','ekonomi','Türkiye’de taş kömürü madenciliğiyle özellikle özdeşleşmiş kent hangisidir?','zonguldak','zonguldak konya malatya adana erzurum','Zonguldak taş kömürü havzalarının öne çıktığı merkezdir.');
 q('tr27','turkey','ekonomi','Yüksek platolarda yazın çayır örtüsü ile büyükbaş mera hayvancılığının önem kazandığı il hangisidir?','kars','kars antalya izmir edrne adana','Kars çevresinde yüksek ve serin plato koşulları çayır-mera kullanımına olanak verir.');
 q('tr28','turkey','ulasim','Karadeniz ile Marmara Denizi arasında doğal su yoluna komşu olan metropol hangisidir?','istanbul','istanbul ankara erzurum edrne adana','İstanbul Boğazı Karadeniz’i Marmara Denizi’ne bağlar.');
 q('tr29','turkey','konum','Türkiye’de doğu-batı yönünde yerel saati diğer seçeneklerden daha ileride olan nokta hangisidir?','igdir','igdir edrne izmir istanbul rize','Yerel saat boylama bağlıdır; doğuya gidildikçe ilerler. Iğdır bu seçenekler içinde en doğudadır.');
 q('tr30','turkey','konum','Türkiye’de kuzeye doğru gidildikçe güneş ışınlarının ortalama geliş açısının küçülmesi ilkesiyle en kuzeydeki nokta hangisidir?','sinop','sinop antalya adana sanliurfa izmir','Sinop’un İnceburun çevresi Türkiye’nin en kuzey kara ucudur.');
 q('tr31','turkey','sicaklik','Birbirine yakın enlemlerdeki merkezler arasında yüksekliğe bağlı olarak daha serin ortalamalara sahip olması beklenen merkez hangisidir?','erzurum','erzurum izmir antalya adana hatay','Erzurum’un yüksek rakımı sıcaklığı düşürür; enlem tek belirleyici değildir.');
 q('tr32','turkey','bitki','Batı Karadeniz’de yağış ve yükseltiye bağlı geniş orman alanlarını temsil eden nokta hangisidir?','bolu','bolu tuzgolu konya sanliurfa gaziantep','Bolu’nun ormanları nem ve yükselti koşullarıyla ilişkilidir.');
 q('tr33','turkey','ekonomi','Batı Anadolu’da jeotermal kaynaklar, incir-zeytin ve Büyük Menderes Havzası ile ilişkilendirilen nokta hangisidir?','aydin','aydin kars erzurum rize edrne','Ege grabenleri ve tektonik yapı jeotermal kaynaklara katkı sağlar.');
 q('tr34','turkey','ulasim','Trakya’daki Ergene Havzası tarım merkezlerine en yakın nokta hangisidir?','edrne','edrne igdir kars sanliurfa erzurum','Edirne Trakya’dadır; Ergene Havzası tarım ve ulaşım açısından önemlidir.');
 q('tr35','turkey','afet','2023’te yıkıcı depremlerin etkilediği, levha etkileşimlerinin önemli olduğu Hatay çevresindeki nokta hangisidir?','hatay','hatay konya rize edrne ordu','Hatay ve çevresi Doğu Anadolu Fay sistemi ile diğer aktif yapısal unsurlardan etkilenir.');
 q('tr36','turkey','iklim','Güneydoğu Anadolu’daki sıcak ve görece kurak yaz koşullarına uygun merkez hangisidir?','sanliurfa','sanliurfa ordu rize bolu sinop','Şanlıurfa çevresi yazın kuraklık ve yüksek sıcaklıklarla karakterizedir.');
 q('tr37','turkey','ulasim','Türkiye’nin yönetim işlevleri nedeniyle büyüyen başkent kentinin konumu hangisidir?','ankara','ankara rize bolu antalya kars','Ankara başkentlik ve hizmet işlevleriyle önemli bir nüfus merkezidir.');
 q('tr38','turkey','jeomorfoloji','Karstik yer şekillerinin Torosların kalkerli alanlarında yaygın olduğu Akdeniz kıyısı hangisidir?','antalya','antalya erzurum kars bolu sinop','Toroslar kalker kayaçları ve karstik çözünme şekilleriyle ilişkilidir.');

 // DÜNYA
 q('wd01','world','iklim','Ekvator çevresinde yıl boyunca sıcak ve çok nemli tropikal yağmur ormanlarının bulunduğu Amazon havzası hangisidir?','manaus','manaus tamanrasset london rome yakutsk','Amazon Havzası ekvatoral iklim ve tropikal yağmur ormanlarıyla tanınır.');
 q('wd02','world','yagis','Afrika’nın ekvator kuşağında konveksiyonel yağışların yaygın olduğu Kongo havzası hangisidir?','kisangani','kisangani cairo tamanrasset rome london','Kongo Havzası Afrika’nın ekvatoral yağmur ormanı kuşağındadır.');
 q('wd03','world','iklim','Dönenceler yakınında subtropikal yüksek basınç ve düşük yağışların etkili olduğu Sahra çölünü gösteren nokta hangisidir?','tamanrasset','tamanrasset kisangani mumbai london shanghai','Sahra çevresinde subtropikal alçalıcı hava hareketleri kuraklığı destekler.');
 q('wd04','world','yagis','Soğuk Humboldt akıntısının da etkisiyle dünyanın en kurak kıyı alanlarından biri oluşan çöl bölgesi hangisidir?','atacama','atacama mumbai manaus kisangani london','Atacama’da soğuk akıntı, yüksek basınç ve dağ gölgesi kuraklığa katkı sağlar.');
 q('wd05','world','yagis','Yaz musonlarının denizden nem taşımasıyla şiddetli yağış alan Batı Hindistan kıyısı hangisidir?','mumbai','mumbai tamanrasset london yakutsk cairo','Hindistan yaz musonlarında denizden karaya nem taşınır.');
 q('wd06','world','iklim','Orta kuşak batı rüzgârlarının ve denizelliğin ılıman, yıl içine dağılan yağış oluşturduğu Batı Avrupa örneği hangisidir?','london','london mumbai tamanrasset yakutsk cairo','Londra okyanusal iklim etkilerine açıktır.');
 q('wd07','world','iklim','Kış yağışları ve yaz kuraklığıyla tanınan Akdeniz iklimini Avrupa’da gösteren kent hangisidir?','rome','rome london moscow yakutsk manaus','Roma, Akdeniz iklimi örneklerindendir.');
 q('wd08','world','sicaklik','Ekvatora yakın olmasına rağmen yüksek rakımı nedeniyle görece serin sıcaklıkların görüldüğü başkent hangisidir?','quito','quito manaus kisangani cairo singapore','Quito yüksek And dağları üzerindedir; yükselti sıcaklığı düşürür.');
 q('wd09','world','sicaklik','Çok büyük yıllık sıcaklık farkları ve dondurucu kışlarıyla sert karasallığın örneği hangisidir?','yakutsk','yakutsk london rome manaus mumbai','Yakutsk yüksek enlem ve denizden uzaklığın etkisiyle sert karasal özellik gösterir.');
 q('wd10','world','jeomorfoloji','Hint ve Avrasya levhalarının çarpışmasıyla yükselen Himalayaların yakınındaki kent hangisidir?','kathmandu','kathmandu london rio cairo sydney','Himalayalar levha çarpışması ve orojenezle gelişmiştir.');
 q('wd11','world','jeomorfoloji','Atlas Okyanusu ortası sırtında, levhaların ayrıldığı volkanik ada örneği hangisidir?','reykjavik','reykjavik london cairo tokyo sydney','İzlanda, orta okyanus sırtı ve sıcak nokta üzerinde yer alır.');
 q('wd12','world','afet','Pasifik Ateş Çemberi’ndeki dalma-batma zonları nedeniyle depremler ve volkanların sık görüldüğü Japonya merkezi hangisidir?','tokyo','tokyo london cairo moscow rome','Japonya farklı levha sınırlarının kesiştiği deprem ve volkanizma kuşağındadır.');
 q('wd13','world','afet','San Andreas dönüşüm fayıyla ilişkilendirilen Kaliforniya kıyısındaki kent hangisidir?','sanfran','sanfran tokyo london mumbai cairo','San Andreas yanal hareketli transform fay sistemi örneğidir.');
 q('wd14','world','jeomorfoloji','Kıtasal kabukta gerilme, normal faylanma ve rift vadileriyle özdeş Doğu Afrika bölgesi hangisidir?','nairobi','nairobi manaus mumbai rome yakutsk','Doğu Afrika Rift sistemi kabuğun gerilmesi ve ayrılma eğilimiyle ilişkilidir.');
 q('wd15','world','afet','Endonezya Cava Adası’ndaki dalma-batma kuşağı ve etkin volkanlara yakın nokta hangisidir?','yogyakarta','yogyakarta perth london cairo manaus','Cava Adası boyunca dalma-batma volkanizması etkilidir.');
 q('wd16','world','konum','Aralık ayında yaz mevsiminin yaşandığı Güney Yarımküre kentini gösteren nokta hangisidir?','sydney','sydney london moscow tokyo cairo','Güney yarımkürede aralık dönemi yazdır; mevsimler eksen eğikliğiyle oluşur.');
 q('wd17','world','nufus','Kurak Avustralya iç kesimlerinde nüfusun seyrek dağıldığı bölge hangisidir?','alice','alice shanghai london mumbai rio','Avustralya içleri arid koşulları nedeniyle seyrek yerleşmiştir.');
 q('wd18','world','nufus','Doğu Asya kıyısında, liman ve sanayi hizmetlerinin nüfusu yoğunlaştırdığı büyük kent hangisidir?','shanghai','shanghai alice yakutsk tamanrasset atakama','Şanghay Çin’in büyük liman ve ekonomi merkezidir.');
 q('wd19','world','nufus','Kurak çevreye rağmen büyük nehir vadisi boyunca nüfusun yoğunlaştığı Kuzey Afrika yerleşmesi hangisidir?','cairo','cairo tamanrasset alice yakutsk atakama','Nil Vadisi’nde su ve tarım koşulları yerleşimi destekler.');
 q('wd20','world','ulasim','Atlas ve Pasifik okyanuslarını Orta Amerika üzerinden birleştiren yapay kanal hangisidir?','panama','panama suez hormuz singapore istanbul_world','Panama Kanalı iki okyanus arasında deniz yolunu kısaltır.');
 q('wd21','world','ulasim','Akdeniz ile Kızıldeniz’i birbirine bağlayan yapay kanal hangisidir?','suez','suez panama hormuz singapore istanbul_world','Süveyş Kanalı Avrupa–Asya deniz taşımacılığında önemli geçiştir.');
 q('wd22','world','ulasim','Hint Okyanusu ile Pasifik yönündeki ticaret yolunda Malakka geçişine komşu şehir hangisidir?','singapore','singapore panama suez hormuz istanbul_world','Malakka Boğazı dünya deniz taşımacılığında kritik dar geçiştir.');
 q('wd23','world','ulasim','Basra Körfezi’ni Umman Körfezi’ne bağlayan dar geçiş hangisidir?','hormuz','hormuz panama suez singapore istanbul_world','Hürmüz Boğazı Basra Körfezi çıkışıdır.');
 q('wd24','world','ulasim','Karadeniz ile Marmara Denizi arasındaki doğal boğazın bulunduğu nokta hangisidir?','istanbul_world','istanbul_world panama suez hormuz singapore','İstanbul Boğazı doğal; Panama ve Süveyş kanalları yapay geçitlerdir.');
 q('wd25','world','afet','Nazka levhasının dalma-batmasıyla Andlar boyunca büyük depremlerin görüldüğü Şili kıyısı hangisidir?','valparaiso','valparaiso london rome cairo manaus','Şili kıyısında okyanus levhasının kıta levhası altına dalması önemlidir.');
 q('wd26','world','yagis','Güney Amerika batı kıyısında soğuk Peru/Humboldt akıntısının kuraklığı desteklediği kent hangisidir?','lima','lima rio manaus shanghai london','Peru kıyısı soğuk Humboldt akıntısı ve atmosferik kararlılıkla ilişkilidir.');
 q('wd27','world','iklim','Güney Yarımküre’de Akdeniz benzeri kış yağışlı, yaz kurak iklimi gösteren kent hangisidir?','perth','perth sydney alice singapore kisangani','Perth’in bulunduğu güneybatı Avustralya’da Akdeniz iklimine benzeyen koşullar görülür.');
 q('wd28','world','iklim','Kuzey Amerika’nın Pasifik kıyısında denizel nemli iklim özellikleri gösteren merkez hangisidir?','vancouver','vancouver yakutsk manaus cairo alice','Vancouver’da deniz ve batı rüzgârları ılıman/nemli koşullara katkı sağlar.');
 q('wd29','world','konum','Doğu boylamlarında bulunduğu için Londra’ya göre yerel saati ileride olan Doğu Asya kenti hangisidir?','tokyo','tokyo london reykjavik panama sanfran','Doğu boylamlarına gidildikçe yerel saat ilerler; Tokyo doğudadır.');
 q('wd30','world','jeomorfoloji','Ekvator kuşağına yakın, And dağlarındaki yüksek yerleşim örneği hangisidir?','quito','quito london manaus cayro mumbai','Quito yüksek And Dağları üzerinde yer alır.');
 q('wd31','world','bitki','Ekvator çevresinde sık tropikal yağmur ormanlarının geliştiği Güneydoğu Asya kenti hangisidir?','pontianak','pontianak tamanrasset yakutsk rome london','Pontianak ekvator çevresindeki nemli tropikal alanlardandır.');
 q('wd32','world','yagis','Orta kuşak okyanusal etkisi ve rüzgârlarıyla yıl boyu denizel nemin etkili olabildiği Yeni Zelanda başkenti hangisidir?','wellington','wellington alice tamanrasset moscow cairo','Wellington okyanusal etkiye açık bir Yeni Zelanda kentidir.');

 // İZOHİPS: her soru aynı beş küçük şemanın birini buldurur.
 q('ct01','contour','izohips','Merkeze yaklaştıkça yükselti değerlerinin arttığı kapalı eğriler hangi şekli gösterir?','hill','hill valley ridge steep saddle','İçe doğru yükselen kapalı eğriler tepeyi gösterir.');
 q('ct02','contour','izohips','Akarsu yatağını kesen eğrilerin V uçlarının yukarı çığırı işaret ettiği yer şekli hangisidir?','valley','hill valley ridge steep saddle','Vadilerde izohips V uçları genellikle kaynak yönüne bakar.');
 q('ct03','contour','izohips','İzohips eğrilerinin çok sıklaştığı ve eğimin yüksek olduğu örnek hangisidir?','steep','hill valley ridge steep saddle','Eş yükselti farkı aynıyken çizgiler sıklaşırsa yatay uzaklık azalır ve eğim artar.');
 q('ct04','contour','izohips','İki yüksek tepe arasında daha alçakta kalan geçit biçimindeki topoğrafya hangisidir?','saddle','hill valley ridge steep saddle','İki tepe arasındaki boyun, görece alçak geçit yüzeyidir.');
 q('ct05','contour','izohips','İzohips çıkıntılarının vadinin tersine çoğunlukla alçalan yöne uzandığı yer şekli hangisidir?','ridge','hill valley ridge steep saddle','Sırtın V biçimli izohipsleri vadideki V’nin ters yönüne bakabilir; akarsu ilişkisini kontrol et.');
 q('ct06','contour','izohips','Eş yükselti eğrileri arasındaki yatay mesafenin en kısa olduğu yamaç hangisidir?','steep','hill valley ridge steep saddle','Sık izohips dik; seyrek izohips hafif eğimi gösterir.');
 q('ct07','contour','izohips','Bir akarsuyun eğrileri kestiği ve kaynak yönünün şemadan çıkarılabildiği şekil hangisidir?','valley','hill valley ridge steep saddle','Akarsu vadilerindeki V uçları genellikle akışın tersine yönelir.');
 q('ct08','contour','izohips','Yalnız izohips geometrisine bakarak iki doruklu geçit/boğaz tanımlanabilecek şekil hangisidir?','saddle','hill valley ridge steep saddle','İki doruk arasındaki alçak geçit boyundur.');

 // Verify authored question data at load; never ship broken geolocations.
 const ids=new Set();
 for(const row of Qs){
   if(ids.has(row.id))throw Error('Yinelenen soru: '+row.id);
   ids.add(row.id);
   if(row.pins.length!==5||!row.pins.includes(row.answer))throw Error('Yanlış soru: '+row.id);
 }
 const counts=Qs.reduce((acc,q)=>{acc[q.area]=(acc[q.area]||0)+1;return acc;},{});
 root.GeoLabData=Object.freeze({
   topics:Object.freeze(topics),
   points:Object.freeze(L),
   contours:Object.freeze(contour),
   questions:Object.freeze(Qs),
   stats:Object.freeze({questionCount:Qs.length,areas:counts,locationCount:Object.keys(L).length}),
   source:'2018 MEB TYT coğrafya; gerçek WGS84 konum ve özgün harita soruları'
 });
})(window);