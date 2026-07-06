# Instruction Hierarchy ve AGENTS.md Rehberi

Durum: Aktif referans

Resmî kaynak: [OpenAI Codex - Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)

## Temel kavram

`AGENTS.md`, coding agent'a repository içinde nasıl çalışacağını anlatan durable instruction
(kalıcı çalışma talimatı) dosyasıdır. Uygulamanın runtime (çalışma zamanı) davranışını
değiştirmez ve CI yerine geçmez.

```text
AGENTS.md  → nasıl çalışılacağını ve neyin beklendiğini açıklar
Script     → kuralı yerelde aynı biçimde kontrol eder
CI         → aynı kontrolü merkezi olarak zorunlu kılar
Test       → ürün davranışına dair kanıt üretir
```

## Codex dosyaları nasıl keşfeder?

Codex bir çalışma başlatıldığında instruction chain (talimat zinciri) kurar:

1. Kullanıcının Codex home klasöründeki global talimatı okur.
2. Git root'tan current working directory'ye (çalışılan klasöre) doğru ilerler.
3. Her klasörde önce `AGENTS.override.md`, sonra `AGENTS.md` arar.
4. Kökten aşağı doğru birleştirir; daha yakındaki dosya çelişen genel kuralı kendi kapsamı
   için özelleştirir.
5. Talimat zinciri oturum başlangıcında oluşturulduğu için yeni veya değiştirilmiş dosyanın
   etkinliğini kesinleştirmek amacıyla hedef klasörden yeni oturum başlatmak gerekir.

InfraFlow ayrıca kök oturumdan frontend görevi yürütülürken `frontend/AGENTS.md` dosyasının
açıkça okunmasını kök sözleşmesinde ister. Böylece otomatik keşfin current directory sınırı
yanlış varsayılmaz.

## InfraFlow kapsam modeli

```text
infraflow-platform/AGENTS.md
│  Repository geneli: eğitim, güvenlik, Git sahipliği, source of truth, kanıt
│
└── frontend/AGENTS.md
   Angular özelinde: dependency yönü, Signals, UI güvenliği, test ve quality gate
```

Spring Boot başladığında aynı model `backend/AGENTS.md` ile genişletilebilir. Backend
kuralları frontend'e, frontend kuralları backend'e taşınmaz.

## Hangi bilgi nereye yazılır?

| Bilgi | Doğru yer | Neden |
|---|---|---|
| Bütün repolarda kişisel çalışma tercihi | Global `~/.codex/AGENTS.md` | Kullanıcı kapsamı |
| InfraFlow'un ortak çalışma sözleşmesi | Kök `AGENTS.md` | Repository kapsamı |
| Angular'a özel sınırlar ve komutlar | `frontend/AGENTS.md` | Alt ağaç kapsamı |
| Geçici, tek görevlik istek | Güncel prompt | Kalıcı kural değildir |
| Mimari karar ve gerekçe | ADR | Tarihsel karar kaydı gerekir |
| Otomatik mimari yasak | Test/script | Deterministic enforcement gerekir |
| Secret veya parola | Hiçbiri | Repository talimatına yazılmaz |

## İyi kural özellikleri

İyi bir kural specific (belirli), actionable (uygulanabilir) ve verifiable
(doğrulanabilir) olur.

Zayıf:

```text
Kaliteli kod yaz.
```

Güçlü:

```text
Frontend production kodu değiştiğinde `cd frontend && npm run quality` çalıştır;
çalıştırılamayan adımın nedenini ve kalan riski raporla.
```

## Taşınabilir standart

Başka projede şu çekirdek başlıklar korunabilir:

1. Amaç ve kapsam.
2. Source of truth kaynakları.
3. Çalışma sırası ve değişiklik boyutu.
4. Mimari bağımlılık yönü.
5. Güvenlik ve yetki sınırları.
6. Teknolojiye özel doğrulama komutları.
7. Completion evidence (tamamlanma kanıtı).
8. Git ve dış sistem yazma sahipliği.

Komutlar, klasör adları ve framework kuralları projeye göre değiştirilir; güvenlik, açık
kapsam, kanıt ve kullanıcı değişikliklerini koruma prensipleri korunur.
