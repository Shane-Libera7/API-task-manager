/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
        table.increments('id')
        table.integer('project_id').unsigned().notNullable()
        table.foreign('project_id').references('projects.id')
        table.string('title').notNullable()
        table.string('description')
        table.enu('priority', ['low', 'medium', 'high'])
        table.date('due_date')
        table.boolean('completed').defaultTo(false)
        table.timestamps(true, true)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
