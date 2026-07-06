# Implementation Plan: <Değişiklik adı>

## Belge kontrolü

| Alan | Değer |
|---|---|
| Plan kimliği | `<PLAN-NNN>` |
| Bağlı specification | `<SPEC-ID ve bağlantı>` |
| Durum | Draft / Ready / In Progress / Blocked / Completed |
| Owner | `<sorumlu kişi veya ekip>` |
| Son güncelleme | `<YYYY-MM-DD>` |

## 1. Goal ve non-goals

### Goal

- `<bu plan sonunda oluşacak kanıtlanabilir sonuç>`

### Non-goals

- `<bu planda bilinçli olarak yapılmayacak değişiklik>`

## 2. Current state evidence

- Mevcut davranış:
- İlgili production dosyaları:
- Mevcut testler:
- Bilinen kanıt açığı:

## 3. Etkilenen sınırlar

| Sınır | Etki | İzin verilen değişiklik |
|---|---|---|
| Domain | None / Low / Medium / High | |
| Application | None / Low / Medium / High | |
| Infrastructure | None / Low / Medium / High | |
| State | None / Low / Medium / High | |
| UI | None / Low / Medium / High | |
| Contract/backend | None / Low / Medium / High | |

## 4. Constraints ve ilgili ADR'ler

- Constraint:
- İlgili ADR:
- Yeni ADR gerekiyor mu? Neden?

## 5. Assumption log

| ID | Varsayım | Yanlışsa etki | Doğrulama | Durum |
|---|---|---|---|---|
| A-001 | | | | Open |

## 6. Uygulama adımları

### Adım 1 — `<küçük ve tek amaçlı dilim>`

- Bağlı kriter: `AC-...`
- Dosya alanı:
- Değişiklik:
- Önce yazılacak/değişecek test:
- Beklenen kanıt:
- Rollback:

### Adım 2 — `<sonraki dilim>`

- Bağlı kriter:
- Dosya alanı:
- Değişiklik:
- Test:
- Beklenen kanıt:
- Rollback:

## 7. Verification matrix

| Kriter/risk | Kontrol | Komut veya yöntem | Beklenen sonuç |
|---|---|---|---|
| AC-001 | Unit/component/integration/browser | | |

## 8. Stop ve escalation koşulları

- `<hangi durumda agent durup insan kararı istemeli?>`
- `<hangi bulgu specification veya ADR değişikliği gerektirir?>`

## 9. Risk ve rollback

- Risk:
- Koruma:
- Geri alma:

## 10. Completion evidence

- [ ] Bütün adımlar küçük diff'lerle review edildi.
- [ ] Acceptance Criteria evidence map güncellendi.
- [ ] Definition of Done kontrol edildi.
- [ ] Tam quality gate başarılı.
- [ ] Plan sapmaları ve kalan riskler yazıldı.
