# Modül 5: Domain ve Feature Sınırları

- Durum: Tamamlandı
- Başlangıç tarihi: 4 Temmuz 2026

## Amaç

Çalışan Incident dikey dilimini davranışı bozmadan, framework bağımsız domain kuralları ve açık bağımlılık yönleri olan kurumsal feature mimarisine dönüştürmek.

## Başlangıç durumu

Aşama 1 sonunda:

- `IncidentListPage` UI state'i ve kullanım senaryosu koordinasyonunu birlikte yönetir.
- `IncidentRepository` portu data-access klasöründedir.
- `MockIncidentRepository` çalışan ve test edilen adapter'dır.
- Route-scoped provider feature izolasyonu sağlar.
- UI component'leri input/output sözleşmeleriyle repository'den ayrıdır.

Bu yapı hatalı değildir. Modül 5'in amacı, feature büyümeden önce iş kuralları ile teknoloji ayrıntıları arasındaki sınırı daha açık ve otomatik korunabilir hâle getirmektir.

## Hedef yapı

```text
features/incidents/
├── domain/
│   ├── model/
│   ├── policies/
│   └── value-objects/
├── application/
│   ├── ports/
│   └── use-cases/
├── infrastructure/
│   ├── di/
│   ├── mock/
│   └── http/                 # Spring Boot entegrasyonunda
├── pages/                    # Presentation: route ekranları
├── ui/                       # Presentation: görsel parçalar
├── guards/
├── resolvers/
└── incidents.routes.ts
```

Klasörler yalnızca gerçek sorumluluk oluştuğunda açılacaktır. Boş katman veya gelecekte belki kullanılır diye soyutlama oluşturulmayacaktır.

## Bağımlılık kuralları

| Kaynak | Kullanabilir | Kullanamaz |
|---|---|---|
| Domain | Saf TypeScript | Angular, Router, HTTP, presentation |
| Application | Domain ve application portları | Somut adapter, Angular component |
| Infrastructure | Domain ve application portları | Presentation ayrıntıları |
| Presentation | Application, domain, shared UI | Somut mock/HTTP adapter |

## Beş uygulama dilimi

1. **Mimari baseline:** Mevcut/hedef yapı, ADR ve bağımlılık kuralları.
2. **Domain modeli:** Entity, value object, invariant ve saf unit testleri.
3. **Application katmanı:** Portlar ve Incident kullanım senaryoları.
4. **Infrastructure + presentation:** Adapter ve Angular bağlantılarının taşınması.
5. **Koruma:** Public API, architecture fitness testleri, test/build ve review.

## Parça 1 öğrenme özeti

- Mimari, klasör isimlerinden çok bağımlılık yönüdür.
- Domain merkezde kalır; framework ve dış sistemler ona doğru bağımlanır.
- Port ihtiyacı tarif eder, adapter bu ihtiyacı teknolojiyle gerçekleştirir.
- Refactoring davranışı değiştirmek zorunda değildir; önce mevcut davranış testlerle korunur.
- Signal Store bu modüle karıştırılmaz; Modül 6'da eklenecektir.

## Parça 2: Domain modeli ve invariant'lar

Incident domain'i `model`, `value-objects` ve `policies` sorumluluklarına ayrıldı.

- `Incident`, kimliği yaşam döngüsü boyunca korunan entity'dir.
- `IncidentId`, `INC-...` biçimini doğrulayan hafif bir value object'tir.
- Yalnızca `Open` durumundaki Incident acknowledge edilebilir.
- Geçersiz geçiş `IncidentStatusTransitionError` ile reddedilir.
- Domain fonksiyonu mevcut nesneyi değiştirmez; yeni bir Incident üretir.
- Mock adapter ve IncidentCard aynı domain politikasını kullanır.

Saf TypeScript testleri geçerli/geçersiz kimliği, başarılı acknowledgement'ı, immutability davranışını ve geçersiz state geçişini kanıtlar.

## Parça 3: Application portları ve kullanım senaryoları

Angular'dan bağımsız application katmanı eklendi:

```text
application/ports/incident-repository.port.ts
application/use-cases/search-incidents.ts
application/use-cases/acknowledge-incident.ts
```

- Repository portu `search`, `findById` ve `save` ihtiyaçlarını tanımlar; HTTP veya mock ayrıntısı içermez.
- Search use case arama metnini normalize edip portu çağırır.
- Acknowledge use case dışarıdan gelen kimliği doğrular, Incident'ı yükler, domain geçişini uygular ve yeni entity'yi kaydeder.
- Geçersiz kimlik repository'ye ulaşmadan reddedilir.
- Bulunamayan Incident, `IncidentNotFoundError` ile teknik hatadan ayrılır.
- Yasak state geçişinde `save` çağrılmaz.

Application testleri Angular `TestBed` kullanmadan çalışır. Bu, kullanım senaryosunun component ve framework'ten bağımsız olduğunun kanıtıdır.

## Parça 4: Infrastructure adapter ve presentation bağlantısı

- Angular `InjectionToken` ve provider, `infrastructure/di` sınırına taşındı.
- `MockIncidentRepository`, application portunu uygular ve yalnızca search/find/save veri işlemlerini yapar.
- Acknowledgement iş kuralı adapter'dan çıkarıldı; application use case tarafından uygulanır.
- `IncidentListPage`, arama ve acknowledgement işlemlerini use case'ler üzerinden çalıştırır.
- Resolver, route parametresini `IncidentId` olarak doğruladıktan sonra repository portuna gider.
- Eski `data-access` importları, Parça 5'te kaldırılmak üzere geçici facade dosyalarına dönüştürüldü.

Çalışan akış:

```text
Presentation -> Application use case -> Domain policy
                         |
                         v
                Repository port
                         ^
                         |
                Infrastructure adapter
```

## Parça 5: Public API ve architecture fitness testleri

- Geçici `data-access` facade dosyaları kaldırıldı.
- `IncidentRepositoryPort` saf TypeScript abstract class hâline getirildi ve Angular DI token olarak doğrudan kullanıldı.
- Presentation artık infrastructure import etmez.
- Root app, Incident feature'a `public-api.ts` üzerinden girer.
- Architecture fitness script'i domain, application, presentation, core, shared ve feature public API sınırlarını kontrol eder.
- CI, unit testlerden önce `npm run test:architecture` çalıştırır.

## Modül 5 sonucu

```text
Pages/UI -> Application use cases -> Domain
                    |
                    v
          IncidentRepositoryPort
                    ^
                    |
        Infrastructure adapter
```

İş kuralları adapter veya component içinde tekrarlanmaz. Domain ve application Angular olmadan test edilir; dış sistem seçimi infrastructure sınırında kalır.

## Tamamlanma ölçütü

- Domain Angular import etmeden test edilebilir.
- Presentation somut adapter bilmez.
- Application kullanım senaryoları component olmadan test edilebilir.
- Mock adapter aynı kullanıcı davranışını korur.
- Yasak import yönleri CI içinde kontrol edilir.
- Tüm testler ve production build başarılıdır.
