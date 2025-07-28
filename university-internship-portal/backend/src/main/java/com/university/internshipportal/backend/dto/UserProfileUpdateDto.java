package com.university.internshipportal.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

import java.util.List;

// This DTO can be used for both student and mentor profile updates
// Frontend sends the relevant fields for the user's role.
@Data
public class UserProfileUpdateDto {

    private String firstName;
    private String lastName;
    private String bio;
    private String linkedinProfileUrl;
    private String profilePictureUrl;

    // Student Specific Fields
    private String major;
    private String degreeProgram;
    private Integer graduationYear;
    private Double gpa;

    // Mentor Specific Fields
    private String industry;
    private String company;
    private String jobTitle;
    private String availability;

    // Common fields that need to be converted from List<String> to String (comma-separated)
    // Frontend sends List<String>, backend converts to String for DB storage
    private List<String> skills;
    private List<String> interests;
    private List<String> expertiseAreas; // Mentor specific
    

    
}