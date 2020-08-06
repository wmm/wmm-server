# Get an access token

Used to get an access token.

**URL** : `/users/token/`

**Method** : `POST`

**Auth required** : YES (Refresh token in request body)

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content example** :
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiamFrb2IxIiwiaWF0IjoxNTkzMDc3NzgzLCJleHAiOjE1OTMwODEzODN9.b_cG9sZk-3ast28aFrFdwJfwGN-EevzCmrrLm2QUkuA"
}
```

## Error Responses

**Condition** : If refresh token is missing.

**Code** : `400 Bad Request`

**Content** : `"Refresh token required"`

### OR

**Condition** : If refresh token has been deleted.

**Code** : `400 Bad Request`

**Content** : `"Token is not valid"`