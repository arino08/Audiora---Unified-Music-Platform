package com.audiora.service;

import com.audiora.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

@Service
public class UserService {
    private final ConcurrentHashMap<String, User> users = new ConcurrentHashMap<>();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final EmailService emailService;

    @Autowired
    public UserService(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Create a new user with email/password
     */
    public User createUser(String email, String name, String password) {
        // Check if user already exists
        if (getUserByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists with email: " + email);
        }

        String userId = UUID.randomUUID().toString();
        User newUser = new User(userId, email, name);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setEmailVerified(false);
        newUser.setVerificationCode(generateVerificationCode());
        newUser.setVerificationCodeExpiry(Instant.now().plus(15, ChronoUnit.MINUTES)); // 15 minutes expiry

        users.put(userId, newUser);

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
            } catch (Exception e) {
                // Log the error but don't fail user creation
                System.err.println("Warning: Failed to send verification email to " + user.getEmail() + ": " + e.getMessage());
                // Email sending failed, but user creation should continue
            }
        }
    }

    /**
     * Authenticate user with email and password
     */
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOpt = getUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPasswordHash() != null && passwordEncoder.matches(password, user.getPasswordHash())) {
                user.setLastLoginAt(Instant.now());
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    /**
     * Verify user's email with verification code
     */
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
                return true;
            }
        }
        return false;
    }

    /**
     * Generate a new verification code for email verification
     */
    public String generateNewVerificationCode(String email) {
        Optional<User> userOpt = getUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newCode = generateVerificationCode();
            user.setVerificationCode(newCode);
            user.setVerificationCodeExpiry(Instant.now().plus(15, ChronoUnit.MINUTES)); // 15 minutes expiry

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
    public User createOrUpdateUser(String googleId, String email, String name, String picture, String givenName, String familyName, boolean emailVerified) {
        User existingUser = users.get(googleId);

        if (existingUser != null) {
            // Update existing user
            existingUser.setEmail(email);
            existingUser.setName(name);
            existingUser.setPicture(picture);
            existingUser.setGivenName(givenName);
            existingUser.setFamilyName(familyName);
            existingUser.setEmailVerified(emailVerified);
            existingUser.setLastLoginAt(Instant.now());
            return existingUser;
        } else {
            // Create new user
            User newUser = new User(googleId, email, name);
            newUser.setPicture(picture);
            newUser.setGivenName(givenName);
            newUser.setFamilyName(familyName);
            newUser.setEmailVerified(emailVerified);
            users.put(googleId, newUser);
            return newUser;
        }
    }

    /**
     * Get user by ID
     */
    public Optional<User> getUserById(String userId) {
        return Optional.ofNullable(users.get(userId));
    }

    /**
     * Get user by email
     */
    public Optional<User> getUserByEmail(String email) {
        return users.values().stream()
                .filter(user -> email.equals(user.getEmail()))
                .findFirst();
    }

    /**
     * Delete user
     */
    public boolean deleteUser(String userId) {
        return users.remove(userId) != null;
    }

    /**
     * Get all users (for admin purposes)
     */
    public java.util.Collection<User> getAllUsers() {
        return users.values();
    }

    /**
     * Check if user exists
     */
    public boolean userExists(String userId) {
        return users.containsKey(userId);
    }
}
