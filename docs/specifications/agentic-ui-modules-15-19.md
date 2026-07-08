# Specification: Agentic UI Modules 15-19

## Problem

InfraFlow'un agentic UI katmanı Modül 14 sonunda context, action card, event
timeline ve read-only tool calling yapabiliyordu. Ancak kurumsal kullanım için
şunlar eksikti:

- açıklanabilir öneri üretimi,
- doğrulanmış generative UI modeli,
- insan onaylı aksiyon akışı,
- sağlayıcı bağımsız protokol adaptörü,
- ölçülebilir güvenlik değerlendirmesi.

## Kabul kriterleri

1. Agent önerileri typed contract ile üretilir.
2. UI, serbest HTML yerine izinli render block tiplerini gösterir.
3. Approval gerektiren kart seçimi gerçek mutation yapmaz; approval request üretir.
4. Approve/reject kararı event timeline'a yazılır.
5. İç agent modeli provider-neutral protocol event listesine çevrilebilir.
6. Safety evaluation panelde görünür.
7. Testler approval flow'un repository mutation yapmadığını doğrular.

## Non-goals

- Gerçek LLM API bağlantısı.
- Backend authorization endpoint'i.
- Kalıcı audit log.
- MCP server implementasyonu.

Bu non-goal'lar sonraki backend ve runtime entegrasyon modüllerine bırakılmıştır.
