package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.dto.InternshipRequestDto;
import com.university.internshipportal.backend.exception.ResourceNotFoundException;
import com.university.internshipportal.backend.model.Internship;
import com.university.internshipportal.backend.model.User;
import com.university.internshipportal.backend.model.enums.InternshipStatus;
import com.university.internshipportal.backend.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;
    @Autowired
    private UserService userService; // To get User (Admin) who posted

    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    public List<Internship> getActiveInternships() {
        return internshipRepository.findByStatus(InternshipStatus.ACTIVE);
    }

    public Internship getInternshipById(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", "id", id));
    }

    @Transactional
    public Internship createInternship(InternshipRequestDto requestDto, String postedByUsername) {
        User postedBy = userService.getUserByUsername(postedByUsername); // Get the admin user

        Internship internship = new Internship();
        mapDtoToInternship(requestDto, internship);
        internship.setPostedBy(postedBy); // Set the posting admin
        internship.setStatus(Optional.ofNullable(requestDto.getStatus()).orElse(InternshipStatus.PENDING_APPROVAL)); // Default or provided status

        return internshipRepository.save(internship);
    }

    @Transactional
    public Internship updateInternship(Long id, InternshipRequestDto requestDto) {
        Internship internship = getInternshipById(id); // Throws if not found

        mapDtoToInternship(requestDto, internship);
        internship.setStatus(requestDto.getStatus()); // Status can be updated by admin

        return internshipRepository.save(internship);
    }

    @Transactional
    public void deleteInternship(Long id) {
        if (!internshipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Internship", "id", id);
        }
        internshipRepository.deleteById(id);
    }

    // Helper method to map DTO fields to Internship entity
    private void mapDtoToInternship(InternshipRequestDto dto, Internship internship) {
        Optional.ofNullable(dto.getTitle()).ifPresent(internship::setTitle);
        Optional.ofNullable(dto.getCompanyName()).ifPresent(internship::setCompanyName);
        Optional.ofNullable(dto.getLocation()).ifPresent(internship::setLocation);
        Optional.ofNullable(dto.getDescription()).ifPresent(internship::setDescription);
        Optional.ofNullable(dto.getRequirements()).ifPresent(internship::setRequirements);
        Optional.ofNullable(dto.getResponsibilities()).ifPresent(internship::setResponsibilities);
        Optional.ofNullable(dto.getStipend()).ifPresent(internship::setStipend);
        Optional.ofNullable(dto.getDuration()).ifPresent(internship::setDuration);
        Optional.ofNullable(dto.getStartDate()).ifPresent(internship::setStartDate);
        Optional.ofNullable(dto.getEndDate()).ifPresent(internship::setEndDate);
        Optional.ofNullable(dto.getApplicationDeadline()).ifPresent(internship::setApplicationDeadline);
        Optional.ofNullable(dto.getContactEmail()).ifPresent(internship::setContactEmail);
        Optional.ofNullable(dto.getCompanyWebsite()).ifPresent(internship::setCompanyWebsite);

        // Convert List<String> skillsRequired to comma-separated String
        if (dto.getSkillsRequired() != null) {
            internship.setSkillsRequired(String.join(",", dto.getSkillsRequired()));
        }
    }
}
