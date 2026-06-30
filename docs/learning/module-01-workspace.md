# Modül 1 Ders Notu: Workspace ve Araçlar

## Modül 1 ders sırası

1. Product Charter
2. Domain dili
3. Node.js, npm ve paket modeli
4. Angular CLI ve workspace
5. Dosyadan ekrana çalışma akışı
6. Strict, standalone, zoneless, routing, SCSS ve Vitest
7. Test, build, Git review ve checkpoint

## Ders 1: Product Charter

### Product Charter nedir?

Product Charter, projenin kısa anayasasıdır. Bir anayasa bütün günlük ayrıntıları yazmaz; sistemin amacını, sınırlarını ve değiştirilemeyecek temel ilkelerini belirler. Product Charter da ekibe şunları söyler:

- Hangi problemi çözüyoruz?
- Kimin için çözüyoruz?
- İlk sürümün sınırı nedir?
- Hangi iş kuralları korunmalıdır?
- Başarılı olduğumuzu nasıl ölçeceğiz?

### Hangi problemi çözer?

Charter olmadığında iki geliştirici aynı kelimeden farklı şey anlayabilir. Bir kişi "incident" ile yalnızca teknik arızayı, başka biri müşteri şikayetini kastedebilir. Ekip çok sayıda ekran üretebilir fakat gerçek operasyon problemini çözmeyebilir. AI ajanı da net sınır olmadığı için kapsam dışı kod üretebilir.

Charter, koddan önce ortak yön ve ortak dil oluşturur.

### InfraFlow problemi

Kritik altyapı arızaları telefon, e-posta, kağıt form ve eski sistemler arasında dağılabilir. Bu da dört temel risk doğurur:

1. Doğru ekip geç haberdar olur.
2. Müdahale veya çözüm SLA'sı aşılır.
3. Aynı olay için çelişkili kayıtlar oluşur.
4. Kritik kararı kimin verdiği kanıtlanamaz.

InfraFlow'un görevi yalnızca kayıt saklamak değildir. Arızayı bildirimden çözüme kadar denetlenebilir bir iş akışında yönetmektir.

### Kullanıcılar neden ayrı tanımlanır?

Her rol aynı bilgiyi görmez ve aynı işlemi yapamaz:

- **Operatör:** Olayı kaydeder, izler ve koordinasyonu takip eder.
- **Saha teknisyeni:** Fiziksel arızayı inceler ve work order üzerinde çalışır.
- **Ekip yöneticisi:** Kritik öncelik, SLA ve atama kararlarını onaylar.
- **Sistem yöneticisi / denetçi:** Yetki ve audit kayıtlarını yönetir.

Bu ayrım daha sonra route, ekran, authorization ve test senaryolarına dönüşecektir.

### Ana iş akışı

```text
Arıza bildirimi
      ↓
Yapılandırılmış incident taslağı
      ↓
Risk ve öncelik önerisi
      ↓
Gerekirse insan onayı
      ↓
Work order oluşturma ve atama
      ↓
Saha çalışması
      ↓
Kontrollü kapatma ve audit
```

### AI'nın rolü

AI; metni sınıflandırabilir, eksik bilgiyi gösterebilir ve action card önerebilir. Fakat kritik state'i tek başına değiştiremez. Çünkü LLM çıktısı olasılıksaldır; aynı girdide farklı veya hatalı sonuç üretebilir.

Kalıcı iş kararı deterministik backend kurallarından ve gerekli durumda yetkili insan onayından geçer.

### Ders 1 çıkış ölçütü

Öğrenci aşağıdakileri kendi cümlesiyle açıklayabilmelidir:

1. InfraFlow hangi operasyon problemini çözüyor?
2. Dört kullanıcı rolünün sorumlulukları neden farklı?
3. Incident ile Work Order arasındaki fark nedir?
4. AI neden karar sahibi değil, öneri üreticisidir?
5. MVP kapsamına girmeyen bir örnek nedir?

### Öğrenci görevi

Şu bildirimi analiz et:

> X tünelinin 3. kilometresindeki trafodan duman çıkıyor. Aydınlatma kesildi ve trafik devam ediyor.

Aşağıdaki alanlar için ilk tahminini yaz:

