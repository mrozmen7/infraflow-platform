package com.infraflow.platform.shared.security.web;

import com.infraflow.platform.shared.error.ApiError;
import com.infraflow.platform.shared.security.JwtTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.infraflow.platform.shared.security.SecurityProperties;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "JWT-based authentication endpoints")
class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenService tokenService;
  private final JwtDecoder jwtDecoder;
  private final SecurityProperties securityProperties;

  AuthController(
    AuthenticationManager authenticationManager,
    JwtTokenService tokenService,
    JwtDecoder jwtDecoder,
    SecurityProperties securityProperties
  ) {
    this.authenticationManager = authenticationManager;
    this.tokenService = tokenService;
    this.jwtDecoder = jwtDecoder;
    this.securityProperties = securityProperties;
  }

  @PostMapping("/login")
  @SecurityRequirements
  @Operation(summary = "Login with demo credentials")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "JWT token pair issued"),
    @ApiResponse(
      responseCode = "401",
      description = "Invalid credentials",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  TokenResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(request.username(), request.password())
    );

    JwtTokenService.TokenPair tokenPair = tokenService.issueFor(authentication);

    writeRefreshCookie(response, tokenPair.refreshToken());
    return new TokenResponse("Bearer", tokenPair.accessToken(), roles(authentication));
  }

  @PostMapping("/refresh")
  @SecurityRequirements
  @Operation(summary = "Refresh an access token")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "New JWT token pair issued"),
    @ApiResponse(
      responseCode = "401",
      description = "Invalid refresh token",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  TokenResponse refresh(
    @CookieValue(name = "infraflow_refresh", required = false) String refreshTokenValue,
    HttpServletResponse response
  ) {
    Jwt refreshToken;
    try {
      if (refreshTokenValue == null || refreshTokenValue.isBlank()) throw new JwtException("Missing refresh cookie");
      refreshToken = jwtDecoder.decode(refreshTokenValue);
    } catch (JwtException exception) {
      throw new BadCredentialsException("Refresh token is invalid.", exception);
    }

    if (!"refresh".equals(refreshToken.getClaimAsString("typ"))) {
      throw new BadCredentialsException("Refresh token is invalid.");
    }

    List<String> roles = refreshToken.getClaimAsStringList("roles");
    JwtTokenService.TokenPair tokenPair = tokenService.issue(refreshToken.getSubject(), roles);

    writeRefreshCookie(response, tokenPair.refreshToken());
    return new TokenResponse("Bearer", tokenPair.accessToken(), roles);
  }

  @PostMapping("/logout")
  @SecurityRequirements
  @Operation(summary = "Clear the refresh-token cookie")
  void logout(HttpServletResponse response) {
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie("").maxAge(0).build().toString());
  }

  private void writeRefreshCookie(HttpServletResponse response, String refreshToken) {
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie(refreshToken).build().toString());
  }

  private ResponseCookie.ResponseCookieBuilder refreshCookie(String value) {
    return ResponseCookie.from("infraflow_refresh", value)
      .httpOnly(true)
      .secure(securityProperties.refreshCookieSecure())
      .sameSite("Lax")
      .path("/api/v1/auth")
      .maxAge(securityProperties.jwt().refreshTokenTtl());
  }

  private List<String> roles(Authentication authentication) {
    return authentication.getAuthorities().stream()
      .map(authority -> authority.getAuthority().replace("ROLE_", ""))
      .distinct()
      .toList();
  }
}
