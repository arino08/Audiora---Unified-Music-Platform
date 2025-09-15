#!/bin/bash

# Email Testing Configuration for Audiora Backend
echo "=== Audiora Email Testing Setup ==="
echo
echo "To test email sending functionality, you need to configure your email credentials."
echo "For Gmail, you'll need an App Password (not your regular password)."
echo
echo "Steps to get Gmail App Password:"
echo "1. Go to https://myaccount.google.com/security"
echo "2. Enable 2-Step Verification if not already enabled"
echo "3. Go to 'App passwords' section"
echo "4. Generate a new app password for 'Mail'"
echo "5. Use that 16-character password below"
echo
echo "Environment variables needed:"
echo "export EMAIL_USERNAME=your-email@gmail.com"
echo "export EMAIL_PASSWORD=your-16-char-app-password"
echo "export EMAIL_FROM=your-email@gmail.com"
echo
echo "Then start the backend with:"
echo "mvn spring-boot:run"
echo
echo "Test the registration endpoint:"
echo "curl -X POST http://localhost:8080/api/auth/register \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"name\":\"Test User\",\"password\":\"password123\"}'"
echo
echo "Check your email for the verification code!"
