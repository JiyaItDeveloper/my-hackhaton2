---
name: auth-skill
description: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions

1. **User Signup**
   - Validate input (email, password)
   - Hash passwords before storage
   - Prevent duplicate accounts

2. **User Signin**
   - Verify credentials securely
   - Compare hashed passwords
   - Handle invalid login attempts safely

3. **Password Security**
   - Use strong hashing (bcrypt / argon2)
   - Never store plain-text passwords
   - Apply proper salting

4. **JWT Authentication**
   - Generate access tokens on signin
   - Verify tokens on protected routes
   - Handle token expiration and refresh

5. **Better Auth Integration**
   - Configure Better Auth provider
   - Centralize auth logic
   - Enable secure session management

## Best Practices
- Enforce strong password rules
- Use HTTPS only
- Keep JWT secrets secure
- Short-lived access tokens
- Clear separation of auth logic

## Example Flow
```text
Signup → Hash Password → Store User
Signin → Verify Password → Issue JWT
Request → Validate JWT → Allow Access
