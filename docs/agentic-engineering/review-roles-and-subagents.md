# Uzman Review Rolleri, Alt Ajanlar ve Çalışma Sınırları

Durum: Aktif referans

## 1. Temel ayrım

Review (inceleme), üretilen değişikliği belirli bir risk açısından sorgulamaktır. Subagent
(alt ajan), ana görevin sınırlandırılmış bir parçasını ayrı context (bağlam) ve açık teslim
sözleşmesiyle yürüten yardımcı ajandır. Her review için ayrı ajan zorunlu değildir.

```text
Specification ve plan
        ↓
Implementation sahibi
        ↓
Architecture review ── bağımlılık ve sınırlar
        ↓
Test review ────────── davranış ve hata senaryoları
        ↓
Security review ───── güven sınırı ve yetki
        ↓
Evidence review ───── iddia ile kanıt eşleşmesi
```

## 2. Dört uzman rol

| Rol | Ana soru | İncelediği kanıt | İncelemediği konu |
|---|---|---|---|
| Architecture Reviewer (mimari inceleyici) | Bağımlılık doğru yönde mi? | Import'lar, katmanlar, ADR, architecture check | Ürünün özelliği isteyip istemediği |
| Test Reviewer (test inceleyici) | Kullanıcı davranışı ve failure path korunuyor mu? | Unit, integration, E2E, Red/Green kanıtı | Backend authorization kararı |
| Security Reviewer (güvenlik inceleyici) | Güvenilmeyen girdi veya yetkisiz action var mı? | Trust boundary, secrets, validation, approval | Görsel tasarım zevki |
| Evidence Reviewer (kanıt inceleyici) | Her kabul kriterinin bağımsız kanıtı var mı? | Evidence map, komut, exit code, kalan risk | Yeni kapsam eklemek |

Rollerin amacı “çok ajan kullandık” demek değil, farklı risklerin aynı genel bakış içinde
kaybolmasını önlemektir.

## 3. InfraFlow Modül 10 review sonucu

### Architecture review

- `Acknowledged → In Progress` kuralı Angular bilmeyen domain policy içinde kaldı.
- Use case repository portu üzerinden çalıştı; concrete mock adapter'a bağlanmadı.
- Store orchestration ve optimistic state'i, Inspector ise typed input/output sözleşmesini
  yönetti.
- Incident UI doğrudan repository çağırmadı.
- Sonuç: Pass.

### Test review

- Domain geçerli/geçersiz transition testleri var.
- Use case found, not-found, invalid ve save davranışını test ediyor.
- Store success, duplicate pending ve rollback senaryolarını koruyor.
- Page integration testi kullanıcı mesajı ve metriği doğruluyor.
- Playwright masaüstü ve mobil projede gerçek tarayıcı akışını doğruluyor.
- Sonuç: Pass.

### Security review

- UI action görünürlüğü authorization olarak sunulmuyor.
- Teknik exception kullanıcı mesajına sızdırılmıyor.
- Secret veya yeni browser credential eklenmedi.
- Gerçek rol kontrolü, audit ve transition doğrulaması Spring Boot sınırına bırakıldı.
- Sonuç: Frontend kapsamı için Pass; backend authority açık takip maddesi.

## 4. Alt ajan ne zaman kullanılır?

Alt ajan kullanmak için görev şu özelliklerin çoğunu taşımalıdır:

- bağımsız ve tek cümleyle teslim edilebilir bir amaç,
- açık allowed paths (değiştirilebilir dosyalar),
- başka görevin yarım contract değişikliğine bağımlı olmama,
- kendi test komutu ve evidence çıktısı,
- merge çakışması düşük dosya alanı,
- ana ajanın değerlendirebileceği net handoff (teslim) formatı.

İyi örnek: Bir ajan yalnız accessibility review yapar ve dosya değiştirmeden bulgu listesi
döndürür. Başka bir ajan bağımsız bir dokümantasyon ağacındaki kırık linkleri inceler.

Kötü örnek: İki ajan aynı `IncidentStore` sınıfını eşzamanlı refactor eder. Kod çakışmasa bile
state davranışında semantic conflict (anlamsal çakışma) oluşabilir.

## 5. Paralel mi, sıralı mı?

```text
Görevler aynı contract veya dosyayı değiştiriyor mu?
  ├── Evet → Sıralı çalış
  └── Hayır
       ↓
Birbirlerinin sonucuna bağımlılar mı?
  ├── Evet → Sıralı çalış
  └── Hayır
       ↓
Port/data/credential izole edilebilir mi?
  ├── Hayır → Sıralı veya read-only review
  └── Evet → Paralel çalışma düşünülebilir
```

Modül 10–11'de feature ve cache refactor aynı Store'u etkilediği için sıralı çalışıldı. Bu,
bilinçli risk azaltma kararıdır.

## 6. Alt ajan görev sözleşmesi

Her görev brief'i en az şunları içerir:

- Goal (kanıtlanabilir hedef),
- input context ve source of truth,
- allowed ve forbidden paths,
- yetki/network sınırı,
- acceptance criteria,
- çalıştırılacak yakın test,
- çıktı formatı: diff, bulgu veya kanıt,
- stop condition ve escalation.

Ana ajan teslimi körlemesine kabul etmez; diff'i, test sonucunu ve kapsamı yeniden inceler.

## 7. Şirkette nasıl anlatırsın?

> “Alt ajanları kişi sayısını artırmak için değil, bağımsız risk alanlarını sınırlamak için
> kullandım. Aynı state ve contract'a dokunan işleri sıralı tuttum. Her görevde dosya, yetki,
> test ve stop condition sınırı tanımladım; teslimi ana akışın quality gate'i içinde yeniden
> doğruladım.”

