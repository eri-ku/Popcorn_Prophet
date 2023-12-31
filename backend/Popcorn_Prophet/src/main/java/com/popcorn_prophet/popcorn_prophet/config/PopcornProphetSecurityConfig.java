package com.popcorn_prophet.popcorn_prophet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration

public class PopcornProphetSecurityConfig {


    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf((csrf) -> csrf.disable()).authorizeHttpRequests((requests) -> {
                     requests.requestMatchers("/auth/**").permitAll();
                     requests.requestMatchers("/api/products/download/**").permitAll();
                    requests.anyRequest().authenticated();
//                    requests.requestMatchers("/**").permitAll();
                })
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }

}
