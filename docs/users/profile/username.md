# Get a users profile

Gets a users profile and some stats.

**URL** : `/users/profile/:username/`

**URL Parameters** : `username=[string]` users username.

**Method** : `GET`

**Auth required** : Optional

## Success Response

**Code** : `200 OK`

**Content example** :
```json
{
    "username": "john123",
    "name": "John Robert",
    "total_lent": 310.05,
    "total_borrowed": 295.99,
    "current_lent": 16.4,
    "current_borrowed": 20.11
}
```

**Logged-in content example** :
```json
{
    "username": "john123",
    "name": "John Robert",
    "total_lent": 310.05,
    "total_borrowed": 295.99,
    "current_lent": 16.4,
    "current_borrowed": 20.11,
    "relation": {
        "status": 3,
        "amount": -2.22
    }
}
```

## Error Response

**Condition** : User does not exist.

**Code** : `404 Not Found`

**Content** : `"User not found"`