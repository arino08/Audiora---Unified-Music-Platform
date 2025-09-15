#!/bin/bash

echo "Testing email verification flow..."

# Test the frontend compilation
echo "1. Checking frontend compilation..."
cd /home/ariz/DEV/Audiora/frontend
npm run build 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend compiles successfully"
else
    echo "❌ Frontend compilation failed"
fi

# Test backend endpoints
echo "2. Testing backend endpoints..."

# Test resend verification endpoint
echo "Testing resend verification endpoint..."
response=$(curl -s -X POST http://localhost:8080/api/auth/resend-verification \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}')

if [[ $response == *"message"* ]]; then
    echo "✅ Resend verification endpoint working"
else
    echo "❌ Resend verification endpoint failed: $response"
fi

# Test verify email endpoint
echo "Testing verify email endpoint..."
response=$(curl -s -X POST http://localhost:8080/api/auth/verify \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","code":"123456"}')

if [[ $response == *"error"* ]]; then
    echo "✅ Verify email endpoint working (expected error for invalid code)"
else
    echo "❌ Verify email endpoint unexpected response: $response"
fi

echo "Done!"
