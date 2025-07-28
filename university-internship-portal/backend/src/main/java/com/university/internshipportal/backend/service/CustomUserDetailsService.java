package com.university.internshipportal.backend.service;

import com.university.internshipportal.backend.model.User;
import com.university.internshipportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // THIS IMPORT IS ESSENTIAL
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // THIS IMPORT IS ESSENTIAL

import java.util.Collections;

@Service // This annotation ensures Spring creates a bean of this class
public class CustomUserDetailsService implements UserDetailsService { // This MUST implement UserDetailsService interface

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // Return Spring Security's built-in UserDetails object
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(), // Provide the hashed password
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())) // Roles must be prefixed with "ROLE_"
        );
    }
}
/* CustomUserDetailsService.java END */