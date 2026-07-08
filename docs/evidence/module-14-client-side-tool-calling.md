# Evidence: Module 14 - Client-side Tool Calling

Tarih: 2026-07-07

## Uygulanan değişiklikler

- Genel tool contract eklendi:
  - `frontend/src/app/core/agentic/domain/agent-tool.ts`
- Agent timeline tool eventlerini destekliyor:
  - `tool-called`
  - `tool-result-received`
- Incident client-side tools eklendi:
  - `frontend/src/app/features/incidents/application/agentic/incident-client-tools.ts`
- Agent panelde `Run client tools` butonu ve tool result listesi gösteriliyor.

## Beklenen davranış

- Kullanıcı `Run client tools` butonuna basar.
- Üç read-only tool çalışır.
- Panelde tool sonuçları görünür.
- Timeline'a tool-called ve tool-result-received eventleri düşer.
- Incident status, acknowledgement veya response start değişmez.

## Test kanıtı

Hedefli test:

```bash
npm test -- --watch=false \
  --include src/app/core/agentic/domain/agent-session-state.spec.ts \
  --include src/app/features/incidents/application/agentic/incident-client-tools.spec.ts \
  --include src/app/features/incidents/ui/incident-agent-panel/incident-agent-panel.spec.ts \
  --include src/app/features/incidents/pages/incident-list-page/incident-list-page.spec.ts
```

Sonuç:

- 4 test dosyası başarılı.
- 15 test başarılı.

Tam kalite kapısı:

```bash
npm run quality
```

Sonuç:

- Architecture check: 73 TypeScript dosyası başarılı.
- Frontend guardrails: 85 source dosyası ve 3 security proof başarılı.
- Angular/Vitest: 25 test dosyası ve 85 test başarılı.
- Production build başarılı.
- Initial bundle: 317.43 kB.
- Component style budget warning temizlendi.

## Browser doğrulaması

`http://localhost:4200/incidents` üzerinde doğrulanan sinyaller:

- `Run client tools` butonu görünür.
- Butona basınca `Read selected incident` sonucu görünür.
- `Summarize visible queue` sonucu görünür.
- `Inspect approval boundary` sonucu görünür.
- Timeline'a `tool-result-received` event'i düşer.
- Live message:

```text
3 read-only client-side tools completed.
```

## Kalan risk

- Gerçek LLM henüz tool seçmiyor.
- Server-side tools sonraki modüllere bırakıldı.
- Tool result schema runtime validator ile doğrulanmıyor; şu an TypeScript contract ile korunuyor.
