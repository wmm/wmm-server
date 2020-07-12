# Delete a refresh token

Used to delete a refresh token from the database.

**URL** : `/users/token/`

**Method** : `DELETE`

**Auth required** : YES (Access token in request header)

**Permissions required** : Refresh token must belong to user

**Data constraints** : `{"refresh_token": "[refresh token]"}`

## Success Response

**Code** : `200 OK`

**Content example** : `"Token deleted"`

## Error Responses

**Condition** : If refresh token is missing.

**Code** : `400 Bad Request`

**Content** : `"Refresh token missing"`

### OR

**Condition** : If the token does not belong to the user.

**Code** : `403 Forbidden`

**Content** : `"You do not own this token"`