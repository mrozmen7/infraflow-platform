# Specification: Agentic UI Foundation

Durum: Implemented  
Modül: Bölüm 4 / Modül 12

## Problem

InfraFlow'a agentic UI eklemek istiyoruz; fakat ilk adımda gerçek LLM bağlamak
güvenli değildir. Önce Angular tarafında agent cevabının nasıl temsil edileceği,
hangi aksiyonların sadece öneri olduğu ve hangi aksiyonların onay istediği
tanımlanmalıdır.

## Hedef

Seçili incident için güvenli bir Operations assistant paneli göstermek.

## Kabul kriterleri

- Seçili incident yoksa agent panel boş durum gösterir.
- Seçili incident varsa context alanları görünür.
- Action card'lar incident durumuna göre üretilir.
- Critical incident önerileri approval-required moduna geçer.
- Action card butonu gerçek repository mutation yapmaz.
- Seçilen kart sadece kullanıcı niyeti olarak duyurulur.

## Kapsam dışı

- Gerçek LLM çağrısı.
- AG-UI SDK entegrasyonu.
- Backend tool calling.
- Approval persistence.
- Audit log persistence.

Bu maddeler sonraki modüllerin konusudur.
