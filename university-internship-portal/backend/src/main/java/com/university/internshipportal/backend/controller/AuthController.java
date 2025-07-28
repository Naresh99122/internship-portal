package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.LoginRequest;
import com.university.internshipportal.backend.dto.RegisterRequest;
import com.university.internshipportal.backend.exception.CustomAuthenticationException;
import com.university.internshipportal.backend.service.AuthService;
import jakarta.validation.Valid; // For @Valid annotation
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map; // For returning simple map responses

// IMPORTANT: Ensure all these imports are present and correct based on your file structure.

@RestController // Indicates that this class is a REST controller
@RequestMapping("/api/auth") // Base path for all endpoints in this controller
public class AuthController {

    @Autowired
    private AuthService authService; // Autowire the AuthService

    /**
     * Handles user registration requests.
     * @param request The RegisterRequest DTO containing user registration details.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.registerUser(request);
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED); // 201 Created
        } catch (RuntimeException e) {
            // Catch RuntimeException for username/email already taken, etc.
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST); // 400 Bad Request
        }
    }

    /**
     * Handles user login and authentication requests.
     * @param request The LoginRequest DTO containing username and password.
     * @return ResponseEntity with JWT token and user role on success, or error details.
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        try {
            String jwt = authService.authenticateUser(request.getUsername(), request.getPassword());
            String role = authService.getUserRole(request.getUsername()); // Get user role after successful authentication
            return ResponseEntity.ok(Map.of("token", jwt, "role", role)); // 200 OK
        } catch (CustomAuthenticationException e) {
            // Catch custom authentication exceptions (e.g., invalid credentials)
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        } catch (RuntimeException e) {
            // Catch any other unexpected runtime errors during authentication process
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}