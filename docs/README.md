# REST API Documentation

## Open Endpoints

* [Register](users/register.md) : `POST /users/register/`
* [Login](users/login.md) : `POST /users/login/`
+ [Get a users profile](users/profile/username.md) : `GET /users/profile/:username/`

## Endpoints that require a Refresh Token
These endpoints require a refresh token in the request body

* [Get an access token](users/token/post.md) : `POST /users/token/`

## Endpoints that require an Access Token
These endpoints require an access token as a Bearer token in the request header

### Current User related

* [Get your profile](users/profile/get.md) : `GET /users/profile/`
+ [Delete a refresh token](users/token/delete.md) : `DELETE /users/token/`
* [Get relation with a user](users/relation/username.md) : `GET /users/relation/:username/`

### Loan related

* [Get your loans](loans/get.md) : `GET /loans/`
* [Create a loan](loans/post.md) : `POST /loans/`
+ [Confirm a loan](loans/loanId/confirm.md) : `PATCH /loans/:loanId/confirm`
+ [Reject a loan](loans/loanId/reject.md) : `PATCH /loans/:loanId/reject`