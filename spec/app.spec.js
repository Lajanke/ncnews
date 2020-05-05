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
            test('Status: Returns an array in the body with a length of 3', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.topics.length).toBe(3);
                    });
            });
            test('Has properties equal to table column titles', () => {
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
    describe('/users/:username', () => {
        describe('GET', () => {
            test('Status 200: Only one user returned. Returns array in the body with a length of 1', () => {
                return request(app)
                    .get('/api/users/butter_bridge')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.user.length).toBe(1);
                    });
            });
            test('Has properties equal to table column titles', () => {
                return request(app)
                    .get('/api/users/icellusedkars')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.user[0]).toHaveProperty('username');
                        expect(res.body.user[0]).toHaveProperty('avatar_url');
                        expect(res.body.user[0]).toHaveProperty('avatar_url');
                    });
            });
            test('Returns an array of objects with number of keys equal to columns in topics table', () => {
                return request(app)
                    .get('/api/users/rogersop')
                    .expect(200)
                    .then((res) => {
                        expect(Object.keys(res.body.user[0]).length).toBe(3);
                    });
            });
            test('Returns correct content for url and name', () => {
                return request(app)
                    .get('/api/users/lurker')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.user[0].avatar_url).toBe('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png');
                        expect(res.body.user[0].name).toBe('do_nothing')
                    });
            });
        });
    });
});
