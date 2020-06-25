# Confirm a loan

Used to confirm an existing loan.

**URL** : `/loans/:loanId/confirm`

**URL Parameters** : `loanId=[integer]` loan id.

**Method** : `PATCH`

**Auth required** : YES (Access token in request header)

**Permissions required** : Loan must belong to user

## Success Response

**Code** : `200 OK`

**Content** : `"Loan confirmed"`

## Error Responses

**Condition** : If the loan id is invalid.

**Code** : `400 Bad Request`

**Content** : `"Loan does not exist"`

### OR

**Condition** : If the user does not belong to this loan.

**Code** : `403 Forbiden`

**Content** : `"You can not access other peoples loans"`

### OR

**Condition** : If the user created the loan.

**Code** : `400 Bad Request`

**Content** : `"You cannot confirm a loan you created"`

### OR

**Condition** : If the loan is already confirmed.

**Code** : `400 Bad Request`

**Content** : `"Loan already confirmed"`