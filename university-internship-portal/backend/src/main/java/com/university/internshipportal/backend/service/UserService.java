package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.exception.ResourceNotFoundException; // Ensure this is imported
import com.university.internshipportal.backend.model.User; // Ensure this is imported
import com.university.internshipportal.backend.repository.UserRepository; // Ensure this is imported
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // CRITICAL: This annotation
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional; // Ensure Optional is imported


@Service // <-- This annotation tells Spring to create a bean for this class
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    public boolean userExistsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean userExistsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}