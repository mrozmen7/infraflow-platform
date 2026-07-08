# Evidence - Module 21 PostgreSQL, Transaction and OpenAPI

## Verification date

2026-07-08

## Automated tests

Command:

```bash
cd backend
mvn test
```

Result:

```text
Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Runtime smoke test

PostgreSQL:

```bash
docker compose -f infra/postgres/compose.yml up -d
```

Backend:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Observed runtime facts:

- Active profile: `local`
- PostgreSQL connection: `jdbc:postgresql://localhost:55432/infraflow`
- Database version: PostgreSQL 17.10
- Flyway validated 2 migrations.
- Flyway schema version: 2
- Tomcat started on port 8080.

## API checks

Health:

```text
GET /actuator/health → {"status":"UP","groups":["liveness","readiness"]}
```

Incidents:

```text
GET /api/v1/incidents?searchTerm=tunnel&severity=Critical → 1 Critical incident
```

Work orders:

```text
GET /api/v1/work-orders → 1 seeded Draft work order
```

OpenAPI:

```text
GET /v3/api-docs → OpenAPI 3.1 document generated
```

Exported contract:

```text
contracts/openapi/infraflow-api-v1.openapi.json
```

## Important learning from verification

The first runtime check exposed two realistic issues:

1. Default config pointed to H2 while H2 was test-scoped.
2. Host port `5432` was already reserved on the machine.

Fix:

- test database config stays in `application-test.yml`
- local runtime uses PostgreSQL in `application-local.yml`
- Docker host port changed to `55432`

This is exactly the kind of environment/config separation expected in real teams.

