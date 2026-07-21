# Infrastructure

Local infrastructure definitions for the InfraFlow platform.

- `postgres/compose.yml` — PostgreSQL for local development (port `55432`).
- `observability/compose.yml` — Prometheus and Grafana for the locally running backend.
- `full-stack/compose.yml` — complete containerized demo stack: PostgreSQL, backend
  image and nginx-served Angular production build (UI on port `18088`).
- `local/` — scripts that start/stop the development stack (PostgreSQL, backend, Angular dev server).
