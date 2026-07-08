# ADR 0005: Backend Security, Concurrency and Query Boundaries

## Status

Accepted

## Context

InfraFlow moved from an in-memory backend foundation to a PostgreSQL-backed Spring
Boot modular monolith. The next backend step needed to prove enterprise concerns
that are expected in operational systems:

- authenticated API access
- role-based authorization
- concurrent update protection
- transaction-safe audit logging
- controlled fetching of related data

## Decision

1. Use Spring Security 6 with a stateless JWT resource-server setup.
2. Provide local demo login and refresh endpoints for portfolio/runtime testing.
3. Model roles as `OPERATOR` and `ADMIN`.
4. Protect controller use cases with `@PreAuthorize`.
5. Allow only `ADMIN` to resolve incidents.
6. Add a JPA `@Version` field to incidents for optimistic locking.
7. Store audit events through a `REQUIRES_NEW` transaction so rejected commands are
   still recorded even when the main workflow transaction rolls back.
8. Keep `operationalSignals` lazy by default and use `@EntityGraph` on incident
   search/detail queries.

## Consequences

- API access is denied by default unless a valid Bearer token is supplied.
- Frontend integration can use `/api/v1/auth/login` during local development.
- Stale incident writes are rejected with conflict semantics instead of silently
  overwriting another operator's changes.
- Audit records survive rejected workflow attempts.
- Incident list/detail queries intentionally fetch operational signals without
  relying on globally eager collections.

## Query boundary note

Without an explicit fetch plan, an incident list with operational signals can degrade
into one incident query plus additional signal queries per incident. The repository
now uses `@EntityGraph(attributePaths = "operationalSignals")` for the list and detail
paths. That makes the fetch requirement visible at the query boundary and avoids
accidental N+1 behavior as the dataset grows.

