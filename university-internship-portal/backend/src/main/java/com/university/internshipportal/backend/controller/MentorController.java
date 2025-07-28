package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.UserProfileUpdateDto;
import com.university.internshipportal.backend.model.Mentor;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // Import for Principal
import java.util.List; // Import for List


@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    @Autowired
    private MentorService mentorService;

    /**
     * Retrieves the profile of the authenticated mentor.
     * Accessible only by users with the MENTOR role.
     * Corresponds to frontend page: MentorProfilePage.jsx
     * @param principal The authenticated user's principal object.
     * @return ResponseEntity containing the Mentor profile.
     */
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/profile")
    public ResponseEntity<Mentor> getMentorProfile(Principal principal) {
        Mentor mentor = mentorService.getMentorProfileByUsername(principal.getName());
        return ResponseEntity.ok(mentor);
    }

    /**
     * Updates the profile of the authenticated mentor.
     * Accessible only by users with the MENTOR role.
     * Corresponds to frontend page: MentorProfilePage.jsx
     * @param principal The authenticated user's principal object.
     * @param updateDto The DTO containing updated profile information.
     * @return ResponseEntity containing the updated Mentor profile.
     */
    @PreAuthorize("hasRole('MENTOR')")
    @PutMapping("/profile")
    public ResponseEntity<Mentor> updateMentorProfile(
            Principal principal,
            @RequestBody UserProfileUpdateDto updateDto) {
        Mentor updatedMentor = mentorService.updateMentorProfile(principal.getName(), updateDto);
        return ResponseEntity.ok(updatedMentor);
    }

    /**
     * Retrieves a list of students assigned or matched to the authenticated mentor.
     * Accessible only by users with the MENTOR role.
     * Corresponds to frontend page: MentorDashboardPage.jsx
     * @param principal The authenticated user's principal object.
     * @return ResponseEntity containing a list of MentorStudentMatch objects.
     */
    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/assigned-students")
    public ResponseEntity<List<MentorStudentMatch>> getAssignedStudents(Principal principal) {
        Mentor mentor = mentorService.getMentorProfileByUsername(principal.getName());
        List<MentorStudentMatch> matches = mentorService.getAssignedStudentsForMentor(mentor.getId());
        return ResponseEntity.ok(matches);
    }

    /**
     * Retrieves the public profile of a specific mentor by ID.
     * Accessible by students, other mentors, and admins.
     * Corresponds to frontend page: MentorDetailPage.jsx
     * @param id The ID of the mentor.
     * @return ResponseEntity containing the Mentor profile (potentially filtered for public view).
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')") // Students/Admins can view mentor profiles
    public ResponseEntity<Mentor> getMentorById(@PathVariable Long id) {
        Mentor mentor = mentorService.getMentorProfileById(id);
        return ResponseEntity.ok(mentor);
    }

    /**
     * Retrieves a list of all mentors.
     * Accessible by students and admins (e.g., for Browse or management).
     * Corresponds to frontend page: (Can be used for a "Browse Mentors" page or admin management)
     * @return ResponseEntity containing a list of all Mentor profiles.
     */
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Mentor>> getAllMentors() {
        List<Mentor> mentors = mentorService.getAllMentors();
        return ResponseEntity.ok(mentors);
    }
}