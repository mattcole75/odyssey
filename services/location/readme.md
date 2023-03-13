# Location
Node Express MongoDB api for managing location.

## Configuration
 - Create a .env file in the root directory
    - Add the following configuration:
        - DB_URI={your mongodb uri} e.g. mongodb://localhost:27017/
        - PORT={the port number you will serve the express app on} e.g. 1337
        - LOG_PATH={the path to your log file} e.g. ./logs/location.log
- Create your logs Directory as above
- Take a look at the config file in the configuration directory as this information is used in the URL's
- Create a -1 unique index on the name field in the location collection
- Create a text index on the name field in the location collection
- Create a -1 unique index on the abbrieviation field in the location collection

## Data requirements
```
    - localId: MongoDb Object
    - query: 'search text'
```

## Usage
### POST new location:
```
POST http://localhost:1337/location/api/0.1/locations

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        query: 'location name to search'
    }
Requires JSON Body:
    {
        parentRef: 'recursive reference',
        name: 'the location name',
        description: 'the description of the location',
        location: {
            type: 'Point',
            coordinates : [ 53.478302, -2.243529 ]

            or

            type: 'Polygon',
            coordinates: [[
                [-2.2382104 53.4817944],
                [-2.2383079 53.4816753],
                [-2.2382717 53.4816561],
                [-2.2382449 53.4815611],
                [-2.2391314 53.4809362],
                [-2.2392293 53.4808357],
                [-2.2394894 53.4806665],
                [-2.2393218 53.4805811],
                [-2.2389664 53.4808293],
                [-2.238784 53.4809458],
                [-2.2386365 53.480969],
                [-2.2385131 53.4809642],
                [-2.2384152 53.4809402],
                [-2.2382395 53.4808548],
                [-2.2380343 53.4807471],
                [-2.237864 53.480633],
                [-2.2376199 53.4804789],
                [-2.237404 53.4806314],
                [-2.2377125 53.4807998],
                [-2.2378466 53.4808876],
                [-2.2379163 53.480933],
                [-2.2379565 53.4809945],
                [-2.23797 53.481056],
                [-2.2379552 53.481103],
                [-2.2376843 53.4813864],
                [-2.2376424 53.4814481],
                [-2.237619 53.4814992],
                [-2.2376136 53.4815606],
                [-2.2376384 53.4816193],
                [-2.2376887 53.4816783],
                [-2.2377706 53.4817397],
                [-2.2381642 53.4818478],
                [-2.2382104 53.4817944]
            ]]
        }
    }



Returns:
    - 201 Created
    - 400 Duplicate entry
    - 400 Bad request - validation failure
    - 500 Internal error message
```

### GET location
```
GET http://localhost:1337/location/api/0.1/location

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        param: 'the document identifier which is a MongoDb Object'
    }
Returns:
    - 200 OK [an array of locations]
    - 200 OK
    - 400 Bad request - validation failure
    - 400 Invalid request
    - 401 Unauthorised
    - 500 Internal error message
```

### PATCH location
```
PATCH http://localhost:1337/location/api/0.1/location

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        param: 'the document identifier which is a MongoDb Object'
    }

Requires JSON Body:
    {
        parentRef: 'the parent location reference id',
        name: 'the organisations name',
        description: 'a description of the location',
        location: 'Point or polygon',
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

## License
[GNU GENERAL PUBLIC LICENSE V3](https://www.gnu.org/licenses/gpl-3.0.en.html)