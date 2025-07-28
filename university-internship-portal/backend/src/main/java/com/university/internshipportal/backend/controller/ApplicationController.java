package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.ApplicationRequestDto;
import com.university.internshipportal.backend.model.Application;
import com.university.internshipportal.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

// NEW IMPORTS FOR FIX:
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;


@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // Student applies for an internship
    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> applyForInternship(
            Principal principal,
            @Valid @RequestBody ApplicationRequestDto requestDto) {
        Application newApplication = applicationService.applyForInternship(principal.getName(), requestDto);
        return new ResponseEntity<>(newApplication, HttpStatus.CREATED);
    }

    // Get all applications for the authenticated student
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications(Principal principal) {
        List<Application> applications = applicationService.getApplicationsByStudent(principal.getName());
        return ResponseEntity.ok(applications);
    }

    // Get a single application by ID (Student can view their own, Admin/Mentor can view others)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id, Principal principal) {
        Application application = applicationService.getApplicationById(id);

        // --- FIX START ---
        // Get the full Authentication object from the SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        // Check if the current user is the student who owns the application
        boolean isOwner = currentUsername.equals(application.getStudent().getUser().getUsername());

        // Check if the current user is an Admin
        boolean isAdmin = authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Check if the current user is a Mentor and if the internship was posted by them
        // OR if the mentor is assigned to the student (more complex, might need service lookup)
        boolean isInternshipMentor = false;
        if (authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_MENTOR"))) {
            // This logic is simplified. A mentor can view applications for internships THEY posted.
            // For a mentor to view an application for a student THEY ARE MENTORING,
            // you'd need to inject MentorService/MatchingService and check if this student is assigned to them.
            if (application.getInternship().getPostedBy() != null &&
                application.getInternship().getPostedBy().getUsername().equals(currentUsername)) {
                isInternshipMentor = true;
            }
        }


        if (isOwner || isAdmin || isInternshipMentor) {
            return ResponseEntity.ok(application);
        } else {
            // Return 403 Forbidden if not authorized
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        // --- FIX END ---
    }

    // Update application status (Admin/Mentor)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')") // Mentor can update applications for internships they posted or students they mentor
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody ApplicationRequestDto requestDto) { // Only status and reviewNotes are expected here
        Application updatedApplication = applicationService.updateApplicationStatus(id, requestDto);
        return ResponseEntity.ok(updatedApplication);
    }

    // Get all applications (Admin only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }
}
