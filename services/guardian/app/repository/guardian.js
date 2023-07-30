const { ObjectId } = require('mongodb');
const database = require('../../configuration/database');
const { genHash } = require('../../utility/auth');
const config = require('../../configuration/config');
const adminEmail = config.get('adminEmail');

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
                next({ status: 404, msg: "not found" }, null);
            else if(res.inuse === false && res.email !== adminEmail)
                next({ status: 401, msg: "unauthorised" }, null);
            else
                next(null, { status: 200, data: res });
        }));
}

const createUser = (req, next) => {
    // get the reference to the database
    const dbConnect = database.getDb();
    // insert new user
    dbConnect
        .collection('user')
        .insertOne(req, (err) => {
        if(err){
            if(err.code === 11000) // duplicate entry
                next({ status: 409, msg: 'duplicate entry' }, null);
            else
                next({ status: 500, msg: err }, null);
        }
        else
            next(null, { status: 201, data: { verifyToken: req.idToken } });
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
                next({ status: 400, msg: 'bad request' }, null);
            else if(res.inuse === false && email !== adminEmail)
                next({ status: 401, msg: 'unauthorised' }, null);
            else {
                if(res.password === genHash(password, Buffer.from(res.salt, 'hex')))
                    next(null, { status: 200, data: res });
                else 
                    next({ status: 401, msg: 'unauthorised' }, null);
            }
        }));
}

const updateEmailVerification = (req, next) => {
    const { idToken, verified } = req;

    const dbConnect = database.getDb();

    dbConnect
        .collection('user')
        .updateOne(
            { idToken: idToken },
            { $set: { emailVerified: verified , idToken: '' } },
            { upsert: true }, 
            function (err, res) {
                const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
                if (err)
                    next({ status: 500, msg: err }, null);
                else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
                    next(null, { status: 200, msg: 'ok' });
                else
                    next({ status: 400, msg: "bad request" }, null);
            });
}

const updateToken = (req, next) => { 

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
                    next({ status: 400, msg: "bad request" }, null);
            });
}

const deleteToken = (req, next) => {

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
                    next({ status: 400, msg: "bad request" }, null);
             }));
}

const selectUser = (req, next) => {

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

const selectUserByEmail = (req, next) => {
    const { email } = req;

    const dbConnect = database.getDb();

    dbConnect
        .collection('user')
        .findOne({ email: email }, ((err, res) => {
            if(err)
                next({ status: 500, msg: err }, null);
            else if(!res)
                next({ status: 404, msg: "not found" }, null);
            else if(res.inuse === false)
                next({ status: 403, msg: 'forbidden' }, null); // Account disabled, contact your system administrator
            else
                next(null, { status: 200, data: res });
        }));
}

const updateUser = (req, next) => {

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
                    next(null, { status: 200, msg: 'ok' });
                else
                    next({ status: 400, msg: "bad request" }, null);
        }));
}

const selectUsers = (query, next) => {

    let filter = null;

    if(query !== '')
        filter = { $text: { $search: query, $caseSensitive: false }}
        
    const dbConnect = database.getDb();

    dbConnect
        .collection('user')
        .find(filter)
        // .limit(200)
        .toArray(function (err, res) {
        if (err)
            next({ status: 400, msg: err }, null);
        else 
            next(null, { status: 200, res: res });
        });
}

const adminUpdateUser = (req, next) => {

    const { uid, data } = req;

    const dbConnect = database.getDb();
    const id = new ObjectId(uid);

    dbConnect
        .collection('user')
        .updateOne(
            { _id: id }, 
            { $set: data },
            { upsert: true }, ((err, res) => {
                const { acknowledged, modifiedCount, upsertedId, upsertedCount } = res;
                if (err)
                next({ status: 500, msg: err }, null);
                else if (acknowledged === true && modifiedCount === 1 && upsertedId === null && upsertedCount === 0)
                    next(null, { status: 200, msg: 'ok' });
                else
                    next({ status: 400, msg: "bad request" }, null);
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
                next({ status: 403, msg: "not found" }, null);
            else if(res.inuse === false)
                next({ status: 403, msg: "forbidden" }, null);
            else
                next(null, { status: 200, data: res });
        }));
}

module.exports = {
    isAuthenticated: isAuthenticated,
    createUser: createUser,
    updateEmailVerification: updateEmailVerification,
    authenticate: authenticate,
    updateToken: updateToken,
    deleteToken: deleteToken,
    selectUser: selectUser,
    selectUserByEmail: selectUserByEmail,
    updateUser: updateUser,
    selectUsers: selectUsers,
    adminUpdateUser: adminUpdateUser,
    approveTransaction: approveTransaction
}