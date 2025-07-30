package com.university.internshipportal.backend.model;

import com.university.internshipportal.backend.model.enums.ApplicationStatus; // Make sure this import is correct
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = {
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
    private Student student; // Make sure Student model is correctly imported and defined

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", referencedColumnName = "id", nullable = false)
    private Internship internship; // Make sure Internship model is correctly imported and defined

    @CreationTimestamp
    @Column(name = "application_date", updatable = false)
    private LocalDateTime applicationDate;

    @Enumerated(EnumType.STRING) // This is the explicit definition
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes;
}
