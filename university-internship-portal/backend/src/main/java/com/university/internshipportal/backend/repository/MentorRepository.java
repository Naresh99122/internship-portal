package com.university.internshipportal.backend.repository;

import com.university.internshipportal.backend.model.Mentor;
import com.university.internshipportal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {
    Optional<Mentor> findByUser(User user);
    Optional<Mentor> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}