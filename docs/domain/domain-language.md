# InfraFlow Domain Dili

Sürüm: 0.1  
Durum: Eğitim sırasında geliştirilecek ortak sözlük

## Domain dili nedir?

Domain dili, işi yapan uzmanlarla yazılım ekibinin aynı kavramları aynı anlamda kullanmasıdır. Bir kelime ekranda, TypeScript kodunda, Spring Boot servisinde, testte ve AI tool açıklamasında farklı anlamlara gelmemelidir.

Örneğin `Incident`, UI'da arıza kaydı; backend'de destek talebi; AI tarafında serbest metin anlamına gelirse sistem zamanla çelişir. Bu nedenle aşağıdaki kelimeler InfraFlow'un ortak dilidir.

## Temel kavramlar

### Incident

Operasyon, güvenlik veya hizmet sürekliliğini etkileyen olay kaydıdır.

Şu soruya cevap verir: **Ne oldu?**

Örnek: Tünelin 3. kilometresindeki trafodan duman çıkıyor ve aydınlatma kesildi.

Incident bir yapılacak işler listesi değildir. Sorunu ve etkisini kayıt altına alır.

### Asset

İzlenen, bakımı yapılan veya bir Incident'tan etkilenebilen fiziksel ya da mantıksal varlıktır.

Şu soruya cevap verir: **Ne etkilendi?**

Örnekler:

- Trafo `TR-03`
- Tünel aydınlatma devresi `LIGHT-CIRCUIT-A`
- Havalandırma fanı `FAN-12`
- Duman sensörü `SMOKE-044`

Bir Asset zaman içinde birden fazla Incident yaşayabilir.

### Work Order

Bir Incident'ı araştırmak, güvenli hale getirmek veya çözmek için planlanan ve takip edilen iştir.

Şu soruya cevap verir: **Ne yapılacak?**

Örnek: Enerji hattını izole et, trafoyu kontrol et ve hasarlı parçayı değiştir.

Bir Incident birden fazla Work Order gerektirebilir. Önce güvenlik, ardından teşhis ve onarım işi açılabilir.

### Severity

Incident'ın insan, operasyon, çevre veya ekipman üzerindeki teknik etkisinin ciddiyetidir.

Şu soruya cevap verir: **Olay ne kadar ciddi?**

Başlangıç seviyeleri:

| Seviye | Anlam | Örnek |
|---|---|---|
| Low | Küçük etki, hizmet devam ediyor | Yedek sensörde geçici veri kaybı |
| Medium | Sınırlı operasyon etkisi | Tek bir aydınlatma grubunun arızası |
| High | Büyük hizmet veya güvenlik etkisi | Havalandırmanın kısmen devre dışı kalması |
| Critical | Can güvenliği veya sistemin tamamı riskte | Duman, yangın veya tünel genelinde enerji kaybı |

Severity sırf ekip müsait olduğu için değişmez. Olayın etkisi değişirse yeniden değerlendirilir.

### Priority

Incident veya Work Order'ın diğer işlere göre hangi sırada ele alınacağını belirtir.

Şu soruya cevap verir: **Ne kadar önce müdahale etmeliyiz?**

Başlangıç seviyeleri:

| Seviye | Anlam |
|---|---|
| P1 | Derhal müdahale |
| P2 | Çok yüksek öncelik |
| P3 | Planlanmış normal iş |
| P4 | Düşük öncelik / backlog |

Severity ile Priority ilişkilidir fakat aynı değildir. Kritik bir olay genellikle P1 olur; ancak iş sırası operasyon koşulları, bağımlılıklar ve güvenli erişim nedeniyle ayrıca belirlenir.

### SLA

Bir Incident'a ne kadar sürede cevap verilmesi veya çözüm üretilmesi gerektiğini tanımlayan hizmet hedefidir.

Şu soruya cevap verir: **Hangi zamana kadar harekete geçmeli veya çözmeliyiz?**

İki ayrı hedef kullanacağız:

- **Response SLA:** Olayın kabul edilmesi ve ilk müdahalenin başlatılması.
- **Resolution SLA:** Olayın çözülmesi veya kabul edilen güvenli duruma getirilmesi.

Süre değerleri eğitim sırasında keyfi seçilmeyecek; iş sözleşmesi veya operasyon politikası olarak tanımlanacaktır.

### Audit Trail

