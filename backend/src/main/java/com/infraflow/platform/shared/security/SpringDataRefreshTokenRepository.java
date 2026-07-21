package com.infraflow.platform.shared.security;

import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface SpringDataRefreshTokenRepository extends JpaRepository<RefreshTokenJpaEntity, Long> {

  Optional<RefreshTokenJpaEntity> findByTokenHash(String tokenHash);

  @Modifying
  @Query("""
    update RefreshTokenJpaEntity token
    set token.revokedAt = :revokedAt
    where token.subject = :subject and token.revokedAt is null
    """)
  int revokeAllActiveBySubject(@Param("subject") String subject, @Param("revokedAt") OffsetDateTime revokedAt);
}
