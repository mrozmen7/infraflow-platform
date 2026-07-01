# Modül 1 / Ders 7: Kalite Kapısı, Git ve CI

## Quality Gate (bir değişikliğin kabul edilmeden önce geçmesi gereken kalite kontrolleri)

Modül 1 için kalite kapısı:

1. Unit test (küçük kod parçalarının otomatik davranış testi) başarılı olmalı.
2. Production build (dağıtıma uygun optimize edilmiş uygulama çıktısı) başarılı olmalı.
3. Working tree (yerel Git çalışma alanı) bilinçli ve açıklanabilir olmalı.
4. Commit (Git kayıt noktası) anlamlı bir mesaj taşımalı.
5. GitHub CI (GitHub üzerinde çalışan otomatik test ve build sistemi) aynı kontrolleri tekrar etmelidir.

## Git ve GitHub farkı

- **Git (dağıtık sürüm kontrol sistemi):** Commit ve branch geçmişini yerel bilgisayarda yönetir.
- **GitHub (Git repository barındırma ve işbirliği platformu):** Uzak repository, pull request ve otomasyon sağlar.

## Temel Git terimleri

- **Working tree (üzerinde çalışılan yerel dosyalar):** Henüz kaydedilmemiş değişiklikleri içerir.
- **Staging area (bir sonraki commit için hazırlama alanı):** `git add` ile seçilen değişiklikleri tutar.
- **Commit (anlamlı bir değişiklik kayıt noktası):** Seçilen değişiklikleri açıklamasıyla kaydeder.
- **Branch (bağımsız geliştirme dalı):** Değişikliklerin ana koddan izole geliştirilmesini sağlar.
- **Remote (uzaktaki Git repository bağlantısı):** Yerel repository'yi GitHub'a bağlar.
- **Push (yerel commit'leri uzak repository'ye gönderme):** GitHub geçmişini günceller.
- **Pull Request (bir branch değişikliğini inceleyip ana dala alma isteği):** Review ve CI kapısını çalıştırır.

## CI - Continuous Integration (değişikliklerin otomatik olarak birleştirme öncesi doğrulanması)

`.github/workflows/frontend-ci.yml` dosyası şu zinciri çalıştırır:

```text
GitHub push / pull request
          ↓
Repository checkout
          ↓
Node.js 24.15 kurulumu
          ↓
npm ci
          ↓
Vitest unit testleri
          ↓
Angular production build
          ↓
Başarılı veya başarısız kalite sonucu
```

- **Workflow (GitHub otomasyon iş akışı):** Tetikleyici, job ve step tanımlarını içeren YAML dosyasıdır.
- **YAML (yapılandırma verisini girintilerle yazan metin biçimi):** GitHub Actions workflow formatıdır.
- **Trigger (workflow'u başlatan olay):** Push, pull request veya manuel çalıştırma olabilir.
- **Job (aynı runner üzerinde çalışan ana iş grubu):** Bu projede frontend quality işidir.
- **Step (job içindeki tek işlem):** Paket kurma, test veya build gibi işlemdir.
- **Runner (workflow komutlarını çalıştıran geçici makine):** `ubuntu-latest` kullanır.
- **Checkout (repository dosyalarını runner'a indirme):** `actions/checkout@v6` ile yapılır.
- **Setup Node (istenen Node.js sürümünü runner'a kurma):** `actions/setup-node@v6` ile yapılır.
- **Cache (tekrar indirilen paket verisini saklayarak işi hızlandırma):** npm cache kullanır; `node_modules` klasörünü saklamaz.

Workflow yalnızca `contents: read` yetkisi kullanır. Least privilege (yalnızca ihtiyaç duyulan en düşük yetki) ilkesine uyar.

## Modül 1 çıkış kanıtı

- Yerel test sonucu: 2/2 başarılı.
- Yerel production build: başarılı.
- Initial commit: `78f9386 chore: initialize InfraFlow platform`.
- Remote main: `origin/main` ile senkron.
- CI workflow: İlk push sonrasında GitHub Actions üzerinde doğrulanacak.

