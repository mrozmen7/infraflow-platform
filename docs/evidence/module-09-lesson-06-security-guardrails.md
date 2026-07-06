# Evidence Package: Module 9 Lesson 6 Security Guardrails

## Bağlam

- Task: Sandbox, permission, secret ve prompt injection güvenlik temeli.
- Tarih: 2026-07-06.
- Kapsam: Repository kuralları, frontend static guardrail ve eğitim dokümantasyonu.
- Git/external action: Commit, push, network veya dış sistem yazısı yapılmadı.

## Güvenlik denetimi

| Kontrol | Yöntem | Sonuç |
|---|---|---|
| Secret-benzeri dosya adları | `.git`, `node_modules` ve `dist` hariç filename scan | İncelenen kapsamda bulgu yok |
| Bilinen credential imzaları | Değerleri yazdırmayan tracked-file filename scan | İncelenen kapsamda bulgu yok |
| Ignore politikası | Kök `.gitignore` incelemesi | `.env` ve `.env.*` ignore; `.env.example` izinli |
| Frontend kaynak taraması | `npm run test:guardrails` | 68 dosya başarılı |
| Negatif rule proofs | Sahte private key/apiKey/Bearer örnekleri | 3/3 kural örneği yakalandı |

Bu sonuç “repository'de hiçbir secret olamaz” garantisi değildir. Filename/literal pattern
denetimi entropi, Git geçmişi veya provider credential doğrulaması yapmaz. Sonuç yalnız
incelenen kapsam ve kullanılan kurallar için kanıttır.

## Quality Gate

| Kontrol | Sonuç | Önemli çıktı |
|---|---|---|
| Architecture | Pass | 57 TypeScript dosyası |
| Frontend guardrails | Pass | 68 source + 3 security proof |
| Vitest | Pass | 18/18 dosya, 54/54 test |
| Production build | Pass | Initial 310.89 kB, budget içinde |

Komut: `npm run quality`

Exit code: `0`

## Toolchain notu

- Yerel Node: `23.11.0`; Angular non-LTS odd-version uyarısı verdi.
- Repository/CI standardı: Node `24.15.0`.
- Yerel gate başarılıdır; production-equivalent CI kanıtı kullanıcı push'undan sonra
  GitHub Actions üzerinde tamamlanacaktır.

## Browser ve runtime

- Not run: Angular kullanıcı davranışı değiştirilmedi.
- Yeni runtime secret mekanizması eklenmedi; değişiklik static guardrail ve süreç kuralıdır.

## Final karar

- Yerel güvenlik guardrail ve quality sonucu: Pass.
- CI sonucu: Pending user-managed push.
- Kalan risk: Regex tabanlı kontrol tam kurumsal secret scanner değildir.
- Önerilen ileri kontrol: Merkezi secret scanning ve Git history taraması ayrı kararla
  değerlendirilmelidir.
