# Observability — Metrics, Structured Logging, Dashboards

Phase 2 evidence for the observability hardening of the InfraFlow backend.

## What was added

| Concern | Implementation |
| --- | --- |
| Metrics export | `micrometer-registry-prometheus`, scraped at `GET /actuator/prometheus` |
| Trace correlation | `micrometer-tracing-bridge-brave` puts `traceId`/`spanId` into the logback MDC |
| Structured logs | `logback-spring.xml` with logstash-logback-encoder JSON console output (all profiles except `test`) |
| Workflow latency | `infraflow.incident.workflow` `Timer` around acknowledge / start-response / resolve, tagged `action` + `outcome` |
| Audit outcomes | `infraflow.audit.events` `Counter` in `AuditLogService`, tagged `action` + `outcome` (`SUCCESS` vs `REJECTED`) |
| Local stack | `infra/observability/compose.yml` — Prometheus + Grafana next to PostgreSQL |

## Actuator endpoint security

- Public (no authentication): `/actuator/health`, `/actuator/info`, `/actuator/prometheus`
  — Prometheus scrapes without credentials, matching the existing health/info exposure.
- Every other actuator endpoint requires the `ADMIN` role.
- Enforced in `SecurityConfiguration` and covered by `ActuatorEndpointSecurityTests`
  (public endpoints return 200 unauthenticated, `/actuator/metrics` returns 401
  unauthenticated, 403 for `OPERATOR`, and passes authorization for `ADMIN`).

## Metrics reference

| Metric | Type | Tags | Source |
| --- | --- | --- | --- |
| `http_server_requests_seconds` | timer + histogram | `uri`, `status`, `method` | Spring MVC auto-instrumentation |
| `infraflow_incident_workflow_seconds` | timer + histogram | `action`, `outcome` | `IncidentService.transition` |
| `infraflow_audit_events_total` | counter | `action`, `outcome` | `AuditLogService.record` |

`management.metrics.distribution.percentiles-histogram.http.server.requests: true`
publishes histogram buckets so Prometheus can compute latency percentiles.

Note: `management.prometheus.metrics.export.enabled: true` is set explicitly —
without it the `PrometheusMetricsExportAutoConfiguration` condition does not match
and `/actuator/prometheus` stays unregistered.

## Structured logging

Outside the `test` profile the console emits one JSON object per line via
`LogstashEncoder`. Example fields: `timestamp`, `level`, `logger`, `thread`,
`message`, `traceId`, `spanId` (MDC is shipped in full by the encoder).
The `test` profile keeps the human-readable Spring Boot pattern extended with
`[traceId,spanId]` so test logs stay scannable.

## Running the stack

```bash
# 1. PostgreSQL (existing)
docker compose -f infra/postgres/compose.yml up -d

# 2. Backend with the local profile (JWT_SECRET comes from application-local.yml)
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=local

# 3. Prometheus + Grafana
docker compose -f infra/observability/compose.yml up -d
```

- Prometheus: http://localhost:9090 — scrapes `host.docker.internal:8080/actuator/prometheus`
  every 15 s (`extra_hosts: host.docker.internal:host-gateway` keeps this working on Linux).
- Grafana: http://localhost:3000 — login `admin` / `admin`.

## Provisioned dashboard

`infra/observability/grafana/dashboards/infraflow-overview.json` is provisioned
into the **InfraFlow** folder as *InfraFlow Operations Overview* with four panels:

1. **Request rate** — `sum by (uri, status) (rate(http_server_requests_seconds_count{application="infraflow-backend"}[$__rate_interval]))`
2. **Latency percentiles** — p50 / p95 / p99 via `histogram_quantile` over `http_server_requests_seconds_bucket`
3. **Audit outcomes** — `sum by (outcome) (increase(infraflow_audit_events_total[$__rate_interval]))`
4. **Incident workflow commands** — rate + p95 per workflow action over `infraflow_incident_workflow_seconds`

Generate traffic (search incidents, acknowledge INC-2026-0001, attempt an invalid
transition to see a `REJECTED` audit event) and the panels populate within one
scrape interval.

## Verification

```text
mvn test → Tests run: 50, Failures: 0, Errors: 0, Skipped: 0
```

Includes `ActuatorEndpointSecurityTests` (7 tests) asserting the security rules
and that a real acknowledge command publishes both the workflow timer and the
audit counter on `/actuator/prometheus`.
