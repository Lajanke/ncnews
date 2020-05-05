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
            test('Returns an array in the body with a length of 3', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.topics.length).toBe(3);
                    });
            });
            test('', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then((res) => {
                        res.body.topics.forEach(topic => {
                            expect(topic).toHaveProperty('slug');
                            expect(topic).toHaveProperty('description');
                        });
                    });
            });
            test('Returns an array of objects with number of keys equal to columns in topics table', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then((res) => {
                        expect(Object.keys(res.body.topics[0]).length).toBe(2);
                    });
            });
            test('Returns topics ordered alphabetically by slug', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.topics).toBeSortedBy('slug');
                    });
            });
        });
    });
    describe.only('/users/:username', () => {
        describe('GET', () => {
            test('Status 200: Only one user returned. Returns array in the body with a length of 1', () => {
                return request(app)
                    .get('/api/users/butter_bridge')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.user.length).toBe(1);
                    });
            });
        });
    });
});