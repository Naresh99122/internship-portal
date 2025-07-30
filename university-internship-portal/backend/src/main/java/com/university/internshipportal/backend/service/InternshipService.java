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
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;
    @Autowired
    private UserService userService;

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
        User postedBy = userService.getUserByUsername(postedByUsername);

        Internship internship = new Internship();
        mapDtoToInternship(requestDto, internship);
        internship.setPostedBy(postedBy);
        internship.setStatus(Optional.ofNullable(requestDto.getStatus()).orElse(InternshipStatus.PENDING_APPROVAL));

        return internshipRepository.save(internship);
    }

    @Transactional
    public Internship updateInternship(Long id, InternshipRequestDto requestDto) {
        Internship internship = getInternshipById(id);

        mapDtoToInternship(requestDto, internship);
        internship.setStatus(requestDto.getStatus());

        return internshipRepository.save(internship);
    }

    @Transactional
    public void deleteInternship(Long id) {
        if (!internshipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Internship", "id", id);
        }
        internshipRepository.deleteById(id);
    }

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

        if (dto.getSkillsRequired() != null) {
            String skillsCsv = dto.getSkillsRequired().stream()
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.joining(","));
            internship.setSkillsRequired(skillsCsv);
        } else {
            internship.setSkillsRequired("");
        }
    }
}