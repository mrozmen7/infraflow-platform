# Modül 11: İleri Ajan Akışları ve Legacy Refactoring

Durum: Tamamlandı

## Amaç

Bir coding agent (kodlama ajanı) ile yalnız kod üretmek değil; gerçek kullanıcı akışını
doğrulamak, farklı risk rolleriyle review yapmak, paralel çalışma kararını gerekçelendirmek,
legacy kodu davranışı bozmadan refactor etmek ve agent kalitesini ölçmek.

## Ders 11.1 — Playwright ve gerçek kullanıcı akışı

Playwright (gerçek tarayıcı otomasyon aracı), Angular component'ini tek başına değil;
development server, Router, DOM, tıklama ve responsive viewport ile birlikte çalıştırır.

```text
Test
  ↓ /incidents aç
Angular Router + Page + Store + Mock Repository
  ↓ Acknowledged satırı seç
Incident Inspector
  ↓ Start response tıkla
Domain → Use Case → Store → Repository
  ↓
Inspector + list row + metric = In Progress
```

`frontend/e2e/incident-response.spec.ts` kullanıcının gördüğü accessible role ve isimleri
seçer. CSS class veya private field'e bağlanmaz. Aynı test Desktop Chrome ve Pixel 5
viewport'unda çalışır.

Playwright neyi kanıtlar?

- Route açılıyor.
- Gerçek button tıklanabiliyor.
- Component bağlantıları birlikte çalışıyor.
- Store sonucu birden fazla UI alanına yansıyor.
- Dar ve geniş viewport'ta ana akış tamamlanıyor.

Neyi kanıtlamaz?

- Backend authorization,
- gerçek multi-user concurrency,
- bütün screen reader deneyimi,
- production deployment/network davranışı.

## Ders 11.2 — Uzman review rolleri

Architecture, test, security ve evidence rolleri aynı diff'i farklı soruyla inceledi.
Detaylı sözleşme `review-roles-and-subagents.md` içindedir.

Önemli sonuç: Review rolü ile ayrı subagent aynı şey değildir. Küçük ve aynı dosyalara
dokunan görevlerde roller sıralı checklist olarak uygulanabilir. Bağımsız dosya ve kanıt
sınırı varsa ayrı ajan düşünülebilir.

## Ders 11.3 — Paralel/sıralı çalışma ve alt ajan sınırı

Modül 10 response feature'ı ile Modül 11 cache refactor'ı aynı `IncidentStore` üzerinde
çalıştığı için paralel yapılmadı. Paralel iki değişiklik syntactic merge conflict üretmese
bile optimistic state ve cache invalidation davranışını birbirinden habersiz değiştirebilirdi.

Karar formülü:

```text
Bağımsız hedef + ayrı dosya + ayrı test + izole kaynak = paralel düşünülebilir
Aynı contract/state + sıralı bağımlılık + ortak dosya = sıralı çalış
```

## Ders 11.4 — Legacy hotspot ve characterization test

Hotspot: `IncidentStore` içindeki Map, cache key, TTL ve expiry sorumluluğu.

Önce `incident-query-cache.spec.ts` eklendi. İlk Red sonucu:

```text
Cannot find module './incident-query-cache'
```

Bu beklenen hataydı; test yeni seam'i gerçekten talep ediyordu. Sonra minimum
`IncidentQueryCache` sınıfı yazıldı.

### Constructor

```ts
constructor(
  private readonly timeToLiveMs: number,
  private readonly now: () => number = Date.now,
) {}
```

`timeToLiveMs`, bir kaydın kaç milisaniye geçerli olduğunu söyler. `now`, production'da
`Date.now` kullanır; testte kontrollü saat verilir. Bu dependency injection'ın framework
olmayan en basit hâlidir.

### Get ve expiry

```ts
if (this.now() - entry.loadedAt >= this.timeToLiveMs) {
  this.entries.delete(key);
  return undefined;
}
```

Yaş, TTL'ye eşit veya büyükse kayıt silinir. Boundary test (sınır testi), 30.000 ms tam
sınırını özellikle doğrular; `<` ve `<=` hatasını önler.

### Store bağlantısı

```ts
private readonly incidentCache = new IncidentQueryCache(INCIDENT_CACHE_TTL_MS);
```

Store artık `Map` ve zamanı bilmez. `loadIncidents` önce `cache.get(query)`, network sonucu
sonra `cache.set(query, incidents)` çağırır. `reload` yalnız aktif query'yi siler; create,
acknowledge ve start response bütün cache'i temizler.

