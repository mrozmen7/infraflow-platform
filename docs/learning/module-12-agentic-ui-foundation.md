# Modül 12 - Agentic UI Foundation

Durum: Uygulandı  
Tarih: 2026-07-07  
Referans: Agentic UI with Angular: Architecture & Patterns, AG-UI, MCP

## Amaç

Bu modülün amacı, InfraFlow'a gerçek bir LLM bağlamadan önce güvenli Agentic UI
(ajan destekli arayüz) temelini kurmaktır. Bu bilinçli bir karardır: kurumsal
sistemde önce contract (sözleşme), boundary (sınır), intent (niyet), approval
(onay) ve evidence (kanıt) modeli kurulur; model entegrasyonu daha sonra bu
sınırın arkasına takılır.

## Bu modül hangi problemi çözer?

Kötü yaklaşım:

- AI cevabı doğrudan component (arayüz parçası) içine yazılır.
- AI önerisi ile gerçek sistem aksiyonu birbirine karışır.
- Kritik işlemde insan onayı belirsiz kalır.
- Model değişince Angular ekranı kırılır.

Bu modülde kurduğumuz yaklaşım:

- Agentic UI contract (ajan arayüz sözleşmesi) merkezi ve genel tutuldu.
- Incident (olay) verisi adapter (uyarlayıcı) ile agent snapshot'a (ajan anlık görünümüne) çevrildi.
- UI sadece action card (aksiyon kartı) gösterdi; doğrudan veri değiştirmedi.
- Operator (operatör) kontrolü ve approval (onay) gereksinimi görünür hale geldi.

## Eklenen ana parçalar

### 1. `core/agentic/domain/agentic-ui.ts`

Genel contract (sözleşme) dosyasıdır.

Buradaki kavramlar projeden projeye taşınabilir:

- `AgentSessionSnapshot`: Ajanın ekrana vereceği güvenli anlık model.
- `AgentActionCard`: Ajanın önerdiği ama doğrudan çalıştırmadığı aksiyon kartı.
- `AgentRiskLevel`: Risk seviyesi.
- `AgentUiMode`: Arayüzün hangi güvenlik modunda çalıştığı.
- `AgentActionIntent`: Kullanıcının veya ajanın önerdiği niyet.

### 2. `build-incident-agent-snapshot.ts`

Incident (olay) domain modelini Agentic UI contract'a çevirir.

Bu dosya bir adapter'dır (uyarlayıcıdır). Angular component bilmez; HTML bilmez;
LLM bilmez. Sadece şu soruyu cevaplar:

> Bu incident için güvenli şekilde hangi asistan bağlamı ve action card'lar gösterilebilir?

### 3. `incident-agent-panel`

Sağ panelde görünen Operations assistant (operasyon asistanı) UI parçasıdır.

Şu an gerçek işlem yapmaz. Çünkü Modül 12'nin kuralı:

> Action card seçimi execution (çalıştırma) değildir; sadece intent (niyet) üretir.

Gerçek execute (çalıştırma), approval (onay), undo (geri alma) ve audit log
(denetim kaydı) sonraki modüllerde eklenecek.

## Terimler

| Terim | Türkçe anlamı | Bu projedeki anlamı |
| --- | --- | --- |
| Agentic UI | Ajan destekli arayüz | AI/ajan önerilerinin güvenli UI sözleşmesiyle ekrana bağlanması |
| Agent | Ajan | Öneri üreten yardımcı akıl; doğrudan kritik işlem yapmaz |
| Contract | Sözleşme | UI ile ajan arasındaki sabit veri şekli |
| Adapter | Uyarlayıcı | Domain verisini agent contract'a çeviren katman |
| Intent | Niyet | “Bunu yapmak istiyorum” sinyali; henüz gerçek işlem değildir |
| Action Card | Aksiyon kartı | Ajanın önerisini tıklanabilir ama kontrollü karta dönüştüren UI modeli |
| Approval | Onay | Kritik işlemden önce insan kararı |
| Guardrail | Koruma kuralı | Ajanın neyi yapamayacağını belirleyen sınır |
| Evidence | Kanıt | Önerinin hangi verilere dayandığını gösteren iz |
| Advisory only | Sadece öneri modu | Ajan önerir, operatör karar verir |
| Human-in-the-loop | Döngüde insan | Karar zincirinde insan onayının zorunlu olması |

## Kod akışı

```text
Selected Incident
    ↓
buildIncidentAgentSnapshot()
    ↓
AgentSessionSnapshot
    ↓
IncidentAgentPanel
    ↓
Action card selected
    ↓
Intent message only
```

Bu zincirde önemli olan nokta: action card seçimi repository (veri kaynağı)
çağırmaz. Yani assistant (asistan) doğrudan sistemi değiştirmez.

## Şirkette nasıl anlatılır?

Kısa anlatım:

> Agentic UI entegrasyonuna doğrudan LLM bağlayarak başlamadım. Önce frontend
> ile agent runtime arasında typed contract, action-card intent modeli ve approval
> boundary kurdum. Böylece AI önerileri UI'da görünür ama kritik sistem aksiyonu
> insan onayı ve backend authorization olmadan çalışmaz.

## Mülakat soruları

### Agentic UI neden sadece chatbot değildir?

Çünkü chatbot çoğunlukla metin alışverişidir. Agentic UI ise state (durum), tool
calling (araç çağırma), action card (aksiyon kartı), approval (onay), evidence
(kanıt) ve UI event (arayüz olayı) yönetir.

### Action card neden doğrudan repository çağırmıyor?

Çünkü action card bir intent'tir (niyettir). Gerçek mutation (veri değiştirme)
önce authorization (yetkilendirme), approval (onay), audit log (denetim kaydı)
ve rollback/undo (geri alma) kurallarından geçmelidir.

### Adapter neden component içinde yazılmadı?

Çünkü component UI sorumluluğunda kalmalıdır. Incident domain verisini agent
contract'a çevirme işi ayrı bir application adapter'dır. Bu sayede test etmek,
başka projeye taşımak ve model değiştirmek kolaylaşır.

### Bu standart her projede kullanılır mı?

Evet, kalıp olarak kullanılır. Ancak kart tipleri, risk kuralları, approval
politikası ve domain adapter her projeye göre değişir. Taşınan şey birebir koddan
çok mimari sınırdır.
