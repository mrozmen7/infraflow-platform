package com.infraflow.platform.shared.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "infraflow.cors")
public record CorsProperties(List<String> allowedOrigins) {
}
