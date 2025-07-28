package com.university.internshipportal.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mentor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL) // CascadeType.ALL ensures user is saved/deleted with mentor
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user; // Links to the common User table

    private String firstName;
    private String lastName;
    private String industry;
    private String company;
    private String jobTitle;

    @Column(columnDefinition = "TEXT") // Expertise areas as comma-separated string
    private String expertiseAreas;

    @Column(columnDefinition = "TEXT") // Bio for mentor
    private String bio;

    @Column(columnDefinition = "TEXT") // Skills as comma-separated string
    private String skills;

    @Column(columnDefinition = "TEXT") // Interests as comma-separated string
    private String interests;

    @Column(columnDefinition = "TEXT") // Availability description (e.g., "Mon-Wed evenings")
    private String availability;

    private String linkedinProfileUrl;
    private String profilePictureUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructor for initial profile creation
    public Mentor(User user) {
        this.user = user;
        this.firstName = "";
        this.lastName = "";
        this.industry = "";
        this.company = "";
        this.jobTitle = "";
        this.expertiseAreas = "";
        this.bio = "";
        this.skills = "";
        this.interests = "";
        this.availability = "";
        this.linkedinProfileUrl = "";
        this.profilePictureUrl = "";
    }
}
