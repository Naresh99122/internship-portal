package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.LoginRequest;
import com.university.internshipportal.backend.dto.RegisterRequest;
import com.university.internshipportal.backend.exception.CustomAuthenticationException;
import com.university.internshipportal.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.registerUser(request);
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        try {
            String jwt = authService.authenticateUser(request.getUsername(), request.getPassword());
            String role = authService.getUserRole(request.getUsername());
            return ResponseEntity.ok(Map.of("token", jwt, "role", role));
        } catch (CustomAuthenticationException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.UNAUTHORIZED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}