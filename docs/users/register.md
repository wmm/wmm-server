# Register

Register new account.

**URL** : `/users/register/`

**Method** : `POST`

**Auth required** : NO

**Data constraints** :
```json
{
    "username": "[username]",
    "password": "[password]",
    "name": "[name]",
    "email": "[email]"
}
```

## Success Response

**Condition** : Username is unique, and all fields pass their regex test:
```
username: /^[\w.]{5,20}$/
password: /^[\w.#$%&@\- ]{6,}$/
name: /^[a-zA-Z]+( [a-zA-Z]+)*$/
email: /^((?!.*\.\.)(?!\.)(?!.*\.@)([a-zA-Z\d\.\+\_$#!&%?-]+)@(((?!-)(?!.*-\.)([a-zA-Z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?)|(\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\])))$/
```

**Code** : `201 Created`

**Content** : `"Account created"`

## Error Responses

**Condition** : One or more fields are empty.

**Code** : `400 Bad Request`

**Content** : `"Empty field(s): username, name, email and password required"`

### OR

**Condition** : One or more fields did not pass the regex text.

**Code** : `400 Bad Request`

**Content** : `"Invalid [field]"`

### OR

**Condition** : Username is already taken.

**Code** : `400 Bad Request`

**Content** : `"Username taken"`