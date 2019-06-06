# DICTIONARY API

## AUTH

**Token response**:

```json
{
  "token": "{token}",
  "userId": "{id}",
  "expiresAt": "{iso_date}"
}
```

### BASIC

#### _Sign up_

```json
{
  "endpoint": "/auth/basic/sign-up",
  "headers": {
    "method": "POST"
  },
  "body": {
    "email": "example@company.com",
    "password": "strongPassword"
  }
}
```

<br/>

#### _Log in_

```json
{
  "endpoint": "/auth/basic/log-in",
  "headers": {
    "method": "POST"
  },
  "body": {
    "email": "example@company.com",
    "password": "strongPassword"
  }
}
```

<br/>

#### _Forgot password_

```json
{
  "endpoint": "/auth/basic/forgot-password",
  "headers": {
    "method": "POST"
  },
  "body": {
    "email": "example@company.com"
  }
}
```

<br/>

#### _Reset password_

```json
{
  "endpoint": "/auth/basic/reset-password?token={token}",
  "headers": {
    "method": "GET"
  }
}

```

### GOOGLE

#### _Sign up_

```json
{
  "endpoint": "/auth/google/sign-up",
  "headers": {
    "method": "GET",
    "authorization": "Bearer {google_access_token}"
  }
}
```

<br/>

#### _Log in_

```json
{
  "endpoint": "/auth/google/log-in",
  "headers": {
    "method": "GET",
    "authorization": "Bearer {google_access_token}"
  }
}
```

### FACEBOOK

#### _Sign up_

```json
{
  "endpoint": "/auth/facebook/sign-up",
  "headers": {
    "method": "GET",
    "authorization": "Bearer {facebook_access_token}"
  }
}
```

#### _Log in_

```json
{
  "endpoint": "/auth/facebook/log-in",
  "headers": {
    "method": "GET",
    "authorization": "Bearer {facebook_access_token}"
  }
}
```