Bu ayrımda:

- Store: “Ne zaman cache kullanılır/temizlenir?” orchestration kararını verir.
- Cache: “Key nedir, kayıt ne zaman geçersizdir?” mekanizmasını yönetir.

## Ders 11.5 — Regression ve kalite kanıtı

Yakın doğrulama:

```text
2 test dosyası
14 test
Sonuç: Pass
```

Bunun 4'ü yeni characterization, 10'u mevcut Store regression testidir. Yalnız yeni sınıfın
testini geçirmek yeterli olmazdı; Store'un cache, optimistic action ve selection davranışı da
korunmalıydı.

Finalde `npm run quality:full` architecture, guardrail, bütün unit/component testleri,
production build ve iki Playwright projesini tek gate içinde çalıştırır.

## Ders 11.6 — Agent eval, budget ve stop criteria

Agent'ın başarısı satır sayısıyla değil; requirement, scope, architecture, behavioral
quality, security, evidence, reversibility ve communication boyutlarıyla ölçülür.

Hard gate: Security, requirement fidelity veya behavioral quality sıfırsa toplam puan
yüksek görünse bile teslim yapılmaz.

Stop condition örneği: Response start için gerçek role/authorization kararı gerektiğinde
frontend kendi başına “Manager olabilir” varsayımı yapmadı. Bu karar Spring Boot aşamasına
taşındı.

## Junior, mid-level ve senior mülakat cevapları

### Junior

**E2E ile unit test farkı nedir?** Unit test küçük davranışı izole ve hızlı kontrol eder. E2E
gerçek browser üzerinden route, component ve kullanıcı etkileşimini birlikte doğrular.

**Refactoring nedir?** Dışarıdan görünen davranışı değiştirmeden kodun iç yapısını
iyileştirmektir.

**TTL nedir?** Cache kaydının ne kadar süre taze sayılacağını belirleyen yaşam süresidir.

### Mid-level

**Characterization test neden ideal davranışı değil mevcut davranışı kaydeder?** Refactor
sırasında neyin değiştiğini görünür yapmak için. Mevcut davranış bug ise önce ürün kararıyla
ayrı bug fix yapılır; körlemesine kilitlenmez.

**Saat neden constructor'dan verildi?** Gerçek zaman bekleyen flaky test yerine deterministik
sınır testi kurmak ve zaman bağımlılığını görünür yapmak için.

**Neden cache generic shared servise taşınmadı?** Yalnız Incident query ihtiyacı kanıtlı.
Erken generic abstraction feature kurallarını gizler ve gereksiz coupling yaratır.

### Senior

**Alt ajanları ne zaman paralel çalıştırırsın?** Hedef, dosya, contract, runtime kaynağı ve
verification bağımsızsa. Aynı state veya migration üzerinde ise sıralı yürütürüm.

**E2E test sayısını nasıl kontrol edersin?** Unit/integration katmanında hızlı kapsamı kurar,
yalnız kritik user journey ve entegrasyon risklerini E2E'ye taşırım. Flaky selector yerine
accessible role kullanır, trace/video'yu yalnız failure'da saklarım.

**Legacy refactor'ı production'da nasıl güvenli kılarsın?** Characterization/contract test,
küçük diff, observability, staged rollout, feature flag veya strangler yaklaşımı ve açık
rollback planını riskle orantılı uygularım.

## Feynman özeti

Bir depoyu düzenlediğimizi düşün. Önce rafların bugün nasıl kullanıldığını kaydettik. Sonra
etiket ve son kullanma tarihini kontrol eden işi depo yöneticisinin elinden alıp küçük bir
görevliye verdik. Yönetici hâlâ hangi ürünün ne zaman rafa gireceğine karar veriyor. Sonra
hem eski siparişlerin hem yeni düzenin çalıştığını kontrol ettik. Agentic engineering tam
olarak budur: işi parçalamak, sınır koymak ve “oldu” demeden kanıt üretmek.

## Şirkette sunulacak özet

> “Critical user journey'yi desktop ve mobile Playwright ile doğruladım. Architecture,
> test, security ve evidence review rollerini ayrı risk lensleri olarak uyguladım. Aynı
> Store'u etkileyen feature ve refactor işlerini sıralı tuttum. Cache davranışını
> characterization testlerle kilitleyip zamanı inject ederek deterministik yaptım; küçük
> extraction sonrası Store regression testlerini ve full quality gate'i çalıştırdım.”

