# Modül 18: AG-UI / A2UI Adapter Layer

Durum: Tamamlandı

## Amaç

Adapter layer (uyarlama katmanı), InfraFlow'un iç agent state modelini dış
protokollere veya SDK'lere gevşek bağlı şekilde açar.

Bu modülde gerçek AG-UI/A2UI SDK bağlamadık. Bunun yerine provider-neutral
protocol event (sağlayıcı bağımsız protokol olayı) modeli kurduk.

## Eklenen ana parçalar

- `agent-protocol-adapter.ts`: iç modeli protocol event listesine dönüştürür.
- `toAgentProtocolEvents`: snapshot, session state, tool results, UI blocks,
  approval requests ve safety evaluation verisini tek akışa çevirir.

## Neyi çözer?

- OpenAI, Claude, local model veya farklı agent runtime değişse bile Angular UI
  aynı contract üzerinden çalışabilir.
- Vendor lock-in (sağlayıcı bağımlılığı) azaltılır.
- AG-UI/A2UI gibi standartlara geçiş için ara katman hazır olur.

## Kurumsal kullanım kuralı

UI doğrudan model sağlayıcısının response shape'ine (cevap şekline) bağlanmamalı.
Önce uygulamanın kendi contract'ı olmalı; dış standartlara adapter ile çıkılmalı.
