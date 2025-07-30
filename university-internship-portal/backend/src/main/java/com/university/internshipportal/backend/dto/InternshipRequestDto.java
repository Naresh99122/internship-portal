package com.university.internshipportal.backend.dto;

import com.university.internshipportal.backend.model.enums.InternshipStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class InternshipRequestDto {
    @NotBlank(message = "Title cannot be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Company name cannot be blank")
    @Size(max = 100, message = "Company name cannot exceed 100 characters")
    private String companyName;

    @NotBlank(message = "Location cannot be blank")
    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotBlank(message = "Requirements cannot be blank")
    private String requirements;

    private String responsibilities;

    private List<String> skillsRequired;

    @Size(max = 50, message = "Stipend information too long")
    private String stipend;

    @Size(max = 50, message = "Duration information too long")
    private String duration;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate applicationDeadline;

    @NotNull(message = "Internship status cannot be null")
    private InternshipStatus status;

    @Email(message = "Invalid contact email format")
    @Size(max = 100, message = "Contact email too long")
    private String contactEmail;

    @Size(max = 255, message = "Company website URL too long")
    private String companyWebsite;
}
