# Plan: Agentic UI Foundation

## 1. Contract

`core/agentic/domain` altında genel Agentic UI contract tanımlanır:

- AgentSessionSnapshot
- AgentActionCard
- AgentRiskLevel
- AgentUiMode
- AgentActionIntent

## 2. Adapter

Incident domain modeli agent snapshot'a çevrilir.

Bu adapter component veya repository bilmez.

## 3. UI

Incident sayfasının sağ tarafına Operations assistant paneli eklenir.

Panel:

- context gösterir,
- action card listeler,
- approval gereksinimini işaretler,
- kart seçimini output olarak gönderir.

## 4. Test

Unit testler:

- adapter davranışı,
- panel rendering,
- panel output,
- page integration.

## 5. Güvenlik sınırı

Modül 12'de action card seçimi gerçek mutation yapmaz. Bu bir stop condition'dır.
