# Modül 19: Safety, Guardrails & Evaluation

Durum: Tamamlandı

## Amaç

Safety evaluation (güvenlik değerlendirmesi), agentic UI akışının güvenli olup
olmadığını ölçülebilir check (kontrol) listesine çevirir.

## Eklenen ana parçalar

- `agent-safety-evaluation.ts`: safety check ve evaluation modeli.
- `evaluateAgentSafety`: tool permissions, high-risk approval, render block schema
  ve approval coverage kontrollerini çalıştırır.
- UI panelinde safety score (güvenlik skoru) ve check listesi gösterilir.

## Kontroller

- Tool permissions (araç izinleri): client-side tool sonuçları read-only mi?
- High-risk approval (yüksek risk onayı): high/critical kartlar approval istiyor mu?
- Render block schema (render bloğu şeması): UI sadece izinli blokları mı gösteriyor?
- Approval coverage (onay kapsaması): approval gereken kartlar gerçekten review
  edildi mi?

## Kurumsal kullanım kuralı

Guardrail sadece prompt'a yazılan uyarı değildir. Gerçek guardrail kodla,
testle, UI feedback ile ve CI quality gate (kalite kapısı) ile korunmalıdır.
