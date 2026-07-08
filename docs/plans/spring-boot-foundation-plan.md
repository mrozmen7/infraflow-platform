# Plan: Spring Boot Foundation

## Uygulama sırası

1. Maven Spring Boot project skeleton.
2. Shared config, CORS, OpenAPI ve error handling.
3. Incident domain model ve workflow policy.
4. Incident application service ve repository port.
5. In-memory incident repository.
6. Incident REST controller ve DTO'lar.
7. Work Order domain/application/infrastructure/web slice.
8. Work Order -> Incident bağlantısı için explicit lookup port.
9. Backend tests.
10. Angular HTTP repository adapter seam.
11. Frontend tests.
12. Runtime smoke tests.

## Mimari karar

İlk backend modülünde persistence yerine in-memory repository kullanıldı. Bu,
öğrenme sırasını temiz tutar:

```text
Domain + API + validation
    önce
Persistence + transaction + migration
    sonra
```
