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
            test('Status 200: Returns an array in the body with a length of 3', () => {
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
    describe.only('/articles', () => {
        describe('GET', () => {
            test('Status 200: Only one article returned. Returns array in the body with a length of 1', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article.length).toBe(1);
                    });
            });
            test('Returned article has certain properties', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article[0]).toHaveProperty('article_id');
                        expect(res.body.article[0]).toHaveProperty('title');
                        expect(res.body.article[0]).toHaveProperty('body');
                        expect(res.body.article[0]).toHaveProperty('votes');
                        expect(res.body.article[0]).toHaveProperty('topic');
                        expect(res.body.article[0]).toHaveProperty('author');
                        expect(res.body.article[0]).toHaveProperty('created_at');
                        expect(res.body.article[0]).toHaveProperty('comment_count');
                    });
            });
            test('Returned article does not return more columns/properties than it should.', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then((res) => {
                        expect(Object.keys(res.body.article[0]).length).toBe(8);
                    });
            });
            test('Works for an article with 0 comments', () => {
                return request(app)
                    .get('/api/articles/12')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article).toEqual([{
                            article_id: 12,
                            title: 'Moustache',
                            body: 'Have you seen the size of that thing?',
                            votes: 0,
                            topic: 'mitch',
                            author: 'butter_bridge',
                            created_at: '1974-11-26T12:21:54.171Z',
                            comment_count: '0'
                        }]);
                    });
            });
        });
    });
});
