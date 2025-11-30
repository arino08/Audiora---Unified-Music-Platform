package com.audiora.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;
    private final boolean emailEnabled;

    @Autowired
    public EmailService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${app.email.from:noreply@audiora.com}") String fromEmail,
            @Value("${spring.mail.username:}") String mailUsername) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
        this.emailEnabled = mailSender != null && mailUsername != null && !mailUsername.isBlank();

        if (this.emailEnabled) {
            logger.info("EmailService initialized with mail sender - email sending is ENABLED");
        } else {
            logger.warn("EmailService initialized WITHOUT mail sender - email sending is DISABLED. " +
                       "Set EMAIL_USERNAME and EMAIL_PASSWORD environment variables to enable email functionality.");
        }
    }

    public void sendVerificationEmail(String to, String verificationCode) {
        if (!emailEnabled) {
            logger.warn("Email sending is disabled. Verification code for {}: {}", to, verificationCode);
            logger.info("To enable email, configure spring.mail.username and spring.mail.password");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Audiora - Email Verification");
            message.setText(buildVerificationEmailBody(verificationCode));

            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", to, e);
            // For development: log the verification code if email sending fails
            logger.warn("Email sending failed. For development purposes, verification code for {}: {}", to, verificationCode);
            throw new RuntimeException("Failed to send verification email. Please check email configuration.", e);
        }
    }

    private String buildVerificationEmailBody(String verificationCode) {
        return String.format(
            "Welcome to Audiora!\n\n" +
            "Thank you for signing up. To complete your registration, please use the following verification code:\n\n" +
            "Verification Code: %s\n\n" +
            "This code will expire in 15 minutes.\n\n" +
            "If you didn't create an account with Audiora, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Audiora Team",
            verificationCode
        );
    }

    public void sendPasswordResetEmail(String to, String resetCode) {
        if (!emailEnabled) {
            logger.warn("Email sending is disabled. Password reset code for {}: {}", to, resetCode);
            logger.info("To enable email, configure spring.mail.username and spring.mail.password");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Audiora - Password Reset");
            message.setText(buildPasswordResetEmailBody(resetCode));

            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", to, e);
            // For development: log the reset code if email sending fails
            logger.warn("Email sending failed. For development purposes, password reset code for {}: {}", to, resetCode);
            throw new RuntimeException("Failed to send password reset email. Please check email configuration.", e);
        }
    }

    private String buildPasswordResetEmailBody(String resetCode) {
        return String.format(
            "Password Reset Request\n\n" +
            "We received a request to reset your Audiora account password.\n\n" +
            "Reset Code: %s\n\n" +
            "This code will expire in 15 minutes.\n\n" +
            "If you didn't request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Audiora Team",
            resetCode
        );
    }

    /**
     * Check if email sending is enabled
     * @return true if email is configured and enabled, false otherwise
     */
    public boolean isEmailEnabled() {
        return emailEnabled;
    }
}
