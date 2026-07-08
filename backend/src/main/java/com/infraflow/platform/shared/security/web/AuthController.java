package com.infraflow.platform.shared.security.web;

import com.infraflow.platform.shared.error.ApiError;
import com.infraflow.platform.shared.security.JwtTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "JWT-based authentication endpoints")
class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenService tokenService;
  private final JwtDecoder jwtDecoder;

  AuthController(
    AuthenticationManager authenticationManager,
    JwtTokenService tokenService,
    JwtDecoder jwtDecoder
  ) {
    this.authenticationManager = authenticationManager;
    this.tokenService = tokenService;
    this.jwtDecoder = jwtDecoder;
  }

  @PostMapping("/login")
  @Operation(summary = "Login with demo credentials")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "JWT token pair issued"),
    @ApiResponse(
      responseCode = "401",
      description = "Invalid credentials",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  TokenResponse login(@Valid @RequestBody LoginRequest request) {
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(request.username(), request.password())
    );

    JwtTokenService.TokenPair tokenPair = tokenService.issueFor(authentication);

    return new TokenResponse(
      "Bearer",
      tokenPair.accessToken(),
      tokenPair.refreshToken(),
      roles(authentication)
    );
  }

  @PostMapping("/refresh")
  @Operation(summary = "Refresh an access token")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "New JWT token pair issued"),
    @ApiResponse(
      responseCode = "401",
      description = "Invalid refresh token",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  TokenResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
    Jwt refreshToken;
    try {
      refreshToken = jwtDecoder.decode(request.refreshToken());
    } catch (JwtException exception) {
      throw new BadCredentialsException("Refresh token is invalid.", exception);
    }

    if (!"refresh".equals(refreshToken.getClaimAsString("typ"))) {
      throw new BadCredentialsException("Refresh token is invalid.");
    }

    List<String> roles = refreshToken.getClaimAsStringList("roles");
    JwtTokenService.TokenPair tokenPair = tokenService.issue(refreshToken.getSubject(), roles);

    return new TokenResponse(
      "Bearer",
      tokenPair.accessToken(),
      tokenPair.refreshToken(),
      roles
    );
  }

  private List<String> roles(Authentication authentication) {
    return authentication.getAuthorities().stream()
      .map(authority -> authority.getAuthority().replace("ROLE_", ""))
      .distinct()
      .toList();
  }
}
