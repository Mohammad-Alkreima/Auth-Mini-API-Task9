# Task 9: Auth Mini API 🔐

A minimal Express + MongoDB API built strictly to practice Advanced Authentication, Authorization, and Server Hardening concepts covered in Lectures 23, 24, and 25. This project focuses entirely on security mechanisms rather than building a business product.

---

## 📚 Lecture Mapping & Implementations

Every core security concept is mapped directly to its respective lecture implementation:

*   **Lecture 23 (Auth 1 - Auth & JWT)**:
    *   `src/models/User.js`: Password security using **Argon2** hashing prior to database persistence and ensuring the password field is hidden from JSON responses.
    *   `src/controllers/auth.controller.js`: Handles token generation during login with dual **Access Token** (1h expiry) and **Refresh Token** (7d expiry) strategy.
*   **Lecture 24 (Auth 2 - Roles & Cookies)**:
    *   `src/middlewares/auth.js`: Extracts and verifies the JWT seamlessly from secure **HttpOnly Cookies** using `cookie-parser`. Automatically handles Access Token expiration by validating the Refresh Token and issuing a new Access Token.
    *   `src/middlewares/role.js`: Implements role restriction middleware (`restrictTo('admin')`).
    *   `app.js`: Configures global and route-specific **Rate Limiting** via `express-rate-limit`.
*   **Lecture 25 (Auth 3 - XSS & Validation)**:
    *   `app.js`: Input sanitization middleware deployed to protect against Cross-Site Scripting (**XSS**).
    *   `src/middlewares/validate.js`: Implements robust schema validation chains for `req.body` and `req.params` utilizing **express-validator**.

---

## 🚀 Features

### 🔐 Authentication & Cookie-based JWT
*   **Secure Signup:** Registers new user nodes, automatically passing plaintext entry strings through Argon2 before writing to storage. Passwords are cut from outgoing responses.
*   **HttpOnly Token Delivery:** Prevents client-side scripts from reading tokens (neutralizing XSS token theft). The JWT is bound using secure cookie configs (`httpOnly`, `secure` in prod, `sameSite`).
*   **Session Termination (Logout):** Clears down active server cookies instantly upon hitting the log-out wrapper.
*   **Admin Seeding Script:** Administrative users are seeded using a dedicated script `npm run admin:seed`. This script reads the admin credentials from the `.env` file and creates the admin user in the database. Regular registration defaults to `role: 'user'`.

### 🔄 Refresh Token Mechanism
*   **Dual Token Strategy:** The system implements both **Access Token** (expires in 1 hour) and **Refresh Token** (expires in 7 days) for optimal security and user experience.
*   **Automatic Token Rotation:** When an Access Token expires, the Refresh Token is automatically used to generate a new Access Token without requiring the user to log in again.
*   **Separate Secret Keys:** Access and Refresh tokens are signed with different secret keys (`JWT_SECRET_KEY` and `REFRESH_JWT_SECRET_KEY`) for enhanced security.
*   **Seamless Credential Refresh:** The `auth` middleware automatically detects an expired Access Token, validates the Refresh Token, and transparently issues a new Access Token while refreshing the Refresh Token's expiration window.

### 👑 Role-Based Access Control (RBAC)
*   **Two-Tier Clearance Schema:** Segregates application entities into standard `user` and administrative `admin` classifications.
*   **Route Enforcement Guards:** Intercepts endpoints with `restrictTo('admin')`. Standard users trying to jump access parameters face strict `403 Forbidden` limits.

### 🛑 Hardening & Request Verification
*   **Brute-Force Throttle Shields:** Restricts API ingestion pipelines on standard auth endpoints, implementing rigorous request ceilings to freeze dictionary attacks.
*   **XSS Input Cleansing:** Automatically scrubs potential scripts out of parameters, avoiding database injection attempts.
*   **Strict Parameter Interception:** Employs centralized schema enforcement chains returning explicit structural array trees under a `400 Bad Request` layout if parameters break conventions.
*   **Self-Deletion Safeguard:** Rejects accidental root identity deletion attempts if administrative accounts pass their own active trace ID to removal parameters.

---

## 🛠️ Tech Stack

The architecture relies on the following standard ecosystem components:

*   **Runtime Environment:** Node.js
*   **Backend Framework:** Express.js
*   **Database & ODM:** MongoDB & Mongoose
*   **Cryptography:** Argon2 (Next-gen password hashing algorithm)
*   **Tokenization:** jsonwebtoken (JWT)
*   **Validation:** express-validator
*   **Security & Sanitization:** express-rate-limit, xss-clean (or xss), cookie-parser

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mohammad-Alkreima/Auth-Mini-API-Task9.git
   cd Auth-Mini-API-Task9
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure Environment Variables:
    - Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    - Open .env and configure all variables (including the Admin credentials).

4. Seed the Database:
    - Run the seeding script to create the administrator account:
        ```bash
        npm run admin:seed
        ```

5. Run the application:
    - For Development (with auto-reload):
        ```bash
        npm run watch
        ```

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the root directory and configure the following parameters:

```env
PORT=PortNumber
MONGODB_URL="mongodb://localhost:27017/DataBase-Name"
JWT_SECRET_KEY=your_jwt_secret_here
REFRESH_JWT_SECRET_KEY=your_refresh_jwt_secret_here
ADMIN_NAME="Nane"
ADMIN_PHONE="PhoneNumber"
ADMIN_EMAIL="AdminEmail"
ADMIN_PASSWORD="your_admin_password_here"
```

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default: 3000) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret key used to sign and verify Access tokens (expires in 1 hour) |
| `REFRESH_JWT_SECRET_KEY` | Secret key used to sign and verify Refresh tokens (expires in 7 days) |
| `ADMIN_NAME` | Seed admin display name |
| `ADMIN_PHONE` | Seed admin phone number |
| `ADMIN_EMAIL` | Seed admin login email |
| `ADMIN_PASSWORD` | Seed admin password (will be hashed with Argon2) |

