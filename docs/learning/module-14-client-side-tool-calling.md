# Modül 14 - Client-side Tool Calling

Durum: Uygulandı  
Tarih: 2026-07-07  
Referans: Agentic UI with Angular, AG-UI tool/event yaklaşımı, OpenAI Agents tool-use yaklaşımı

## Amaç

Bu modülün amacı, agent'ın Angular uygulaması içinde kullanabileceği güvenli
client-side tools (istemci tarafı araçlar) kurmaktır.

Burada tool (araç), agent'a verilen sınırlı ve isimlendirilmiş yetenektir.
Örneğin:

- seçili incident'ı oku,
- ekrandaki queue özetini çıkar,
- hangi aksiyonların approval istediğini kontrol et.

## Hangi problemi çözer?

Agent sadece text (metin) üretirse bağlamı zayıf kalır. Ama her şeyi doğrudan
çalıştırmasına izin verilirse güvenlik riski doğar.

Client-side tool calling bu ikisi arasında kontrollü bir sınır kurar:

```text
Agent bir aracı çağırır
    ↓
Araç sadece izinli UI/state bilgisini okur
    ↓
Sonuç typed result olarak döner
    ↓
Timeline'a tool event yazılır
    ↓
Gerçek mutation yapılmaz
```

## Terimler

| Terim | Türkçe anlamı | Bu modüldeki anlamı |
| --- | --- | --- |
| Tool | Araç | Agent'ın çağırmasına izin verilen sınırlı yetenek |
| Client-side tool | İstemci tarafı araç | Angular/browser içinde çalışan araç |
| Tool definition | Araç tanımı | Aracın adı, açıklaması, nerede çalıştığı ve yetkisi |
| Tool result | Araç sonucu | Aracın döndürdüğü typed ve okunabilir çıktı |
| Read-only | Sadece okuma | Veri değiştirmeyen güvenli araç |
| Permission | İzin | Aracın ne yapabileceğini belirleyen sınır |
| Mutation | Veri değişikliği | Sistemde kalıcı veya iş akışını değiştiren işlem |
| Tool boundary | Araç sınırı | Aracın yapmasına izin verilen/yasaklanan davranış |

## Eklenen araçlar

### 1. `read-selected-incident`

Seçili incident context'ini okur:

- title,
- asset,
- severity,
- priority,
- status.

### 2. `summarize-visible-queue`

Browser'da yüklü incident listesini özetler:

- görünür incident sayısı,
- critical open sayısı,
- in progress sayısı,
- acknowledged sayısı.

### 3. `inspect-approval-boundary`

Action card'lar içindeki approval sınırını inceler:

- kaç kart insan onayı istiyor,
- hangi kartlar onay istiyor,
- client-side tool'ların mutation yapamayacağını belirtir.

## Kod akışı

```text
Run client tools button
    ↓
runClientTools()
    ↓
buildIncidentClientToolResults()
    ↓
AgentToolResult[]
    ↓
createAgentToolEvents()
    ↓
tool-called / tool-result-received timeline events
```

## Güvenlik sınırı

Bu modülde araçlar yalnızca read-only çalışır.

Yapabilir:

- Angular state okuyabilir.
- Seçili incident bilgisini özetleyebilir.
- Approval gereksinimini açıklayabilir.
- Timeline'a kanıt yazabilir.

Yapamaz:

- Incident status değiştiremez.
- Work order oluşturamaz.
- Backend'e mutation gönderemez.
- API key veya secret okuyamaz.
- Authorization yerine geçemez.

## Şirkette nasıl anlatılır?

> Agent'a doğrudan sistem yetkisi vermek yerine client-side read-only tool
> boundary kurdum. Araçlar sadece Angular state'i okuyor, typed result döndürüyor
> ve timeline'a tool-called/tool-result-received event'leri yazıyor. Böylece agent
> bağlamı zenginleşiyor ama mutation yetkisi backend authorization ve approval
> hattına bırakılıyor.

## Mülakat soruları

### Client-side tool ile server-side tool farkı nedir?

Client-side tool browser/Angular tarafında çalışır ve genellikle UI state, seçili
kayıt, filtreler veya tarayıcı yetenekleri gibi sınırlı bilgileri okur. Server-side
tool backend tarafında çalışır ve database, authorization, audit log veya harici
sistemlerle konuşabilir.

### Neden tool'ları read-only başlattık?

Çünkü önce güvenli gözlem hattı kurulmalıdır. Agent'ın bağlamı okuyabilmesi ile
sistemi değiştirebilmesi farklı yetki seviyeleridir.

### Tool result neden typed olmalı?

Çünkü UI ve testler result shape'ini bilmelidir. Serbest metinle çalışırsak
güvenlik, rendering ve test edilebilirlik zayıflar.

### Tool event neden timeline'a yazılıyor?

Agent'ın hangi aracı ne zaman çağırdığı ve ne sonuç aldığı izlenebilir olmalıdır.
Bu, debugging ve audit için gereklidir.
