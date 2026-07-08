# Backend Enterprise Hardening Evidence

## Scope

This evidence note documents the backend hardening work that turns InfraFlow from a
basic REST API into a more realistic enterprise reference backend.

## Implemented controls

### JWT authentication

- Spring Security 6 protects API endpoints by default.
- Local demo login issues access and refresh tokens.
- OpenAPI exposes the Bearer JWT security scheme.

### Role-based authorization

- `OPERATOR` can work with incident and work-order queues.
- `ADMIN` can resolve incidents.
- Controller methods use `@PreAuthorize` so authorization is enforced close to the use case.

### Optimistic locking

- Incident persistence includes a JPA `@Version` field.
- Concurrent stale saves fail with conflict semantics instead of overwriting another operator.

### Transaction-safe audit logging

- Audit records are written in a `REQUIRES_NEW` transaction.
- Rejected workflow commands remain visible even when the main command transaction rolls back.

### Query boundary control

- `operationalSignals` stays lazy by default.
- Incident list/detail queries use `@EntityGraph` to fetch required signal data explicitly.
- This prevents accidental N+1 query behavior at the API boundary.

## Verification

Command:

```bash
cd backend
mvn test
```

Result:

```text
Tests run: 25, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Reference documents

- [ADR 0005: Backend Security, Concurrency and Query Boundaries](../architecture/adr/0005-backend-security-concurrency-and-query-boundaries.md)
- [OpenAPI contract](../../contracts/openapi/infraflow-api-v1.openapi.json)
