# Get a loan

Gets a loan by the loan id.

**URL** : `/loans/:loanId/`

**URL Parameters** : `loanId=[integer]` loan id.

**Method** : `GET`

**Auth required** : YES (Access token in request header)

**Permissions required** : Loan must belong to user

## Success Response

**Code** : `200 OK`

**Content example** :

```json
{
    "id": 57,
    "title": "Coffee",
    "sender": "john22",
    "reciever": "james34",
    "creator": "john22",
    "amount": 20.45,
    "created": "2020-06-23T17:37:51.000Z",
    "confirmed": "2020-06-23T17:38:04.000Z"
}
```