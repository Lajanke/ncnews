
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

/*
slug field which is a unique string that acts as the table's primary key
description field which is a string giving a brief description of a given topic
*/