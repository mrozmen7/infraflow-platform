# Feature Specification: Incident Acknowledgement

## Belge kontrolü

| Alan | Değer |
|---|---|
| Kimlik | `INC-ACK-001` |
| Durum | Implemented baseline — evidence review required |
| Owner | InfraFlow Operations Frontend |
| Son güncelleme | 2026-07-06 |
| Risk seviyesi | Medium |

## 1. Problem

Yeni bildirilen bir Incident (operasyonel olay) listede görünse bile hiçbir operatörün olayı
gördüğü ve ilk sorumluluğu aldığı anlaşılmayabilir. Bu belirsizlik aynı olay için gereksiz
iletişime veya müdahalenin sahipsiz kalmasına neden olur.

## 2. Hedef sonuç

Operator (operatör), `Open` durumundaki Incident'ın alındığını tek bir açık eylemle
bildirebilir. Başarılı işlem sonunda bütün görünür kopyalar `Acknowledged` durumunu gösterir;
başarısız işlem kullanıcıyı yanlış state (durum) ile bırakmaz.

## 3. Actor ve stakeholder

- Primary actor: Operator.
- Stakeholder: Team Manager ve diğer operasyon kullanıcıları.
- Future authority: Spring Boot authorization ve audit servisi.

## 4. Kapsam

### In scope

- `Open → Acknowledged` geçişi.
- Liste ve inspector üzerinden aynı komutun başlatılması.
- Pending (işlem sürüyor), success (başarılı) ve failure (başarısız) geri bildirimi.
- Başarısız persistence işleminde önceki state'e rollback (geri alma).
- Klavye ile çalışabilen native button ve erişilebilir durum bildirimi.

### Out of scope

- Gerçek kullanıcı kimliği ve rol doğrulaması.
- Kalıcı audit trail.
- Incident atama, Work Order oluşturma veya Incident çözme.
- Spring Boot ve gerçek HTTP entegrasyonu.
- Birden fazla operatör arasındaki server-side concurrency kontrolü.

Out of scope maddeleri ürün gereksinimi olmadığı anlamına gelmez; mevcut frontend eğitim
baseline'ının güven sınırını açıklar.

## 5. Gereksinimler

### Functional requirements

- `FR-001` — Yalnız `Open` Incident için Acknowledge eylemi sunulmalıdır.
- `FR-002` — Eylem liste satırı ve seçili Incident inspector üzerinden aynı domain komutuna
  ulaşmalıdır.
- `FR-003` — İstek sürerken aynı komut tekrar gönderilememeli ve pending durumu görünmelidir.
- `FR-004` — Başarılı işlem sonunda Incident durumu bütün görünür alanlarda `Acknowledged`
  olmalıdır.
- `FR-005` — Persistence başarısız olduğunda önceki `Open` durumu geri yüklenmeli ve kullanıcı
  başarısızlık mesajı almalıdır.

### Business rules

- `BR-001` — Geçerli tek acknowledgement geçişi `Open → Acknowledged` biçimindedir.
- `BR-002` — Acknowledgement, Incident'ı `Resolved` veya `Closed` yapmaz.
- `BR-003` — Frontend eğitim adapter'ı aynı anda en fazla bir acknowledgement isteği yürütür.
- `BR-004` — Frontend'de düğmenin gizlenmesi authorization değildir; gerçek yetki backend
  tarafından uygulanmalıdır.

### Non-functional requirements

- `NFR-001` — Eylem native button ile klavye üzerinden kullanılabilmelidir.
- `NFR-002` — Pending ve sonuç mesajları screen reader tarafından algılanabilmelidir.
- `NFR-003` — UI, hata durumunda optimistic state'i kalıcı gerçekmiş gibi göstermemelidir.
- `NFR-004` — Domain geçiş kuralı Angular veya repository ayrıntısına bağımlı olmamalıdır.

## 6. Veri ve sözleşme etkisi

- Domain: `Incident.status` değeri `Open` durumundan `Acknowledged` durumuna geçer.
- Application: Use case Incident'ı repository'den bulur, domain politikasını uygular ve
  port üzerinden kaydeder.
