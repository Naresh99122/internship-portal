package com.university.internshipportal.backend.repository;

import com.university.internshipportal.backend.model.Internship;
import com.university.internshipportal.backend.model.enums.InternshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByStatus(InternshipStatus status);
    List<Internship> findByCompanyNameContainingIgnoreCase(String companyName);
    List<Internship> findByLocationContainingIgnoreCase(String location);
    List<Internship> findByTitleContainingIgnoreCase(String title);
    // You can add more complex queries here using @Query annotation if needed
}