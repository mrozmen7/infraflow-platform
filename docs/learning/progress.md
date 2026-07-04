# InfraFlow Öğrenme İlerlemesi

Durum değerleri: `Bekliyor`, `Devam ediyor`, `Review`, `Tamamlandı`.

## Güncel konum

- Son tamamlanan: Aşama 1 - Modern Angular Temelleri
- Tamamlanan modüller: 1, 2, 3 ve 4
- Sonraki: Aşama 2 / Modül 5 - Domain ve Feature Sınırları
- Durum: Aşama 2 henüz başlatılmadı

## Modül 1 dersleri

| No | Ders | Durum | Kanıt |
|---:|---|---|---|
| 1.1 | Product Charter | Tamamlandı | `docs/product/product-charter.md` |
| 1.2 | Domain dili | Tamamlandı | `docs/domain/domain-language.md` |
| 1.3 | Node.js, npm ve paket modeli | Tamamlandı | `module-01-lesson-03-node-npm.md` |
| 1.4 | Angular CLI ve workspace | Tamamlandı | `module-01-lessons-04-06-angular-foundations.md` |
| 1.5 | Dosyadan ekrana akış | Tamamlandı | `module-01-lessons-04-06-angular-foundations.md` |
| 1.6 | Strict, standalone, zoneless, routing, SCSS, Vitest | Tamamlandı | `module-01-lessons-04-06-angular-foundations.md` |
| 1.7 | Kalite kapısı ve Git checkpoint | Tamamlandı | GitHub Actions `Frontend CI` başarılı |

## Modül 2 dersleri

| No | Ders | Durum | Kanıt |
|---:|---|---|---|
| 2.1 | Component çalışma modeli | Tamamlandı | Component class/template/style/selector ayrımı |
| 2.2 | Template ve binding | Tamamlandı | IncidentCard binding'leri |
| 2.3 | `@if`, `@for`, `@switch` control flow | Tamamlandı | Incident durumları ve exhaustiveness örneği |
| 2.4 | `input()` ve `output()` | Tamamlandı | Typed Card/Filter/List sözleşmeleri |
| 2.5 | Component composition | Tamamlandı | Page → List → Card ağacı, `ng-content`, `viewChild` |
| 2.6 | Incident feature component'leri | Tamamlandı | Filter/List/Card/Empty State |
| 2.7 | Test ve accessibility | Tamamlandı | Component testleri ve erişilebilir shell |

## Modül 3 dersleri

| No | Ders | Durum | Kanıt |
|---:|---|---|---|
| 3.1 | Dependency Injection problemi | Tamamlandı | UI mock sınıfını doğrudan üretmiyor |
| 3.2 | `inject()`, provider, InjectionToken | Tamamlandı | `INCIDENT_REPOSITORY`, `APP_RUNTIME_CONFIG` |
| 3.3 | Provider yaşam alanları | Tamamlandı | Root config ve route-scoped repository |
| 3.4 | URL, route config, router outlet | Tamamlandı | App shell ve route ağacı |
| 3.5 | Lazy route ve feature sınırı | Tamamlandı | Ayrı production chunk'ları |
| 3.6 | Guard, resolver, hata rotaları | Tamamlandı | Feature flag, Incident detail, redirects |
| 3.7 | Incident/Asset/Work Order navigasyonu | Tamamlandı | Erişilebilir primary navigation |

## Modül 4 dersleri

| No | Ders | Durum | Kanıt |
|---:|---|---|---|
| 4.1 | State ve tek sahip | Tamamlandı | `IncidentListPage` state owner |
| 4.2 | `signal()` | Tamamlandı | Search, Severity, action state |
| 4.3 | `computed()`, `effect()`, `linkedSignal()` | Tamamlandı | Query, document title, geçerli seçim |
| 4.4 | Observable ve RxJS | Tamamlandı | Debounced search stream |
| 4.5 | Signal/RxJS dönüşümü ve seçim kuralı | Tamamlandı | `toObservable`, `toSignal` |
| 4.6 | `resource()`, `httpResource()` ve UI durumları | Tamamlandı | Mock async resource; HTTP geçiş kararı belgeli |
| 4.7 | Race condition ve test | Tamamlandı | AbortSignal + 19 başarılı test |

## Teknik kanıt

- Angular 22.0.4.
- Strict TypeScript ve strict template.
- Standalone, zoneless, lazy routing, SCSS ve Vitest.
- Node.js 24.17 üzerinde 8/8 test dosyası ve 19/19 test başarılı.
- Production build başarılı ve lazy route chunk'ları üretildi.
- Mock Incident list/search/select/acknowledge/detail akışı çalışıyor.

## 20 modül durumu

| Modül | Başlık | Durum |
|---:|---|---|
| 1 | Ürün, Alan ve Workspace Başlangıcı | Tamamlandı |
| 2 | Component ve Template Modeli | Tamamlandı |
| 3 | Dependency Injection ve Routing | Tamamlandı |
| 4 | Signals, RxJS ve Test Temelleri | Tamamlandı |
| 5 | Domain ve Feature Sınırları | Bekliyor |
| 6 | State Management ve Signal Store | Bekliyor |
| 7 | Signal Forms ve Kurumsal Formlar | Bekliyor |
| 8 | Kaliteli Frontend | Bekliyor |
| 9 | AI-Ready Repository ve Guardrails | Bekliyor |
| 10 | Kontrollü Geliştirme Döngüsü | Bekliyor |
| 11 | İleri Ajan Akışları ve Legacy Refactoring | Bekliyor |
| 12 | Agent Temelleri | Bekliyor |
| 13 | AG-UI ve Angular Adapter | Bekliyor |
| 14 | A2UI ve Generative UI | Bekliyor |
| 15 | Human-in-the-Loop | Bekliyor |
| 16 | MCP, Multimodal ve Agent Güvenliği | Bekliyor |
| 17 | Spring Boot ve Modular Monolith | Bekliyor |
| 18 | PostgreSQL, Transaction ve OpenAPI | Bekliyor |
| 19 | Enterprise Güvenlik ve Legacy Entegrasyon | Bekliyor |
| 20 | Entegrasyon, Delivery ve Production Readiness | Bekliyor |
