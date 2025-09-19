#!/bin/bash

# Test API Endpoints untuk Authentication
BASE_URL="http://localhost:3333/api"

echo "=== Testing Authentication API ==="
echo

# Test 1: Register
echo "1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirmation": "password123",
    "role": "admin",
    "phone": "08123456789"
  }')

echo "Register Response:"
echo "$REGISTER_RESPONSE" | jq .
echo

# Extract token from register response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token.token // empty')

echo "Extracted Token: $TOKEN"
echo

# Test 2: Login
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq .
echo

# Extract token from login response if register failed
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token.token // empty')
fi

echo "Using Token: $TOKEN"
echo

# Test 3: Get Me
echo "3. Testing Get Current User..."
ME_RESPONSE=$(curl -s -X GET "${BASE_URL}/me" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Me Response:"
echo "$ME_RESPONSE" | jq .
echo

# Test 4: Update Profile
echo "4. Testing Update Profile..."
PROFILE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "08987654321"
  }')

echo "Profile Update Response:"
echo "$PROFILE_RESPONSE" | jq .
echo

# Test 5: Change Password
echo "5. Testing Change Password..."
PASSWORD_RESPONSE=$(curl -s -X PUT "${BASE_URL}/password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "currentPassword": "password123",
    "password": "newpassword123",
    "passwordConfirmation": "newpassword123"
  }')

echo "Password Change Response:"
echo "$PASSWORD_RESPONSE" | jq .
echo

# Test 6: Refresh Token
echo "6. Testing Refresh Token..."
REFRESH_RESPONSE=$(curl -s -X POST "${BASE_URL}/refresh" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Refresh Token Response:"
echo "$REFRESH_RESPONSE" | jq .
echo

# Test 7: Logout
echo "7. Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -X POST "${BASE_URL}/logout" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Logout Response:"
echo "$LOGOUT_RESPONSE" | jq .
echo

echo "=== Test Completed ==="
