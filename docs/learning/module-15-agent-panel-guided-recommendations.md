# Modül 15: Agent Panel & Guided Recommendations

Durum: Tamamlandı

## Amaç

Guided recommendation (yönlendirilmiş öneri), agent'ın kullanıcıya sadece ham
metin dönmesi yerine açıklanabilir, önceliklendirilmiş ve kanıta bağlı öneri
üretmesidir.

InfraFlow'da bu modül, seçili incident (olay), action card (aksiyon kartı) ve
client-side tool result (istemci tarafı araç sonucu) verilerinden güvenli öneriler
üretir.

## Eklenen ana parçalar

- `agent-recommendation.ts`: öneri contract'ı (sözleşmesi) ve öneri üretici.
- `buildGuidedRecommendations`: snapshot (oturum görüntüsü) ve tool result
  verisinden açıklanabilir öneriler üretir.
- `incident-agent-panel`: önerileri panelde gösterir.

## Neyi çözer?

- Operatörün hangi aksiyona önce bakacağını açıklar.
- Kritik veya P1 incident için escalation (yükseltme) ihtiyacını görünür yapar.
- Öneriyi evidence (kanıt) ile bağlar; “AI dedi” yerine “şu veri yüzünden” der.

## Kurumsal kullanım kuralı

Öneri, execution (çalıştırma) değildir. Öneri sadece karar desteğidir; gerçek
değişiklik approval (onay), authorization (yetkilendirme) ve backend
(sunucu tarafı) üzerinden geçer.
