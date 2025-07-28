package com.university.internshipportal.backend.model;

import com.university.internshipportal.backend.model.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_student_matches", uniqueConstraints = { // Ensure unique mentor-student pair
        @UniqueConstraint(columnNames = {"student_id", "mentor_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorStudentMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", referencedColumnName = "id", nullable = false)
    private Mentor mentor;

    @Column(name = "match_score", nullable = false)
    private Double matchScore; // Score from 0.0 to 100.0

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status; // Suggested, Accepted, Active, Completed etc.

    @Column(name = "matched_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime matchedAt;

    @Column(columnDefinition = "TEXT")
    private String notes; // Notes about the match or interaction
}
