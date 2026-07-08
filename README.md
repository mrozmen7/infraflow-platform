# InfraFlow Platform

InfraFlow, kritik altyapı tesislerindeki arıza, varlık ve bakım işlerini yöneten eğitim amaçlı kurumsal referans projesidir.

Bu repository yalnızca çalışan bir ürün üretmek için değil; modern Angular mimarisi, profesyonel AI destekli mühendislik, Agentic UI ve Spring Boot konularını kanıt üreterek öğrenmek için kullanılır.

## Güncel durum

- Aşama 1 - Modern Angular Temelleri: Tamamlandı
- Aşama 2 - İleri Angular Mimarisi: Tamamlandı
- UI Foundation Sprint: Tamamlandı ve onaylandı
- Aşama 3 - Profesyonel Agentic Engineering (Modül 9–11): Tamamlandı
- Güncel: Aşama 5 / Modül 21 - PostgreSQL, Transaction ve OpenAPI tamamlandı
- Aşama 2.5 - Advanced Angular Performance Lab: Proje sonuna ertelendi
- Frontend: Angular 22
- Backend: Spring Boot 3.5.13 + Java 21 + PostgreSQL/Flyway/JPA eklendi
- Agent runtime: Güvenli Agentic UI contract ve approval boundary eklendi

## Çalışan frontend özellikleri

- Incident listeleme, arama ve Severity filtresi
- Incident seçme ve acknowledgement akışı
- Incident detay rotası ve resolver
- Loading, error, empty ve success görünümleri
- Lazy Incident/Asset/Work Order rotaları
- Route-scoped mock repository ve runtime feature guard
- Signal, computed, effect, linkedSignal, RxJS ve resource state akışı
- Erişilebilir app shell ve klavye davranışları
- Signal Store, normalize state, cache, optimistic update ve rollback
- Incident response start ve persistence hatasında güvenli rollback
- Desktop/mobile Playwright uçtan uca kullanıcı akışı
- Characterization test ile korunan query cache refactoring
- Typed Signal Form ve cross-field validation
- Global error reporting, CSP, accessibility ve bundle budgets
- 21 test dosyasında 73 test + 2 Playwright browser testi

## Repository yapısı

```text
infraflow-platform/
├── frontend/      Angular uygulaması
├── backend/       Spring Boot modular monolith backend
├── agent-lab/     Güvenli agent runtime - daha sonra
├── contracts/     OpenAPI, AG-UI ve A2UI sözleşmeleri
├── infra/         Yerel altyapı ve container tanımları
├── docs/          Ürün, mimari ve eğitim kararları
└── AGENTS.md      AI destekli çalışma kuralları
```

## Frontend mimarisi

```text
app/
├── core/              Uygulama geneli config ve hata sayfaları
├── shared/ui/         Domain bağımsız tekrar kullanılabilir UI
└── features/
    ├── incidents/     Çalışan Incident dikey dilimi
    ├── assets/        Lazy feature sınırı
    └── work-orders/   Lazy feature sınırı
```

Incident feature kendi domain, application, state, infrastructure, page ve UI sınırlarını
birlikte tutar. Bu sınırlar architecture fitness testleriyle otomatik korunur.

## Eğitim navigasyonu

- [Tam müfredat](docs/learning/curriculum-map.md)
- [Güncel ilerleme](docs/learning/progress.md)
- [Aşama 3 eğitim ve referans planı](docs/learning/phase-03-professional-agentic-engineering.md)
- [Repository context map](docs/agentic-engineering/repository-context-map.md)
- [Aşama 2.5: Advanced Angular Performance Lab](docs/learning/phase-02-5-advanced-angular-performance-lab.md)
- [Aşama 1 özeti](docs/learning/phase-01-modern-angular.md)
- [Modül 2: Component ve Template](docs/learning/module-02-component-template.md)
- [Modül 3: DI ve Routing](docs/learning/module-03-dependency-injection-routing.md)
- [Modül 4: Signals, RxJS ve Test](docs/learning/module-04-signals-rxjs-testing.md)
- [Modül 9: AI-Ready Repository](docs/learning/module-09-ai-ready-repository.md)
- [Modül 10: Kontrollü Geliştirme Döngüsü](docs/learning/module-10-controlled-development-loop.md)
- [Modül 11: İleri Ajan Akışları ve Legacy Refactoring](docs/learning/module-11-advanced-agent-flows-legacy-refactoring.md)
- [Modül 20: Spring Boot ve Modular Monolith](docs/learning/module-20-spring-boot-modular-monolith.md)
- [Modül 21: PostgreSQL, Transaction ve OpenAPI](docs/learning/module-21-postgresql-transactions-openapi.md)
- [Professional Agentic Engineering Handbook](docs/agentic-engineering/handbook.md)

## Gereksinimler

- Node.js 24.15.0 (`.nvmrc` ve `.node-version` ile sabitlenmiştir)
- npm 11.6.0 veya uyumlu npm sürümü
- Java 21
- Docker Desktop veya uyumlu Docker runtime

## Frontend komutları

```bash
cd frontend
npm install
npm start
npm test -- --watch=false
npm run build
npm run quality
npm run quality:full
```

## Backend komutları

```bash
docker compose -f infra/postgres/compose.yml up -d

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
mvn test
```

Backend endpointleri:

- `GET /api/v1/incidents`
- `GET /api/v1/incidents/{incidentId}`
- `POST /api/v1/incidents`
- `POST /api/v1/incidents/{incidentId}/acknowledge`
- `POST /api/v1/incidents/{incidentId}/start-response`
- `GET /api/v1/work-orders`
- `POST /api/v1/work-orders/drafts`
- `GET /v3/api-docs`
- `GET /swagger-ui.html`

OpenAPI contract:

- `contracts/openapi/infraflow-api-v1.openapi.json`

## Kalite kapısı

Bir modül aşağıdakiler tamamlanmadan bitmiş sayılmaz:

1. Kavram açıklanmış olmalı.
2. Kod veya doküman çıktısı bulunmalı.
3. Normal, hata ve sınır durumları test edilmeli.
4. Production build başarılı olmalı.
5. Değişiklik birlikte incelenmeli.
6. Mimari karar gerekiyorsa ADR yazılmalı.
