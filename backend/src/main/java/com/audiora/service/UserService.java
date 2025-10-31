 package com.audiora.service;

import com.audiora.model.User;
import com.audiora.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.UUID;
import java.util.Optional;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserService(UserRepository userRepository, EmailService emailService, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.objectMapper = objectMapper;
    }

    /**
     * Create a new user with email/password
     */
    @Transactional
    public User createUser(String email, String name, String password) {
        // Check if user already exists
        if (getUserByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists with email: " + email);
        }

        User newUser = new User(email, name);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setEmailVerified(false);
        newUser.setVerificationCode(generateVerificationCode());
        newUser.setVerificationCodeExpiry(Instant.now().plus(15, ChronoUnit.MINUTES)); // 15 minutes expiry

        newUser = userRepository.save(newUser);

        // Send verification email
        sendVerificationEmail(newUser);

        return newUser;
    }

    /**
     * Send verification email to user
     */
    public void sendVerificationEmail(User user) {
        if (user.getVerificationCode() != null && user.getEmail() != null) {
            try {
                emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
                log.info("Verification email sent successfully to {}", user.getEmail());
            } catch (Exception e) {
                // Log the error but don't fail user creation
                log.warn("Failed to send verification email to {}: {}", user.getEmail(), e.getMessage());
                // Email sending failed, but user creation should continue
            }
        }
    }

    /**
     * Authenticate user with email and password
     */
    @Transactional
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOpt = getUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPasswordHash() != null && passwordEncoder.matches(password, user.getPasswordHash())) {
                user.setLastLoginAt(Instant.now());
                userRepository.save(user);
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    /**
     * Verify user's email with verification code
     */
    @Transactional
    public boolean verifyEmail(String email, String verificationCode) {
        Optional<User> userOpt = getUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getVerificationCode() != null &&
                user.getVerificationCode().equals(verificationCode) &&
                user.getVerificationCodeExpiry() != null &&
                user.getVerificationCodeExpiry().isAfter(Instant.now())) {

                user.setEmailVerified(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiry(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    /**
     * Generate a new verification code for email verification
     */
    @Transactional
    public String generateNewVerificationCode(String email) {
        Optional<User> userOpt = getUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newCode = generateVerificationCode();
            user.setVerificationCode(newCode);
            user.setVerificationCodeExpiry(Instant.now().plus(15, ChronoUnit.MINUTES)); // 15 minutes expiry

            userRepository.save(user);

            // Send verification email
            sendVerificationEmail(user);

            return newCode;
        }
        throw new RuntimeException("User not found with email: " + email);
    }

    private String generateVerificationCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000); // 6-digit code
    }

    /**
     * Create or update a user from Google OAuth information
     */
    @Transactional
    public User createOrUpdateUser(String googleId, String email, String name, String picture, String givenName, String familyName, boolean emailVerified) {
        // Check if user exists by email
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isPresent()) {
            // Update existing user with Google info
            User existingUser = existingUserOpt.get();
            existingUser.setName(name);
            existingUser.setPicture(picture);
            existingUser.setGivenName(givenName);
            existingUser.setFamilyName(familyName);
            existingUser.setEmailVerified(true); // Google accounts are auto-verified
            existingUser.setLastLoginAt(Instant.now());
            return userRepository.save(existingUser);
        } else {
            // Create a new user
            User newUser = new User(email, name);
            newUser.setPicture(picture);
            newUser.setGivenName(givenName);
            newUser.setFamilyName(familyName);
            newUser.setEmailVerified(true);
            newUser.setLastLoginAt(Instant.now());
            return userRepository.save(newUser);
        }
    }

    /**
     * Get user by ID
     */
    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    /**
     * Get user by email
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Delete user
     */
    @Transactional
    public boolean deleteUser(UUID userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    /**
     * Get all users (for admin purposes)
     */
    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Check if user exists
     */
    public boolean userExists(UUID userId) {
        return userRepository.existsById(userId);
    }

    /**
     * Get user by username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Update user
     */
    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }
}
