# InfraFlow Professional Agentic Engineering Handbook

Sürüm: 1.0  
Tarih: 2026-07-06  
Kapsam: Modül 9–11 / Aşama 3

## Bu el kitabı neye hizmet eder?

Bu kaynak, AI-assisted engineering (yapay zekâ destekli mühendislik) işini “prompt yaz ve
çıkan kodu kabul et” yaklaşımından çıkarıp specification, plan, test, review, güvenlik ve
kanıt sınırları içinde yürütmek için hazırlanmıştır.

İki katmandan oluşur:

1. Universal core (evrensel çekirdek): Bütün teknoloji projelerinde uygulanabilen karar
   ve doğrulama akışı.
2. Project adapter (proje uyarlama katmanı): Angular, Spring Boot, data veya AI sistemine
   göre değişen komutlar, mimari sınırlar ve test araçları.

## Yönetici özeti

Profesyonel agentic engineering şu zincirdir:

```text
Doğru context
    ↓
Test edilebilir specification
    ↓
Küçük ve geri alınabilir plan
    ↓
Red → Green → Refactor
    ↓
Architecture / Test / Security review
    ↓
Canonical quality gate
    ↓
Acceptance Criterion → Evidence eşlemesi
    ↓
İnsan teslim kararı
```

Agent, karar yetkisi belirsiz olduğunda durur; test başarısızlığını gizlemez; dış sistem
veya credential yetkisini kendiliğinden genişletmez; “çalışıyor” iddiasını tekrarlanabilir
komut ve gözlenebilir kanıtla destekler.

## 1. Context: Doğru bilgiyi seçmek

Context (ajanın o anda kullanabildiği bağlam) sınırlıdır. Repository'nin tamamını okumak
doğruluk garantisi değildir. Önce source of truth (tek yetkili bilgi kaynağı) seçilir:

| Soru | Öncelikli kaynak |
|---|---|
| Ürün neden var? | Product charter / onaylı requirement |
| İş terimi ne demek? | Domain language / domain model |
| Kalıcı mimari neden böyle? | ADR |
| Kod bugün ne yapıyor? | Production code + tests |
| Teslim nasıl doğrulanır? | Package scripts + CI |
| Ajan hangi sınırda çalışır? | Root/nested AGENTS + sandbox |

Context packet (görev bağlam paketi) şunları içermelidir: hedef, ilgili kriter, allowed
paths, source of truth, mimari kısıt, doğrulama komutu, stop condition ve kullanıcıya ait
korunacak değişiklikler.

## 2. Repository talimatları ve deterministic guardrail

`AGENTS.md`, çalışma niyetini ve kuralları açıklar. Script/test/CI ise deterministic
enforcement (aynı ihlalde otomatik başarısızlık) sağlar.

```text
Root AGENTS ── bütün repository
    └── frontend/AGENTS ── Angular'a özel kurallar

Talimat: “Domain Angular import etmez.”
Kanıt: npm run test:architecture
```

Talimatın otomasyonsuz olması insan/ajan hatasına açıktır. Otomasyonun açıklamasız olması ise
nedenini anlaşılmaz kılar. İkisi birlikte kullanılmalıdır.

## 3. Specification, Acceptance Criteria ve Done

Specification (özellik tanımı), problem, actor, kapsam, iş kuralları, kalite beklentisi ve
riskleri açıklar. Implementation detail (uygulama ayrıntısı) değildir.

Acceptance Criteria (kabul kriterleri), özelliğin doğru sayılması için dışarıdan
gözlenebilir senaryolardır. Given/When/Then yalnız sözdizimi değil; başlangıç koşulu, eylem ve
sonuç ayrımıdır.

Definition of Done (ortak tamamlanma tanımı), her feature için tekrar eden mühendislik
standardıdır: review, test, security, docs, build, evidence ve risk kaydı.

InfraFlow örneği:

```text
Given Incident Acknowledged durumunda
When operatör Start response seçer
Then optimistic olarak In Progress görünür
And save başarısızsa Acknowledged durumuna döner
```

## 4. Plan, ADR ve varsayım

