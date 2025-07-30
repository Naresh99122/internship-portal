package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.dto.UserProfileUpdateDto;
import com.university.internshipportal.backend.exception.ResourceNotFoundException;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.model.Student;
import com.university.internshipportal.backend.model.User;
import com.university.internshipportal.backend.repository.MentorStudentMatchRepository;
import com.university.internshipportal.backend.repository.StudentRepository;
import com.university.internshipportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MentorStudentMatchRepository mentorStudentMatchRepository;

    @Transactional
    public Student createStudentProfile(User user) {
        if (studentRepository.existsByUserId(user.getId())) {
            throw new RuntimeException("Student profile already exists for this user.");
        }
        Student student = new Student(user);
        return studentRepository.save(student);
    }

    public Student getStudentProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student Profile", "user", username));
    }

    public Student getStudentProfileById(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student Profile", "id", studentId));
    }

    @Transactional
    public Student updateStudentProfile(String username, UserProfileUpdateDto updateDto) {
        Student student = getStudentProfileByUsername(username);

        Optional.ofNullable(updateDto.getFirstName()).ifPresent(student::setFirstName);
        Optional.ofNullable(updateDto.getLastName()).ifPresent(student::setLastName);
        Optional.ofNullable(updateDto.getBio()).ifPresent(student::setBio);
        Optional.ofNullable(updateDto.getLinkedinProfileUrl()).ifPresent(student::setLinkedinProfileUrl);
        Optional.ofNullable(updateDto.getProfilePictureUrl()).ifPresent(student::setProfilePictureUrl);

        Optional.ofNullable(updateDto.getMajor()).ifPresent(student::setMajor);
        Optional.ofNullable(updateDto.getDegreeProgram()).ifPresent(student::setDegreeProgram);
        Optional.ofNullable(updateDto.getGraduationYear()).ifPresent(student::setGraduationYear);
        Optional.ofNullable(updateDto.getGpa()).ifPresent(student::setGpa);

        if (updateDto.getSkills() != null) {
            String skillsCsv = updateDto.getSkills().stream()
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.joining(","));
            student.setSkills(skillsCsv);
        } else {
            student.setSkills("");
        }

        if (updateDto.getInterests() != null) {
            String interestsCsv = updateDto.getInterests().stream()
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.joining(","));
            student.setInterests(interestsCsv);
        } else {
            student.setInterests("");
        }

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<MentorStudentMatch> getMatchedMentorsForStudent(Long studentId) {
        return mentorStudentMatchRepository.findByStudentId(studentId);
    }
}
