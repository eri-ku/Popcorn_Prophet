package com.popcorn_prophet.popcorn_prophet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.popcorn_prophet.popcorn_prophet.proxy")
@EnableJpaAuditing(auditorAwareRef = "auditorAwareComponent")
@EnableMethodSecurity(prePostEnabled = true)
public class PopcornProphetApplication {

    public static void main(String[] args) {
        SpringApplication.run(PopcornProphetApplication.class, args);
    }

}