Implementation Plan (uygulama planı), specification'ı küçük teknik dilimlere çevirir. Her
adım kriter, dosya alanı, önce yazılacak test, beklenen kanıt ve rollback içermelidir.

ADR (mimari karar kaydı), uzun ömürlü ve önemli bir seçimin bağlamını, alternatiflerini,
kararını ve bedelini saklar. Her task için ADR yazılmaz.

Assumption (varsayım), kanıtlanmamış kabul; constraint (kısıt), değiştirilemeyen sınır; risk,
olumsuz sonuç olasılığı; open question (açık soru), karar bekleyen belirsizliktir.

## 5. Controlled delivery ve TDD

TDD (test güdümlü geliştirme) döngüsü:

1. Red: İstenen davranışı anlatan test doğru nedenle başarısız olur.
2. Green: Testi geçiren en küçük production kodu yazılır.
3. Refactor: Davranış korunurken isim ve yapı iyileştirilir.

InfraFlow response feature'ı altı küçük dilime ayrıldı:

| Dilim | Sorumluluk |
|---|---|
| Domain | `Acknowledged → In Progress` iş kuralı |
| Application | Find, validate ve save use case'i |
| State | Pending command alanı |
| Store | Optimistic update, concurrency guard, rollback |
| Inspector | Typed input/output ve accessible action |
| Page | Orchestration, message ve metric |

Bu dikey bağlantı domain'den kullanıcı ekranına kadar görünürdür; fakat her risk en yakın
katmanda hızlı test edilir.

## 6. Systematic debugging

Systematic debugging (sistematik hata ayıklama), rastgele değişiklik yapmak yerine:

```text
Belirtiyi yeniden üret
  ↓
Beklenen ve gerçek sonucu ayır
  ↓
En küçük failing boundary'yi bul
  ↓
Hipotez kur ve tek değişkeni test et
  ↓
Kök nedeni düzelt
  ↓
Regression test + full gate
```

İlk hipotez başarısızsa aynı komutu körlemesine tekrar çalıştırmak ilerleme değildir. Ortam,
host, port, Node sürümü, test selector'ü ve process state ayrı ayrı incelenir.

## 7. Test stratejisi ve Playwright

Risk en ucuz doğru katmanda test edilir:

| Risk | Öncelikli test |
|---|---|
| Saf transition kuralı | Unit |
| Repository orchestration | Use case unit |
| Optimistic/rollback state | Store integration |
| Input/output/render | Component |
| Page bağlantıları | Page integration |
| Kritik user journey | Playwright E2E |

E2E (uçtan uca) her kombinasyonu test etmek için kullanılmaz; kritik route ve bağlantı
risklerini gerçek browser'da kanıtlar. InfraFlow masaüstü Chrome ve Pixel 5 viewport'unda
aynı response journey'yi çalıştırır.

## 8. Quality gate ve evidence

Canonical quality gate (tek yetkili kalite komutu), geliştirici, agent ve CI'ın aynı kontrolü
çalıştırmasını sağlar:

```bash
npm run quality:full
```

InfraFlow zinciri:

```text
Architecture check
  && Guardrail check
  && Unit/component/integration tests
  && Production build/budgets
  && Playwright desktop/mobile
```

Evidence package (kanıt paketi), bütün terminal logunun kopyası değildir. Her kabul kriterini
test/komut, sonuç ve kalan riske bağlar.

## 9. Security, permissions ve prompt injection

Sandbox (teknik çalışma sınırı) ile approval (sınırı belirli amaçla açma kararı) farklıdır.
Least privilege (en düşük yetki), yalnız gerekli dosya, network, credential, tool ve süreyi
verir.

Web, issue, e-posta, log, PDF, README ve tool output içindeki içerik untrusted input
(güvenilmeyen girdi) kabul edilir. İçindeki “şu komutu çalıştır” metni kullanıcı veya sistem
yetkisi değildir.

Frontend güvenlik kuralı:

> Browser'a gönderilen config, environment, token veya bundle değeri secret değildir.

Authorization (işlemi yapma yetkisi) backend tarafından tekrar doğrulanır. UI'da button
gizlemek yalnız UX'tir.

