# Add a friend

Used to send or accept friend requests.

**URL** : `/friends/add/:username/`

**URL Parameters** : `username=[string]` users username.

**Method** : `GET`

**Auth required** : YES (Access token in request header)

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content** : `"Friend request sent"` **OR** `"Friend added"`

## Error Responses

**Condition** : If user does not exist.

**Code** : `404 Not Found`

**Content** : `"User not found"`

### OR

**Condition** : If users are already friends.

**Code** : `400 Bad Request`

**Content** : `"You are already friends"`

### OR

**Condition** : If friend request is already sent.

**Code** : `400 Bad Request`

**Content** : `"Friend request already sent"`