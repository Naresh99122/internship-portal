package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.model.Internship;
import com.university.internshipportal.backend.model.Mentor;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.model.Student;
import com.university.internshipportal.backend.model.enums.MatchStatus;
import com.university.internshipportal.backend.repository.InternshipRepository;
import com.university.internshipportal.backend.repository.MentorRepository;
import com.university.internshipportal.backend.repository.MentorStudentMatchRepository;
import com.university.internshipportal.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Collections;

import com.university.internshipportal.backend.model.enums.InternshipStatus;
import com.university.internshipportal.backend.exception.ResourceNotFoundException;


@Service
public class MatchingService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private MentorRepository mentorRepository;
    @Autowired
    private InternshipRepository internshipRepository;
    @Autowired
    private MentorStudentMatchRepository mentorStudentMatchRepository;

    private static final double SKILLS_WEIGHT = 50.0;
    private static final double INTERESTS_WEIGHT = 30.0;
    private static final double MAJOR_MATCH_WEIGHT = 20.0;
    private static final double MIN_MENTOR_MATCH_SCORE_FOR_SUGGESTION = 30.0;

    @Transactional
    public void runMentorMatchingAlgorithm() {
        List<Student> students = studentRepository.findAll();
        List<Mentor> mentors = mentorRepository.findAll();

        for (Student student : students) {
            for (Mentor mentor : mentors) {
                double score = calculateMentorStudentMatchScore(student, mentor);

                if (score >= MIN_MENTOR_MATCH_SCORE_FOR_SUGGESTION) {
                    Optional<MentorStudentMatch> existingMatch = mentorStudentMatchRepository.findByStudentAndMentor(student, mentor);

                    if (existingMatch.isPresent()) {
                        MentorStudentMatch match = existingMatch.get();
                        if (score > match.getMatchScore() || match.getStatus() == MatchStatus.SUGGESTED) {
                            match.setMatchScore(score);
                            if (match.getStatus() == MatchStatus.SUGGESTED) {
                                mentorStudentMatchRepository.save(match);
                            }
                        }
                    } else {
                        MentorStudentMatch newMatch = new MentorStudentMatch();
                        newMatch.setStudent(student);
                        newMatch.setMentor(mentor);
                        newMatch.setMatchScore(score);
                        newMatch.setStatus(MatchStatus.SUGGESTED);
                        mentorStudentMatchRepository.save(newMatch);
                    }
                }
            }
        }
    }

    private double calculateMentorStudentMatchScore(Student student, Mentor mentor) {
        double score = 0.0;

        Set<String> studentSkills = parseCommaSeparatedString(student.getSkills());
        Set<String> mentorSkills = parseCommaSeparatedString(mentor.getSkills());
        Set<String> commonSkills = new HashSet<>(studentSkills);
        commonSkills.retainAll(mentorSkills);
        score += commonSkills.size() * SKILLS_WEIGHT;

        Set<String> studentInterests = parseCommaSeparatedString(student.getInterests());
        Set<String> mentorInterests = parseCommaSeparatedString(mentor.getInterests());
        Set<String> commonInterests = new HashSet<>(studentInterests);
        commonInterests.retainAll(mentorInterests);
        score += commonInterests.size() * INTERESTS_WEIGHT;

        if (student.getMajor() != null && mentor.getExpertiseAreas() != null) {
            Set<String> mentorExpertise = parseCommaSeparatedString(mentor.getExpertiseAreas());
            if (mentorExpertise.stream().anyMatch(area -> area.equalsIgnoreCase(student.getMajor()))) {
                score += MAJOR_MATCH_WEIGHT;
            }
        }

        double maxPossibleSkillScore = (studentSkills.size() > 0 && mentorSkills.size() > 0) ? Math.min(studentSkills.size(), mentorSkills.size()) * SKILLS_WEIGHT : 0;
        double maxPossibleInterestScore = (studentInterests.size() > 0 && mentorInterests.size() > 0) ? Math.min(studentInterests.size(), mentorInterests.size()) * INTERESTS_WEIGHT : 0;
        double maxPossibleMajorScore = MAJOR_MATCH_WEIGHT;

        double totalPossibleScore = maxPossibleSkillScore + maxPossibleInterestScore + maxPossibleMajorScore;
        if (totalPossibleScore > 0) {
            score = (score / totalPossibleScore) * 100.0;
        } else {
            score = 0.0;
        }

        return Math.min(100.0, Math.max(0.0, score));
    }

    public List<Internship> getMatchedInternshipsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        List<Internship> activeInternships = internshipRepository.findByStatus(InternshipStatus.ACTIVE);
        List<Internship> matchedInternships = new ArrayList<>();

        for (Internship internship : activeInternships) {
            double score = calculateStudentInternshipMatchScore(student, internship);
            if (score >= MIN_MENTOR_MATCH_SCORE_FOR_SUGGESTION) {
                matchedInternships.add(internship);
            }
        }
        return matchedInternships;
    }

    private double calculateStudentInternshipMatchScore(Student student, Internship internship) {
        double score = 0.0;

        Set<String> studentSkills = parseCommaSeparatedString(student.getSkills());
        Set<String> internshipSkills = parseCommaSeparatedString(internship.getSkillsRequired());
        Set<String> commonSkills = new HashSet<>(studentSkills);
        commonSkills.retainAll(internshipSkills);
        score += commonSkills.size() * SKILLS_WEIGHT;

        if (student.getMajor() != null && (
            internship.getDescription().toLowerCase().contains(student.getMajor().toLowerCase()) ||
            internship.getRequirements().toLowerCase().contains(student.getMajor().toLowerCase()))) {
            score += MAJOR_MATCH_WEIGHT;
        }

        double maxPossibleSkillScore = (studentSkills.size() > 0 && internshipSkills.size() > 0) ? Math.min(studentSkills.size(), internshipSkills.size()) * SKILLS_WEIGHT : 0;
        double maxPossibleMajorScore = MAJOR_MATCH_WEIGHT;
        double totalPossibleScore = maxPossibleSkillScore + maxPossibleMajorScore;

        if (totalPossibleScore > 0) {
            score = (score / totalPossibleScore) * 100.0;
        } else {
            score = 0.0;
        }

        return Math.min(100.0, Math.max(0.0, score));
    }

    private Set<String> parseCommaSeparatedString(String commaSeparated) {
        if (commaSeparated == null || commaSeparated.trim().isEmpty()) {
            return Collections.emptySet();
        }
        return Arrays.stream(commaSeparated.split(","))
                     .map(String::trim)
                     .map(String::toLowerCase)
                     .collect(Collectors.toSet());
    }
}
