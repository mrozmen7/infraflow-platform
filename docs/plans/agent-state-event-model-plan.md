# Plan: Agent State & Event Model

## 1. Domain model

`core/agentic/domain` içine genel modeller eklenir:

- AgentEvent
- AgentSessionState
- AgentMessage
- AgentSessionStatus

## 2. Reducer

Event'leri state'e dönüştüren saf fonksiyon yazılır:

```text
old state + event = new state
```

## 3. Snapshot eventleri

AgentSessionSnapshot'tan otomatik başlangıç eventleri üretilir:

- session-started
- context-loaded
- action-card-proposed
- approval-required

## 4. User intent

Action card seçimi `action-card-selected` event'i üretir. Gerçek sistem işlemi
başlatmaz.

## 5. UI timeline

Incident agent panelinde son event'ler gösterilir.

## 6. Verification

Unit testler reducer ve panel davranışını doğrular. Browser kontrolünde timeline
ve intent event'i görünür olmalıdır.
