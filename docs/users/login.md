# Login

Used to get a refresh token for a registered user.

**URL** : `/users/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints** :
```json
{
    "username": "[username]",
    "password": "[password]"
}
```

## Success Response

**Code** : `200 OK`

**Content example** :
```json
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiamFrb2IxIiwiaWF0IjoxNTkyOTMzNTE2fQ.zo-Xf7U2WEAMA15dVYLM9nWNEQZS8e37RJOS3sIlaY0"
}
```

## Error Responses

**Condition** : One or more fields are empty.

**Code** : `400 Bad Request`

**Content** : `"Empty field(s): username and password required"`

### OR

**Condition** : If `username` and `password` combination is wrong.

**Code** : `400 Bad Request`

**Content** : `"Login data invalid"`