---

## 📂 Project Structure

```text
auth-mini-api/
├── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── src/
    ├── models/User.js
    ├── controllers/
    │   ├── auth.controller.js       ← signup, login, logout, profile handlers
    │   └── protected.controller.js  ← 5 role-aware endpoint handlers
    ├── validations/
    │   ├── auth.validate.js         ← signupValidation & loginValidation chains
    │   └── protected.validate.js    ← :id param validation chain
    ├── middlewares/
    │   ├── auth.js                  ← protect middleware (JWT from cookie)
    │   ├── role.js                  ← restrictTo('admin', ...)
    │   ├── validate.js              ← centralized express-validator error extractor
    │   ├── xss.js                   ← XSS input sanitization protection
    │   ├── limiter.js               ← express-rate-limit configuration
    │   ├── errorHandler.js          ← global centralized error handler
    │   └── notFound.js              ← 404 route fallback handler
    ├── utils/
    │   ├── asyncHandler.js          ← wraps async controller functions to catch errors
    │   ├── cookiesService.js        ← handles setting and clearing HTTP-only cookies for Access & Refresh tokens
    │   ├── jwtService.js            ← handles signing and verifying both Access and Refresh tokens
    │   ├── refreshTokenService.js   ← validates Refresh Token and generates new Access Token pair
    │   └── passwordService.js       ← handles argon2 hashing and verification
    └── routes/
        ├── auth.route.js            ← maps auth validation + controllers
        ├── user.route.js            ← /me/* routes (any authenticated user)
        └── admin.route.js           ← /admin/* routes (admin only)
```

---

## 🛣️ Access Control Matrix


| Endpoint | HTTP Method | Required Authorization | Mock/Real Domain Behavior |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/signup` | `POST` | Public | Registers a user (role defaults to `user`). Returns no password. |
| `/api/v1/auth/login` | `POST` | Public | Verifies Argon2 hash, issues Access & Refresh JWT, sets **HttpOnly Cookies**. |
| `/api/v1/auth/logout` | `POST` | Public | Clears both Access and Refresh Token cookies. |
| `/api/v1/auth/profile` | `GET` | Authenticated (Any Role) | Returns current verified user info from cookie payload. |
| `/api/v1/me/welcome` | `GET` | Authenticated (Any Role) | Returns simple safe hello greeting JSON string. |
| `/api/v1/me/account-summary`| `GET` | Authenticated (Any Role) | Returns a mock personal financial data object. |
| `/api/v1/admin/overview` | `GET` | `admin` Only | Returns mock overall system/platform wide total counts. |
| `/api/v1/admin/users` | `GET` | `admin` Only | Lists database records cleanly without leaking password hashes. |
| `/api/v1/admin/users/:id` | `DELETE` | `admin` Only | Validates `:id`, deletes target, blocks self-deletion attempt. |

---

## 🧪 Postman & Testing Matrix Guidelines

Follow these precise steps to thoroughly execute testing matrix requirements:

1.  **Seed the Admin Account**: Run the seed script `npm run admin:seed` to create the admin user with credentials specified in your `.env` file.
2.  **HttpOnly Cookie Handling**: Ensure cookie capture is active in Postman/Thunder Client. When hitting `/api/v1/auth/login`, look for the `Set-Cookie` header containing both `accessToken` and `refreshToken`. Subsequent calls will transparently append the authentication state.
3. **Testing Input Validation:** 
    * Trigger `/api/v1/auth/signup` with an invalid input payload to see centralized `400 Bad Request` array errors.
    * Standard signups are restricted to the `user` role.
4.  **Testing Rate Limiter**: Attempt sending an invalid login combination repeatedly. After exceeding the threshold (e.g., 5 attempts), the route locks and emits a `429 Too Many Requests` signature.
5. **Testing Refresh Token Flow:**
    * Login with valid credentials to receive both Access Token (1h) and Refresh Token (7d) in HttpOnly cookies.
    * Wait for Access Token to expire or manually clear the `accessToken` cookie while keeping `refreshToken`.
    * Send a request to a protected endpoint (e.g., `/api/v1/auth/profile`). The `auth` middleware detects the missing/expired Access Token, validates the Refresh Token, and automatically generates a new Access Token.
    * Alternatively, call `/api/v1/auth/refresh-token` (PUT) directly to manually refresh the Access Token.
    * If the Refresh Token is also expired or missing, the system returns `401 Unauthorized`.
6.  **Role Verification Matrix Execution**:
    *   **User Credentials Flow**: Logs in as a standard account -> returns code `200` on the two `/api/v1/me/*` interfaces, but returns an explicit `403 Forbidden` response when knocking on all three `/api/v1/admin/*` entry-points.
    *   **Admin Credentials Flow**: Logs in as the master administrative account -> returns successfully with a code `200 OK` on all **5** protected endpoints.
    *   **Self-Deletion Guard**: Submit a `DELETE` request targetting the currently active admin ID to `/api/v1/admin/users/:id`. The operational execution will halt, returning a `400 Bad Request` emphasizing that admins are restricted from self-deletion.

## 📝 API Usage Examples (Postman)

### Singup a New User
```json
{   
    "name": "Ammar",
    "email": "ammar@gmail.com",
    "password": "Abokaram@$98"
}
```

### Login User
```json
{   
    "email": "ammar@gmail.com",
    "password": "Abokaram@$98"
}
```

## Documentation
- [Postman Documentation](https://documenter.getpostman.com/view/49267230/2sBXwsK9kc)