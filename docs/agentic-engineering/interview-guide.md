# Mülakat ve Şirket Sunumu Rehberi

## 30 saniyelik proje anlatımı

> “InfraFlow'da Angular feature geliştirmeyi AI agent'a serbest kod yazdırmak yerine
> specification, plan, TDD, architecture/security review ve evidence zinciriyle yönettim.
> Gerçek bir Incident response geçişini domain'den UI'a küçük dikey dilimlerle geliştirdim;
> optimistic rollback'i ve desktop/mobile Playwright akışını test ettim. Legacy Store cache
> davranışını characterization testlerle koruyup ayrı sınıfa refactor ettim. Bütün süreç aynı
> quality gate ve ölçülebilir agent scorecard ile doğrulandı.”

## Junior soruları

**Specification ile plan farkı nedir?** Specification neyin, neden ve hangi sonuçla
yapılacağını; plan bunun hangi dosya/test/adım sırasıyla uygulanacağını açıklar.

**Red–Green–Refactor nedir?** Önce yeni davranış için başarısız test, sonra minimum çalışan
kod, sonra testler yeşil kalırken tasarım iyileştirmesidir.

**Quality gate neden tek test değildir?** Unit test davranışı kontrol eder; architecture,
security/accessibility ve production build farklı riskleri kontrol eder.

**Optimistic update nedir?** Kullanıcının beklememesi için UI state'ini server cevabından önce
güncelleriz; save başarısızsa rollback gerekir.

**E2E testi neden kullanılır?** Route, component bağlantısı ve gerçek kullanıcı tıklamasının
browser'da birlikte çalıştığını kanıtlar.

**Refactoring ile feature farkı nedir?** Refactor dış davranışı korur; feature dış davranış
ekler/değiştirir.

## Mid-level soruları

**Acceptance Criterion'ı nasıl test seçimine bağlarsın?** Saf iş kuralını unit; orchestration
ve rollback'i Store/integration; kritik yolun wiring'ini E2E ile test ederim. Aynı davranışı
her katmanda gereksiz tekrar etmem.

**Agent'ın ürettiği kodu nasıl kontrol edersin?** Diff, scope, dependency direction, failure
path, security boundary ve evidence map'i inceler; canonical gate'i aynı diff üzerinde
çalıştırırım.

**Characterization test ne zaman kullanılır?** Davranışı yeterince bilinmeyen riskli kodu
refactor etmeden önce kritik mevcut sonuçları sabitlemek için.

**Neden cache'i shared generic servis yapmadınız?** Kanıtlanmış ihtiyaç Incident query'ye
özeldi. Erken generic abstraction coupling ve yanlış yeniden kullanım yaratabilirdi.

**Parallel agent çalışmasını nasıl seçersin?** Görevler ayrı hedef/dosya/contract/test ve
runtime kaynaklarına sahipse paralel; aynı Store veya contract'ta ise sıralı.

**Frontend role kontrolü neden authorization değildir?** Browser kodu kullanıcı tarafından
değiştirilebilir; backend her privileged action'ı kendi identity ve policy'siyle doğrular.

## Senior soruları

**Agentic workflow'u bürokrasiye dönüştürmeden nasıl ölçeklersin?** Risk bazlı ölçeklerim.
Doküman typo'su kısa diff check; state/persistence değişikliği spec/plan/integration; ödeme,
auth ve migration threat model, staged rollout ve insan onayı ister.

**Agent eval'i nasıl tasarlarsın?** Requirement, scope, architecture, behavior, security,
evidence, reversibility ve communication boyutlarını puanlarım; kritik boyutlara hard gate
koyarım; yalnız test pass oranını agent kalitesi saymam.

**Legacy refactor production riskini nasıl azaltırsın?** Characterization/contract test,
küçük strangler dilimi, observability, shadow/canary rollout ve açık rollback kullanırım.
Veri semantiği belirsizse kod yazmadan domain sahibine dönerim.

**Prompt injection'a karşı ne yaparsın?** Dış içeriği talimat değil untrusted data sayarım;
least privilege, sandbox, dar network/credential, typed tool input, approval ve server-side
authorization katmanlarını birlikte uygularım.

**Worktree güvenlik izolasyonu mudur?** Hayır. Yalnız checkout/file izolasyonu sağlar. Port,
database, credential ve external resource ayrıca ayrılmalıdır.

**Testler geçerken feature neden teslim edilmeyebilir?** Yanlış requirement test edilmiş,
security boundary eksik, build/budget kırık, browser wiring bozuk veya kalan risk kabul
edilmemiş olabilir.

## Canlı kod incelemesinde anlatım sırası

1. Önce problem ve acceptance criterion.
2. Domain policy: “İş kuralı framework'ten bağımsız.”
3. Use case: “Port üzerinden orchestration.”
4. Store: “Optimistic state, pending guard ve rollback.”
5. UI: “Input veri, output kullanıcı niyeti.”
6. E2E: “Kritik wiring browser'da kanıtlı.”
7. Legacy refactor: “Characterization önce, extraction sonra.”
8. Kalan risk: “Backend authority henüz kapsam dışı.”

## Zayıf ve güçlü cevap örneği

Zayıf: “AI ile hızlı kod yazdım, testler geçti.”

Güçlü: “Önce scope ve beş acceptance criterion tanımladım. Transition'ı domain policy'de,
orchestration'ı port/use case'te, rollback'i Store'da tuttum. Her dilimde Red/Green kanıtı,
sonunda architecture/guardrail/build ve desktop/mobile E2E çalıştırdım. Backend authorization
riskini kapsam dışı ama zorunlu takip olarak görünür bıraktım.”

