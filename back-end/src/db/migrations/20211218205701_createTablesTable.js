exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.string("table_name");
    table.integer("capacity").unsigned();
    table.integer("reservation_id").unsigned().defaultTo(null);
  
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations");
    table.timestamps(true, true);
  });t
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};