package com.infraflow.platform.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class OpenApiConfiguration {

  @Bean
  OpenAPI infraflowOpenApi() {
    return new OpenAPI()
      .info(new Info()
        .title("InfraFlow Operations API")
        .version("v1")
        .description("REST API for incidents, work orders and controlled operations workflows.")
        .license(new License().name("Learning project")));
  }
}
