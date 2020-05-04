
exports.up = function(knex) {
    return knex.schema.createTable('articles', (articlesTable) => {
        console.log('creating articles tabele')
        articlesTable.increments('article_id').primary();
        articlesTable.string('title').notNullable();
        articlesTable.string('body', 3000).notNullable();
        articlesTable.integer('votes').defaultTo(0);
        articlesTable.string('topic');
        articlesTable.string('author');
        articlesTable.foreign('topic').references('topics.slug');
        articlesTable.foreign('author').references('users.username');
        articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    console.log('dropping articles table')
    return knex.schema.dropTable('articles');
};
