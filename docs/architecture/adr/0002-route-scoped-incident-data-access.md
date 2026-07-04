# ADR 0002: Route-Scoped Incident Data Access

- Durum: Kabul edildi
- Tarih: 1 Temmuz 2026

## Bağlam

Angular frontend, Spring Boot backend hazır olmadan Incident dikey dilimini çalıştırmalıdır. UI component'lerinin doğrudan mock sınıfını oluşturması ileride gerçek HTTP adapter'a geçişi ve izole testleri zorlaştırır.

## Karar

- UI yalnızca `IncidentRepository` portunu bilecektir.
- Port çalışma zamanında `INCIDENT_REPOSITORY` InjectionToken ile temsil edilecektir.
- Aşama 1'de token, `MockIncidentRepository` implementasyonuna bağlanacaktır.
- Provider yalnızca `/incidents` route ağacında bulunacaktır.
- Liste asenkron state'i Angular `resource()` ile yönetilecektir.
- Gerçek backend geldiğinde provider HTTP adapter ile değiştirilecek; UI sözleşmesi korunacaktır.

## Sonuçlar

### Olumlu

- Mock ve gerçek adapter değiştirilebilir.
- Testler deterministik fake repository verebilir.
- Incident bağımlılıkları başka feature'lara sızmaz.
- Resource iptal sinyali adapter'a kadar taşınabilir.

### Maliyet

- Ek port, token ve provider dosyaları vardır.
- Mock davranışı gerçek API sözleşmesiyle senkron tutulmalıdır.
- Backend authorization kuralları frontend mock davranışına bırakılamaz.
