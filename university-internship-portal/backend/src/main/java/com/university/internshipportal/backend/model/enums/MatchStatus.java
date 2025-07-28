package com.university.internshipportal.backend.model.enums;

public enum MatchStatus {
    SUGGESTED,    // Initial match by algorithm, suggested to student/mentor
    REQUESTED,    // Student has requested mentorship from a mentor
    ACCEPTED,     // Mentor has accepted a student's request
    REJECTED,     // Mentor has rejected a student's request
    ACTIVE,       // Mentorship is currently ongoing
    COMPLETED     // Mentorship has been completed
}
