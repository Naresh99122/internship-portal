package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.dto.ApplicationRequestDto;
import com.university.internshipportal.backend.exception.ResourceNotFoundException;
import com.university.internshipportal.backend.model.Application;
import com.university.internshipportal.backend.model.Internship;
import com.university.internshipportal.backend.model.Student;
import com.university.internshipportal.backend.model.enums.ApplicationStatus;
import com.university.internshipportal.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private StudentService studentService; // To get student by username/id
    @Autowired
    private InternshipService internshipService; // To get internship by id

    @Transactional
    public Application applyForInternship(String studentUsername, ApplicationRequestDto requestDto) {
        Student student = studentService.getStudentProfileByUsername(studentUsername);
        Internship internship = internshipService.getInternshipById(requestDto.getInternshipId());

        if (applicationRepository.existsByStudentAndInternship(student, internship)) {
            throw new RuntimeException("You have already applied for this internship.");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setInternship(internship);
        application.setCoverLetter(requestDto.getCoverLetter());
        application.setStatus(ApplicationStatus.PENDING); // Initial status is PENDING

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByStudent(String studentUsername) {
        Student student = studentService.getStudentProfileByUsername(studentUsername);
        return applicationRepository.findByStudent(student);
    }

    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
    }

    // Admin/Mentor/Employer can update application status
    @Transactional
    public Application updateApplicationStatus(Long applicationId, ApplicationRequestDto requestDto) {
        Application application = getApplicationById(applicationId);

        Optional.ofNullable(requestDto.getStatus()).ifPresent(application::setStatus);
        Optional.ofNullable(requestDto.getReviewNotes()).ifPresent(application::setReviewNotes);

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
