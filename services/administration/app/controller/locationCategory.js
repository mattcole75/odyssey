const repository = require('../repository/locationCategory');
const axios = require('../../config/axios');
const log = require('../../logs/logger')();
const config = require('../../config/config');
const version = config.get('version');
const moment = require('moment');

const post = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { roles: ['superuser', 'administrator'] },
            values: req.body
        }
    };

    repository.post(request, (err, res) => {
        if(err){
            log.error(`status: ${ err.status } POST location category v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else{
            log.info(`status: ${res.status} POST location category v${version}`);
            next(null, res);
        }
    });
};

const patch = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { roles: ['superuser', 'administrator'] },
            values: req.body
        }
    }

    repository.patch(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } PATCH location category v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${res.status} PATCH location category v${version}`);
            next(null, res);
        }
    });
};

const get = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: { ...req.headers, rules: { roles: ['superuser', 'administrator'] } }
    }

    repository.get(request, (err, res) => {
        if(err){
            log.error(`status: ${ err.status } GET location category v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${res.status} GET location category v${version}`);
            next(null, res);
        }
    });
};

const getLocationCategoryList = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: { ...req.headers, rules: { roles: ['user'] } }
    }

    repository.getLocationCategoryList(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } GET location category list v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${res.status} GET location category list v${version}`);
            next(null, res);
        }
    });
};

module.exports = {
    post: post,
    get: get,
    patch: patch,
    getLocationCategoryList: getLocationCategoryList
}