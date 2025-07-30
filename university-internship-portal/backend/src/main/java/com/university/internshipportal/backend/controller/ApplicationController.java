package com.university.internshipportal.backend.controller;

// <<< FIX START: Ensure all these imports are present and correct >>>
import com.university.internshipportal.backend.dto.ApplicationRequestDto;
import com.university.internshipportal.backend.model.Application; // <<< THIS IS THE CRITICAL IMPORT FOR 'Application' MODEL
import com.university.internshipportal.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
// <<< FIX END >>>

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> applyForInternship(
            Principal principal,
            @Valid @RequestBody ApplicationRequestDto requestDto) {
        Application newApplication = applicationService.applyForInternship(principal.getName(), requestDto);
        return new ResponseEntity<>(newApplication, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications(Principal principal) {
        List<Application> applications = applicationService.getApplicationsByStudent(principal.getName());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id, Principal principal) {
        Application application = applicationService.getApplicationById(id);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        boolean isOwner = currentUsername.equals(application.getStudent().getUser().getUsername());
        boolean isAdmin = authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        boolean isInternshipMentor = false;
        if (authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_MENTOR"))) {
            // Note: This check assumes the internship's postedBy is the relevant mentor.
            // For more complex mentor-student assignments, you might need a service call here.
            if (application.getInternship().getPostedBy() != null &&
                application.getInternship().getPostedBy().getUsername().equals(currentUsername)) {
                isInternshipMentor = true;
            }
        }

        if (isOwner || isAdmin || isInternshipMentor) {
            return ResponseEntity.ok(application);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody ApplicationRequestDto requestDto) {
        Application updatedApplication = applicationService.updateApplicationStatus(id, requestDto);
        return ResponseEntity.ok(updatedApplication);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }
}