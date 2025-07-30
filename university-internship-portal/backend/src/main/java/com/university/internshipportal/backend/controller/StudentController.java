package com.university.internshipportal.backend.controller;

import com.university.internshipportal.backend.dto.UserProfileUpdateDto;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.model.Student;
import com.university.internshipportal.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/profile")
    public ResponseEntity<Student> getStudentProfile(Principal principal) {
        Student student = studentService.getStudentProfileByUsername(principal.getName());
        return ResponseEntity.ok(student);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PutMapping("/profile")
    public ResponseEntity<Student> updateStudentProfile(
            Principal principal,
            @RequestBody UserProfileUpdateDto updateDto) {
        Student updatedStudent = studentService.updateStudentProfile(principal.getName(), updateDto);
        return ResponseEntity.ok(updatedStudent);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/mentors/matched")
    public ResponseEntity<List<MentorStudentMatch>> getMatchedMentors(Principal principal) {
        Student student = studentService.getStudentProfileByUsername(principal.getName());
        List<MentorStudentMatch> matches = studentService.getMatchedMentorsForStudent(student.getId());
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentProfileById(id);
        return ResponseEntity.ok(student);
    }
}
