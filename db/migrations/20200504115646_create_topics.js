
exports.up = function(knex) {
  return knex.schema.createTable('topics', (topicsTable) => {
      console.log('creating topics table');
      topicsTable.string('slug').primary();
      topicsTable.string('description');
  });
};

exports.down = function(knex) {
    console.log('dropping topics table');
  return knex.schema.dropTable('topics');
};

