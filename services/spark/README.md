# spark
Node Express MongoDB api for a sensor network

## Installation

Use the package manager [npm](https://github.com/mattcole75/spark) to install Spark once you have cloned the repository.

```bash
npm install
```
## description
This API is a stand alone system to encourage and enable individuals to develop sensor networks.

## Database
The system is using MongoDB and a time series setup to optimise the storage of data.

The collection take the following form:
```
db.createCollection("sensorData", {
  timeseries: {
    timeField: "timestamp",
    metaField: "id",
    granularity: "minutes"
  },
    expireAfterSeconds: 1209600
});
```

An example of an insert statement for the above collection will be:
```
db.sensorData.insertOne({id: "RIG-R&D-TMP-003", timestamp: new Date(), value: "22"})
```

## Usage

### POST Sensor Record:
This API will accept the id and sensor payload and store it in the database. The server date and time is added to each payload.
```
POST http://localhost:1337/spark/api/0.1/sensordata

Requires JSON Header:
    {
        idToken: 'a pre configured access token'
    }

Requires JSON Body:
    {
        id: 'sensor registered id',
        value: 20 this must be a numerical value for the aggregate GET request to work correctly
    }

Returns:
    - 201 Created, returns the uid and transaction status
    - 401 Unauthorised
    - 500 Internal error message
```

### GET Sensor Records:
This API will return all sensor records
```
GET http://localhost:1337/spark/api/0.1/sensordata

Requires JSON Header:
    {
        idToken: 'a pre configured access token',
        param: 'optional sensor ID'
    }

Returns:
    - 200 ok, returns the stored sensor data array
    - 401 Unauthorised
    - 500 Internal error message
```

### GET Sensor Records Aggregated:
This API will return all sensor records aggregated for a report
```
GET http://localhost:1337/spark/api/0.1/sensordataaaggregate

Requires JSON Header:
    {
        idToken: 'a pre configured access token',
        param: 'optional sensor ID'
    }

Returns:
    - 200 ok, returns the stored sensor data array
    - 401 Unauthorised
    - 500 Internal error message
```

### GET API Status:
This API will return the matching locations provided it is in use for all levels.
```
GET http://localhost:1337


Returns:
    - 200 ok, msg: The server is up!
```

## License
[GNU GENERAL PUBLIC LICENSE V3](https://www.gnu.org/licenses/gpl-3.0.en.html)
