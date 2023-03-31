const repository = require('../repository/roster');
const log = require('../../logs/logger')();
const config = require('../../config/config');
const version = config.get('version');

const postRoster = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { rules: { roles: ['superuser', 'administrator'] } },
            values: req.body
            // values: [ req.body.assetRef, req.body.ownedByRef, req.body.maintainedByRef, req.body.name, req.body.description, req.body.operational, req.body.operationalStarDate, req.body.operationalEndDate, req.body.locationType, req.body.area, req.body.pin ]
        }
    }

    repository.postRoster(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } POST roster v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } POST roster v${ version }`);
            next(null, res);
        }
    });
};

const getRosters = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { rules: { roles: ['user'] } }
        }
    }

    repository.getRosters(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } GET rosters v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } GET rosters v${ version }`);
            next(null, res);
        }
    });
};

const getRoster = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { rules: { roles: ['user'] } }
        }
    }

    repository.getAsset(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } GET roster v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } GET roster v${ version }`);
            next(null, res);
        }
    });
};

const patchRoster = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { rules: { roles: ['superuser', 'administrator'] } },
            values: req.body
            // values: [ req.body.assetRef, req.body.ownedByRef, req.body.maintainedByRef, req.body.name, req.body.description, req.body.operational, req.body.operationalStarDate, req.body.operationalEndDate, req.body.locationType, req.body.area, req.body.pin ]
        }
    }

    repository.patchRoster(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } PATCH roster v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } PATCH roster v${ version }`);
            next(null, res);
        }
    });
};

module.exports = {
    postRoster: postRoster,
    getRosters: getRosters,
    getRoster: getRoster,
    patchRoster: patchRoster
}