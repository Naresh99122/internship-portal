package com.university.internshipportal.backend.dto;

import com.university.internshipportal.backend.model.enums.Role; // Import the Role enum
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data; // For Lombok annotations

// IMPORTANT: Ensure all these imports are present and correct based on your file structure.

@Data // Lombok annotation to generate getters, setters, equals, hashCode, and toString
public class RegisterRequest {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    @Email(message = "Invalid email format") // Ensures the email is in a valid format
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;

    @NotNull(message = "Role cannot be null") // Role is mandatory for registration
    private Role role; // The role (STUDENT, MENTOR, ADMIN) for the new user
}