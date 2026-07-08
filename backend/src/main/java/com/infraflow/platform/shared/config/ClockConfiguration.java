package com.infraflow.platform.shared.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class ClockConfiguration {

  @Bean
  Clock systemClock() {
    return Clock.systemUTC();
  }
}
