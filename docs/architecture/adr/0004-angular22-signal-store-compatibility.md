# ADR-0004: Angular 22 ve Signal Store Uyumluluk Stratejisi

- Durum: Kabul edildi
- Tarih: 4 Temmuz 2026

## Bağlam

InfraFlow frontend Angular 22 kullanıyor. 4 Temmuz 2026 tarihinde yayımlanmış en güncel
`@ngrx/signals` sürümü `21.1.1` ve bu paketin `peerDependencies` (eş paket
gereksinimleri) alanı `@angular/core: ^21.0.0` istiyor. NgRx deposundaki Angular 22
destek çalışması henüz açık durumda ve npm `next` etiketi de bir 22 sürümü sunmuyor.

Uyumsuz paketi `--force` ile kurmak güvenilir bir kurumsal temel oluşturmaz. Yalnızca
Signal Store kullanabilmek için uygulamayı Angular 21'e düşürmek de projenin modern
Angular 22 öğrenme hedefiyle çelişir.

## Karar

1. Modül 6'nın state contract (durum sözleşmesi), normalized entity state (kimliğe
   göre normalize edilmiş veri) ve saf dönüşüm fonksiyonları framework-independent
   (çatıdan bağımsız) TypeScript olarak kurulacak.
2. Bir sonraki parçada Angular'ın yerleşik Signals API'siyle route-scoped store
   (rota ömürlü durum deposu) adapter'ı geliştirilecek.
3. UI yalnızca bu adapter'ın public API'sine (dış sözleşmesine) bağlanacak; state
   modeli veya sayfalar NgRx'in iç ayrıntılarına bağlanmayacak.
4. Angular 22 ile uyumlu resmi NgRx Signal Store sürümü yayımlanıp test edildiğinde
   adapter'ın iç uygulaması NgRx Signal Store'a geçirilecek.
5. Modül 6'nın öğrenme hedefi Signal Store pattern'lerini (durum deposu kalıplarını)
   framework-native (Angular'ın yerleşik) Signals ile eksiksiz uygulamaktır. Resmi
   NgRx 22 adapter geçişi, paket yayımlandıktan sonra yapılacak ayrı bir takip işidir
   ve Modül 6'nın tamamlanmasını engellemez.

## Sonuçlar

Olumlu sonuçlar:

- Angular 22 korunur ve paket yöneticisi uyarıları zorla bastırılmaz.
- Entity, query, selection, async ve command state kavramları bugünden öğrenilir.
- Saf fonksiyonlar hızlı ve Angular TestBed gerektirmeyen testlerle doğrulanır.
- İlerideki NgRx geçişi UI'ı yeniden yazmayı gerektirmez.

Bedeller:

- Geçici olarak küçük bir native Signals adapter'ı bakımı yapılır.
- Resmi NgRx 22 yayımlandığında adapter uygulaması için ek bir migration
  (geçiş) çalışması gerekir.
- NgRx'e özgü `signalStore`, `withState`, `withComputed` ve `withMethods` API'leri
  resmi uyumlu paket gelene kadar uygulama koduna alınmaz.

## Doğrulama kaynakları

- NgRx Signal Store rehberi: https://ngrx.io/guide/signals/signal-store
- NgRx Signal Store test rehberi: https://ngrx.io/guide/signals/signal-store/testing
- `@ngrx/signals@21.1.1` npm metadata: https://registry.npmjs.org/%40ngrx%2Fsignals/21.1.1
- npm dağıtım etiketleri: https://registry.npmjs.org/-/package/%40ngrx%2Fsignals/dist-tags
- Angular 22 destek çalışması: https://github.com/ngrx/platform/issues/5158

## 4 Temmuz 2026 yeniden değerlendirmesi

NgRx ekibi, v22 sürümünün hâlâ hazırlandığını ve NgRx 21'in Angular 22 ile
`legacy-peer-deps` kullanılarak çalışabildiğini açıkladı. InfraFlow eş bağımlılık
kontrolünü gevşetmeyecek. Bu nedenle route-scoped store, normalized entity state,
cache/refresh ve optimistic update/rollback davranışları native Signals ile
tamamlandı; paket adapter değişimi backlog'a (takip edilecek işler listesine) alındı.
