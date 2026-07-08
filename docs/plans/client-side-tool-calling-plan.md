# Plan: Client-side Tool Calling

## 1. Genel tool contract

`core/agentic/domain` altında:

- AgentToolDefinition
- AgentToolResult
- AgentToolPermission
- AgentToolExecutionLocation

eklenir.

## 2. Tool events

Agent timeline şu eventleri destekler:

- tool-called
- tool-result-received

## 3. Incident tools

`features/incidents/application/agentic` altında read-only araçlar eklenir:

- read-selected-incident
- summarize-visible-queue
- inspect-approval-boundary

## 4. UI

Agent panelde:

- Run client tools butonu,
- tool result listesi,
- tool timeline kayıtları gösterilir.

## 5. Test

Unit ve page integration testleri:

- tool result üretimini,
- panel rendering'i,
- event timeline kaydını,
- mutation yapılmadığını doğrular.
