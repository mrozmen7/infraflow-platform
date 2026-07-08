# InfraFlow Backend

Spring Boot backend for the InfraFlow critical infrastructure operations platform.

## Stack

- Java 21
- Spring Boot 3.5.13
- Spring MVC REST API
- Bean Validation
- Spring Boot Actuator
- Spring Security 6
- JWT resource server
- springdoc-openapi / Swagger UI
- Spring Data JPA
- PostgreSQL
- Flyway database migrations

## Architecture

The backend starts as a modular monolith. Each business area owns its own vertical
slice:

```text
com.infraflow.platform
├── incidents
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── web
├── workorders
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── web
└── shared
    ├── audit
    ├── config
    ├── error
    └── security
```

## Security model

Local development uses demo users so the secured API can be exercised without an
external identity provider:

| Username | Password | Roles |
| --- | --- | --- |
| `operator` | `operator` | `OPERATOR` |
| `admin` | `admin` | `ADMIN`, `OPERATOR` |

Runtime rules:

- API endpoints are denied by default unless a valid Bearer JWT is supplied.
- `OPERATOR` can read queues, report incidents, acknowledge and start response.
- `ADMIN` can also resolve incidents.
- Controller use cases are protected with `@PreAuthorize`.
- `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/v3/api-docs` and Swagger are public in local/dev runtime.

## Run

From the repository root:

```bash
docker compose -f infra/postgres/compose.yml up -d

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Useful URLs:

- Health: `http://localhost:8080/actuator/health`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Incidents: `http://localhost:8080/api/v1/incidents`
- Work orders: `http://localhost:8080/api/v1/work-orders`

Login example:

```bash
curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"operator","password":"operator"}'
```

## Test

```bash
cd backend
mvn test
```

Current verification:

- Domain workflow policy tests
- Incident REST API tests
- Work Order REST API tests
- Validation and error response tests
- OpenAPI document exposure test
- JWT authentication and role authorization tests
- Optimistic locking conflict test
- Audit transaction rollback test

## Current boundary

The default runtime repository is JPA-backed. The local profile uses PostgreSQL on
host port `55432`. Tests use isolated H2 databases in PostgreSQL compatibility mode
so they remain fast and deterministic.

Enterprise backend controls currently covered:

- Flyway migrations create operational tables, incident versioning and audit events.
- Incident updates use JPA `@Version` for optimistic locking.
- Rejected workflow commands are persisted to audit events through `REQUIRES_NEW`.
- Incident list/detail queries use `@EntityGraph` to make operational signal fetching explicit.
- OpenAPI declares the JWT Bearer security scheme and auth endpoints.

OpenAPI contract export:

```bash
curl -s -o contracts/openapi/infraflow-api-v1.openapi.json http://localhost:8080/v3/api-docs
```
