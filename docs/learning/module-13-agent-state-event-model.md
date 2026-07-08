# Modül 13 - Agent State & Event Model

Durum: Uygulandı  
Tarih: 2026-07-07  
Referans: Agentic UI with Angular, AG-UI event yaklaşımı, OpenAI Agents state/tool/streaming yaklaşımı

## Amaç

Modül 12'de Operations assistant (operasyon asistanı) action card (aksiyon kartı)
gösterebiliyordu. Modül 13'te bu davranışı izlenebilir hale getirdik.

Artık sistem sadece "kart gösterdi" demiyor; hangi sırayla ne olduğunu agent event
(ajan olayı) olarak kaydediyor.

## Hangi problemi çözer?

Kurumsal sistemde AI/agent entegrasyonunda en kritik soru şudur:

> AI ne yaptı, neye göre önerdi, kullanıcı neyi seçti ve sistem gerçekten neyi değiştirdi?

Event/state modeli olmadan bu sorulara net cevap verilemez.

Bu modül şu problemleri çözer:

- Agent davranışı gözlemlenebilir olur.
- Kullanıcı intent'i (niyeti) gerçek execution'dan (çalıştırmadan) ayrılır.
- Approval-required (onay gerekli) durumları timeline'da görünür olur.
- Gelecekte audit log (denetim kaydı), tracing (izleme) ve replay (yeniden oynatma)
  için temel oluşur.

## Terimler

| Terim | Türkçe anlamı | Bu modüldeki anlamı |
| --- | --- | --- |
| Event | Olay | Agent akışında gerçekleşen tek kayıt |
| State | Durum | Event'lerden türetilen mevcut oturum hali |
| Session | Oturum | Seçili incident için agent çalışma bağlamı |
| Timeline | Zaman çizelgesi | Event'lerin kullanıcıya okunabilir sırayla gösterilmesi |
| Intent | Niyet | Kullanıcı bir aksiyon kartını seçti ama işlem henüz yapılmadı |
| Reducer | Durum dönüştürücü | Eski state + event -> yeni state üreten saf fonksiyon |
| Message | Mesaj | Kullanıcıya veya sisteme gösterilebilir konuşma kaydı |
| Trace | İz | Bir davranışın adım adım takip edilebilir kaydı |
| Deterministic | Belirlenimci | Aynı event sırası aynı state'i üretir |

## Eklenen kodlar

### `agent-session-state.ts`

Genel ve taşınabilir Agent state modelidir.

Ana tipler:

- `AgentEvent`: Agent akışındaki tek olay.
- `AgentSessionState`: Oturumun mevcut durumu.
- `AgentMessage`: Kullanıcıya gösterilebilir mesaj.
- `AgentSessionStatus`: `idle`, `active`, `awaiting-approval`, `completed`, `error`.

Ana fonksiyonlar:

- `createInitialAgentSessionState`: Boş oturum oluşturur.
- `createAgentSessionStateFromSnapshot`: Snapshot'tan event timeline üretir.
- `createAgentCardSelectedEvent`: Kullanıcı kart seçince intent event'i üretir.
- `reduceAgentEvent`: Event'leri state'e dönüştürür.

## Zihinsel model

Bunu kargo takibi gibi düşünebilirsin:

```text
Paket oluşturuldu
    ↓
Depoya girdi
    ↓
Kargoya verildi
    ↓
Teslimat bekliyor
```

Agent tarafında da benzer:

```text
Session started
    ↓
Context loaded
    ↓
Action card proposed
    ↓
Approval required
    ↓
Action selected
```

Bu sayede "şu an neden approval bekliyoruz?" sorusuna timeline üzerinden cevap veririz.

## UI sonucu

Operations assistant panelinde artık `Event timeline` alanı var.

Burada son event'ler görünür:

- session-started
- context-loaded
- action-card-proposed
- approval-required
- action-card-selected

Bir action card butonuna basınca event timeline'a yeni bir intent kaydı eklenir.

## Güvenlik sınırı

Bu modülde de gerçek sistem mutation (veri değişikliği) yapılmaz.

Action card seçimi:

```text
event üretir
state'i günceller
timeline'da görünür
ama repository save çalıştırmaz
```

Bu ayrım kurumsal AI sistemleri için zorunludur.

## Şirkette nasıl anlatılır?

Kısa anlatım:

> Agentic UI panelini sadece kart gösteren bir component olarak bırakmadım. Agent
> davranışını event-sourced bir timeline'a bağladım. Böylece kullanıcı intent'i,
> approval ihtiyacı ve agent önerileri test edilebilir, gözlemlenebilir ve ileride
> audit log'a taşınabilir hale geldi.

## Mülakat soruları

### Event ile state arasındaki fark nedir?

Event geçmişte olan tek kayıttır. State ise bu event'lerin sonucunda sistemin şu
anki halidir.

### Intent neden execution değildir?

Intent kullanıcının yapmak istediği şeyi temsil eder. Execution ise sistemin
gerçek veri değişikliğini yapmasıdır. Kurumsal sistemde araya authorization,
approval ve audit log girer.

### Reducer neden önemlidir?

Reducer saf fonksiyondur. Aynı state ve aynı event verilirse aynı sonucu üretir.
Bu da test etmeyi ve debug etmeyi kolaylaştırır.

### Agent timeline neden gerekir?

Çünkü AI/agent davranışının açıklanabilir olması gerekir. Timeline olmadan "hangi
öneri ne zaman, hangi veriyle, hangi kullanıcı aksiyonuyla oluştu?" sorusuna cevap
vermek zorlaşır.
