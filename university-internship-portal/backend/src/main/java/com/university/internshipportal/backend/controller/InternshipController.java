package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.InternshipRequestDto;
import com.university.internshipportal.backend.model.Internship;
import com.university.internshipportal.backend.service.InternshipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    // Public endpoint for all active internships (accessible without login)
    @GetMapping("/public")
    public ResponseEntity<List<Internship>> getActiveInternshipsPublic() {
        List<Internship> internships = internshipService.getActiveInternships();
        return ResponseEntity.ok(internships);
    }

    // Get all internships (requires login, can be filtered by role in service if needed)
    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<Internship>> getAllInternships() {
        List<Internship> internships = internshipService.getAllInternships();
        return ResponseEntity.ok(internships);
    }

    // Get a single internship by ID (accessible after login)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        Internship internship = internshipService.getInternshipById(id);
        return ResponseEntity.ok(internship);
    }

    // Create a new internship (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Internship> createInternship(
            @Valid @RequestBody InternshipRequestDto requestDto,
            Principal principal) {
        Internship newInternship = internshipService.createInternship(requestDto, principal.getName());
        return new ResponseEntity<>(newInternship, HttpStatus.CREATED);
    }

    // Update an existing internship (Admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Internship> updateInternship(
            @PathVariable Long id,
            @Valid @RequestBody InternshipRequestDto requestDto) {
        Internship updatedInternship = internshipService.updateInternship(id, requestDto);
        return ResponseEntity.ok(updatedInternship);
    }

    // Delete an internship (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
