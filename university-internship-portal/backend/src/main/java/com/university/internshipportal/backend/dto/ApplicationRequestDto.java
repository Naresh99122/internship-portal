package com.university.internshipportal.backend.dto;

import com.university.internshipportal.backend.model.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import jakarta.validation.constraints.Size;

@Data
public class ApplicationRequestDto {
    @NotNull(message = "Internship ID cannot be null")
    private Long internshipId;

    @Size(max = 5000, message = "Cover letter too long") // Max 5000 characters
    private String coverLetter;

    // For admin to update status, not for initial application
    private ApplicationStatus status;
    private String reviewNotes;
}
