# Postman Setup untuk Authentication API

## 1. Environment Setup

Buat environment baru di Postman dengan variabel:
- `base_url`: `http://localhost:3333/api`
- `token`: (akan diisi otomatis)

## 2. Collection Structure

### Auth Endpoints:
1. POST `/register` - Register user baru
2. POST `/login` - Login user  
3. GET `/me` - Get current user
4. POST `/refresh` - Refresh token
5. POST `/logout` - Logout user
6. PUT `/profile` - Update profile
7. PUT `/password` - Change password

## 3. Scripts untuk Auto-Save Token

### Script untuk endpoint Login (Tab "Tests"):

```javascript
pm.test("Status code is 200 or 201", function () {
    pm.response.to.have.status(200) || pm.response.to.have.status(201);
});

pm.test("Login successful", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.eql(true);
    
    // Auto-save token to environment
    if (responseJson.data && responseJson.data.token) {
        const token = responseJson.data.token.token || responseJson.data.token.value?.release();
        if (token) {
            pm.environment.set("token", token);
            console.log("Token saved:", token);
        }
    }
});
```

### Script untuk endpoint Register (Tab "Tests"):

```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Registration successful", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.eql(true);
    pm.expect(responseJson.message).to.eql("User registered successfully");
    
    // Auto-save token to environment
    if (responseJson.data && responseJson.data.token) {
        const token = responseJson.data.token.token || responseJson.data.token.value?.release();
        if (token) {
            pm.environment.set("token", token);
            console.log("Token saved from registration:", token);
        }
    }
});
```

### Script untuk endpoint Refresh (Tab "Tests"):

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Token refresh successful", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.eql(true);
    pm.expect(responseJson.message).to.eql("Token refreshed successfully");
    
    // Auto-save new token to environment
    if (responseJson.data && responseJson.data.token) {
        const newToken = responseJson.data.token.token;
        if (newToken) {
            pm.environment.set("token", newToken);
            console.log("New token saved:", newToken);
        }
    }
});
```

## 4. Authorization Setup

Untuk endpoint yang memerlukan authentication (`/me`, `/refresh`, `/logout`, `/profile`, `/password`):

1. Pilih tab "Authorization"
2. Type: "Bearer Token"
3. Token: `{{token}}`

Atau tambahkan di Headers:
- Key: `Authorization`
- Value: `Bearer {{token}}`

## 5. Request Examples

### Register Request:
```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirmation": "password123",
    "role": "admin",
    "phone": "08123456789"
}
```

**Available roles:** `admin`, `user`, `moderator` (optional, default: `user`)

### Login Request:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Update Profile Request:
```json
{
    "fullName": "John Updated",
    "email": "john.new@example.com",
    "role": "moderator",
    "phone": "08987654321",
    "birthDate": "1990-01-01"
}
```

**Available roles for update:** `admin`, `user`, `moderator`

### Change Password Request:
```json
{
    "currentPassword": "password123",
    "password": "newpassword123",
    "passwordConfirmation": "newpassword123"
}
```

## 6. Pre-request Script (Optional)

Untuk semua protected endpoints, tambahkan di tab "Pre-request Script":

```javascript
// Check if token exists
const token = pm.environment.get("token");
if (!token) {
    console.log("No token found. Please login first.");
}
```

## 7. Collection Level Scripts

### Collection Pre-request Script:
```javascript
// Set base URL if not already set
if (!pm.environment.get("base_url")) {
    pm.environment.set("base_url", "http://localhost:3333/api");
}
```

### Collection Tests Script:
```javascript
// Common tests for all endpoints
pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test("Response has success field", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('success');
});
```

## 8. Import Collection JSON

Anda juga bisa mengimport collection JSON ini ke Postman:

```json
{
    "info": {
        "name": "AdonisJS Auth API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "base_url",
            "value": "http://localhost:3333/api"
        }
    ],
    "item": [
        {
            "name": "Register",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"fullName\": \"John Doe\",\n    \"email\": \"john@example.com\",\n    \"password\": \"password123\",\n    \"passwordConfirmation\": \"password123\",\n    \"phone\": \"08123456789\"\n}"
                },
                "url": {
                    "raw": "{{base_url}}/register",
                    "host": ["{{base_url}}"],
                    "path": ["register"]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is 201\", function () {",
                            "    pm.response.to.have.status(201);",
                            "});",
                            "",
                            "pm.test(\"Registration successful\", function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson.success).to.eql(true);",
                            "    ",
                            "    if (responseJson.data && responseJson.data.token) {",
                            "        const token = responseJson.data.token.token || responseJson.data.token.value?.release();",
                            "        if (token) {",
                            "            pm.environment.set(\"token\", token);",
                            "            console.log(\"Token saved:\", token);",
                            "        }",
                            "    }",
                            "});"
                        ]
                    }
                }
            ]
        }
    ]
}
```

## Tips:

1. **Test Order**: Jalankan Register atau Login dulu untuk mendapat token
2. **Environment**: Pastikan environment yang benar sudah dipilih
3. **Token Format**: Token akan otomatis tersimpan dan digunakan untuk request selanjutnya
4. **Error Handling**: Jika ada error 401, coba login ulang untuk refresh token
