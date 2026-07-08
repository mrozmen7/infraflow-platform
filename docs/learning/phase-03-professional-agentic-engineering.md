# Aşama 3: Profesyonel Agentic Engineering Eğitim ve Referans Planı

Durum: Tamamlandı - Modül 9, 10 ve 11

## Amaç

Codex ve diğer coding agent araçlarını rastgele kod üreten yardımcılar olarak değil;
spesifikasyon, plan, test, review, güvenlik ve kanıt sınırları içinde çalışan profesyonel
mühendislik araçları olarak kullanmayı öğrenmek.

Bu aşamanın sonunda öğrenci yalnızca InfraFlow'da yapılanları bilmemeli; aynı yaklaşımı
Angular, Spring Boot veya başka bir projeye uyarlayabilmeli ve mülakatta teknik gerekçeleriyle
açıklayabilmelidir.

## Ana kaynaklar

- ANGULARarchitects: Agentic Engineering - From Vibe Coding to Professional AI-Assisted Workflows.
- obra/superpowers: specification, plan, TDD, review ve agent workflow yaklaşımı.
- InfraFlow'un mevcut mimari, güvenlik, test ve quality gate kuralları.

Kaynaklar doğrudan kopyalanmaz. Yararlı prensipler InfraFlow'un riskine, mimarisine ve
öğrenme hedeflerine göre uyarlanır.

## Her dersin zorunlu öğretim sırası

1. Terimler ilk kullanımda İngilizce adı ve Türkçe anlamıyla açıklanır.
2. Konunun çözdüğü gerçek şirket problemi gösterilir.
3. Teknik olmayan benzetmeyle basit zihinsel model kurulur.
4. Arka plandaki teknik çalışma modeli çizilir.
5. InfraFlow'dan bağımsız küçük örnek yapılır.
6. Gerçek InfraFlow dosyaları ve kod bağlantıları incelenir.
7. Kod değişikliği küçük ve doğrulanabilir bir dilimde uygulanır.
8. Bilinçli hata senaryosu oluşturulur ve sistematik biçimde teşhis edilir.
9. Unit, integration, architecture, security veya browser testiyle kanıt üretilir.
10. Alternatifler ve trade-off'lar karşılaştırılır.
11. Junior, mid-level ve senior mülakat soruları cevaplarıyla verilir.
12. Konu Feynman özetiyle sade biçimde yeniden anlatılır.
13. Başka projeye taşınabilecek standart kalıp ayrıca çıkarılır.

## Modül 9: AI-Ready Repository ve Guardrails

Öğrenilecek başlıklar:

- Agent context problemi ve context budget.
- AGENTS.md, kural kapsamı ve kural hiyerarşisi.
- Specification, acceptance criteria ve Definition of Done.
- Implementation plan, ADR ve varsayımların görünür yapılması.
- Tekrarlanabilir doğrulama komutları ve quality gate.
- Sandbox, permission, secret ve prompt injection sınırları.
- Worktree ve izole görev ortamı.

Kod ve belge çıktısı:

- InfraFlow AGENTS.md incelemesi ve iyileştirmesi.
- Specification, plan, review ve evidence şablonları.
- Ajan için doğrulama komutu kataloğu.
- Güvenlik ve yetki kontrol listesi.

### Modül 9 ders durumu

| Ders | Başlık | Durum |
|---:|---|---|
| 9.1 | Agent context ve context budget | Tamamlandı |
| 9.2 | AGENTS.md, kapsam ve hiyerarşi | Tamamlandı |
| 9.3 | Specification, Acceptance Criteria ve Definition of Done | Tamamlandı |
| 9.4 | Implementation Plan, ADR ve varsayımlar | Tamamlandı |
| 9.5 | Tekrarlanabilir doğrulama ve quality gate | Tamamlandı |
| 9.6 | Sandbox, permission, secret ve prompt injection | Tamamlandı |
| 9.7 | Worktree, izole görev ve Modül 9 finali | Tamamlandı |

