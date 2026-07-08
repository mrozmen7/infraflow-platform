# Plan: Agentic UI Modules 15-19

## Sıra

1. Guided recommendations domain modelini ekle.
2. Generative UI render block schema'sını ekle.
3. Approval request/decision modelini ekle.
4. Protocol adapter modelini ekle.
5. Safety evaluation modelini ekle.
6. Incident page ve agent panel entegrasyonunu yap.
7. Unit/component/page testleriyle güvenlik sınırını doğrula.
8. Learning/progress/handbook dokümantasyonunu güncelle.

## Mimari karar

Gerçek LLM bağlantısı bu sprint'te eklenmedi. Önce deterministic (belirleyici),
test edilebilir ve provider-neutral (sağlayıcı bağımsız) contract kurulmuştur.

## Doğrulama

- Unit tests: domain builders.
- Component tests: panel rendering and approval decision output.
- Page tests: approval request üretimi ve mutation yapılmaması.
- Quality gate: architecture, guardrails, tests, production build.
