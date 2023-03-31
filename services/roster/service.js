// const dotenv = require('dotenv').config();
const config = require('./config/config');
const service = config.get('service');
const port = config.get('port');
const express = require('./config/express');

const app = express();

app.listen(port, () => {
    console.log(service + ' service is running on port: ' + port);
});