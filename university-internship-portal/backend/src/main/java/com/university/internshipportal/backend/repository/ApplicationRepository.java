package com.university.internshipportal.backend.repository;

import com.university.internshipportal.backend.model.Application;
import com.university.internshipportal.backend.model.Internship;
import com.university.internshipportal.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByInternship(Internship internship);
    Optional<Application> findByStudentAndInternship(Student student, Internship internship);
    boolean existsByStudentAndInternship(Student student, Internship internship);
}
