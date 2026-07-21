package com.infraflow.platform.shared.security;

import com.infraflow.platform.shared.audit.AuditLogService;
import com.infraflow.platform.shared.audit.AuditOutcome;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {

  private final SpringDataRefreshTokenRepository refreshTokenRepository;
  private final AuditLogService auditLogService;
  private final Clock clock;

  public RefreshTokenService(
    SpringDataRefreshTokenRepository refreshTokenRepository,
    AuditLogService auditLogService,
    Clock clock
  ) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.auditLogService = auditLogService;
    this.clock = clock;
  }

  @Transactional
  public void registerIssued(String subject, JwtTokenService.TokenPair tokenPair) {
    refreshTokenRepository.save(new RefreshTokenJpaEntity(
      subject,
      hash(tokenPair.refreshToken()),
      OffsetDateTime.now(clock),
      OffsetDateTime.ofInstant(tokenPair.refreshTokenExpiresAt(), clock.getZone())
    ));
  }

  @Transactional(noRollbackFor = BadCredentialsException.class)
  public void rotate(String presentedToken, JwtTokenService.TokenPair tokenPair) {
    String presentedHash = hash(presentedToken);
    RefreshTokenJpaEntity stored = refreshTokenRepository.findByTokenHash(presentedHash)
      .orElseThrow(() -> new BadCredentialsException("Refresh token is invalid."));

    OffsetDateTime now = OffsetDateTime.now(clock);
    if (stored.getRevokedAt() != null || !stored.getExpiresAt().isAfter(now)) {
      throw new BadCredentialsException("Refresh token is invalid.");
    }

    if (stored.getReplacedBy() != null) {
      refreshTokenRepository.revokeAllActiveBySubject(stored.getSubject(), now);
      auditLogService.record(
        stored.getSubject(),
        "REFRESH_TOKEN_REUSE",
        "REFRESH_TOKEN",
        presentedHash,
        AuditOutcome.REJECTED,
        "Refresh token reuse detected. The token family was revoked."
      );
      throw new BadCredentialsException("Refresh token is invalid.");
    }

    String replacementHash = hash(tokenPair.refreshToken());
    stored.markReplacedBy(replacementHash);
    refreshTokenRepository.save(new RefreshTokenJpaEntity(
      stored.getSubject(),
      replacementHash,
      now,
      OffsetDateTime.ofInstant(tokenPair.refreshTokenExpiresAt(), clock.getZone())
    ));
  }

  @Transactional
  public void revoke(String presentedToken) {
    refreshTokenRepository.findByTokenHash(hash(presentedToken))
      .ifPresent(stored -> stored.markRevoked(OffsetDateTime.now(clock)));
  }

  private String hash(String token) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException exception) {
      throw new IllegalStateException("SHA-256 is not available.", exception);
    }
  }
}
