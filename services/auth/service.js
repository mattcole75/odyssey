'use strict';
const dotenv = require('dotenv').config();
const database = require('./configuration/database');
const config = require('./configuration/config');
const service = config.get('service');
const express = require('./configuration/express');

if(dotenv.error) {
    console.log(dotenv.error);
    process.exit(1);
}

const PORT = process.env.PORT;

const app = express();

database.connectToServer((err) => {
    if (err) {
        console.error(err);
        process.exit();
    } else {
        app.listen(PORT, () => {
            console.log(service + ` api is running on port: ${PORT}`);
        });
    }
});