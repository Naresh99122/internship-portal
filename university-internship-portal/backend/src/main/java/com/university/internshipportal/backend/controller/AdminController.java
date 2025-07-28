package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.model.Internship;
import com.university.internshipportal.backend.model.User;
import com.university.internshipportal.backend.service.InternshipService;
import com.university.internshipportal.backend.service.MatchingService;
import com.university.internshipportal.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // All methods in this controller require ADMIN role
public class AdminController {

    @Autowired
    private UserService userService; // To manage users
    @Autowired
    private InternshipService internshipService; // To manage all internships (even inactive)
    @Autowired
    private MatchingService matchingService; // To trigger matching algorithm

    // --- User Management ---
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // You can add endpoints to update user roles or deactivate accounts here if needed.
    // Example: @PutMapping("/users/{id}/role")
    // Example: @PutMapping("/users/{id}/status")

    // --- Internship Management (Admin has full control) ---
    // Note: InternshipController already has methods for create, update, delete
    // Admins implicitly use those. This endpoint is just an example if needed.
    @GetMapping("/internships/all")
    public ResponseEntity<List<Internship>> getAllInternshipsForAdmin() {
        List<Internship> internships = internshipService.getAllInternships();
        return ResponseEntity.ok(internships);
    }

    // --- Matching Algorithm Trigger ---
    @PostMapping("/matching/run")
    public ResponseEntity<String> triggerMentorMatching() {
        matchingService.runMentorMatchingAlgorithm();
        return ResponseEntity.ok("Mentor matching algorithm triggered successfully. Matches will be updated shortly.");
    }
}
