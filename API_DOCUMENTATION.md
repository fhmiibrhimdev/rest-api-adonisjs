# Authentication API Endpoints

API ini menyediakan sistem authentication lengkap dengan fitur:
- User registration dengan password confirmation
- Login dengan validasi user active/inactive
- Multi role (admin, user, moderator)
- Profile management
- Password change
- JWT token management

Base URL: `http://localhost:39529/api`

## Endpoints

### 1. Register User
**POST** `/api/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirmation": "password123",
  "phone": "+6281234567890",
  "birthDate": "1990-01-15"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "phone": "+6281234567890",
      "birthDate": "1990-01-15T00:00:00.000Z",
      "emailVerifiedAt": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": {
      "type": "bearer",
      "value": "...",
      "abilities": ["*"],
      "lastUsedAt": null,
      "expiresAt": null
    }
  }
}
```

### 2. Login User
**POST** `/api/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": { /* token object */ }
  }
}
```

**Response Error - Account Deactivated (403):**
```json
{
  "success": false,
  "message": "Account is deactivated. Please contact support."
}
```

### 3. Get Current User
**GET** `/api/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ }
  }
}
```

### 4. Refresh Token
**POST** `/api/refresh`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": { /* new token object */ }
  }
}
```

### 5. Logout
**POST** `/api/logout`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 6. Update Profile
**PUT** `/api/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "phone": "+6281234567891",
  "birthDate": "1991-01-15"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

### 7. Change Password
**PUT** `/api/password`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "password": "newpassword123",
  "passwordConfirmation": "newpassword123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Testing dengan cURL

### Register User
```bash
curl -X POST http://localhost:39529/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirmation": "password123",
    "phone": "+6281234567890",
    "birthDate": "1990-01-15"
  }'
```

### Login
```bash
curl -X POST http://localhost:39529/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get User Info (gunakan token dari response login)
```bash
curl -X GET http://localhost:39529/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:39529/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fullName": "John Smith",
    "phone": "+6281234567891"
  }'
```

### Change Password
```bash
curl -X PUT http://localhost:39529/api/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentPassword": "password123",
    "password": "newpassword123",
    "passwordConfirmation": "newpassword123"
  }'
```

## Fitur Keamanan

1. **Password Validation**: Minimum 8 karakter
2. **Password Confirmation**: Harus sama dengan password
3. **Email Validation**: Format email yang valid dan unique
4. **User Status**: Check apakah user aktif saat login
5. **Multi Role**: Support untuk admin, user, moderator
6. **JWT Token**: Untuk authentication dan authorization
7. **Hash Password**: Password di-hash dengan algoritma scrypt

## Role Management

- **user**: Role default untuk user baru
- **moderator**: Role untuk moderator
- **admin**: Role untuk administrator

Role dapat diubah langsung di database atau melalui endpoint khusus admin yang bisa ditambahkan kemudian.

## Database Schema

Tabel `users` memiliki kolom:
- `id`: Primary key
- `full_name`: Nama lengkap user
- `email`: Email unique
- `password`: Password yang di-hash
- `role`: Enum (admin, user, moderator)
- `is_active`: Boolean untuk status aktif/nonaktif
- `phone`: Nomor telepon (optional)
- `birth_date`: Tanggal lahir (optional)
- `email_verified_at`: Timestamp verifikasi email
- `created_at`: Timestamp dibuat
- `updated_at`: Timestamp diupdate
