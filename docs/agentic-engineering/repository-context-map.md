# InfraFlow Repository Context Map

Durum: Aktif kaynak haritası

## Amaç

Bu belge bir coding agent'ın bütün repository'yi gelişigüzel okumadan, görev için gerekli ve güncel bağlamı doğru sırayla bulmasını sağlar. Context map kodun yerine geçmez; doğru source of truth'a ulaşmak için navigasyon katmanıdır.

## Context hiyerarşisi

1. Kullanıcının güncel amacı ve açık kısıtları.
2. Repository kökündeki `AGENTS.md` çalışma ve güvenlik kuralları.
3. `README.md` ürün ve repository yönlendirmesi.
4. Product Charter ve domain dili.
5. İlgili ADR ve mimari sınırlar.
6. Güncel öğrenme ilerlemesi ve modül planı.
7. Göreve ait production kodu, testler ve yapılandırma.
8. Çalıştırılan test/build sonuçları; yazılı iddialardan daha güncel kanıttır.

Daha üst sıradaki açık talimat daha alt sıradaki genel bilgiyle çelişirse üst sıradaki talimat izlenir. Kod ile doküman çelişirse karar verilmeden önce fark görünür hâle getirilir.

## Source of truth tablosu

| Bilgi | Birincil kaynak | Doğrulama |
|---|---|---|
| Ürün amacı ve kapsam | `docs/product/product-charter.md` | Kabul senaryoları |
| Domain kavramları | `docs/domain/domain-language.md` | Domain modeli ve testler |
| Eğitim sırası | `docs/learning/progress.md` | `curriculum-map.md` |
| Agent çalışma kuralları | `AGENTS.md` | CI ve yerel quality komutları |
| Mimari karar | İlgili ADR | Architecture fitness testleri |
| Frontend komutları | `frontend/package.json` | Komutu çalıştırma sonucu |
| CI davranışı | `.github/workflows/frontend-ci.yml` | GitHub Actions sonucu |
| Angular davranışı | Production kodu ve test | Resmî Angular dokümantasyonu |

## Progressive disclosure

Progressive disclosure (bilgiyi ihtiyaç oldukça kademeli açma), ajanın ilk anda bütün repository'yi bağlama doldurmasını engeller.

```text
Amaç ve kurallar
      ↓
Repository haritası
      ↓
İlgili feature public API'si
      ↓
Değişecek production dosyaları
      ↓
Yakındaki testler
      ↓
Gerekirse ADR ve dış resmî kaynak
```

Örneğin Incident filtre hatasında Spring Boot, Agentic UI ve bütün eğitim dokümanları okunmaz. Önce Incident Page, Store, Repository portu ve ilgili testler incelenir.

## Task context packet şablonu

```text
Goal: Kullanıcının istediği görünür sonuç
Scope: Değişmesine izin verilen feature/dosyalar
Out of scope: Bu görevde yapılmayacaklar
Constraints: Mimari, güvenlik ve kullanıcı kısıtları
Source of truth: Kararı belirleyen dosyalar
Affected flow: UI → Store → Use Case → Port → Adapter
Verification: Test, build, browser veya contract kanıtı
Risks: Veri kaybı, yetki, concurrency veya regression riski
```

## Context failure türleri

- Missing context: Gerekli dosya veya iş kuralı okunmadı.
- Stale context: Daha eski bilgi güncelmiş gibi kullanıldı.
- Conflicting context: İki kaynak farklı şey söylüyor.
- Excess context: Görevle ilgisiz çok fazla bilgi dikkati dağıttı.
- Hidden assumption: Doğrulanmamış varsayım gerçek kabul edildi.
- Context poisoning: Güvenilmeyen içerik çalışma talimatı gibi kabul edildi.

## İlk audit bulguları

1. `README.md`, Aşama 2.5'i sıradaki çalışma olarak gösterirken güncel progress belgesi Aşama 3'ü gösteriyordu. README güncellendi.
2. Progress belgesindeki architecture ve guardrail dosya sayıları UI Foundation öncesinde kalmıştı. Güncel kalite kanıtıyla eşitlendi.
3. `AGENTS.md` doğrulama bölümü test ve build'i listeliyor fakat mevcut `npm run quality`
   kapısını ana standart olarak göstermiyordu. Modül 9 / Ders 2'de kök sözleşme güncellendi
   ve Angular'a özel kurallar `frontend/AGENTS.md` kapsamına ayrıldı.

## Modül 9 çalışma bağlamı

```text
Amaç: InfraFlow repository'sini ajanlar için güvenli ve tekrarlanabilir hâle getirmek
Kapsam: AGENTS.md, docs/agentic-engineering, doğrulama şablonları ve guardrails
Kapsam dışı: Agent runtime, AG-UI/A2UI ve Spring Boot implementasyonu
Ana kanıt: Doküman tutarlılığı, quality komutları ve güvenlik senaryoları
```