- Incident nedir?
- Etkilenen Asset nedir?
- Severity ne olabilir ve neden?
- İlk Work Order ne olabilir?
- Hangi karar insan onayı gerektirir?

Bu görevde tek bir mükemmel cevap aranmaz. Ama her kararın gerekçesi ve güvenlik etkisi açıklanmalıdır.

---

## Node.js nedir?

Tarayıcı dışında JavaScript çalıştıran çalışma ortamıdır. Angular uygulamasının kendisi production'da Node.js üzerinde çalışmak zorunda değildir; fakat Angular CLI, test runner ve build araçları geliştirme sırasında Node.js kullanır.

Basit benzetme: Angular kaynak kodu bir ham maddeyse Node.js, bu ham maddeyi işleyen atölyenin motorudur.

## npm nedir?

Angular ve diğer JavaScript paketlerini indirir, sürümlerini kaydeder ve `package.json` içindeki komutları çalıştırır. `package-lock.json`, bütün alt bağımlılıkların kesin sürümlerini kaydederek aynı kurulumun başka bilgisayarda tekrarlanmasına yardım eder.

## Angular CLI nedir?

`ng` komutunu sağlayan resmi Angular aracıdır. Workspace oluşturur, component üretebilir, development server çalıştırır, test ve production build başlatır.

CLI iş kuralı veya mimari karar vermez. Tekrarlanan teknik iskeleti güvenilir biçimde üretir.

## Workspace nedir?

Angular kaynak kodu, build hedefleri, test ayarları, TypeScript seçenekleri ve paket tanımlarının birlikte yönetildiği çalışma alanıdır.

Bu projede:

- Repository adı: `infraflow-platform`
- Angular workspace: `frontend`
- Angular uygulama adı: `infraflow-web`

## Strict TypeScript nedir?

TypeScript'in belirsiz veya riskli kodu daha derleme sırasında reddetmesini sağlayan kontrol grubudur. Örneğin bir değer `undefined` olabiliyorsa onu kontrol etmeden kullanmayı engeller.

Strict mod biraz daha fazla düşünmeyi gerektirir; fakat hatanın kullanıcıya ulaşmadan önce bulunma ihtimalini artırır.

## Standalone Angular nedir?

Component, directive ve pipe'ların çalışmak için zorunlu olarak bir NgModule içinde tanımlanmadığı modern Angular modelidir. Her component ihtiyaç duyduğu bağımlılıkları kendi `imports` listesinde açıkça belirtir.

NgModule tamamen yasak değildir; ancak yeni feature kodu için standalone varsayılanımızdır.

## Zoneless nedir?

Eski yaklaşımda Zone.js tarayıcıdaki birçok asenkron işlemi izleyip Angular'a ekranı tekrar kontrol etmesini söylerdi. Zoneless yaklaşımda Angular, Signals ve bilinen framework bildirimleri sayesinde hangi state değişikliklerinin UI'ı etkilediğini daha açık biçimde takip eder.

Angular 21 ve sonrasında zoneless varsayılandır. Projemizde `zone.js` bağımlılığı bulunmaz.

## Routing neden ilk günden var?

Incident, Asset ve Work Order gibi iş alanlarını farklı URL ve lazy feature sınırlarına ayıracağız. Routing'i sonradan eklemek yerine uygulama kabuğunda hazır tutmak, feature büyüdükçe yeniden yapılanmayı azaltır.

## SCSS neden seçildi?

SCSS; değişken, mixin ve iç içe seçici gibi düzenleme araçları ekleyen bir CSS üst kümesidir. Tarayıcı SCSS çalıştırmaz; build sırasında normal CSS'e çevrilir.

Tasarım token'ları ve büyük stil yapıları geldiğinde yardımcı olur. Her şeyi derin iç içe yazmak için kullanılmamalıdır.

## Vitest nedir?

Kodun küçük parçalarını hızlı biçimde çalıştırıp beklenen sonucu üretip üretmediğini kontrol eden test runner'dır. Yeni Angular projelerinde varsayılan unit test altyapısıdır.

Test yalnızca bug yakalamaz; component veya fonksiyonun sözleşmesini de görünür hale getirir.
