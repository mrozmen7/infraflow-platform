# InfraFlow Tam Öğrenme Haritası

Bu dosya 6 aşama ve 20 modülün hangi küçük derslerle, hangi sırada ve hangi kanıtlarla tamamlanacağını tanımlar.

## Öğretme yöntemi

Her İngilizce veya teknik terim ilk geçtiği yerde hemen Türkçe anlamıyla birlikte verilir. Örnek: `Dependency (projenin çalışmak için ihtiyaç duyduğu dış paket)`. Terim öğrenilmeden o terimle işlem yapılmaz.

Her ders aynı döngüyü izler:

1. **Hatırlama:** Önceki dersten üç kısa soru.
2. **Basit açıklama:** Konu teknik olmayan bir benzetmeyle anlatılır.
3. **Problem:** Bu teknoloji olmasaydı hangi sorun yaşanırdı?
4. **Zihinsel model:** Arka planda nasıl çalıştığı açıklanır.
5. **İzole örnek:** InfraFlow'dan bağımsız küçük deney yapılır.
6. **Gerçek uygulama:** Aynı kavram InfraFlow feature'ına uygulanır.
7. **Hata senaryosu:** Yanlış kullanım bilinçli olarak üretilip düzeltilir.
8. **Öğrenci görevi:** Küçük bir parçayı öğrenci uygular veya açıklar.
9. **Test ve review:** Davranış ve mimari birlikte doğrulanır.
10. **Feynman özeti:** Konu, lise öğrencisine anlatılabilecek sadelikte yeniden özetlenir.

Bir teknoloji yalnızca kullanılacağı derste ayrıntılı anlatılır. Böylece teori unutulmadan hemen çalışan koda bağlanır.

## Ustalık ölçütü

Bir konu öğrenilmiş sayılmak için öğrenci:

- ne olduğunu kendi cümleleriyle açıklayabilmeli,
- hangi problemi çözdüğünü söyleyebilmeli,
- küçük bir örneğini uygulayabilmeli,
- en az bir yanlış kullanımını teşhis edebilmeli,
- alternatif çözümle trade-off karşılaştırması yapabilmeli,
- test veya görünür kanıt gösterebilmelidir.

---

# Aşama 1: Modern Angular Temelleri

Amaç: Angular'ın modern zihinsel modelini öğrenmek ve çalışan Incident dikey dilimini kurmak.

## Modül 1: Ürün, Alan ve Workspace Başlangıcı

1. **Product Charter:** Problem, kullanıcı, kapsam ve başarı ölçütü.
2. **Domain dili:** Incident, Asset, Work Order, Severity, Priority, SLA ve Audit.
3. **Geliştirme motoru:** Node.js, npm, package.json ve package-lock.json.
4. **Angular araçları:** Angular CLI, workspace ve `ng` komutları.
5. **Dosyadan ekrana akış:** index.html -> main.ts -> config -> root component.
6. **Modern başlangıç kararları:** strict, standalone, zoneless, routing, SCSS ve Vitest.
7. **Kalite kapısı:** dev server, test, production build, Git review ve ilk checkpoint.

Çıkış: Product Charter + desteklenen sürümler + çalışan/test edilen Angular workspace.

## Modül 2: Component ve Template Modeli

1. Component nedir, neden küçük parçalara ayrılır?
2. Template binding, property binding ve event handling.
3. `@if`, `@for` ve `@switch` control flow.
4. `input()`, `output()` ve tek yönlü veri akışı.
5. Content projection, `viewChild()` ve component composition.
6. Incident List, Incident Card ve Filter Bar uygulaması.
7. Component testi ve temel erişilebilirlik review'u.

Çıkış: Mock Incident verisini erişilebilir component ağacında gösteren ilk ekran.

## Modül 3: Dependency Injection ve Routing

1. Bağımlılık nedir, Dependency Injection hangi problemi çözer?
2. `inject()`, provider ve InjectionToken.
3. Root, route ve component provider yaşam süreleri.
4. URL, route config ve `router-outlet`.
5. Lazy route ve feature sınırı.
6. Guard, resolver, hata rotaları ve runtime config.
7. Incident, Assets ve Work Orders navigasyon uygulaması.

Çıkış: Lazy feature rotaları ve bilinçli provider scope'ları olan uygulama kabuğu.

## Modül 4: Signals, RxJS ve Test Temelleri

1. State nedir, neden tek sahibi olmalıdır?
2. `signal()` ve reaktif okuma/yazma.
3. `computed()`, `effect()` ve `linkedSignal()`.
4. Observable, zaman içindeki akış ve temel RxJS operatörleri.
5. Signal ve RxJS arasında seçim ve dönüşüm.
6. `resource()`, `httpResource()`, loading/error/empty state.
7. Race condition, fake data ve Vitest senaryoları.

Çıkış: Arama, filtre, seçim ve detay yüklemeyi güvenilir yöneten Incident dikey dilimi.

---

# Aşama 2: İleri Angular Mimarisi

Amaç: Büyüyen frontend'i domain sınırları, state, formlar ve kalite kapılarıyla sürdürülebilir kılmak.

