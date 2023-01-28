const controller = require('../controller/rdbms');
const config = require('../../config/config');
const service = config.get('service');
const version = config.get('version');

module.exports = (app) => {
    app.get('/' + service + '/api/' + version, (req, res) => {
        res.status(200).send({'msg': 'Server is up!'});
    });

    app.post('/' + service + '/api/' + version + '/post', (req, res) => {
        controller.post(req, (err, result) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(result.status).send(result);
        });
    });

    app.get('/' + service + '/api/' + version + '/get', (req, res) => {
        controller.get(req, (err, result) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(result.status).send(result);
        });
    });
};