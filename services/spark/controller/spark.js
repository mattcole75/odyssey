const repository = require('../repository/spark');
const log = require('../shared/logger')();
const config = require('../config/config');
const version = config.get('version');
const moment = require('moment');

const postSensorData = (req, next) => {

    const data = [];

    req.body.forEach(event => {
        data.push({ ...event, timestamp: new Date(req.body.eventTimestamp)})
    });

    repository.postSensorData(data, (err, data) => {
        if(err) {
            log.error(`status: ${err.status} POST (postSensorData) v${version} failed error: ${err}`);
            next({ status: err.status, msg: 'Internal Server Error' }, null);
        } else {
            log.info(`status: ${data.status} POST (postSensorData) v${version} success`);
            next(null, data);
        }
    });
};

const getSensorData = (req, next) => {
    repository.getSensorData(req, (err, data) => {
        if(err) {
            log.error(`status: ${err.status} GET (getSensorData) v${version} failed error: ${err}`);
            next({ status: err.status, msg: 'Internal Server Error' }, null);
        } else {
            log.info(`status: ${data.status} GET (getSensorData) v${version} success`);
            next(null, data);
        }
    });
};

const getSensorDatAaggregate = (req, next) => {
    repository.getSensorDatAaggregate(req, (err, data) => {
        if(err) {
            log.error(`status: ${err.status} GET (getSensorDatAaggregate) v${version} failed error: ${err}`);
            next({ status: err.status, msg: 'Internal Server Error' }, null);
        } else {
            log.info(`status: ${data.status} GET (getSensorDatAaggregate) v${version} success`);
            next(null, data);
        }
    });
};

const postPointData = (req, next) => {

    let data = {
        ...req.body,
        timestamp: new Date()
    }

    repository.postPointData(data, (err, data) => {
        if(err) {
            log.error(`status: ${err.status} POST (postPointData) v${version} failed error: ${err}`);
            next({ status: err.status, msg: 'Internal Server Error' }, null);
        } else {
            log.info(`status: ${data.status} POST (postPointData) v${version} success`);
            next(null, data);
        }
    });
};

module.exports = {
    getSensorData: getSensorData,
    postSensorData: postSensorData,
    getSensorDatAaggregate: getSensorDatAaggregate,
    postPointData: postPointData
}