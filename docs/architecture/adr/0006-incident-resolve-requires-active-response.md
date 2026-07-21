# ADR 0006: Incident Resolution Requires an Active Response

## Status

Accepted

## Context

`IncidentWorkflowPolicy.ensureCanResolve()` only rejected incidents that were
already resolved. As a result, an incident could move directly from `OPEN` — or
from `ACKNOWLEDGED` — to `RESOLVED`, skipping the acknowledge and start-response
steps entirely. The operational chain (reported → acknowledged → response in
progress → resolved) exists so that every closure is backed by a verified field
response, and each transition is recorded in the audit log. Allowing a shortcut
breaks that chain: incidents could be closed without anyone ever taking
operational ownership, and the audit trail would show a resolution with no
preceding response activity.

## Decision

Only incidents in `IN_PROGRESS` status can be resolved. `ensureCanResolve()` now
rejects every other status — including `OPEN`, `ACKNOWLEDGED`, and `RESOLVED` —
with a `BusinessRuleViolationException`, which the API surfaces as a conflict
response.

An admin shortcut that would let `ADMIN` users resolve incidents in any state
was considered and rejected. Resolution is already restricted to the `ADMIN`
role, but the role gate controls *who* may resolve, not *whether* the incident
is ready. A shortcut would make closures possible without a recorded response,
undermining the auditability of the operational chain: auditors and incident
reviews rely on the acknowledge → start-response → resolve sequence to
reconstruct who took ownership and when work actually happened. Keeping the
state machine strict preserves that evidence for every incident, with no
exceptions.

## Consequences

- Resolving an `OPEN` or `ACKNOWLEDGED` incident now fails with a conflict
  response and a `REJECTED` audit event instead of silently closing the
  incident.
- The full operational chain is guaranteed to appear in the audit log for
  every resolved incident.
- Admins must drive an incident through acknowledge and start-response before
  resolving it; there is no privileged bypass.
