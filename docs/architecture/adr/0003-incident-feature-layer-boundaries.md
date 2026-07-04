# ADR 0003: Incident Feature Katman Sınırları

- Durum: Kabul edildi
- Tarih: 4 Temmuz 2026

## Bağlam

Aşama 1'de Incident dikey dilimi URL'den veri erişimine kadar çalışır hâle geldi. Ancak kullanım senaryosu koordinasyonu `IncidentListPage` içinde, repository portu ile Angular `InjectionToken` aynı dosyada ve mimari sınırlar ağırlıklı olarak klasör adları ile code review üzerinden korunuyor. Feature büyüdüğünde bu yapı page component'lerinin büyümesine, iş kurallarının UI'a sızmasına ve adapter ayrıntılarının domain sözleşmelerini etkilemesine yol açabilir.

## Karar

Incident feature aşağıdaki sorumluluklara ayrılacaktır:

```text
presentation   -> Angular page ve UI component'leri
application    -> kullanım senaryoları, command/query koordinasyonu ve portlar
domain         -> framework bağımsız iş kavramları ve invariant'lar
infrastructure -> mock/HTTP adapter'ları ve dış veri eşleme
```

Bağımlılık yönleri:

```text
presentation   -> application -> domain
infrastructure -> application -> domain
```

Ek kurallar:

- `domain` Angular, Router, HTTP, browser ve presentation import etmeyecektir.
- `application` Angular UI ayrıntılarını ve somut adapter'ları bilmeyecektir.
- `presentation` somut mock/HTTP adapter oluşturmayacak; application portlarını kullanacaktır.
- `infrastructure` dış DTO'ları domain modeline çevirecektir.
- Feature dışına yalnızca bilinçli bir public API açılacaktır.
- Geçiş küçük ve davranışı koruyan dilimlerle yapılacaktır; çalışan route bir kerede yeniden yazılmayacaktır.

## Geçiş sırası

1. Mevcut davranışı testlerle sabitle.
2. Domain invariant ve value object'lerini framework bağımsız testlerle ekle.
3. Application port ve use case'lerini tanımla.
4. Mock adapter'ı infrastructure katmanına taşı ve provider bağlantısını güncelle.
5. Presentation katmanını application sözleşmelerine bağla.
6. Public API ve architecture fitness testlerini ekle.

## Sonuçlar

### Olumlu

- Angular ve backend ayrıntıları değişse bile domain kuralları korunur.
- Kullanım senaryoları component dışında test edilebilir.
- Mock ve HTTP adapter değişimi feature UI'ını etkilemez.
- Yasak bağımlılıklar otomatik test edilebilir.

### Maliyet

- Daha fazla dosya ve açık sözleşme oluşur.
- Basit CRUD işlemlerinde gereksiz soyutlama üretmeme disiplini gerekir.
- Geçiş süresince eski ve hedef klasör isimleri kısa süre birlikte bulunabilir.

## Bilinçli sınır

NgRx Signal Store bu ADR'nin parçası değildir; state yönetimi Modül 6'da application sınırlarının üzerine eklenecektir.

## Uygulama sonucu

- Application repository portu abstract class olarak tanımlandı. Böylece Angular, bu saf TypeScript portunu runtime DI token olarak kullanabilir; application katmanı Angular import etmez.
- `pages` ve `ui` klasörleri presentation sınırını zaten açıkça ifade ettiği için ek bir `presentation/` sarmalayıcısı oluşturulmadı. Bağımlılık kuralı, gereksiz klasör derinliğinden daha değerlidir.
- Root uygulama Incidents feature'ına yalnızca `public-api.ts` ve lazy `incidents.routes.ts` girişlerinden erişir.
- Mimari bağımlılık kuralları Node.js tabanlı fitness script'i ile CI içinde doğrulanır.
