# Specification: Client-side Tool Calling

Durum: Implemented  
Modül: Bölüm 4 / Modül 14

## Problem

Agent paneli action card ve event timeline gösterebiliyor; fakat agent'ın güvenli
şekilde UI context okumasını sağlayan tool boundary henüz yoktu.

## Hedef

Angular tarafında read-only client-side tools kurmak ve sonuçlarını agent panelde
göstermek.

## Kabul kriterleri

- Tool definition modeli olmalı.
- Tool result modeli olmalı.
- Incident için en az üç read-only client-side tool olmalı.
- Tools butonla çalıştırılabilmeli.
- Tool sonuçları panelde görünmeli.
- Tool çağrısı timeline'a `tool-called` ve `tool-result-received` eventleri yazmalı.
- Tool çağrısı incident mutation yapmamalı.

## Kapsam dışı

- Server-side tool calling.
- Gerçek LLM tool selection.
- Backend authorization.
- Work order mutation.
- Approval tamamlanması.