## Modül 5: Domain ve Feature Sınırları

1. İş alanı, ubiquitous language ve bounded context.
2. Entity, value object ve invariant.
3. Feature slice ve domain odaklı klasörleme.
4. Presentation, application, domain ve infrastructure sorumlulukları.
5. Port, adapter ve dependency inversion.
6. Public API, circular dependency ve architecture fitness testleri.

Çıkış: Incident domain'i framework ve HTTP ayrıntılarından ayrılmış feature yapısı.

## Modül 6: State Management ve Signal Store

1. Local, route, feature ve server state ayrımı.
2. NgRx Signal Store zihinsel modeli.
3. Entity collection ve normalized state.
4. Command, query ve computed view model.
5. Cache, refresh ve optimistic update.
6. Rollback, error recovery ve store testleri.

Çıkış: Tek sahipli, test edilen ve hata durumundan dönebilen Incident feature state'i.

## Modül 7: Signal Forms ve Kurumsal Formlar

1. Form state ve form modeli.
2. Field, group, array ve alt form.
3. Senkron ve cross-field validation.
4. Asenkron validation ve server hata eşleme.
5. Draft, submit ve unsaved changes.
6. Incident/Work Order form testi ve erişilebilirlik.

Çıkış: Karmaşık doğrulama ve recovery davranışı olan Incident oluşturma akışı.

## Modül 8: Kaliteli Frontend

1. Design token ve component library.
2. Angular Material/CDK seçimleri.
3. WCAG, klavye ve ekran okuyucu davranışı.
4. Responsive operasyon ve saha ekranları.
5. Loading, empty, error, offline ve stale UI.
6. Storybook, bundle budget ve performans ölçümü.
7. Mimari ve UI kalite kapıları.

Çıkış: Tutarlı, erişilebilir, responsive ve performansı ölçülen Angular frontend.

---

# Aşama 2.5: Advanced Angular Performance Lab

Amaç: Frontend Masters `Advanced Angular: Performance & Enterprise State` kursunda
eksik veya kısmi kalan ileri Angular konularını ürün kodunu gereksiz karmaşıklaştırmadan
izole deneyler, gerçek InfraFlow uygulamaları ve ölçüm kanıtlarıyla tamamlamak.

Bu bir ara uzmanlık aşamasıdır; mevcut 6 aşama ve 20 modül numaralandırmasını değiştirmez.

1. OnPush, zoneless change detection ve profiling.
2. `NgOptimizedImage`, responsive image ve custom loader.
3. CSR, SSR, prerender, hydration ve render mode ADR'ı.
4. `@defer`, viewport/interaction trigger ve defer testleri.
5. Multi-slot projection, TabGroup, `contentChildren()` ve local DI.
6. Host directives.
7. RxJS concurrency operator'ları ve stream error placement.
8. NgRx SignalStore custom features ve `rxMethod` uyumluluk çalışması.
9. Component Harness ve ileri testing.
10. Lighthouse, Angular DevTools ve network/bundle performans kanıtı.

Detaylı plan: `docs/learning/phase-02-5-advanced-angular-performance-lab.md`

Çıkış: Kurs başlıklarının uygulanmış veya bilinçli trade-off ile reddedilmiş olduğunu
gösteren kod, test, ADR ve performans kanıt paketi.

---

# Aşama 3: Profesyonel Agentic Engineering

Amaç: AI yardımını spesifikasyon, test, review ve güvenlik sınırlarıyla profesyonel sürece dönüştürmek.

## Modül 9: AI-Ready Repository ve Guardrails

1. Ajanın bağlam problemi.
2. AGENTS.md ve kural hiyerarşisi.
3. Specification, Acceptance Criteria ve Definition of Done.
4. Implementation plan, ADR ve varsayımlar.
5. Tekrarlanabilir doğrulama, quality gate ve evidence.
6. Sandbox, permission, secret ve prompt injection.
7. Worktree, izole görev ortamı ve final audit.

Çıkış: Ajanın mimari sınırları ve yetkileri açıkça bildiği repository.

## Modül 10: Kontrollü Geliştirme Döngüsü

1. Belirsiz istekten test edilebilir gereksinime geçiş.
2. Repo analizi ve etki alanı keşfi.
3. Plan-first çalışma ve küçük dilimler.
4. Failing test ve TDD.
5. Implementasyon ve diff review.
6. Sistematik debugging.
7. Pull request ve kanıt paketi.

Çıkış: Gereksinimden review'a kadar tekrar edilebilir AI destekli feature akışı.

## Modül 11: İleri Ajan Akışları ve Legacy Refactoring

1. Playwright ile gerçek tarayıcı doğrulaması.
2. Review, test ve security uzman rolleri.
3. Alt ajan görev ve dosya sınırları.
4. Paralel ve sıralı çalışma kararı.
5. Characterization test ile legacy refactoring.
6. Evals, maliyet bütçesi ve stop criteria.

Çıkış: Davranışı koruyarak modernleştirilen legacy ekran ve ölçülebilir ajan kalitesi.

---

# Aşama 4: Angular ile Agentic UI

Amaç: Angular kullanıcı arayüzünü agent runtime'a gevşek bağlı ve güvenli biçimde bağlamak.

