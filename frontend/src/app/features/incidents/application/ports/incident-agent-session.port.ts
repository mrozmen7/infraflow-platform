import type { AgentSessionSnapshot } from '../../../../core/agentic/domain';
import type { Incident } from '../../domain/incident';

/**
 * Application port for a provider-neutral advisory session.
 *
 * The UI depends on this contract, not on HTTP or a specific LLM provider.
 */
export abstract class IncidentAgentSessionPort {
  abstract propose(
    incident: Incident,
    abortSignal?: AbortSignal,
  ): Promise<AgentSessionSnapshot>;
}
