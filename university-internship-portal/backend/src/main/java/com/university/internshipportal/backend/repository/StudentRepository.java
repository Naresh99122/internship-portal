package com.university.internshipportal.backend.repository;

import com.university.internshipportal.backend.model.Student;
import com.university.internshipportal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
