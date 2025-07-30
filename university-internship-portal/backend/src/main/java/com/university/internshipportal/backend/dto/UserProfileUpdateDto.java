package com.university.internshipportal.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

import java.util.List;

@Data
public class UserProfileUpdateDto {

    private String firstName;
    private String lastName;
    private String bio;
    private String linkedinProfileUrl;
    private String profilePictureUrl;

    private String major;
    private String degreeProgram;
    private Integer graduationYear;
    private Double gpa;

    private String industry;
    private String company;
    private String jobTitle;
    private String availability;

    private List<String> skills;
    private List<String> interests;
    private List<String> expertiseAreas;
}
