# Worktrees ve İzole Görev Ortamı

Durum: Aktif referans

Resmî kaynak: [OpenAI Codex Worktrees](https://developers.openai.com/codex/app/worktrees)

## 1. Worktree nedir?

Git Worktree (Git çalışma ağacı), aynı repository'nin ikinci bir checkout'unu (çalışılabilir
dosya kopyasını) başka klasörde açar. Her worktree kendi dosyalarına ve index'ine sahiptir;
commit, branch ve object metadata'sını aynı Git repository ile paylaşır.

```text
Tek Git repository metadata'sı
        ├── Local worktree  → main veya mevcut branch
        ├── Worktree A      → feature branch A
        └── Worktree B      → feature branch B
```

Worktree, clone değildir. Repository geçmişi tekrar indirilmez; fakat source files,
`node_modules`, build cache ve geçici çıktılar her çalışma ağacında ayrı olabilir.

## 2. Branch, worktree, sandbox ve subagent farkı

| Kavram | Çözdüğü problem | Çözmediği problem |
|---|---|---|
| Branch | Bağımsız commit geçmişi | Ayrı fiziksel çalışma klasörü |
| Worktree | Aynı repo için paralel fiziksel checkout | Güvenlik veya network izolasyonu |
| Sandbox | Dosya/network teknik yetki sınırı | Git merge çatışması |
| Subagent | Ayrı uzman görev yürütme | Paylaşılan dosya ve state çatışması |

Worktree bir security boundary (güvenlik sınırı) değildir. İki worktree aynı credential'a,
database'e, port'a veya external system'e erişiyorsa hâlâ birbirlerini etkileyebilir.

## 3. Neden kullanılır?

- Codex arka planda bir görev yürütürken Local checkout üzerinde başka işe devam etmek.
- Birbirinden bağımsız iki feature'ı farklı branch'lerde paralel geliştirmek.
- Riskli refactoring'i günlük çalışma alanından ayırmak.
- Review veya deneyi temiz checkout üzerinde çalıştırmak.
- Automation görevlerinin kullanıcı değişiklikleriyle çakışmasını önlemek.

Codex app managed worktree'leri `$CODEX_HOME/worktrees` altında yönetir. Yeni worktree
varsayılan olarak detached HEAD (bir branch'e bağlı olmayan commit konumu) ile başlayabilir;
kalıcı çalışma için worktree içinde ayrı branch oluşturulur. Handoff, thread ve kodu Local ile
Worktree arasında güvenli biçimde taşır.

## 4. Git'in tek branch kuralı

Git aynı branch'in aynı anda iki worktree'de checkout edilmesine izin vermez:

```text
Local:    feature/a  ← branch burada kullanımda
Worktree: feature/a  ← izin verilmez
```

Her worktree ayrı branch veya detached HEAD kullanmalıdır. Bu kural aynı mutable branch
referansının iki farklı yerde eşzamanlı ilerletilmesini ve kayıp commit riskini önler.

## 5. Worktree ne zaman kullanılmamalı?

- Tek küçük ve sıralı görev varsa.
- Görevler aynı dosyaları yoğun biçimde değiştirecekse.
- Başlangıç branch'i büyük ve açıklanmamış dirty state içeriyorsa.
- Ortak backend portu, database veya test verisi ayrılamıyorsa.
- Kurulum maliyeti görevden daha büyükse.
- Bir görev diğerinin tamamlanmamış contract değişikliğine bağlıysa.

Parallelization (paralelleştirme) yalnız görevler bağımsızsa hız sağlar. Aynı domain modeli,
route veya store üzerinde iki agent çalışıyorsa merge ve semantik çakışma maliyeti artabilir.

## 6. İzolasyon yalnız dosya değildir

Kurumsal bir parallel task şu katmanlarda ayrılmalıdır:

| Katman | İzolasyon örneği |
|---|---|
| Git | Ayrı worktree ve branch |
| Files | Ayrı checkout ve build output |
| Process | Farklı development server portu |
| Data | Ayrı test database/schema/fixture |
| Credentials | En düşük yetkili ayrı development credential |
| External resources | Ayrı queue/topic/bucket prefix'i |
| Evidence | Her task için ayrı test ve log sonucu |

Örneğin iki Angular worktree aynı anda `4200` portunu kullanamaz; biri `4201` gibi ayrı port
kullanmalıdır. İki backend worktree aynı test database'ini destructive migration ile
paylaşıyorsa Git izolasyonu yeterli değildir.

## 7. Ignored dosyalar ve `.worktreeinclude`

Codex managed worktree tracked dosyaları Git checkout ile alır. `.gitignore` içindeki local
dosyalar otomatik taşınmaz. Gerekli, ignored ve güvenli dosyalar `.worktreeinclude` ile
seçilebilir.

Secret içeren `.env` dosyalarını otomatik kopyalamak varsayılan karar olmamalıdır. Önce:

- Gerçekten gerekli mi?
- Sahte/local config yeterli mi?
- Credential en düşük yetkili ve kısa ömürlü mü?
- Worktree silindiğinde secret kalıntısı nasıl temizlenecek?

InfraFlow bugün `.worktreeinclude` oluşturmaz; mevcut görev için ignored secret/config
kopyalamaya ihtiyaç yoktur.

## 8. CLI ile güvenli örnek akış

```bash
git status --short
git worktree list
git worktree add ../infraflow-inc-ack -b codex/inc-ack-evidence HEAD
cd ../infraflow-inc-ack
npm ci --prefix frontend
npm run quality --prefix frontend
```

Entegrasyon öncesinde:

```text
Task branch quality gate
        ↓
Diff review
        ↓
Conflict/contract review
        ↓
Local veya PR entegrasyonu
        ↓
Entegre branch üzerinde quality gate
```

Worktree silme ve branch temizleme destructive sonuç doğurabileceği için içeride commit veya
korunması gereken dosya olmadığını doğrulamadan yapılmaz.

## 9. InfraFlow için güncel karar

Denetim sırasında:

- Tek worktree bulundu: Local checkout.
- Aktif branch: `codex/module-06-signal-store`.
- Worktree Modül 6–9 ve UI Foundation değişiklikleriyle dirty durumdaydı.
- Aynı anda yürüyen bağımsız ikinci görev yoktu.

Bu nedenle ikinci worktree oluşturulmadı. Önce mevcut değişikliklerin kalite kapısı,
documentation audit ve Git checkpoint'i tamamlanacaktır. Modül 10'da bağımsız bir feature
veya review görevi oluştuğunda temiz base commit'ten worktree açılabilir.

Bu “worktree kullanmadık” eksiklik değildir; isolation cost/benefit (izolasyon maliyeti ve
fayda) kararıdır.

## 10. Şirkette nasıl anlatırsın?

> “Paralel agent görevlerinde yalnız branch değil, ayrı Git worktree kullandım; fakat
> worktree'yi güvenlik sınırı sanmadım. Port, database, credential ve external resource
> izolasyonunu ayrıca planladım. Aynı dosyalara dokunan veya dirty base'ten başlayan işleri
> paralelleştirmek yerine sıralı yürüttüm. Her task branch ve entegrasyon sonrasında kalite
> kapısını yeniden çalıştırdım.”
