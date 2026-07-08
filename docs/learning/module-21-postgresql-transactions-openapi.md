# Modül 21 - PostgreSQL, Transaction ve OpenAPI Contract

Bu modülde backend artık sadece bellekte veri tutan bir demo olmaktan çıktı. Incident
ve Work Order verileri gerçek PostgreSQL veritabanına yazılabilir hale geldi; schema
değişiklikleri Flyway migration dosyalarıyla yönetildi; servis katmanına transaction
sınırları eklendi; frontend ve backend arasındaki API sözleşmesi OpenAPI contract
olarak dışarı aktarıldı.

## Neyi çözdük?

- PostgreSQL: Veriyi uygulama kapanınca kaybolmayan gerçek ilişkisel veritabanında tutar.
- Flyway migration: Veritabanı tablolarını versiyonlu SQL dosyalarıyla kurar ve günceller.
- JPA entity: Java sınıfını veritabanı tablosuyla eşler.
- Repository: Domain/application katmanının veri kaynağını bilmeden kayıt okuyup yazmasını sağlar.
- Persistence mapper: Domain model ile database entity arasında çeviri yapar.
- Transaction: Bir iş kuralının veritabanı işlemlerini tek güvenli bütün olarak yürütür.
- OpenAPI contract: Frontend ve backend ekiplerinin aynı API sözleşmesine bakmasını sağlar.

## Mimari karar

Domain modeli JPA annotation bilmez. `Incident` ve `WorkOrder` saf iş modelidir.
JPA sınıfları `infrastructure` altında tutulur.

```text
web/controller
  ↓ request/response DTO
application/service
  ↓ transaction + use case
domain/model
  ↑ mapper
infrastructure/JPA repository + entity
  ↓
PostgreSQL
```

Bu ayrım sayesinde domain kuralları veritabanı teknolojisine bağımlı hale gelmez.
Yarın JPA yerine başka bir persistence yaklaşımı seçilirse iş kuralları daha az etkilenir.

## Eklenen ana parçalar

- `spring-boot-starter-data-jpa`
- `postgresql` JDBC driver
- `flyway-core`
- `flyway-database-postgresql`
- `application-local.yml`
- `V1__create_operations_tables.sql`
- `V2__seed_operations_data.sql`
- `IncidentJpaEntity`, `WorkOrderJpaEntity`
- `IncidentPersistenceMapper`, `WorkOrderPersistenceMapper`
- `JpaIncidentRepository`, `JpaWorkOrderRepository`
- `contracts/openapi/infraflow-api-v1.openapi.json`

## Local PostgreSQL

PostgreSQL Docker Compose ile çalışır:

```bash
docker compose -f infra/postgres/compose.yml up -d
```

Host portu `55432` seçildi. Çünkü geliştirme makinelerinde `5432` çoğu zaman başka
bir PostgreSQL tarafından kullanılır. Container içinde PostgreSQL yine standart
`5432` portunda çalışır.

Backend local profile ile başlatılır:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## Transaction sınırı

Service sınıfları transaction sınırıdır.

- Query/read metotları: `@Transactional(readOnly = true)`
- Command/write metotları: class-level `@Transactional`

Bu şu anlama gelir: Controller sadece HTTP konuşur; veritabanı bütünlüğünden service
katmanı sorumludur.

## OpenAPI contract

Contract dosyası:

```text
contracts/openapi/infraflow-api-v1.openapi.json
```

Bu dosya frontend için “backend ne döndürür?” sorusunun resmi cevabıdır. Örneğin:

- `GET /api/v1/incidents`
- `POST /api/v1/incidents`
- `POST /api/v1/incidents/{incidentId}/acknowledge`
- `POST /api/v1/work-orders/drafts`
- `ApiError` hata modeli

## Şirkette nasıl anlatılır?

“Backend’i modular monolith olarak kurduk. Domain modeli persistence teknolojisinden
bağımsız. JPA entity ve mapper infrastructure katmanında. Schema yönetimi Flyway ile
versiyonlu. Service katmanı transaction boundary olarak çalışıyor. API sözleşmesini
OpenAPI olarak export edip frontend-backend entegrasyonunu contract üzerinden
kontrol ediyoruz.”

## Mülakat kısa cevapları

- JPA nedir? Java object ile database table arasında mapping yapar.
- Entity nedir? Database tablosuna karşılık gelen persistence sınıfıdır.
- Migration nedir? Veritabanı schema değişikliğinin versiyonlu dosyasıdır.
- Transaction nedir? Bir iş işleminin ya tamamen başarılı ya tamamen geri alınmış olmasını sağlar.
- Repository neden interface? Application katmanı veri kaynağından bağımsız kalsın diye.
- Mapper neden var? Domain modelimizi JPA annotation ve database detaylarından korumak için.
- OpenAPI neden önemli? Frontend, backend, test ve dokümantasyon için ortak contract sağlar.

