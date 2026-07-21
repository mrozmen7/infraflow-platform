package com.infraflow.platform.shared.security;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "refresh_tokens")
class RefreshTokenJpaEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "subject", nullable = false, length = 120)
  private String subject;

  @Column(name = "token_hash", nullable = false, length = 64)
  private String tokenHash;

  @Column(name = "issued_at", nullable = false)
  private OffsetDateTime issuedAt;

  @Column(name = "expires_at", nullable = false)
  private OffsetDateTime expiresAt;

  @Column(name = "replaced_by", length = 64)
  private String replacedBy;

  @Column(name = "revoked_at")
  private OffsetDateTime revokedAt;

  protected RefreshTokenJpaEntity() {
  }

  RefreshTokenJpaEntity(
    String subject,
    String tokenHash,
    OffsetDateTime issuedAt,
    OffsetDateTime expiresAt
  ) {
    this.subject = subject;
    this.tokenHash = tokenHash;
    this.issuedAt = issuedAt;
    this.expiresAt = expiresAt;
  }

  String getSubject() {
    return subject;
  }

  OffsetDateTime getExpiresAt() {
    return expiresAt;
  }

  String getReplacedBy() {
    return replacedBy;
  }

  OffsetDateTime getRevokedAt() {
    return revokedAt;
  }

  void markReplacedBy(String replacementHash) {
    this.replacedBy = replacementHash;
  }

  void markRevoked(OffsetDateTime revokedAt) {
    this.revokedAt = revokedAt;
  }
}
