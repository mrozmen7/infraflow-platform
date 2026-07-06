# Modül 6: State Management ve Signal Store

Durum: Tamamlandı — 5/5

## Amaç

Incident ekranındaki state'i (zaman içinde değişen bilgileri) tek ve öngörülebilir
bir yerde yönetmek; yükleme, arama, seçim ve acknowledge işlemlerini
component'lerden ayırmaktır. Store (durum deposu), uygulamadaki her verinin atıldığı
genel bir kutu değildir. Aynı feature içinde ortak kullanılan state'in sahibidir.

## State türleri

| Tür | InfraFlow örneği | Görevi |
|---|---|---|
| Entity state (varlık durumu) | `ids`, `entities` | Incident'ları tekrarsız saklamak |
| Query state (arama durumu) | `searchTerm`, `severity` | Listenin nasıl süzüleceğini tutmak |
| Selection state (seçim durumu) | `selectedIncidentId` | Aktif Incident'ı belirtmek |
| Async state (asenkron durum) | `loadStatus`, `errorMessage`, `lastLoadedAt` | Yükleme ve hata yaşam döngüsünü göstermek |
| Command state (komut durumu) | `pendingAcknowledgementId` | Sürdürülen komutu belirtmek |

## Normalize edilmiş state

```text
ids:      ['INC-001', 'INC-002']
entities: { 'INC-001': Incident, 'INC-002': Incident }
```

`ids` sıralamayı, `entities` kimlikle erişimi temsil eder. Aynı kimlik tekrar
geldiğinde yeni satır açılmaz; var olan Incident güncellenir.

Eklenen saf fonksiyonlar: `normalizeIncidents`, `selectAllIncidents`,
`selectIncidentById`, `upsertIncident` ve `reconcileSelectedIncidentId`.
Pure function (saf fonksiyon), dış dünyaya dokunmaz ve girdisini değiştirmez;
bu nedenle Angular TestBed olmadan hızlı biçimde test edilebilir.

## Uygulama sırası

1. State contract ve normalization (durum sözleşmesi ve normalleştirme) — bu parça.
2. Route-scoped Signal store (rota ömürlü Signal deposu) ve Page geçişi.
3. Load/cache/refresh (yükleme/önbellek/yenileme).
4. Optimistic update/rollback (iyimser güncelleme/geri alma).
5. Angular 22 uyumlu resmi NgRx Signal Store sürümüyle adapter geçişi ve final testleri.

İlk parçada UI ve repository davranışı değiştirilmedi; state sözleşmesi bağımsız
olarak kuruldu ve uyumsuz NgRx paketi zorla kurulmadı.

## Parça 2: Route-scoped Signal store

`IncidentStore`, query (arama), collection (koleksiyon), selection (seçim) ve async
state'in tek sahibi oldu. `IncidentListPage` artık repository çağırmıyor; kullanıcının
arama, filtreleme, seçme, acknowledge ve retry niyetlerini store'a iletiyor.

Store, `/incidents` üst rotasında sağlanıyor. Böylece liste ve detay ekranları aynı
rota yaşam alanında aynı örneği kullanabilir; kullanıcı feature'dan ayrıldığında state
ve devam eden resource yaşam döngüsü Angular tarafından temizlenir.

Bu parçada eklenen store testleri ilk yüklemeyi, query değişince yeniden yüklemeyi ve
yalnızca koleksiyonda bulunan Incident'ın seçilebilmesini doğrular.

## Parça 3: Load, cache ve refresh

Her normalize query (standartlaştırılmış sorgu) için sonuçlar route ömrü boyunca
30 saniye cache'te tutulur. Aynı sorguya dönüldüğünde repository yeniden çağrılmaz.
Manuel `reload`, güncel cache kaydını geçersizleştirir ve network kaynağına gider.
`loadSource`, sonucun `network` veya `cache` üzerinden geldiğini görünür yapar.

## Parça 4: Optimistic update ve rollback

Acknowledge başladığında Incident beklemeden `Acknowledged` yapılır ve
`pendingAcknowledgementId` komutun sürdüğünü belirtir. Sunucu işlemi başarılıysa
sonuç kalıcılaştırılır ve eski sorgu cache'leri temizlenir. İşlem başarısızsa snapshot
(işlem öncesi kopya) geri yüklenir. UI, komut sürerken butonu devre dışı bırakır.

## Parça 5: Adapter ve uyumluluk kararı

NgRx v22 henüz yayımlanmadığı için peer dependency kontrolü zorlanmadı. Store'un dış
sözleşmesi Angular Signals ile tamamlandı. Resmi NgRx 22 yayımlandığında Page veya UI
değişmeden yalnızca store adapter'ının iç uygulaması geçirilebilir. Ayrıntı
`ADR-0004` belgesindedir.

## Modül 6 kazanımları

- State'i entity, query, selection, async ve command olarak sınıflandırmak.
- Tek state owner (durum sahibi) ve tek yönlü veri akışı kurmak.
- Route-scoped provider ile yaşam alanını sınırlamak.
- Normalize koleksiyonda immutable update (mevcut nesneyi bozmadan güncelleme) yapmak.
- Cache freshness (önbellek tazeliği), manuel refresh ve hata durumlarını yönetmek.
- Optimistic update, pending command ve rollback kalıplarını uygulamak.
