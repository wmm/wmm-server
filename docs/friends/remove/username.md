# Remove a friend

Used to remove friends or to reject or cancel friend requests.

**URL** : `/friends/remove/:username/`

**URL Parameters** : `username=[string]` users username.

**Method** : `GET`

**Auth required** : YES (Access token in request header)

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content** : `"Friend request (canceled / rejected)"` **OR** `"Friend removed"`

## Error Responses

**Condition** : If users are not friends and dont have a pending request.

**Code** : `400 Bad Request`

**Content** : `"You are not friends"`