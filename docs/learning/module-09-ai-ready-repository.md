# Modül 9: AI-Ready Repository ve Guardrails

Durum: Tamamlandı

## Ders 1: Agent Context Problem

Durum: Tamamlandı

### Öğrenme özeti

- LLM repository'yi insan gibi kalıcı ve eksiksiz biçimde bilmez; kendisine verilen ve araçlarla keşfettiği sınırlı context ile çalışır.
- Çok fazla dosya okumak otomatik olarak daha iyi sonuç vermez. Doğru working set ve source of truth seçilmelidir.
- README, progress, ADR, kod ve test çelişkileri görünür yapılmadan implementasyona başlanmamalıdır.
- Yazılı doküman niyeti açıklar; çalışan test/build sonucu güncel teknik kanıt sağlar.
- Progressive disclosure ile önce genel yön, sonra görevle ilgili ayrıntılar okunur.

### InfraFlow uygulaması

- Repository bilgi kaynakları denetlendi.
- Bilgi kaynakları için hiyerarşi ve source of truth tablosu tanımlandı.
- Yeniden kullanılabilir task context packet şablonu oluşturuldu.
- README'deki eski Aşama 2.5 yönlendirmesi güncellendi.
- Progress içindeki eski kalite kanıtı sayıları güncellendi.
- AGENTS.md doğrulama açığı bir sonraki ders için bulgu olarak kaydedildi.

### Çıkış ölçütü

Öğrenci missing, stale, conflicting, excess ve poisoned context farklarını açıklayabilir; bir görev için küçük context packet hazırlayabilir ve doğru source of truth'u seçebilir.

## Ders 2: AGENTS.md, Kural Kapsamı ve Hiyerarşi

Durum: Tamamlandı

### Öğrenme özeti

- `AGENTS.md`, repository için durable instruction (kalıcı çalışma talimatı) sağlar; runtime
  kodu veya otomatik güvenlik mekanizması değildir.
- Codex, global kapsamdan repository köküne ve current working directory'ye doğru talimat
  zinciri kurar. Daha yakın dosya daha özel kapsamı yönetir.
- Nested instruction (alt klasör talimatı), frontend ve backend gibi farklı teknoloji
  alanlarının kurallarını birbirine karıştırmadan yönetir.
- Açıklayıcı talimat, deterministic enforcement yerine geçmez. Kritik sınır script, test ve
  CI ile otomatik korunur.
- İyi bir kural belirli, uygulanabilir ve doğrulanabilirdir; secret veya geçici görev durumu
  talimat dosyasına yazılmaz.

### InfraFlow uygulaması

- Kök `AGENTS.md`; kapsam, source of truth, güvenlik, Git sahipliği ve completion evidence
  kurallarıyla güçlendirildi.
- Eski test/build listesi tek gerçek `npm run quality` kalite kapısına bağlandı.
- `frontend/AGENTS.md` ile Angular 22, mimari bağımlılık, Signals, güvenlik, erişilebilirlik
  ve test kuralları kendi kapsamına ayrıldı.
- `docs/agentic-engineering/instruction-hierarchy.md` yeniden kullanılabilir referans olarak
  oluşturuldu.

### Çıkış ölçütü

Öğrenci root ve nested `AGENTS.md` kapsamını çizebilir; AGENTS, script, test ve CI farkını
açıklayabilir; bir kuralın hangi dosyaya ait olduğunu gerekçelendirebilir.

## Ders 3: Specification, Acceptance Criteria ve Definition of Done

Durum: Tamamlandı

### Öğrenme özeti

- Specification (özellik tanımı) problemi, kapsamı, iş kurallarını, kalite beklentilerini ve
  riskleri açıklar; implementation plan değildir.
- Acceptance Criteria (kabul kriterleri), tek özelliğin doğru sayılması için gözlenebilir ve
  test edilebilir senaryolardır.
- Definition of Done (tamamlanma tanımı), bütün teslimatlarda aranan ortak mühendislik ve
  kanıt standardıdır.
- User story niyeti özetler fakat hata, güvenlik, eşzamanlılık ve erişilebilirlik davranışını
  tek başına tanımlamaz.
- Kriterler implementation ayrıntısına değil dışarıdan gözlenen davranışa bağlanır.
- Belge ayrıntısı feature riskine göre artırılır; küçük değişiklik gereksiz bürokrasiye
  dönüştürülmez.

### InfraFlow uygulaması

- Yeniden kullanılabilir feature specification ve Definition of Done şablonları oluşturuldu.
- Mevcut Incident Acknowledgement akışı gerçek bir worked example (tamamlanmış örnek) olarak
  problem, kapsam, iş kuralları ve beş kabul kriteriyle tanımlandı.
