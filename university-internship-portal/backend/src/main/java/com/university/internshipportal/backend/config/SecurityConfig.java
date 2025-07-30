package com.university.internshipportal.backend.config;

import com.university.internshipportal.backend.service.CustomUserDetailsService; // Correct import for your service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;


@Configuration // Indicates this is a Spring configuration class
@EnableWebSecurity // Enables Spring Security's web security support
@EnableMethodSecurity(prePostEnabled = true) // Enables @PreAuthorize, @PostAuthorize etc. annotations
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService; // Our custom UserDetailsService
    @Autowired
    private JwtAuthFilter jwtAuthFilter; // Our JWT authentication filter

    // Configures the DaoAuthenticationProvider to use our CustomUserDetailsService and PasswordEncoder
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Sets the UserDetailsService
        authProvider.setPasswordEncoder(passwordEncoder()); // Sets the PasswordEncoder
        return authProvider;
    }

    // Exposes the AuthenticationManager as a bean, used by AuthController for authentication
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Defines the PasswordEncoder bean, using BCrypt for password hashing
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configures CORS (Cross-Origin Resource Sharing) to allow frontend requests
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow your React app's origins
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
        // Allow common HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // Allow common headers
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true); // Allow sending cookies/authorization headers
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply this CORS config to all paths
        return source;
    }

    // Defines the Security Filter Chain, configuring authorization rules and filter order
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless JWT-based APIs
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Apply CORS configuration
            .authorizeHttpRequests(auth -> auth
                // Publicly accessible endpoints (no authentication required)
                .requestMatchers("/api/auth/**").permitAll() // Login and registration
                .requestMatchers("/api/internships/public/**").permitAll() // Public view of active internships
                // Role-based access
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Admin only
                .requestMatchers("/api/students/**").hasRole("STUDENT") // Student only
                .requestMatchers("/api/mentors/**").hasRole("MENTOR") // Mentor only
                .requestMatchers("/api/applications/**").hasRole("STUDENT") // Students can apply
                // General authenticated access for internships
                .requestMatchers("/api/internships/**").hasAnyRole("ADMIN", "STUDENT", "MENTOR")
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                // Use stateless sessions for JWT (no session cookies or server-side sessions)
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        // Register our custom Authentication Provider
        http.authenticationProvider(authenticationProvider());

        // Add our custom JWT filter before Spring Security's default UsernamePasswordAuthenticationFilter
        // This ensures JWT is processed first for token-based authentication
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}