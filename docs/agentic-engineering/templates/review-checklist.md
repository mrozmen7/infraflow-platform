# Review Checklist: <Değişiklik adı>

## Bağlam

- Specification / Acceptance Criteria:
- Plan / ADR:
- Diff veya commit:
- Review sahibi:

## Architecture review

- [ ] Bağımlılıklar izin verilen yönde.
- [ ] Domain framework/transport ayrıntısı bilmiyor.
- [ ] UI repository veya authorization sorumluluğu almıyor.
- [ ] Yeni public contract ve kalıcı karar ADR/plan ile uyumlu.
- [ ] Yeni abstraction mevcut ihtiyacı çözüyor; speculative değildir.

## Behavioral ve test review

- [ ] Happy path, failure path ve kritik edge case test edilmiş.
- [ ] Test implementation ayrıntısını değil gözlenebilir davranışı koruyor.
- [ ] Bug/refactor için regression veya characterization testi var.
- [ ] Kullanıcı akışı değiştiyse browser/E2E kanıtı var.
- [ ] Flaky, skipped veya yalnız retry ile geçen test yok.

## Security ve privacy review

- [ ] Trust boundary ve server-side authority açık.
- [ ] Secret/credential frontend, log, fixture veya evidence içine girmedi.
- [ ] Untrusted input güvenli render/validation yolundan geçiyor.
- [ ] Side effect ve privileged action insan/servis onayıyla korunuyor.
- [ ] Hata mesajı hassas teknik ayrıntı sızdırmıyor.

## Evidence ve teslim review

- [ ] Her Acceptance Criterion bir kanıta bağlı.
- [ ] Canonical quality gate aynı diff üzerinde geçti.
- [ ] Çalıştırılmayan kontrol ve kalan risk yazıldı.
- [ ] Kullanıcıya ait ilgisiz değişiklik korunmuş.
- [ ] Rollback ve takip işleri açık.

## Bulgular

| Önem | Dosya/alan | Bulgu | Önerilen düzeltme | Durum |
|---|---|---|---|---|
| Blocking / High / Medium / Low | | | | Open |

## Karar

- Sonuç: Approve / Approve with risk / Request changes
- Gerekçe:
