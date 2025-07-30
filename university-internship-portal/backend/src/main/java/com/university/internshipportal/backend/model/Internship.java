package com.university.internshipportal.backend.model;

import com.university.internshipportal.backend.model.enums.InternshipStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "internships")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Internship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String skillsRequired;

    @Column(length = 50)
    private String stipend;

    @Column(length = 50)
    private String duration;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by", referencedColumnName = "id", nullable = false)
    private User postedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InternshipStatus status;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "company_website", length = 255)
    private String companyWebsite;

    @CreationTimestamp
    @Column(name = "posted_at", updatable = false)
    private LocalDateTime postedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}