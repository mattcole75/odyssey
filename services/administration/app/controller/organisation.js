const repository = require('../repository/organisation');
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
            log.error(`status: ${ err.status } POST organisation v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else{
            log.info(`status: ${res.status} POST organisation v${version}`);
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
            log.error(`status: ${ err.status } PATCH organisation v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${res.status} PATCH organisation v${version}`);
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
            log.error(`status: ${ err.status } GET organisations v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${res.status} GET organisations v${version}`);
            next(null, res);
        }
    });
};

const getOrganisationList = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: { ...req.headers, rules: { roles: ['user'] } }
    }

    repository.getOrganisationList(request, (err, res) => {
        if(err){
            log.error(`status: ${ err.status } GET organisation list v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${res.status} GET organisation list v${version}`);
            next(null, res);
        }
    });
};

module.exports = {
    post: post,
    get: get,
    patch: patch,
    getOrganisationList: getOrganisationList
}