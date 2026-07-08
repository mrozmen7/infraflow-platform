# Modül 20: Spring Boot ve Modular Monolith Foundation

Durum: Tamamlandı

## Amaç

Bu modülde InfraFlow için Spring Boot backend temeli kuruldu. Hedef sadece çalışan
endpoint yazmak değil; frontend'de öğrendiğimiz feature boundary (özellik sınırı)
mantığının backend karşılığını kurmaktı.

## Kurulan yapı

```text
backend/
├── pom.xml
└── src/
    ├── main/java/com/infraflow/platform
    │   ├── incidents
    │   │   ├── domain
    │   │   ├── application
    │   │   ├── infrastructure
    │   │   └── web
    │   ├── workorders
    │   │   ├── domain
    │   │   ├── application
    │   │   ├── infrastructure
    │   │   └── web
    │   └── shared
    │       ├── config
    │       └── error
    └── test/java/com/infraflow/platform
```

## Eklenen ana konular

- Spring Boot application entrypoint.
- REST API endpointleri.
- Incident ve Work Order domain modeli.
- Controller-service-repository ayrımı.
- Modular monolith package boundary.
- Bean Validation.
- Global exception handling.
- API error response modeli.
- OpenAPI / Swagger UI.
- Actuator health endpoint.
- Angular için CORS ayarı.
- Angular HTTP repository adapter seam.

## Bilinçli karar

Bu modülde PostgreSQL/JPA eklenmedi. İlk backend modülünde amaç kalıcı veritabanı
değil, temiz domain/application/web mimarisini kurmaktır. Persistence sonraki
modülde eklenecek.

## Verification

Çalıştırılan backend test komutu:

```bash
mvn test
```

Sonuç:

- 17 test başarılı.
- Domain policy testleri geçti.
- Incident REST API testleri geçti.
- Work Order REST API testleri geçti.
- Validation ve error handling testleri geçti.
- OpenAPI dokümanı test edildi.

Frontend tarafında:

```bash
npm test -- --watch=false
```

Sonuç:

- 31 test dosyası başarılı.
- 96 test başarılı.

## Smoke test

Gerçek server `mvn spring-boot:run` ile başlatıldı ve şu endpointler doğrulandı:

- `GET /actuator/health`
- `GET /api/v1/incidents?searchTerm=tunnel&severity=Critical`
- `GET /api/v1/work-orders`
- `POST /api/v1/work-orders/drafts`
- `GET /v3/api-docs`

## Sonraki backend adımı

Modül 21'de PostgreSQL, Flyway, transaction boundary, persistence mapping ve
OpenAPI contract export konularına geçilebilir.
