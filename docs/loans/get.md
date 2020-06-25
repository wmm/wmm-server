# Get your loans

Gets an array of loans that the current user is part of.

**URL** : `/loans/`

**Optional query parameters** :
* `start=[integer]` : number of loans to skip (default=0)
* `count=[integer]` : maximum number of loans to return (default=10)

**Method** : `GET`

**Auth required** : YES (Access token in request header)

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content example** :

```json
[
    {
        "id": 57,
        "sender": "john22",
        "reciever": "james34",
        "creator": "john22",
        "amount": 20.45,
        "created": "2020-06-23T17:37:51.000Z",
        "confirmed": "2020-06-23T17:38:04.000Z"
    }
]
```