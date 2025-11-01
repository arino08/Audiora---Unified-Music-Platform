package com.audiora.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * Email configuration that only activates when email credentials are provided.
 * This prevents startup failures when email is not configured.
 */
@Configuration
@ConditionalOnProperty(name = "EMAIL_USERNAME")
public class EmailConfig {
    
    // Email configuration is handled by Spring Boot auto-configuration
    // This class just ensures it only activates when EMAIL_USERNAME is set
}
