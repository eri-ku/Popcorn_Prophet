package com.popcorn_prophet.popcorn_prophet.config;

import com.popcorn_prophet.popcorn_prophet.filters.CsrfCookieFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collection;
import java.util.Collections;

@Configuration

public class PopcornProphetSecurityConfig {


    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler csrfTokenRequestAttributeHandler = new CsrfTokenRequestAttributeHandler();
        csrfTokenRequestAttributeHandler.setCsrfRequestAttributeName("_csrf");

        http.securityContext(context -> context.requireExplicitSave(false)).
                sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)).
                csrf((csrf) -> csrf.csrfTokenRequestHandler(csrfTokenRequestAttributeHandler).
                        ignoringRequestMatchers("/auth/register", "/auth/login").
                        csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())).
                addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class)
                .authorizeHttpRequests((requests) -> {
                    requests.requestMatchers("/auth/register", "/auth/login").permitAll();
                    requests.anyRequest().authenticated();
                })
                .httpBasic(Customizer.withDefaults()).cors((cors) -> {
                    cors.configurationSource(request -> {
                                CorsConfiguration configuration = new CorsConfiguration();
                                configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                                configuration.setAllowedMethods(Collections.singletonList("*"));
                                configuration.setAllowedHeaders(Collections.singletonList("*"));
                                configuration.setAllowCredentials(true);
                                //6h
                                configuration.setMaxAge(14400L);
                                return configuration;
                            }

                    );
                });
        return http.build();
    }

}
