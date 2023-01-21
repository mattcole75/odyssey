const database = require('../config/database');

const postSensorData = (req, next) => {
    
    const dbConnect = database.getDb();

    dbConnect
        .collection('sensorData')
        .insertMany(req, function (err, res) {
        if(err)
            next({ status: 500, msg: err }, null);
        else
            next(null, { status: 201, data: res });
    });
}

const getSensorData = (req, next) => {

    const dbConnect = database.getDb();
    const { param, startdate, enddate } = req.headers;

    let query = null;
    if(param){
        query = { id: param };

        if(startdate != null && enddate != null) {
            query = {
                id: param,
                timestamp:{ 
                    $gte: new Date(startdate),
                    $lt: new Date(enddate)
                }
                // createdAt:{ $gte:ISODate(“2020-03-01”),$lt:ISODate(“2021-04-01”) }
            }
        }
    }

    dbConnect
        .collection('sensorData')
        .find(query)
        .sort({eventTimestamp: 1})
        // .limit(200)
        .toArray(function (err, res) {
        if (err)
            next({ status: 500, msg: err }, null);
        else
            next(null, { status: 200, data: res });
        });
};

const getSensorDatAaggregate = (req, next) => {

    const dbConnect = database.getDb();
    const { param } = req.headers;

    const query = [
        { $project: { date: { $dateToParts: { date: "$timestamp" } }, id: 1, value: 1 } },
        { $group: { _id: { id: "$id", date: { year: "$date.year", month: "$date.month", day: "$date.day" } }, min: { $min: "$value" }, max: { $max: "$value" }, avg: { $avg: "$value" } } }
    ];

    if(param)
        query.unshift(
            { $match: { id: param } }
        );

    dbConnect
        .collection('sensorData')
        .aggregate(query)
        .toArray(function (err, res) {
        if (err)
            next({ status: 500, msg: err }, null);
        else
            next(null, { status: 200, data: res });
        });

};

const postPointData = (req, next) => {
    
    const dbConnect = database.getDb();

    dbConnect
        .collection('pointData')
        .insertOne(req, function (err, res) {
        if(err)
            next({ status: 500, msg: err }, null);
        else
            next(null, { status: 201, data: res });
    });
}

module.exports = {
    getSensorData: getSensorData,
    postSensorData: postSensorData,
    getSensorDatAaggregate: getSensorDatAaggregate,
    postPointData: postPointData
}