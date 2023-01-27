const config = require('../../services/administration/config/config');
const service = config.get('service');
const version = config.get('version');

const supertest = require('supertest');
const orgUrl = 'http://localhost:8791/' + service + '/api/' + version;

const admin = supertest(orgUrl);

module.exports = admin;