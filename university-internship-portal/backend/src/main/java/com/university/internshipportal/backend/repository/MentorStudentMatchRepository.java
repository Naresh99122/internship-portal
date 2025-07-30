package com.university.internshipportal.backend.repository;

import com.university.internshipportal.backend.model.Mentor;
import com.university.internshipportal.backend.model.MentorStudentMatch;
import com.university.internshipportal.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorStudentMatchRepository extends JpaRepository<MentorStudentMatch, Long> {
    List<MentorStudentMatch> findByStudentId(Long studentId);
    List<MentorStudentMatch> findByMentorId(Long mentorId);
    Optional<MentorStudentMatch> findByStudentAndMentor(Student student, Mentor mentor);
}
