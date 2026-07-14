# Mock LLM Runtime and MCP Tool Contract

`GET /api/v1/agent-sessions/incidents/{incidentId}` returns a provider-neutral mock advisory proposal. It calls no model and executes no operational mutation. Proposal generation is audit logged so that a production operator can explain what was shown and when.

The Angular Incident feature consumes this endpoint through `IncidentAgentSessionPort`. The page owns request state, the HTTP adapter validates and maps the API contract to allow-listed Angular action cards, and `IncidentAgentPanel` remains a presentation component. An unknown recommendation is rejected instead of being rendered or executed.

`contracts/mcp/infraflow-agent-tools.json` documents the future MCP tools and their approval requirements. A future OpenAI, Anthropic or local adapter implements this contract; credentials remain only in backend runtime environment variables. The browser receives neither a provider API key nor arbitrary model-produced HTML.
