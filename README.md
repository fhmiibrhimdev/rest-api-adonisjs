# AdonisJS v6 Authentication & CRUD API

A complete REST API built with AdonisJS v6 featuring authentication, multi-role authorization, and admin-only CRUD operations.

## 🚀 Features

- **Complete Authentication System**
  - User registration with role assignment
  - User login/logout
  - Token-based authentication (Bearer tokens)
  - Token refresh mechanism
  - Profile management
  - Password change functionality

- **Multi-Role Authorization**
  - Admin, User, and Moderator roles
  - Role-based access control
  - Admin-only protected routes

- **User Management**
  - Active/Inactive user status
  - Email uniqueness validation
  - Password confirmation validation
  - Profile updates (name, email, phone, birth date)

- **Admin-Only CRUD**
  - Todos management (Create, Read, Update, Delete)
  - Protected by admin middleware

- **Dashboard**
  - Universal access for all authenticated users
  - Role-specific feature display
  - Personalized welcome messages

## 📋 Requirements

- **Node.js** >= 18.0.0
- **MySQL** >= 8.0
- **npm** or **yarn**

## 🛠 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd adonisjs-auth-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=your-app-key-here
NODE_ENV=development

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_DATABASE=your-database-name
```

### 4. Generate APP_KEY
```bash
node ace generate:key
```

### 5. Database Setup
Create your MySQL database, then run migrations:

```bash
# Run migrations
node ace migration:run
```

### 6. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3333`

## 📚 API Documentation

### Base URL
```
http://localhost:3333/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirmation": "password123",
    "role": "user", // Optional: admin, user, moderator (default: user)
    "phone": "08123456789", // Optional
    "birthDate": "1990-01-01" // Optional
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

#### Get Current User
```http
GET /api/me
Authorization: Bearer {token}
```

#### Refresh Token
```http
POST /api/refresh
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "fullName": "John Updated",
    "email": "john.new@example.com",
    "role": "moderator", // Optional
    "phone": "08987654321",
    "birthDate": "1990-01-01"
}
```

#### Change Password
```http
PUT /api/password
Authorization: Bearer {token}
Content-Type: application/json

{
    "currentPassword": "password123",
    "password": "newpassword123",
    "passwordConfirmation": "newpassword123"
}
```

### Dashboard Endpoint

#### Get Dashboard
```http
GET /api/dashboard
Authorization: Bearer {token}
```

**Response Example:**
```json
{
    "success": true,
    "message": "Welcome to dashboard, John Doe!",
    "data": {
        "user": {
            "id": 1,
            "fullName": "John Doe",
            "email": "john@example.com",
            "role": "admin",
            "isActive": 1
        },
        "dashboard": {
            "message": "Dashboard accessible for all authenticated users",
            "userRole": "admin",
            "accessLevel": "authenticated",
            "features": [
                "User Management",
                "Todos CRUD",
                "System Settings",
                "Analytics"
            ]
        }
    }
}
```

**Features by Role:**
- **Admin**: User Management, Todos CRUD, System Settings, Analytics
- **Moderator**: Content Moderation, User Reports, Analytics
- **User**: Profile Management, Basic Features

### Admin-Only Todos Endpoints

> **Note:** All todos endpoints require admin role

#### Get All Todos
```http
GET /api/todos
Authorization: Bearer {admin_token}
```

#### Create Todo
```http
POST /api/todos
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "Learn AdonisJS v6",
    "date": "2025-09-20" // Optional
}
```

#### Get Single Todo
```http
GET /api/todos/{id}
Authorization: Bearer {admin_token}
```

#### Update Todo
```http
PUT /api/todos/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "Learn AdonisJS v6 (Updated)",
    "date": "2025-09-21"
}
```

#### Delete Todo
```http
DELETE /api/todos/{id}
Authorization: Bearer {admin_token}
```

## 🔐 Authentication Flow

1. **Register** a new user or **Login** with existing credentials
2. Save the returned `token` from the response
3. Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer {token}
   ```
4. Use `/api/refresh` to get a new token when needed
5. Use `/api/logout` to invalidate the current token

## 👥 User Roles & Dashboard Access

- **admin**: Full access to all endpoints including todos CRUD + Dashboard with complete features
- **moderator**: Access to authentication endpoints + Dashboard with moderation features
- **user**: Access to authentication endpoints + Dashboard with basic features (default role)

### Dashboard Features by Role

| Role | Dashboard Access | Features Available |
|------|------------------|-------------------|
| **Admin** | ✅ | User Management, Todos CRUD, System Settings, Analytics |
| **Moderator** | ✅ | Content Moderation, User Reports, Analytics |
| **User** | ✅ | Profile Management, Basic Features |
| **Unauthenticated** | ❌ | No access |

## 📝 Response Format

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Response data here
    }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "errors": [
        // Validation errors array (if any)
    ]
}
```

## 🧪 Testing with Postman

### Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:3333/api`
- `token`: (will be auto-populated by scripts)

### Testing Dashboard
The dashboard endpoint is perfect for testing role-based features:

1. **Register/Login** as different roles (admin, moderator, user)
2. **Save token** using the script below
3. **Access dashboard** to see role-specific features
4. **Compare responses** between different roles

### Auto-Save Token Script
Add this script to the **Tests** tab of login/register requests:

```javascript
pm.test("Save token", function () {
    const responseJson = pm.response.json();
    if (responseJson.data && responseJson.data.token) {
        const token = responseJson.data.token.token;
        pm.environment.set("token", token);
        console.log("Token saved:", token);
    }
});
```

### Authorization Setup
For protected endpoints, use:
- **Type**: Bearer Token
- **Token**: `{{token}}`

## 📂 Project Structure

```
├── app/
│   ├── controllers/
│   │   ├── auth_controller.ts
│   │   └── todos_controller.ts
│   ├── middleware/
│   │   ├── admin_middleware.ts
│   │   └── auth_middleware.ts
│   ├── models/
│   │   ├── user.ts
│   │   └── todo.ts
│   └── validators/
│       ├── auth.ts
│       └── todo.ts
├── database/
│   └── migrations/
├── start/
│   ├── kernel.ts
│   └── routes.ts
└── config/
```

## 🛡 Security Features

- **Password Hashing**: Scrypt algorithm
- **Token-based Authentication**: Secure bearer tokens
- **Role-based Authorization**: Middleware protection
- **Input Validation**: Comprehensive validation rules
- **CORS Protection**: Configurable CORS settings

## 🚦 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Run migrations
node ace migration:run

# Check migration status
node ace migration:status

# Rollback migrations
node ace migration:rollback

# Generate new migration
node ace make:migration migration_name

# Generate new controller
node ace make:controller ControllerName

# Generate new middleware
node ace make:middleware MiddlewareName

# Generate new model
node ace make:model ModelName
```

## 📋 Database Schema

### Users Table
- `id` (Primary Key)
- `full_name`
- `email` (Unique)
- `password` (Hashed)
- `role` (admin, user, moderator)
- `is_active` (Boolean)
- `phone`
- `birth_date`
- `email_verified_at`
- `created_at`
- `updated_at`

### Todos Table
- `id` (Primary Key)
- `name`
- `date`
- `created_at`
- `updated_at`

### Access Tokens Table
- `id` (Primary Key)
- `tokenable_id`
- `type`
- `name`
- `hash`
- `abilities`
- `created_at`
- `updated_at`
- `last_used_at`
- `expires_at`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

If you have any questions or need support, please open an issue in the GitHub repository.

---

**Built with ❤️ using AdonisJS v6**
