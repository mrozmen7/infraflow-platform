# InfraFlow Agentic UI Handbook

Durum: Bölüm 4 tamamlandı  
Kapsam: Bölüm 4 - Modül 12 ve sonrası  
Amaç: Agentic UI mimarisini farklı Angular projelerinde tekrar kullanılabilir referans haline getirmek

## Evrensel mimari kalıp

Her kurumsal Agentic UI uygulamasında şu zincir korunmalıdır:

```text
Domain data
    ↓
Application adapter
    ↓
Agentic UI contract
    ↓
Presentation component
    ↓
User intent
    ↓
Approval / authorization / execution
```

Bu zinciri bozarsak agent (ajan) ile UI (arayüz) birbirine sıkı bağlanır. Bu da
vendor lock-in (sağlayıcı bağımlılığı), güvenlik açığı ve test zorluğu üretir.

## Temel prensipler

1. Model önce değil, contract (sözleşme) önce gelir.
2. Action card (aksiyon kartı) execution (çalıştırma) değildir.
3. Critical action (kritik işlem) human approval (insan onayı) olmadan çalışmaz.
4. Frontend (istemci tarafı) sadece güvenli intent (niyet) üretir.
5. Backend (sunucu tarafı) authorization (yetkilendirme), audit log (denetim kaydı) ve kalıcı mutation (veri değişikliği) sahibidir.
6. UI, agent cevabını render etmeden önce whitelist (izinli liste) ve schema (şema) ile doğrulamalıdır.

## Modül haritası

| Modül | Konu | Çıktı |
| --- | --- | --- |
| 12 | Foundation | Contract, adapter, ilk assistant panel |
| 13 | Event model | Agent event, message, state stream modeli |
| 14 | Client-side tools | Tarayıcı tarafı güvenli araçlar |
| 15 | Guided recommendations | Operasyon önerileri ve açıklanabilirlik |
| 16 | Action cards | Dinamik aksiyon kartları |
| 17 | Human-in-the-loop | Approval, interrupt, reject, undo |
| 18 | AG-UI / A2UI adapter | Vendor bağımsız protocol adapter |
| 19 | Safety and evaluation | Guardrails, prompt injection, eval |

## Modül 12 sonucu

Modül 12 sonunda InfraFlow artık seçili incident (olay) için:

- assistant context (asistan bağlamı),
- action cards (aksiyon kartları),
- risk level (risk seviyesi),
- approval requirement (onay gereksinimi),
- evidence (kanıt),
- guardrails (koruma kuralları)

üretebiliyor.

Önemli sınır:

> Bu modülde asistan öneri üretir ama sistemi değiştirmez.

Bu sınır, sonraki modüllerde güvenli execution pipeline (çalıştırma hattı) kurmak
için zorunludur.

## Modül 13 sonucu

Modül 13 ile Agentic UI artık event/state modeline sahiptir.

Temel zincir:

```text
AgentSessionSnapshot
    ↓
baseline events
    ↓
AgentSessionState
    ↓
UI timeline
    ↓
operator intent event
```

Bu mimari ileride şu konular için temel sağlar:

- audit log (denetim kaydı),
- tracing (izleme),
- replay/debugging (yeniden oynatma/hata ayıklama),
- approval flow (onay akışı),
- streaming LLM output (akış halinde LLM çıktısı).

En önemli kural:

> Event yazmak, sistemi değiştirmek değildir. Event önce gözlem ve niyet üretir;
> gerçek mutation ayrı authorization/approval hattından geçer.

## Modül 14 sonucu

Modül 14 ile Agentic UI read-only client-side tool calling kazandı.

Yeni zincir:

```text
Operator requests tools
    ↓
Client-side tool reads Angular state
    ↓
Typed AgentToolResult returns
    ↓
tool-called / tool-result-received events are recorded
    ↓
UI shows evidence
```

Bu araçlar sadece okuma yapar. Mutation, authorization ve audit gerektiren bütün
işler backend tarafına bırakılır.

## Modül 15-19 sonucu

Bölüm 4 sonunda InfraFlow Agentic UI artık şu uçtan uca zincire sahiptir:

```text
Snapshot
    ↓
Recommendations
    ↓
Render blocks
    ↓
Approval queue
    ↓
Protocol adapter
    ↓
Safety evaluation
```

### Guided recommendations

Recommendation (öneri), agent'ın operatöre sunduğu açıklanabilir karar desteğidir.
Her öneri priority (öncelik), summary (özet) ve evidence (kanıt) taşır.

### Generative UI render blocks

Render block (render bloğu), LLM veya agent çıktısının UI'da güvenli gösterim
modelidir. Serbest HTML kullanılmaz; sadece izinli block type'lar render edilir.

### Human-in-the-loop approval

Approval request (onay isteği), kritik aksiyon için insan kararını zorunlu hale
getirir. Approve/reject kararı event timeline'a yazılır; gerçek backend mutation
bu aşamada çalıştırılmaz.

### Protocol adapter

Protocol adapter (protokol uyarlayıcı), iç Agentic UI modelini provider-neutral
event akışına dönüştürür. Böylece ileride OpenAI, Claude, local model, AG-UI veya
A2UI tarafı değişse bile Angular UI doğrudan kırılmaz.

### Safety evaluation

Safety evaluation (güvenlik değerlendirmesi), agentic akışı test edilebilir
check'lere böler:

- tool permissions,
- high-risk approval,
- render block schema,
- approval coverage.

Bu handbook için temel kural:

> Agentic UI tasarlarken önce güvenli contract ve approval boundary kurulur;
> gerçek LLM bağlantısı bu sınırların üstüne eklenir.
