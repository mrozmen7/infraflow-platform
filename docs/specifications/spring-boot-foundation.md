# Specification: Spring Boot Foundation

## Problem

InfraFlow frontend tarafında Incident, Work Order ve Agentic UI akışları kuruldu.
Ancak gerçek kurumsal mimari için backend API, validation, error handling,
OpenAPI ve frontend-backend contract zemini gerekiyordu.

## Kabul kriterleri

1. Spring Boot backend Java 21 ile çalışır.
2. Incident REST API search, get, create, acknowledge ve start-response endpointleri sunar.
3. Work Order REST API list ve draft-from-incident endpointleri sunar.
4. Domain kuralları controller içine gömülmez.
5. Controller-service-repository ayrımı vardır.
6. Incident ve Work Order modülleri explicit port üzerinden konuşur.
7. Validation hataları standart API error response döner.
8. Business rule ihlali 409 Conflict döner.
9. Missing resource 404 döner.
10. OpenAPI dokümanı `/v3/api-docs` üzerinden yayınlanır.
11. Angular için HTTP repository adapter seam hazırlanır.

## Non-goals

- PostgreSQL.
- JPA entity mapping.
- Flyway migration.
- Authentication / authorization.
- Gerçek LLM provider bağlantısı.

Bu konular sonraki backend modüllerinde eklenecektir.
