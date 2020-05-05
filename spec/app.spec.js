process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app.js');
const connection = require('../connection.js');


beforeEach(() => {
    return connection.seed.run()
});

afterAll(() => {
    connection.destroy();
});

describe('api', () => {
   
})