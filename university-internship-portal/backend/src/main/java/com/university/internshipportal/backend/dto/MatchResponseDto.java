package com.university.internshipportal.backend.dto;

import com.university.internshipportal.backend.model.Mentor;
import com.university.internshipportal.backend.model.Student;
import com.university.internshipportal.backend.model.enums.MatchStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponseDto {

    private Long id;
    private Double matchScore;
    private MatchStatus status;
    private LocalDateTime matchedAt;
    private String notes;

    private Long mentorId;
    private String mentorFirstName;
    private String mentorLastName;
    private String mentorJobTitle;
    private String mentorCompany;
    private String mentorProfilePictureUrl;
    private List<String> mentorExpertiseAreas;

    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private String studentMajor;
    private String studentProfilePictureUrl;

    public MatchResponseDto(Long id, Double matchScore, MatchStatus status, LocalDateTime matchedAt, String notes,
                            Mentor mentor, Student student) {
        this.id = id;
        this.matchScore = matchScore;
        this.status = status;
        this.matchedAt = matchedAt;
        this.notes = notes;

        if (mentor != null) {
            this.mentorId = mentor.getId();
            this.mentorFirstName = mentor.getFirstName();
            this.mentorLastName = mentor.getLastName();
            this.mentorJobTitle = mentor.getJobTitle();
            this.mentorCompany = mentor.getCompany();
            this.mentorProfilePictureUrl = mentor.getProfilePictureUrl();
            if (mentor.getExpertiseAreas() != null && !mentor.getExpertiseAreas().isEmpty()) {
                this.mentorExpertiseAreas = Arrays.asList(mentor.getExpertiseAreas().split(",\\s*"));
            } else {
                this.mentorExpertiseAreas = new ArrayList<>();
            }
        }

        if (student != null) {
            this.studentId = student.getId();
            this.studentFirstName = student.getFirstName();
            this.studentLastName = student.getLastName();
            this.studentMajor = student.getMajor();
            this.studentProfilePictureUrl = student.getProfilePictureUrl();
        }
    }
}