const controller = require('../controller/location');
const config = require('../../config/config');
const service = config.get('service');
const version = config.get('version');

module.exports = (app) => {

    app.get('/' + service + '/api/' + version, (req, res) => {
        res.status(200).send({'msg': 'Server is up!'});
    });

    app.post('/' + service + '/api/' + version + '/location', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.post(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.get('/' + service + '/api/' + version + '/locations', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getLocations(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.get('/' + service + '/api/' + version + '/location', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getLocation(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.patch('/' + service + '/api/' + version + '/location', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.patch(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.get('/' + service + '/api/' + version + '/locationlist', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getlLocationList(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });
}