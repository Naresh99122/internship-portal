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
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private InternshipService internshipService;
    @Autowired
    private MatchingService matchingService;

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

    @GetMapping("/internships/all")
    public ResponseEntity<List<Internship>> getAllInternshipsForAdmin() {
        List<Internship> internships = internshipService.getAllInternships();
        return ResponseEntity.ok(internships);
    }

    @PostMapping("/matching/run")
    public ResponseEntity<String> triggerMentorMatching() {
        matchingService.runMentorMatchingAlgorithm();
        return ResponseEntity.ok("Mentor matching algorithm triggered successfully. Matches will be updated shortly.");
    }
}