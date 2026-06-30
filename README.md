# InfraFlow Platform

InfraFlow, kritik altyapı tesislerindeki arıza, varlık ve bakım işlerini yöneten eğitim amaçlı kurumsal referans projesidir.

Bu repository yalnızca çalışan bir ürün üretmek için değil; modern Angular mimarisi, profesyonel AI destekli mühendislik, Agentic UI ve Spring Boot konularını kanıt üreterek öğrenmek için kullanılacaktır.

## Güncel durum

- Aşama: 1 - Modern Angular Temelleri
- Modül: 1 - Ürün, Alan ve Workspace Başlangıcı
- Frontend: Angular 22
- Backend: Aşama 5'te eklenecek
- Agent runtime: Aşama 4'te eklenecek

## Repository yapısı

```text
infraflow-platform/
├── frontend/      Angular uygulaması
├── backend/       Spring Boot uygulaması - daha sonra
├── agent-lab/     Güvenli agent runtime - daha sonra
├── contracts/     OpenAPI, AG-UI ve A2UI sözleşmeleri
├── infra/         Yerel altyapı ve container tanımları
├── docs/          Ürün, mimari ve eğitim kararları
└── AGENTS.md      AI destekli çalışma kuralları
```

## Neden bu teknik başlangıç?

- **Angular 22:** Kurulum tarihinde güncel kararlı ana sürüm.
- **Standalone:** Yeni kodun NgModule etrafında örgütlenmesini gerektirmez.
- **Strict TypeScript:** Belirsiz ve hatalı veri kullanımını mümkün olduğunca derleme sırasında yakalar.
- **Zoneless:** Angular 21 ve sonrasında varsayılan modern change detection yaklaşımıdır.
- **Routing:** Uygulamayı bağımsız ve lazy-load edilebilir iş alanlarına ayırmak için hazırdır.
- **SCSS:** Tasarım token'ları ve büyük stil yapıları için düzenli bir CSS üst kümesi sağlar.
- **Vitest:** Yeni Angular projelerindeki varsayılan hızlı unit test çalıştırıcısıdır.

## Eğitim navigasyonu

- [Tam müfredat ve ders parçaları](docs/learning/curriculum-map.md)
- [Güncel ilerleme durumu](docs/learning/progress.md)
- [Aşama 1: Modern Angular](docs/learning/phase-01-modern-angular.md)
- [Modül 1 ders notu](docs/learning/module-01-workspace.md)
- [InfraFlow Product Charter](docs/product/product-charter.md)

## Gereksinimler

- Node.js 24.15.0
- npm 11.6.0 veya uyumlu güncel npm sürümü

Projede `.nvmrc` ve `.node-version` bulunur. Bir Node sürüm yöneticisi kullanıyorsan repository kökünde doğru sürüme geç.

## Frontend komutları

```bash
cd frontend
npm install
npm start
npm test -- --watch=false
npm run build
```

## Kalite kapısı

Bir modül aşağıdakiler tamamlanmadan bitmiş sayılmaz:

1. Kavram açıklanmış olmalı.
2. Kod veya doküman çıktısı bulunmalı.
3. Test ve production build başarılı olmalı.
4. Değişiklik birlikte incelenmiş olmalı.
5. Mimari karar gerekiyorsa ADR yazılmalı.
