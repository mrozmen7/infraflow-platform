# Modül 4: Signals, RxJS ve Test Temelleri

## Amaç

Incident ekranının arama, filtreleme, seçim ve asenkron veri durumlarını tek sahipli, tahmin edilebilir ve test edilebilir biçimde yönetmek.

## Ders 4.1 — State ve state owner

State (uygulamanın o andaki hafızası) örnekleri:

- arama metni,
- seçili Severity filtresi,
- seçili Incident kimliği,
- yüklenen Incident listesi,
- loading/error/action mesajları.

State owner (durumu değiştirme yetkisine sahip tek yer) `IncidentListPage` olarak seçildi. Filter ve Card yalnızca input alır, output yollar. Böylece aynı state iki farklı component'te kopyalanmaz.

## Ders 4.2 — `signal()`

Signal (değeri değiştiğinde onu okuyan yerleri haberdar eden reaktif kutu) kullanıcı state'ini tutar:

```typescript
searchTerm = signal('');
severityFilter = signal<IncidentSeverityFilter>('All');
```

- Okuma: `searchTerm()`
- Yazma: `searchTerm.set('transformer')`
- Mevcut değerden üretme gerektiğinde: `update(...)`

## Ders 4.3 — `computed()`, `effect()` ve `linkedSignal()`

`computed()` (başka signal değerlerinden salt hesaplanan değer), sorgu ve sonuç özetini üretir. İçinde dış dünyayı değiştiren işlem yapılmaz.

`effect()` (signal değişimine karşı dış sistemde yan etki çalıştırma), sonuç sayısını browser document title değerine yazar. State türetmek için değil, Angular dışı bir API ile senkronizasyon için kullanıldı.

`linkedSignal()` (kaynak değiştiğinde geçerliliğini koruyan ama kullanıcı tarafından da değiştirilebilen bağlı state), seçili Incident kimliğini yönetir:

- Eski seçim yeni sonuç listesinde varsa korunur.
- Filtre sonucu seçimi kaldırdıysa ilk geçerli Incident seçilir.
- Liste boşsa seçim `null` olur.

## Ders 4.4 — Observable ve RxJS

Observable (zaman içinde sıfır veya daha fazla değer üreten akış), kullanıcının arama yazma hareketi için uygundur.

Kullanılan RxJS operatörleri:

- `debounceTime(250)` (kullanıcı yazmayı kısa süre durdurana kadar bekleme),
- `distinctUntilChanged()` (aynı değeri art arda tekrar işlememe).

Bu sayede her klavye tuşunda veri isteği yapılmaz.

## Ders 4.5 — Signal ve RxJS seçimi

Seçim kuralımız:

- Ekranın mevcut değeri ve türetilmiş UI state'i için Signal,
- zaman, iptal, çoklu event ve stream davranışı için RxJS,
- asenkron request sonucu ve loading/error durumu için Resource.

`toObservable()` Signal'i RxJS akışına, `toSignal()` RxJS sonucunu template'in kolay okuyacağı Signal'e dönüştürür.

Her şeyi RxJS veya her şeyi Signal yapmak yerine problemin yapısına göre araç seçildi.

## Ders 4.6 — `resource()` ve `httpResource()`

`resource()` (Promise tabanlı asenkron veriyi Signal durumlarıyla yöneten Angular API'si), mock repository aramasını yönetir:

- `params`: reaktif sorgu,
- `loader`: veriyi getiren asenkron fonksiyon,
- `value()`: son başarılı veri,
- `isLoading()`: yüklenme durumu,
- `error()`: hata,
- `reload()`: aynı sorguyu tekrar çalıştırma.

`httpResource()` (HttpClient üzerinde çalışan reaktif HTTP resource), gerçek Spring Boot API geldiğinde kullanılacaktır. Şu anda backend olmadığı için boş bir URL'ye istek atmak yerine aynı davranış repository portu ve `resource()` ile öğrenildi. `provideHttpClient()` şimdiden uygulama konfigürasyonuna eklendi.

## Ders 4.7 — Race condition ve test

Race condition (iki asenkron işlemin bitiş sırasının sonucu yanlış değiştirmesi), kullanıcı hızlı arama yaptığında eski isteğin yeni istekten sonra dönmesiyle oluşabilir.

Angular Resource parametre değiştiğinde eski loader'a `AbortSignal` (işlemi iptal etme sinyali) yollar. Mock repository bu sinyali dinler ve eski beklemeyi iptal eder.

Test kapsamı:

- component input/output ve render,
- filtre event'leri,
- repository arama ve acknowledgement,
- stale request iptali,
- resource sonuç görünümü,
- DI ile fake repository değiştirme,
- guard açık/kapalı yolları,
- resolver başarılı/bulunamadı yolları,
- lazy route ve wildcard route entegrasyonu,
- app shell erişilebilirlik yapısı.

## Loading, error, empty ve success durumları

Kurumsal bir ekran yalnızca başarılı sonucu tasarlamaz:

```text
Request
├── loading  → kullanıcı beklediğini bilir
├── error    → hata açıklaması + retry
├── empty    → sonuç yok açıklaması + filtre sıfırlama
└── success  → erişilebilir Incident listesi
```

### Yakalanan hata

İlk error-state testinde `incidentsResource.value()` hata durumunda okundu. Angular 22 Resource bu durumda `undefined` vermek yerine `ResourceValueError` fırlatır. Hesap önce `hasValue()` kontrolü yapacak şekilde düzeltildi:

```typescript
incidents = computed(() =>
  incidentsResource.hasValue() ? incidentsResource.value() : [],
);
```

Bu test olmasaydı gerçek API hatasında Retry görünümü yerine uygulama hatası oluşacaktı.

## Çıkış kanıtı

- State tek sahibi olan sayfada toplandı.
- Signal, computed, effect ve linkedSignal gerçek problem üzerinde kullanıldı.
- RxJS debounce akışı kuruldu.
- Resource loading/error/reload ve AbortSignal iptali uygulandı.
- 8 test dosyasında 19 test başarılı oldu.
