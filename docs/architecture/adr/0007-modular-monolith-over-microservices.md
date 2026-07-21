# ADR 0007: Modular Monolith over Microservices

## Status

Accepted

## Context

InfraFlow is operations software for critical infrastructure teams. Systems in
this category share a set of forces that shape the deployment architecture:

- **Long-lived software in regulated environments.** The platform is expected
  to run for years under audit obligations. Every additional moving part in the
  deployment topology becomes something that must be patched, monitored,
  evidenced and re-certified over that lifetime.
- **Small team.** A single team owns the incident, asset and work-order
  capabilities end to end. There is no organizational boundary that an
  architectural boundary would need to mirror.
- **Strong consistency needs across modules.** The operational chain spans
  incidents, assets and work orders: a work-order draft must resolve verified
  incident and asset context atomically, workflow transitions write audit
  records in the same transaction, and incident resolution must observe the
  current state of the operational chain — not an eventually consistent copy.
- **One latency-critical workflow.** Triage and response coordination run
  against live queues; cross-process round trips between the modules that
  participate in one operator action would add failure modes without adding
  capability.

At the same time, an unstructured codebase would erode quickly: without
enforced boundaries, controllers start reaching into other modules' persistence
and the consistency story becomes untestable.

## Decision

Structure the backend as a **modular monolith with enforced boundaries**:

1. One deployable Spring Boot unit with a package structure of feature modules
   (`incidents`, `assets`, `workorders`, `agentic`) plus a `shared` kernel.
   Each module is layered into `domain`, `application`, `infrastructure` and
   `web`.
2. Cross-module access goes through **application-level ports only** — for
   example `IncidentLookupPort` (work orders resolve incident summaries) and
   `IncidentAgentContextPort` (the agentic module reads incident context).
   Modules never import each other's domain, infrastructure or web types.
3. Boundaries are executable, not documentary: ArchUnit `ModuleBoundaryTests`
   fail the build when the domain layer touches framework or persistence
   types, when the application layer bypasses ports, when infrastructure is
   reached from outside its module, or when a feature module is used through
   anything but its application ports.
4. The OpenAPI contract (`contracts/openapi/infraflow-api-v1.openapi.json`) is
   the single integration surface for the frontend, independent of the internal
   module layout.

## Consequences

- **Single deployment unit.** One build, one container image, one Flyway
  migration chain, one health model. Regulated-environment evidence (audit
  log, access control, metrics) attaches to one runtime instead of a fleet.
- **Local transactions instead of distributed sagas.** Work-order drafting,
  incident workflow transitions and audit recording commit or roll back
  together in one PostgreSQL transaction; there is no compensation logic to
  design, test or audit.
- **Cross-module reads are in-process calls** behind interfaces, with no
  serialization or network failure modes on the operator's critical path.
- **The extraction path is preserved.** Because every cross-module dependency
  already flows through an application port with an explicit contract type,
  promoting a module to a separate service later means replacing the in-process
  adapter behind that port — not untangling package spaghetti. Extraction is a
  deliberate, reversible-feeling decision rather than a rescue operation.
- **Cost accepted:** all modules share a release cadence and a runtime, so a
  module cannot be scaled or deployed independently. At current team size and
  load profile this is a feature (coordination stays cheap), not a limitation.

## Alternatives considered

- **Microservices.** Rejected: they would introduce distributed transactions
  (sagas) across incidents/assets/work-orders, duplicated operational tooling
  (deployment, observability, secret management, audit evidence) and
  network-level failure modes — operational complexity without an
  organizational need, since one team owns all modules. The consistency
  requirements of the operational chain would make the distribution cost
  immediate while the scaling benefit remains hypothetical.
- **Unstructured monolith.** Rejected: a single deployment unit without
  enforced boundaries erodes toward unrestricted cross-module imports, making
  the consistency and audit guarantees untestable and closing the extraction
  path entirely. The ArchUnit boundary tests exist precisely to keep the
  monolith modular rather than merely "not microservices".
