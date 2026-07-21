package com.infraflow.platform.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class OpenApiConfiguration {

  private static final String BEARER_AUTH = "bearerAuth";

  @Bean
  OpenAPI infraflowOpenApi() {
    return new OpenAPI()
      // Pin a relative server so exported contracts do not depend on the port
      // or host that served /v3/api-docs.
      .servers(List.of(new Server().url("/")))
      .components(new Components()
        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
          .type(SecurityScheme.Type.HTTP)
          .scheme("bearer")
          .bearerFormat("JWT")))
      .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH))
      .info(new Info()
        .title("InfraFlow Operations API")
        .version("v1")
        .description("REST API for incidents, work orders and controlled operations workflows.")
        .license(new License().name("MIT")));
  }
}
