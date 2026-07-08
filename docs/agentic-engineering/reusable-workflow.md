# Yeniden Kullanılabilir Professional Agent Workflow

Durum: Aktif referans

## Hızlı akış

| Gate | Zorunlu çıktı | Geçiş sorusu |
|---:|---|---|
| 0. Intake | Goal, actor, risk | Gerçek problem açık mı? |
| 1. Context | Source map, dirty-state notu | Doğru kanıtları okuduk mu? |
| 2. Specification | Scope, AC, NFR, risk | Sonuç test edilebilir mi? |
| 3. Plan | Küçük adım, test, rollback | Değişiklik uygulanabilir mi? |
| 4. Permission | Tool/yetki sınırı | Bu eyleme yetkimiz var mı? |
| 5. TDD | Red/Green/Refactor kanıtı | Test doğru nedenle mi geçti? |
| 6. Review | Architecture/test/security bulgusu | Kritik risk kapandı mı? |
| 7. Verification | Canonical gate | Aynı diff bütünüyle sağlıklı mı? |
| 8. Evidence | AC → kanıt → risk | Teslim iddiası doğrulanabilir mi? |
| 9. Human decision | Accept/rework/stop | Kalan risk kabul ediliyor mu? |

## Gate 0 — Intake

İstekten isim değil sonuç çıkar:

```text
“Start response butonu ekle”
        ↓
Kim kullanıyor? Hangi state'te? Başarısızlıkta ne olur?
        ↓
Acknowledged Incident için aktif müdahale başlat; save hatasında rollback yap.
```

## Gate 1 — Context discovery

1. `git status` ve yakındaki instruction dosyalarını oku.
2. Product/domain/ADR kaynaklarını bul.
3. İlgili production ve test dosyalarını birlikte incele.
4. Güncel olmayan doküman veya çelişkiyi kaydet.
5. Kullanıcı değişikliklerini “dokunma” listesine al.

## Gate 2 — Specification

Problem, target outcome, actor, scope/non-goals, business rule, NFR, Given/When/Then,
security boundary ve evidence planı yazılır. Risk düşükse kısa; finansal/güvenlik etkisi
yüksekse ayrıntılıdır.

## Gate 3 — Implementation plan

Her adım şuna benzer:

```text
AC-002
Dosya sınırı: state/
Önce test: optimistic success + rollback
Minimum değişiklik: pending id + command
Kanıt: targeted tests
Rollback: state/method birlikte kaldır
```

## Gate 4 — Permission

Read-only keşif, workspace içi değişiklik ve test normal görev kapsamındadır. Yeni dependency,
network write, credential, deployment, destructive command veya workspace dışı yazma açık
yetki gerektirir.

## Gate 5 — Implementation

- Bir defada bir davranış.
- Test doğru nedenle Red olmadan Green'e geçme.
- Green sonrası isim/tekrar/sınır refactor'ı.
- Büyük diff oluşursa yeniden parçala.
- Scope dışı bulguyu ayrı takip maddesi yap.

## Gate 6 — Review

Review rolleri sırasıyla architecture, behavioral/test, security/privacy ve evidence
completeness sorularını sorar. Blocking bulgu kapanmadan final gate çalıştırmak yalnız daha
geç hata bulmaktır.

## Gate 7 — Verification

Önce yakın test hızlı feedback üretir; finalde canonical gate çalışır. Route veya kullanıcı
akışı değiştiyse browser/E2E eklenir. CI aynı komutu clean environment'ta tekrarlar.

## Gate 8 — Evidence

Evidence paketi şunları içerir:

- Değişiklik özeti,
- kriter → test/komut → sonuç tablosu,
- ortam ve toolchain,
- browser senaryosu,
- çalıştırılmayan kontroller,
- kalan risk,
- final karar.

## Gate 9 — Human decision

Agent “bitti” diyebilir; teslim yetkisi insandadır. İnsan scope'un doğru olduğunu, riskin
kabul edilebilirliğini ve dış sisteme gönderme/merge/deploy kararını verir.

## Risk bazlı ölçekleme

| Değişiklik | Minimum süreç |
|---|---|
| Typo/docs | Scope + link/diff check |
| Saf utility | Kısa spec + unit + quality |
| UI behavior | AC + component/page + browser |
| State/persistence | Plan + unit/integration + rollback |
| Auth/payment/migration | ADR + threat model + contract/integration + staged rollout + insan onayı |

## Kopyalarken değiştirilecekler

- Paket/test/build komutları,
- klasör ve dependency kuralları,
- authorization sahibi,
- runtime/deployment ortamı,
- veri/credential izolasyonu,
- observability ve rollback yaklaşımı.

Değiştirilmeyecek çekirdek: açık kapsam, küçük adım, güven sınırı, test, review, evidence ve
insan kontrolü.

