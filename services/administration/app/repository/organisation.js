// const { ObjectId } = require('mongodb');
// const database = require('../../config/database');
// const moment = require('moment');

const axios = require('../../config/axios');

const post = (req, next) => {
    
    const { idtoken } = req.headers;
    const { rules, values } = req.body;
    
    const sproc = "call sp_insertOrganisation(" +
        (values.name == null ? null + ", " : "'" + values.name + "', ") + // name
        (values.abbreviation == null ? null + ", " : "'" + values.abbreviation + "', ") + // description
        (values.assetRole == null ? null + ", " : "'" + values.assetRole + "', ") + // description
        "@insertId)";

    axios.post('/post',
        { rules: rules, sproc: sproc },
        { headers: {'Content-Type': 'application/json', idToken: idtoken } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

// const post = (req, next) => {
//     const dbConnect = database.getDb();

//     const data = { ...req, created: moment().format(), updated: moment().format(), inuse: true }

//     dbConnect
//         .collection('organisations')
//         .insertOne(data, (err, res) => {
//             if(err) {
//                 if(err.code === 11000) // duplicate entry
//                     next({ status: 400, res: 'Duplicate entry' }, null);
//                 else
//                     next({ status: 500, res: err }, null);
//             } else
//                 next(null, { status: 201, res: res });
//             });
// }

const patch = (req, next) => {

    const { idtoken } = req.headers;
    const { rules, values } = req.body;
    const sproc = "call sp_updateOrganisation(" +
        (values.id == null ? null + ", " : values.id + ", ") +
        (values.name == null ? null + ", " : "'" + values.name + "', ") +
        (values.abbreviation == null ? null + ", " : "'" + values.abbreviation + "', ") +
        (values.assetRole == null ? null + ", " : "'" + values.assetRole + "', ") +
        (values.inuse == null ? null + ") " : values.inuse + ")");

    axios.patch('/patch',
        { rules: rules, sproc: sproc },
        { headers: {'Content-Type': 'application/json', idToken: idtoken } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

// const patch = (req, next) => {
//     const { uid, data } = req;
//     const dbConnect = database.getDb();
//     const id = new ObjectId(uid);

//     dbConnect
//         .collection('organisations')
//         .updateOne(
//             { _id: id }, 
//             { $set: data },
//             { upsert: true }, ((err, res) => {
//                 const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
//                 if (err)
//                     next({ status: 500, res: err }, null);
//                 else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
//                     next(null, { status: 200, res: 'OK' });
//                 else
//                     next({ status: 400, res: "Invalid request" }, null);
//         }));
// }

const get = (req, next) => {
    const { idtoken, query } = req.headers;
    const { rules } = req.body;
    //declare the sql string
    const sproc = `call sp_selectOrganisations('${query}')`;

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: idtoken, rules: rules, sproc: sproc } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

// const get = (query, next) => {
//     let filter = null;

//     if(query !== '')
//         filter = { $text: { $search: query, $caseSensitive: false }}
        
//     const dbConnect = database.getDb();

//     dbConnect
//         .collection('organisations')
//         .find(filter).sort({ name: 1 })
//         // .limit(200)
//         .toArray(function (err, res) {
//         if (err) {
//             next({ status: 400, msg: err }, null);
//         }
//         else 
//             next(null, { status: 200, res: res });
//         });
// }

const getOrganisationList = (req, next) => {
    const { idtoken, query } = req.headers;
    const { rules } = req.body;
    //declare the sql string
    const sproc = `call sp_selectOrganisationList('${query}')`;

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: idtoken, rules: rules, sproc: sproc } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

// const getOrganisationList = (req, next) => {
//     const dbConnect = database.getDb();

//     dbConnect
//         .collection('organisations')
//         .find({ inuse: true }).sort({ name: 1 })
//         .toArray(function (err, res) {
//         if (err) {
//             next({ status: 400, msg: err }, null);
//         }
//         else 
//             next(null, { status: 200, res: res });
//         });
// }

module.exports = {
    post: post,
    patch: patch,
    get: get,
    getOrganisationList: getOrganisationList
}