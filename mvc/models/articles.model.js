const connection = require('../../connection.js');

const fetchArticle = (id) => {
    return connection('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .select('articles.*')
        .count('comments.article_id as comment_count')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', id)
        .then((res) => {
            if (res.length === 0) {
                throw { code: 'ARTICLE NOT FOUND' }
            } else {
                return res[0];
            }
        });
};

const alterVotes = (id, newVotes = 0, num) => {
    if (num > 1) {
        throw { code: 'TOO MANY PROPERTIES' };
    };
    return connection('articles')
        .where('article_id', '=', id)
        .increment('votes', newVotes)
        .then(() => {
            const res = fetchArticle(id);
            return res;
        });
};

const postNewComment = (id, username, body, num) => {
    if (body === '') {
        throw { code: 'NO BODY' };
    };
    if (num > 2) {
        throw { code: 'TOO MANY PROPERTIES' };
    };
    const newComment = { article_id: id, author: username, body: body };
    return connection('comments')
        .insert(newComment)
        .returning('*')
        .then((res) => {
            return res[0];
        });
};

const fetchArticleComments = (id, sort_by = 'created_at', order = 'desc', p = 1, limit = 10) => {
    if (order !== 'asc' && order !== 'desc') {
        throw { code: 'INVALID ORDER' };
    };
    return connection('comments')
        .where('article_id', '=', id)
        .select('comment_id', 'author', 'votes', 'created_at', 'body')
        .orderBy(sort_by, order)
        .limit(limit)
        .offset((p - 1) * limit)
        .then((res) => {
            if (res.length === 0) {
                return connection('articles')
                    .where('article_id', '=', id)
                    .then((result) => {
                        if (result.length === 0) {
                            throw { code: 'ARTICLE NOT FOUND' }
                        } else {
                            return res
                        }
                    })
            } else {
                return res;
            }
        });
};

const fetchAllArticles = (sort_by = 'created_at', order = 'desc', author, topic, p = 1, limit = 10) => {
    if (order !== 'asc' && order !== 'desc') {
        throw { code: 'INVALID ORDER' };
    };
    return connection('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
        .count('comments.article_id as comment_count')
        .groupBy('articles.article_id')
        .orderBy(sort_by, order)
        .modify(query => {
            if (author) query.where('articles.author', '=', author);
            if (topic) query.where('articles.topic', '=', topic);
        })
        .limit(limit)
        .offset((p - 1) * limit)
        .then((res) => {
            if (res.length === 0) {
                throw { code: 'NO ARTICLES WITH PROP' }
            }
            return res;
        });
};

const postNewArticle = (article) => {
    return connection('articles')
        .insert(article)
        .returning('*')
        .then((res) => {
            return res[0];
        });
};

const deleteArticleById = (id) => {
    return connection('articles')
        .where('article_id', '=', id)
        .del()
        .then((res) => {
            if (res === 0) {
                throw { code: 'ARTICLE NOT FOUND' }
            } else {
                return res[0];
            }
        });
}

module.exports = {
    fetchArticle,
    alterVotes,
    postNewComment,
    fetchArticleComments,
    fetchAllArticles,
    postNewArticle,
    deleteArticleById,
}