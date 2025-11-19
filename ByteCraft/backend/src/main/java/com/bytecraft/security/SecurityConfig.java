package com.bytecraft.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth

                // 🔓 LIBERAR O FRONT React (HTML + JS + CSS)
                .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/favicon.ico").permitAll()

                // 🔓 LIBERAR SUAS APIs
                .requestMatchers("/api/alunos/**").permitAll()
                .requestMatchers("/api/professores/**").permitAll()
                .requestMatchers("/api/salas/**").permitAll()
                .requestMatchers("/api/perguntas/**").permitAll()

                // 🔒 QUALQUER OUTRO ENDPOINT (ex: /admin)
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 🔓 ACEITAR FRONT DEV + FRONT NO WAR
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3030", // React dev server
                "http://localhost:8080"  // React empacotado no WAR
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
