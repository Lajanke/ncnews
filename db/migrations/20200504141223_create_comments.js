
exports.up = function(knex) {
    return knex.schema.createTable('comments', (commentsTable) => {
        console.log('creating comments tabele');
        commentsTable.increments('comment_id').primary();
        commentsTable.string('author');
        commentsTable.foreign('author').references('users.username');
        commentsTable.integer('article_id');
        commentsTable.foreign('article_id').references('articles.article_id');
        commentsTable.integer('votes').defaultTo(0);
        commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
        commentsTable.string('body', 3000).notNullable();
    });
};

exports.down = function(knex) {
    console.log('dropping comments table')
    return knex.schema.dropTable('comments');
};
