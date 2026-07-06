# Specification, Acceptance Criteria ve Definition of Done

Durum: Aktif referans

## 1. Üç kavramın farkı

### Specification

Specification (özellik tanımı), hangi problemi kim için çözdüğümüzü, beklenen davranışı,
kapsamı, iş kurallarını ve riskleri tarif eder. Ana sorusu şudur:

> Ne inşa ediyoruz ve neden?

Specification implementasyon planı değildir. `computed()` mı RxJS mi kullanılacağını
normalde söylemez; kullanıcı ve sistem açısından gözlenebilir sonucu tanımlar.

### Acceptance Criteria

Acceptance Criteria (kabul kriterleri), tek bir özelliğin kabul edilebilmesi için doğru
olması gereken ölçülebilir örneklerdir. Ana sorusu şudur:

> Bu özelliğin doğru çalıştığını hangi somut senaryolarla anlayacağız?

Kriterler mümkün olduğunda Given/When/Then (Başlangıç/eylem/beklenen sonuç) biçiminde
yazılır. Bu biçim Gherkin (davranış senaryosu dili) olarak da bilinir; ancak bir araç veya
özel test framework'ü kullanmayı zorunlu kılmaz.

### Definition of Done

Definition of Done veya DoD (tamamlanma tanımı), tek bir özelliğin davranışından bağımsız
olarak ekibin her teslimatta beklediği ortak kalite seviyesidir. Ana sorusu şudur:

> Doğru davranışın yanında hangi mühendislik kanıtları tamamlanmadan iş bitti denemez?

```text
Specification      → Ne ve neden?
Acceptance Criteria → Bu özellik doğru mu?
Definition of Done  → Bu değişiklik teslim edilebilir kalitede mi?
Implementation Plan → Bunu hangi teknik adımlarla yapacağız?
```

## 2. Neden yalnız user story yetmez?

User story (kullanıcı hikâyesi) ihtiyacı kısa biçimde anlatır:

```text
Bir operatör olarak açık Incident'ın sorumluluğunu kabul etmek istiyorum;
böylece ekip olayın sahipsiz olmadığını görebilsin.
```

Bu cümle niyeti verir fakat şu soruları cevaplamaz:

- Yalnız `Open` durumundaki kayıt mı kabul edilebilir?
- İstek sürerken ikinci tıklamada ne olur?
- Kayıt başarısız olursa ekrandaki durum geri alınır mı?
- Klavye ve screen reader (ekran okuyucu) kullanıcısı sonucu nasıl öğrenir?
- Bu işlem gerçek authorization (yetkilendirme) sağlıyor mu?

Bu yüzden user story başlangıçtır; specification ve kabul kriterlerinin yerine geçmez.

## 3. İyi bir specification anatomisi

1. Kimlik, durum ve owner (sorumlu kişi/ekip).
2. Problem ve ölçülebilir outcome (beklenen sonuç).
3. Actor (eylemi yapan rol) ve stakeholder (sonuçtan etkilenen taraf).
4. In scope (bu teslimata dahil) ve out of scope (bilinçli olarak hariç).
5. Functional requirement (işlevsel gereksinim).
6. Business rule (iş kuralı).
7. Non-functional requirement (performans, güvenlik, erişilebilirlik gibi kalite gereksinimi).
8. Normal, hata, sınır ve concurrency (eşzamanlılık) senaryoları.
9. Veri, API, audit ve authorization etkisi.
10. Varsayımlar, bağımlılıklar, açık sorular ve riskler.
11. Numaralı kabul kriterleri.
12. Implementation sonrasında eklenecek evidence map (kanıt eşleme tablosu).

Her küçük değişiklik için ağır bir belge gerekmez. Risk düşükse tek paragraf kapsam ve üç
kabul kriteri yeterli olabilir. Yetki, para, kişisel veri, kritik altyapı veya geri dönüşü
zor state değişimi varsa ayrıntı artırılır. Buna risk-based rigor (riske göre ayrıntı)
denir.

## 4. Test edilebilir kriter yazma

Belirsiz:

```text
Ekran hızlı ve kullanıcı dostu olmalıdır.
```

Test edilebilir:

```text
Given açık bir Incident gösterilirken
When operatör Acknowledge düğmesini klavyeyle etkinleştirdiğinde
Then bekleme durumu görünür ve erişilebilir biçimde bildirilir
And başarılı sonuçta Incident durumu Acknowledged olur.
```

Bir kriter implementation detail (uygulama ayrıntısı) yazmamalıdır:

```text
Yanlış: Component bir signal değerini true yapmalıdır.
Doğru: İstek sürerken aynı işlem ikinci kez başlatılamamalıdır.
```

İlk cümle nasıl yapıldığını, ikinci cümle dışarıdan gözlenen davranışı tarif eder.

## 5. Acceptance Criteria ile DoD farkı

| Soru | Acceptance Criteria | Definition of Done |
|---|---|---|
| Kapsam | Tek özellik | Bütün teslimatlar |
| Sahip | Product + engineering | Engineering team |
| Örnek | Başarısız kayıtta durum geri alınır | Tüm testler ve build başarılıdır |
| Değişim sıklığı | Özelliğe göre | Ekip standardı değiştiğinde |
| Kanıt | Senaryo testi veya demo | Quality gate, review ve evidence package |

Kabul kriterlerinin tamamlanması DoD'nin otomatik tamamlandığı anlamına gelmez. Davranış
doğru olabilir fakat güvenlik kontrolü, doküman veya production build eksik olabilir.

## 6. Agentic engineering bağlantısı

Coding agent'a yalnız “Acknowledge özelliğini geliştir” denirse agent boşlukları kendi
varsayımlarıyla doldurur. Profesyonel task packet (görev paketi) şunları bağlar:

```text
Specification
      ↓
Acceptance Criteria
      ↓
Implementation Plan
      ↓
Tests + Code
      ↓
Definition of Done
      ↓
Evidence Package
```

Agent kabul kriterini değiştiremez; çelişki veya eksik bulursa görünür yapar. Başarısız
testi silerek DoD'yi geçmiş sayamaz. Kritik belirsizlik product veya domain kararıysa
insan kontrol noktasında durur.

## 7. InfraFlow standardı

- Her feature specification benzersiz kimlik ve durum taşır.
- `Must` zorunlu, `Should` güçlü beklenti, `Could` isteğe bağlı davranıştır.
- Her zorunlu gereksinim en az bir kabul kriterine bağlanır.
- Frontend görünürlüğü authorization kanıtı olarak yazılmaz.
- Hata, empty state, loading, concurrency ve accessibility bilinçli olarak değerlendirilir.
- Implementation tamamlandığında kriter → test → dosya bağlantısı evidence map'e eklenir.
- `N/A` yalnız gerekçeyle kullanılır; kontrol sessizce atlanmaz.

## 8. Başka projelere uyarlama

Evrensel çekirdek korunur: problem, kapsam, iş kuralları, kalite riskleri, kabul kriterleri
ve kanıt. Project adapter (projeye özgü uyarlama) değiştirilir:

- Angular: component, route, accessibility, browser ve `npm run quality` kanıtı.
- Spring Boot: authorization, transaction, database migration, contract ve integration test.
- Veri projesi: schema, veri kalitesi, lineage ve tekrar çalıştırılabilirlik.
- AI projesi: eval set, hallucination sınırı, tool permission ve human approval.

Bu nedenle yöntem bütün projelerde standart olabilir; aynı şablonu düşünmeden kopyalamak
yerine risk ve teknoloji bölümleri uyarlanmalıdır.
