# Plan - Module 21 PostgreSQL, Transaction and OpenAPI

## Steps

1. Add JPA, PostgreSQL and Flyway dependencies.
2. Move runtime database configuration to the `local` profile.
3. Keep H2 only for isolated tests.
4. Add Flyway migrations for operations tables and seed data.
5. Add JPA entities under infrastructure.
6. Add mappers between domain models and persistence entities.
7. Replace default repositories with JPA-backed adapters.
8. Add transaction boundaries to application services.
9. Annotate REST controllers for readable OpenAPI output.
10. Export OpenAPI contract to `contracts/openapi`.
11. Verify with Maven tests and PostgreSQL runtime smoke tests.

## Acceptance criteria

- `mvn test` passes.
- Spring Boot starts with `local` profile and PostgreSQL.
- Flyway validates/applies migrations.
- `/actuator/health` returns `UP`.
- `/api/v1/incidents` returns seeded incidents.
- `/api/v1/work-orders` returns seeded work order draft.
- OpenAPI JSON includes Incidents, Work Orders and `ApiError`.

