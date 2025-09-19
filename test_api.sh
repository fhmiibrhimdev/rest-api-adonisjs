#!/bin/bash

echo "Testing Authentication API"
echo "=========================="
echo ""

SERVER_URL="http://localhost:3333"

# Test 1: Register User
echo "1. Testing Register User..."
response=$(curl -s -X POST $SERVER_URL/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com", 
    "password": "password123",
    "passwordConfirmation": "password123",
    "phone": "+6281234567890",
    "birthDate": "1990-01-15"
  }')

echo "Response: $response"
echo ""

# Extract token for next tests (assuming jq is available)
token=$(echo $response | grep -o '"value":"[^"]*"' | cut -d'"' -f4)

if [ -n "$token" ]; then
  echo "Token extracted: $token"
  echo ""
  
  # Test 2: Get User Info
  echo "2. Testing Get User Info..."
  curl -s -X GET $SERVER_URL/api/me \
    -H "Authorization: Bearer $token"
  echo ""
  echo ""
  
  # Test 3: Update Profile
  echo "3. Testing Update Profile..."
  curl -s -X PUT $SERVER_URL/api/profile \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d '{
      "fullName": "John Smith Updated",
      "phone": "+6281234567891"
    }'
  echo ""
  echo ""
  
  # Test 4: Change Password
  echo "4. Testing Change Password..."
  curl -s -X PUT $SERVER_URL/api/password \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d '{
      "currentPassword": "password123",
      "password": "newpassword123",
      "passwordConfirmation": "newpassword123"
    }'
  echo ""
  echo ""
  
  # Test 5: Login with new password
  echo "5. Testing Login with new password..."
  curl -s -X POST $SERVER_URL/api/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "john@example.com",
      "password": "newpassword123"
    }'
  echo ""
  echo ""
  
else
  echo "No token found, registration might have failed"
  echo ""
  
  # Test login with non-existent user
  echo "2. Testing Login (should fail)..."
  curl -s -X POST $SERVER_URL/api/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "nonexistent@example.com",
      "password": "wrongpassword"
    }'
  echo ""
fi

echo "=========================="
echo "Test completed"
