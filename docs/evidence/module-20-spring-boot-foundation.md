# Evidence: Modül 20 Spring Boot Foundation

Tarih: 2026-07-07

## Kod kanıtı

- `backend/pom.xml`
- `backend/src/main/java/com/infraflow/platform/InfraflowBackendApplication.java`
- `backend/src/main/java/com/infraflow/platform/incidents/**`
- `backend/src/main/java/com/infraflow/platform/workorders/**`
- `backend/src/main/java/com/infraflow/platform/shared/**`
- `frontend/src/app/features/incidents/infrastructure/http/http-incident-repository.ts`

## Backend test kanıtı

Komut:

```bash
cd backend
mvn test
```

Sonuç:

- Tests run: 17
- Failures: 0
- Errors: 0
- Build success

## Frontend test kanıtı

Komut:

```bash
cd frontend
npm test -- --watch=false
```

Sonuç:

- Test files: 31 passed
- Tests: 96 passed

## Runtime smoke test

Komut:

```bash
cd backend
mvn spring-boot:run
```

Doğrulanan endpointler:

- `GET /actuator/health` -> `UP`
- `GET /api/v1/incidents?searchTerm=tunnel&severity=Critical` -> critical incident döndü
- `GET /api/v1/work-orders` -> seed work order döndü
- `POST /api/v1/work-orders/drafts` -> draft work order oluşturdu
- `GET /v3/api-docs` -> OpenAPI document döndü

## Sınır

Bu modül in-memory repository ile tamamlandı. PostgreSQL ve JPA bilinçli olarak
sonraki modüle bırakıldı.
