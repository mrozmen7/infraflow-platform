# Modül 2: Component ve Template Modeli

## Modül amacı

Angular ekranlarını sorumluluğu açık, erişilebilir ve test edilebilir component'lere ayırmak; TypeScript verisiyle HTML görünümü arasındaki veri akışını öğrenmek.

## Dersler

1. Component (ekrandaki belirli görevi yöneten bağımsız Angular parçası)
2. Template (component'in HTML görünümü) ve Binding (TypeScript ile HTML arasındaki bağlantı)
3. Control Flow (template içinde koşul ve liste yönetimi)
4. Input ve Output (parent-child veri ve olay sözleşmeleri)
5. Component Composition (küçük component'lerden büyük ekran oluşturma)
6. Incident List, Filter Bar ve Empty State uygulaması
7. Component Test ve Accessibility review'u

## Ders 1: Component çalışma modeli

Bir Angular component dört temel parçayı birleştirir:

- `class` (veri ve davranışı taşıyan TypeScript sınıfı)
- `template` (kullanıcıya gösterilen HTML yapısı)
- `style` (component'in görsel kuralları)
- `selector` (component'in HTML içindeki özel etiket adı)

Component tek ve anlaşılır bir kullanıcı sorumluluğu taşımalıdır. `IncidentCard`, tek bir Incident özetini ve onun doğrudan kullanıcı aksiyonunu gösterir; bütün sayfanın filtreleme ve yükleme sorumluluğunu almaz.

## Ders 2: Template ve Binding

### Interpolation (TypeScript değerini metin olarak HTML'de gösterme)

```html
<h2>{{ title }}</h2>
```

Angular class içindeki `title` değerini okuyup ekranda metin olarak gösterir.

### Property Binding (HTML element özelliğini TypeScript değerine bağlama)

```html
<button [disabled]="acknowledged">...</button>
```

`acknowledged` true olduğunda button'ın gerçek `disabled` özelliği etkinleşir.

### Attribute Binding (HTML attribute değerini dinamik olarak bağlama)

```html
<article [attr.aria-labelledby]="incidentId + '-title'">...</article>
```

Erişilebilirlik için `aria-labelledby` attribute'u doğru başlık id'sine bağlanır.

### Class Binding (CSS class'ını koşula göre ekleme veya kaldırma)

```html
<article [class.incident-card--acknowledged]="acknowledged">...</article>
```

Incident kabul edildiğinde görsel durum class'ı eklenir.

### Event Binding (kullanıcı olayını TypeScript metoduna bağlama)

```html
<button (click)="acknowledge()">...</button>
```

Kullanıcı click olayı oluşturduğunda Angular `acknowledge()` metodunu çalıştırır.

## Veri akışı

```text
TypeScript değeri
       ↓
Template binding
       ↓
Browser ekranı
       ↓
Kullanıcı click olayı
       ↓
TypeScript metodu
       ↓
Güncellenen görünüm
```

Bu derste veri component'in kendi içinde tutulur. Parent component'ten veri alma ve parent'a olay gönderme sözleşmesi Ders 4'te `input()` ve `output()` ile öğretilecektir.

## Ders 3: Control Flow

Control Flow (template içindeki koşul ve tekrar akışını yönetme), hangi HTML parçalarının ne zaman ve kaç kez gösterileceğini belirler.

### `@if` (koşula göre görünüm seçme)

```html
@if (acknowledged) {
  <p role="status">Incident acknowledged by operator</p>
} @else {
  <button type="button">Acknowledge incident</button>
}
```

Incident henüz kabul edilmediyse button görünür. Kabul edildikten sonra button DOM'dan kaldırılır ve durum mesajı gösterilir.

### `@for` (bir listedeki her değer için HTML üretme)

```html
@for (operationalSignal of operationalSignals; track operationalSignal) {
  <li>{{ operationalSignal }}</li>
} @empty {
  <li>No operational signal reported</li>
}
```

- `operationalSignal` (mevcut döngü elemanı)
- `operationalSignals` (tekrar edilen kaynak liste)
- `track` (Angular'ın listedeki eleman kimliğini takip etme kuralı)
- `@empty` (liste boş olduğunda gösterilen görünüm)

`track`, liste değiştiğinde Angular'ın hangi DOM elemanını yeniden kullanabileceğini belirler. Gerçek entity listelerinde mümkün olduğunda benzersiz `id` alanı kullanılacaktır.

### `@switch` (tek değerin farklı olasılıklarını eşleştirme)

```html
@switch (severity) {
  @case ('Critical') { ... }
  @case ('High') { ... }
  @default { ... }
}
```

Severity değerine göre operasyon rehberi seçilir. `@default` (hiçbir case eşleşmediğinde kullanılan görünüm), bilinmeyen veya yeni bir değer geldiğinde güvenli geri dönüş sağlar.

Control flow yalnızca görünümü yönetir. Critical Severity için gerçek business rule veya authorization kararı template içine yazılmaz; daha sonra domain ve backend katmanında uygulanır.

### Strict template kontrolünden çıkan ders

TypeScript ilk halinde `severity` alanını yalnızca `'Critical'` literal type (tek bir sabit değeri kabul eden tip) olarak çıkardı. Bu durumda `@case ('High')` hiçbir zaman eşleşemezdi ve Angular build işlemini durdurdu.

İzin verilen bütün Severity değerlerini union type (birden fazla belirli değerden birini kabul eden birleşim tipi) ile tanımladık:

```typescript
type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

protected readonly severity: IncidentSeverity = 'Critical';
```

Bu sayede template yalnızca tanımlı Severity değerlerini karşılaştırabilir; yazım hatası veya bilinmeyen değer derleme sırasında yakalanır.
