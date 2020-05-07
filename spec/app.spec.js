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
    test('Status 404: Misspelled path', () => {
        return request(app)
            .get('/api/not_a_path')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Path not found');
            });
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
        describe('Errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['post', 'patch', 'delete',]
                const requests = invalidMethods.map(method => {
                  return request(app)[method]('/api/topics')
                  .expect(405)
                  .then((res) => {
                    expect(res.body.msg).toBe('Method not allowed')
                  })
                })
                return Promise.all(requests);
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
        describe('errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['post', 'patch', 'delete',]
                const requests = invalidMethods.map(method => {
                  return request(app)[method]('/api/users/butter_bridge')
                  .expect(405)
                  .then((res) => {
                    expect(res.body.msg).toBe('Method not allowed')
                  })
                })
                return Promise.all(requests);
            });
            test('Status 404: User does not exist', () => {
                return request(app)
                    .get('/api/users/not_a_real_user')
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('User does not exist')
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
        describe('errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['post','delete',]
                const requests = invalidMethods.map(method => {
                  return request(app)[method]('/api/articles/1')
                  .expect(405)
                  .then((res) => {
                    expect(res.body.msg).toBe('Method not allowed')
                  })
                })
                return Promise.all(requests);
            });
            test('GET: Status 404: Article does not exist', () => {
                return request(app)
                    .get('/api/articles/200')
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('No article with this ID found')
                    });        
            });
            test('GET: Status 400: Invalid article id', () => {
                return request(app)
                    .get('/api/articles/an_article')
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request')
                    });        
            });
            test('PATCH: Status 404: Article id does not exist', () => {
                return request(app)
                    .patch('/api/articles/200')
                    .send({inc_votes: 1})
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('No article with this ID found')
                    });        
            });
            test('PATCH: Status 400: Article id is invalid', () => {
                return request(app)
                    .patch('/api/articles/not_a_real_id')
                    .send({inc_votes: 1})
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request')
                    });        
            });
            test('PATCH: 400. When passed an object without a key of inc_votes returns bad request', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send({ cat: 1 })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('PATCH: 400. When passed an object with a key of inc_votes but invalid value returns bad request', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send({ inc_votes: 'cat' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('PATCH: 400. When passed an object witht a key of inc_votes and extra properties returns bad request', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send({ inc_votes: 1, name: 'mitch' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request, cannot update extra fields');
                    });
            });
        });
    });
    describe('/articles/:article_id/comments', () => { //NEED TO ADD QUERY ERROR HANDLING
        describe('POST', () => {
            test('status 201, posts comment to article', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker', body: 'I have posted.' })
                    .expect(201)
                    .then((res) => {
                        expect(res.body.comment).toBe('I have posted.');
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
        describe('errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['patch','delete',]
                const requests = invalidMethods.map(method => {
                  return request(app)[method]('/api/articles/1/comments')
                  .expect(405)
                  .then((res) => {
                    expect(res.body.msg).toBe('Method not allowed')
                  })
                })
                return Promise.all(requests);
            });
            test('GET: status 404: Article id does not exist', () => {
                return request(app)
                    .get('/api/articles/200/comments')
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('No article with this ID found');
                    });
            });
            test('GET: status 400: Bad request, invalid article id', () => {
                return request(app)
                    .get('/api/articles/not_a_real_id/comments')
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('GET: status 400: Bad request, when passed a sort_by query for column that does not exist', () => {
                return request(app)
                    .get('/api/articles/1/comments?sort_by=not_a_column')
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('GET: status 400: Bad request, when passed something other than asc/desc for order', () => {
                return request(app)
                    .get('/api/articles/1/comments?order=not_an_order')
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Cannot order items in this way');
                    });
            });
            test('POST: status 404: Article id does not exist', () => {
                return request(app)
                    .post('/api/articles/200/comments')
                    .send({ username: 'lurker', body: 'I have posted.' })
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('Not found');
                    });
            });
            test('POST: status 400: Invalid article id', () => {
                return request(app)
                    .post('/api/articles/cat/comments')
                    .send({ username: 'lurker', body: 'I have posted.' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('POST: 404. When passed a username that does not exist returns not found', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'luke', body: 'I am luke'})
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('Not found');
                    });
            });
            test('POST: 400. When passed an object without username key returns bad request', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ body: 'I am not luke'})
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('POST: 400. When passed an object without body key returns bad request', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker'})
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('POST: 400. When passed an object with body of empty string returns a custom message', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker', body: ''})
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Comment cannot be empty');
                    });
            });
            test('POST: 400. When passed nothing returns bad request', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({})
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('POST: 400. When passed extra items in the body returns bad request', () => {//----------------------------------------
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker', body: 'I am not Luke', pets: 'cat'})
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request, cannot update extra fields');
                    });
            });

        });
    });
    describe('/articles', () => { //ERROR HANDLING NEEDED
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
        describe('errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['post', 'patch', 'delete',]
                const requests = invalidMethods.map(method => {
                  return request(app)[method]('/api/articles')
                  .expect(405)
                  .then((res) => {
                    expect(res.body.msg).toBe('Method not allowed')
                  })
                })
                return Promise.all(requests);
            });
        });
        test('GET: status 400: Bad request, when passed a sort_by query for column that does not exist', () => {
            return request(app)
                .get('/api/articles?sort_by=not_a_column')
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe('Bad request');
                });
        });
        test('GET: status 400: Bad request, when passed something other than asc/desc for order', () => {
            return request(app)
                .get('/api/articles?order=not_an_order')
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe('Cannot order items in this way');
                });
        });
        test('GET: status 400: Bad request, when passed an author that does not exist', () => {
            return request(app)
                .get('/api/articles?author=not_an_author')
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe('No articles found with this property');
                });
        });
        test('GET: status 400: Bad request, when passed a topic that does not exist', () => {
            return request(app)
                .get('/api/articles?topic=not_a_topic')
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe('No articles found with this property');
                });
        });
    });
    describe('/comments/:comment_id', () => {//ERROR HANDLING NEEDED
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
        describe('errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['get', 'post',]
                const requests = invalidMethods.map(method => {
                  return request(app)[method]('/api/comments/:comment_id')
                  .expect(405)
                  .then((res) => {
                    expect(res.body.msg).toBe('Method not allowed')
                  })
                })
                return Promise.all(requests);
            });
        });
    });
});
