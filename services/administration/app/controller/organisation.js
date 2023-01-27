const repository = require('../repository/organisation');
const axios = require('../../config/axios');

const post = (req, next) => {

    const { idtoken } = req.headers;
    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.post(req.body, (err, res) => {
                    if(err)
                        next(err, null);
                    else
                        next(null, res);
                });
            } else {
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            return(next(authErr.response.data, null));
        });
}

const patch = (req, next) => {
    const { idtoken } = req.headers;
    const { uid, name, assetRole } = req.body;

    console.log('headers', req.headers);
    console.log('body', req.body);


    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {

                const data = { uid: uid, data: { name: name, assetRole: assetRole } }
                repository.patch(data, (err, res) => {
                    if(err)
                        next(err, null);
                    else
                        next(null, res);


                });
            } else {
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            return(next(authErr.response.data, null));
        });
}

const get = (req, next) => {
    const { idtoken, query } = req.headers;
    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.get(query, (err, res) => {
                    if(err)
                        next(err, null);
                    else
                        next(null, res);
                });
            } else {
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            return(next(authErr.response.data, null));
        });
}

module.exports = {
    post: post,
    get: get,
    patch: patch
}