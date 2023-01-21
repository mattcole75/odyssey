let supertest = require('supertest');

const baseUrl = 'http://localhost:1337/';

const endPoint = supertest(baseUrl);

module.exports = endPoint;