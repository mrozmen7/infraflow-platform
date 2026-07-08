# InfraFlow Backend

Spring Boot backend for the InfraFlow critical infrastructure operations platform.

## Stack

- Java 21
- Spring Boot 3.5.13
- Spring MVC REST API
- Bean Validation
- Spring Boot Actuator
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
    ├── config
    └── error
```

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

## Current boundary

The default runtime repository is JPA-backed. The local profile uses PostgreSQL on
host port `55432`. Tests use isolated H2 databases in PostgreSQL compatibility mode
so they remain fast and deterministic.

OpenAPI contract export:

```bash
curl -s -o contracts/openapi/infraflow-api-v1.openapi.json http://localhost:8080/v3/api-docs
```
