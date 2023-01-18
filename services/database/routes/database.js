const controller = require('../controller/database');
const config = require('../config/app/config');
const service = config.get('service');
const version = config.get('version');

module.exports = (app) => {
    app.post('/' + service + '/api/' + version + '/post', (req, res) => {
        controller.post(req, (err, result) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(result.status).send(result);
        });
    });
};