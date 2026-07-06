# Definition of Done

Bu şablon proje başlangıcında teknolojiye ve risk seviyesine göre uyarlanır. `N/A`
(uygulanamaz) seçeneği yalnız kısa gerekçeyle kullanılabilir.

## Product ve kapsam

- [ ] Specification onaylı ve günceldir.
- [ ] Bütün zorunlu Acceptance Criteria karşılanmıştır.
- [ ] Out of scope davranış yanlışlıkla implementasyona eklenmemiştir.
- [ ] Açık varsayımlar ve product kararları kaydedilmiştir.

## Kod ve mimari

- [ ] Değişiklik küçük, okunabilir ve tek amaçlıdır.
- [ ] Domain ve feature bağımlılık yönleri korunmuştur.
- [ ] Strict type kontrolleri gevşetilmemiştir.
- [ ] Gereksiz production dependency eklenmemiştir.
- [ ] Geçici debug kodu ve açıklamasız workaround bırakılmamıştır.

## Davranış ve test

- [ ] Normal akış test edilmiştir.
- [ ] Hata ve sınır durumları test edilmiştir.
- [ ] Concurrency, retry veya idempotency ilgiliyse test edilmiştir.
- [ ] Bug düzeltmesinde regression test eklenmiştir.
- [ ] Testler dış davranışı kanıtlar; implementation ayrıntısına gereksiz bağlanmaz.

## Güvenlik ve veri

- [ ] Authorization backend veya güvenilir server sınırında uygulanır.
- [ ] Secret, token, kişisel veri veya hassas log eklenmemiştir.
- [ ] Input validation ve output encoding riskleri değerlendirilmiştir.
- [ ] Audit gerektiren değişiklikler kim/ne/zaman/neden bilgisine bağlanmıştır.
- [ ] Destructive veya geri dönüşü zor işlem için açık kontrol noktası vardır.

## Kullanıcı deneyimi

- [ ] Loading, empty, success ve error durumları ele alınmıştır.
- [ ] Klavye ve screen reader akışı doğrulanmıştır.
- [ ] Responsive görünüm ilgili ekran boyutlarında doğrulanmıştır.
- [ ] Kullanıcıya yalnız renkle bilgi verilmemektedir.

## Doğrulama ve delivery

- [ ] Projeye özgü tam quality gate başarılıdır.
- [ ] Gerekliyse browser veya end-to-end akış kanıtı vardır.
- [ ] Build, bundle budget ve architecture guardrail sonuçları başarılıdır.
- [ ] Doküman, contract ve ADR değişiklikle tutarlıdır.
- [ ] Migration veya rollback adımı gerekiyorsa test edilmiştir.
- [ ] Çalıştırılamayan kontrol, nedeni ve kalan riskiyle raporlanmıştır.

## Review ve kanıt

- [ ] Diff ilgisiz değişiklik içermemektedir.
- [ ] Kullanıcıya ait mevcut değişiklikler korunmuştur.
- [ ] Her Acceptance Criteria bir test veya doğrulama kanıtına bağlanmıştır.
- [ ] Evidence package değişiklik özeti, komutlar, sonuçlar ve kalan riskleri içerir.
- [ ] Git veya dış sistem yazma işlemleri yalnız yetkili kişi tarafından yapılmıştır.

## Onay

| Rol | Sonuç | Kanıt/not |
|---|---|---|
| Product | Pending / Accepted / Rejected | |
| Engineering | Pending / Accepted / Rejected | |
| Security, gerekiyorsa | N/A / Pending / Accepted / Rejected | |
| Operations, gerekiyorsa | N/A / Pending / Accepted / Rejected | |
