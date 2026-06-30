# InfraFlow Product Charter

Durum: İlk eğitim taslağı  
Tarih: 30 Haziran 2026

## 1. Problem

Kritik altyapı tesislerinde arıza bilgisi telefon, e-posta, kağıt form ve birbirinden kopuk eski sistemler arasında dağılabilir. Bunun sonucu olarak doğru ekip geç yönlendirilir, SLA süreleri aşılır, yapılan işlemler tam izlenemez ve kritik kararların kim tarafından verildiği belirsiz kalır.

InfraFlow bu süreci tek bir denetlenebilir iş akışında birleştirmeyi hedefler.

## 2. Ürün amacı

Operatörlerin ve saha teknisyenlerinin arızayı hızlı bildirebildiği; yöneticilerin risk, öncelik ve iş emri kararlarını onaylayabildiği; bütün değişikliklerin audit iziyle saklandığı bir incident ve maintenance platformu oluşturmak.

AI sistemi karar sahibi değildir. Yapılandırılmış öneri üretir; kritik değişiklikler yetkili insan veya deterministik backend kuralı tarafından onaylanır.

## 3. Kullanıcılar

### Operatör

- Gelen arızayı kaydeder ve günceller.
- Olayları önem, konum, kategori ve duruma göre izler.
- Doğru ekibin atanmasını takip eder.

### Saha teknisyeni

- Metin, fotoğraf, ses ve konumla arıza bildirir.
- Kendisine atanan iş emrini başlatır ve ilerletir.
- Yapılan işlemi ve kullanılan parçayı kaydeder.

### Ekip yöneticisi

- Kritik risk ve SLA önerilerini onaylar, düzenler veya reddeder.
- Ekip ve iş emri atamalarını yönetir.
- Eşzamanlı değişiklik ve escalation durumlarını çözer.

### Sistem yöneticisi / denetçi

- Rol ve izinleri yönetir.
- Audit kayıtlarını ve entegrasyon sağlığını inceler.

## 4. Ana senaryo

1. Teknisyen: "X tünelinin 3. kilometresinde trafoda patlama oldu, duman var" şeklinde bildirim yapar.
2. Agent severity, category ve olası asset için yapılandırılmış öneri üretir.
3. Angular, izinli A2UI bileşenleriyle Critical Incident Action Card gösterir.
4. Yönetici öneriyi onaylar, düzenler veya reddeder.
5. Spring Boot authorization ve domain kurallarını doğrular.
6. Work order transaction içinde oluşturulur.
7. Kullanıcı, agent, tool ve business command zinciri audit kaydına alınır.

## 5. İlk ürün kapsamı

- Incident listeleme, filtreleme ve detay görüntüleme
- Incident oluşturma ve güncelleme
- Asset ile incident ilişkilendirme
- Work order taslağı, atama ve durum akışı
- Severity, priority ve SLA takibi
- Rol tabanlı erişim hazırlığı
- Audit için gerekli olay modelinin hazırlanması
- AI destekli sınıflandırma prototipi
- Human-in-the-loop onay akışı

## 6. İlk kapsamın dışında

- Gerçek üretim tesisi entegrasyonu
- Tam teşekküllü ERP veya stok yönetimi
- Native mobil uygulama
- AI'nın bağımsız olarak kalıcı kritik karar alması
- Çok bölgeli production deployment

Bu maddeler eğitim ilerledikçe ayrı kararlarla kapsama alınabilir.

## 7. Temel iş kuralları

- Kritik incident kapatılmadan önce zorunlu güvenlik kontrolü tamamlanmalıdır.
- Yetkisiz kullanıcı severity, SLA veya ekip atamasını değiştiremez.
- Aynı command tekrarlandığında çift work order oluşmamalıdır.
- Onay bekleyen kritik değişiklik kalıcı business state'e uygulanmamalıdır.
- Eşzamanlı değişiklikler sessizce birbirinin üzerine yazılmamalıdır.
- Bütün kritik değişikliklerde kim, neyi, ne zaman ve neden değiştirdiği izlenmelidir.

## 8. Başarı ölçütleri

- Ana incident akışı masaüstü ve saha boyutlarında tamamlanabilir.
- Kritik iş kuralları otomatik testlerle kanıtlanır.
- Production build ve CI kalite kapıları sürekli başarılıdır.
- Temel akışlar klavye ile kullanılabilir.
- Yetkisiz ve tekrar eden işlemler backend tarafından reddedilir.
- Kritik kullanıcı akışı end-to-end test ile doğrulanır.

## 9. Başlangıç sözlüğü

- **Incident:** Operasyon veya güvenlik üzerinde etkisi olan arıza/olay kaydı.
- **Asset:** Tünel, trafo, sensör veya pompa gibi yönetilen fiziksel varlık.
- **Work Order:** Bir incident'ı çözmek için planlanan ve atanan iş.
- **Severity:** Olayın etkisinin teknik ciddiyeti.
- **Priority:** İşin diğer işlere göre ne kadar önce ele alınacağı.
- **SLA:** Müdahale veya çözüm için kabul edilen süre hedefi.
- **Audit trail:** Kritik eylemlerin değiştirilemez biçimde izlenebilmesi.

