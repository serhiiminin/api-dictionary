# DICTIONARY API

## AUTH

### BASIC

#### _Sign up_

**endpoint**: `/auth/basic/sign-up`  
**method**: `POST`  
**data**:

```json
{
  "email": "String(email)",
  "password": "String"
}
```

<br/>

#### _Log in_

**endpoint**: `/auth/basic/log-in`  
**method**: `POST`  
**data**:

```json
{
  "email": "String(email)",
  "password": "String"
}
```

<br/>

#### _Forgot password_

**endpoint**: `/auth/basic/forgot-password`  
**method**: `POST`  
**data**:

```json
{
  "email": "String(email)"
}
```

<br/>

#### _Reset password_

**endpoint**: `/auth/basic/reset-password?token={token}`  
**method**: `GET`  
<br/>

### GOOGLE

#### _Sign up_

**REQUEST**:

**endpoint**: `/auth/google/sign-up`  
**method**: `GET`
**headers**:

```json
{
  "proxy-authorization": "Bearer {google_access_token}"
}
```

<br/>

**RESPONSE**:

```json
{
  "token": "String",
  "userId": "String",
  "expiresAt": "String"
}
```

<br/>

#### _Log in_

**endpoint**: `/auth/google/log-in`  
**method**: `GET`  
**headers**:

```json
{
  "proxy-authorization": "Bearer {google_access_token}"
}
```

<br/>

**RESPONSE**:

```json
{
  "token": "String",
  "userId": "String",
  "expiresAt": "String"
}
```

### FACEBOOK

#### _Sign up_

**REQUEST**:

**endpoint**: `/auth/facebook/sign-up`  
**method**: `GET`
**headers**:

```json
{
  "proxy-authorization": "Bearer {facebook_access_token}"
}
```

<br/>

**RESPONSE**:

```json
{
  "token": "String",
  "userId": "String",
  "expiresAt": "String"
}
```

<br/>

#### _Log in_

**endpoint**: `/auth/facebook/log-in`  
**method**: `GET`  
**headers**:

```json
{
  "proxy-authorization": "Bearer {facebook_access_token}"
}
```

<br/>

**RESPONSE**:

```json
{
  "token": "String",
  "userId": "String",
  "expiresAt": "String"
}
```
