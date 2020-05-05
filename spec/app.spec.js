process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app.js');
const connection = require('../connection.js');

describe('/api', () => {
    beforeEach(() => {
        return connection.seed.run()
    });
    afterAll(() => {
        return connection.destroy();
    });
    describe('/topics', () => {
        describe('GET', () => {
            test('', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.topics).toEqual([])
                    });
            })
        });
    });
});