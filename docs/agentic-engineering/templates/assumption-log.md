# Assumption Log

Assumption (varsayım), doğrulanmamış bilgidir; karar veya gerçek değildir.

| ID | Tarih | Varsayım | Kaynak | Yanlışsa etki | Doğrulama yöntemi | Owner | Son tarih | Durum |
|---|---|---|---|---|---|---|---|---|
| A-001 | YYYY-MM-DD | | | | | | | Open |

Durum değerleri:

- `Open`: Henüz doğrulanmadı.
- `Validated`: Kanıtla doğrulandı.
- `Invalidated`: Yanlış olduğu kanıtlandı; plan güncellenmeli.
- `Accepted risk`: Doğrulanamadı, risk bilinçli olarak kabul edildi.

Bir varsayım `Invalidated` olduğunda sessizce silinmez. Etkilenen specification, plan veya
ADR bağlantısı eklenir ve alınan karar kaydedilir.
