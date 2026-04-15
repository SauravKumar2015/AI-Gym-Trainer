package com.iar.backend.Config;

import com.iar.backend.Jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/health/**",
                                "/api/users/forgot-password",
                                "/api/users/reset-password",
                                "/error")
                        .permitAll()
                        .requestMatchers("/api/ai/**").authenticated()
                        .anyRequest().authenticated())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(exception -> {
                    exception.authenticationEntryPoint((request, response, authException) -> {
                        log.warn("Authentication failed for {}: {}", request.getRequestURI(),
                                authException.getMessage());
                        response.setStatus(401);
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"error\":\"Unauthorized\",\"message\":\"" + authException.getMessage() + "\"}");
                    });
                    exception.accessDeniedHandler((request, response, accessDeniedException) -> {
                        log.warn("Access denied for {}: {}", request.getRequestURI(),
                                accessDeniedException.getMessage());
                        response.setStatus(403);
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"error\":\"Forbidden\",\"message\":\"" + accessDeniedException.getMessage() + "\"}");
                    });
                })

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}