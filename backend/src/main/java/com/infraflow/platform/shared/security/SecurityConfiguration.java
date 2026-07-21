package com.infraflow.platform.shared.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.infraflow.platform.shared.error.ApiError;
import com.infraflow.platform.shared.error.ApiFieldError;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
@EnableConfigurationProperties(SecurityProperties.class)
class SecurityConfiguration {

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http, ObjectMapper objectMapper) throws Exception {
    return http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(Customizer.withDefaults())
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(requests -> requests
        .requestMatchers(
          "/actuator/health",
          "/actuator/health/**",
          "/actuator/info",
          "/actuator/prometheus",
          "/v3/api-docs/**",
          "/swagger-ui.html",
          "/swagger-ui/**",
          "/api/v1/auth/**"
        ).permitAll()
        .requestMatchers("/actuator/**").hasRole("ADMIN")
        .anyRequest().authenticated()
      )
      .oauth2ResourceServer(resourceServer -> resourceServer
        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
      )
      .exceptionHandling(exceptions -> exceptions
        .authenticationEntryPoint((request, response, exception) ->
          writeError(objectMapper, request, response, HttpStatus.UNAUTHORIZED, "Authentication is required."))
        .accessDeniedHandler((request, response, exception) ->
          writeError(objectMapper, request, response, HttpStatus.FORBIDDEN, "Access is denied."))
      )
      .build();
  }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  UserDetailsService userDetailsService(SecurityProperties securityProperties, PasswordEncoder passwordEncoder) {
    List<UserDetails> users = securityProperties.users().entrySet().stream()
      .map(entry -> User
        .withUsername(entry.getKey())
        .password(passwordEncoder.encode(entry.getValue().password()))
        .roles(entry.getValue().roles().toArray(String[]::new))
        .build())
      .toList();

    return new InMemoryUserDetailsManager(users);
  }

  @Bean
  JwtEncoder jwtEncoder(SecurityProperties securityProperties) {
    return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecret(securityProperties)));
  }

  @Bean
  JwtDecoder jwtDecoder(SecurityProperties securityProperties) {
    return NimbusJwtDecoder
      .withSecretKey(jwtSecret(securityProperties))
      .macAlgorithm(MacAlgorithm.HS256)
      .build();
  }

  private JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
    authoritiesConverter.setAuthoritiesClaimName("roles");
    authoritiesConverter.setAuthorityPrefix("ROLE_");

    JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
    authenticationConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

    return authenticationConverter;
  }

  private SecretKey jwtSecret(SecurityProperties securityProperties) {
    return new SecretKeySpec(
      securityProperties.jwt().secret().getBytes(StandardCharsets.UTF_8),
      "HmacSHA256"
    );
  }

  private void writeError(
    ObjectMapper objectMapper,
    HttpServletRequest request,
    HttpServletResponse response,
    HttpStatus status,
    String message
  ) throws java.io.IOException {
    response.setStatus(status.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    objectMapper.writeValue(response.getOutputStream(), new ApiError(
      Instant.now(),
      status.value(),
      status.getReasonPhrase(),
      message,
      request.getRequestURI(),
      List.<ApiFieldError>of()
    ));
  }
}

