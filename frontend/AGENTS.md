# InfraFlow Frontend Agent Rules

## Kapsam

Bu dosya `frontend/` ağacı için Angular'a özel nested instruction (alt klasör talimatı)
sağlar. Repository kökündeki `AGENTS.md` kuralları da geçerlidir. Codex repository
kökünden başlatıldıysa, frontend dosyası değiştirilmeden önce bu dosya açıkça okunur.

## Teknoloji tabanı

- Angular 22, standalone component (NgModule gerektirmeyen bağımsız bileşen), zoneless
  change detection (Zone.js olmadan değişiklik algılama), strict TypeScript ve strict
  template kontrollerini koru.
- Yeni state (uygulama durumu) için önce yerel `signal`, türetilmiş değer için `computed`,
  dış olay akışları için gerektiğinde RxJS kullan.
- Route seviyesindeki feature'ları lazy loading (ihtiyaç anında yükleme) ile ayır.
- Yeni production dependency eklemeden önce gereksinimi ve mevcut alternatifi göster,
  sonra kullanıcı onayı al.

## Mimari bağımlılık yönü

```text
UI / Pages / State
        ↓
Application / Use Cases / Ports
        ↓
Domain

Infrastructure ── implements ──> Application Port
```

- `domain/`, Angular, HTTP, Router, browser veya infrastructure ayrıntısı bilmez.
- `application/`, domain ve port'ları bilir; UI ve somut adapter bilmez.
- `infrastructure/`, application port'unu uygular.
- `pages/`, orchestration (akışı koordine etme) ve state sahipliğini yönetir.
- `ui/`, veri gösterir ve kullanıcı niyetini typed output ile dışarı verir; repository
  çağrısı yapmaz.
- `shared/`, hiçbir feature'a veya `core/`a bağımlı olmaz.
- `core/`, feature'a bağımlı olmaz.
- Feature dışından Incidents alanına yalnız `public-api.ts` veya route girişinden eriş.

Bu sınırlar `npm run test:architecture` ile otomatik korunur. Yeni istisna eklemek yerine
önce bağımlılık yönünü düzelt.

## Güvenlik, erişilebilirlik ve UI

- API anahtarı, token veya server secret'ını frontend'e koyma.
- Angular environment dosyası, build-time değişkeni ve browser runtime config'i public
  information (kullanıcı tarafından okunabilir bilgi) kabul edilir; secret saklama alanı
  değildir.
- Kullanıcı girdisini `[innerHTML]`, sanitizer bypass veya dinamik kod çalıştırma ile
  render etme.
- Tıklanabilir davranışta native `button` veya `a` kullan; button türünü açıkça yaz.
- Form kontrollerine erişilebilir ad, hata mesajlarına anlaşılır metin ve klavye akışına
  görünür focus sağla.
- Sadece renkle anlam aktarma; metin, ikon veya erişilebilir label ile destekle.
- Mevcut design token'ları (merkezi tasarım değerleri) kullan; feature içine rastgele yeni
  renk ve ölçü sistemi kurma.

Bu kuralların otomatik bölümü `npm run test:guardrails` ile denetlenir. Otomasyonun
yakalamadığı klavye, responsive layout ve gerçek kullanıcı akışları tarayıcıda doğrulanır.

## Test standardı

- Domain ve use case davranışını hızlı unit test (birim testi) ile koru.
- Component sözleşmesinde input, output, rendering ve erişilebilir davranışı test et.
- Store testlerinde loading, success, empty, error, optimistic update ve rollback
  senaryolarını kapsa.
- Bir bug fix (hata düzeltmesi), mümkünse önce hatayı yeniden üreten regression test
  (hata geri gelirse yakalayan test) içerir.
- Implementation ayrıntısını değil, dışarıdan gözlenen davranışı test etmeyi tercih et.

## Frontend doğrulama

Tam kalite kapısı:

```bash
npm run quality
```

Hızlı teşhis için alt komutlar ayrı çalıştırılabilir; final kanıt olarak tam kalite kapısı
esastır:

```bash
npm run test:architecture
npm run test:guardrails
npm test -- --watch=false
npm run build
```

UI davranışı değiştiyse ilgili route'u masaüstü ve dar ekran genişliğinde aç; temel akışı,
klavye kullanımını, loading/empty/error durumlarını ve tarayıcı konsolunu kontrol et.
