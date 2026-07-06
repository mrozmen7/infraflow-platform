# InfraFlow Öğrenme İlerlemesi

Durum değerleri: `Bekliyor`, `Devam ediyor`, `Review`, `Tamamlandı`.

## Güncel konum

- Son tamamlanan: Aşama 3 / Modül 9 - AI-Ready Repository ve Guardrails
- Tamamlanan modüller: 1, 2, 3, 4, 5, 6, 7, 8 ve 9
- Son tamamlanan ek çalışma: UI Foundation Sprint - kullanıcı tarafından onaylandı
- Güncel: Aşama 3 / Modül 10 - Kontrollü Geliştirme Döngüsü
- Son tamamlanan ders: Modül 9 / Ders 7 - Worktree, İzole Görev ve Modül 9 Finali
- Aşama 3 eğitim ve referans planı: `phase-03-professional-agentic-engineering.md`
- Durum: Aşama 2 final kontrolü tamamlandı; Advanced Angular Performance Lab proje sonuna ertelendi

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
- 18/18 test dosyası ve 54/54 test başarılı.
- Architecture fitness check 57 TypeScript dosyasının bağımlılık yönlerini doğruluyor.
- Frontend guardrail check 68 source dosyasını ve 3 negatif security proof'u güvenlik ve
  erişilebilirlik açısından doğruluyor.
- Production build başarılı ve lazy route chunk'ları üretildi.
- `.nvmrc` Node.js 24.15 sürümünü sabitliyor; yerel geliştirmede `nvm use` kullanılmalıdır.
- Mock Incident list/search/select/acknowledge/detail akışı çalışıyor.
- Route-scoped Incident Store; normalize state, query cache, refresh, optimistic
  acknowledgement ve rollback davranışlarını yönetiyor.
- `/incidents/new` Signal Form; typed draft, schema validation, cross-field safety
  rules, submit errors ve create akışını yönetiyor.
- Production build otomatik CSP, route focus yönetimi, global error reporting ve
  330/380 kB initial bundle budget ile korunuyor.

## 20 modül durumu

Aşama 2.5, 20 modül numaralandırmasını değiştirmeyen ara uzmanlık laboratuvarıdır.

| Aşama 2.5 Lab | Başlık | Durum |
|---:|---|---|
| 1 | OnPush, Zoneless ve Change Detection | Bekliyor |
| 2 | Image Performance | Bekliyor |
| 3 | SSR, Prerender, Hydration ve Render Modes | Bekliyor |
| 4 | `@defer` ve Incremental Loading | Bekliyor |
| 5 | Advanced UI Composition ve Local DI | Bekliyor |
| 6 | Host Directives | Bekliyor |
| 7 | RxJS Concurrency ve Stream Errors | Bekliyor |
| 8 | NgRx SignalStore ve `rxMethod` | Bekliyor |
| 9 | Component Harness ve Advanced Testing | Bekliyor |
| 10 | Performance Evidence | Bekliyor |

## Ana modüller

| Modül | Başlık | Durum |
|---:|---|---|
| 1 | Ürün, Alan ve Workspace Başlangıcı | Tamamlandı |
| 2 | Component ve Template Modeli | Tamamlandı |
| 3 | Dependency Injection ve Routing | Tamamlandı |
| 4 | Signals, RxJS ve Test Temelleri | Tamamlandı |
| 5 | Domain ve Feature Sınırları | Tamamlandı |
| 6 | State Management ve Signal Store | Tamamlandı |
| 7 | Signal Forms ve Kurumsal Formlar | Tamamlandı |
| 8 | Kaliteli Frontend | Tamamlandı |
| 9 | AI-Ready Repository ve Guardrails | Tamamlandı |
| 10 | Kontrollü Geliştirme Döngüsü | Sıradaki |
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
