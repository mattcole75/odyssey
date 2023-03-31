const controller = require('../controller/roster');
const config = require('../../config/config');
const service = config.get('service');
const version = config.get('version');

module.exports = (app) => {

    app.get('/' + service + '/api/' + version, (req, res) => {
        res.status(200).send({'msg': 'Server is up!'});
    });

    app.post('/' + service + '/api/' + version + '/roster', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.postRoster(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.get('/' + service + '/api/' + version + '/rosters', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getRosters(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.get('/' + service + '/api/' + version + '/roster', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.getRoster(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });

    app.patch('/' + service + '/api/' + version + '/roster', (req, res) => {
        res.set('Content-Type', 'application/json');
        controller.patchRoster(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });
};