# Administration
Node Express MongoDB api for managing lists.

## Configuration
 - Create a .env file in the root directory
    - Add the following configuration:
        - DB_URI={your mongodb uri} e.g. mongodb://localhost:27017/
        - PORT={the port number you will serve the express app on} e.g. 1337
        - LOG_PATH={the path to your log file} e.g. ./logs/auth.log
- Create your logs Directory as above
- Take a look at the config file in the configuration directory as this information is used in the URL's
- Create a -1 unique index on the name fields in the user collection
- Create a text index on the name fields in the user collection

## Data requirements
```
    - localId: MongoDb Object
    - query: 'search text'

```
## Usage
### POST new organisation:

```
POST http://localhost:1337/admin/api/0.1/organisation

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        query: 'organisation name to search'
    }
Requires JSON Body:
    {
        name: 'the organisations name',
        assetRole: (owner, maintainer, or supplier)
    }

Returns:
    - 201 Created
    - 400 Duplicate entry
    - 400 Bad request - validation failure
    - 500 Internal error message
```

### GET Organisations
```
GET http://localhost:1337/admin/api/0.1/organisations

Requires JSON Header:
    {
        idToken: 'the given IdToken'
    }
Returns:
    - 200 OK [an array of organisations]
    - 200 OK
    - 400 Bad request - validation failure
    - 400 Invalid request
    - 401 Unauthorised
    - 500 Internal error message

```

### POST Login:
```
POST http://localhost:1337/auth/api/0.1/user/login

Requires JSON Body:
    {
        email: 'valid email and registered address',
        password: 'a hashed 256 character password'
    }

Returns:
    - 200 {
        localId: 'unique id',
        displayName: 'specified display name',
        email: 'specified email address',
        idToken: 'the security token',
        expiresIn: 3600
    }
    - 400 Bad request - validation failure
    - 400 Invalid request
    - 401 Invalid email / password supplied
    - 404 Invalid email / password supplied
    - 500 Internal error message

```
### POST Logout:
```
POST http://localhost:1337/auth/api/0.1/user/logout

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid'
    }

Returns:
    - 200 OK
    - 400 Bad request - validation failure
    - 400 Invalid request
    - 401 Unauthorised
    - 500 Internal error message

```

### GET user data:
```
GET http://localhost:1337/auth/api/0.1/user

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid'
    }
Returns:
    - 200 {
        localId: 'unique id',
        displayName: 'specified display name',
        email: 'specified email address'
    }
    - 400 Bad request - validation failure
    - 400 Invalid request
    - 401 Unauthorised
    - 403 Account disabled, contact your system administrator
    - 404 Not found
    - 500 Internal error message
```
### PATCH Display Name
```
PATCH http://localhost:1337/auth/api/0.1/user/displayname

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid'
    }

Requires JSON Body:
    {
        displayName: 'new display name'
    }

Returns:
    - 200 OK
    - 400 Bad request - validation failure
    - 401 Unauthorised
    - 403 Account disabled, contact your system administrator
    - 404 Not found
    - 500 Internal error message
```
### PATCH Email Address
```
PATCH http://localhost:1337/auth/api/0.1/user/email

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid'
    }

Requires JSON Body:
    {
        email: 'new email address'
    }

Returns:
    - 200 OK
    - 400 Bad request - validation failure
    - 401 Unauthorised
    - 403 Account disabled, contact your system administrator
    - 404 Not found
    - 500 Internal error message
```
### PATCH Password
```
PATCH http://localhost:1337/auth/api/0.1/user/password

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid'
    }

Requires JSON Body:
    {
        password: 'new 256 char hashed password'
    }

Returns:
    - 200 OK
    - 400 Bad request - validation failure
    - 401 Unauthorised
    - 403 Account disabled, contact your system administrator
    - 404 Not found
    - 500 Internal error message
```

### Authenticate
```
POST http://localhost:1337/auth/api/0.1/authenticate

Requires JSON Header:
    {
        idToken: 'the given IdToken'
    }

Returns: 
    - 200 OK
    - 400 Bad request - validation failure
    - 401 Unauthorised
    - 404 Unauthorised
    - 403 Account disabled, contact your system administrator
    - 500 Internal error message
```

## License
[GNU GENERAL PUBLIC LICENSE V3](https://www.gnu.org/licenses/gpl-3.0.en.html)