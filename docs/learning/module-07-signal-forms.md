# Modül 7: Signal Forms ve Kurumsal Formlar

Durum: Tamamlandı

## Amaç

InfraFlow'a `/incidents/new` adresinde gerçek bir Incident oluşturma akışı eklendi.
Form yalnızca alanları ekrana koymaz; tip güvenliği, doğrulama, submit yaşam döngüsü,
hata yönetimi, erişilebilirlik ve mimari sınırları birlikte uygular.

## Temel çalışma modeli

```text
signal<IncidentFormModel>
        ↓
form() → FieldTree (tip güvenli alan ağacı)
        ↓
[formField] → input/select/textarea ile iki yönlü senkronizasyon
        ↓
schema → required, length, pattern ve cross-field kuralları
        ↓
FormRoot / submit → touched → validation → action
        ↓
IncidentStore → createIncident use case → IncidentRepositoryPort
        ↓
oluşan Incident → normalize state → detail route
```

## Neden ayrı bir form modeli var?

`IncidentFormModel`, kullanıcının yazdığı geçici draft'ı (taslağı) temsil eder.
`Incident` ise sistem tarafından kabul edilmiş kayıttır. Form modelinde `id`,
`reportedAt` ve `status` yoktur; bunları repository oluşturur. Böylece frontend,
sunucunun sahip olması gereken kimlik ve zaman üretme sorumluluğunu üstlenmez.

Form gönderilirken metin hâlindeki operational signals (operasyon sinyalleri)
ayrıştırılır ve `NewIncident` sözleşmesine dönüştürülür.

## Signal Forms parçaları

- `signal()`: Form draft'ının tek veri kaynağıdır.
- `form()`: Modelin yapısından tip güvenli `FieldTree` üretir.
- `FormField`: `[formField]` ile native kontrolleri alan state'ine bağlar.
- `FormRoot`: Submit olayını yakalar ve tarayıcının sayfayı yenilemesini engeller.
- `required`, `minLength`, `maxLength`, `pattern`: Alan doğrulamalarıdır.
- `validate`: Özel ve alanlar arası doğrulama üretir.
- `touched`, `dirty`, `invalid`, `submitting`: Reaktif form durumlarıdır.
- `reset`: Modeli ve etkileşim durumunu başlangıç değerlerine döndürür.

## Uygulanan iş kuralları

- Başlık, açıklama, konum ve Asset ID zorunludur.
- Başlık 8–120, açıklama 20–1000 karakter aralığındadır.
- Asset ID `TRF-NT-003` benzeri kurumsal formata uymalıdır.
- Critical severity (kritik ciddiyet) yalnızca P1 priority ile gönderilebilir.
- Critical olayda immediate safety risk (acil güvenlik riski) insan tarafından
  onaylanmalıdır.
- High severity olay P4 priority kullanamaz.
- Operational signals virgül, noktalı virgül veya satır sonundan ayrıştırılır.

## Neden validation yalnızca UI'da değil?

Tarayıcı doğrulaması kullanıcı deneyimidir; güvenlik sınırı değildir. İstek başka bir
istemciden gönderilebilir veya UI kontrolü atlanabilir. Bu nedenle `createIncident`
use case'i zorunlu metinleri yeniden kontrol eder, boşlukları temizler, Asset ID'yi
büyük harfe çevirir ve tekrarlanan sinyalleri kaldırır.

## Submit yaşam döngüsü

1. Kullanıcı `Create incident` butonuna basar.
2. Signal Forms bütün interaktif alanları touched (dokunulmuş) yapar.
3. Hatalıysa action çalışmaz ve ilk hatalı kontrole odaklanılır.
4. Geçerliyse root `submitting` olur; ikinci submit engellenir.
5. Store, use case ve repository üzerinden Incident oluşturulur.
6. Başarılıysa `/incidents/:id` detay sayfasına gidilir.
7. Repository hatası form seviyesinde erişilebilir bir submit hatasına dönüşür.

## Route sıralaması

`new` rotası `:incidentId` rotasından önce tanımlandı. Aksi halde Router `new`
kelimesini bir Incident ID sanıp detail resolver'ı çalıştırırdı.

## Test kapsamı

- Boş form gönderiminin engellenmesi ve ilk alana odaklanma.
- Critical/P1 ve safety confirmation alanlar arası kuralları.
- Geçerli typed draft'ın store'a gönderilmesi ve detay navigasyonu.
- Repository hatasının submit hatası olarak gösterilmesi.
- Use case normalizasyonu ve UI atlandığında zorunlu alan kontrolü.
- Store'un yeni kaydı normalize state'e ekleyip seçmesi.
- `/incidents/new` lazy route'unun `:incidentId` rotasından önce eşleşmesi.

## Kaynaklar

- Angular Signal Forms: https://angular.dev/guide/forms/signals/overview
- Validation: https://angular.dev/guide/forms/signals/validation
- Form submission: https://angular.dev/guide/forms/signals/form-submission
