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
            rules: { roles: ['superuser', 'administrator'] },
            values: req.body
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
        headers: { ...req.headers, rules: { roles: ['user' ] } }
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

const getContainedAssets = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: { ...req.headers, rules: { roles: ['user'] } }
    }

    repository.getContainedAssets(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } GET contained assets v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } GET contained assets v${ version }`);
            next(null, res);
        }
    });
};

const getAsset = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: { ...req.headers, rules: { roles: ['user'] } }
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
            rules: { roles: ['superuser', 'administrator'] },
            values: req.body
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

const patchAssetLocationMap = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: { 
            rules: { roles: ['superuser', 'administrator'] },
            values:  req.body 
        }
    }

    repository.patchAssetLocationMap(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } PATCH asset location v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } PATCH asset location v${ version }`);
            next(null, res);
        }
    });
};

const patchAssetReallocate = (req, next) => {

    const request = {
        headers: req.headers,
        body: {
            rules: { roles: ['superuser', 'administrator'] },
            values: req.body
        }
    };

    repository.patchAssetReallocate(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } PATCH asset assetRef v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } PATCH asset assetRef v${ version }`);
            next(null, res);
        }
    });
};

const deleteAsset = (req, next) => {
    const request = {
        headers: req.headers,
        body: {
            rules: { roles: ['administrator'] }
        }
    };

    repository.deleteAsset(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } DELETE asset v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } DELETE asset v${ version }`);
            next(null, res);
        }
    });
};

const reinstateAsset = (req, next) => {
    const request = {
        headers: req.headers,
        body: {
            rules: { roles: ['administrator'] }
        }
    };

    repository.reinstateAsset(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } REINSTATE asset v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } REINSTATE asset v${ version }`);
            next(null, res);
        }
    });
};

const deleteContainedAsset = (req, next) => {
    const request = {
        headers: req.headers,
        body: {
            rules: { roles: ['administrator'] }
        }
    };

    repository.deleteContainedAsset(request, (err, res) => {
        if(err) {
            log.error(`status: ${ err.status } DELETE contained asset v${ version } result: ${ JSON.stringify(err) }`);
            next(err, null);
        } else {
            log.info(`status: ${ res.status } DELETE contained asset v${ version }`);
            next(null, res);
        }
    });
};

module.exports = {
    postAsset: postAsset,
    getAssets: getAssets,
    getContainedAssets: getContainedAssets,
    getAsset: getAsset,
    patchAsset: patchAsset,
    patchAssetLocationMap: patchAssetLocationMap,
    patchAssetReallocate: patchAssetReallocate,
    deleteAsset: deleteAsset,
    reinstateAsset: reinstateAsset,
    deleteContainedAsset: deleteContainedAsset
}