- Kabul kriterleri mevcut domain, store ve component testlerine evidence map ile bağlandı.
- Frontend baseline ile gelecekteki backend authorization/audit sorumlulukları ayrıldı.
- Konunun başka Angular, Spring Boot, veri ve AI projelerine uyarlama yöntemi belgelendi.

### Çıkış ölçütü

Öğrenci specification, user story, acceptance criteria, implementation plan ve Definition
of Done farkını açıklayabilir; belirsiz isteği test edilebilir Given/When/Then senaryolarına
çevirebilir ve her kriteri bir kanıta bağlayabilir.

## Ders 4: Implementation Plan, ADR ve Varsayımlar

Durum: Tamamlandı

### Öğrenme özeti

- Implementation Plan (uygulama planı), onaylı specification'ı küçük, sıralı ve her adımı
  doğrulanabilir teknik dilimlere çevirir.
- ADR (mimari karar kaydı), görev listesini değil uzun ömürlü mimari seçimin bağlamını,
  alternatiflerini, kararını ve bedellerini saklar.
- Assumption (varsayım), constraint (kısıt), risk ve open question (açık soru) birbirinden
  ayrılır; varsayım kanıtlanmadan gerçek kabul edilmez.
- Her plan adımı bağlı kriter, dosya alanı, test, beklenen kanıt ve rollback içerir.
- Agent kapsam büyümesi, güvenlik kararı veya yeni mimari ihtiyaçta sessizce ilerlemez;
  stop/escalation noktasında durur.
- Her küçük değişiklik için ADR üretmek dokümantasyon borcu yaratır; yalnız kalıcı ve önemli
  mimari kararlar ADR olur.

### InfraFlow uygulaması

- Implementation plan, ADR ve assumption log için yeniden kullanılabilir şablonlar eklendi.
- Mevcut ADR 0001–0004 doğru kullanım örnekleri olarak sınıflandırıldı.
- `INC-ACK-001` kanıt açıkları için production davranışını büyütmeyen, dört adımlı gerçek
  implementation plan hazırlandı.
- Plan mevcut ADR 0002/0003 sınırlarına, AC-003/004/005 kriterlerine ve tam quality gate'e
  bağlandı.
- Actor identity, authorization veya yeni dependency gerektiren durumda agent'ın duracağı
  koşullar açıkça kaydedildi.

### Çıkış ölçütü

Öğrenci specification, plan ve ADR farkını açıklayabilir; varsayımları doğrulama yöntemiyle
kaydedebilir; küçük, geri alınabilir, test ve kanıt bağlantılı bir uygulama planı yazabilir.

## Ders 5: Tekrarlanabilir Doğrulama ve Quality Gate

Durum: Tamamlandı

### Öğrenme özeti

- Verification (doğrulama), teknik iddiayı test, check, build veya kontrollü gözlemle
  kanıta dönüştürür.
- Quality Gate (kalite kapısı), farklı riskleri kapsayan zorunlu kontroller zinciridir; tek
  bir başarılı test bütün teslimatı kanıtlamaz.
- Canonical command (tek yetkili komut), geliştirici, coding agent ve CI drift'ini önler.
- Targeted test hızlı feedback sağlar; görev sonunda full gate yine çalıştırılır.
- CI clean environment, sabit Node sürümü, `npm ci` ve aynı quality komutuyla bağımsız kanıt
  üretir.
- Flaky test tekrar çalıştırılarak gizlenmez; non-determinism kök nedeni düzeltilir.
- Evidence package bütün log değil, kriter → komut → sonuç → kalan risk bağlantısıdır.

### InfraFlow uygulaması

- GitHub Actions içindeki dört kopya komut kaldırıldı; CI doğrudan canonical
  `npm run quality` komutuna bağlandı.
- Architecture, guardrail, test ve build zincirinin amacı ve hata davranışı belgelendi.
- Frontend, doküman ve browser kontrolleri için verification catalog oluşturuldu.
- Yeniden kullanılabilir evidence package şablonu eklendi.
- Dersin gerçek quality sonucu örnek evidence package olarak kaydedildi: architecture 57,
  guardrail 66, 18/18 test dosyası, 54/54 test ve production build başarılı.
- Modül 1'in eski kalite belgesine güncel gate yönlendirmesi eklendi.
- Yerel Node `23.11.0` ile repository standardı `24.15.0` arasındaki toolchain farkı açık
  risk olarak kaydedildi; kullanıcı onayı olmadan makine kurulumu yapılmadı.

### Çıkış ölçütü

Öğrenci test, check, gate ve evidence farkını açıklayabilir; değişiklik türüne uygun yakın
testi ve final gate'i seçebilir; yerel ve CI doğrulamasını tek canonical komuta bağlayabilir.

## Ders 6: Sandbox, Permission, Secret ve Prompt Injection

