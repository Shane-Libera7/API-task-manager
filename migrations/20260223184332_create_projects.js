/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('projects', function(table) {
        table.increments('id')
        table.integer('user_id').unsigned().notNullable()
        table.foreign('user_id').references('users.id')
        table.string('name').notNullable()
        table.timestamps(true, true)
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
