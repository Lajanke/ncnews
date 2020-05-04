
exports.up = function(knex) {
    return knex.schema.createTable('users', (usersTable) => {
        console.log('creating users table');
        usersTable.string('username').primary().notNullable().unique();
        usersTable.string('avatar_url', 1000);
        usersTable.string('name');
    });
};

exports.down = function(knex) {
    console.log('dropping users table');
    return knex.schema.dropTable('users');
};