## Modül 12: Agent Temelleri

1. Agent loop: observe, decide, act, verify.
2. Structured output ve schema.
3. Tool calling ve tool sonucu.
4. Streaming event ve run state.
5. Context, memory ve sınırlar.
6. Deterministik fake agent.
7. Timeout, cancel, retry ve failure fixture'ları.

Çıkış: Aynı girdiye aynı sonucu veren, test edilebilir fake Incident agent.

## Modül 13: AG-UI ve Angular Adapter

1. AG-UI hangi bağlantı problemini çözer?
2. Run, message, state ve tool event'leri.
3. Transport port ve Signal tabanlı adapter.
4. Streaming chat ve shared state.
5. Client-side/server-side tool yerleşimi.
6. Cancel, resume, reconnect ve error recovery.

Çıkış: Vendor SDK'sından bağımsız çalışan Incident Assistant paneli.

## Modül 14: A2UI ve Generative UI

1. Deklaratif UI ile serbest HTML farkı.
2. Component catalog ve allowlist.
3. JSON Schema doğrulaması.
4. Dynamic surface yaşam döngüsü.
5. Action Card ve typed action event.
6. Geçersiz payload ve unknown component güvenliği.

Çıkış: Güvenli Critical Incident Action Card renderer'ı.

## Modül 15: Human-in-the-Loop

1. Interrupt ve pending approval.
2. Approve, reject ve edit.
3. Server-enforced approval state machine.
4. Expiration, timeout ve recovery.
5. Idempotency ve optimistic locking.
6. Undo, compensating action ve audit.

Çıkış: Çift onayı ve eşzamanlı değişikliği güvenli yöneten kritik karar akışı.

## Modül 16: MCP, Multimodal ve Agent Güvenliği

1. MCP client, server, tool ve resource.
2. MCP Apps ile Angular uygulaması arasındaki fark.
3. Legacy SOAP ve belge servislerini tool olarak sarmalama.
4. GPS, kamera, ses ve görsel incident girdisi.
5. Authentication, authorization ve user consent.
6. Prompt injection ve data exfiltration testleri.
7. Scorer, eval, router ve uzman ajanlar.

Çıkış: En az yetkili, audit edilen ve saldırı senaryolarıyla test edilen agent tool katmanı.

---

# Aşama 5: Spring Boot Backend

Amaç: Doğrulanan frontend sözleşmelerini güvenli ve deterministik backend iş servislerine dönüştürmek.

## Modül 20: Spring Boot ve Modular Monolith

1. Java 21, JVM ve Spring Boot zihinsel modeli.
2. Dependency Injection ve configuration.
3. Modular monolith ve iş modülleri.
4. Controller, application, domain ve infrastructure.
5. Validation ve standart hata sözleşmesi.
6. Unit, web slice ve module boundary testleri.

Çıkış: HTTP'den bağımsız domain kuralları olan Incident backend modülü.

## Modül 21: PostgreSQL, Transaction ve OpenAPI

1. Relational veri modeli ve PostgreSQL.
2. Flyway migration.
3. JPA aggregate ve repository.
4. Transaction, commit ve rollback.
5. OpenAPI-first endpoint sözleşmesi.
6. Paging, filtering, sorting ve DTO mapping.
7. Testcontainers entegrasyon testleri.

Çıkış: Gerçek PostgreSQL üzerinde contract ve transaction davranışı test edilen API.

## Modül 22: Enterprise Güvenlik ve Legacy Entegrasyon

1. Authentication ve authorization farkı.
2. Keycloak, OIDC ve token akışı.
3. Role ve permission modeli.
4. Optimistic locking ve HTTP 409.
5. Audit log ve idempotency key.
6. SOAP/XML anti-corruption adapter.
7. Agent tool authorization.

Çıkış: Yetki, audit, concurrency ve legacy sınırları uygulanmış backend.

---

# Aşama 6: Full-Stack ve Üretime Hazırlık

Amaç: Bütün katmanları üretim benzeri ortamda birleştirip şirket seviyesinde teslim kanıtı üretmek.

## Modül 23: Entegrasyon, Delivery ve Production Readiness

1. Mock adapter'dan Spring Boot API'ye geçiş.
2. OpenAPI'den generated Angular client.
3. Contract ve end-to-end testleri.
4. Docker Compose: web, API, PostgreSQL ve Keycloak.
5. GitHub Actions ve kalite kapıları.
6. Log, metric, trace ve correlation ID.
7. Threat model, performance ve recovery testleri.
8. Professional README, ADR seti ve demo senaryosu.

Çıkış: Tek komutla çalışan, test edilen, gözlemlenebilir ve başvuruya hazır InfraFlow platformu.

---

## Checkpoint standardı

Her modül sonunda:

1. Test ve production build çalıştırılır.
2. Normal ve hata senaryosu gösterilir.
3. Öğrenci konuyu kendi cümlesiyle özetler.
4. Kod ve mimari review yapılır.
5. Doküman ve ADR gerekiyorsa güncellenir.
6. `module-XX-complete` etiketi ancak bundan sonra oluşturulur.
