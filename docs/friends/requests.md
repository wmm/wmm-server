# Get incomming friend requests

Gets a list of incomming friend requests.

**URL** : `/friends/requests/`

**Method** : `GET`

**Auth required** : YES (Access token in request header)

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content example** :
```json
[
    "john123",
    "jason456"
]
```