package com.iar.backend.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getSubject();
        } catch (Exception e) {
            log.error("=== EXTRACT EMAIL FAILED: {} - {}", e.getClass().getName(), e.getMessage());
            return null;
        }

    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims != null && claims.getExpiration() != null && !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            log.error("=== IS TOKEN VALID FAILED: {} - {}", e.getClass().getName(), e.getMessage());
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("=== CLAIMS EXTRACTION FAILED: {}", e.getMessage(), e);
            throw e;
        }
    }

}
