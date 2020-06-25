# Get your profile

Gets the profile of the currently logged in user.

**URL** : `/users/profile/`

**Method** : `GET`

**Auth required** : YES (Access token in request header)

**Permissions required** : None

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