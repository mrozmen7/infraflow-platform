# Modül 16: Action Cards & Generative UI

Durum: Tamamlandı

## Amaç

Generative UI (üretilebilir arayüz), agent'ın sadece metin değil, UI tarafından
render edilebilecek kontrollü bloklar üretmesidir. Biz bunu serbest HTML ile
değil, typed render block (tipli render bloğu) sözleşmesiyle yaptık.

## Eklenen ana parçalar

- `agent-render-block.ts`: izinli UI blok tipleri.
- `AgentRenderBlock`: title (başlık), body (gövde), facts (kanıtlar) ve actions
  (eylemler) taşıyan güvenli render modeli.
- `isAllowedAgentRenderBlock`: whitelist (izinli liste) kontrolü.

## Neyi çözer?

- LLM ileride bağlandığında keyfi HTML üretmesini engeller.
- UI'ın sadece tanıdığı blokları göstermesini sağlar.
- Recommendation, tool result ve approval request verilerini tek render modeline
  dönüştürür.

## Kurumsal kullanım kuralı

Generative UI doğrudan DOM (tarayıcı belge ağacı) manipülasyonu değildir. Kurumsal
projede agent çıktısı önce schema (şema) ve whitelist ile doğrulanmalı, sonra UI
tarafında render edilmelidir.
