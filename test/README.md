# Tests

## Endpoints

## **/users**

**Register**

-   **POST** _(/users/register)_
    -   **Successfully registers**
        -   Valid user
    -   **Fails to register**
        -   User with taken username
        -   User with all empty fields
        -   User with empty username
        -   User with empty email
        -   User with empty name
        -   User with empty password
        -   User with invalid username
        -   User with invalid email
        -   User with invalid password
        -   User with invalid name

**Login**

-   **POST** _(/users/login)_
    -   **Successful login**
        -   Valid user
    -   **Failed login**
        -   All fields empty
        -   Username empty
        -   Password empty
        -   Wrong username and password combination

**Token**

-   **POST** _(/users/token)_
    -   Valid refresh token
    -   Empty refresh token &rarr; _FAILS_
    -   Malformed refresh token &rarr; _FAILS_
-   **DELETE** _(/users/token)_
    -   Valid refresh token
    -   Missing access token &rarr; _FAILS_
    -   Empty refresh token &rarr; _FAILS_

**Profile**

-   **GET** _(/users/profile)_
    -   Successful
-   **GET** _(/users/profile/:username)_
    -   As Guest
    -   Logged in
    -   User doesn't exist &rarr; _FAILS_

## **/friends**

**Creating 2 accounts for testing**

-   register alice
-   register bob

**Log both accounts in**

-   login alice
-   login bob

**Get access tokens**

-   alice
-   bob

**Main functions**

-   alice adds bob
-   alice sends another request to bob &rarr; _FAILS_
-   bob rejects the request
-   bob sends a request to alice
-   bob cancels the request
-   alice sends a request to bob
-   bob checks incoming requests
-   bob accepts the request
-   alice sends another request to bob &rarr; _FAILS_
-   bob checks friends list
-   bob removes alice
-   bob tries to remove alice again &rarr; _FAILS_
-   bob checks friends list

## **/loans**

**Creating 3 accounts for testing**

-   register alice
-   register bob
-   register charlie

**Log all accounts in**

-   login alice
-   login bob
-   login charlie

**Get access tokens**

-   alice
-   bob
-   charlie

**Main functions**

-   alice sends a loan request to bob
-   alice sends a loan request with missing username &rarr; _FAILS_
-   alice sends a loan request with missing amount &rarr; _FAILS_
-   alice sends a loan request with invalid amount &rarr; _FAILS_
-   alice sends a loan request to herself &rarr; _FAILS_
-   alice sends a loan request to a user that does't exist &rarr; _FAILS_
-   bob checks his loan list
-   bob accepts the loan request from alice
-   bob trys to accept the loan again &rarr; _FAILS_
-   bob sends a loan request to alice
-   bob sends a loan request to Charlie
-   bob trys to accept his own loan request &rarr; _FAILS_
-   bob trys to accept a loan with an invalid id &rarr; _FAILS_
-   alice rejects the loan request from bob
-   alice trys to reject the loan again &rarr; _FAILS_
-   Alice trys to reject a loan that bob send to charlie &rarr; _FAILS_
-   alice trys to accept a loan that bob send to charlie &rarr; _FAILS_
-   alice trys to reject a loan with an invalid id &rarr; _FAILS_
-   alice sends a loan request to bob
-   alice cancels the loan request
