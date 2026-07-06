# Implementation Plan: Incident Acknowledgement Evidence Closure

## Belge kontrolü

| Alan | Değer |
|---|---|
| Plan kimliği | `PLAN-INC-ACK-001` |
| Bağlı specification | `INC-ACK-001` — `docs/specifications/incident-acknowledgement.md` |
| Durum | Ready for controlled development cycle |
| Owner | InfraFlow Operations Frontend |
| Son güncelleme | 2026-07-06 |

## 1. Goal ve non-goals

### Goal

- AC-003 için Page seviyesinde başarısız acknowledgement mesajını ve rollback sonucunu
  otomatik testle kanıtlamak.
- AC-004 için liste ve Inspector'ın aynı store güncellemesini birlikte gösterdiğini test etmek.
- AC-005'in otomatik doğrulanabilir DOM bölümünü test etmek ve manuel accessibility kanıt
  adımını tanımlamak.

### Non-goals

- Incident acknowledgement davranışını veya domain geçiş kuralını değiştirmek.
- Gerçek actor identity, backend authorization, audit veya HTTP adapter eklemek.
- UI tasarımını değiştirmek.
- Birden fazla eşzamanlı acknowledgement desteği eklemek.

## 2. Current state evidence

- Domain policy yalnız `Open → Acknowledged` geçişine izin veriyor.
- Store optimistic update, pending state ve persistence hatasında rollback uyguluyor.
- Card pending düğmesini disabled gösteriyor ve açık olmayan Incident'ta eylemi kaldırıyor.
- Page başarı ve hata için `aria-live` mesajını değiştiriyor.
- Store rollback testi var; Page hata mesajı testi yok.
- Liste ve Inspector ortak Store'u okuyor; aynı fixture içinde senkron sonuç assertion'ı yok.
- Gerçek screen reader doğrulaması henüz kaydedilmedi.

## 3. Etkilenen sınırlar

| Sınır | Etki | İzin verilen değişiklik |
|---|---|---|
| Domain | None | Değişiklik yok |
| Application | None | Değişiklik yok |
| Infrastructure | Low | Yalnız test fake davranışı gerekiyorsa |
| State | Low | Öncelikle test; gerçek bug kanıtlanırsa ayrı onaylı düzeltme |
| UI/Page | Low | Component testleri; davranış değişikliği plan dışı |
| Contract/backend | None | Değişiklik yok |

## 4. Constraints ve ilgili ADR'ler

- ADR 0002: UI repository portuna bağlı kalmalıdır.
- ADR 0003: Page/UI infrastructure adapter'ını doğrudan import etmemelidir.
- `frontend/AGENTS.md`: strict, architecture, accessibility ve tam quality gate korunmalıdır.
- Yeni ADR gerekmez; plan mevcut mimariyi değiştirmeden eksik kanıtı tamamlar.

## 5. Assumption log

| ID | Varsayım | Yanlışsa etki | Doğrulama | Durum |
|---|---|---|---|---|
| A-001 | Page test fake repository'si save hatası üretecek şekilde kontrol edilebilir | Test fixture küçükçe genişletilir | Test doubles incelendi | Validated |
| A-002 | Liste ve Inspector aynı Page fixture içinde birlikte render edilir | Ayrı integration host gerekir | Page template ve mevcut test incelendi | Validated |
| A-003 | Screen reader deneyimi yalnız unit test ile tam kanıtlanamaz | Manuel veya browser accessibility adımı gerekir | Test sınırı analizi | Validated |
| A-004 | Yeni production davranışı gerekmeyecek | Plan kapsamı büyür | Önce başarısız testleri çalıştır | Open |

## 6. Uygulama adımları

### Adım 0 — Baseline kanıtı

- Mevcut ilgili testleri çalıştır ve sonucu kaydet.
- `git status` ile kullanıcı değişikliklerini tekrar kontrol et.
- Beklenen kanıt: Başlangıç testleri yeşil; yeni kriter testleri henüz yok.

### Adım 1 — AC-003 Page failure testi

- Dosya alanı: `incident-list-page.spec.ts`.
- Test fake repository'ye kontrollü save failure modu ekle.
- Acknowledge eylemini başlat; hata sonrasında Page canlı mesajını ve Incident'ın `Open`
  durumuna döndüğünü assert et.
- Production kodu yalnız test gerçek davranış hatası ortaya çıkarırsa ayrı küçük diff'te değiştir.
- Rollback: Test fixture değişikliğini geri al; domain/store koduna dokunma.

### Adım 2 — AC-004 ortak state rendering testi

- Dosya alanı: `incident-list-page.spec.ts` ve gerekirse test helper.
- Aynı Incident'ı listede seçip Inspector'da göster.
- Acknowledge sonrasında hem liste satırında hem Inspector'da `Acknowledged` sonucunu assert et.
- Beklenen kanıt: İki UI alanı aynı store state'inden tutarlı sonuç üretir.

### Adım 3 — AC-005 erişilebilirlik kanıtı

- Otomatik testte düğmenin native `button`, pending durumda disabled ve sonuç mesajının
  `aria-live="polite"` olduğunu doğrula.
- Tarayıcıda yalnız klavye ile akışı çalıştır.
- Screen reader ile pending ve final mesajının duyurulduğunu manuel evidence notuna kaydet.
- Otomatik test screen reader çıktısı varmış gibi raporlanmaz.

### Adım 4 — Final doğrulama ve evidence update

- İlgili testleri çalıştır.
- `npm run quality` tam kalite kapısını çalıştır.
- Specification evidence map'ini gerçek test yolları ve sonuçlarla güncelle.
- Definition of Done kontrolünü doldur; kalan manuel riski açıkça raporla.

## 7. Verification matrix

| Kriter/risk | Kontrol | Yöntem | Beklenen sonuç |
|---|---|---|---|
| AC-003 | Component + Store | Vitest | Rollback ve Page hata mesajı kanıtlanır |
| AC-004 | Page integration | Vitest fixture | Liste ve Inspector aynı status'u gösterir |
| AC-005 otomatik bölüm | DOM/accessibility | Vitest + guardrail | Native/disabled/live region korunur |
| AC-005 gerçek deneyim | Keyboard/screen reader | Browser manual check | Mesajlar erişilebilir biçimde algılanır |
| Mimari gerileme | Architecture fitness | `npm run test:architecture` | Yasak import yok |
| Genel gerileme | Tam kalite kapısı | `npm run quality` | Bütün adımlar başarılı |

## 8. Stop ve escalation koşulları

- Test actor identity veya gerçek authorization gerektirirse dur; bu backend kapsamıdır.
- Mevcut production davranışı specification ile çelişirse kodu sessizce değiştirme; farkı
  raporla ve specification kararını doğrula.
- Yeni dependency, yeni state katmanı veya mimari sınır değişikliği gerekirse planı durdur.
- Kullanıcıya ait ilgisiz değişiklikle çakışma olursa onay almadan üzerine yazma.

## 9. Risk ve rollback

- Risk: Testin implementation ayrıntısına aşırı bağlanması.
- Koruma: Signal iç değerini değil, DOM ve public store davranışını assert etmek.
- Rollback: Her adımı ayrı küçük diff olarak tutmak; production kodunu test fixture ile
  karıştırmamak.

## 10. Completion evidence

- [ ] AC-003 Page kanıtı tamamlandı.
- [ ] AC-004 ortak rendering kanıtı tamamlandı.
- [ ] AC-005 otomatik ve manuel kanıtları ayrıldı.
- [ ] Specification evidence map güncellendi.
- [ ] `npm run quality` başarılı.
- [ ] Kalan riskler raporlandı.
