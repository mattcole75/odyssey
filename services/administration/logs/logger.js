const bunyan = require('bunyan');
const config = require('../config/config');
const service = config.get('service');
const logPath = config.get('logPath');

const createLogger = () => {

    const logger = bunyan.createLogger({
        name: service,
        streams: [{
            path: logPath,
        }]
    });

    return logger;
};

module.exports = createLogger;