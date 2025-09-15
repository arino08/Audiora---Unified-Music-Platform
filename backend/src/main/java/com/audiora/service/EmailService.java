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

    @Autowired
    public EmailService(JavaMailSender mailSender, @Value("${app.email.from}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendVerificationEmail(String to, String verificationCode) {
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
}
