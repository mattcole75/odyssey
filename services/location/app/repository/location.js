const { ObjectId } = require('mongodb');
const database = require('../../config/database');
const moment = require('moment');

const post = (req, next) => {
    const dbConnect = database.getDb();

    const data = { ...req, created: moment().format(), updated: moment().format(), inuse: true }

    dbConnect
        .collection('locations')
        .insertOne(data, (err, res) => {
            if(err) {
                if(err.code === 11000) // duplicate entry
                    next({ status: 400, res: 'Duplicate entry' }, null);
                else
                    next({ status: 500, res: err }, null);
            } else
                next(null, { status: 201, res: res });
            });
}

const patch = (req, next) => {
    const { id, data } = req;
    const dbConnect = database.getDb();
    const _id = new ObjectId(id);

    dbConnect
        .collection('locations')
        .updateOne(
            { _id: _id }, 
            { $set: data },
            { upsert: true }, ((err, res) => {
                const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
                if (err)
                    next({ status: 500, res: err }, null);
                else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
                    next(null, { status: 200, res: 'OK' });
                else
                    next({ status: 400, res: "Invalid request" }, null);
        }));
}

const getLocations = (query, next) => {
    let filter = null;

    if(query !== '')
        filter = { $text: { $search: query, $caseSensitive: false }}
        
    const dbConnect = database.getDb();

    dbConnect
        .collection('locations')
        .find(filter).sort({ name: 1 })
        // .limit(200)
        .toArray(function (err, res) {
        if (err) {
            next({ status: 400, msg: err }, null);
        }
        else 
            next(null, { status: 200, res: res });
        });
}

const getLocation = (param, next) => {

    const dbConnect = database.getDb();
    const id = new ObjectId(param);

    dbConnect
        .collection('locations')
        .findOne({ _id: id }, ((err, res) => {
            if(err)
                next({ status: 500, msg: err }, null);
            else if(!res)
                next({ status: 404, msg: "Not found" }, null);
            else if(res.inuse === false)
                next({ status: 403, msg: "Location disabled, contact your system administrator" }, null);
            else
                next(null, { status: 200, res: res });
        }));
}

const getLocationList = (req, next) => {
    const dbConnect = database.getDb();

    dbConnect
        .collection('locations')
        .find({ inuse: true }).sort({ name: 1 })
        .toArray(function (err, res) {
        if (err)
            next({ status: 400, msg: err }, null);
        else 
            next(null, { status: 200, res: res });
        });
}

module.exports = {
    post: post,
    patch: patch,
    getLocations: getLocations,
    getLocation: getLocation,
    getLocationList: getLocationList
}