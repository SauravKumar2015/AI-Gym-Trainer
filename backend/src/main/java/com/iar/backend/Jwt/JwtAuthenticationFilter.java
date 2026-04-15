package com.iar.backend.Jwt;

import com.iar.backend.Repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT Authentication Filter
 * Extracts JWT token from Authorization header, validates it,
 * and sets the authenticated user in SecurityContext
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    // @Override
    // protected void doFilterInternal(
    // @NonNull HttpServletRequest request,
    // @NonNull HttpServletResponse response,
    // @NonNull FilterChain filterChain)
    // throws ServletException, IOException {

    // try {
    // // Extract Authorization header
    // final String authHeader = request.getHeader(AUTHORIZATION_HEADER);

    // // If no Authorization header or doesn't start with Bearer, skip this filter
    // if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
    // log.debug("No Authorization header or not Bearer - path={}",
    // request.getRequestURI());
    // filterChain.doFilter(request, response);
    // return;
    // }

    // // Extract token (remove "Bearer " prefix)
    // String token = authHeader.substring(BEARER_PREFIX.length()).trim();

    // if (token.isEmpty()) {
    // log.debug("Empty JWT token provided for path={}", request.getRequestURI());
    // filterChain.doFilter(request, response);
    // return;
    // }

    // // Extract email from token
    // String email = jwtService.extractEmail(token);

    // // If email is null, token extraction failed (invalid token)
    // if (email == null) {
    // log.debug("Failed to extract email from JWT token for path={}",
    // request.getRequestURI());
    // filterChain.doFilter(request, response);
    // return;
    // }

    // // Validate token
    // if (!jwtService.isTokenValid(token)) {
    // log.debug("JWT token is invalid or expired for email: {}", email);
    // filterChain.doFilter(request, response);
    // return;
    // }

    // // Check if user exists in database
    // userRepository.findByEmail(email).ifPresentOrElse(
    // user -> {
    // // Create authentication token with email as principal
    // // This ensures
    // SecurityContextHolder.getContext().getAuthentication().getName()
    // // returns the email
    // UsernamePasswordAuthenticationToken authToken =
    // new UsernamePasswordAuthenticationToken(
    // email, // Principal (will be returned by getName())
    // null, // Credentials
    // new ArrayList<>()); // Authorities/Roles

    // // Set authentication in SecurityContext
    // SecurityContextHolder.getContext().setAuthentication(authToken);
    // log.info("JWT validated for {} path={}", email, request.getRequestURI());
    // },
    // () -> log.warn("User not found in database for email: {}", email)
    // );

    // } catch (Exception e) {
    // log.error("Error processing JWT token: {}", e.getMessage(), e);
    // }

    // filterChain.doFilter(request, response);
    // }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            final String authHeader = request.getHeader(AUTHORIZATION_HEADER);

            // DEBUG LOGS
            log.info("=== REQUEST PATH: {}", request.getRequestURI());
            log.info("=== AUTH HEADER: {}", authHeader);

            if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
                log.info("=== NO BEARER TOKEN FOUND, SKIPPING");
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(BEARER_PREFIX.length()).trim();
            log.info("=== TOKEN EXTRACTED: {}", token);

            String email = jwtService.extractEmail(token);
            log.info("=== EMAIL EXTRACTED: {}", email);

            boolean valid = jwtService.isTokenValid(token);
            log.info("=== TOKEN VALID: {}", valid);

            if (email == null || !valid) {
                log.info("=== TOKEN INVALID OR EMAIL NULL, SKIPPING AUTH");
                filterChain.doFilter(request, response);
                return;
            }

            userRepository.findByEmail(email).ifPresentOrElse(
                    user -> {
                        log.info("=== USER FOUND: {}", email);
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                email, null, new ArrayList<>());
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        log.info("=== AUTHENTICATION SET SUCCESSFULLY");
                    },
                    () -> log.warn("=== USER NOT FOUND IN DB FOR EMAIL: {}", email));

        } catch (Exception e) {
            log.error("=== FILTER ERROR: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}