Durum: Tamamlandı

### Öğrenme özeti

- Sandbox (izole çalışma alanı) teknik erişim sınırını, approval policy (onay politikası)
  sınır aşılırken ne zaman insan kararı gerektiğini belirler.
- Least privilege, görev için en dar dosya, network, credential, tool ve süre yetkisini verir.
- Web, issue, README, log, e-posta, API ve tool çıktısı untrusted input kabul edilir; içindeki
  metin repository veya kullanıcı talimatının yerine geçmez.
- Prompt injection doğrudan veya güvenilmeyen içerik üzerinden dolaylı gelebilir; network ve
  credential yetkisi saldırının etkisini büyütür.
- Browser'a gönderilen environment/config/bundle değeri secret değildir.
- `.gitignore` encryption veya geçmiş temizliği değildir; sızan credential revoke/rotate
  edilmelidir.
- AGENTS talimatı, sandbox/approval teknik sınırı ve otomatik guardrail birlikte defense in
  depth sağlar.

### InfraFlow uygulaması

- Kök ve frontend AGENTS güvenlik/izin kuralları dar kapsamlı approval ve public frontend
  config gerçeğiyle güçlendirildi.
- Repository'de secret-benzeri dosya adları ve bilinen credential imzaları içerik
  gösterilmeden denetlendi; bulgu yok.
- Frontend guardrail kapsamı `src/app` yerine bütün `src` ağacına genişletildi.
- Private key, sabit Bearer credential ve hard-coded secret-benzeri değerler otomatik yasak
  listesine eklendi.
- Üç yeni secret kuralı sahte unsafe örneklerle self-check edilir; pattern bozulursa guardrail
  komutu fail olur.
- Güvenlik/izin başucu rehberi ile tekrar kullanılabilir checklist oluşturuldu.
- Güvenlik tarama kapsamı, sınırlamaları ve başarılı quality sonucu ayrı evidence package
  içinde kaydedildi.

### Şirkette anlatılacak ana nokta

Agent güvenliği yalnız “iyi prompt yazmak” değildir. Instruction/data ayrımı, least
privilege, sandbox, approval, server-side authorization, deterministic guardrail ve human
checkpoint birlikte tasarlanmalıdır.

### Çıkış ölçütü

Öğrenci sandbox ile approval farkını açıklayabilir; bir eylemin otomatik, onaylı veya yasak
olmasına karar verebilir; prompt injection ve secret sızıntısı için savunma katmanları kurabilir.

## Ders 7: Worktree, İzole Görev ve Modül 9 Finali

Durum: Tamamlandı

### Öğrenme özeti

- Worktree (ayrı Git çalışma ağacı), aynı repository'de farklı branch/commit üzerinde paralel
  fiziksel checkout sağlar.
- Branch, worktree, sandbox ve subagent farklı problemleri çözer; worktree güvenlik sınırı
  değildir.
- Aynı branch iki worktree'de eşzamanlı checkout edilemez.
- Gerçek görev izolasyonu Git dışında process portu, database, credential, external resource
  ve evidence katmanlarını da kapsar.
- Dirty base, aynı dosyalar veya sıralı bağımlılık varsa paralel worktree maliyeti faydasından
  büyük olabilir.
- Codex managed worktree detached HEAD ile başlayabilir; Handoff Local ve Worktree arasında
  thread/kod taşır.
- Ignored dosyaları kopyalamak için `.worktreeinclude` kullanılabilir; secret kopyalama
  varsayılan karar değildir.

### InfraFlow uygulaması

- Aktif branch ve worktree yapısı read-only audit ile incelendi.
- Tek worktree ve geniş dirty state nedeniyle ikinci worktree açılmaması kararı verildi.
- Git, process, data, credential ve external resource izolasyon modeli belgelendi.
- Yeniden kullanılabilir isolated task brief şablonu oluşturuldu.
- Modül 9 bütün çıktıları, teknik kalite sonucu ve açık takip riskleriyle final audit'e bağlandı.

### Şirkette anlatılacak ana nokta

Worktree paralel çalışma aracıdır; her göreve otomatik uygulanmaz. Görevlerin bağımsızlığı,
ortak dosya/contract değişimi ve process/data kaynakları analiz edilerek paralel veya sıralı
çalışma kararı verilir.

### Çıkış ölçütü

Öğrenci branch/worktree/sandbox/subagent farkını açıklayabilir; paralel görevin dosya, port,
veri ve credential izolasyonunu planlayabilir; worktree kullanmama kararını da gerekçelendirebilir.

## Modül 9 final sonucu

AI-Ready Repository ve Guardrails modülü tamamlandı. Kanıt ve açık takip maddeleri
`docs/evidence/module-09-final-audit.md` içinde tutulur.
