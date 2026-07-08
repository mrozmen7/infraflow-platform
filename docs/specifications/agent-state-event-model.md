# Specification: Agent State & Event Model

Durum: Implemented  
Modül: Bölüm 4 / Modül 13

## Problem

Agentic UI kartları görünür olsa da sistem agent davranışını olay bazlı izlemiyordu.
Bu durum audit, debugging, approval ve kullanıcı intent ayrımını zayıflatır.

## Hedef

Agent session için event timeline ve türetilmiş state modeli kurmak.

## Kabul kriterleri

- Snapshot oluşturulduğunda session-started event'i üretilir.
- Context yüklendiğinde context-loaded event'i görünür olur.
- Her action card için action-card-proposed event'i üretilir.
- Approval isteyen kartlar approval-required event'i üretir.
- Kullanıcı kart seçtiğinde action-card-selected event'i oluşur.
- Kart seçimi gerçek repository mutation çalıştırmaz.
- Operations assistant paneli son event'leri timeline olarak gösterir.

## Kapsam dışı

- Kalıcı audit log.
- Backend trace persistence.
- Gerçek LLM streaming.
- Approval kararının tamamlanması.
