const { ObjectId } = require('mongodb');
const database = require('../../config/database');
const moment = require('moment');

const post = (req, next) => {
    const dbConnect = database.getDb();

    const data = { ...req, created: moment().format(), updated: moment().format(), inuse: true }

    dbConnect
        .collection('organisations')
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
    const { uid, data } = req;
    const dbConnect = database.getDb();
    const id = new ObjectId(uid);

    dbConnect
        .collection('organisations')
        .updateOne(
            { _id: id }, 
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

const get = (query, next) => {
    let filter = null;

    if(query !== '')
        filter = { $text: { $search: query, $caseSensitive: false }}
        
    const dbConnect = database.getDb();

    dbConnect
        .collection('organisations')
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

const getOrganisationList = (req, next) => {
    const dbConnect = database.getDb();

    dbConnect
        .collection('organisations')
        .find({ inuse: true }).sort({ name: 1 })
        .toArray(function (err, res) {
        if (err) {
            next({ status: 400, msg: err }, null);
        }
        else 
            next(null, { status: 200, res: res });
        });
}

module.exports = {
    post: post,
    patch: patch,
    get: get,
    getOrganisationList: getOrganisationList
}