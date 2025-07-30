package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.config.JwtUtil;
import com.university.internshipportal.backend.dto.RegisterRequest;
import com.university.internshipportal.backend.exception.CustomAuthenticationException;
import com.university.internshipportal.backend.model.User;
import com.university.internshipportal.backend.model.enums.Role;
import com.university.internshipportal.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentService studentService;

    @Autowired
    private MentorService mentorService;


    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User(
                null,
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                null, null
        );

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.STUDENT) {
            studentService.createStudentProfile(savedUser);
        } else if (savedUser.getRole() == Role.MENTOR) {
            mentorService.createMentorProfile(savedUser);
        }

        return savedUser;
    }

    public String authenticateUser(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            return jwtUtil.generateToken(authentication);
        } catch (BadCredentialsException e) {
            throw new CustomAuthenticationException("Invalid username or password", e);
        }
    }

    public String getUserRole(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRole().name();
    }
}