# Modül 1 / Ders 3: Node.js, npm ve Paket Modeli

## Dersin amacı

Bu dersin sonunda aşağıdaki zinciri açıklayabilmelisin:

```text
Node.js
   ↓
npm
   ↓
package.json + package-lock.json
   ↓
node_modules
   ↓
Angular CLI
   ↓
build / test / development server
```

## Node.js (tarayıcı dışında JavaScript çalıştıran çalışma ortamı)

JavaScript başlangıçta tarayıcı içinde çalışan bir dildi. Node.js, JavaScript'in terminalde ve geliştirme araçlarında da çalışmasını sağlar.

Angular uygulamamız production sırasında kullanıcının browser'ında (tarayıcısında) çalışır. Fakat uygulamayı hazırlayan araçlar geliştirme sırasında Node.js üzerinde çalışır:

- Angular CLI (Angular komut satırı aracı)
- TypeScript compiler (TypeScript kodunu kontrol eden ve JavaScript'e dönüştüren derleyici)
- Vitest (otomatik testleri çalıştıran test aracı)
- Development server (yerel geliştirme sunucusu)
- Build tool (kaynak kodu dağıtılabilir çıktıya dönüştüren araç)

Benzetme: Tarayıcı müşterinin ürünü kullandığı mağazadır. Node.js ise ürünün hazırlandığı atölyenin motorudur.

## Runtime (bir programın çalıştığı ortam)

Runtime, kodun gerçekten çalışmasını sağlayan ortamdır.

Bu projede iki farklı runtime vardır:

- **Node.js runtime (geliştirme araçlarının çalışma ortamı):** Build ve test komutlarını çalıştırır.
- **Browser runtime (uygulamanın kullanıcı tarafındaki çalışma ortamı):** Angular uygulamasını çalıştırır.

Bu yüzden "Angular Node.js ile yazılır" demek eksiktir. Angular kodunu TypeScript ile yazarız; geliştirme araçlarını Node.js çalıştırır; oluşan uygulamayı browser çalıştırır.

## npm (Node.js paket yöneticisi)

npm, projenin ihtiyaç duyduğu paketleri indirir, sürümlerini takip eder ve kayıtlı komutları çalıştırır.

Benzetme: Node.js atölyenin motoruysa npm, gerekli aletleri doğru sürümleriyle depodan getiren görevli gibidir.

npm üç temel iş yapar:

1. Package (yeniden kullanılabilir kod veya araç paketi) indirir.
2. Dependency (projenin çalışmak için ihtiyaç duyduğu dış paket) ilişkilerini çözer.
3. Script (package.json içinde isim verilmiş terminal komutu) çalıştırır.

## Package (yeniden kullanılabilir kod veya araç paketi)

Package, başka projelerin kullanabilmesi için yayımlanmış kod ve metadata (paketi tanımlayan bilgi) bütünüdür.

InfraFlow örnekleri:

- `@angular/core`: Angular'ın temel çalışma özellikleri.
- `@angular/router`: URL ve ekran navigasyonu.
- `rxjs`: Zaman içinde oluşan asenkron veri akışları.
- `vitest`: Unit test çalıştırma aracı.

## package.json (projenin paket ve komut manifestosu)

Manifest (bir yapının içeriğini ve kurallarını tanımlayan liste), projenin kimliğini, komutlarını ve ihtiyaç duyduğu doğrudan paketleri açıklar.

InfraFlow dosyasındaki ana alanlar:

### `name` (paket adı)

```json
"name": "infraflow-web"
```

Angular uygulamasının paket adıdır.

### `version` (uygulama sürümü)

```json
"version": "0.0.0"
```

Henüz yayımlanmış bir ürün sürümü olmadığı için başlangıç değeridir.

### `private` (npm registry'ye yanlışlıkla yayımlamayı engelleyen işaret)

```json
"private": true
```

Bu repository bir npm kütüphanesi olarak yayımlanmayacağı için güvenlik bariyeridir.

### `scripts` (isimlendirilmiş proje komutları)

```json
"scripts": {
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test"
}
```

- `npm start`: `start` script'ini bulur ve `ng serve` komutunu çalıştırır.
- `npm run build`: `build` script'ini bulur ve production build üretir.
- `npm test`: `test` script'ini bulur ve Vitest tabanlı test sürecini başlatır.

npm Angular'ın ne olduğunu bilmez. Yalnızca `package.json` içinde yazan komutu çalıştırır.

## dependencies (uygulamanın çalışması için gereken paketler)

Production uygulamasının kodunu derlemek veya çalıştırmak için gereken doğrudan paketlerdir.

InfraFlow örnekleri:

- `@angular/core` (Angular temel runtime API'leri)
- `@angular/forms` (form API'leri)
- `@angular/router` (routing ve navigasyon)
- `rxjs` (asenkron akış kütüphanesi)

## devDependencies (yalnızca geliştirme, build ve test için gereken paketler)

Son kullanıcıya özellik sunmayan, geliştirme sürecine yardım eden araçlardır.

InfraFlow örnekleri:

- `@angular/cli` (Angular komut satırı aracı)
- `typescript` (TypeScript derleyicisi)
- `vitest` (test runner)
- `jsdom` (test sırasında browser DOM'unu taklit eden ortam)
- `prettier` (kod biçimlendirme aracı)

Bu ayrım "devDependencies production'da hiçbir zaman kullanılmaz" anlamına gelmez. Örneğin CI pipeline (otomatik build ve test hattı) production paketi üretmek için bu geliştirme araçlarını kullanır. Fakat bu araçların kodu browser bundle'ına (tarayıcıya gönderilen uygulama paketine) eklenmez.

## Semantic Versioning (anlamsal sürümleme)

Sürüm genellikle üç sayıdan oluşur:

```text
22.0.4
│  │ └─ Patch: geriye uyumlu hata düzeltmesi
│  └─── Minor: geriye uyumlu yeni özellik
└────── Major: kırıcı değişiklik içerebilen ana sürüm
```

### Caret `^` (aynı major sürüm içindeki güncellemelere izin veren sürüm aralığı)

```json
"@angular/core": "^22.0.0"
```

Angular 22 içindeki uyumlu minor ve patch güncellemelerine izin verir; Angular 23'e otomatik geçmez.

### Tilde `~` (aynı minor sürüm içindeki patch güncellemelerine izin veren sürüm aralığı)

```json
"rxjs": "~7.8.0"
```

RxJS 7.8 içindeki patch güncellemelerine izin verir; 7.9'a otomatik geçmez.

## package-lock.json (kesin bağımlılık ağacını kilitleyen dosya)

`package.json` kabul edilen sürüm aralıklarını söyler. `package-lock.json` ise kurulan bütün doğrudan ve dolaylı paketlerin kesin sürümünü kaydeder.

Benzetme:

- `package.json`: "22 serisinden uyumlu bir Angular istiyorum."
- `package-lock.json`: "Bu kurulumda tam olarak Angular 22.0.4 kullanıldı."

Lock file (kesin paket sürümlerini kilitleyen dosya), geliştirici bilgisayarıyla CI ortamının aynı paket ağacını kurmasına yardım eder. Bu dosya Git'e eklenir ve sebepsiz silinmez.

## node_modules (indirilen paketlerin fiziksel klasörü)

`npm install` çalıştığında paketler bu klasöre indirilir.

Kurallar:

- Elle düzenlenmez.
- Git'e eklenmez.
- Silinirse `npm install` veya daha deterministik kurulum için `npm ci` ile yeniden oluşturulabilir.

## npm install (paketleri kuran ve gerektiğinde lock dosyasını güncelleyen komut)

Geliştirme sırasında yeni paket eklerken veya bağımlılıkları güncellerken kullanılır.

## npm ci (lock dosyasındaki kesin sürümlerle temiz kurulum yapan komut)

CI ortamında ve tekrarlanabilir temiz kurulumlarda tercih edilir. `package-lock.json` ile `package.json` uyumsuzsa sessizce değiştirmek yerine hata verir.

## npx (bir npm paketindeki çalıştırılabilir komutu çağıran araç)

Bir komutun global (bilgisayar genelinde) kurulmasına gerek kalmadan belirli paket sürümünü çalıştırabilir.

InfraFlow kurulurken Angular CLI 22'nin doğru sürümünü çağırmak için kullanıldı.

## Node.js sürümünü neden sabitledik?

Angular'ın her ana sürümü belirli Node.js sürümlerini destekler. Desteklenmeyen sürüm bazen çalışsa bile build, test veya paket kurulumu farklı bilgisayarlarda bozulabilir.

Repository kökündeki dosyalar:

- `.nvmrc`: nvm (Node.js sürüm yöneticisi) için `24.15.0` sürümünü belirtir.
- `.node-version`: Diğer sürüm yöneticileri için aynı kararı belirtir.

Bu karar "benim bilgisayarımda çalışıyor" problemini azaltır.

## `npm start` zinciri

Terminalde:

```bash
npm start
```

Gerçekleşen adımlar:

1. npm, bulunduğu klasörde `package.json` arar.
2. `scripts.start` değerini bulur.
3. Projenin `node_modules/.bin` klasöründeki yerel `ng` komutunu bulur.
4. Angular CLI development server'ı başlatır.
5. TypeScript, HTML ve SCSS dosyaları development bundle'a dönüştürülür.
6. Uygulama `localhost:4200` adresinden sunulur.
7. Watch mode (dosya değişikliklerini izleyen mod), kaydedilen değişikliği yeniden derler.

## Sık yapılan hatalar

1. `node_modules` içindeki dosyayı düzeltmek.
2. `package-lock.json` dosyasını sebepsiz silmek.
3. Global Angular CLI sürümüne güvenmek.
4. Desteklenmeyen Node.js sürümüyle devam etmek.
5. Runtime dependency ile development tool ayrımını bilmeden paket eklemek.
6. Her ihtiyacı yeni bir paket kurarak çözmeye çalışmak.

Her dependency, update (güncelleme), security (güvenlik) ve maintenance (bakım) maliyeti getirir. Bu nedenle paket eklemek mimari karardır.

## Ders çıkış ölçütü

Öğrenci şunları açıklayabilmelidir:

1. Node.js ile browser runtime arasındaki fark.
2. npm'in yaptığı üç temel iş.
3. `package.json` ile `package-lock.json` farkı.
4. `dependencies` ile `devDependencies` farkı.
5. `npm start` komutunun hangi zinciri çalıştırdığı.
6. `node_modules` klasörünün neden Git'e eklenmediği.