## Modül 10: Kontrollü Geliştirme Döngüsü

Öğrenilecek başlıklar:

- Belirsiz istekten test edilebilir gereksinime geçiş.
- Repository keşfi ve etki alanı analizi.
- Spec-first ve plan-first çalışma.
- Küçük dikey dilimler ve TDD red-green-refactor döngüsü.
- Implementation, diff review ve sistematik debugging.
- Pull request ve evidence package hazırlığı.

Kod çıktısı:

- Gerçek bir InfraFlow özelliğinin specification'dan çalışan koda kadar geliştirilmesi.
- Başarısız test, implementasyon ve final doğrulama kanıtı.
- Yeniden kullanılabilir feature delivery workflow'u.

## Modül 11: İleri Ajan Akışları ve Legacy Refactoring

Öğrenilecek başlıklar:

- Playwright ile gerçek kullanıcı akışı doğrulaması.
- Review, test ve security uzman rolleri.
- Alt ajan görev, dosya ve yetki sınırları.
- Paralel ve sıralı çalışma kararı.
- Legacy hotspot analizi ve characterization test.
- Küçük adımlarla davranış koruyan refactoring.
- Eval, maliyet bütçesi, stop criteria ve insan kontrol noktaları.

Kod çıktısı:

- Davranışı characterization test ile korunan legacy örnek.
- Adım adım modernleştirme ve browser doğrulaması.
- Agent çalışma kalitesi için ölçülebilir değerlendirme paketi.

## Aşama sonunda hazırlanacak başucu dokümantasyonu

```text
docs/agentic-engineering/
├── handbook.md
├── glossary.md
├── reusable-workflow.md
├── security-and-permissions.md
├── legacy-refactoring-playbook.md
├── interview-guide.md
└── templates/
    ├── feature-specification.md
    ├── implementation-plan.md
    ├── definition-of-done.md
    ├── review-checklist.md
    └── evidence-package.md
```

Bu kaynakların sonunda tek bir profesyonel PDF de üretilecektir:

```text
output/pdf/infraflow-professional-agentic-engineering-handbook.pdf
```

PDF; yalnız Markdown dönüşümü olarak kabul edilmeyecek, sayfa render'ları üzerinden başlık,
tablo, kod bloğu, sayfa kırılması ve okunabilirlik bakımından görsel olarak doğrulanacaktır.

Handbook iki katmandan oluşacaktır:

1. Evrensel çekirdek: bütün projelerde kullanılabilecek süreç ve kontrol listeleri.
2. Project adapter: Angular, Spring Boot veya başka teknolojiye göre değiştirilecek komutlar,
   mimari sınırlar ve test stratejileri.

## Tamamlanma ölçütü

Aşama 3 ancak öğrenci:

- bütün temel terimleri kendi cümleleriyle açıklayabildiğinde,
- bir isteği specification ve plana çevirebildiğinde,
- agent yetkilerini ve güvenlik sınırlarını kurabildiğinde,
- test ve kanıt olmadan işi tamamlanmış saymadığında,
- alt ajan ve worktree kullanım kararını gerekçelendirebildiğinde,
- legacy kodu characterization test ile koruyarak refactor edebildiğinde,
- yöntemi farklı bir projeye uyarlayabildiğinde

tamamlanmış sayılır.

## Final sonuç

- Modül 9: AI-ready repository ve guardrails tamamlandı.
- Modül 10: Specification'dan E2E kanıtına kontrollü feature delivery tamamlandı.
- Modül 11: Uzman review, browser gate, legacy refactoring ve agent eval tamamlandı.
- Reusable handbook, glossary, workflow, playbook, interview guide ve şablonlar üretildi.
- Final teknik gate: 62 architecture dosyası, 73 guardrail kaynağı, 73/73 test,
  production build ve 2/2 Playwright başarılı.
