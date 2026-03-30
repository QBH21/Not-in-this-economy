# Security Policy

## Authentication

- User passwords are hashed with **bcrypt** (12 salt rounds) before storage
- Authentication uses **JWT tokens** with 7-day expiry
- Tokens are sent via `Authorization: Bearer <token>` header
- The JWT secret must be set via the `JWT_SECRET` environment variable

## Authorization

- Shopping lists are scoped to the authenticated user via `user_id` foreign key
- All list operations verify ownership before allowing access
- Users cannot view, modify, or delete other users' lists
- Search functionality is public and does not require authentication

## API Security

- **Helmet.js** — security headers on all API routes (CSP, HSTS, etc.)
- **CORS** — enabled on API routes
- **Rate Limiting** — per-endpoint limits to prevent abuse:
  - Search: 20 requests/minute
  - Prices: 30 requests/minute
  - General (lists, auth): 60 requests/minute
- **Input Validation** — all inputs validated with Joi schemas before processing
- **Parameterized Queries** — all SQL queries use parameterized statements to prevent SQL injection

## Environment Variables

Never commit the `.env` file. It contains:
- Database credentials
- JWT signing secret
- API keys

Use `.env.example` as a template and keep secrets out of version control.

## Reporting Vulnerabilities

If you discover a security vulnerability, please open an issue at:
https://github.com/QBH21/Not-in-this-economy/issues

## Dependencies

- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT token generation and verification
- `helmet` — HTTP security headers
- `express-rate-limit` — request rate limiting
- `joi` — input validation
- `mysql2` — parameterized SQL queries
