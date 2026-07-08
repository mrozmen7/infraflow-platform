# Feature Specification: Start Incident Response

## Belge kontrolü

| Alan | Değer |
|---|---|
| Kimlik | `INC-RESP-001` |
| Durum | Approved for Module 10 implementation |
| Owner | InfraFlow Operations Frontend |
| Son güncelleme | 2026-07-06 |
| Risk seviyesi | Medium |

## 1. Problem

Bir operatör Incident'ı `Acknowledged` durumuna aldığında sistem olayın görüldüğünü bilir;
fakat aktif müdahalenin başlayıp başlamadığı görünür değildir. `Acknowledged` ile
`In Progress` aynı anlamda kullanılırsa operasyon metriği ve ekip koordinasyonu güvenilmez
hâle gelir.

## 2. Hedef sonuç

Operator (operatör), seçili ve `Acknowledged` durumundaki Incident için response
(aktif operasyon müdahalesi) başlatabilir. Başarılı işlem bütün görünür state'i `In Progress`
yapar; başarısız işlem önceki `Acknowledged` state'ini geri yükler.

## 3. Actor ve stakeholder

- Primary actor: Operator.
- Stakeholder: Team Manager ve Field Technician.
- Future authority: Spring Boot authorization ve audit servisi.

## 4. Kapsam

### In scope

- `Acknowledged → In Progress` domain geçişi.
- Seçili Incident Inspector içinden response başlatma.
- Pending, success ve failure geri bildirimi.
- Optimistic update ve persistence hatasında rollback.
- `In progress` operasyon metriğinin güncel state'ten türetilmesi.
- Klavye ve screen reader için erişilebilir action state.

### Out of scope

- Kullanıcı rolü ve gerçek actor identity doğrulaması.
- Work Order oluşturma veya teknisyen atama.
- Server-side authorization, audit ve optimistic locking.
- Incident çözme/kapatma.
- Gerçek HTTP adapter.

## 5. Gereksinimler

### Functional requirements

- `FR-001` — Start response action yalnız `Acknowledged` Incident için sunulmalıdır.
- `FR-002` — Action seçili Incident Inspector içinde başlatılmalıdır.
- `FR-003` — İstek sürerken aynı response start komutu tekrar gönderilememelidir.
- `FR-004` — Başarılı persistence sonunda Incident `In Progress` olmalıdır.
- `FR-005` — Persistence başarısızsa Incident `Acknowledged` durumuna geri dönmelidir.
- `FR-006` — Başarılı geçiş, `In progress` metriğini otomatik güncellemelidir.

### Business rules

- `BR-001` — Geçerli response start geçişi yalnız `Acknowledged → In Progress` biçimindedir.
- `BR-002` — `Open`, `In Progress` ve `Resolved` Incident response start komutunu reddeder.
- `BR-003` — Response start, Incident'ı çözmez ve Work Order oluşturmaz.
- `BR-004` — Frontend action görünürlüğü authorization değildir.

### Non-functional requirements

- `NFR-001` — Action native button ile klavye üzerinden çalışmalıdır.
- `NFR-002` — Pending ve final sonuç `aria-live` üzerinden duyurulabilir olmalıdır.
- `NFR-003` — Domain policy Angular, repository veya UI import etmemelidir.
- `NFR-004` — Hata metni teknik exception ayrıntısını kullanıcıya sızdırmamalıdır.

## 6. State akışı

```text
Acknowledged
     ↓ Start response
Optimistic In Progress + pending
     ├── save success → In Progress + pending temiz
     └── save failure → Acknowledged rollback + hata mesajı
```

## 7. Acceptance Criteria

### `AC-RESP-001` — Action görünürlüğü

```gherkin
Given seçili Incident Acknowledged durumundadır
When Inspector render edilir
Then Start response action görünür ve klavye ile kullanılabilir.
```

### `AC-RESP-002` — Başarılı response start

```gherkin
Given seçili Incident Acknowledged durumundadır
When operatör Start response action'ını başlatır
Then pending control disabled görünür
And Incident optimistic olarak In Progress olur
And persistence başarılı olduğunda pending temizlenir
And In progress metriği bir artar.
```

### `AC-RESP-003` — Geçersiz transition

```gherkin
Given Incident Open, In Progress veya Resolved durumundadır
When UI veya domain response start davranışını değerlendirir
Then action gösterilmez
And domain transition isteği reddeder.
```

### `AC-RESP-004` — Persistence hatasında rollback

```gherkin
Given Acknowledged Incident için response start başlamıştır
When repository save işlemi başarısız olur
Then Incident Acknowledged durumuna geri döner
And pending state temizlenir
And kullanıcıya işlemin tamamlanamadığı bildirilir.
```

### `AC-RESP-005` — Tekrarlanan komut

```gherkin
Given bir response start isteği hâlen pending durumdadır
When ikinci response start komutu istenir
Then ikinci komut repository'ye gönderilmez.
```

## 8. Güvenlik ve güven sınırı

- Frontend yalnız UX ve optimistic state yönetir.
- Gerçek authorization ve transition doğrulaması Spring Boot tarafından tekrar uygulanmalıdır.
- Actor, timestamp ve reason audit kaydı backend aşamasında zorunludur.
- Agent veya A2UI action card gelecekte bu komutu ancak aynı server-side kurala gönderir.

## 9. Riskler

- Optimistic UI save hatasında yanlış state gösterebilir; rollback testi zorunludur.
- Acknowledgement ve response start eşzamanlı çalışırsa state çakışabilir; her command kendi
  pending state'ini korur ve backend aşamasında optimistic locking gerekir.
- Mock repository tek kullanıcı simülasyonudur; production concurrency kanıtı değildir.

## 10. Evidence map

| Kriter | Planlanan kanıt | Durum |
|---|---|---|
| AC-RESP-001 | Inspector component testi | Pass |
| AC-RESP-002 | Domain + use case + Store + Page + Playwright | Pass |
| AC-RESP-003 | Domain policy ve Inspector testi | Pass |
| AC-RESP-004 | Store rollback ve Page hata mesajı testi | Pass |
| AC-RESP-005 | Store pending-command testi | Pass |
