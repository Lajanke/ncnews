process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app.js');
const connection = require('../connection.js');

describe('/api', () => {
    beforeEach(() => {
        return connection.seed.run();
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
                        expect(res.body.user[0].name).toBe('do_nothing');
                    });
            });
        });
    });
    describe('/articles/:article_id', () => {
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
                        expect(res.body.article[0]).toHaveProperty('author');
                        expect(res.body.article[0]).toHaveProperty('title');
                        expect(res.body.article[0]).toHaveProperty('article_id');
                        expect(res.body.article[0]).toHaveProperty('topic');
                        expect(res.body.article[0]).toHaveProperty('created_at');
                        expect(res.body.article[0]).toHaveProperty('votes');
                        expect(res.body.article[0]).toHaveProperty('comment_count');
                        expect(res.body.article[0].comment_count).toEqual('13');
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
        describe('PATCH', () => {
            test('Status: 200. Only 1 article returned in response', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send({ inc_votes: 1 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article.length).toBe(1);
                    });
            });
            test('Status: 200. Increases votes when passed positive integer', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send({ inc_votes: 1 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article[0].votes).toBe(1);
                    });
            });
            test('Status: 200. decreases votes when passed negative integer', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: -50 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article[0].votes).toBe(50);
                    });
            });
            test('Status: 200. Returns article in the same format as get request', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: -50 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article[0]).toHaveProperty('comment_count');
                    });
            });
        });
    });
    describe('/articles/:article_id/comments', () => {
        describe('POST', () => {
            test('status 201, posts comment to article', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker', body: 'I have posted.' })
                    .expect(201)
                    .then((res) => {
                        expect(res.body.comment[0]).toBe('I have posted.');
                        return request(app)
                            .get('/api/articles/1')
                            .then((res) => {
                                expect(res.body.article[0].comment_count).toBe('14');
                            });
                    });
            });

        });
        describe('GET', () => {
            test('status 201: Returns all comments for a given article id', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comments.length).toBe(13);
                    });
            });
            test('status 201: Each comment has certain keys. And only 5 keys.', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then((res) => {
                        res.body.comments.forEach(comment => {
                            expect(comment).toHaveProperty('comment_id');
                            expect(comment).toHaveProperty('votes');
                            expect(comment).toHaveProperty('created_at');
                            expect(comment).toHaveProperty('author');
                            expect(comment).toHaveProperty('body');
                            expect(Object.keys(comment).length).toBe(5);
                        });
                    });
            });
            test('Defaults to be sorted by created_at in descending order', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comments).toBeSortedBy('created_at', {
                            descending: true,
                        });
                    });
            });
            describe('queries', () => {
                test('Queries: Accepts an order query to change to ascending', () => {
                    return request(app)
                        .get('/api/articles/1/comments?order=asc')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.comments).toBeSortedBy('created_at');
                        });
                });
                test('Queries: Accepts a sort_by query', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=votes')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.comments).toBeSortedBy('votes', {
                                descending: true,
                            });
                        });
                });
                test('Queries: Accepts a sort_by and order in one url request', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=votes&order=asc')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.comments).toBeSortedBy('votes');
                        });
                });
            });
        });
    });
    describe('/articles', () => {
        describe('GET', () => {
            test('Status 200: When requesting all articles responds with all', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.articles.length).toBe(12);
                    });
            });
            test('Status 200: All articles have certain keys and no more', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then((res) => {
                        res.body.articles.forEach(article => {
                            expect(article).toHaveProperty('author');
                            expect(article).toHaveProperty('title');
                            expect(article).toHaveProperty('article_id');
                            expect(article).toHaveProperty('topic');
                            expect(article).toHaveProperty('created_at');
                            expect(article).toHaveProperty('votes');
                            expect(article).toHaveProperty('comment_count');
                            expect(Object.keys(article).length).toBe(7);
                        });
                    });
            });
            test('Status 200: Defaults to be sorted by created_at in descending order', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.articles).toBeSortedBy('created_at', {
                            descending: true
                        });
                    });
            });
            describe('queries', () => {
                test('Queries: Accepts an order query to change to ascending', () => {
                    return request(app)
                        .get('/api/articles?order=asc')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles).toBeSortedBy('created_at');
                        });
                });
                test('Queries: Accepts a sort_by query', () => {
                    return request(app)
                        .get('/api/articles?sort_by=votes')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles).toBeSortedBy('votes', {
                                descending: true,
                            });
                        });
                });
                test('Queries: Accepts a sort_by and order in one url request', () => {
                    return request(app)
                        .get('/api/articles?sort_by=votes&order=asc')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles).toBeSortedBy('votes');
                        });
                });
                test('Queries: Accepts an author query and then filters for the matching username', () => {
                    return request(app)
                        .get('/api/articles?author=butter_bridge')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBe(3);
                            res.body.articles.forEach(article => {
                                expect(article.author).toBe('butter_bridge');
                            })
                        });
                });
                test('Queries: Accepts an author query and then filters for the matching username', () => {
                    return request(app)
                        .get('/api/articles?topic=mitch')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBe(11);
                            res.body.articles.forEach(article => {
                                expect(article.topic).toBe('mitch');
                            });
                        });
                });
            })
        });
    });
    describe('/comments/:comment_id', () => {
        describe('PATCH', () => {
            test('Status: 200. Only 1 comment returned in response', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 1 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment.length).toBe(1);
                    });
            });
            test('Status: 200. Increases votes when passed positive integer', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 3 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment[0].votes).toBe(19);
                    });
            });
            test('Status: 200. decreases votes when passed negative integer', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: -5 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment[0].votes).toBe(11);
                    });
            });
            test('Status: 200. Works for different ids', () => {
                return request(app)
                    .patch('/api/comments/3')
                    .send({ inc_votes: -5 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment[0].votes).toBe(95);
                    });
            });
        });
        describe('DELETE', () => {
            test('Deletes comment with matching id', () => {
                return request(app)
                    .del('/api/comments/2')
                    .expect(204)
                    .then(() => {
                        return request(app)
                            .get('/api/articles/1/comments')
                            .expect(200)
                            .then((res) => {
                                expect(res.body.comments.length).toBe(12);
                            });
                    });
            });
        });
    });
});


