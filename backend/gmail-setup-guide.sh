#!/bin/bash

echo "🔧 Gmail App Password Setup Guide"
echo "=================================="
echo
echo "⚠️  IMPORTANT: Gmail requires App Passwords for SMTP, not your regular password!"
echo
echo "Steps to get Gmail App Password:"
echo "1. Go to https://myaccount.google.com/security"
echo "2. Enable 2-Step Verification (if not already enabled)"
echo "3. Go to 'App passwords' section"
echo "4. Select 'Mail' as the app"
echo "5. Generate a new 16-character app password"
echo "6. Copy that password (it looks like: abcd efgh ijkl mnop)"
echo
echo "Then create a .env file with:"
echo "EMAIL_USERNAME=arinopc22@gmail.com"
echo "EMAIL_PASSWORD=your-16-char-app-password-here"
echo "EMAIL_FROM=arinopc22@gmail.com"
echo
echo "🚨 Security Note:"
echo "- Never put real credentials in .env.example"
echo "- Add .env to .gitignore to prevent committing credentials"
echo "- Use App Passwords, not regular passwords"
echo
echo "After setting up .env, restart the backend to test email sending!"
