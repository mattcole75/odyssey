const controller = require('../controller/spark');
const access = require('../controller/access');
const config = require('../config/config');
const service = config.get('service');
const version = config.get('version');

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.status(200).send({'msg': 'Server is up!'});
    });

    app.post('/' + service + '/api/' + version + '/sensordata', (req, res) => {

        res.set('Content-Type', 'application/json');

        access.authenticate(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                controller.postSensorData(req, (err, data) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(data.status).send(data);
              });
            }
        });
    });

    app.get('/' + service + '/api/' + version + '/sensordata', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        access.authenticate(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                controller.getSensorData(req, (err, data) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(data.status).send(data);
                });
            }
          });
    });

    app.get('/' + service + '/api/' + version + '/sensordataaaggregate', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        access.authenticate(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                controller.getSensorDatAaggregate(req, (err, data) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(data.status).send(data);
                });
            }
          });
    });

    app.post('/' + service + '/api/' + version + '/pointdata', (req, res) => {

        res.set('Content-Type', 'application/json');

        access.authenticate(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                controller.postPointData(req, (err, data) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(data.status).send(data);
              });
            }
        });
    });
};