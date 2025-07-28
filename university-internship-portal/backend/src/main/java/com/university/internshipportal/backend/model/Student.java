package com.university.internshipportal.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL) // CascadeType.ALL ensures user is saved/deleted with student
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user; // Links to the common User table

    private String firstName;
    private String lastName;
    private String major;
    private String degreeProgram;
    private Integer graduationYear;

    @Column(columnDefinition = "TEXT") // Use TEXT for potentially long descriptions
    private String bio;

    @Column(columnDefinition = "TEXT") // Skills as comma-separated string
    private String skills;

    @Column(columnDefinition = "TEXT") // Interests as comma-separated string
    private String interests;

    private String resumeUrl; // URL to resume hosted elsewhere (e.g., S3, Google Drive)
    private String linkedinProfileUrl;
    private Double gpa;
    private String profilePictureUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructor for initial profile creation
    public Student(User user) {
        this.user = user;
        this.firstName = ""; // Initialize with empty strings
        this.lastName = "";
        this.major = "";
        this.degreeProgram = "";
        this.graduationYear = null;
        this.bio = "";
        this.skills = "";
        this.interests = "";
        this.resumeUrl = "";
        this.linkedinProfileUrl = "";
        this.gpa = null;
        this.profilePictureUrl = "";
    }
}