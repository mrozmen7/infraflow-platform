# Aşama 1: Modern Angular Temelleri

- Durum: Tamamlandı
- Tamamlanma tarihi: 1 Temmuz 2026

## Amaç

Angular'ın modern zihinsel modelini öğrenerek InfraFlow'un ilk çalışan Incident (arıza) dikey dilimini oluşturmak. Dikey dilim; URL'den veri erişimine, kullanıcı etkileşiminden testlere kadar küçük fakat uçtan uca çalışan ürün parçasıdır.

## Modül 1 — Ürün, Alan ve Workspace Başlangıcı

Önce ürün sınırı, ortak domain dili (iş alanının ortak dili) ve geliştirme araçları kuruldu. Angular 22, strict TypeScript, standalone component, zoneless çalışma, routing, SCSS ve Vitest kararları doğrulandı. GitHub Actions kalite kapısı oluşturuldu.

Kanıtlar:

- `docs/product/product-charter.md`
- `docs/domain/domain-language.md`
- `docs/learning/module-01-workspace.md`
- `.github/workflows/frontend-ci.yml`

## Modül 2 — Component ve Template Modeli

Ekran Page/Filter/List/Card/Empty State component'lerine ayrıldı. `input()` ile aşağı doğru veri, `output()` ile yukarı doğru olay akışı kuruldu. Binding, control flow, content projection ve view query gerçek Incident ekranında uygulandı.

Kanıt: `docs/learning/module-02-component-template.md`

## Modül 3 — Dependency Injection ve Routing

UI, Incident veri kaynağından `InjectionToken` ve repository portu ile ayrıldı. Repository yalnızca Incident route ağacında sağlandı. Incident, Asset ve Work Order rotaları lazy yüklendi. Feature guard, detail resolver, Not Found ve feature-disabled rotaları eklendi.

Kanıt: `docs/learning/module-03-dependency-injection-routing.md`

## Modül 4 — Signals, RxJS ve Test Temelleri

Arama, Severity filtresi, seçim ve kullanıcı mesajları Signal ile yönetildi. `computed`, `effect` ve `linkedSignal` gerçek state problemlerine uygulandı. Arama akışı RxJS ile debounce edildi. Asenkron liste `resource()` ile loading/error/empty/success durumlarına ayrıldı ve eski istekler `AbortSignal` ile iptal edildi.

Kanıt: `docs/learning/module-04-signals-rxjs-testing.md`

## Uygulama sırası

```text
1. Ürün ve domain sözlüğü
          ↓
2. Angular workspace ve kalite kapısı
          ↓
3. Incident type ve component sözleşmeleri
          ↓
4. Filter → List → Card component ağacı
          ↓
5. Repository portu ve route-scoped provider
          ↓
6. Lazy routes, guard ve resolver
          ↓
7. Signal + RxJS + Resource state akışı
          ↓
8. Normal, loading, error, empty ve race testleri
```

## Çalışan mimari

```text
Browser URL
    ↓
Angular Router
    ↓
Lazy Incident route
    ↓
IncidentListPage (state owner)
    ├── Signal/RxJS/Resource
    ├── IncidentFilterBar
    ├── IncidentList
    │     └── IncidentCard × N
    └── EmptyState
          ↓
INCIDENT_REPOSITORY token
          ↓
MockIncidentRepository
```

## Kalite kanıtı

- Node.js 24.17 ile test edildi; proje dosyası Node.js 24.15 sürümünü sabitler.
- 8 test dosyasında 19 test başarılı.
- Production build başarılı.
- Incident, detail, assets, work-orders ve hata sayfaları ayrı lazy chunk olarak üretildi.
- Strict TypeScript ve strict template kontrolleri açık kaldı.
- Erişilebilir navigation, form label'ları, live region, focus görünümü ve reduced-motion desteği eklendi.

## Bilinçli sınırlar

- Veri halen kontrollü mock repository'den gelir; gerçek Spring Boot backend Aşama 5'tedir.
- Frontend guard güvenlik sınırı değildir; authorization backend'de uygulanacaktır.
- `httpResource()` gerçek HTTP API gelene kadar kullanılmaz; boş veya sahte endpoint çağrısı yapılmaz.
- Gelişmiş domain katmanları ve architecture fitness testleri Aşama 2'de ele alınacaktır.

## Sonraki adım

Aşama 2, Modül 5: Domain ve Feature Sınırları. Aşama 2 ancak bu aşamanın kod review'u ve manuel Git commit/push işlemi tamamlandıktan sonra başlatılır.
