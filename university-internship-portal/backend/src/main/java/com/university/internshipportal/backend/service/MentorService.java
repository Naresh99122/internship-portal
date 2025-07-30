package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.dto.UserProfileUpdateDto;
import com.university.internshipportal.backend.exception.ResourceNotFoundException;
import com.university.internshipportal.backend.model.Mentor;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.model.User;
import com.university.internshipportal.backend.repository.MentorRepository;
import com.university.internshipportal.backend.repository.MentorStudentMatchRepository;
import com.university.internshipportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
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
        Mentor mentor = new Mentor(user);
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

        Optional.ofNullable(updateDto.getFirstName()).ifPresent(mentor::setFirstName);
        Optional.ofNullable(updateDto.getLastName()).ifPresent(mentor::setLastName);
        Optional.ofNullable(updateDto.getBio()).ifPresent(mentor::setBio);
        Optional.ofNullable(updateDto.getLinkedinProfileUrl()).ifPresent(mentor::setLinkedinProfileUrl);
        Optional.ofNullable(updateDto.getProfilePictureUrl()).ifPresent(mentor::setProfilePictureUrl);

        Optional.ofNullable(updateDto.getIndustry()).ifPresent(mentor::setIndustry);
        Optional.ofNullable(updateDto.getCompany()).ifPresent(mentor::setCompany);
        Optional.ofNullable(updateDto.getJobTitle()).ifPresent(mentor::setJobTitle);
        Optional.ofNullable(updateDto.getAvailability()).ifPresent(mentor::setAvailability);

        if (updateDto.getSkills() != null) {
            String skillsCsv = updateDto.getSkills().stream()
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.joining(","));
            mentor.setSkills(skillsCsv);
        } else {
            mentor.setSkills("");
        }

        if (updateDto.getInterests() != null) {
            String interestsCsv = updateDto.getInterests().stream()
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.joining(","));
            mentor.setInterests(interestsCsv);
        } else {
            mentor.setInterests("");
        }

        if (updateDto.getExpertiseAreas() != null) {
            String expertiseAreasCsv = updateDto.getExpertiseAreas().stream()
                                            .map(String::trim)
                                            .filter(s -> !s.isEmpty())
                                            .collect(Collectors.joining(","));
            mentor.setExpertiseAreas(expertiseAreasCsv);
        } else {
            mentor.setExpertiseAreas("");
        }

        return mentorRepository.save(mentor);
    }

    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    public List<MentorStudentMatch> getAssignedStudentsForMentor(Long mentorId) {
        return mentorStudentMatchRepository.findByMentorId(mentorId);
    }
}
