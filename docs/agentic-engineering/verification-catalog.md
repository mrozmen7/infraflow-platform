# InfraFlow Verification Catalog

Durum: Aktif komut kataloğu

## Frontend komutları

Çalışma klasörü: `frontend/`

| Amaç | Komut | Ne zaman? | Başarı kanıtı |
|---|---|---|---|
| Tam kalite kapısı | `npm run quality` | Her production/test/config görevi sonunda | Bütün alt adımlar exit code 0 |
| Browser dahil tam kapı | `npm run quality:full` | Route veya gerçek kullanıcı akışı değiştiğinde | Quality + bütün Playwright projeleri başarılı |
| Mimari sınır | `npm run test:architecture` | Import veya klasör bağımlılığı değiştiğinde | İhlal yok ve taranan dosya sayısı |
| Güvenlik/erişilebilirlik koruması | `npm run test:guardrails` | TS/HTML değiştiğinde | Yasak pattern ve temel DOM ihlali yok |
| Unit/component testleri | `npm test -- --watch=false` | Davranış değiştiğinde ve final gate'te | Bütün test dosyaları başarılı |
| Production build | `npm run build` | Build/config/dependency ve final gate'te | Budget içinde production bundle |
| Development server | `npm start` | Manuel browser incelemesinde | Route açılır; console hatası yok |
| Uçtan uca browser testi | `npm run e2e` | Kritik user journey değiştiğinde | Desktop/mobile Playwright projeleri başarılı |

## Repository/doküman kontrolleri

| Amaç | Komut/yöntem | Başarı kanıtı |
|---|---|---|
| Değişiklik görünürlüğü | `git status --short` | Bütün değişiklikler açıklanabilir |
| Whitespace kontrolü | `git diff --check` | Çıktı yok, exit code 0 |
| Kaynak bağlantıları | Dosya varlığı ve link kontrolü | Kırık yerel bağlantı yok |
| Node standardı | `.nvmrc` ve `.node-version` | İkisi de `24.15.0` |
| Dependency standardı | `package-lock.json` + `npm ci` | Lockfile değişmeden kurulum |

## Browser kontrol listesi

- Doğrudan route ve browser refresh çalışıyor.
- Loading, empty, success ve error state'leri gözleniyor.
- Ana akış yalnız klavye ile tamamlanabiliyor.
- Focus görünür ve mantıklı sırada ilerliyor.
- Dar ve geniş ekranda bilgi kaybı yok.
- Browser console'da beklenmeyen error yok.
- Erişilebilir canlı mesaj gerekiyorsa screen reader ile ayrıca doğrulanıyor.

## Kullanım kuralı

Alt komutlar teşhis ve hızlı feedback içindir. Frontend görevinin final sonucu yalnız ilgili
alt testle değil, `npm run quality`; route veya kullanıcı akışı değiştiğinde
`npm run quality:full` ve browser kanıtıyla teslim edilir.
