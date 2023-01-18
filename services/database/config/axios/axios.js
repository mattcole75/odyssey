const axios = require('axios');
const config = require('../../../../configuration/config');

const uri = config.get('auth.uri');

const instance = axios.create({
    baseURL: uri,
    timeout: 1000
  });

module.exports = instance;