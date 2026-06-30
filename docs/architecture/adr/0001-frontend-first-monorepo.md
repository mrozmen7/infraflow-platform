# ADR 0001: Frontend-First, Ayrı Uygulamalar, Tek Repository

- Durum: Kabul edildi
- Tarih: 30 Haziran 2026

## Bağlam

InfraFlow ile Angular mimarisi, Agentic Engineering, Agentic UI ve Spring Boot ayrı ayrı öğrenilecek; daha sonra gerçek bir iş akışında birleştirilecektir. Frontend ve backend'in birbirine erken ve doğrudan bağlanması, iki tarafı aynı anda öğrenmeyi zorlaştırır ve sözleşme sorunlarını gizleyebilir.

## Karar

- Angular ve Spring Boot ayrı build edilen uygulamalar olacaktır.
- Uygulamalar ürün dokümanları ve sözleşmelerle birlikte tek repository içinde tutulacaktır.
- İlk olarak Angular uygulaması geliştirilecektir.
- Backend hazır olmadan frontend, sürümlenmiş OpenAPI sözleşmesi ve kontrollü mock adapter kullanacaktır.
- Agentic UI aşamasında gerçek LLM'den önce deterministik fake agent kullanılacaktır.
- Spring Boot daha sonra aynı sözleşmenin güvenli ve deterministik implementasyonu olacaktır.

## Sonuçlar

### Olumlu

- Angular konuları backend karmaşıklığından bağımsız öğrenilebilir.
- API sözleşmesi erken doğrulanır.
- Frontend ve backend paralel ekiplerce geliştirilebilir.
- Mock ile gerçek backend arasındaki fark contract testleriyle görülebilir.

### Maliyet

- Mock davranışının gerçek backend'den sapmaması gerekir.
- Sözleşme değişiklikleri sürümlenmeli ve iki uygulamada doğrulanmalıdır.
- Repository kalite kapıları teknolojiye göre ayrılmalıdır.

