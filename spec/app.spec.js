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
    test('Status 200: Returns an array in the body with a length of 3', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then((res) => {
                expect(typeof res).toBe('object');
                expect(res.body).toHaveProperty('endpoints');
            });
    });
    test('Status 404: Misspelled path', () => {
        return request(app)
            .get('/api/not_a_path')
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Path not found');
            });
    });
    test('Status 405: Method not allowed', () => {
        const invalidMethods = ['post', 'patch', 'delete']
        const requests = invalidMethods.map(method => {
            return request(app)[method]('/api')
                .expect(405)
                .then((res) => {
                    expect(res.body.msg).toBe('Method not allowed')
                });
        });
        return Promise.all(requests);
    });
    describe('/topics', () => {
        describe('GET', () => {
            test('Status 200: Returns an array in the body with a length of 3, defaults to 10', () => {
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
            test('Status 404: When passed pagination query further than results returns not found', () => {
                return request(app)
                    .get('/api/topics?p=2&limit=10')
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('Not found');
                    });
            });
        });
    });
    describe('/users/:username', () => {
        describe('GET', () => {
            test('Has properties equal to table column titles and no more', () => {
                return request(app)
                    .get('/api/users/icellusedkars')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.user).toHaveProperty('username');
                        expect(res.body.user).toHaveProperty('avatar_url');
                        expect(res.body.user).toHaveProperty('name');
                        expect(Object.keys(res.body.user).length).toBe(3);
                    });
            });
            test('Returns correct content for url and name', () => {
                return request(app)
                    .get('/api/users/lurker')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.user.avatar_url).toBe('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png');
                        expect(res.body.user.name).toBe('do_nothing');
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
            test('Status 200: Returned article has certain properties', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article).toHaveProperty('author');
                        expect(res.body.article).toHaveProperty('title');
                        expect(res.body.article).toHaveProperty('article_id');
                        expect(res.body.article).toHaveProperty('topic');
                        expect(res.body.article).toHaveProperty('created_at');
                        expect(res.body.article).toHaveProperty('votes');
                        expect(res.body.article).toHaveProperty('comment_count');
                        expect(res.body.article.comment_count).toEqual('13');
                    });
            });
            test('Returned article does not return more columns/properties than it should.', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then((res) => {
                        expect(Object.keys(res.body.article).length).toBe(8);
                    });
            });
            test('Works for an article with 0 comments', () => {
                return request(app)
                    .get('/api/articles/12')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article).toEqual({
                            article_id: 12,
                            title: 'Moustache',
                            body: 'Have you seen the size of that thing?',
                            votes: 0,
                            topic: 'mitch',
                            author: 'butter_bridge',
                            created_at: '1974-11-26T12:21:54.171Z',
                            comment_count: '0'
                        });
                    });
            });
        });
        describe('PATCH', () => {
            test('Status: 200. Increases votes when passed positive integer', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send({ inc_votes: 1 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article.votes).toBe(1);
                    });
            });
            test('Status: 200. decreases votes when passed negative integer', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: -50 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article.votes).toBe(50);
                    });
            });
            test('Status: 200. Returns article in the same format as get request', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: -50 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article).toHaveProperty('comment_count');
                    });
            });
            test('Status: 200. When passed nothing in the req body returns unchanged article', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send()
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article.votes).toBe(0);
                    });
            });
            test('Status 200. When passed an object without a key of inc_votes returns the article unchanged', () => {
                return request(app)
                    .patch('/api/articles/12')
                    .send()
                    .expect(200)
                    .then((res) => {
                        expect(res.body.article.votes).toBe(0);
                    });
            });
        });
        describe('DELETE', () => {
            test('Status 204: Deletes article with given id', () => {
                return request(app)
                    .del('/api/articles/9')
                    .expect(204)
                    .then(() => {
                        return request(app)
                            .get('/api/articles/9/comments')
                            .expect(404)
                            .then((res) => {
                                expect(res.body.msg).toBe('No article with this ID found');
                            });
                    });
            });
        });
        describe('errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['post',]
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
                    .send({ inc_votes: 1 })
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('No article with this ID found')
                    });
            });
            test('PATCH: Status 400: Article id is invalid', () => {
                return request(app)
                    .patch('/api/articles/not_a_real_id')
                    .send({ inc_votes: 1 })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request')
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
            test('Status 404: When passed an article id that does not exist returns not found', () => {
                return request(app)
                    .del('/api/articles/200')
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('No article with this ID found')
                    });
            });
            test('Status 400: When passed an incorrect id returns bad request', () => {
                return request(app)
                    .del('/api/articles/cat')
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request')
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
                        expect(res.body.comment.body).toBe('I have posted.');
                        return request(app)
                            .get('/api/articles/1')
                            .then((res) => {
                                expect(res.body.article.comment_count).toBe('14');
                            });
                    });
            });
            test('status 201, posts comment to article', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker', body: 'I have posted.' })
                    .expect(201)
                    .then((res) => {
                        expect(res.body.comment).toHaveProperty('comment_id');
                        expect(res.body.comment).toHaveProperty('author');
                        expect(res.body.comment).toHaveProperty('body');
                        expect(res.body.comment).toHaveProperty('votes');
                        expect(res.body.comment).toHaveProperty('created_at');
                    });
            });
        });
        describe('GET', () => {
            test('status 200: Returns all comments for a given article id, defaults to 10 results', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comments.length).toBe(10);
                    });
            });
            test('status 200: Each comment has certain keys. And only 5 keys.', () => {
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
            test('Returns empty array if article exists but has no comments', () => {
                return request(app)
                    .get('/api/articles/2/comments')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comments).toEqual([]);
                    });
            });
            describe('pagination', () => {
                test('Defaults to return only 10 results per page', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then((res) => {
                            expect((res.body.comments).length).toBe(10);
                        });
                });
                test('Returns only 10 results offest by number of \(pages - 1\) times limit', () => {
                    return request(app)
                        .get('/api/articles/1/comments?p=2&limit=10')
                        .expect(200)
                        .then((res) => {
                            expect((res.body.comments).length).toBe(3);
                            expect(res.body.comments[0]).toEqual({
                                comment_id: 12,
                                author: 'icellusedkars',
                                votes: 0,
                                created_at: '2006-11-25T12:36:03.389Z',
                                body: 'Massive intercranial brain haemorrhage'
                            });
                        });
                });
                test('Staus 200: Serves up an empty array when pagination is further along that results length', () => {
                    return request(app)
                        .get('/api/articles/1/comments?p=4&limit=10')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.comments).toEqual([]);
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
                const invalidMethods = ['patch', 'delete',]
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
                    .send({ username: 'luke', body: 'I am luke' })
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('Not found');
                    });
            });
            test('POST: 400. When passed an object without username key returns bad request', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ body: 'I am not luke' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('POST: 400. When passed an object without body key returns bad request', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('POST: 400. When passed an object with body of empty string returns a custom message', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker', body: '' })
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
            test('POST: 400. When passed extra items in the body returns bad request', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'lurker', body: 'I am not Luke', pets: 'cat' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request, cannot update extra fields');
                    });
            });
        });
    });
    describe('/articles', () => {
        describe('GET', () => {
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
            describe('pagination', () => {
                test('Returns only 10 results per page', () => {
                    return request(app)
                        .get('/api/articles?p=1&limit=10')
                        .expect(200)
                        .then((res) => {
                            expect((res.body.articles).length).toBe(10);
                        });
                });
                test('Returns only 10 results offest by numeber of \(pages - 1\) times limit', () => {
                    return request(app)
                        .get('/api/articles?p=2&limit=10')
                        .expect(200)
                        .then((res) => {
                            expect((res.body.articles).length).toBe(2);
                            expect(res.body.articles[0]).toEqual({
                                author: 'icellusedkars',
                                title: 'Am I a cat?',
                                article_id: 11,
                                topic: 'mitch',
                                created_at: '1978-11-25T12:21:54.171Z',
                                votes: 0,
                                comment_count: '0'
                            });
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

                test('Queries: If passed an author query that has no articles returns 200 and empty array', () => {
                    return request(app)
                        .get('/api/articles?author=lurker')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles).toEqual([]);
                        });
                });
                test('Queries: Accepts a topic query and then filters for the matching username, defaults to 10 results', () => {
                    return request(app)
                        .get('/api/articles?topic=mitch')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBe(10);
                            res.body.articles.forEach(article => {
                                expect(article.topic).toBe('mitch');
                            });
                        });
                });
                test('Queries: If passed a topic query that has no articles returns 200 and empty array', () => {
                    return request(app)
                        .get('/api/articles?topic=paper')
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles).toEqual([]);
                        });
                });
            })
        });
        describe('POST', () => {
            test('status 201, posts a new article', () => {
                return request(app)
                    .post('/api/articles/')
                    .send({ author: 'lurker', title: 'Where are all the meows', topic: 'cats', body: 'Why isn\'t there more cats.' })
                    .expect(201)
                    .then((res) => {
                        expect(res.body.article.body).toBe('Why isn\'t there more cats.');
                        expect(res.body.article.article_id).toBe(13);
                        expect(res.body.article.votes).toBe(0);
                        expect(res.body.article.title).toBe('Where are all the meows');
                        expect(res.body.article.topic).toBe('cats');
                        expect(res.body.article.author).toBe('lurker');
                        expect(res.body.article).toHaveProperty('created_at');
                    });
            });
        });
        describe('errors', () => {
            test('Status 405: Method not allowed', () => {
                const invalidMethods = ['patch', 'delete',]
                const requests = invalidMethods.map(method => {
                    return request(app)[method]('/api/articles')
                        .expect(405)
                        .then((res) => {
                            expect(res.body.msg).toBe('Method not allowed')
                        })
                })
                return Promise.all(requests);
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
                        expect(res.body.msg).toBe('User does not exist');
                    });
            });
            test('GET: status 400: Bad request, when passed a topic that does not exist', () => {
                return request(app)
                    .get('/api/articles?topic=not_a_topic')
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('POST: Staus 404: When passed a username that doesn\'t exist returns not found', () => {
                return request(app)
                    .post('/api/articles/')
                    .send({ author: 'not_a_user', title: 'Where are all the meows', topic: 'cats', body: 'Why isn\'t there more cats.' })
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toEqual('Not found')
                    });
            });
            test('POST: Staus 404: When passed a username that doesn\'t exist returns not found', () => {
                return request(app)
                    .post('/api/articles/')
                    .send({ author: 'lurker', title: 'Where are all the meows', topic: 'not_a_topic', body: 'Why isn\'t there more cats.' })
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toEqual('Not found')
                    });
            });
            test('POST: Staus 400: When passed nothing in the body returns bad request', () => {
                return request(app)
                    .post('/api/articles/')
                    .send({})
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toEqual('Bad request')
                    });
            });
            test('POST: Staus 400: When passed nothing in the body returns bad request', () => {
                return request(app)
                    .post('/api/articles/')
                    .send({ author: 'lurker', title: 'Where are all the meows', body: 'Why isn\'t there more cats.' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toEqual('Bad request')
                    });
            });
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
                        expect(res.body.comment).toHaveProperty('article_id');
                        expect(res.body.comment).toHaveProperty('author');
                        expect(res.body.comment).toHaveProperty('body');
                        expect(res.body.comment).toHaveProperty('comment_id');
                        expect(res.body.comment).toHaveProperty('created_at');
                        expect(res.body.comment).toHaveProperty('votes');
                    });
            });
            test('Status: 200. Increases votes when passed positive integer', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 3 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment.votes).toBe(19);
                    });
            });
            test('Status: 200. decreases votes when passed negative integer', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: -5 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment.votes).toBe(11);
                    });
            });
            test('Status: 200. Works for different ids', () => {
                return request(app)
                    .patch('/api/comments/3')
                    .send({ inc_votes: -5 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment.votes).toBe(95);
                    });
            });
            test('PATCH: 200. When passed an object without a key of inc_votes returns the comment unchanged', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ cat: 1 })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.comment.votes).toBe(16);
                    });
            });
        });
        describe('DELETE', () => {
            test('Deletes comment with matching id', () => {
                return request(app)
                    .del('/api/comments/1')
                    .expect(204)
                    .then(() => {
                        return request(app)
                            .get('/api/articles/9/comments')
                            .expect(200)
                            .then((res) => {
                                expect(res.body.comments.length).toBe(1);
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
            test('PATCH: Status 404: Comment id does not exist', () => {
                return request(app)
                    .patch('/api/comments/200')
                    .send({ inc_votes: 1 })
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toBe('No comment with this ID found')
                    });
            });
            test('PATCH: Status 400: Comment id is invalid', () => {
                return request(app)
                    .patch('/api/comments/not_a_real_id')
                    .send({ inc_votes: 1 })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request')
                    });
            });
            test('PATCH: 400. When passed an object with a key of inc_votes but invalid value returns bad request', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 'cat' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request');
                    });
            });
            test('PATCH: 400. When passed an object with a key of inc_votes and extra properties returns bad request', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 1, name: 'mitch' })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request, cannot update extra fields');
                    });
            });
            test('DELETE: Status 404: Comment id does not exist', () => {
                return request(app)
                    .del('/api/comments/200')
                    .expect(404)
                    .then((res) => {
                        expect(res.body.msg).toEqual('No comment with this ID found')
                    });
            });
            test('DELETE: Status 400: Comment id is invalid', () => {
                return request(app)
                    .patch('/api/comments/not_a_real_id')
                    .send({ inc_votes: 1 })
                    .expect(400)
                    .then((res) => {
                        expect(res.body.msg).toBe('Bad request')
                    });
            });
        });
    });
});
