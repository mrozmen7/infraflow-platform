# Feature Specification: <Feature adı>

## Belge kontrolü

| Alan | Değer |
|---|---|
| Kimlik | `<DOMAIN-FEATURE-NNN>` |
| Durum | Draft / Review / Approved / Implemented / Superseded |
| Owner | `<sorumlu kişi veya ekip>` |
| Son güncelleme | `<YYYY-MM-DD>` |
| Risk seviyesi | Low / Medium / High / Critical |

## 1. Problem

Bugün hangi kullanıcı veya iş problemi var? Gözlenen etki nedir?

## 2. Hedef sonuç

Özellik tamamlandığında kullanıcı veya sistem açısından hangi ölçülebilir sonuç oluşur?

## 3. Actor ve stakeholder

- Primary actor (ana kullanıcı):
- Secondary actor (ikincil kullanıcı):
- Stakeholder (sonuçtan etkilenen taraf):

## 4. Kapsam

### In scope

- `<bu teslimata dahil davranış>`

### Out of scope

- `<bilinçli olarak ertelenen davranış>`

## 5. Gereksinimler

### Functional requirements

- `FR-001` — Sistem ... yapmalıdır.

### Business rules

- `BR-001` — Yalnız ... durumunda ... yapılabilir.

### Non-functional requirements

- `NFR-001` — Güvenlik / erişilebilirlik / performans beklentisi.

## 6. Veri ve sözleşme etkisi

- Domain modeli:
- API veya event sözleşmesi:
- Kalıcı veri:
- Audit trail:

## 7. Durumlar ve hata davranışı

- Loading:
- Empty:
- Success:
- Validation error:
- Permission error:
- Network/server error:
- Concurrency veya duplicate request:

## 8. Güvenlik ve gizlilik

- Authorization sahibi:
- Hassas veri:
- Trust boundary (güven sınırı):
- Kötüye kullanım senaryosu:

## 9. Acceptance Criteria

### `AC-001` — <Senaryo adı>

```gherkin
Given <başlangıç durumu>
When <kullanıcı veya sistem eylemi>
Then <gözlenebilir zorunlu sonuç>
And <varsa ek sonuç>
```

## 10. Varsayımlar, bağımlılıklar ve açık sorular

### Varsayımlar

- `<doğrulanması gereken varsayım>`

### Bağımlılıklar

- `<başka ekip, servis veya karar>`

### Açık sorular

- `<cevabı implementasyonu değiştirecek soru>`

## 11. Riskler ve geri alma

- Ana risk:
- Risk azaltma:
- Rollback (geri alma) yaklaşımı:

## 12. Evidence map

Implementation öncesinde `Planlandı`, sonrasında gerçek kanıt yolu yazılır.

| Kriter | Kanıt türü | Dosya/komut/sonuç | Durum |
|---|---|---|---|
| AC-001 | Unit / component / integration / browser | `<kanıt>` | Planlandı |
