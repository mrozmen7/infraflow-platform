export type AgentToolExecutionLocation = 'client' | 'server';

export type AgentToolPermission = 'read-only' | 'requires-approval' | 'mutation-disabled';

export interface AgentToolDefinition {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly executionLocation: AgentToolExecutionLocation;
  readonly permission: AgentToolPermission;
}

export interface AgentToolResult {
  readonly id: string;
  readonly sessionId: string;
  readonly toolName: string;
  readonly title: string;
  readonly summary: string;
  readonly permission: AgentToolPermission;
  readonly facts: readonly string[];
  readonly at: string;
}
