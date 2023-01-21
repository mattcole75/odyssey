'use strict';
require('dotenv').config({ path: './config.env' });
const database = require('./config/database');
const config = require('./config/config');
const service = config.get('service');
const express = require('./config/express');


const PORT = process.env.PORT || 1337;

const app = express();

database.connectToServer((err) => {
    if (err) {
        console.error(err);
        process.exit();
    } else {
        app.listen(PORT, () => {
            console.log(service + ` server is running on port: ${PORT}`);
        });
    }
});