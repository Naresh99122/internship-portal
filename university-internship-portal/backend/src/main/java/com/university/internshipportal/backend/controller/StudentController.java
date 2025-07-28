package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.UserProfileUpdateDto;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.model.Student;
import com.university.internshipportal.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // Represents the currently authenticated user
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Get student's own profile
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/profile")
    public ResponseEntity<Student> getStudentProfile(Principal principal) {
        // Principal.getName() gives the username of the authenticated user
        Student student = studentService.getStudentProfileByUsername(principal.getName());
        return ResponseEntity.ok(student);
    }

    // Update student's own profile
    @PreAuthorize("hasRole('STUDENT')")
    @PutMapping("/profile")
    public ResponseEntity<Student> updateStudentProfile(
            Principal principal,
            @RequestBody UserProfileUpdateDto updateDto) {
        Student updatedStudent = studentService.updateStudentProfile(principal.getName(), updateDto);
        return ResponseEntity.ok(updatedStudent);
    }

    // Get matched mentors for the authenticated student
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/mentors/matched")
    public ResponseEntity<List<MentorStudentMatch>> getMatchedMentors(Principal principal) {
        Student student = studentService.getStudentProfileByUsername(principal.getName());
        List<MentorStudentMatch> matches = studentService.getMatchedMentorsForStudent(student.getId());
        return ResponseEntity.ok(matches);
    }

    // Get a specific student's public profile (e.g., for mentor to view)
    // Note: You might want to filter what's visible publicly
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentProfileById(id);
        return ResponseEntity.ok(student);
    }
}