# Get relation with a user

Gets the relation with a user.

**URL** : `/users/relation/:username`

**URL Parameters** : `username=[string]` other users username.

**Method** : `GET`

**Auth required** : YES (Access token in request header)

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content example** :

`amount` will be negative if the current user owes the other user, positive otherwise.
```json
{
    "amount": 20.11
}
```

## Error Response

**Condition** : If the `username` parameter is the same as the current users.

**Code** : `400 Bad Request`

**Content** : `"Cannot get relation with yourself"`