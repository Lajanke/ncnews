
exports.up = function(knex) {
    return knex.schema.createTable('users', (usersTable) => {
        usersTable.string('username').primary().notNullable().unique();
        usersTable.string('avatar_url', 1000);
        usersTable.string('name');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
