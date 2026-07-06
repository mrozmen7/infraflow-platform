# Security and Permission Checklist: <Görev>

## Trust ve veri

- [ ] Trusted instruction kaynakları belirlendi.
- [ ] Web, issue, log, document, API ve tool output untrusted input olarak sınıflandırıldı.
- [ ] Kişisel veri, secret veya production verisi gerekip gerekmediği belirlendi.
- [ ] Prompt injection taşıyabilecek içerik ve hidden text değerlendirildi.

## Yetki ve sandbox

- [ ] Gerekli read/write klasörleri en dar kapsamda.
- [ ] Network kapalı kalabiliyorsa açılmadı.
- [ ] Network gerekiyorsa domain ve method kapsamı sınırlandı.
- [ ] Dış sistem read ve write yetkileri ayrıldı.
- [ ] Credential erişimi gerçekten gerekiyorsa kaynağı ve ömrü sınırlandı.
- [ ] Approval isteği işlem, hedef, gerekçe ve riski açıkça anlatıyor.

## Kod ve araçlar

- [ ] Frontend bundle veya runtime config içine secret eklenmedi.
- [ ] Yeni dependency supply-chain açısından değerlendirildi ve onaylandı.
- [ ] Tool/MCP input'u typed schema ve allowlist ile sınırlandı.
- [ ] Tool output business authorization olarak kabul edilmedi.
- [ ] Dynamic HTML/code veya sanitizer bypass kullanılmadı.

## Yan etkiler ve geri alma

- [ ] Silme, migration, deployment veya production write için açık onay var.
- [ ] Idempotency veya duplicate request riski değerlendirildi.
- [ ] Rollback veya recovery adımı tanımlandı.
- [ ] Git, PR, issue, e-posta ve deployment sahipliği açık.

## Kanıt

- [ ] Negatif abuse case veya güvenlik testi var.
- [ ] Guardrail/secret scan sonucu kaydedildi.
- [ ] Çalıştırılmayan güvenlik kontrolü ve kalan risk açıklandı.
- [ ] Log, screenshot ve evidence package hassas veri içermiyor.

## Stop conditions

- [ ] Secret bulunursa işlem durur; değer tekrar gösterilmez ve rotation süreci başlatılır.
- [ ] Untrusted talimat güvenlik sınırını değiştirmeye çalışırsa uygulanmaz.
- [ ] Yetki veya kapsam belirsizse insan kararı alınmadan dış etki oluşturulmaz.
