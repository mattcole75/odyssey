const dotenv = require('dotenv').config();
const database = require('./config/database');
const config = require('./config/config');
const service = config.get('service');
const port = config.get('port');
const express = require('./config/express');

if(dotenv.error) {
    console.log(dotenv.error);
    ProcessingInstruction.exit(1);
}

const app = express();

database.connect(err => {
    if(err) {
      console.log('Database connection failed: ', err);
      process.exit(1);
    }
    else {
        app.listen(port, () => {
            console.log(service + ' service is running on port: ' + port);
        });
    }
});