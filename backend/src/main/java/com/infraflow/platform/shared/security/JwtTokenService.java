package com.infraflow.platform.shared.security;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

  private final JwtEncoder jwtEncoder;
  private final SecurityProperties securityProperties;
  private final Clock clock;

  public JwtTokenService(
    JwtEncoder jwtEncoder,
    SecurityProperties securityProperties,
    Clock clock
  ) {
    this.jwtEncoder = jwtEncoder;
    this.securityProperties = securityProperties;
    this.clock = clock;
  }

  public TokenPair issueFor(Authentication authentication) {
    List<String> roles = authentication.getAuthorities().stream()
      .map(GrantedAuthority::getAuthority)
      .filter(authority -> authority.startsWith("ROLE_"))
      .map(authority -> authority.substring("ROLE_".length()))
      .distinct()
      .toList();

    return issue(authentication.getName(), roles);
  }

  public TokenPair issue(String subject, List<String> roles) {
    return new TokenPair(
      token(subject, roles, "access", securityProperties.jwt().accessTokenTtl()),
      token(subject, roles, "refresh", securityProperties.jwt().refreshTokenTtl())
    );
  }

  private String token(
    String subject,
    List<String> roles,
    String type,
    java.time.Duration ttl
  ) {
    Instant now = Instant.now(clock);
    JwtClaimsSet claims = JwtClaimsSet.builder()
      .issuer(securityProperties.jwt().issuer())
      .issuedAt(now)
      .expiresAt(now.plus(ttl))
      .subject(subject)
      .claim("typ", type)
      .claim("roles", roles)
      .build();

    return jwtEncoder.encode(JwtEncoderParameters.from(
      JwsHeader.with(MacAlgorithm.HS256).build(),
      claims
    )).getTokenValue();
  }

  public record TokenPair(String accessToken, String refreshToken) {
  }
}
