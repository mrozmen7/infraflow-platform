import { buildIncidentAgentSnapshot } from '../../application/agentic/build-incident-agent-snapshot';
import { IncidentAgentSessionPort } from '../../application/ports/incident-agent-session.port';
import type { Incident } from '../../domain/incident';
import type { AgentSessionSnapshot } from '../../../../core/agentic/domain';

/** Local development adapter that preserves the same application port without HTTP. */
export class MockIncidentAgentSessionRepository implements IncidentAgentSessionPort {
  propose(incident: Incident): Promise<AgentSessionSnapshot> {
    const snapshot = buildIncidentAgentSnapshot(incident);

    if (!snapshot) {
      return Promise.reject(new Error('An incident is required to build an agent session.'));
    }

    return Promise.resolve(snapshot);
  }
}
