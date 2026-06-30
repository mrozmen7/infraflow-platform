# Aşama 1: Modern Angular Temelleri

## Aşamanın amacı

Angular'ın modern zihinsel modelini öğrenerek InfraFlow'un ilk çalışan dikey dilimini oluşturmak. Bu aşamanın sonunda mock veriyle çalışan, test edilen ve production build alan bir Incident ekranı bulunacaktır.

## Modül 1: Ürün, Alan ve Workspace Başlangıcı

### Anlamı

Kod yazmadan önce ne inşa ettiğimizi, kimin kullanacağını ve proje araçlarının nasıl çalışacağını belirleriz. Workspace, projenin kaynak kodunu, testini, build ayarlarını ve geliştirme komutlarını bir arada yöneten çalışma alanıdır.

### Neden önce gelir?

Ürün sınırı bilinmeden iyi klasör yapısı veya doğru component tasarlanamaz. Desteklenmeyen Node sürümüyle yapılan kurulum da daha sonra rastgele build sorunlarına dönüşür.

### Çıkış kapısı

- Product Charter hazırdır.
- Desteklenen Node ve Angular sürümü sabitlenmiştir.
- Angular uygulaması çalışır.
- Test ve production build başarılıdır.

## Modül 2: Component ve Template Modeli

### Anlamı

Component, ekrandaki bir parçanın davranışı ile görünümünü bir araya getirir. Template, kullanıcıya gösterilecek HTML yapısını ve verinin ekrana nasıl bağlandığını tanımlar.

### Neden ikinci sırada?

Angular uygulamasının görünen bütün feature'ları component'lerden oluşur. Veri akışını öğrenmeden state yönetimine geçmek, sorumlulukların yanlış yere konmasına yol açar.

### Uygulama

Incident listesi, Incident kartı, filtre çubuğu ve empty/loading/error görünümleri.

## Modül 3: Dependency Injection ve Routing

### Anlamı

Dependency Injection bir sınıfın ihtiyaç duyduğu servisi kendisinin üretmesi yerine dışarıdan almasını sağlar. Routing ise URL'yi uygulamadaki feature ve ekranlarla eşleştirir.

### Neden üçüncü sırada?

Component sözleşmelerini gördükten sonra servislerin yaşam sürelerini ve feature'ların nasıl ayrılıp lazy yükleneceğini anlamak daha kolaydır.

### Uygulama

App shell, Incident/Assets/Work Orders lazy route'ları, hata rotaları ve runtime config.

## Modül 4: Signals, RxJS ve Test Temelleri

### Anlamı

State, uygulamanın o andaki hafızasıdır. Signal bu hafızadaki bir değeri ve ona bağlı hesapları takip eder. RxJS zaman içinde gelen asenkron olay akışlarını yönetir. Testler beklenen davranışın bozulmadığını kanıtlar.

### Neden dördüncü sırada?

Signals veya RxJS'i doğru kullanmak için önce state'in hangi component veya feature'a ait olduğunu bilmek gerekir. Aksi halde aynı veri farklı yerlerde tutulur ve birbirinden kopar.

### Uygulama

Incident arama, filtreleme, seçim, detay yükleme, loading/error state ve race condition testleri.

## Aşama sırası

```text
Ürün ve workspace
        ↓
Component sözleşmeleri
        ↓
Servis ve route sınırları
        ↓
State, asenkron akış ve test
        ↓
Çalışan Incident dikey dilimi
```

