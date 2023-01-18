const { ObjectId } = require('mongodb');
const database = require('../../configuration/database');
const { genHash } = require('../../utility/auth');

const postUser = (req, next) => {
    const dbConnect = database.getDb();

    dbConnect
        .collection('user')
        .insertOne(req, (err, res) => {
        if(err){
            if(err.code === 11000) // duplicate entry
                next({ status: 400, msg: 'Duplicate entry' }, null);
            else
                next({ status: 500, msg: err }, null);
        }
        else
            next(null, { status: 201, data: res });
    });
}

const authenticate = (req, next) => {

    const { email, password } = req;

    const dbConnect = database.getDb();

    dbConnect
        .collection('user')
        .findOne({ email: email }, ((err, res) => {
            if(err)
                next({ status: 500, msg: err }, null);
            else if(!res)
                next({ status: 401, msg: "Invalid email / password supplied" }, null);
            else {
                if(res.password === genHash(password, Buffer.from(res.salt, 'hex')))
                    next(null, { status: 200, data: res });
                else 
                    next({ status: 401, msg: 'Invalid email / password supplied' }, null);
            }
        }));
}

const patchToken = (req, next) => {

    const { idToken, lastLoggedIn } = req;

    const dbConnect = database.getDb();

    dbConnect
        .collection('user')
        .updateOne(
            { _id: req.localId },
            { $set: { idToken: idToken , lastLoggedIn: lastLoggedIn}, $inc: { logInCount: + 1 }},
            { upsert: true }, 
            function (err, res) {
                const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
                if (err)
                    next({ status: 500, msg: err }, null);
                else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
                    next(null, { status: 200, idToken: idToken });
                else
                    next({ status: 400, msg: "Invalid request" }, null);
            });
}

const getUser = (req, next) => {

    const { idtoken, localid } = req;

    const dbConnect = database.getDb();
    const id = new ObjectId(localid);

    dbConnect
        .collection('user')
        .findOne({ _id: id, idToken: idtoken }, ((err, res) => {
            if(err)
                next({ status: 500, msg: err }, null);
            else if(!res)
                next({ status: 404, msg: "Not found" }, null);
            else if(res.inuse === false)
                next({ status: 403, msg: "Account disabled, contact your system administrator" }, null);
            else
                next(null, { status: 200, data: res });
        }));
}

const getUsers = (req, next) => {

    // const { id } = req.headers;
    // const { name } = req.body;

    const dbConnect = database.getDb();

    // let query;
    
    // if (id)
    //     query = { parentRef: id }
    // else if (name)
    //     query = {$text: { $search: name, $caseSensitive: false }}
    // else
    //     query = { parentRef: { $exists: false }};

    dbConnect
        .collection('user')
        .find()
        // .limit(200)
        .toArray(function (err, res) {
        if (err) 
            next({ status: 400, msg: err }, null);
        else 
            next(null, { status: 200, data: res });
        });
}

const removeToken = (req, next) => {

    const { localId } = req;

    const dbConnect = database.getDb();
    const id = new ObjectId(localId);

    dbConnect
        .collection('user')
        .updateOne(
            { _id: id }, 
            { $set: { idToken: ''}},
            { upsert: true }, ((err, res) => {
                const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
                if (err)
                next({ status: 500, msg: err }, null);
                else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
                    next(null, { status: 200, msg: 'OK' });
                else
                    next({ status: 400, msg: "Invalid request" }, null);
             }));
}

const isAuthenticated = (req, next) => {

    const { localId, idToken } = req;
    
    const dbConnect = database.getDb();
    const id = new ObjectId(localId);

    dbConnect
        .collection('user')
        .findOne({ _id: id, idToken: idToken }, ((err, res) => {
            if(err)
                next({ status: 500, msg: err }, null);
            else if(!res)
                next({ status: 404, msg: "Unauthorised" }, null);
            else if(res.inuse === false)
                next({ status: 403, msg: "Account disabled, contact your system administrator" }, null);
            else
                next(null, { status: 200, data: res });
                // next(null, {status: 200, msg: 'OK'});
        }));
}

const patchUser = (req, next) => {

    const { localId } = req;

    const dbConnect = database.getDb();
    const id = new ObjectId(localId);

    dbConnect
        .collection('user')
        .updateOne(
            { _id: id }, 
            { $set: req.data },
            { upsert: true }, ((err, res) => {
                const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
                if (err)
                next({ status: 500, msg: err }, null);
                else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
                    next(null, { status: 200, msg: 'OK' });
                else
                    next({ status: 400, msg: "Invalid request" }, null);
        }));
}

const patchUserRole = (req, next) => {

    const { localId } = req;

    const dbConnect = database.getDb();
    const id = new ObjectId(localId);

    dbConnect
        .collection('user')
        .updateOne(
            { _id: id }, 
            { $set: req.data },
            { upsert: true }, ((err, res) => {
                const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
                if (err)
                next({ status: 500, msg: err }, null);
                else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
                    next(null, { status: 200, msg: 'OK' });
                else
                    next({ status: 400, msg: "Invalid request" }, null);
            }));
}

const approveTransaction = (idToken, next) => {

    const dbConnect = database.getDb();

    dbConnect
        .collection('user')
        .findOne({ idToken: idToken }, ((err, res) => {
            if(err)
                next({ status: 500, msg: err }, null);
            else if(!res)
                next({ status: 404, msg: "Not found" }, null);
            else if(res.inuse === false)
                next({ status: 403, msg: "Account disabled, contact your system administrator" }, null);
            else
                next(null, { status: 200, data: res });
        }));
}

module.exports = {
    postUser: postUser,
    authenticate: authenticate,
    patchToken: patchToken,
    getUser: getUser,
    getUsers: getUsers,
    removeToken: removeToken,
    isAuthenticated: isAuthenticated,
    patchUser: patchUser,
    patchUserRole: patchUserRole,
    approveTransaction: approveTransaction
}