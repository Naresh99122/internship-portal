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

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private String firstName;
    private String lastName;
    private String major;
    private String degreeProgram;
    private Integer graduationYear;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String interests;

    private String resumeUrl;
    private String linkedinProfileUrl;
    private Double gpa;
    private String profilePictureUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Student(User user) {
        this.user = user;
        this.firstName = "";
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
