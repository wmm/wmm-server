# Create a loan

Used to create a loan between the current user and another user.

**URL** : `/loans/`

**Method** : `POST`

**Auth required** : YES (Access token in request header)

**Permissions required** : None

**Data example** :
If `amount` is negative, the current user borrowed from `user`, otherwise the current user lent money to `user`. 
```json
{
    "user": "john123",
    "amount": 12.3
}
```

## Success Response

**Condition** : `amount` is a valid non-zero float and `user` is a valid users username.

**Code** : `201 Created`

**Content** : `"Loan created"`

## Error Responses

**Condition** : One or more fields are empty.

**Code** : `400 Bad Request`

**Content** : `"Missing field(s): user and amount required"`

### OR

**Condition** : `amount` is not a valid non-zero float.

**Code** : `400 Bad Request`

**Content** : `"Invalid field: amount"`

### OR

**Condition** : If `user` is the current users username.

**Code** : `400 Bad Request`

**Content** : `"Cannot create a loan with yourself"`

### OR

**Condition** : If `user` is not an existing user.

**Code** : `400 Bad Request`

**Content** : `"User does not exist"`