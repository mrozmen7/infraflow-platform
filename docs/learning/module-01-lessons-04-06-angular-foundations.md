# Modül 1 / Ders 4-6: Angular Çalışma Temelleri

Bu not, uygulama üzerinden işlediğimiz Angular CLI, workspace, dosyadan ekrana akış ve modern başlangıç kararlarını özetler.

## Ders 4: Angular CLI ve Workspace

- **Angular CLI (Angular komut satırı aracı):** Workspace oluşturur; development server, test ve build komutlarını çalıştırır.
- **Repository (Git tarafından takip edilen proje deposu):** `infraflow-platform` içindeki bütün frontend, backend, agent ve dokümanları kapsar.
- **Workspace (Angular çalışma alanı):** `frontend` klasöründeki Angular build/test yapılandırmasıdır.
- **Application (çalıştırılabilir uygulama):** Workspace içindeki `infraflow-web` uygulamasıdır.
- **angular.json (Angular workspace yapılandırma dosyası):** Build, serve, test, assets, styles ve bundle budget ayarlarını içerir.

Temel komutlar:

- `ng serve` (yerel geliştirme sunucusunu başlatır)
- `ng build` (dağıtılabilir uygulama çıktısı üretir)
- `ng test` (otomatik testleri çalıştırır)
- `ng generate` (Angular dosya iskeleti üretir)

Angular CLI mimari karar vermez; yalnızca verilen kararı teknik olarak uygular.

## Ders 5: Dosyadan Ekrana Akış

```text
index.html
    ↓
main.ts
    ↓
app.config.ts
    ↓
app.ts
    ↓
app.html + app.scss
    ↓
Browser ekranı
```

- **index.html (tarayıcının yüklediği ana HTML belgesi):** `<app-root>` host element'ini taşır.
- **main.ts (Angular başlangıç dosyası):** `bootstrapApplication` ile root component'i başlatır.
- **app.config.ts (uygulama genelindeki provider yapılandırması):** Router ve global yetenekleri tanımlar.
- **app.ts (root component'in TypeScript tanımı):** Selector, imports, template ve style ilişkisini kurar.
- **app.html (component görünümü):** Ekranın HTML yapısını içerir.
- **app.scss (component stili):** Root component'in görünümünü belirler.
- **RouterOutlet (aktif route ekranının yerleştirileceği alan):** İleride Incident, Asset ve Work Order sayfalarını gösterecektir.

## Ders 6: Modern Başlangıç Kararları

- **Strict TypeScript (sıkı TypeScript kontrolü):** Belirsiz ve hatalı veri kullanımını uygulama çalışmadan yakalamaya çalışır.
- **Strict Templates (Angular HTML dosyalarında sıkı tip kontrolü):** Template içindeki alan ve tip hatalarını derleme sırasında bulur.
- **Standalone component (NgModule zorunluluğu olmayan bağımsız component):** Kullandığı bağımlılıkları kendi imports listesinde açıkça tanımlar.
- **Zoneless (Zone.js kullanmayan değişiklik algılama modeli):** Angular'ın state değişikliklerini daha açık bildirimlerle takip etmesini sağlar.
- **Routing (URL ve ekran eşleştirme sistemi):** Feature ekranlarını URL ve lazy loading sınırlarına bağlar.
- **SCSS (CSS'e ek düzenleme özellikleri sağlayan stil dili):** Global ve component stillerini sürdürülebilir biçimde düzenler.
- **Vitest (otomatik test çalıştırıcısı):** Beklenen component ve fonksiyon davranışlarını hızlı biçimde doğrular.

Bu kararların ortak amacı hatayı erken bulmak, bağımlılıkları görünür kılmak ve büyüyen uygulamanın değiştirilebilirliğini korumaktır.

