# Modül 17: Human-in-the-Loop Approval Flow

Durum: Tamamlandı

## Amaç

Human-in-the-loop (insan döngüde) yaklaşımı, AI/agent kritik aksiyon önerebilse
de son kararın insanda kalmasını sağlar.

InfraFlow'da yüksek riskli action card seçildiğinde sistem gerçek mutation
(veri değişikliği) yapmaz; önce approval request (onay isteği) üretir.

## Eklenen ana parçalar

- `agent-approval.ts`: approval request ve approval decision modelleri.
- `createApprovalRequestFromCard`: action card'dan pending (bekleyen) onay kaydı.
- `decideApprovalRequest`: approved/rejected (onaylandı/reddedildi) kararı.
- `approval-requested`, `approval-approved`, `approval-rejected` eventleri.
- UI approval queue (onay kuyruğu).

## Neyi çözer?

- Kritik işlemde agent'ın tek başına sistemi değiştirmesini engeller.
- Karar izini event timeline (olay zaman çizelgesi) içinde görünür yapar.
- Mülakatta anlatılabilecek net güvenlik sınırı oluşturur:

```text
Agent suggests
    -> operator reviews
    -> approval request is recorded
    -> backend execution remains separate
```

## Kurumsal kullanım kuralı

Frontend approval, tek başına gerçek yetkilendirme değildir. Gerçek sistemde
backend authorization, audit log ve transaction boundary ayrıca kurulmalıdır.
