# Aşama 2.5: Advanced Angular Performance Lab

Durum: Bekliyor

## Amaç

Frontend Masters `Advanced Angular: Performance & Enterprise State` kursunda bulunup
InfraFlow'un ilk sekiz modülünde eksik veya kısmi kalan konuları kanıt üreterek
tamamlamak.

Kaynak: https://frontendmasters.com/courses/advanced-angular/

Bu aşama yeni bir ürün modülü değildir ve 20 modülün numarasını değiştirmez. Aşama 2
ile Aşama 3 arasına yerleştirilen bir uzmanlık laboratuvarıdır.

## Uygulama kuralı

Her konu önce izole bir deneyde uygulanır. InfraFlow'a gerçek fayda sağlıyorsa ürün
koduna alınır; yalnızca kursu göstermek için ürüne gereksiz abstraction veya dependency
eklenmez.

| Konu | Uygulama alanı |
|---|---|
| Incident detail tabs, `@defer`, concurrency kontrolü | Gerçek InfraFlow feature'ı |
| SSR/render modes, custom image loader karşılaştırmaları | İzole lab veya ADR |
| NgRx SignalStore | Angular 22 uyumlu resmi paket varsa gerçek adapter |

## Lab 1: OnPush, Zoneless ve Change Detection

- Default ve `OnPush` change detection zihinsel modeli.
- Zoneless Angular'da render'ı hangi olayların tetiklediği.
- Immutable state ile change detection ilişkisi.
- Angular DevTools ile gereksiz render ölçümü.
- Incident Card ağacında ölçüm öncesi/sonrası kanıtı.

Çıkış: Change detection karar tablosu, profiling kanıtı ve test.

## Lab 2: Image Performance

- `NgOptimizedImage`, width/height ve priority.
- LCP (Largest Contentful Paint) üzerindeki etkiler.
- Responsive `srcset` ve sizes.
- Custom image loader ve CDN URL üretimi.
- Asset fotoğrafı senaryosu; gerçek ihtiyaç yoksa yalnızca izole demo.

Çıkış: Optimize edilmiş Asset image örneği ve network/Lighthouse karşılaştırması.

## Lab 3: SSR, Prerender, Hydration ve Render Modes

- CSR, SSR ve prerender farkları.
- Hydration ve DOM'u yeniden kullanma.
- Internal authenticated operasyon ekranında SSR trade-off'ları.
- Public status sayfası için prerender/SSR olasılığı.
- InfraFlow için uygulanacak render mode kararının ADR olarak yazılması.

Çıkış: Ölçülebilir demo ve render-strategy ADR'ı. SSR yalnızca gerekçeliyse ürüne alınır.

## Lab 4: `@defer` ve Incremental Loading

- Viewport, interaction ve idle trigger'ları.
- Placeholder, loading ve error blokları.
- Incident detail ekranındaki ağır harita/timeline için deferred rendering.
- Erişilebilir loading duyurusu.
- `@defer` test fixture'ları.

Çıkış: Lazy route içindeki ağır alt içeriğin ayrıca ertelendiği testli ekran.

## Lab 5: Advanced UI Composition ve Local DI

- Multi-slot content projection.
- `Tab` ve `TabGroup` component'leri.
- `contentChildren()` ile projected tab keşfi.
- Component-scoped provider ile yerel tab state'i.
- Incident detail: Overview, Asset ve Audit sekmeleri.

Çıkış: Domain bağımsız, erişilebilir ve test edilen Tab component ailesi.

## Lab 6: Host Directives

- Host directive'in inheritance ve wrapper component'ten farkı.
- Davranışın component'e deklaratif eklenmesi.
- Interaction telemetry veya focus davranışı örneği.
- Input/output forwarding ve directive testi.

Çıkış: Ürün koduna uygun değilse yalnızca lab'da kalan testli host directive.

## Lab 7: RxJS Concurrency ve Stream Errors

- `mergeMap`: paralel çalıştırma.
- `concatMap`: sıraya koyma.
- `switchMap`: eskisini iptal etme.
- `exhaustMap`: işlem sürerken yenisini reddetme.
- `catchError` konumunun stream'i bitirmesi veya yaşatması.
- Rapid acknowledge simülasyonu ve doğru operatör seçimi.

Çıkış: Dört operatörü aynı senaryoda karşılaştıran testli concurrency laboratuvarı.

## Lab 8: NgRx SignalStore ve `rxMethod`

- `signalStore`, `withState`, `withComputed`, `withMethods`, `withHooks`.
- Request status custom feature.
- `rxMethod` ile read/write akışları.
- Native InfraFlow Store ile NgRx SignalStore karşılaştırması.
- Angular 22 peer dependency uyumu yeniden doğrulanmadan paket kurulmaz.

Çıkış: Uyumlu paket varsa IncidentStore adapter migration'ı; yoksa çalışan izole spike ve ADR.

## Lab 9: Component Harness ve Advanced Testing

- Component Harness hangi test kırılganlığını çözer?
- Tab, Form ve Incident Card harness'ları.
- SignalStore/computed testleri.
- `@defer` bloklarının placeholder/loading/complete testleri.
- DOM selector odaklı testlerle harness testlerinin karşılaştırması.

Çıkış: En az iki reusable harness ve ileri component test paketi.

## Lab 10: Performance Evidence

- Lighthouse ölçümü.
- Angular DevTools profiling.
- Network waterfall ve lazy chunk analizi.
- Bundle budget ve regression karşılaştırması.
- Ölçüm ortamı, eşik ve sonuçların belgelenmesi.

Çıkış: Tekrarlanabilir performans raporu ve önce/sonra kanıtı.

## Tamamlanma ölçütü

Her lab için:

1. Kavram Türkçe zihinsel modelle açıklanır.
2. İzole çalışan örnek oluşturulur.
3. InfraFlow'a alınma veya alınmama kararı gerekçelendirilir.
4. Normal, hata ve sınır senaryosu test edilir.
5. Ölçülebilen konuda önce/sonra kanıtı üretilir.
6. `npm run quality` başarılı kalır.

Aşama 2.5 tamamlanmadan Aşama 3'e geçilmez.
