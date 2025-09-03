package gov.ufv.bytecraft_prototipo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/professor/login").permitAll()
                        .requestMatchers("/api/professor/cadastrar").permitAll()
                        .requestMatchers("/api/sala").permitAll()
                        .requestMatchers("/api/sala/cadastrar").permitAll()
                        .requestMatchers("/api/sala/professor/{cpf}").permitAll()
                        .requestMatchers("/api/aluno/cadastrar").permitAll()
                        .requestMatchers("/api/aluno/listar").permitAll()
                        .requestMatchers("/api/aluno/sala/{salaId}").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}
