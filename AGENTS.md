# InfraFlow Agent and Learning Rules

## Eğitim sözleşmesi

Bu repository'de yeni bir teknoloji veya Angular API'si açıklanmadan uygulanmaz. Her konu şu sırayla ele alınır:

İngilizce veya teknik bir terim ilk kullanıldığı yerde hemen Türkçe anlamıyla birlikte yazılır. Örnek: `Severity (olayın teknik ciddiyeti)` ve `Priority (işin ele alınma sırası)`. Okuyucunun terimin anlamını başka yerde araması beklenmez.

1. Nedir? Teknik olmayan bir benzetmeyle açıkla.
2. Hangi problemi çözer?
3. Zihinsel modeli ve çalışma biçimi nedir?
4. Ne zaman kullanılır, ne zaman kullanılmaz?
5. Alternatifleri ve trade-off'ları nelerdir?
6. InfraFlow neden bu seçimi yapıyor?
7. Küçük bir örnek göster.
8. Gerçek feature'a uygula.
9. Normal, hata ve sınır durumlarını test et.
10. Öğrenci egzersizi ve review ile tamamla.

Bir modülün çıkış kapısı kanıtlanmadan sonraki modüle geçilmez.

## Mühendislik kuralları

- Önce gereksinim ve kabul kriteri, sonra plan, test, implementasyon ve review.
- Küçük, geri alınabilir ve tek amaçlı değişiklikler yap.
- Angular içinde güvenlik sınırı varmış gibi davranma; kritik authorization ve business rule backend tarafından uygulanır.
- LLM veya servis anahtarlarını browser bundle'ına koyma.
- Domain kodunu UI framework'ü ve transport ayrıntılarından ayır.
- Feature'lar yalnızca açık public API üzerinden birbirine erişir.
- Strict TypeScript kontrollerini gevşetme.
- Test veya build hatasını gizleme; kök nedeni raporla.
- Güncel ve sürüm hassas davranışlarda resmi dokümantasyonu doğrula.
- Kullanıcıya her komutun amacı ve beklenen sonucu açıklanır.

## Doğrulama

Frontend değişikliklerinde en azından şunları çalıştır:

```bash
cd frontend
npm test -- --watch=false
npm run build
```
