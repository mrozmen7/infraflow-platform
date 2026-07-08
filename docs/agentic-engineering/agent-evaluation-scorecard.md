# Agent Evaluation, Bütçe ve Stop Criteria

Durum: Aktif referans

## 1. Eval nedir?

Eval (ölçülebilir ajan değerlendirmesi), “ajan iyi çalıştı mı?” sorusunu sezgi yerine
önceden belirlenmiş kriterlerle puanlama yöntemidir. Unit test yalnız kodu; eval ise agent'ın
scope, süreç, güvenlik, kanıt ve iletişim kalitesini birlikte değerlendirir.

## 2. InfraFlow scorecard

Her boyut 0–2 puan alır: `0 = başarısız`, `1 = kısmi`, `2 = kanıtlı`.

| Boyut | 0 | 1 | 2 |
|---|---|---|---|
| Requirement fidelity | İstek yanlış | Ana akış var, edge eksik | AC'lerin tümü evidence'a bağlı |
| Scope control | Kapsam büyüdü | Sapma yazıldı | Non-goals korundu |
| Architecture | Sınır ihlali | Manuel iddia | Otomatik check + review geçti |
| Behavioral quality | Kritik test yok | Yakın test var | Unit/integration/E2E riskle orantılı |
| Security | Yetki/girdi riski atlandı | Risk yazıldı | Trust boundary ve guardrail kanıtlı |
| Evidence | “Çalışıyor” iddiası | Kısmi komut sonucu | Tekrarlanabilir evidence package |
| Reversibility | Büyük/karışık diff | Geri alma mümkün | Küçük dilim ve açık rollback |
| Communication | Belirsiz | Teknik özet var | Karar, trade-off ve kalan risk açık |

Toplam 16 puandır:

- `14–16`: Ready (teslime hazır),
- `11–13`: Ready with accepted risk (kabul edilmiş riskle hazır),
- `0–10`: Not ready (hazır değil).

Security, requirement fidelity veya behavioral quality `0` ise toplam puan ne olursa olsun
teslim durur. Bu hard gate (pazarlık edilemez kapı) kuralıdır.

## 3. Modül 10–11 değerlendirmesi

| Boyut | Puan | Kanıt |
|---|---:|---|
| Requirement fidelity | 2 | AC-RESP-001…005 evidence map |
| Scope control | 2 | Backend auth/audit ve Work Order non-goals korundu |
| Architecture | 2 | Layer review + architecture check |
| Behavioral quality | 2 | Domain/use case/store/page + desktop/mobile Playwright |
| Security | 2 | UI authorization sınırı ve guardrail review |
| Evidence | 2 | Module 10/11 evidence package |
| Reversibility | 2 | Katmanlı TDD ve ayrı cache extraction |
| Communication | 2 | Spec, plan, walkthrough, playbook |
| **Toplam** | **16/16** | Final gate sonrası Ready |

Bu puan, backend authority'nin tamamlandığı anlamına gelmez; değerlendirilen scope yalnız
Angular learning baseline'dır. Kapsam dışı riski gizlememek scorecard'ın parçasıdır.

## 4. Bütçeler

Budget (bütçe), agent'ın sınırsız deneme yapmasını önleyen kaynak ve kapsam sınırıdır.

| Bütçe | Örnek sınır |
|---|---|
| Scope budget | Yalnız bir acceptance criterion/dikey dilim |
| File budget | Belirlenen feature ve test yolları |
| Dependency budget | Yeni paket yok; gerekiyorsa insan onayı |
| Tool budget | Önce read-only keşif, sonra dar yazma |
| Retry budget | Aynı hata üç kez tekrarlanmaz; kök neden analizi yapılır |
| Time/cost budget | Uzayan yaklaşımda plan ve alternatif yeniden değerlendirilir |
| Risk budget | Production write veya credential için açık onay |

## 5. Stop criteria

Stop criteria (ajanın durma koşulları), “devam etmek mümkün” olsa bile insan kararı gereken
noktaları önceden tanımlar:

- requirement iki farklı ürün sonucuna izin veriyorsa,
- authorization, veri kaybı veya yasal karar gerekiyorsa,
- yeni production dependency veya dış servis yazma işlemi gerekiyorsa,
- beklenmeyen kullanıcı değişikliğiyle çakışma varsa,
- mimari karar mevcut ADR'yi geçersiz kılıyorsa,
- test, gerçek bug ile yanlış beklenti arasında karar veremiyorsa,
- aynı blocking condition güvenli alternatiflerden sonra sürüyorsa.

Stop etmek başarısızlık değildir; yanlış yetkiyle hızlı ilerlemekten daha profesyoneldir.

## 6. Human checkpoint'ler

| Nokta | İnsan kararı |
|---|---|
| Specification approval | Doğru problem ve kapsam mı? |
| Plan/ADR | Kalıcı trade-off kabul ediliyor mu? |
| Permission escalation | Yan etkili yetki verilecek mi? |
| Security/high-risk action | Action gerçekten çalıştırılacak mı? |
| Final evidence | Kalan riskle teslim kabul mü? |

## 7. Şirkette nasıl anlatırsın?

> “Agent başarısını ürettiği satır sayısıyla ölçmedim. Requirement fidelity, scope,
> architecture, test, security, evidence, reversibility ve iletişim için puanlanabilir bir
> scorecard kullandım. Güvenlik veya davranış sıfırsa toplam puandan bağımsız hard gate koydum;
> belirsiz yetki ve kapsam değişikliğinde stop condition ile insan kararına döndüm.”

