const repository = require('../repository/asset');
const log = require('../../logs/logger')();
const config = require('../../config/config');
const version = config.get('version');

const postAsset = (req, next) => {

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

    repository.postAsset(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } POST asset v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } POST asset v${ version }`);
            next(null, res);
        }
    });
};

const getAssets = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { rules: { roles: ['user'] } }
        }
    }

    repository.getAssets(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } GET assets v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } GET assets v${ version }`);
            next(null, res);
        }
    });
};

const getAsset = (req, next) => {

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
            log.error(`status: ${ err.status } GET asset v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } GET asset v${ version }`);
            next(null, res);
        }
    });
};

const patchAsset = (req, next) => {

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

    repository.patchAsset(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } PATCH asset v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } PATCH asset v${ version }`);
            next(null, res);
        }
    });
};

module.exports = {
    postAsset: postAsset,
    getAssets: getAssets,
    getAsset: getAsset,
    patchAsset: patchAsset
}