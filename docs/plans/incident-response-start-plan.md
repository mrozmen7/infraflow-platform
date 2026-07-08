# Implementation Plan: Start Incident Response

## Belge kontrolü

| Alan | Değer |
|---|---|
| Plan kimliği | `PLAN-INC-RESP-001` |
| Specification | `INC-RESP-001` — `docs/specifications/incident-response-start.md` |
| Durum | Completed |
| Owner | InfraFlow Operations Frontend |
| Son güncelleme | 2026-07-06 |

## 1. Goal ve non-goals

Goal: `Acknowledged → In Progress` dikey dilimini test-first biçimde domain'den Inspector'a
uygulamak ve bütün kriterleri evidence ile bağlamak.

Non-goals: Backend, actor identity, authorization, audit, Work Order ve gerçek HTTP adapter.

## 2. Etkilenen sınırlar

| Sınır | Etki | Değişiklik |
|---|---|---|
| Domain | Medium | Transition policy ve test |
| Application | Medium | Use case ve test |
| Repository port | None | Mevcut find/save sözleşmesi yeterli |
| State | Medium | Pending response command, optimistic update/rollback |
| UI | Medium | Inspector input/output/action |
| Page | Low | Event orchestration ve accessible message |
| Backend/contract | None | Bilinçli kapsam dışı |

## 3. İlgili mimari kararlar

- ADR 0002: Repository erişimi port üzerinden ve route scope içinde kalır.
- ADR 0003: Domain framework-independent; UI infrastructure import etmez.
- ADR 0004: State native Signals adapter'ı içinde kalır.
- Yeni ADR gerekmez; mevcut lifecycle ve katman sınırları içinde yeni use case eklenir.

## 4. Assumption log

| ID | Varsayım | Doğrulama | Durum |
|---|---|---|---|
| A-RESP-001 | Repository `findById + save` sözleşmesi yeterli | Port ve mock incelendi | Validated |
| A-RESP-002 | Inspector action eklemek için yeni shared component gerekmez | Inspector template incelendi | Validated |
| A-RESP-003 | In-progress metric mevcut store state'inden türetilir | Page computed incelendi | Validated |
| A-RESP-004 | Backend authorization bu modülün kapsamında değildir | Product charter/ADR | Validated |

## 5. TDD adımları

### Adım 0 — Baseline

- `git status` ile kullanıcı değişikliklerini koru.
- İlgili mevcut testleri ve kalite kapısını doğrula.

### Adım 1 — Domain Red → Green

- `incident-status-policy.spec.ts` içine geçerli ve geçersiz response transition testleri ekle.
- Testi çalıştır ve yeni API olmadığı için beklenen Red sonucunu kaydet.
- `canStartIncidentResponse` ve `startIncidentResponse` saf fonksiyonlarını minimum kodla ekle.
- Domain testini Green yap; sonra isim ve hata mesajını refactor et.

### Adım 2 — Application Red → Green

- `start-incident-response.spec.ts` ile found/not-found/invalid/save davranışlarını yaz.
- Use case'i repository portu ve domain policy ile minimum biçimde uygula.
- Application public API export'unu ekle.

### Adım 3 — Store Red → Green

- State contract'a `pendingResponseStartId` ekle ve başlangıç testiyle koru.
- Store testine optimistic success, rollback ve duplicate pending senaryolarını ekle.
- Store method/computed ve cache invalidation davranışını uygula.

### Adım 4 — Inspector Red → Green

- Yeni Inspector component testini action visibility, output ve pending disabled davranışıyla yaz.
- Typed input/output ve template action'ını minimum kodla uygula.

### Adım 5 — Page integration

- Page testinde seçili Acknowledged Incident üzerinden response başlatmayı ve metric/state
  güncellemesini kanıtla.
- Page orchestration method'u, live message ve Inspector binding'lerini ekle.
- Failure testinde teknik exception yerine operasyon mesajını doğrula.

### Adım 6 — Review ve evidence

- Architecture, test ve security review checklist'lerini sırayla uygula.
- `npm run quality` çalıştır.
- Browser ve daha sonra Playwright ile gerçek akışı doğrula.
- Specification evidence map ve Module 10 evidence package'i güncelle.

## 6. Stop conditions

- Yeni repository metodu veya API contract gerekiyorsa planı durdur ve etkiyi yeniden değerlendir.
- Role/authorization kararı gerekirse frontend'de varsayma; backend aşamasına kaydet.
- Mevcut acknowledgement davranışı bozulursa yeni feature'ı ilerletmeden regression'ı düzelt.
- Kullanıcıya ait `frontend/src/index.html` değişikliğine dokunma.

## 7. Rollback

Her katman ayrı küçük diff olarak tutulur. Feature geri alınırken response start export, store
state/method ve Inspector action birlikte kaldırılır; mevcut acknowledgement akışı korunur.

## 8. Completion evidence

- [x] Domain, application, state, Store, Inspector ve Page TDD dilimleri tamamlandı.
- [x] Architecture, test ve security review tamamlandı.
- [x] Desktop ve mobile Playwright akışı geçti.
- [x] Acceptance Criteria evidence map güncellendi.
- [x] `docs/evidence/module-10-controlled-delivery.md` oluşturuldu.
