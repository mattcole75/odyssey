const config = require('../../services/auth/configuration/config');
const service = config.get('service');
const version = config.get('version');

const supertest = require('supertest');
const authUrl = 'http://localhost:5791/' + service + '/api/' + version;

const auth = supertest(authUrl);

module.exports = auth;