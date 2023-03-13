const repository = require('../repository/location');
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
        log.error(`status: ${ err.status } POST location v${ version } result: no idToken`);
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
                        log.error(`status: ${ err.status } POST location v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else{
                        log.info(`status: ${res.status} POST location v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } POST location v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } POST location v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

const patch = (req, next) => {
    const { idtoken, param } = req.headers;

    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        log.error(`status: ${ err.status } PATCH location v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {

                const data = { id: param, data: { ...req.body,  updated: moment().format() } }
                repository.patch(data, (err, res) => {
                    if(err) {
                        log.error(`status: ${ err.status } PATCH location v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else {
                        log.info(`status: ${res.status} PATCH location v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } PATCH location v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } PATCH location v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

const getLocations = (req, next) => {
    const { idtoken, query } = req.headers;
    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        log.error(`status: ${ err.status } GET locations v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['superuser', 'administrator'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.getLocations(query, (err, res) => {
                    if(err){
                        log.error(`status: ${ err.status } GET locations v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else {
                        log.info(`status: ${res.status} GET locations v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } GET locations v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } GET locations v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

const getLocation = (req, next) => {
    const { idtoken, param } = req.headers;
    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        log.error(`status: ${ err.status } GET location v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: [ 'user' ] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.getLocation(param, (err, res) => {
                    if(err){
                        log.error(`status: ${ err.status } GET location v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else {
                        log.info(`status: ${res.status} GET location v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } GET location v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } GET location v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

const getlLocationList = (req, next) => {
    const { idtoken } = req.headers;
    // configure header
    let header = null;
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        log.error(`status: ${ err.status } GET location list v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // set the api authorisation rules
    const rules = { roles: ['user'] };
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                repository.getLocationList(null, (err, res) => {
                    if(err){
                        log.error(`status: ${ err.status } GET location list v${ version } result: ${ JSON.stringify(err) }`);
                        next(err, null);
                    } else {
                        log.info(`status: ${res.status} GET location list v${version}`);
                        next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } GET location list v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } GET location list v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
}

module.exports = {
    post: post,
    patch: patch,
    getLocations: getLocations,
    getLocation: getLocation,
    getlLocationList: getlLocationList
}