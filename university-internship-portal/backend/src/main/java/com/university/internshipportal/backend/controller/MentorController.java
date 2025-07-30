package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.UserProfileUpdateDto;
import com.university.internshipportal.backend.model.Mentor;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    @Autowired
    private MentorService mentorService;

    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/profile")
    public ResponseEntity<Mentor> getMentorProfile(Principal principal) {
        Mentor mentor = mentorService.getMentorProfileByUsername(principal.getName());
        return ResponseEntity.ok(mentor);
    }

    @PreAuthorize("hasRole('MENTOR')")
    @PutMapping("/profile")
    public ResponseEntity<Mentor> updateMentorProfile(
            Principal principal,
            @RequestBody UserProfileUpdateDto updateDto) {
        Mentor updatedMentor = mentorService.updateMentorProfile(principal.getName(), updateDto);
        return ResponseEntity.ok(updatedMentor);
    }

    @PreAuthorize("hasRole('MENTOR')")
    @GetMapping("/assigned-students")
    public ResponseEntity<List<MentorStudentMatch>> getAssignedStudents(Principal principal) {
        Mentor mentor = mentorService.getMentorProfileByUsername(principal.getName());
        List<MentorStudentMatch> matches = mentorService.getAssignedStudentsForMentor(mentor.getId());
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Mentor> getMentorById(@PathVariable Long id) {
        Mentor mentor = mentorService.getMentorProfileById(id);
        return ResponseEntity.ok(mentor);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Mentor>> getAllMentors() {
        List<Mentor> mentors = mentorService.getAllMentors();
        return ResponseEntity.ok(mentors);
    }
}
