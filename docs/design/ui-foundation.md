# InfraFlow UI Foundation

Durum: Tamamlandı - görsel kullanıcı onayı alındı

## Tasarım yönü

InfraFlow, pazarlama sayfası veya genel amaçlı AI dashboard'u değildir. Arayüz;
Siemens Industrial Experience'ın endüstriyel disiplini, Grafana'nın operasyon veri
yoğunluğu ve NASA Open MCT'nin görev kontrol yaklaşımından yararlanan özgün bir
Industrial Operations Console olarak tasarlanır.

Bu kaynaklar doğrudan kopyalanmaz ve birden fazla component kütüphanesi projeye
yüklenmez. Angular component'leri InfraFlow'un kendi domain ihtiyaçlarına göre
oluşturulur.

## Wireframe

```text
┌──────────────────┬────────────────────────────────────────────────────┐
│ InfraFlow        │ North Tunnel Network · Shift A · Systems nominal  │
│ Operations       ├────────────────────────────────────────────────────┤
│                  │ Incidents                         Report incident  │
│ Overview         │ Active | Critical | In progress | Data source     │
│ Incidents        ├────────────────────────────────────────────────────┤
│ Assets           │ Search / severity filters                         │
│ Work orders      ├────────────────────────────┬───────────────────────┤
│                  │ Incident queue             │ Selected incident     │
│ System status    │ Dense operational rows     │ Context and actions   │
└──────────────────┴────────────────────────────┴───────────────────────┘
```

## Temel kararlar

- Açık renkli çalışma yüzeyi ve koyu uygulama navigasyonu kullanılır.
- Renk dekorasyon için değil; durum, ciddiyet ve eylem anlamı için kullanılır.
- Incident listesi kart galerisi değil, taranabilir operasyon kuyruğudur.
- Seçili Incident aynı ekranda inspector panelinde incelenir.
- AI ileride bağlamsal yardımcı olarak eklenir; ana görsel kimlik yapılmaz.
- Desktop master-detail, tablet ve mobilde sıralı tek kolon hâline gelir.
- Klavye odağı, semantik bölgeler, canlı durum mesajları ve reduced motion korunur.

## Tasarım token kategorileri

- Color: canvas, surface, navigation, text, border, primary ve semantic status.
- Spacing: 4 px tabanlı ritim.
- Radius: 4-8 px; büyük SaaS kart yuvarlaklıkları kullanılmaz.
- Typography: kompakt sayfa başlıkları, okunabilir gövde ve monospace operasyon ID'leri.
- Elevation: gölge yerine çoğunlukla border ve yüzey farkı.

## İlk teslim kanıtı

- Koyu navigation ve açık operasyon yüzeyi uygulandı.
- Incident kuyruğu ile seçili Incident inspector paneli bağlandı.
- 1440 px masaüstü ve 390 px mobil yerleşim doğrulandı.
- Klavye odak akışı, semantik bölgeler ve canlı mesajlar korundu.
- Architecture, guardrail, 54 test ve production build kalite kapısı temiz geçti.
