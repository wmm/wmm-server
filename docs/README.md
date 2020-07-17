# REST API Documentation

## Open Endpoints

* [Register](users/register.md) : `POST /users/register/`
* [Login](users/login.md) : `POST /users/login/`
+ [Get a users profile](users/profile/username.md) : `GET /users/profile/:username/`
+ [Search for users](users/search/phrase.md) : `GET /users/search/:phrase/`

## Endpoints that require a Refresh Token
These endpoints require a refresh token in the request body

* [Get an access token](users/token/post.md) : `POST /users/token/`

## Endpoints that require an Access Token
These endpoints require an access token as a Bearer token in the request header

### Current User related

* [Get your profile](users/profile/get.md) : `GET /users/profile/`
+ [Delete a refresh token](users/token/delete.md) : `DELETE /users/token/`

### Friend related

* [Get your friends](friends/get.md) : `GET /friends/`
* [Get incomming friend requests](friends/requests.md) : `GET /friends/requests/`
* [Add a friend](friends/add/username.md) : `GET /friends/add/:username/`
* [Remove a friend](friends/remove/username.md) : `GET /friends/remove/:username/`

### Loan related

* [Get your loans](loans/get.md) : `GET /loans/`
* [Create a loan](loans/post.md) : `POST /loans/`
+ [Get a loan](loans/loanId/get.md) : `GET /loans/:loanId/`
+ [Confirm a loan](loans/loanId/confirm.md) : `PATCH /loans/:loanId/confirm`
+ [Reject a loan](loans/loanId/reject.md) : `PATCH /loans/:loanId/reject`