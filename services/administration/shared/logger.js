const bunyan = require('bunyan');
const config = require('../config/config');

const logger = () => {

    const logger = bunyan.createLogger({
        name: config.get('service'),
        streams: [{
            path: process.env.LOG_PATH,
        }],
        level: process.env.LOG_LEVEL
    });

    return logger;   
};

module.exports = logger;