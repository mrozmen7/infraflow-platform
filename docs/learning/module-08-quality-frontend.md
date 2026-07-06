# Modül 8: Kaliteli Frontend

Durum: Tamamlandı

## Amaç

InfraFlow frontend'inin yalnızca çalışan değil; erişilebilir, gözlemlenebilir,
güvenlik açısından denetlenebilir, performans sınırları olan ve CI tarafından
korunan bir uygulama hâline getirilmesidir.

## 1. Accessibility (erişilebilirlik)

Uygulama shell'i şu davranışları sağlar:

- Klavye kullanıcıları için `Skip to main content` bağlantısı bulunur.
- Her route aktivasyonundan sonra focus `main` alanına taşınır.
- Aktif navigation link'i `aria-current="page"` ile bildirilir.
- Navigation progress görseli erişilebilir isim ve durum metni taşır.
- Hareket azaltma tercihi `prefers-reduced-motion` ile korunur.
- Form ve operasyon mesajları `role`, `aria-live`, label ve error ilişkileri kullanır.

SPA (tek sayfa uygulaması) navigasyonu ekranı görsel olarak değiştirir fakat browser
focus'unu otomatik taşımaz. Route activation sonrası focus yönetimi, ekran okuyucu ve
klavye kullanıcılarının yeni içeriğin başladığı yeri anlamasını sağlar.

## 2. Error observability (hata gözlemlenebilirliği)

İki farklı hata türü ayrılır:

- Expected error (beklenen hata): Network, validation veya create hatasıdır; çağrının
  yapıldığı Store/Page/Form katmanında ele alınır ve kullanıcıya recovery sunulur.
- Unexpected error (beklenmeyen hata): Framework lifecycle veya yakalanmamış promise
  hatasıdır; global `ErrorHandler` tarafından reporter'a gönderilir.

`GlobalErrorHandler`, hata adı, mesaj, stack, route ve zaman bilgisini raporlar. Bilinmeyen
nesnelerin tamamını loglamaz; böylece kullanıcı formu veya hassas payload yanlışlıkla
telemetry'ye taşınmaz. Bugünkü console reporter ileride Sentry, OpenTelemetry veya şirket
log servisi adapter'ıyla değiştirilebilir.

## 3. Security guardrails (güvenlik korumaları)

Production build için Angular `autoCsp` etkinleştirildi. Derlenen `index.html`, script
hash'leri bulunan Content Security Policy üretir; object kaynaklarını kapatır ve base URI'yi
same-origin ile sınırlar.

Statik guardrail script'i şu kalıpları CI'da reddeder:

- `[innerHTML]` ve doğrudan `.innerHTML` kullanımı.
- `bypassSecurityTrust*` API'leri.
- `eval()` ve `new Function()`.
- Production uygulama kodundaki debug console çağrıları.
- `type` tanımlamayan button'lar.
- `alt` tanımlamayan image'lar.
- `rel="noopener"` olmadan yeni sekme açan linkler.
- `div` veya `span` üzerine click handler ekleyerek sahte button üretmek.

CSP tek başına authentication veya authorization sağlamaz. Spring Boot aşamasında HTTP
response header'ları, Trusted Types, backend yetkilendirmesi ve audit log ayrıca kurulacaktır.

## 4. Performance budgets (performans sınırları)

Angular production build şu sınırları uygular:

| Paket | Warning | Error | Modül 8 sonucu |
|---|---:|---:|---:|
| Initial bundle | 330 kB | 380 kB | 304.01 kB |
| Incident create lazy bundle | 85 kB | 100 kB | 76.10 kB |
| Her component style | 4 kB | 8 kB | Başarılı |

Warning geliştiriciyi uyarır; Error build'i durdurur. Böylece bundle büyümesi code review'da
gözden kaçsa bile CI tarafından yakalanır.

## 5. Quality gate (kalite kapısı)

`npm run quality` şu sırayı uygular:

```text
architecture boundaries
        ↓
security/accessibility guardrails
        ↓
unit ve integration testleri
        ↓
production build + CSP + bundle budgets
```

GitHub Actions aynı kontrolleri temiz bir makinede `npm ci` ile çalıştırır. Yerel makinede
başarılı olan fakat lock file, Node sürümü veya temiz kurulum nedeniyle CI'da bozulan kod bu
sayede yakalanır.

## Final kanıt

- 56 TypeScript dosyasında architecture check başarılı.
- 64 source dosyasında frontend guardrails başarılı.
- 18/18 test dosyası ve 54/54 test başarılı.
- Production build başarılı.
- Initial bundle 304.01 kB; error budget altında.
- Incident create lazy bundle 76.10 kB; error budget altında.
- Production `index.html` içerisinde otomatik CSP doğrulandı.

## Kaynaklar

- Angular accessibility: https://angular.dev/best-practices/a11y
- Angular error handling: https://angular.dev/best-practices/error-handling
- Angular security: https://angular.dev/best-practices/security
- Angular build budgets: https://angular.dev/tools/cli/build
