# Specification - PostgreSQL Persistence and OpenAPI Contract

## Scope

This module adds durable persistence and API contract export for the current
InfraFlow backend. The asset registry extends the original incident and work-order
schema without making the frontend the source of truth for equipment data.

## Runtime profile

The `local` Spring profile connects the backend to PostgreSQL:

- Host: `localhost`
- Port: `55432`
- Database: `infraflow`
- User: `infraflow`
- Password: `infraflow`

The Docker container maps host `55432` to container `5432` to avoid collisions with
developer machines that already use PostgreSQL on `5432`.

## Database schema

Flyway owns schema creation and seed data:

- `V1__create_operations_tables.sql`
  - `incidents`
  - `incident_operational_signals`
  - `work_orders`
- `V2__seed_operations_data.sql`
  - three incident records
  - one work order draft
- `V3__add_incident_version_and_audit_log.sql`
  - optimistic-lock version field for incidents
  - durable audit log for workflow commands
- `V4__create_asset_registry.sql`
  - `assets` registry with controlled operational seed records
  - search indexes for asset identifier, name, type and location

Hibernate is configured with `ddl-auto: validate`; it validates mappings against the
schema but does not create tables automatically.

## Persistence boundary

Domain objects remain persistence-ignorant:

- `Incident`
- `Asset`
- `WorkOrder`
- value objects and enums

JPA concerns live in `infrastructure`:

- JPA entities
- Spring Data repositories
- persistence mappers
- repository adapters

## Transaction boundary

Application services are transaction boundaries:

- read paths are `readOnly`
- write paths run in a regular transaction

Controllers do not own transactions.

## API contract

The generated OpenAPI contract is stored at:

```text
contracts/openapi/infraflow-api-v1.openapi.json
```

It documents:

- incident search, get, create and workflow commands
- asset search and asset lookup by stable registry identifier
- work order list, get and draft creation
- validation/error model via `ApiError`
