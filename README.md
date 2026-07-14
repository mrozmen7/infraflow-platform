# InfraFlow Platform

[![Frontend CI](https://github.com/mrozmen7/infraflow-platform/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/mrozmen7/infraflow-platform/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/mrozmen7/infraflow-platform/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/mrozmen7/infraflow-platform/actions/workflows/backend-ci.yml)

InfraFlow is a modular operations platform for critical infrastructure teams. It
coordinates incident triage, asset context and work-order workflows through a modern
Angular frontend, a Spring Boot modular monolith backend and a PostgreSQL persistence
layer.

The system demonstrates domain-driven API design, signal-based frontend state,
contract-first integration, JWT-secured backend workflows, transaction-safe audit
logging, optimistic concurrency control and production-oriented quality gates.

## Product scope

InfraFlow supports operators who need to react to infrastructure incidents without
losing operational context:

- monitor active incidents across tunnel and infrastructure assets
- maintain a searchable asset registry as the operational source of truth for equipment context
- filter and inspect incident severity, priority, status and operational signals
- acknowledge operator ownership before response coordination starts
- draft and inspect work orders derived from verified incident context
- expose a stable OpenAPI contract for frontend/backend integration

## Screenshots

### Incident operations console

![Incident operations console](docs/assets/screenshots/incident-operations-console.png)

### Guided incident action panel

![Guided incident action panel](docs/assets/screenshots/incident-guidance-panel.png)

## Architecture

```text
infraflow-platform/
├── frontend/      Angular operations console
├── backend/       Spring Boot modular monolith API
├── contracts/     OpenAPI and integration contracts
├── infra/         Local infrastructure definitions
├── docs/          Architecture, domain and delivery documentation
└── AGENTS.md      AI-assisted development operating rules
```

### Frontend

- Angular 22
- Standalone components
- Signals, computed state and resource-style loading flows
- Route-scoped feature boundaries
- Signal Store, normalized state and rollback-safe optimistic updates
- Strict TypeScript, accessibility checks and architecture guardrails

```text
frontend/src/app/
├── core/              application-wide configuration and shell concerns
├── shared/ui/         domain-independent reusable UI
└── features/
    ├── incidents/     incident triage and workflow slice
    ├── assets/        asset-registry read-model slice
    └── work-orders/   controlled maintenance workflow slice
```

### Backend

- Java 21
- Spring Boot 3.5
- Modular monolith package structure
- Spring MVC REST API
- Bean Validation and standardized error responses
- Spring Data JPA
- PostgreSQL
- Flyway migrations
- Transaction boundaries in application services
- Spring Security JWT authentication
- Role-based authorization with `OPERATOR` and `ADMIN`
- Optimistic locking for concurrent incident updates
- Transaction-safe audit logging for rejected workflow commands
- Explicit query fetch boundaries for N+1 prevention
- OpenAPI/Swagger contract generation

```text
backend/src/main/java/com/infraflow/platform/
├── incidents/
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── web
├── assets/
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── web
├── workorders/
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── web
└── shared/
    ├── audit
    ├── config
    ├── error
    └── security
```

## API contract

The current REST API contract is exported to:

```text
contracts/openapi/infraflow-api-v1.openapi.json
```

Main endpoints:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/incidents`
- `GET /api/v1/incidents/{incidentId}`
- `POST /api/v1/incidents`
- `POST /api/v1/incidents/{incidentId}/acknowledge`
- `POST /api/v1/incidents/{incidentId}/start-response`
- `POST /api/v1/incidents/{incidentId}/resolve`
- `GET /api/v1/assets`
- `GET /api/v1/assets/{assetId}`
- `GET /api/v1/work-orders`
- `GET /api/v1/work-orders/{workOrderId}`
- `POST /api/v1/work-orders/drafts`
- `GET /v3/api-docs`
- `GET /swagger-ui.html`

Authorization model:

- `OPERATOR`: read queues, report incidents, acknowledge and start response workflows
- `ADMIN`: all operator capabilities plus incident resolution
- stale writes return conflict semantics through JPA optimistic locking
- rejected workflow commands are still recorded in the audit log

## Local setup

Requirements:

- Node.js 24.15.0
- npm 11.6 or compatible
- Java 21
- Docker Desktop or compatible Docker runtime

### Frontend

```bash
cd frontend
npm install
npm start
```

Quality checks:

```bash
cd frontend
npm test -- --watch=false
npm run build
npm run quality
npm run quality:full
```

### Backend

From the repository root:

```bash
docker compose -f infra/postgres/compose.yml up -d

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Quality checks:

```bash
cd backend
mvn test
```

Useful URLs:

- Health: `http://localhost:8080/actuator/health`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Incidents API: `http://localhost:8080/api/v1/incidents`
- Assets API: `http://localhost:8080/api/v1/assets`
- Work Orders API: `http://localhost:8080/api/v1/work-orders`

## Quality gates

The project is protected by:

- frontend unit tests
- backend unit/API tests
- JWT authentication and role-based authorization tests
- optimistic locking and audit rollback tests
- Angular production build
- architecture fitness checks
- security and accessibility guardrails
- Playwright browser flows
- OpenAPI contract export
- GitHub Actions CI pipelines

## Advanced extensions

InfraFlow also contains experimental extension points for AI-assisted operations:

- Agentic UI contracts and safety boundaries
- guided action-card rendering
- human-in-the-loop approval patterns
- future AG-UI/A2UI and MCP integration seams

The current Agent Session endpoint is a provider-neutral mock runtime, protected by JWT and audit logged. It is consumed through an Angular application port; it does not call an external model or execute an operational mutation.

These extensions are kept behind the main enterprise frontend/backend architecture
so the core system remains understandable, testable and operationally deterministic.

## Documentation

- Product language: [docs/domain/domain-language.md](docs/domain/domain-language.md)
- UI foundation: [docs/design/ui-foundation.md](docs/design/ui-foundation.md)
- Backend hardening evidence: [docs/evidence/backend-enterprise-hardening.md](docs/evidence/backend-enterprise-hardening.md)
- Asset and work-order integration evidence: [docs/evidence/asset-and-work-order-vertical-slices.md](docs/evidence/asset-and-work-order-vertical-slices.md)
- Security/concurrency/query ADR: [docs/architecture/adr/0005-backend-security-concurrency-and-query-boundaries.md](docs/architecture/adr/0005-backend-security-concurrency-and-query-boundaries.md)
- OpenAPI contract: [contracts/openapi/infraflow-api-v1.openapi.json](contracts/openapi/infraflow-api-v1.openapi.json)
- Development documentation: [docs/learning/](docs/learning/)
- Agentic engineering notes: [docs/agentic-engineering/](docs/agentic-engineering/)

## License

MIT. See [LICENSE](LICENSE).
