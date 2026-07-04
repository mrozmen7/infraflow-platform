# Modül 2: Component ve Template Modeli

## Amaç

Bir Angular ekranını küçük, tek sorumluluklu ve test edilebilir parçalara ayırmak; parent-child (üst bileşen-alt bileşen) veri akışını kurmak ve erişilebilir bir Incident (arıza) ekranı üretmek.

## Problem

Tek bir component (ekrandaki belirli görevi yöneten Angular parçası) bütün veriyi, filtreyi, kartları ve kullanıcı aksiyonlarını yönetirse dosya hızla büyür. Bir değişiklik başka davranışları bozar ve parçalar yeniden kullanılamaz.

## Ders 2.1 — Component çalışma modeli

Bir component dört parçayı birleştirir:

- TypeScript class (veri ve davranışı taşıyan sınıf),
- template (kullanıcıya gösterilen HTML görünümü),
- style (bileşene ait görsel kurallar),
- selector (bileşenin HTML içindeki özel etiket adı).

InfraFlow örneği:

```html
<app-incident-card />
```

`IncidentCard` yalnızca tek bir Incident özetini gösterir. Arama ve veri yükleme sorumluluğu kartta değildir.

## Ders 2.2 — Binding

Binding (TypeScript ile HTML arasındaki bağlantı) dört yönde kullanıldı:

```html
<h2>{{ incident().title }}</h2>
<article [attr.data-severity]="incident().severity">
<article [class.incident-card--selected]="selected()">
<button (click)="acknowledgeRequested.emit(incident().id)">Acknowledge</button>
```

- Interpolation (değeri metin olarak gösterme): `{{ ... }}`
- Property/attribute binding (HTML özelliğini veriye bağlama): `[...]`
- Class binding (CSS sınıfını koşula bağlama): `[class...]`
- Event binding (tarayıcı olayını metoda bağlama): `(click)`

## Ders 2.3 — Control Flow

Control Flow (şablon içindeki koşul ve tekrar yönetimi) şu amaçlarla kullanıldı:

- `@if`: loading, error, empty ve dolu sonuç durumlarından yalnızca birini gösterir.
- `@for`: Incident ve operasyon sinyali listelerini üretir.
- `@empty`: operasyon sinyali olmayan kartta güvenli açıklama gösterir.
- `@switch`: ilk prototipte Severity rehberini seçmek için kullanıldı; son tasarımda aynı karar exhaustiveness (bütün olasılıkların ele alınması) sağlayan TypeScript `switch` içine taşındı.

Gerçek business rule (iş kuralı) template içine yazılmaz. Template yalnızca görünümü seçer.

## Ders 2.4 — `input()` ve `output()`

`input()` (üst bileşenden alt bileşene veri alma sözleşmesi) tek yönlü veri girişidir:

```typescript
readonly incident = input.required<Incident>();
```

`required` (zorunlu), parent component veri göndermezse build sırasında hata üretilmesini sağlar.

`output()` (alt bileşenden üst bileşene olay gönderme sözleşmesi) kullanıcının niyetini bildirir:

```typescript
readonly acknowledgeRequested = output<string>();
```

Kart Incident durumunu kendisi değiştirmez. Yalnızca Incident kimliğini parent component'e yollar. Gerçek state owner (durum sahibi) olan sayfa/repository kararı uygular.

```text
Parent state
    │ input
    ▼
IncidentCard
    │ output event
    ▼
Parent action handler
```

## Ders 2.5 — Component Composition

Component Composition (küçük bileşenlerden büyük ekran oluşturma) ağacı:

```text
IncidentListPage
├── IncidentFilterBar
├── IncidentList
│   └── IncidentCard × N
└── EmptyState
```

`viewChild()` (parent içinden belirli child bileşene güvenli referans alma), filtre sıfırlandığında arama alanına klavye odağını geri taşır.

`ng-content` (parent tarafından verilen HTML içeriğini child içinde belirlenen yere yerleştirme), `EmptyState` başlığının altına açıklama ve aksiyon düğmesi yerleştirir.

## Ders 2.6 — Feature component'leri

- `IncidentFilterBar`: Arama ve Severity girdilerini alır, değişiklikleri output olarak yollar.
- `IncidentList`: Koleksiyonu dolaşır ve her Incident için kart üretir.
- `IncidentCard`: Özet, Severity, Priority, status ve aksiyonları gösterir.
- `EmptyState`: Sonuç olmadığında tekrar kullanılabilir boş durum görünümü sağlar.
- `IncidentListPage`: Verinin ve kullanıcı state'inin sahibidir; child bileşenleri orkestre eder.

## Ders 2.7 — Test ve Accessibility

Accessibility (engelli kullanıcılar dahil herkesin arayüzü kullanabilmesi) için:

- semantic HTML (anlamlı HTML) olarak `main`, `nav`, `article`, `ol`, `time`, `dl` kullanıldı,
- bütün form alanları görünür `label` aldı,
- dinamik mesajlar `aria-live` ile duyuruldu,
- klavye odağı için `focus-visible` tanımlandı,
- içeriğe atlama bağlantısı eklendi,
- hareket azaltma tercihi desteklendi.

Testler zorunlu input render'ını, output event'ini, state'in child tarafından değiştirilmediğini ve filtre olaylarının doğru tipte yayıldığını kanıtlar.

## Yakalanan hata

İlk page testindeki CSS selector (HTML elemanı seçme kuralı) fazla genişti. Test Incident kartındaki `Acknowledge` yerine Filter Bar içindeki `Reset filters` düğmesine basıyordu. Selector component sınırıyla daraltıldı:

```text
app-incident-card button:not(.button-secondary)
```

Bu hata, testin yeşil olmasından önce doğru kullanıcı davranışını hedeflediğinin kanıtlanması gerektiğini gösterdi.

## Çıkış kanıtı

- Typed input/output sözleşmeleri tamamlandı.
- Page/List/Card/Filter/Empty State ağacı kuruldu.
- Normal, boş ve etkileşim durumları hazırlandı.
- Component testleri ve erişilebilirlik temeli tamamlandı.
