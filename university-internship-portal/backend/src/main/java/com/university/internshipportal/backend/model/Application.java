package com.university.internshipportal.backend.model;

import com.university.internshipportal.backend.model.enums.ApplicationStatus; // Ensure this is imported
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = { // Ensure student applies once per internship
        @UniqueConstraint(columnNames = {"student_id", "internship_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private Student student; // Student who applied

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", referencedColumnName = "id", nullable = false)
    private Internship internship; // Internship applied to

    @CreationTimestamp
    @Column(name = "application_date", updatable = false)
    private LocalDateTime applicationDate;

    // *** CRITICAL FIX HERE: Ensure EnumType.STRING is explicitly used ***
    @Enumerated(EnumType.STRING) // <-- THIS MUST BE (EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter; // Optional cover letter

    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes; // Notes from admin/employer/mentor
}