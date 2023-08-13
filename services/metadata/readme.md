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
- Create a -1 unique index on the name field in the user collection
- Create a text index on the name field in the user collection
- Create a -1 unique index on the abbrieviation field in the user collection

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
        idToken: 'the given IdToken'
    }
Requires JSON Body:
    {
        name: 'the organisations name',
        assetRole: (owner, maintainer, or supplier)
    }

Returns:
    - 201 Created - insertedId
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

### GET Organisation list for drop down menus
```
GET http://localhost:1337/admin/api/0.1/organisationlist

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

### PATCH Organisation
```
PATCH http://localhost:1337/admin/api/0.1/user/organisation

Requires JSON Header:
    {
        idToken: 'the given IdToken'
    }

Requires JSON Body:
    {
        name: 'the organisations name',
        assetRole: (owner, maintainer, or supplier),
        inuse: true or false
    }

Returns:
    - 200 OK
    - 400 Bad request - validation failure
    - 401 Unauthorised
    - 403 Account disabled, contact your system administrator
    - 404 Not found
    - 500 Internal error message
```

### POST new location category:

```
POST http://localhost:1337/admin/api/0.1/locaationcategory

Requires JSON Header:
    {
        idToken: 'the given IdToken',
    }
Requires JSON Body:
    {
        name: 'the location category name',
        description: 'a meaningful description'
    }

Returns:
    - 201 Created - insertedId
    - 400 Duplicate entry
    - 400 Bad request - validation failure
    - 500 Internal error message
```

### GET location categories
```
GET http://localhost:1337/admin/api/0.1/locationcategories

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        query: 'search on the name field'
    }
Returns:
    - 200 OK [an array of location categories]
    - 200 OK
    - 400 Bad request - validation failure
    - 400 Invalid request
    - 401 Unauthorised
    - 500 Internal error message

```

### GET location categories
```
GET http://localhost:1337/admin/api/0.1/locationcategorylist

Requires JSON Header:
    {
        idToken: 'the given IdToken'
    }
Returns:
    - 200 OK [an array of location categories that are in use]
    - 200 OK
    - 400 Bad request - validation failure
    - 400 Invalid request
    - 401 Unauthorised
    - 500 Internal error message

```

### PATCH location category
```
PATCH http://localhost:1337/admin/api/0.1/user/locationcategory

Requires JSON Header:
    {
        idToken: 'the given IdToken'
    }

Requires JSON Body:
    {
        name: 'the location category name',
        description: 'a meaningful description'
    }

Returns:
    - 200 OK
    - 400 Bad request - validation failure
    - 401 Unauthorised
    - 403 Account disabled, contact your system administrator
    - 404 Not found
    - 500 Internal error message
```

## License
[GNU GENERAL PUBLIC LICENSE V3](https://www.gnu.org/licenses/gpl-3.0.en.html)