- UI: Card ve Inspector yalnız kullanıcı niyetini output olarak üst katmana gönderir.
- Audit: Mevcut mock adapter'da yoktur; backend aşamasında actor, timestamp ve reason ile
  zorunlu hâle gelecektir.

## 7. Hata ve eşzamanlılık davranışı

- Incident bulunamazsa hiçbir collection state'i değiştirilmez.
- Incident `Open` değilse domain policy geçişi reddeder.
- Save başarısızsa optimistic `Acknowledged` değeri `Open` değerine geri alınır.
- Bir istek sürerken ikinci acknowledgement komutu frontend store tarafından reddedilir.
- Hata, teknik exception metnini kullanıcıya sızdırmadan anlaşılır operasyon mesajı üretir.

## 8. Acceptance Criteria

### `AC-001` — Başarılı acknowledgement

```gherkin
Given listede Open durumunda bir Incident vardır
When operatör Acknowledge eylemini başlatır
Then işlem sürerken kontrol disabled olur ve pending mesajı görünür
And kayıt başarılı olduğunda Incident durumu Acknowledged olur
And pending durumu temizlenir.
```

### `AC-002` — Geçersiz durumdan geçiş

```gherkin
Given Incident durumu Acknowledged, In Progress veya Resolved durumlarından biridir
When ekran Incident'ı gösterir
Then Acknowledge eylemi sunulmaz
And domain fonksiyonu doğrudan çağrılsa bile geçişi reddeder.
```

### `AC-003` — Persistence hatasında rollback

```gherkin
Given Open Incident için acknowledgement başlatılmıştır
When repository save işlemi başarısız olur
Then Incident tekrar Open durumunu gösterir
And pending işareti temizlenir
And kullanıcıya işlemin tamamlanamadığı bildirilir.
```

### `AC-004` — Tek state kaynağı

```gherkin
Given aynı Incident listede ve inspector panelinde görünür
When acknowledgement başarıyla tamamlanır
Then iki görünüm de aynı Acknowledged state'ini gösterir.
```

### `AC-005` — Erişilebilir kullanım

```gherkin
Given klavye veya screen reader kullanan bir operatör vardır
When operatör Acknowledge düğmesini etkinleştirir
Then düğme native keyboard davranışını korur
And pending ve sonuç bilgisi erişilebilir canlı bölgede duyurulabilir.
```

## 9. Varsayımlar ve riskler

- Mock repository tek browser session'ını temsil eder; gerçek çok kullanıcılı tutarlılık
  sağlamaz.
- “Operator” mesajı gerçek actor identity kanıtı değildir.
- Backend entegrasyonunda idempotency, authorization, optimistic locking ve audit ayrı
  zorunlu kriterlere dönüşmelidir.
- Ana risk, optimistic UI'nın başarısız kaydı gerçekmiş gibi göstermesidir; rollback ve store
  testi bu riski azaltır.

## 10. Evidence map

| Kriter | Kanıt | Durum |
|---|---|---|
| AC-001 | `incident-store.spec.ts`, `incident-card.spec.ts` | Otomatik test mevcut |
| AC-002 | `incident-status-policy.spec.ts`, `incident-card.spec.ts` | Otomatik test mevcut |
| AC-003 | `incident-store.spec.ts` rollback testi; Page hata mesajı production kodunda | Kısmi; Page hata testi eksik |
| AC-004 | Liste ve Inspector ortak `IncidentStore` state'ini okuyor | Kısmi; birlikte rendering testi eksik |
| AC-005 | Native button, `aria-live` ve guardrail; manuel screen reader testi | Kısmi; manuel kanıt gerekir |

Bu tablo önemli bir ayrımı görünür yapar: kodun bulunması kanıt değildir; criterion'a bağlı
test veya kontrollü doğrulama kanıttır.

Bu nedenle özellik eğitim baseline'ı olarak çalışsa da AC-003, AC-004 ve AC-005 kanıtları
tamamlanmadan production Definition of Done seviyesinde kabul edilmez. Eksik kanıt daha
sonraki kontrollü geliştirme döngüsünde test veya doğrulama görevi hâline getirilmelidir.
