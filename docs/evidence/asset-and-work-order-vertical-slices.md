# Asset Registry and Work-Order Integration Evidence

## Objective

Complete two production-shaped vertical slices:

1. **Asset registry:** a read-only, authoritative inventory of infrastructure
   equipment that incidents and work orders reference.
2. **Work-order workflow:** a frontend queue and controlled draft flow backed by
   the Spring Boot API, rather than browser-created operational data.

## Responsibility boundaries

| Concern | Owner | Reason |
| --- | --- | --- |
| Asset identity, location, criticality and operational state | Asset backend module and PostgreSQL | Equipment facts must have one authoritative source. |
| Incident workflow state | Incident backend module | An incident describes an operational event, not equipment ownership. |
| Work-order creation | Work-order backend module | The backend derives the draft from verified incident context and applies authorization. |
| View state, loading and user feedback | Angular feature pages | The browser presents state but does not establish operational truth. |

The asset identifier is the deliberate integration seam. An incident records the
affected asset ID; a work order is derived from the incident’s verified asset and
priority context.

## Delivered API contract

| Endpoint | Authorization | Purpose |
| --- | --- | --- |
| `GET /api/v1/assets?searchTerm=` | `OPERATOR` or `ADMIN` | Search the asset registry. |
| `GET /api/v1/assets/{assetId}` | `OPERATOR` or `ADMIN` | Inspect one registered asset. |
| `GET /api/v1/work-orders` | `OPERATOR` or `ADMIN` | Load the controlled maintenance queue. |
| `GET /api/v1/work-orders/{workOrderId}` | `OPERATOR` or `ADMIN` | Inspect one work order. |
| `POST /api/v1/work-orders/drafts` | `OPERATOR` or `ADMIN` | Create a draft from an existing incident ID. |

The authenticated Angular HTTP adapter is selected only in the JWT runtime.
The mock adapter remains available for isolated UI tests; it is not used in the
local full-stack runtime.

## Verification performed

```bash
cd backend && mvn test
cd frontend && npm run quality
```

Both suites passed after the change. The backend test suite contains asset API
authorization/search/lookup coverage. The frontend test suite verifies asset and
work-order HTTP request contracts, including the controlled draft request body.

Local runtime verification used the JWT test account, the local PostgreSQL profile
and the generated OpenAPI document. The asset registry returned the three seeded
records. A controlled draft was created from `INC-2026-0001`, producing
`WO-2026-0002`; this record is intentional local demonstration data.

## Deliberately deferred production concerns

- Human identities and JWT signing material are still local-demo configuration, not
  an enterprise identity provider or secret manager.
- Work-order command idempotency and a richer lifecycle are separate workflow
  requirements; this slice exposes only controlled draft creation.
- Asset-to-incident referential validation for new incident reporting needs a
  dedicated cross-module policy before a database foreign key is introduced.
