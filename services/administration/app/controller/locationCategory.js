const repository = require('../repository/locationCategory');
const axios = require('../../config/axios');
const log = require('../../logs/logger')();
const config = require('../../config/config');
const version = config.get('version');
const moment = require('moment');

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
        log.error(`status: ${ err.status } POST location category v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.post(req.body, (err, res) => {
                    if(err){
                        log.error(`status: ${ err.status } POST location category v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else{
                        log.info(`status: ${res.status} POST location category v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } POST location category v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } POST location category v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

const patch = (req, next) => {
    const { idtoken } = req.headers;
    const { uid, name, description, inuse } = req.body;

    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        log.error(`status: ${ err.status } PATCH location category v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {

                const data = { uid: uid, data: { name: name, description: description, inuse: inuse, updated: moment().format() } }
                repository.patch(data, (err, res) => {
                    if(err) {
                        log.error(`status: ${ err.status } PATCH location category v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else {
                        log.info(`status: ${res.status} PATCH location category v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } PATCH location category v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } PATCH location category v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
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
        log.error(`status: ${ err.status } GET location category v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.get(query, (err, res) => {
                    if(err){
                        log.error(`status: ${ err.status } GET location category v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else {
                        log.info(`status: ${res.status} GET location category v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } GET location category v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } GET location category v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

const getLocationCategoryList = (req, next) => {
    const { idtoken } = req.headers;
    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        log.error(`status: ${ err.status } GET location category list v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['user'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.getLocationCategoryList(null, (err, res) => {
                    if(err){
                        log.error(`status: ${ err.status } GET location category list v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else {
                        log.info(`status: ${res.status} GET location category list v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } GET location category list v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } GET location category list v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

module.exports = {
    post: post,
    get: get,
    patch: patch,
    getLocationCategoryList: getLocationCategoryList
}