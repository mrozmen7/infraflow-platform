# Implementation Plan, ADR ve Assumption Management

Durum: Aktif referans

## 1. Temel ayrım

### Implementation Plan

Implementation Plan (uygulama planı), onaylı bir specification'ı küçük, sıralı ve
doğrulanabilir teknik adımlara çevirir.

> Hangi dosya veya sınır neden değişecek, hangi sırayla ilerleyeceğiz ve her adımı nasıl
> kanıtlayacağız?

Plan yalnız yapılacaklar listesi değildir. Her adım expected outcome (beklenen sonuç),
verification (doğrulama) ve rollback (geri alma) bilgisi taşımalıdır.

### ADR

Architecture Decision Record veya ADR (mimari karar kaydı), uzun süre etkili, birden fazla
bölümü ilgilendiren veya geri çevrilmesi pahalı bir teknik kararın bağlamını ve gerekçesini
saklar.

> Hangi seçenekler arasından neyi seçtik, neden seçtik ve bunun bedelleri nelerdir?

### Assumption Log

Assumption Log (varsayım kaydı), henüz doğrulanmamış fakat planı etkileyen kabulleri görünür
yapar.

> Şu anda neyi doğru kabul ediyoruz, yanlışsa etkisi ne olur ve nasıl doğrulayacağız?

```text
Specification → Ne ve neden?
Plan          → Nasıl ve hangi sırayla?
ADR           → Kalıcı mimari seçimi neden yaptık?
Assumption    → Henüz doğrulanmamış kabul nedir?
Evidence      → Sonucun doğru olduğuna dair kanıt nedir?
```

## 2. Assumption, constraint, risk ve open question

Bu dört kavram aynı değildir:

| Kavram | Türkçe anlamı | Örnek |
|---|---|---|
| Assumption | Varsayım | Test repository'si save hatası üretebilir kabulü |
| Constraint | Değiştirilemeyen kısıt | Angular 22 ve strict TypeScript korunacak |
| Risk | Gerçekleşebilecek olumsuzluk | Optimistic state hata sonrası ekranda kalabilir |
| Open question | Açık karar sorusu | Audit mesajında actor kimliği nereden gelecek? |

Varsayım gerçek gibi yazılmaz. Her varsayımın validation method (doğrulama yöntemi) ve
status (durum) alanı bulunur. Yanlış çıkması planı veya kapsamı değiştiriyorsa implementasyon
öncesinde doğrulanır.

## 3. İyi planın özellikleri

İyi plan:

- Onaylı specification ve Acceptance Criteria kimliklerine bağlanır.
- Current state (mevcut durum) kanıtını özetler.
- In scope ve out of scope sınırlarını tekrar açıklar.
- Etkilenen domain, application, infrastructure ve UI sınırlarını gösterir.
- Test-first veya characterization-first adımları gerektiğinde önceye koyar.
- Küçük vertical slice (uçtan uca çalışan küçük dilim) üretir.
- Her adım için dosya alanı, davranış, test ve beklenen sonucu belirtir.
- Riskli veya geri dönüşü zor adımdan önce checkpoint (kontrol noktası) koyar.
- Stop condition (durma koşulu) ve escalation point (insan kararına yükseltme noktası) içerir.
- Final quality gate ve evidence update adımını unutmaz.

Zayıf plan:

```text
1. Component'i değiştir.
2. Test yaz.
3. Bitir.
```

Güçlü plan:

```text
1. AC-003 için repository save hatasını üreten Page component testi ekle.
2. Testin mevcut kanıt açığı nedeniyle beklenen noktada başarısız olduğunu doğrula.
3. Gerekirse yalnız hata mesajı/rollback bağlantısını düzelt; domain kuralını değiştirme.
4. İlgili testleri, ardından tam quality gate'i çalıştır.
5. AC-003 evidence map'ini gerçek test yolu ve sonuçla güncelle.
```

## 4. Plan ile kod arasındaki ilişki

Plan, koddan önce yön verir; kod tamamlandıktan sonra çalışan sistemin source of truth'u
değildir. Gerçek davranış production code ve testlerde bulunur. Planın durumu `Completed`
olarak işaretlenir ve sapmalar kaydedilir.

```text
Planlanan adım
      ↓
Küçük değişiklik
      ↓
Yakın test
      ↓
Review checkpoint
      ↓
Sonraki adım
      ↓
Tam quality gate + evidence
```

Bir adım beklenmedik mimari değişiklik gerektiriyorsa agent planı sessizce büyütmez. Etkiyi,
alternatifleri ve gerekli kararı raporlar; gerekirse ADR veya kullanıcı onayı ister.

## 5. ADR ne zaman gerekir?

ADR şu durumlarda uygundur:

- Birden fazla feature veya ekip etkilenecekse.
- Karar uzun süre yaşayacaksa.
- Geri dönüş maliyeti yüksekse.
- Birden fazla makul alternatif varsa.
- Güvenlik, veri, deployment veya bağımlılık yönü değişiyorsa.
- Gelecekte “neden böyle yaptık?” sorusu önemli olacaksa.

ADR gerekmeyen örnekler:

- Bir CSS boşluğunu düzeltmek.
- Mevcut kurala uygun yeni component eklemek.
- Eksik component testini tamamlamak.
- Geçici görev sırasını yazmak.

InfraFlow'daki örnekler:

- ADR 0001: Frontend-first repository stratejisi — kalıcı ve bütün projeyi etkiliyor.
- ADR 0003: Feature katman sınırları — bağımlılık yönünü belirliyor.
- ADR 0004: Angular 22 / NgRx uyumluluk stratejisi — alternatif ve maliyet içeriyor.
- Incident Page'e eksik test eklemek — ADR değil, implementation plan konusudur.

## 6. ADR anatomisi

1. Status (Önerildi, Kabul edildi, Reddedildi, Yerine yenisi geçti).
2. Context (kararı gerektiren durum ve kuvvetler).
3. Decision drivers (kararı etkileyen ölçütler).
4. Considered options (değerlendirilen alternatifler).
5. Decision (seçilen yaklaşım).
6. Consequences (olumlu sonuçlar ve bedeller).
7. Validation/revisit trigger (doğrulama ve yeniden değerlendirme koşulu).

ADR geçmişi silinmez. Karar değişirse eski kayıt `Superseded` (yerine yenisi geçti) yapılır
ve yeni ADR'ye bağlanır. Böylece mimari hafıza korunur.

## 7. Agentic Engineering bağlantısı

Plan, coding agent için bounded execution contract (sınırlandırılmış uygulama sözleşmesi)
görevi görür:

- Hangi dosya alanlarına dokunabileceğini belirtir.
- Hangi kriteri hangi testle kanıtlayacağını söyler.
- Kapsam büyürse nerede duracağını tanımlar.
- Varsayımları gerçekmiş gibi kodlamasını engeller.
- Büyük tek seferlik değişiklik yerine review edilebilir dilimler oluşturur.

Plan yine de insan kararının yerine geçmez. Product kapsamı, güvenlik istisnası veya geri
dönüşü zor veri kararı belirsizse agent durmalı ve karar istemelidir.

## 8. Başka projelere uyarlama

Evrensel plan yapısı korunur; verification adapter (doğrulama uyarlaması) teknolojiye göre
değişir:

- Angular: component/store testleri, architecture guardrail, browser ve build.
- Spring Boot: unit/integration test, transaction, migration, OpenAPI ve security test.
- AI: eval set, tool-call izinleri, human approval ve maliyet sınırı.
- Infrastructure: dry run, policy check, deployment health ve rollback provası.
