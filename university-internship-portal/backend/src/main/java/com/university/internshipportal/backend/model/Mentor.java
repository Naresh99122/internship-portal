
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

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private String firstName;
    private String lastName;
    private String industry;
    private String company;
    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String expertiseAreas;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(columnDefinition = "TEXT")
    private String availability;

    private String linkedinProfileUrl;
    private String profilePictureUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

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
