# Legacy Refactoring Playbook

Durum: Aktif referans

## 1. Kavramlar

Legacy code (miras/eski kod), yalnız yaşı büyük kod değildir; değiştirilmesi riskli ve
davranış kanıtı zayıf koddur. Refactoring (davranışı koruyarak iç tasarımı iyileştirme),
kullanıcıya görünen sonucu değiştirmeden kodun yapısını düzeltir.

Characterization test (mevcut davranışı tanımlayan test), kodun idealde ne yapması
gerektiğini değil bugün gözlenen kritik davranışı kaydeder. Böylece refactor sırasında
istemeden değişen davranış görünür olur.

## 2. Güvenli akış

```text
Hotspot seç
   ↓
Mevcut davranışı gözle ve sınırı çiz
   ↓
Characterization test yaz → Red nedeni doğru mu?
   ↓
En küçük seam'i oluştur
   ↓
Davranışı değiştirmeden kodu taşı
   ↓
Yakın testler + regression testleri
   ↓
Full quality gate + diff review
```

Seam (ayırma dikişi), bağımlılığı veya davranışı büyük yeniden yazım yapmadan ayırabileceğimiz
noktadır. Constructor'a saat fonksiyonu vermek, zaman davranışını deterministik test etmek için
bir seam örneğidir.

## 3. InfraFlow hotspot analizi

`IncidentStore` şu sorumlulukları birlikte taşıyordu:

1. Query state (sorgu durumu),
2. Angular resource lifecycle,
3. normalized entity state,
4. optimistic commands,
5. cache key üretimi,
6. TTL (time-to-live — önbellek yaşam süresi),
7. cache invalidation (önbellek geçersiz kılma).

Cache davranışı bağımsız bir business capability değildir; fakat Store'un anlaşılmasını ve
zaman sınırı testini zorlaştıran ayrı bir teknik sorumluluktur. Bu yüzden küçük ve düşük
riskli refactor hedefi seçildi.

## 4. Kilitlenen mevcut davranışlar

`IncidentQueryCache characterization` testleri şunları korur:

- Search term farklı büyük/küçük harfle gelse de aynı cache key kullanılır.
- Sonuç TTL dolmadan fresh (taze) kabul edilir.
- Tam TTL sınırında sonuç expired (süresi dolmuş) kabul edilir ve silinir.
- Manual reload yalnız aktif query kaydını siler.
- State-changing command sonrası bütün query sonuçları temizlenebilir.

Saat, `now: () => number` dependency (bağımlılığı) olarak verildi. Test gerçek zamanı
beklemez; 1000 ms'den 31000 ms'ye kontrollü biçimde ilerler. Böylece test hızlı ve
deterministic (aynı girdide aynı sonucu veren) olur.

## 5. Önce ve sonra

```text
ÖNCE
IncidentStore
 ├─ UI state
 ├─ resource
 ├─ optimistic commands
 └─ Map + key + TTL + expiry

SONRA
IncidentStore ──kullanır──> IncidentQueryCache
 ├─ UI/resource orchestration    ├─ key
 └─ command orchestration        ├─ TTL
                                └─ get/set/delete/clear
```

Store hâlâ cache'in ne zaman temizleneceğine karar verir; Cache sınıfı ise bir kaydın nasıl
tutulduğunu ve ne zaman süresinin dolduğunu bilir. Policy ownership (kural sahipliği) bu
şekilde açık kalır.

## 6. Refactor ile feature değişikliği arasındaki sınır

Bu refactor sırasında şunlar yapılmadı:

- TTL değeri değiştirilmedi (`30_000 ms` kaldı).
- Search term trim veya locale davranışı yeniden tanımlanmadı.
- Yeni persistence veya browser storage eklenmedi.
- Cache bütün feature'lar için generic framework yapılmadı.
- Kullanıcı arayüzü değiştirilmedi.

Bu değişiklikler yararlı olabilir; fakat ayrı specification ve davranış kararı gerektirir.
Refactor içine gizlenirse review zorlaşır ve rollback belirsizleşir.

## 7. Legacy sistemlerde risk seviyesine göre yaklaşım

| Risk | Örnek | Yaklaşım |
|---|---|---|
| Low | Saf formatter veya cache key | Unit characterization + küçük extraction |
| Medium | Store command ve rollback | Integration test + küçük dikey adım |
| High | Payment, authorization, migration | Golden master/contract test, observability, staged rollout, insan onayı |

Golden master (altın ana çıktı), karmaşık mevcut sistemin geniş çıktısını snapshot/record ile
korur. Her yerde ilk tercih değildir; anlamlı davranış testine dönüştürülebildiği ölçüde
parçalanmalıdır.

## 8. Stop conditions

Şu durumlarda refactor durdurulur:

- Mevcut davranışın ürün açısından doğru olup olmadığı bilinmiyorsa,
- public contract değişmesi gerekiyorsa,
- veri migration veya production state değişimi gerekiyorsa,
- test kurmak için kritik güvenlik kuralını gevşetmek gerekiyorsa,
- diff tek review'da anlaşılmayacak kadar büyüdüyse,
- characterization test beklenmeyen production bug'ını “doğru davranış” diye kilitliyorsa.

## 9. Şirkette nasıl anlatırsın?

> “IncidentStore'daki cache sorumluluğunu hotspot olarak seçtim. Büyük rewrite yapmadan önce
> case-insensitive key, TTL boundary, delete ve clear davranışlarını characterization
> testleriyle kilitledim. Saati dependency olarak verip testleri deterministik yaptım. Cache'i
> ayrı sınıfa çıkardıktan sonra Store regression testlerini ve tam quality gate'i çalıştırdım;
> kullanıcı davranışını değiştirmedim.”

