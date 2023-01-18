const supertest = require('supertest');
const authUrl = 'http://localhost:5791/auth/api/0.1'

const auth = supertest(authUrl);

module.exports = auth;