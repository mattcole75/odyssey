const supertest = require('supertest');
const baseUrl = 'http://localhost:7791/';

const endPoint = supertest(baseUrl);

module.exports = endPoint;