# Search for users

Gets a list of usernames of users that partialy or fully match the phrase.

**URL** : `/users/search/:phrase`

**URL Parameters** : `phrase=[string]` search phrase.

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example** :
```json
[
    "jsonderulo"
    "jsond12"
]
```