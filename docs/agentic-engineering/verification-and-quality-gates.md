# Repeatable Verification ve Quality Gates

Durum: Aktif referans

## 1. Temel kavramlar

Verification (doğrulama), bir iddianın kanıtını üretme işlemidir.

```text
İddia: Domain Angular'a bağımlı değildir.
Kanıt: npm run test:architecture başarılıdır.
```

Quality Gate (kalite kapısı), değişikliğin ilerleyebilmesi için bütün zorunlu kontrollerin
geçmesi gereken karar noktasıdır.

```text
Değişiklik
    ↓
Architecture check
    ↓
Security/accessibility guardrails
    ↓
Unit ve component testleri
    ↓
Production build ve budgets
    ↓
Gerekliyse browser doğrulaması
    ↓
Teslim edilebilir / Reddedildi
```

Repeatable verification (tekrarlanabilir doğrulama), aynı commit, aynı toolchain ve aynı
komutlarla geliştirici, coding agent ve CI'ın aynı sonucu üretebilmesidir. “Bende çalıştı”
kanıt değildir; komut, ortam, exit code ve sonuç kaydedilebilir olmalıdır.

## 2. Test, check, gate ve evidence farkı

| Kavram | Türkçe anlamı | InfraFlow örneği |
|---|---|---|
| Test | Davranış testi | Incident rollback Vitest testi |
| Check | Statik/otomatik kontrol | Yasak import taraması |
| Gate | Zorunlu kontrol zinciri | `npm run quality` |
| Evidence | Sonuç kanıtı | Komut, sürüm, başarı sonucu ve browser kaydı |

Tek bir test bütün kaliteyi kanıtlamaz. Build başarılıyken iş kuralı yanlış olabilir; testler
başarılıyken mimari sınır bozulabilir; otomatik kontroller başarılıyken klavye akışı kötü
olabilir. Gate farklı riskleri birlikte kapsar.

## 3. InfraFlow canonical gate

Canonical gate (tek yetkili kalite komutu), `frontend/package.json` içindeki şudur:

```bash
npm run quality
```

Zincir fail-fast (ilk hatada duran) biçimde `&&` ile bağlıdır:

```text
test:architecture
      &&
test:guardrails
      &&
unit/component tests
      &&
production build
```

Bir adım non-zero exit code (sıfır dışı çıkış kodu) üretirse sonraki adımlar çalışmaz ve gate
başarısızdır. `|| true`, hata yutma veya başarısız testi skip etme kalite kanıtı değildir.

## 4. Local ve CI parity

Parity (eşdeğerlik), yerel final doğrulama ile CI'ın aynı canonical komutu çağırmasıdır.

```text
Developer/Codex             GitHub Actions
       │                           │
       └──── npm run quality ──────┘
                      │
              package.json script
```

Önceki workflow dört alt komutu YAML içinde tekrar yazıyordu. Bugün doğru olsa da
`package.json` değiştiğinde workflow drift (iş akışı sapması) oluşabilirdi. CI artık doğrudan
`npm run quality` çağırır. Alt komutların tek source of truth'u `package.json` olur.

CI ayrıca clean environment (temiz ortam) oluşturur:

1. Repository checkout edilir.
2. `.nvmrc` ile Node.js `24.15.0` kurulur.
3. `npm ci` ile lockfile'ın tam dependency ağacı kurulur.
4. Canonical quality gate çalışır.

## 5. Toolchain ve dependency determinism

- `.nvmrc` ve `.node-version`: Node.js `24.15.0` standardını gösterir.
- `packageManager`: npm `11.6.0` standardını bildirir.
- `package-lock.json`: tam dependency çözümünü kilitler.
- `npm ci`: lockfile'ı değiştirmeden temiz ve tekrarlanabilir kurulum yapar.

Yerel denetimde makinedeki Node.js sürümü `23.11.0`, repository standardı ise `24.15.0`
olarak bulunmuştur. Bu nedenle yanlış Node ile alınan yerel sonuç CI ile tam eşdeğer kanıt
sayılmaz. Doğru çözüm standardı düşürmek veya uyarıyı gizlemek değil; geliştirici ortamında
Node `24.15.0` kurup `nvm use` ile etkinleştirmektir. Makine toolchain kurulumu repository
değişikliği değildir ve kullanıcı onayı olmadan yapılmaz.

## 6. Feedback loop ve final gate

Her kod değişikliğinde en pahalı zinciri tekrar tekrar çalıştırmak verimsiz olabilir.
İki seviye kullanılır:

### Fast feedback

Fast feedback (hızlı geri bildirim), çalışılan davranışa en yakın testi çalıştırır.

Örnek:

```text
Domain kuralı değişti → ilgili domain testi
Component değişti     → ilgili component testi
Store değişti         → store testi
```

### Final gate

Görev tamamlanmadan önce mutlaka bütün zincir çalıştırılır:

```bash
npm run quality
```

Targeted test (hedefli test) hız sağlar; full gate (tam kapı) regresyon ve sınır ihlalini
yakalar. Biri diğerinin yerine geçmez.

## 7. Değişiklik türüne göre kanıt

| Değişiklik | Yakın kanıt | Final kanıt |
|---|---|---|
| Yalnız doküman | Link, komut adı, whitespace/diff kontrolü | Doküman tutarlılığı |
| Domain kuralı | Saf unit test | `npm run quality` |
| Use case/store | Unit + hata/concurrency testi | `npm run quality` |
| Component/UI | Component testi | Quality + browser/accessibility |
| Route | Route testi ve doğrudan URL | Quality + browser refresh |
| Security kuralı | Negatif abuse case | Guardrail + quality + review |
| Build/config/CI | Script ve config doğrulaması | Temiz CI çalışması |

Browser evidence, unit testin yerine geçmez; unit test de responsive veya screen reader
deneyimini tamamen kanıtlamaz.

## 8. Flaky test ve non-determinism

Flaky test (aynı kodda bazen geçen bazen kalan test) tekrar çalıştırılarak gizlenmez.
Sebepleri genellikle zaman, rastgelelik, paylaşılan state, ağ, locale veya yarış durumudur.

Profesyonel yaklaşım:

1. Hata çıktısını sakla.
2. Testi izole yeniden üret.
3. Saat, random, network veya shared state'i kontrol altına al.
4. Kök nedeni düzelt.
5. Tekrar çalıştırma sayısını başarı kanıtı gibi sunma.

## 9. Evidence package

Evidence Package (kanıt paketi) bütün logu kopyalamak değildir. Kararı destekleyen kısa ve
izlenebilir özet şunları içerir:

- Commit veya working tree bağlamı.
- Değişiklik özeti ve bağlı Acceptance Criteria.
- Node/npm sürümü ve kullanılan komut.
- Pass/fail sonucu ve önemli ölçüm.
- Browser veya manuel kontrol sonucu.
- Çalıştırılamayan kontrol ve kalan risk.

Ekran görüntüsü tek başına test kanıtı değildir; hangi senaryo, veri ve sonuçla üretildiği
bilinmelidir.

## 10. Başka projelere uyarlama

Quality gate kalıbı her projede standart kullanılabilir:

```text
Environment → Static checks → Tests → Build/package → Runtime smoke → Evidence
```

Alt komutlar teknolojiye göre değişir:

- Angular: architecture, guardrail, Vitest, build, browser.
- Spring Boot: formatting, unit/integration, security, migration, package, health smoke.
- AI: schema, deterministic tests, eval set, safety, tool permission, cost/latency budget.
- Infrastructure: validate, policy, plan/dry-run, deployment smoke ve rollback health.
