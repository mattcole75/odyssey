const controller = require('../controller/asset');
const config = require('../config/app/config');
const service = config.get('service');
const version = config.get('version');

module.exports = (app) => {

    app.post('/' + service + '/api/' + version + '/asset', (req, res) => {
        
        res.set('Content-Type', 'application/json');
        
        controller.createAsset(req, (err, response) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(response.status).send(response);
        });
    });
};