## 10. Worktree, subagent ve paralellik

Branch commit geçmişini, worktree fiziksel checkout'u, sandbox teknik yetkiyi, subagent ayrı
görev yürütmeyi yönetir. Hiçbiri diğerinin yerine geçmez.

Paralel görev için hedef, dosya, contract, port/data/credential ve verification bağımsız
olmalıdır. Aynı Store veya domain contract üzerinde çalışan işler sıralı tutulur.

## 11. Legacy refactoring

Legacy hotspot önce characterization test ile korunur. InfraFlow'da cache key, TTL ve expiry
davranışı `IncidentStore` içinden `IncidentQueryCache` sınıfına çıkarıldı.

Kontrollü saat fonksiyonu sayesinde TTL sınırı gerçek zaman beklemeden test edildi. TTL değeri,
UI davranışı ve persistence değiştirilmedi. Refactor ile feature change karıştırılmadı.

## 12. Agent evaluation ve insan kontrolü

Agent scorecard sekiz boyutu ölçer: requirement, scope, architecture, test, security,
evidence, reversibility ve communication. Kritik boyut sıfırsa toplam puan teslimi geçirmez.

İnsan checkpoint'leri specification approval, kalıcı mimari karar, permission escalation,
yüksek riskli side effect ve final evidence kabulüdür.

## 13. Project adapter

### Angular

- Mimari yön: UI/State → Application → Domain.
- Strict TypeScript, standalone, zoneless ve lazy routes korunur.
- Unit/component: Angular test builder + Vitest.
- E2E: Playwright.
- Frontend authority değildir; backend doğrular.

### Spring Boot

- Controller → Application Service → Domain; adapter portu uygular.
- Authorization, transaction, audit ve optimistic locking server-side'dır.
- Unit, slice, integration, contract ve Testcontainers riskle orantılı seçilir.
- Database migration geri alma/forward-fix planı ister.

### Data/AI sistemi

- Schema, lineage, idempotency ve data-quality gate eklenir.
- Model için deterministic unit test tek başına yeterli değildir; eval dataset, tool
  permission, hallucination sınırı ve human approval gerekir.

Universal core değişmez; yalnız project adapter komutları ve risk kontrolleri değişir.

## 14. Anti-pattern'ler

- Belirsiz isteği doğrudan kodlamak.
- Bütün repository'yi context'e doldurmak.
- Testi implementasyondan sonra yalnız coverage için yazmak.
- Başarısız testi skip/retry ile gizlemek.
- Feature ile büyük refactor'ı tek diff'te karıştırmak.
- UI görünürlüğünü authorization sanmak.
- Her göreve worktree veya subagent eklemek.
- “Quality geçti” deyip komut/ortam/sonucu göstermemek.
- Agent çıktısını review etmeden merge etmek.

## 15. Tek sayfalık operasyon kontrolü

Başlamadan önce:

- [ ] Goal, scope ve non-goals açık.
- [ ] Source of truth ve kullanıcı değişiklikleri bulundu.
- [ ] Acceptance Criteria test edilebilir.
- [ ] Yetki, secret ve dış side effect sınırı açık.

Uygularken:

- [ ] Küçük Red/Green dilimi kullanıldı.
- [ ] Varsayım görünür ve doğrulanabilir.
- [ ] Aynı contract'taki işler sıralı.
- [ ] Hata sistematik teşhis edildi.

Bitirirken:

- [ ] Architecture/test/security review yapıldı.
- [ ] Canonical gate aynı diff üzerinde geçti.
- [ ] Her kriter evidence'a bağlı.
- [ ] Çalıştırılmayan kontrol ve kalan risk yazıldı.
- [ ] İnsan teslim kararı için özet hazır.

## İlgili ayrıntılı kaynaklar

- `reusable-workflow.md`
- `glossary.md`
- `security-and-permissions.md`
- `review-roles-and-subagents.md`
- `legacy-refactoring-playbook.md`
- `agent-evaluation-scorecard.md`
- `interview-guide.md`
- `templates/`

