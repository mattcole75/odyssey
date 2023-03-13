const config = require('../../services/location/config/config');
const service = config.get('service');
const version = config.get('version');

const supertest = require('supertest');
const baseUrl = 'http://localhost:9791/' + service + '/api/' + version;

const endPoint = supertest(baseUrl);

module.exports = endPoint;