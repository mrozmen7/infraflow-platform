# Aşama 4: Agentic UI with Angular

Durum: Tamamlandı - Modül 12-19 tamamlandı

## Amaç

AI/agent özelliklerini Angular uygulamasına rastgele chat paneli olarak değil;
typed contract (tipli sözleşme), action card (aksiyon kartı), approval (onay),
guardrail (koruma kuralı) ve adapter (uyarlayıcı) sınırlarıyla entegre etmek.

Bu aşamanın sonunda InfraFlow, gerçek kurumsal projelerde anlatılabilecek şu
yaklaşıma sahip olacak:

> Agent öneri üretir; Angular UI bunu güvenli contract üzerinden gösterir; kritik
> işlem insan onayı, backend authorization ve audit log olmadan çalışmaz.

## Ana kaynaklar

- ANGULARarchitects: Agentic UI with Angular - Architecture & Patterns.
- AG-UI: Agent-User Interaction Protocol.
- Model Context Protocol: agent/tool/data bağlantıları için açık standart.
- InfraFlow Aşama 3: specification, plan, quality gate ve evidence yaklaşımı.

## Modül planı

| Modül | Başlık | Ana çıktı |
|---:|---|---|
| 12 | Agentic UI Foundation | Contract, adapter, ilk assistant panel |
| 13 | Agent State & Event Model | Event, message, intent ve state timeline |
| 14 | Client-side Tool Calling | Read-only Angular state araçları |
| 15 | Agent Panel & Guided Recommendations | Açıklanabilir öneri paneli |
| 16 | Action Cards & Generative UI | Dinamik ama doğrulanan UI kartları |
| 17 | Human-in-the-Loop Approval Flow | Approval, interrupt, reject, undo |
| 18 | AG-UI / A2UI Adapter Layer | Vendor bağımsız agent protocol sınırı |
| 19 | Safety, Guardrails & Evaluation | Prompt injection, authorization, eval |

## Modül 12 sonucu

Modül 12'de gerçek LLM bağlanmadı. Bunun yerine bilinçli olarak foundation
(temel) kuruldu:

- `core/agentic/domain`: Genel Agentic UI contract.
- `buildIncidentAgentSnapshot`: Incident domain modelini assistant snapshot'a çeviren adapter.
- `incident-agent-panel`: Action card ve guardrail gösteren UI.
- Browser doğrulaması: `/incidents` ekranında Operations assistant görünür.
- Güvenlik sınırı: Action card seçimi gerçek mutation yapmaz; yalnız intent üretir.

## Taşınabilir kalıp

Bu aşamadaki ana ders, her projede birebir dosya isimlerini kopyalamak değildir.
Taşınacak olan mimari sınırdır:

```text
Domain data
    -> Application adapter
    -> Agentic UI contract
    -> Presentation component
    -> User intent
    -> Approval / authorization / execution
```

Bu kalıp e-commerce, banking, logistics, healthcare veya industrial operasyon
projelerinde domain'e göre uyarlanabilir.

## Modül 13 sonucu

Agent davranışı artık event timeline ile izlenebilir:

- session-started
- context-loaded
- action-card-proposed
- approval-required
- action-card-selected

Bu, gerçek LLM bağlanmadan önce gerekli temel katmandır. Çünkü model sağlayıcıdan
bağımsız olarak agent davranışı test edilebilir ve açıklanabilir kalmalıdır.

## Modül 14 sonucu

Client-side tools ile agent artık Angular tarafındaki güvenli context'i okuyabilir:

- seçili incident,
- görünür queue özeti,
- approval boundary.

Araçlar read-only çalışır ve sonuçlarını event timeline'a yazar. Bu, gerçek LLM
bağlandığında modelin kullanabileceği ilk güvenli tool boundary'dir.

## Modül 15 sonucu

Guided recommendations eklendi. Agent artık seçili incident ve tool result
verisinden açıklanabilir öneriler üretir:

- local context check önerisi,
- approval boundary önerisi,
- critical/P1 incident escalation önerisi,
- mutation disabled güvenlik önerisi.

Önemli sınır: recommendation (öneri), execution (çalıştırma) değildir.

## Modül 16 sonucu

Generative UI için serbest HTML yerine typed render block modeli kuruldu:

- recommendation-card,
- tool-result-summary,
- approval-request,
- safety-status.

Bu yaklaşım LLM bağlandığında UI'ın sadece izinli schema üzerinden render
edilmesini sağlar.

## Modül 17 sonucu

Human-in-the-loop approval flow eklendi. Approval gerektiren action card seçilince:

```text
card selected
    -> approval request created
    -> approval queue rendered
    -> operator approves/rejects
    -> event timeline records the decision
```

Bu akış gerçek incident mutation yapmaz. Sadece karar ve intent kaydı oluşturur.

## Modül 18 sonucu

Provider-neutral protocol adapter eklendi. İç model şu çıktılara çevrilebilir:

- state.snapshot,
- state.event,
- tool.result,
- ui.block,
- approval.requested,
- safety.evaluated.

Bu, AG-UI/A2UI gibi standartlara veya farklı LLM runtime'larına geçiş için gevşek
bağlı adapter katmanıdır.

## Modül 19 sonucu

Safety evaluation eklendi:

- tool permissions,
- high-risk approval,
- render block schema,
- approval coverage.

Panel artık safety score ve check listesi gösterir. Guardrail sadece prompt değil,
çalışan kod ve test edilen davranıştır.
