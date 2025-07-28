package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.dto.UserProfileUpdateDto; // Ensure this is imported
import com.university.internshipportal.backend.exception.ResourceNotFoundException; // Ensure this is imported
import com.university.internshipportal.backend.model.Mentor; // Ensure this is imported
import com.university.internshipportal.backend.model.MentorStudentMatch; // Ensure this is imported
import com.university.internshipportal.backend.model.User; // Ensure this is imported
import com.university.internshipportal.backend.repository.MentorRepository; // Ensure this is imported
import com.university.internshipportal.backend.repository.MentorStudentMatchRepository; // Ensure this is imported
import com.university.internshipportal.backend.repository.UserRepository; // Ensure this is imported
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // CRITICAL: This annotation
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays; // Needed for String.split() and String.join()
import java.util.List;
import java.util.Optional; // Ensure Optional is imported
import java.util.stream.Collectors; // Ensure Collectors is imported


@Service // <-- This annotation tells Spring to create a bean for this class
public class MentorService {

    @Autowired
    private MentorRepository mentorRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MentorStudentMatchRepository mentorStudentMatchRepository;

    @Transactional
    public Mentor createMentorProfile(User user) {
        if (mentorRepository.existsByUserId(user.getId())) {
            throw new RuntimeException("Mentor profile already exists for this user.");
        }
        Mentor mentor = new Mentor(user); // Use the constructor to initialize
        return mentorRepository.save(mentor);
    }

    public Mentor getMentorProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return mentorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor Profile", "user", username));
    }

    public Mentor getMentorProfileById(Long mentorId) {
        return mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor Profile", "id", mentorId));
    }

    @Transactional
    public Mentor updateMentorProfile(String username, UserProfileUpdateDto updateDto) {
        Mentor mentor = getMentorProfileByUsername(username);

        // Update common fields
        Optional.ofNullable(updateDto.getFirstName()).ifPresent(mentor::setFirstName);
        Optional.ofNullable(updateDto.getLastName()).ifPresent(mentor::setLastName);
        Optional.ofNullable(updateDto.getBio()).ifPresent(mentor::setBio);
        Optional.ofNullable(updateDto.getLinkedinProfileUrl()).ifPresent(mentor::setLinkedinProfileUrl);
        Optional.ofNullable(updateDto.getProfilePictureUrl()).ifPresent(mentor::setProfilePictureUrl);

        // Update mentor-specific fields
        Optional.ofNullable(updateDto.getIndustry()).ifPresent(mentor::setIndustry);
        Optional.ofNullable(updateDto.getCompany()).ifPresent(mentor::setCompany);
        Optional.ofNullable(updateDto.getJobTitle()).ifPresent(mentor::setJobTitle);
        Optional.ofNullable(updateDto.getAvailability()).ifPresent(mentor::setAvailability);

        // Convert List<String> to comma-separated String for DB storage
        if (updateDto.getSkills() != null) {
            String skillsCsv = updateDto.getSkills().stream()
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.joining(","));
            mentor.setSkills(skillsCsv);
        } else {
            mentor.setSkills(""); // Clear skills if null is passed
        }


        if (updateDto.getInterests() != null) {
            String interestsCsv = updateDto.getInterests().stream()
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.joining(","));
            mentor.setInterests(interestsCsv);
        } else {
            mentor.setInterests(""); // Clear interests if null is passed
        }


        if (updateDto.getExpertiseAreas() != null) {
            String expertiseAreasCsv = updateDto.getExpertiseAreas().stream()
                                            .map(String::trim)
                                            .filter(s -> !s.isEmpty())
                                            .collect(Collectors.joining(","));
            mentor.setExpertiseAreas(expertiseAreasCsv);
        } else {
            mentor.setExpertiseAreas(""); // Clear expertise areas if null is passed
        }

        return mentorRepository.save(mentor);
    }

    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    // Get students assigned/matched to this mentor (requires MentorStudentMatch entity/repo)
    public List<MentorStudentMatch> getAssignedStudentsForMentor(Long mentorId) {
        return mentorStudentMatchRepository.findByMentorId(mentorId);
    }
}