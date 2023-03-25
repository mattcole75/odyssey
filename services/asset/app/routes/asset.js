const controller = require('../controller/asset');
const config = require('../../config/config');
const service = config.get('service');
const version = config.get('version');

module.exports = (app) => {

    app.get('/' + service + '/api/' + version, (req, res) => {
        res.status(200).send({'msg': 'Server is up!'});
    });

    app.post('/' + service + '/api/' + version + '/asset', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.postAsset(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.get('/' + service + '/api/' + version + '/assets', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getAssets(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });
    app.get('/' + service + '/api/' + version + '/childassets', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getChildAssets(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.get('/' + service + '/api/' + version + '/asset', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getAsset(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.patch('/' + service + '/api/' + version + '/asset', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.patchAsset(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.patch('/' + service + '/api/' + version + '/assetlocation', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.patchAssetLocation(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });
};