Kritik kararlarda kim, neyi, ne zaman ve neden yaptı sorularının sıralı kaydıdır.

Şu soruya cevap verir: **Bu sonuca nasıl geldik?**

Audit yalnızca teknik log değildir. Yetki, onay ve business state değişikliklerini anlaşılır biçimde gösterir.

## Aktörler

### Operator

Incident'ı kaydeder, ilk bilgileri doğrular ve operasyon akışını izler.

### Field Technician

Sahadaki Asset'i inceler, kendisine atanan Work Order üzerinde çalışır ve bulguları kaydeder.

### Team Manager

Atama, kritik Priority/SLA değişikliği ve yüksek riskli aksiyonları onaylar.

### System Administrator / Auditor

Rol, izin, sistem konfigürasyonu ve Audit Trail incelemesinden sorumludur.

## Incident yaşam döngüsü

```text
Reported
   ↓
Triaged
   ↓
Mitigation In Progress
   ↓
Resolved
   ↓
Closed
```

- **Reported:** Bildirim alındı, bilgiler henüz doğrulanmamış olabilir.
- **Triaged:** Kategori, Severity, Priority ve etkilenen Asset değerlendirildi.
- **Mitigation In Progress:** Güvenli hale getirme veya çözüm çalışması sürüyor.
- **Resolved:** Teknik çözüm uygulandı; kapanış kontrolü bekleyebilir.
- **Closed:** Gerekli kontroller ve kayıtlar tamamlandı.

Resolved ile Closed farklıdır. Teknisyen sorunu çözebilir; fakat güvenlik kontrolü ve operasyon doğrulaması tamamlanmadan kayıt kapatılamaz.

## Work Order yaşam döngüsü

```text
Draft → Approved → Assigned → In Progress → Completed
                       ↘ Blocked
Draft / Approved → Cancelled
```

- **Draft:** İş tanımı hazırlanıyor, henüz yürütülemez.
- **Approved:** Gerekli onaylar tamamlandı.
- **Assigned:** Yetkili ekip veya teknisyene verildi.
- **In Progress:** Saha çalışması başladı.
- **Blocked:** Güvenlik, parça veya erişim engeli var.
- **Completed:** İşin kabul kriterleri tamamlandı.
- **Cancelled:** İş kontrollü ve gerekçeli biçimde iptal edildi.

## Command, Event ve Recommendation farkı

### Command

Sistemin bir şey yapması için verilen niyettir.

Örnek: `CreateWorkOrder`, `ApproveSlaChange`.

Command başarısız olabilir; çünkü yetki veya iş kuralı tarafından reddedilebilir.

### Event

Geçmişte gerçekleşmiş ve sistem tarafından kabul edilmiş gerçektir.

Örnek: `IncidentReported`, `WorkOrderAssigned`.

Event geçmiş zamanlıdır ve "oldu" anlamına gelir.

### Recommendation

AI veya karar destek sistemi tarafından üretilen, henüz uygulanmamış öneridir.

Örnek: "Severity değerini Critical yapmayı öneriyorum."

Recommendation ne Command ne de Event'tir. Yetkili kullanıcı onaylamadan business state'i değiştirmez.

## Başlangıç iş kuralları

1. Bildirim anında birincil Asset bilinmeyebilir; Triaged aşamasından çıkmadan önce doğrulanmalıdır.
2. Critical Incident, zorunlu güvenlik kontrolü olmadan Closed durumuna geçemez.
3. Work Order mutlaka bir Incident ile ilişkilidir.
4. Severity ve Priority değişiklikleri gerekçe ve Audit Trail gerektirir.
5. AI Recommendation doğrudan kalıcı state değişikliği oluşturmaz.
6. Aynı Command tekrar gönderildiğinde çift Work Order oluşmamalıdır.
7. SLA aşımı Incident'ı otomatik kapatmaz veya Severity değerini kendiliğinden değiştirmez.

## Örnek cümle

> Operator, TR-03 Asset'ini etkileyen Critical Severity seviyesindeki Incident'ı kaydetti. Team Manager P1 Priority değerini onayladı. Field Technician'a enerji izolasyonu için bir Work Order atandı. AI'nın sınıflandırması Recommendation olarak Audit Trail'e eklendi.

Bu cümlede her kelime UI, Angular modeli, API sözleşmesi, backend ve testlerde aynı anlamı taşımalıdır.

