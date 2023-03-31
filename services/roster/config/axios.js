const axios = require('axios');
const config = require('../../../config/config');

const uri = config.get('dbService.uri');

const instance = axios.create({
    baseURL: uri,
    timeout: 1000
  });

module.exports = instance;