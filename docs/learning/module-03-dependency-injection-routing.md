# Modül 3: Dependency Injection ve Routing

## Amaç

Component'lerin ihtiyaç duyduğu veri kaynağını kendilerinin üretmesini engellemek; URL ile feature (iş yeteneği) sınırlarını eşleştirmek ve kodu yalnızca ihtiyaç olduğunda yüklemek.

## Ders 3.1 — Dependency ve Dependency Injection

Dependency (bir sınıfın çalışmak için ihtiyaç duyduğu dış nesne), örneğin Incident verisini getiren repository'dir.

Dependency Injection veya DI (bağımlılığı sınıf içinde üretmek yerine dışarıdan verme) olmadan sayfa şöyle davranırdı:

```typescript
const repository = new MockIncidentRepository();
```

Bu durumda sayfa mock implementasyona sıkı bağlanır. Testte fake, ileride HTTP adapter kullanmak zorlaşır.

InfraFlow çözümü:

```typescript
private readonly incidentRepository = inject(INCIDENT_REPOSITORY);
```

Sayfa “hangi sınıf?” sorusunu değil “hangi yetenek?” sorusunu sorar.

## Ders 3.2 — Provider ve InjectionToken

Provider (bir dependency istendiğinde hangi değerin verileceğini belirleyen kayıt), token ile implementasyonu eşleştirir:

```typescript
{
  provide: INCIDENT_REPOSITORY,
  useClass: MockIncidentRepository,
}
```

`InjectionToken` (interface veya config gibi çalışma zamanında doğrudan bulunmayan değerin DI anahtarı) iki yerde kullanıldı:

- `INCIDENT_REPOSITORY`: veri erişim sözleşmesi,
- `APP_RUNTIME_CONFIG`: API adresi ve feature flag değerleri.

## Ders 3.3 — Provider scope

Provider scope (dependency örneğinin geçerli olduğu yaşam alanı) bilinçli seçildi:

- Runtime config root scope'tadır (uygulamanın tamamında tek değer).
- Incident repository route scope'tadır (yalnızca `/incidents` ağacında yaşar).
- Component'e özel geçici davranışlar component state'inde kalır.

Route scope, Incident feature açılmadan repository oluşturmaz ve başka feature'ların ona yanlışlıkla erişmesini engeller.

## Ders 3.4 — URL ve Router Outlet

Route (URL desenini Angular ekranıyla eşleştiren kayıt) örnekleri:

- `/incidents` → Incident çalışma alanı,
- `/incidents/:incidentId` → Incident detayı,
- `/assets` → Asset sınırı,
- `/work-orders` → Work Order sınırı,
- bilinmeyen URL → Not Found görünümü.

`router-outlet` (aktif rotanın component'ini yerleştiren ekran yuvası), app shell içinde bulunur. Header ve navigation sabit kalırken orta içerik rota ile değişir.

## Ders 3.5 — Lazy loading

Lazy loading (feature kodunu başlangıç paketine koymayıp rota açıldığında yükleme) iki API ile kuruldu:

- `loadChildren`: Incident route ağacını yükler.
- `loadComponent`: sayfa component'ini yükler.

Production build ayrı `incident-list-page`, `incident-detail-page`, `assets-page` ve `work-orders-page` chunk'ları üretti.

## Ders 3.6 — Guard, resolver ve hata rotası

Guard (rotanın eşleşmesine veya açılmasına karar veren kontrol), runtime feature flag kapalıysa `/feature-unavailable` rotasına yönlendirir.

Önemli güvenlik sınırı: Browser içindeki guard authorization (yetkilendirme) güvenliği değildir. Kullanıcı JavaScript'i değiştirebilir; gerçek yetki kontrolü Spring Boot backend'de tekrar uygulanacaktır.

Resolver (sayfa aktive olmadan gerekli veriyi hazırlayan fonksiyon), Incident detayını kimlik ile yükler. Incident bulunamazsa `RedirectCommand` (Router'ın güvenli yönlendirme sonucu) ile Not Found rotasına gider.

Resolver sadece ekran açılmadan mutlaka gerekli olan küçük veri için kullanıldı; büyük listeler sayfa açıldıktan sonra resource ile yüklenir.

## Ders 3.7 — InfraFlow navigasyonu

App shell (uygulamanın sabit dış kabuğu) şu parçaları içerir:

- skip link (klavyeyle ana içeriğe atlama bağlantısı),
- marka ve ana navigation,
- navigation progress (rota değişirken ilerleme göstergesi),
- `router-outlet`,
- eğitim ortamı footer'ı.

## Yakalanan sürüm farkı

Angular 22 `CanMatchFn` test sözleşmesi üçüncü `currentSnapshot` parametresini bekliyor. İlk test build'i eski iki parametreli çağrıyı reddetti. Test Angular 22 tip sözleşmesine güncellendi.

## Çıkış kanıtı

- Root ve route provider scope'ları ayrıldı.
- Incident repository, mock implementasyondan token ile ayrıldı.
- Lazy feature rotaları üretildi.
- Guard, resolver, redirect ve wildcard route test edildi.
